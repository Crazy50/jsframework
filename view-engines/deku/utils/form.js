'use strict';

var Deku = require('deku');
var h = Deku.h;

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

function createFormSubmitter(method) {
  return function submitForm(event) {
    event.preventDefault();

    var formnode = event.target;
    var data = serialize(formnode);

    method(data);
  }
}

var Form = {
  render: function render(ctx) {
    return (
      h('form', {
        onSubmit: createFormSubmitter(ctx.props.method),
        method: ctx.props.method.server.method,
        action: ctx.props.method.server.url
      }, ctx.children)
    );
  }
};

module.exports = Form;
