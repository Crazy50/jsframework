'use strict';

var Bluebird = require('bluebird');

var helloView = require('../views/Hello')

ViewModel({
  url: '/',
  pageTitle: 'Hello world!',

  view: {
    file: helloView,
    props: function(world) {
      return {world: 'world(default)'};
    }
  }
});

ViewModel({
  url: '/world/{world}',
  pageTitle: function(world) {
    return 'Hello you: ' + world;
  },

  params: {
    world: {
      validator: [
        {validator: /^[a-zA-Z0-9]+$/, message: 'Such a weird named world!'}
      ]
    }
  },
  view: {
    file: helloView,
    props: function(world) {
      return {world: world};
    }
  },
  fetch: function() {
    return Bluebird.resolve(this.params.world);
  }
});
