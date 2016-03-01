'use strict';

function createHandlerWrapper(handler, options) {
  var wrapper = function serverMethodHandler(params) {
    var action = handler(params);

    if (options.client.handler) {
      action.then(function(results) {
        return options.client.handler(results);
      });
    }
    // still catch errors even if not a then
    action.catch(function(error) {
      // TODO: better error handler
    });

    return action;
  };

  return wrapper;
}

var shared = require('./shared');
module.exports = shared(createHandlerWrapper);
