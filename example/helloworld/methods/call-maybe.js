'use strict';

var Bluebird = require('bluebird');

module.exports = Core.Factories.Method({
  name: 'callmemaybe',

  params: {
    test: /^[a-zA-Z0-9]+$/
  },

  client: {
    handler: function(result) {
      console.log('got result:', result);
      // TODO: how to get a redirect in here?
    }
  },

  server: {
    method: 'post',
    url: '/test',
    redirectPost: function(result) {
      return '/world/' + result;
    }
  },

  handler: function(params) {
    console.log('call-me-maybe:', params.test);
    return Promise.resolve(params.test);
  }
});
