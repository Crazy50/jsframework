'use strict';

var Deku = require('deku');
var render = Deku.createApp(document.getElementById('bodymount'));

module.exports.makeRenderer = function makeRenderer(renderable) {
  return function renderToDocument(props) {
    return render(Deku.element(renderable, props));
  }
};

module.exports.Deku = Deku;
module.exports.Utils = require('./utils/');
