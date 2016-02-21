'use strict';

var React = require('react');

var Form = React.createClass({
  displayName: "Form",

  submitForm: function(event) {
    event.preventDefault();

    // TODO: not a good way to get the values from a form
    //this.props.method();
  },

  render: function() {
    return (
      // TODO: user passes in Method, not form attributes
      React.createElement("form", {
        onSubmit: this.submitForm,
        method: this.props.method.server.method,
        action: this.props.method.server.url
      }, this.props.children)
    );
  }
});

module.exports = Form;
