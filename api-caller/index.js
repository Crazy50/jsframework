'use strict';

// just a util, not a Module
module.exports = function createApiCaller(options) {
  var handler = options.handler;

  if (!handler) {
    return function() {
      return Promise.resolve();
    }
  }

  return function(data) {
    return handler(data);
  };
};
