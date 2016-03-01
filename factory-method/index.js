'use strict';

var createApiCaller = require('../api-caller');

// TODO: refactor to be more compositional
function createHandlerWrapper(caller, options) {
  var transform = options.outputTransform || JSON.stringify;

  // TODO: this doesn't work for direct calling though
  return function wrappedHandler(request, response) {
    // check ACL
    // check param types and validators
    // var validationErrors = paramValidator(request.params);
    // if (validationErrors) {
    //   // TODO: better error pages
    //   response.status(400).send(validationErrors);
    //   return;
    // }

    // call the handler
    caller(request, response)
      .then(function(result) {
        // TODO: how to handle responding for this...
        if (request.isFullRequest && options.server.redirectPost) {
          // TODO: what should default be? or maybe force something to exist?
          var redirectTo = options.server.redirectPost || '/';
          if (redirectTo instanceof Function) {
            redirectTo = redirectTo(results);
          }

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

  // if server, set up the routes and/or RPC calls
  // core.server only exists on the server side
  var caller = createApiCaller(options);

  var handler = createHandlerWrapper(caller, options);
  handler.server = options.server;

  // TODO:
  // var paramValidator = Validator({
  //   params: options.params,
  //   strict: false
  // });


  if (options.server) {
    // assume Methods come over post if not specified
    var methods = options.server.method || 'post';
    var url = options.server.url || '/api/' + name;

    // TODO: along with refactor, clean it up
    Core.router.add({
      methods: methods,
      path: url,
      handler: handler
    });
  }

  if (options.client) {
    // Core.rpc.addCall({
    //   name: name,
    //   params: options.params,
    //   handler: handler
    // });
  }

  return handler;
};

module.exports = Method;
