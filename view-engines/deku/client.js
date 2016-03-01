'use strict';

var Deku = require('deku');
var render = Deku.createApp(document.getElementById('bodymount'));

module.exports = function reactViewEngine(Core) {
  // TODO: would be good to allow multiple view engines, but need Config first
  if (Core.viewEngine) {
    return Core;
  }

  Core.viewEngine = {
    makeRenderer: function makeRenderer(renderable) {
      return function renderToDocument(props) {
        return render(Deku.element(renderable, props));
      };
    },

    Deku: Deku,
    Utils: require('./utils/')
  };

  return Core;
};
