'use strict';

var Bluebird = require('bluebird');
var server = require('../core/server');
var rpc = require('../core/rpc');

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
//     rpcname: true,
//     optimistic: function(item) {
//       // TODO: how to tell the internals to remove this?
//     }
//   },
//
//   server: {
//     method: 'post',
//     url: '/removetodo',
//     redirectPost: '/'
//   },
//   handler: function(item) {
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
    promise(this.params).then(function(result) {
      // TODO: JsFree... yeah...
      if (!this.wantsJsFree && options.server.redirectPost) {
        this.redirect(options.server.redirectPost);
      } else {
        this.send(result);
      }
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
  // if client, return something to just make the RPC call
  // TODO: how do we know we are client??

  // server portion
  var handler = createHandlerWrapper(options);
  if (options.server) {
    var method = options.server.method || 'get';
    var url = options.server.url || '/api/' + name;

    // TODO: along with refactor, clean it up
    server.addRoute({
      method: method,
      path: url,
      handler: handler
    });
  }

  servercore.addRoute()
};

module.exports = Method;
