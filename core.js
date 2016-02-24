'use strict';

var optionalAll = require('./utils/optional-all');

// TODO: how to configure the server options?
// probably going to have a CoreConfig system to load configs
// and in that, be able to configure

var Server = require('./core/server');
var TrieRouter = require('./router/router');

var Core = function() {
  Core.BaseStore = require('./core/base-store');

  global.Type = require('./core/factories/type');
  global.Store = require('./core/factories/store');
  global.Query = require('./core/factories/query');
  global.Method = require('./core/factories/method');
  global.ViewModel = require('./core/factories/view-model');

  // TODO: is this really the best way??
  // also, require-all fails if the directory doesnt exist
  var cwd = process.cwd();
  optionalAll(cwd + '/types');
  optionalAll(cwd + '/stores');
  optionalAll(cwd + '/queries');
  optionalAll(cwd + '/methods');
  optionalAll(cwd + '/view-models');

  return Core;
};

Core.stores = [];
Core.router = new TrieRouter();
Core.server = Server();
Core.components = require('./components/');
Core.serializeStores = function() {
  var alldata = {};
  for (var p in Core.stores) {
    var store = Core.stores[p];
    alldata[store.name] = store.data;
  }
  return alldata;
};

global.Core = Core;
module.exports = Core;
