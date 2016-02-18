'use strict';

var Response = function Response(server, response) {
  this.server = server;
  this.response = response;

  this.status = 200; // TODO: is defaulting to something legit?
  this.headers = {};
  this.cookies = {};
  this.encoding = 'utf8';
  this.charset = 'utf-8';
  this.ttl = null;
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
  this.status = statusCode;
  return this;
};

Response.prototype.cookie = function(options) {
  if (!options.name) {
    throw new Exception('A cookie must have a name');
  }
  var name = options.name;

  if ('value' in options && options.value !== null) {
    var cookie = name + '=' + options.value;

    if (options.maxAge) {
      options.expires = new Date(Date.now() + options.maxAge);
    }
    if (options.path) {
      cookie += "; path=" + options.path;
    }
    if (options.expires) {
      cookie += "; expires=" + options.expires.toUTCString();
    }
    if (options.domain) {
      cookie += "; domain=" + options.domain;
    }
    if (options.secure) {
      cookie += "; secure";
    }
    if (options.httpOnly) {
      cookie += "; httponly";
    }
    this.cookies[name] = cookie;

    if (options.signed) {
      this.cookies[name+'.sig'] = this.server.signCookie(cookie);
    }

  } else {
    delete this.cookies[name];
    if (name+'.sig' in this.cookies) {
      delete this.cookies[name];
    }
  }

  return this;
};

Response.prototype.redirect = function(path, statusCode) {
  return this.statusCode(statusCode || 302).header('location', path);
};

Response.prototype.encoding = function(encoding) {
  // TODO: set the headers
  this.encoding = encoding;
  return this;
};

Response.prototype.charset = function(charset) {
  // TODO: set the headers
  this.charset = charset;
  return this;
};

Response.prototype.send = function(data) {
  if (!this.response.headersSent) {
    this.response.writeHead(this.statusCode, this.headers);
  }

  this.response.write(data);
  return this;
};

Response.prototype.end = function() {
  this.response.end();
  return this;
};

module.exports = Response;
