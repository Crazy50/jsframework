'use strict';

var Bluebird = require('bluebird');

module.exports = Method({
  name: 'callmemaybe',

  params: [
    {
      name: 'test',
      type: String
    }
  ],

  client: false,

  server: {
    method: 'post',
    url: '/test',
    redirectPost: '/'
  },

  handler: function() {
    console.log('hello test');
    return Promise.resolve();
  }
});
