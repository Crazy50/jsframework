'use strict';

var Bluebird = require('bluebird');
var React = require('react');
var ReactDOM = require('react-dom/server');
var core = require('../core');

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
  var propsTransform = options.view.props || defaultPropTransform;

  var Layout = options.layout ? React.createFactory(options.layout) : defaultLayout;
  var View = React.createFactory(options.view.file);

  return function wrappedFetch(request, response) {
    // check ACL
    // check param types and validators
    // call the handler

    fetch(request)
      .then(function(result) {
        var props = propsTransform(result);
        response.send(
          ReactDOM.renderToString(Layout(null, View(props)))
        ).end();
      })
      .catch(function(error) {
        // TODO: gotta make sure that options has the error handler set then
        options.errorHandler(error);
      });
  };
}

var ViewModel = function(options) {
  var url = options.url;

  core.server.addRoute({
    methods: 'get',
    path: url,
    handler: createFetchWrapper(options)
  });
};

module.exports = ViewModel;
