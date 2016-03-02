'use strict';

var createApiCaller = require('../api-caller');

// TODO: what about a directory-wide "pre/post" fetch that can fetch common things on pages?
// or maybe somehow ViewModel extending another ViewModel?

// TODO: could use like a pre/post handlers along with directory-wide or site-wide capability
// would be useful for things like logging response times and just whatever else someone comes up with
// these handlers could also be used for fetching and solve the above todo

function createHandler(options) {
  // TODO: what about server-only fetch capability that requires client to fetch data first?
  var propsTransform = options.view.props || defaultPropTransform;

  return function wrappedFetch(request, response, next) {
    // check ACL ? but ACL could only be securely checked server side
    // check param types and validators
    // call the handler

    // TODO: methods will run into this at some point too
    // late initialize in order to support dynamic paths
    var caller = createApiCaller({
      method: request.method,
      url: request.path,
      handler: options.handler
    });

    // TODO: any kind of Loading notification?
    caller(request.params)
      .then(function(result) {
        var props = options.view.props;
        if (props instanceof Function) {
          props = props(result);
        }

        var pageTitle = options.pageTitle;
        if (pageTitle instanceof Function) {
          pageTitle = pageTitle(result);
        }

        var pageMeta = options.pageMeta;
        if (pageMeta instanceof Function) {
          pageMeta = pageMeta(result);
        }

        response.respond({
          pageTitle: pageTitle,
          pageMeta: pageMeta,
          viewEngine: Core.viewEngine, // TODO: not the best
          result: result,

          view: options.view.file,
          props: props
        });
      })
      .catch(function(error) {
        // TODO: gotta make sure that options has the error handler set then
        next(error);
      });
  };
}

var ViewModel = function(options) {
  options.method = 'get';
  var url = options.url;

// TOOD:
/*
var validationErrors = paramValidator(request.params);
if (validationErrors) {
  // TODO: better error pages
  response.status(400).send(validationErrors);
  return;
}
*/

  Core.router.add({
    methods: options.method,
    path: url,
    handler: createHandler(options)
  });
};

module.exports = function() {
  if (Core.Factories) {
    if (Core.Factories.ViewModel) {
      return;
    }
  } else {
    Core.Factories = {};
  }

  Core.Factories.ViewModel = ViewModel;
};
