'use strict';

var Bluebird = require('bluebird');
var React = require('react');
var ReactDOM = require('react-dom/server');
var Core = global.Core;

var Validator = require('../core/validator')

// ViewModel({
//   url: '/todo/{todoid(/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89ABab][0-9a-fA-F]{3}-[0-9a-fA-F]{12}/)}'
//   layout: 'mainlayout',
//   view: {
//     file: 'todopage',
//     props: function() { // could be a simple object, or a function to set props per request
//       return {id: this.params.id};
//     }
//   },
//
//   fetch: function() {
//     return TodoQuery.once(this.params.id);
//   }
// })

function sendHtml(response, content) {
  response.send(
    '<!doctype html>\n'
    + '<html>\n'
      + '<head>\n'
        + '<meta charset="utf-8">\n'
        + '<meta http-equiv="X-UA-Compatible" content="IE=edge">\n'
        + '<title>page title</title>\n' // TODO how does end user set page title?

        // TODO: how does end user specify the CSS and extra JS to load?
      + '</head>\n'
      + '<body>\n'
      + '<div id="bodymount">\n'
  )
  .send(content)
  .send(
    '</div>\n'
    + '<script type="text/javascript" src="public/core.js"></script>\n' // TODO: what about base urls?
    + '</body>\n'
    + '</html>'
  ).end()
}

function defaultPropTransform() {
  return null;
}
function defaultLayout(p, c) {
  return c;
}

function createFetchWrapper(options) {
  var fetch = options.fetch || Bluebird.resolve;
  if (options.isAsync) {
    fetch = Bluebird.coroutine(fetch);
  }
  var paramValidator = Validator({
    params: options.params,
    strict: false
  });

  var propsTransform = options.view.props || defaultPropTransform;

  var Layout = options.layout ? React.createFactory(options.layout) : defaultLayout;
  var View = React.createFactory(options.view.file);

  return function wrappedFetch(request, response) {
    // check ACL
    // check param types and validators
    var validationErrors = paramValidator(request.params);
    if (validationErrors) {
      // TODO: better error pages
      response.statusCode(400).send(validationErrors).end();
      return;
    }
    // call the handler

    fetch(request)
      .then(function(result) {
        var props = propsTransform(result);
        sendHtml(response, ReactDOM.renderToString(Layout(null, View(props))));
      })
      .catch(function(error) {
        // TODO: gotta make sure that options has the error handler set then
        options.errorHandler(error);
      });
  };
}

var ViewModel = function(options) {
  var url = options.url;

  Core.router.add({
    methods: 'get',
    path: url,
    handler: createFetchWrapper(options)
  });
};

module.exports = ViewModel;
