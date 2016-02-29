'use strict';

var Deku = require('deku');

module.exports.makeRenderer = function makeRenderer(renderable) {
  return function renderToString(props) {
    return Deku.string.render(Deku.element(renderable, props));
  }
};

module.exports.Deku = Deku;
module.exports.Utils = require('./utils/');
