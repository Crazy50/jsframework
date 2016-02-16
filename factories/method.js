'use strict';

var Bluebird = require('bluebird');
var core = require('../core');

// const Remove = Method({
//   params: [
//     {
//       name: 'item',
//       type: Todo
//     }
//   ],
//
//   acl: {} // TODO: build the ACL
//
//   client: {
//     handler: function(promise) { promise.then(...).catch(...); },
//   },
//
//   server: {
//     method: 'post',
//     url: '/removetodo',
//     redirectPost: '/'
//   },
//   handler: function(params) {
//     return TodoTable.get(item.id).delete();
//   }
// });

// TODO: refactor to be more compositional
function createHandlerWrapper(options) {
  return function wrappedHandler() {
    // check ACL
    // check param types and validators
    // call the handler

    var promise = options.isAsync ? Bluebird.coroutine(options.handler) : options.handler;
    promise(this.params)
      .then(function(result) {
        if (this.isFullRequest && options.server.redirectPost) {
          this.redirect(options.server.redirectPost);
        } else {
          this.send(this.outputTransform(result));
        }
      })
      .catch(function(error) {
        // TODO: gotta make sure that options has the error handler set then
        options.errorHandler(error);
      });
  };
}

function createClientWrapper(initialHandler, options) {
  return function wrappedClient() {
    var action = initialHandler.apply(null, arguments);

    if (options.client.handler) {
      action.then(function(results) {
        return options.client.handler(results);
      });
    }
    action.catch(function(error) {
      options.errorHandler(error);
    });
  };
}

/*
  this will:
    - create wrapper to check ACL, check param types/validation
    - handle the Promises/generators
    - register a route if server is enabled
    - register the method with the RPC system
    - create or at least set up a way to build the client-side portion

*/
var Method = function(options) {
  var name = options.name;
  // if client, return a function that performs all the actions
  // core.client only exists on the client-side
  // core.rpc is on both sides, but is a different thing on either side
  if (core.client) {
    if (options.client) {
      if (options.handler) {
        return createClientWrapper(core.rpc.createrCaller({name: name, params: options.params}), options);
      }
      else if (options.client.rest) {
        // a rest call to some URL
        return createClientWrapper(core.rest.createrCaller(options.client.rest.url), options);
      }
      else {
        // not making any external call, just doing something internally
        return createClientWrapper(Bluebird.resolve, options);
      }
    }

    // only way we get to this return is on the client side, but this function isn't client-able
    throw new Exception('Method not allowed');
  }

  // if server, set up the routes and/or RPC calls
  // core.server only exists on the server side
  var handler = createHandlerWrapper(options);
  if (options.server) {
    // assume Methods come over post if not specified
    var method = options.server.method || 'post';
    var url = options.server.url || '/api/' + name;

    // TODO: along with refactor, clean it up
    core.server.addRoute({
      method: method,
      path: url,
      handler: handler
    });
  }

  if (options.client) {
    if (options.client) {
      core.rpc.addCall({
        name: name,
        params: options.params,
        handler: handler
      });
    }
  }
};

module.exports = Method;
