(function(root, factory) {
  if (typeof define === "function" && define.amd) {
    define([], factory);
  } else if (typeof exports === "object") {
    module.exports = factory();
  }
}(this, function() {
  'use strict'

  // Class node
  //  + chCode: integer (not set for dynamic nodes)
  //  + str: string (the path part. for dynamic nodes, this is null)
  //  + regex: regex (only set for dynamic nodes and may still be null)
  //  + children: [Node] (must be sorted for binary search)
  //  + dynamicNodes: [Node] (must be sorted where this.regex.toString().length is DESC; order of complexity)
  //  + handlers: {method: [fn(req, res, next?)]}
  function RouteNode(str, regex) {
    this.str = str;
    this.regex = regex;
    this.chCode = str ? str.charCodeAt(0) : -1;
    this.children = [];
    // this.children = {};
    this.childrenCount = 0;
    this.dynamicPath = [];
    this.params = null;
    this.handlers = {};
    this.cachedReturn = null;
  }

  RouteNode.prototype.setParams = function(params) {
    if (!params || !params.length) {
      this.params = null;
      this.cachedReturn = {params: [], paramsArray: [], route: this};
    } else {
      this.params = params;
    }
  };


  RouteNode.prototype.clearChildren = function() {
    this.children = [];

    // this.children = {};
    this.childrenCount = 0;
  };

  RouteNode.prototype.addHandler = function(methods, handler) {
    for (var i = methods.length; i--;) {
      var method = methods[i].toLowerCase();
      if (this.handlers[method]) {
        // TODO: they already have one! they may have done one something wrong
        console.log('already have one?');
        return;
      }

      this.handlers[method] = handler;
    }
  };

  RouteNode.prototype.insertChild = function(node) {
    var i = this.children.length;
    for (;i--;) {
      if (this.children[i].chCode < node.chCode) { break; }
    }
    this.children.splice(i+1, 0, node);
    // this.children[node.chCode] = node;

    this.childrenCount++;
  };

  RouteNode.prototype.insertDynamicNode = function(regex) {
    var i = 0;
    for (; i < this.dynamicPath.length; i++) {
      var dyn = this.dynamicPath[i];

      if ((dyn.regex === null && regex === null) || (dyn.regex !== null && regex !== null && dyn.regex.toString() === regex.toString())) {
        return dyn;
      }

      if (dyn.regex === null && regex !== null) {
        break;
      }

      if (dyn.regex !== null && regex !== null && dyn.regex.toString().length < regex.toString().length) {
        break;
      }
    }

    // add a new one if there's no match
    var newNode = new RouteNode(null, regex);
    this.dynamicPath.splice(i, 0, newNode);
    return newNode;
  };

  RouteNode.prototype.splitNode = function(splitLocation) {
    var i2Node = new RouteNode(this.str.slice(splitLocation), null);
    i2Node.children = this.children;
    i2Node.handlers = this.handlers;

    this.str = result.node.str.slice(0, splitLocation);
    this.clearChildren();
    this.insertChild(i2Node);
    this.handlers = {};
  };

  // chCode must also be obtained through chatCodeAt to be an int
  RouteNode.prototype.binarySearch = function(ch) {
    // return this.children[ch];

    var children = this.children;
    var lb = 0;
    var ub = children.length - 1;
    var mid = 0;
    var node = null;
    var d = 0;
    var diff = 0;

    while (true) {
      d = ub - lb;
      if (d < 0) {
        break;
      }
      mid = (d >> 1) + lb;
      node = children[mid];
      diff = node.chCode - ch;

      if (diff === 0) {
        return node;
      } else if (diff < 0) {
        lb = mid + 1;
      } else {
        ub = mid - 1;
      }
    }

    return null;
  };

  return RouteNode;
}));
