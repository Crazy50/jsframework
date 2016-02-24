'use strict';

var Bluebird = require('bluebird');

module.exports = Method({
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

  handler: function() {
    console.log('call-me-maybe:', this.params.test);
    return Promise.resolve(this.params.test);
  }
});
