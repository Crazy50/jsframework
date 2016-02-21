'use strict';

var React = require('react');

var callMeMaybe = require('../methods/call-maybe');

var Link = React.createFactory(Core.components.Link);
var Form = React.createFactory(Core.components.Form);

var Hello = React.createClass({
  displayName: "Hello",

  render: function () {
    return (
      React.createElement("div", null,
        React.createElement("h1", null, "Hello " + this.props.world + " because classic FooBar stuff"),
        React.createElement("ul", null,
          React.createElement("li", null, Link({href: "/world/Matt"}, "Hello Matt")),
          React.createElement("li", null, Link({href: "/world/Yoli"}, "Hello Yoli"))
        ),

        Form({method: callMeMaybe},
          React.createElement("input", {type: 'text', name: 'test'}),
          React.createElement("input", {type: 'submit', value: 'Try Test'})
        )
      )
    );
  }
});

module.exports = Hello;
