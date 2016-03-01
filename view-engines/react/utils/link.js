'use strict';

var React = require('react');

var Link = React.createClass({
  displayName: "Link",

  clickLink: function(event) {
    event.preventDefault();
    Core.Client.history.push(this.props.href);
  },

  render: function() {
    // TODO: active, more props
    return (
      React.createElement("a", {
        onClick: this.clickLink,
        href: this.props.href
      }, this.props.children)
    );
  }
});

module.exports = Link;
