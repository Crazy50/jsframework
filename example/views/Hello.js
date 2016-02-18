'use strict';

var React = require('react');

var Hello = React.createClass({
  displayName: "Hello",

  render: function () {
    return (
      React.createElement("div", null,
        React.createElement("h1", null, "Hello " + this.props.world + " because classic FooBar stuff"),
        React.createElement("ul", null, React.createElement("li", null, "One item"), React.createElement("li", null, "Another item")),

        React.createElement("form", {action: '/test', method: 'post'},
          React.createElement("input", {type: 'text', name: 'test'}),
          React.createElement("input", {type: 'submit', value: 'Try Test'})
        )
      )
    );
  }
});

module.exports = Hello;
