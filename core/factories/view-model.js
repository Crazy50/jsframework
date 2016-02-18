'use strict';

var Bluebird = require('bluebird');
var React = require('react');
var ReactDOM = require('react-dom/server');
var Core = global.Core;

var Validator = require('../validator')

var sendHtml = require('../base-html');

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

// these functions exist just to function-ify strings
function titleFetcher(title) {
  return function() {
    return title;
  }
}
function metaFetcher(metaArr) {
  return function() {
    var meta = '';
    for (var i=0; i < metaArr.length; i++) {
      meta += '<meta'

      var metaObj = metaArr[i];
      for (var prop in metaObj) {
        meta += ' ' + prop + '="' + metaObj[prop] + '"';
      }

      // TODO: what about XHTML or others that require closing tags? vs html5 that requires not-closing?
      meta += '>';
    }
    return meta;
  }
}
function cssFetcher(css) {
  return function() {
    // TODO: how to handle the subdirs/base?
    return '<link href="/public/' + css + '" rel="stylesheet" type="text/css">\n'
  }
}
function cssArrayFetcher(cssArray) {
  return function() {
    var css = '';
    for (var i=0; i < cssArray.length; i++) {
      css += cssFetcher(cssArray[i])();
    }
    return css;
  }
}
function scriptFetcher(script) {
  return function() {
    // TODO: how to handle the subdirs/base?
    return '<script type="text/javascript" src="/public/' + script + '"></script>\n'
  }
}
function scriptArrayFetcher(scriptArray) {
  var script = '';
  for (var i=0; i < scriptArray.length; i++) {
    script += scriptFetcher(scriptArray[i])();
  }
  return script;
}
function emptyOutputer() {
  return '';
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

  var pageTitle = options.pageTitle || emptyOutputer;
  var pageMeta = options.pageMeta || emptyOutputer;
  var pageCss = options.pageCss || emptyOutputer;
  var pageScript = options.pageScript || emptyOutputer;

  if (!(pageTitle instanceof Function)) {
    pageTitle = titleFetcher(pageTitle);
  }
  if (!(pageMeta instanceof Function)) {
    pageMeta = metaFetcher(pageMeta);
  }
  if (!(pageCss instanceof Function)) {
    pageCss = (pageCss instanceof Array ? cssArrayFetcher(pageCss) : cssFetcher(pageCss));
  }
  if (!(pageScript instanceof Function)) {
    pageScript = (pageScript instanceof Array ? scriptArrayFetcher(pageScript) : scriptFetcher(pageScript));
  }

  var propsTransform = options.view.props || defaultPropTransform;

  var Layout = options.layout ? React.createFactory(options.layout) : defaultLayout;
  var View = React.createFactory(options.view.file);

  var errorHandler = options.errorHandler || Core.ErrorDispatcher;

  return function wrappedFetch(request, response) {
    // check ACL
    // TODO: per-view ACL is good, but also having directory-wide ACL would be a welcome improvement

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
        sendHtml(
          response,
          pageTitle(request, result),
          pageMeta(request, result),
          pageCss(request, result),
          pageScript(request, result),
          ReactDOM.renderToString(Layout(null, View(props))));
      })
      .catch(function(error) {
        errorHandler(request, response, error);
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
