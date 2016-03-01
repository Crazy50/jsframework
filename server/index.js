'use strict';

var path = require('path');

var express = require('express');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var flash = require('connect-flash');

var CoreRequest = require('./request');

// TODO: how to let users include more middlewares? maybe disable?
// TODO: also logging
var Server = function Server(Core) {
  if (Core.Server) {
    return Core;
  }

  var app = express();
  Core.Server = {
    app: app
  };

  // public files
  app.use('/public', express.static(path.resolve(process.cwd(), 'public')));

  // middlewares
  app.use(cookieParser());
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());
  // app.use(session());
  // app.use(flash());

  // our custom handler
  app.use(_handler);

  app.use(function(req, res, next) {
    console.log('not found');
    res.status(404).send('File not found');
  });
  app.use(function(err, req, res, next) {
    console.log('some error occurred');
    console.log(err);
    console.log(err.stack);
    res.status(500).send(JSON.stringify(err, null, 2));
  });

  Core.queueToStart(function() {
    // TODO: getting portnumber from the config system
    app.listen(portNumber || 3000);
  });

  return Core;
}

function _handler(req, res, next) {
  var path = req.path;
  var method = req.method.toLowerCase();

  console.log(method, ':', path);
  // TODO: figure out query strings and optionals/validation
  var routeInfo = Core.router.handle(method, path);

  // TODO: gotta rethink this part
  // no query params. they're less secure and more for options, not params
  // if it should be a parameter, use a route/url, not a query param
  var params = {};
  for (var prop in req.body) {
    params[prop] = req.body[prop]
  }
  if (routeInfo && routeInfo.params) {
    for (var prop in routeInfo.params) {
      params[prop] = routeInfo.params[prop]
    }
  }

  var request = new CoreRequest({
    request: req,

    cookies: req.cookies,
    signedCookies: req.signedCookies,

    method: method,
    path: path,
    protocol: req.protocol,
    hostname: req.hostname,

    params: params,
    query: req.query,

    isServer: true,
    isClient: false,
    isFullRequest: !req.xhr && req.accepts('html') === 'html'
  });

  if (!routeInfo) {
    // TODO: need configurable 404s and other errors
    return next();
  }

  var handlers = routeInfo.route.handlers;

  // TODO: have to get with the method? no bueno
  if (!handlers || !handlers[method]) {
    // TODO: need configurable 404s and other errors
    return next();
  }

  handlers[method](request, res, next);
};

module.exports = Server;
