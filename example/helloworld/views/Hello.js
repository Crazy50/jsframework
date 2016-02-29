const React = Core.viewEngine.React;
import callMeMaybe from '../methods/call-maybe';

const Link = Core.viewEngine.Utils.Link;
const Form = Core.viewEngine.Utils.Form;

class Hello extends React.Component {

  render() {
    return (
      <div>
        <h1>Hello {this.props.world} because classic FooBarr stuff</h1>
        <ul>
          <li><Link href="/world/Matt">Hello Matt</Link></li>
          <li><Link href="/world/World">Hello World</Link></li>
        </ul>

        <Form method={callMeMaybe}>
          <input type="text" name="test" />
          <input type="submit" value="Try Test" />
        </Form>
      </div>
    );
  }
};

module.exports = Hello;
