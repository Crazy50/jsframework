'use strict';

module.exports = function createHandlerWrapper(handler, options) {
  var wrapper = function serverMethodHandler(request, response) {
    var action = handler(request.params);

    if (options.client.handler) {
      action.then(function(results) {
        return options.client.handler(results);
      });
    }
    // still catch errors even if not a then
    action.catch(function(error) {
      // TODO: better error handler
    });
  }
};
