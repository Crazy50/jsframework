(function(root, factory) {
  if (typeof define === "function" && define.amd) {
    define(['./RouteNode'], factory);
  } else if (typeof exports === "object") {
    module.exports = factory(require('./routenode'));
  }
}(this, function(RouteNode) {
  'use strict'

  // must create the initial root node. does help when '/' isn't the first declared route
  var rootNode = new RouteNode('/');

  // never pass a dynamic part to this. only static parts
  function findNodeForAdd(startNode, path) {
    var result = {
      node: null,
      lastIndex: -1,
      isPartialMatch: false
    };

    var strLength = path.length;
    var rootLength = startNode.str ? startNode.str.length : 0;

    if (strLength === rootLength && path === startNode.str) {
      result.node = startNode;
      return result;
    }

    var i = rootLength;
    var nexti = 0;

    var curNode = startNode;
    var lastNode = null;
    var matchStr = null;

    while (curNode && i < strLength) {
      lastNode = curNode;
      curNode = curNode.binarySearch(path.charCodeAt(i));

      if (!curNode) {
        result.node = lastNode;
        result.lastIndex = i;
        break;
      }

      matchStr = curNode.str;
      nexti = i + matchStr.length;

      // make sure the remaining path is long enough to match, then verify the match
      if (nexti > strLength || matchStr !== path.substring(i, nexti)) {
        result.node = curNode;
        result.lastIndex = i;
        result.isPartialMatch = true;
        break;
      }

      i = nexti;

      if (i < strLength) {
        if (!curNode.childrenCount) {
          result.node = curNode;
          result.lastIndex = i;
          break;
        }
      } else {
        result.node = curNode;
        break;
      }
    }

    return result;
  }

  function addNodes(startNode, path, options) {
    if (!startNode && !rootNode) {
      var newNode = new RouteNode(path, null);
      rootNode = newNode;

      return rootNode;
    }

    // get the parent node (or a node to split)
    var result = findNodeForAdd(startNode, path);
    var newNode = null;

    if (!result.node) {
      // theoretically, this isn't possible if canBePartial is 1. we will at least get the root
      // don't really want a panic though
      // TODO: throw me
      return null;
    }

    if (result.lastIndex !== -1 && result.lastIndex < path.length) {
      // there be splittin that needs to happen
      if (result.isPartialMatch) {
        // has remaining and partial means either node.str is longer OR two strings start with some base string

        var i1, i2;
        for (i1 = result.lastIndex, i2 = 0; path[i1] === result.node.str[i2] && i1 < path.length; i1++, i2++) {}

        // it's possible i1 could be at the end of path
        // i2 cannot be at the end of result.node.str
        // or i1 and i2 could just be in the middle of both strings

        /*
          we start by creating a new node to hold the remainder of result.node.str
          move the children array, handlers, etc over.

          modify the original node to contain only the shared, base string,
          start with fresh children array, no handlers, etc.
          add the new node as the first child.

          finally, if there's any i1 remaining, create a new node for it.
          else, just add the handler to the now-modified "original" node.
        */

        result.node.splitNode(i2);

        if (i1 === path.length) {
          newNode = result.node;
        } else {
          newNode = new RouteNode(path.slice(i1), null);
          result.node.insertChild(newNode);
        }
      } else {
        newNode = new RouteNode(path.slice(result.lastIndex), null);
        result.node.insertChild(newNode);
      }
    } else {
      return result.node;
    }

    return newNode;
  }

  function addPath(methods, path, handler, options) {
    var lastIndex = 0;
    var dynIndex = 0;
    var endDynIndex = 0;
    var params = [];
    var node = rootNode;

    while ((lastIndex = endDynIndex) < path.length && (dynIndex = path.indexOf('{', lastIndex)) !== -1) {
      if (path.lastIndexOf('/', dynIndex-1) < path.lastIndexOf('{', dynIndex-1)) {
        // TODO: error
        return false;
      }

      // TODO: improve finding the end of the regex. maybe need a regex to properly handle ((())) moments
      // need to check for regex and where it ends to properly know the end brace in case the regex uses braces
      var regexSepIndex = path.indexOf('(', dynIndex + 1);
      var regexEndIndex = regexSepIndex === -1 ? -1 : path.indexOf(')', regexSepIndex);
      if (regexSepIndex !== -1 && regexEndIndex === -1) {
        // TODO: error
        return false;
      }

      endDynIndex = path.indexOf('}', regexEndIndex === -1 ? dynIndex : regexEndIndex) + 1;
      if (endDynIndex === 0 || !(endDynIndex === path.length || path[endDynIndex] === '/')) {
        // TODO: error
        return false;
      }

      // process the nodes leading to the DynNode
      node = addNodes(node, path.slice(lastIndex, dynIndex), options);
      if (!node) {
        // TODO: error
        return false;
      }

      // push the param name to an array
      var paramName = null;
      var regex = null;

      if (regexSepIndex !== -1 && regexEndIndex !== -1) {
        paramName = path.slice(dynIndex + 1, regexSepIndex);
        regex = new RegExp(path.slice(regexSepIndex + 1, regexEndIndex));
      } else {
        paramName = path.slice(dynIndex + 1, endDynIndex - 1);
      }
      // TODO: validate paramname is legit
      params.push(paramName);

      node = node.insertDynamicNode(regex);
    }

    // if there's remaining (also if there was no dyn at all), process the rest
    if (lastIndex < path.length) {
      node = addNodes(node, path.slice(lastIndex), options);
    }

    if (!node) {
      // TODO: error
      return false;
    }

    // add handler to very last node and set params if they exists
    node.setParams(params);
    node.addHandler(methods, handler);

    return true;
  }

  //var retRootNode = {node: rootNode, vars: []};
  var retRootNode = {params: [], paramsArray: [], route: rootNode};
  function matchPathToNode(method, path) {
    var strLength = path.length;

    if (path === '/') {
      return retRootNode;
    }

    var i = 1;
    var nexti = 0;

    var curNode = rootNode;
    var lastNode = null;
    var matchStr = null;
    var dynStack = [];
    var dynStackLength = 0;
    // dynVars: {i: int, data: string}
    var dynVars = [];

    while (curNode && i < strLength) {
      /*
        if curNode has dyn, push to dynStack
        do a children count check.
        if no children, do a dyn-attempt
        if has children, do search on children
        if no match, do dyn-attempt
      */
      dynStackLength = dynStack.length;
      if (curNode.dynamicPath.length && (dynStackLength === 0 || dynStack[dynStackLength-1].node !== curNode)) {
        dynStack.push({i: i, node: curNode, j: 0});
        dynStackLength++;
      }

      var needDynCheck = false;
      if (!curNode.childrenCount) {
        needDynCheck = true;
      } else {
        curNode = curNode.binarySearch(path.charCodeAt(i));

        if (!curNode) {
          needDynCheck = true;
        } else {
          matchStr = curNode.str;
          nexti = i + matchStr.length;

          // make sure the remaining path is long enough to match, then verify the match
          if (nexti > strLength || matchStr !== path.slice(i, nexti)) {
            needDynCheck = true;
          } else {
            // always possible we reached a valid node, yet it has no handler for the method
            if (nexti === strLength && !curNode.handlers[method]) {
              needDynCheck = true;
            } else {
              i = nexti;
            }
          }
        }
      }

      if (needDynCheck) {
        // prevents a potential infinite loop
        curNode = null;
        while (dynStackLength--) {
          var dyninfo = dynStack.pop();

          var dynnode = dyninfo.node;
          var slashPathIndex = path.indexOf('/', dyninfo.i);
          var nextPathPart = slashPathIndex === -1 ? path.slice(dyninfo.i) : path.slice(dyninfo.i, slashPathIndex);

          // check if a dyn matches
          for (var j = dyninfo.j, dyncount = dynnode.dynamicPath.length; j < dyncount; j++) {
            var dyn = dynnode.dynamicPath[j];

            if (!dyn.regex || dyn.regex.test(nextPathPart)) {
              nexti = dyninfo.i + nextPathPart.length;
              if (nexti === strLength && !dyn.handlers[method]) {
                // skip it, shouldn't try to end on one without a handler if at all possible
                continue;
              }

              dynVars.push({i: i, data: nextPathPart});
              curNode = dyn;
              i = nexti;

              // might need to process the other dynnodes
              if (++j < dyncount) {
                dyninfo.j = j;
                dynStack.push(dyninfo);
                // no worries about adding 1 to length, it's re-computed at the top of loop
              }

              break;
            }
          }
          if (curNode) {
            break;
          }
          for (var dynvarLength = dynVars.length; dynvarLength--;) {
            if (i < dynVars[i].i) {
              dynVars.pop();
            } else {
              break;
            }
          }
          // may have to loop and try other dyn nodes
        }

        if (curNode) {
          continue;
        } else {
          return null;
        }
      }
    }

    if (i !== strLength) {
      return null;
    }

    //var reqparams = {};
    if (!dynVars.length && curNode.cachedReturn) {
      return curNode.cachedReturn;
    } else {
      if (dynVars.length !== curNode.params.length) {
        // TODO: error that should never happen
        return null;
      }

      for (var dv = dynVars.length; dv--;) {
        // reqparams[curNode.params[dv]] = dynVars[dv].data;
        dynVars[dv] = dynVars[dv].data;
      }
    }

    return {params: curNode.params, paramsArray: dynVars, route: curNode};
    // return i === strLength ? {node: curNode, vars: dynVars} : null;
  }


  // only used for debuging help
  function printNode(node) {
    console.log(JSON.stringify(node, null, 2));
  }

  // public interface
  var TrieRouter = {
    // config now similar to Hapi
    add: function(config) {
      if (!config.methods) {
        // TODO: error
        console.log('methods does not exist');
        return false;
      }
      if (!config.path || !(typeof(config.path) === 'string')) {
        // TODO: error
        console.log('path does not exist or is not a string', config.path);
        return false;
      }
      if (!config.handler || !(config.handler instanceof Function)) {
        // TODO: error
        console.log('handler does not exist or is not a function');
        return false;
      }

      var methods = config.methods;
      if (!(methods instanceof Array)) {
        if (typeof(config.path) === 'string') {
          methods = [methods];
        } else {
          // TODO: error
          console.log('methods must be either an array or a string');
          return false;
        }
      }

      // TODO: figure out the pre/post and generate a single fn to send
      addPath(methods, config.path, config.handler, config.options);
    },

    handle: matchPathToNode,// function(path, method) {
      // var method = request.method;//.toLowerCase();
      // var path = request.url;

      // var matchInfo = matchPathToNode(path, method);

      // if (!matchInfo || !matchInfo.node) {
      //   // TODO: 404
      //   console.log('nothing found, 404');
      //   return;
      // }
      // var route = matchInfo.route;


      // if (!Object.keys(node.handlers).length) {
      //   // TODO: 404
      //   console.log('path has no handlers, 404');
      //   return;
      // }

      // var handler = route.handlers[method];

      // if (!handler) {
      //   // TODO: check sec rules to see if we return 405 or 404/403
      //   console.log('405 method not allowed');
      //   return;
      // }

      // TODO: check sec rules to make sure this is ok
      // request.params = matchInfo.vars;
      //handler(request, result);
    // },

    print: function() {
      printNode(rootNode);
    }
  };

  return TrieRouter;
}));
