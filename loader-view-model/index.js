'use strict';

var optionalAll = require('../optional-all/');

module.exports = function(Core) {
  optionalAll('view-models');
  return Core;
}
