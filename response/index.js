'use strict';

var baseHtml = require('./base-html');

function metaTransform(metaArr) {
  return function() {
    if (!metaArr) {
      return '';
    }

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

// TODO: maybe we merge client+server+response+request all into one package
var Response = function Response(options) {
  this.request = options.request;
  // relies on express
  this.response = options.response;
};

Response.prototype.redirect = function redirect(location) {
  this.response.redirect(location);
};

Response.prototype.respond = function respond(options) {
  // TODO: status code
  var result = options.result;

  if (request.isFullRequest) {
    var pageTitle = options.pageTitle || '';
    var pageMeta = options.pageMeta || '';

    // TODO: where do we get the view engine to use from?
    var viewEngine = options.viewEngine;

    sendHtml(
      this.response,
      pageTitle,
      metaTransform(pageMeta),
      '', // TODO: need to figure out what users can set for CSS and JS
      '',
      viewEngine.render(options.view, options.props),
      result
    );
  } else {
    this.response.send(result || {});
  }
};

Response.prototype.postRespond = function postRespond(options) {
  var result = options.result;

  if (request.isFullRequest) {
    var redirectTo = options.redirectTo || '/';
    this.response.redirect(redirectTo);
  } else {
    this.response.send(result || {});
  }
};

module.exports = Response;
