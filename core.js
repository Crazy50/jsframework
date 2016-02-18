'use strict';

var optionalAll = require('./utils/optional-all');

// TODO: how to configure the server options?
// probably going to have a CoreConfig system to load configs
// and in that, be able to configure

var Server = require('./core/server');
var TrieRouter = require('./router/router');

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
  optionalAll(cwd + '/dbtables');
  optionalAll(cwd + '/queries');
  optionalAll(cwd + '/methods');
  optionalAll(cwd + '/view-models');

  return Core;
};

Core.router = new TrieRouter();
Core.server = Server;
Server.router = Core.router;

global.Core = Core;
module.exports = Core;
