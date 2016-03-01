'use strict';

var optionalAll = require('optional-all');

module.exports = function(Core) {
  global.Method = Core.Factories.Method;

  optionalAll('methods');
  return Core;
}
