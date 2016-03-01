'use strict';

var Bluebird = require('bluebird');

var helloView = require('../views/Hello')

Core.Factories.ViewModel({
  url: '/',
  pageTitle: 'Hello world!',

  view: {
    file: helloView,
    props: function(world) {
      return {world: 'world(default)'};
    }
  }
});

Core.Factories.ViewModel({
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
  handler: function(params) {
    return Bluebird.resolve(params.world);
  }
});
