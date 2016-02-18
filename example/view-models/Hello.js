'use strict';

var Bluebird = require('bluebird');

ViewModel({
  url: '/',
  view: {
    file: require('../views/Hello'),
    props: function(world) {
      return {world: 'world(default)'};
    }
  }
});

ViewModel({
  url: '/{world}',
  view: {
    file: require('../views/Hello'),
    props: function(world) {
      return {world: world};
    }
  },
  fetch: function(request) {
    return Bluebird.resolve(request.params.world);
  }
});
