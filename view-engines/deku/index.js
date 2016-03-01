'use strict';

var Deku = require('deku');

module.exports = function reactViewEngine(Core) {
  // TODO: would be good to allow multiple view engines, but need Config first
  if (Core.viewEngine) {
    return Core;
  }

  Core.viewEngine = {
    makeRenderer: function makeRenderer(renderable) {
      return function renderToString(props) {
        return Deku.string.render(Deku.element(renderable, props));
      };
    },

    Deku: Deku,
    Utils: require('./utils/')
  };

  return Core;
};
