'use strict';

var Deku = require('deku');
var h = Deku.h;

function createClickLink(href) {
  return function clickLink(event) {
    event.preventDefault();
    console.log(href);
    Core.client.history.push(href);
  }
}

var Link = {
  render: function render(ctx) {
    return (
      h('a', {
        onClick: createClickLink(ctx.props.href),
        href: ctx.props.href
      }, ctx.children)
    );
  }
};

module.exports = Link;
