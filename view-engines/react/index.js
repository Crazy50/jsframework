'use strict';

var React = require('react');
var ReactDOM = require('react-dom/server');

module.exports.makeRenderer = function makeRenderer(renderable) {
  var View = React.createFactory(renderable);

  return function renderToString(props) {
    return ReactDOM.renderToString(View(props));
  }
};

module.exports.React = React;
module.exports.Utils = require('./utils/');
