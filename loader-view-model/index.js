'use strict';

var optionalAll = require('optional-all');

module.exports = function(Core) {
  global.ViewModel = Core.Factories.ViewModel;

  optionalAll('view-models');
  return Core;
}
