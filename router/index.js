'use strict';

var TrieRouter = require('./router/router');

module.exports = function(Core) {
  if (Core.router) {
    return Core;
  }

  Core.router = new TrieRouter();

  return Core;
};
