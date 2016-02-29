const {h} = Core.viewEngine.Deku;
import callMeMaybe from '../methods/call-maybe';

const Link = Core.viewEngine.Utils.Link;
const Form = Core.viewEngine.Utils.Form;

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
