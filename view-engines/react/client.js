'use strict';

var React = require('react');
var ReactDOM = require('react-dom/server');

module.exports = function reactViewEngine(Core) {
  // TODO: would be good to allow multiple view engines, but need Config first
  if (Core.viewEngine) {
    return Core;
  }

  Core.viewEngine = {
    makeRenderer: function makeRenderer(renderable) {
      var View = React.createFactory(renderable);

      return function renderToDocument(props) {
        ReactDOM.render(
          View(props),
          document.getElementById('bodymount')
        );
      };
    }
  };

  return Core;
};

module.exports.React = React;
module.exports.Utils = require('./utils/');
