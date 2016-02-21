'use strict';

var Bluebird = require('bluebird');
var Core = global.Core;

var Validator = require('../../../core/validator')

function createClientWrapper(initialHandler, options) {
  var paramValidator = Validator({
    params: options.params,
    strict: false
  });

  return function wrappedClient(data) {
    // check param types and validators
    var validationErrors = paramValidator(data);
    if (validationErrors) {
      // TODO: somehow call up the error page
      console.log(validationErrors);
      return;
    }

    var action = initialHandler(data);

    // possible there's no need, the stores being auto-populated may be enough
    if (options.client.handler) {
      action.then(function(results) {
        return options.client.handler(results);
      });
    }
    // still catch errors even if not a then
    action.catch(function(error) {
      // TODO: better error handler
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
  var handler = null;

  if (options.client) {
    if (options.handler) {
      console.log('adding rpc call');
      var method = options.server.method || 'post';
      var url = options.server.url || '/api/' + name;

      handler = createClientWrapper(Core.rest.createCaller(method, url), options);
      handler.server = {
        method: method,
        url: url
      };
      // TODO: get the rpc working one day
      // return createClientWrapper(Core.rpc.createCaller({name: name, params: options.params}), options);
    } else if (options.client.rest) {
      console.log('adding restful call');
      // a rest call to some URL
      handler = createClientWrapper(
        Core.rest.createCaller(options.client.rest.method, options.client.rest.url),
        options
      );
      handler.server = {
        method: options.client.rest.method,
        url: options.client.rest.url
      };
    } else {
      console.log('adding just a resolve');
      // not making any external call, just doing something internally
      handler = createClientWrapper(Bluebird.resolve, options);
    }
  }

  // only way we get to this return is on the client side, but this function isn't client-able
  // throw new Exception('Method not allowed');
  return handler
};

module.exports = Method;
