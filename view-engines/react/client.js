'use strict';

var React = require('react');
var ReactDOM = require('react-dom');

module.exports.makeRenderer = function makeRenderer(renderable) {
  var View = React.createFactory(renderable);

  return function renderToDocument(props) {
    ReactDOM.render(
      View(props),
      document.getElementById('bodymount')
    );
  }
};

module.exports.React = React;
module.exports.Utils = require('./utils/');
