'use strict';

var optionalAll = require('../optional-all/');

module.exports = function(Core) {
  optionalAll('methods');
  return Core;
}
