'use strict';

// TODO: how to configure the server options?
// probably going to have a CoreConfig system to load configs
// and in that, be able to configure

var Server = require('./core/server');

var Core = {
  server: Server
};

var Core = function() {
  // global.Query = require('../factories/query');
  // global.Table = require('./factories/table');
  global.Method = require('./factories/method');
  global.ViewModel = require('./factories/view-model');

  // TODO: is this really the best way??
  // also, require-all fails if the directory doesnt exist
  var cwd = process.cwd();
  // require('require-all')(cwd + '/dbtables');
  // require('require-all')(cwd + '/queries');
  // require('require-all')(cwd + '/methods');
  require('require-all')(cwd + '/view-models');

  return Core;
};

Core.server = Server;

module.exports = Core;
