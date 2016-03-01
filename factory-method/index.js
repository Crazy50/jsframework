'use strict';

var createApiCaller = require('../api-caller');
var createHandlerWrapper = require('./handler-wrapper');

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
  // TODO: so unsure about this, but it's for Forms to have the correct info during non-JS instances
  caller.server = options.server;

  var handler = createHandlerWrapper(caller, options);

  // TODO:
  // var paramValidator = Validator({
  //   params: options.params,
  //   strict: false
  // });

  return caller;
};

module.exports = Method;
