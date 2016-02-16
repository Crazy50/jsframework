'use strict';

var Response = function Response(server, response) {
  this.server = server;
  this.response = response;

  this.statusCode = null;
  this.headers = {};
  this.cookies = {};
  this.encoding: 'utf8';
  this.charset: 'utf-8';
  this.ttl: null;
};

Response.prototype.headersSent = function() {
  return this.response.headersSent;
};

Response.prototype.header = function(key, value, options) {
  key = key.toLowerCase();
  options = options || {};
  var append = options.append || false;
  var separator = options.separator || ',';

  var originalValue = this.headers[key];

  if (!append || !originalValue) {
    this.headers[key] = value;
  } else {
    this.headers[key] = originalValue + separator + value;
  }

  return this;
};

Response.prototype.statusCode = function(statusCode) {
  this.statusCode = statusCode;
  return this;
};

Response.prototype.cookie = function(options) {
  if (!options.name) {
    throw new Exception('A cookie must have a name');
  }

  if ('value' in options && options.value !== null) {
    // domain
    // encode
    // expires
    //  - maxAge
    // path
    // httpOnly
    // secure
    // signed
  } else {
    delete this.cookies[options.name];
  }

  return this;
};

Response.prototype.redirect = function(path, statusCode) {
  return this.statusCode(statusCode || 302).header('location', path);
};

Response.prototype.encoding = function(encoding) {
  this.encoding = encoding;
  return this;
};

Response.prototype.charset = function(charset) {
  this.charset = charset;
  return this;
};

Response.prototype.send = function(data) {
  if (!this.response.headersSent) {

  }

  this.response.write(data);
  return this;
};

Response.prototype.end = function() {
  this.response.end();
  return this;
};

module.exports = Response;
