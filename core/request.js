'use strict';

var CoreRequest = function CoreRequest(options) {
  this.request = options.request;

  this.cookies = options.cookies || {};
  this.signedCookies = options.signedCookies || {};

  this.method = options.method;
  this.path = options.path;
  this.protocol = options.protocol || 'http';
  this.hostname = options.hostname || '';

  this.params = options.params || {};
  this.query = options.query;

  this.isServer = options.isServer || true;
  this.isClient = options.isClient || !this.isServer;
  this.isFullRequest = options.isFullRequest || this.isServer;

  this.secure = this.protocol === 'https';
};

module.exports = CoreRequest;
