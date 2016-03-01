const {Deku, Utils} = Core.viewEngine;
import callMeMaybe from '../methods/call-maybe';

const h = Deku.h;
const Link = Utils.Link;
const Form = Utils.Form;

let Hello = {
  render: ({ props, children, dispatch }) => {
    return (
      h('div', {},
        h('h1', {}, 'Hello ' + props.world + ' because classic FooBarr stuff'),
        h('ul', {},
          h('li', {}, h(Link, {href: '/world/Matt'}, 'Hello Matt')),
          h('li', {}, h(Link, {href: '/world/World'}, 'Hello World'))
        ),

        h(Form, {method: callMeMaybe},
          h('input', {type: 'text', name: 'test'}),
          h('input', {type: 'submit', value: 'Try Test'})
        )
      )
    );
  }
};

module.exports = Hello;
