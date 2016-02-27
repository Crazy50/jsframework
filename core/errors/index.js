'use strict';

module.exports = {
  BadGateway: require('./bad-gateway'),
  BadRequest: require('./bad-request'),
  Forbidden: require('./forbidden'),
  GatewayTimeout: require('./gateway-timeout'),
  MethodNotAllowed: require('./method-not-allowed'),
  NotFound: require('./not-found'),
  NotImplemented: require('./not-implemented'),
  ServerError: require('./server-error'),
  ServerTimeout: require('./server-timeout'),
  Unauthorized: require('./unauthorized'),

  InvalidConfig: require('./invalid-config'),
  MissingRequired: require('./missing-required'),
  ValidationError: require('./validation-error')
};
