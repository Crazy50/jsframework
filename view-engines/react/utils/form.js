'use strict';

var React = require('react');
var ReactDOM = require('react-dom');

function serialize(form) {
    if (!(typeof form == 'object' && form.nodeName == "FORM")) {
      return null;
    }

    var values = {};
    var len = form.elements.length;
    var i, j;

    for (i=0; i<len; i++) {
      var field = form.elements[i];
      if (!(field.name && !field.disabled && field.type != 'file' && field.type != 'reset' && field.type != 'submit' && field.type != 'button')) {
        continue;
      }

      if (field.type == 'select-multiple') {
        values[field.name] = [];
        for (j=form.elements[i].options.length; j--;) {
          if(field.options[j].selected) {
            values[field.name].push(field.options[j].value);
          }
        }
      } else if ((field.type != 'checkbox' && field.type != 'radio') || field.checked) {
        values[field.name] = field.value;
      }
    }

    return values;
}

var Form = React.createClass({
  displayName: "Form",

  submitForm: function(event) {
    event.preventDefault();

    var formnode = ReactDOM.findDOMNode(this);
    var data = serialize(formnode);

    this.props.method(data);
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
