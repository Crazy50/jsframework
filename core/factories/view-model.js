'use strict';

var Bluebird = require('bluebird');
var Core = global.Core;

var Validator = require('../validator')

var sendHtml = require('../base-html');

// ViewModel({
//   url: '/todo/{todoid(/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89ABab][0-9a-fA-F]{3}-[0-9a-fA-F]{12}/)}'
//   pageTitle: 'title',
//   layout: 'mainlayout',
//   view: {
//     file: 'todopage',
//     props: function() { // could be a simple object, or a function to set props per request
//       return {id: this.params.id};
//     }
//   },
//
//   errorPages: {
//     4xx: 'errors/custom400',
//     401: function(request, response) {
//       Session.set('returnto', this.url);
//       Flash.error('You must be logged in to continue');
//       response.redirect('/signin');
//     },
//     5xx: {
//       layout: 'errors/customlayout',
//       view: 'errors/custom500'
//     },
//     x: { // because catch all
//       view: function(request, response, error) {
//         return 'errors/customerror'; // for super customizability
//       }
//     }
//   }
//
//   fetch: function() {
//     return TodoQuery.once(this.params.id);
//   }
// });

// TODO: what about a directory-wide "pre/post" fetch that can fetch common things on pages?
// or maybe somehow ViewModel extending another ViewModel?

// TODO: could use like a pre/post handlers along with directory-wide or site-wide capability
// would be useful for things like logging response times and just whatever else someone comes up with
// these handlers could also be used for fetching and solve the above todo

function defaultPropTransform(results) {
  return results;
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
// function cssFetcher(css) {
//   return function() {
//     // TODO: how to handle the subdirs/base?
//     return '<link href="/public/' + css + '" rel="stylesheet" type="text/css">\n'
//   }
// }
// function cssArrayFetcher(cssArray) {
//   return function() {
//     var css = '';
//     for (var i=0; i < cssArray.length; i++) {
//       css += cssFetcher(cssArray[i])();
//     }
//     return css;
//   }
// }
// function scriptFetcher(script) {
//   return function() {
//     // TODO: how to handle the subdirs/base?
//     return '<script type="text/javascript" src="/public/' + script + '"></script>\n'
//   }
// }
// function scriptArrayFetcher(scriptArray) {
//   var script = '';
//   for (var i=0; i < scriptArray.length; i++) {
//     script += scriptFetcher(scriptArray[i])();
//   }
//   return script;
// }
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
  // var pageCss = options.pageCss || emptyOutputer;
  // var pageScript = options.pageScript || emptyOutputer;

  if (!(pageTitle instanceof Function)) {
    pageTitle = titleFetcher(pageTitle);
  }
  if (!(pageMeta instanceof Function)) {
    pageMeta = metaFetcher(pageMeta);
  }
  // if (!(pageCss instanceof Function)) {
  //   pageCss = (pageCss instanceof Array ? cssArrayFetcher(pageCss) : cssFetcher(pageCss));
  // }
  // if (!(pageScript instanceof Function)) {
  //   pageScript = (pageScript instanceof Array ? scriptArrayFetcher(pageScript) : scriptFetcher(pageScript));
  // }

  var propsTransform = options.view.props || defaultPropTransform;

  var renderToString = Core.viewEngine.makeRenderer(options.view.file);

  var errorHandler = options.errorHandler;

  return function wrappedFetch(request, response, next) {
    // check ACL
    // TODO: per-view ACL is good, but also having directory-wide ACL would be a welcome improvement

    // check param types and validators
    var validationErrors = paramValidator(request.params);
    if (validationErrors) {
      // TODO: better error pages
      response.status(400).send(validationErrors);
      return;
    }

    // call the handler
    fetch.bind(request)()
      .then(function(result) {
        // TODO: how to make sure store are populated with any data received?
        if (request.isFullRequest) {
          var props = propsTransform(result);
          sendHtml(
            response,
            pageTitle.bind(request)(result),
            pageMeta.bind(request)(result),
            '', // TODO: need to figure out what users can set for CSS and JS
            '',
            renderToString(props),
            result
          );
        } else {
          response.send(result);
        }
      })
      .catch(function(error) {
        // TODO: per-view error handlers
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
