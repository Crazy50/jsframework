'use strict';

var Keygrip = require('keygrip');

var parseurl = require('parseurl');

var Router = require('../router/router');

var CoreRequest = require('./request');
var CoreResponse = require('./server-response');

function ParseCookies(cookieHeader) {
  if (!cookieHeader || !cookieHeader.length) {
    return {};
  }

  var cookieArray = cookieHeader.split(';');
  var cookies = {};

  for (var i=0; i < cookieArray.length; i++) {
    var cookie = cookieArray[i].trim().split('=');
    cookies[cookie[0]] = cookie[1];
  }

  return cookies;
}

function SignedCookies(cookies, keys) {
  var signedCookies = {};

  for (var name in cookies) {
    var signedName = name + '.sig';

    if (signedName in cookies && keys.verify(cookies[signedName])) {
      signedCookies[name] = cookies[name];
    }
  }

  return signedCookies;
}


var Server = {
  // TODO: cant handle http2, https, or all 3 at the same time
  http: require('http').createServer(_handler.bind(Server)),
  router: Router,
  // TODO: how to set the keys
  keys: null
};

function _handler(req, res) {
  var originalUrl = req.url;
  var method = req.method.toLowerCase();

  // TODO: better request logging
  console.log(method, ':', originalUrl);

  // what about any rewrites?
  var url = originalUrl;

  var urlParts = parseurl(req);
  // TODO: figure out query strings and optionals/validation
  var routeInfo = Router.handle(method, urlParts.pathname);

  var cookies = ParseCookies(req.headers.cookie);
  var signedCookies = SignedCookies(cookies, Server.keys);

  var request = new CoreRequest({
    server: Server,
    request: req,

    originalUrl: originalUrl,

    cookies: cookies,
    signedCookies: signedCookies,

    method: method,
    params: routeInfo ? routeInfo.params : {},
    path: urlParts.pathname,
    query: urlParts.query,
    // host
    // protocol
    isServer: true,
    isClient: false,
    isFullRequest: true // TODO: if it's XHR or Accept isnt html
  });
  var response = new CoreResponse(Server, res);

  if (!routeInfo) {
    // TODO: need configurable 404s and other errors
    response.statusCode(404).send('Route not found').end();
    return;
  }

  var handlers = routeInfo.route.handlers;

  // TODO: have to get with the method? no bueno
  if (!handlers || !handlers[method]) {
    // TODO: need configurable 404s and other errors
    response.statusCode(404).send('Route not found').end();
    return;
  }

  handlers[method](request, response);
};

Server.addRoute = function addRoute(options) {
  Server.router.add(options);
  return Server;
};

Server.listen = function listen(portNumber) {
  Server.http.listen(portNumber);
  return Server;
};

Server.signCookie = function signCookie(cookieValue) {
  return this.keys.sign(cookieValue);
};

module.exports = Server;
