'use strict';

var Bluebird = require('bluebird');

var BaseStore = require('../base-store');
var Validator = require('../validator');

function createQueryHandler(internalStore, options) {
  // perform the query
  // put any data in the store
  // put the id or array of IDs in this
  // notify listeners

  return function queryHandler(params) {
    return options.publisher(params).then(function(results) {
      var newData = [];

      if (results instanceof Array) {
        for (var i=0; i < results.length; i++) {
          var item = results[i];
          options.store.data[item.id] = item;
          newData.push(item.id);
        }
      } else {
        var item = results;
        options.store.data[item.id] = item;
        newData.push(item.id);
      }

      internalStore.data = newData;

      var ret = {};
      ret[options.store.name] = results;
      return ret;
    });
  };
}

function createQueryWrapper(fetcher, options) {
  var transform = options.outputTransform || JSON.stringify;

  return function wrappedQuery(request, response, next) {
    return fetcher(request.params).then(function(results) {
      response.send(results !== undefined ? transform(results) : {});
    }).catch(next);
  };
}

var Query = function Query(options) {
  var internalStore = BaseStore({name: options.name, initialData: []});
  internalStore.getData = function() {
    var otherData = options.store.getData();
    var order = this.data;

    return order.map(function(id) { return otherData[id]; });
  }.bind(internalStore);
  options.store.observe(function() {
    // also make sure we emit when the other store has changes
    internalStore.emit();
  });

  var handler = createQueryHandler(internalStore, options);
  handler.store = internalStore;

  Core.router.add({
    methods: options.method,
    path: options.url,
    handler: createQueryWrapper(handler, options)
  });

  // can't return just the publisher, because any call made, we want to grab for stores
  return handler;

  // name: 'todo',
  // store: TodoStore,
  //
  // client: true,
  // rest: {
  //   method: 'get',
  //   url: '/todo/{todoid}'
  // },
  //
  // publisher: function() {
  //   return this.store.find(this.params.todoid);
  // }
};

module.exports = Query;
