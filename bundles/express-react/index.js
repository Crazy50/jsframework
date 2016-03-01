'use strict';

var makeCore = require('lagann-core');
var router = require('lagann-router');
var client = require('lagann-client');
var server = require('lagann-server');
var reactViewEngine = require('lagann-viewengine-react');
var method = require('lagann-factory-method');
var viewModel = require('lagann-factory-view-model');
// var methodLoader = require('lagann-loader-method');
// var viewModelLoader = require('lagann-loader-view-model');

// var makeCore = require('../../core/');
// var router = require('../../router/');
// var client = require('../../client/');
// var server = require('../../server/');
// var reactViewEngine = require('../../view-engines/react/');
// var method = require('../../factory-method/');
// var viewModel = require('../../factory-view-model/');
// var methodLoader = require('../../loader-method/');
// var viewModelLoader = require('../../loader-view-model/');

module.exports = function(Core) {
  Core = makeCore(Core);
  Core = router(Core);
  Core = client(Core);
  Core = server(Core);
  Core = reactViewEngine(Core);

  Core = method(Core);
  Core = viewModel(Core);

  // Core = methodLoader(Core);
  // Core = viewModelLoader(Core);

  // alternatively:
  // return viewModel(method(reactViewEngine(server(client(router(makeCore()))))));

  return Core;
};
