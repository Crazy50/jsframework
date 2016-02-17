'use strict';

var Server = require('./core/server');
// var RpcServer = require('./core/rpc-server');

// TODO: how to configure the server options?

module.exports = {
  server: new Server()
  // rpc: new RpcServer()
};
