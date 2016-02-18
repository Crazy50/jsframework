'use strict';

var CoreRequest = function CoreRequest(options) {
  this.server = options.server;
  this.request = options.request;

  this.originalUrl = options.originalUrl;

  this.cookies = options.cookies || {};
  this.signedCookies = options.signedCookies || {};

  this.method = options.method;
  this.params = options.params || {};
  this.path = options.path;
  this.query = options.query;
  this.host = options.host;
  this.protocol = options.protocol || 'http';

  this.isServer = options.isServer || true;
  this.isClient = options.isClient || !this.isServer;
  this.isFullRequest = options.isFullRequest || false;

  this.secure = this.protocol === 'https';
};

module.exports = CoreRequest;
