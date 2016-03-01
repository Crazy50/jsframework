'use strict';

var createApiCaller = require('lagann-api-caller');

module.exports = function MethodFactoryFactory(createHandlerWrapper) {
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
    var caller = createApiCaller({
      method: options.server.method,
      url: options.server.url,
      handler: options.handler
    });

    // TODO:
    // var paramValidator = Validator({
    //   params: options.params,
    //   strict: false
    // });

    var handler = createHandlerWrapper(caller, options);
    // TODO: so unsure about this, but it's for Forms to have the correct info during non-JS instances
    handler.server = options.server;
    return handler;
  };

  return function(Core) {
    if (Core.Factories) {
      if (Core.Factories.Method) {
        return Core;
      }
    } else {
      Core.Factories = {};
    }

    Core.Factories.Method = Method;

    return Core;
  };
};
