'use strict';

var Bluebird = require('bluebird');
var Core = global.Core;

var Validator = require('../validator')

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
//   handler: function() {
//     return TodoTable.get(this.params.item.id).delete();
//   }
// });

function plainRedirect(redirecto) {
  return function() {
    return redirecto;
  }
}

// TODO: refactor to be more compositional
function createHandlerWrapper(options) {
  var handler = options.isAsync ? Bluebird.coroutine(options.handler) : options.handler;
  var transform = options.outputTransform || JSON.stringify;

  var redirecter = options.server.redirectPost;
  if (!(redirecter instanceof Function)) {
    redirecter = plainRedirect(redirecter);
  }

  var paramValidator = Validator({
    params: options.params,
    strict: false
  });

  return function wrappedHandler(request, response) {
    // check ACL
    // check param types and validators
    var validationErrors = paramValidator(request.params);
    if (validationErrors) {
      // TODO: better error pages
      response.status(400).send(validationErrors);
      return;
    }

    // call the handler
    handler.bind(request)()
      .then(function(result) {
        if (request.isFullRequest && options.server.redirectPost) {
          // TODO: what should default be? or maybe force something to exist?
          var redirectTo = redirecter.bind(request)(result) || '/';
          response.redirect(redirectTo);
        } else {
          response.send(result !== undefined ? transform(result) : {});
        }
      })
      .catch(function(error) {
        // TODO: custom error handlers
        next(error);
      });
  };
}

function createClientWrapper(initialHandler, options) {
  var paramValidator = Validator({
    params: options.params,
    strict: false
  });

  return function wrappedClient() {
    // check param types and validators
    var validationErrors = paramValidator(request.params);
    if (validationErrors) {
      // TODO: somehow call up the error page
      return;
    }

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
  if (Core.client) {
    if (options.client) {
      if (options.handler) {
        return createClientWrapper(Core.rpc.createrCaller({name: name, params: options.params}), options);
      }
      else if (options.client.rest) {
        // a rest call to some URL
        return createClientWrapper(Core.rest.createrCaller(options.client.rest.url), options);
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
    var methods = options.server.methods || 'post';
    var url = options.server.url || '/api/' + name;

    // TODO: along with refactor, clean it up
    Core.router.add({
      methods: methods,
      path: url,
      handler: handler
    });
  }

  if (options.client) {
    if (options.client) {
      Core.rpc.addCall({
        name: name,
        params: options.params,
        handler: handler
      });
    }
  }
};

module.exports = Method;
