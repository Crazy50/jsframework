'use strict';

function createHandlerWrapper(handler, options) {
  var transform = options.outputTransform || JSON.stringify;

  var wrapper = function serverMethodHandler(request, response) {
    handler(request.params)
      .then(function(result) {
        var redirectTo = options.server.redirectPost || '/';
        if (redirectTo instanceof Function) {
          redirectTo = redirectTo(result);
        }

        response.postRespond({
          redirectTo: redirectTo,
          result: result
        });
      });
  }

  // TODO: currently must have server defined to make client work
  if (options.server) {
    // assume Methods come over post if not specified
    var methods = options.server.method || 'post';
    var url = options.server.url || '/api/' + name;

    // TODO: along with refactor, clean it up
    Core.router.add({
      methods: methods,
      path: url,
      handler: wrapper
    });
  }

  return handler;
}

var shared = require('./shared');
module.exports = shared(createHandlerWrapper);
