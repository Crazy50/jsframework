'use strict';

var Bluebird = require('bluebird');
var React = require('react');
var ReactDOM = require('react-dom');
var Core = window.Core;

function defaultPropTransform() {
  return null;
}
function defaultLayout(p, c) {
  return c;
}

// TODO: so much that is duplicated between client and server
/*
  the refactor:
  the defaultPropTransform and layout is all shared
  much of the wrappedFetch is shared too

  server:
    can do validations
    can fetch data directly
    uses ReactDOM/server
    if the request is for HTML then
      return the full content
    else
      return just the results of the fetch (post-transform too)

  client:
    should ask server to do validations and fetch
    uses the stuff from fetch to populate stores
    uses ReactDOM (not /server)

  could have view-model, then use like aliasing to pull in correct sub-parts

*/
function createFetchWrapper(options) {
  // TODO: what about server-only fetch capability that requires client to fetch data first?
  var fetch = options.fetch || Bluebird.resolve;
  if (options.isAsync) {
    fetch = Bluebird.coroutine(fetch);
  }
  var propsTransform = options.view.props || defaultPropTransform;

  var Layout = options.layout ? React.createFactory(options.layout) : defaultLayout;
  var View = React.createFactory(options.view.file);

  return function wrappedFetch(request, response) {
    // check ACL ? but ACL could only be securely checked server side
    // check param types and validators
    // call the handler

    // TODO: any kind of Loading notification?

    fetch(request)
      .then(function(result) {
        var props = propsTransform(result);
        // this render is the only thing different in this wrapped part
        ReactDOM.render(
          Layout(null, View(props)),
          document.getElementById('bodymount')
        );
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
