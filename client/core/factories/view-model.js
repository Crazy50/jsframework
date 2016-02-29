'use strict';

var Bluebird = require('bluebird');
var axios = require('axios');
var Core = global.Core;

function defaultPropTransform(props) {
  return props;
}
function defaultLayout(p, c) {
  return c;
}
function titleFetcher(title) {
  return function() {
    return title;
  }
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
  var propsTransform = options.view.props || defaultPropTransform;

  var pageTitle = options.pageTitle || emptyOutputer;
  if (!(pageTitle instanceof Function)) {
    pageTitle = titleFetcher(pageTitle);
  }

  var renderer = Core.viewEngine.makeRenderer(options.view.file);

  return function wrappedFetch(request, next) {
    // check ACL ? but ACL could only be securely checked server side
    // check param types and validators
    // call the handler

    // TODO: any kind of Loading notification?
    var fetch;
    // TODO: prefetch having some issues due to typos (forgot script tags)
    // but also, the "full request" despite the request wanting JSON.
    // get working without prefetch!

    if (Core.client.prefetch) {
      var prefetch = Core.client.prefetch;
      Core.client.prefetch = null;
      // TODO: good enough for a prefetch?
      fetch = Bluebird.resolve(prefetch);
    } else if (options.fetch) {
      fetch = axios
        .get(request.path, request.query)
        .then(function(res) { return res.data; });
    } else {
      fetch = Bluebird.resolve();
    }

    fetch
      .then(function(result) {
        var props = propsTransform(result);

        // TODO: what about if a page has extra CSS or JS?
        // maybe we make users load all the CSS and JS they need app-wide?
        document.title = pageTitle.bind(request)(result);

        renderer(props);
      })
      .catch(function(error) {
        // TODO: gotta make sure that options has the error handler set then
        next(error);
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
