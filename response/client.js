'use strict';

// TODO: maybe we merge client+server+response+request all into one package
var Response = function Response(options) {
  this.request = options.request;
  // relies on express
};

Response.prototype.redirect = function redirect() {
};

Response.prototype.respond = function respond(options) {
  // TODO: where do we get the view engine to use from?
  var viewEngine = options.viewEngine;
  var render = viewEngine.makeRenderer(options.view);

  if (options.pageTitle !== null) {
    document.title = options.pageTitle;
  }
  render(options.props);
};

module.exports = Response;
