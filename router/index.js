'use strict';

var TrieRouter = require('./router');

module.exports = function() {
  if (Core.router) {
    return;
  }

  Core.router = new TrieRouter();
};
