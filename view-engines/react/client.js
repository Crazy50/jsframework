'use strict';

var React = require('react');
var ReactDOM = require('react-dom');

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
    },

    React: React,
    Utils: require('./utils/')
  };

  return Core;
};
