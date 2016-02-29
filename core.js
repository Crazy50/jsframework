'use strict';

var optionalAll = require('./utils/optional-all');

// TODO: how to configure the server options?
// probably going to have a CoreConfig system to load configs
// and in that, be able to configure

var Server = require('./core/server');
var TrieRouter = require('./router/router');

var Core = function() {
  //Core.BaseStore = require('./core/base-store');

  global.Type = require('./core/factories/type');
  global.Method = require('./core/factories/method');
  global.ViewModel = require('./core/factories/view-model');

  // TODO: is this really the best way??
  // also, require-all fails if the directory doesnt exist
  var cwd = process.cwd();
  optionalAll(cwd + '/types');
  optionalAll(cwd + '/methods');
  optionalAll(cwd + '/view-models');

  return Core;
};

Core.viewEngine = require('./view-engines/react/');
Core.router = new TrieRouter();
Core.server = Server();

global.Core = Core;
module.exports = Core;
