'use strict';

var Bluebird = require('bluebird');

var BaseStore = require('core/base-store');
var Validator = require('core/validator');

// sometimes, we do the same on the client as the server
var ServerQuery - require('core/query');

function createQueryHandler(internalStore, options) {
  // perform the query
  // put any data in the store
  // put the id or array of IDs in this
  // notify listeners
  var fetch = Core.rest.createCaller(options.rest.method, options.rest.url);

  return function queryHandler(params) {
    return fetch(params).then(function(results) {
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

      return results;
    });
  };
}

var Query = function Query(options) {
  if (options.store.sameClient) {
    console.log('make server-like one');
    return ServerQuery(options);
  }

  var internalStore = BaseStore({name: options.name, initialData: []});
  internalStore.getData = function() {
    var otherData = options.store.getData();
    var order = this.data;

    return order.map(function(id) { return otherData[id]; });
  }.bind(internalStore);
  options.store.observe(function() {
    // TODO: refresh the view?

    // also make sure we emit when the other store has changes
    internalStore.emit();
  });

  var handler = createQueryHandler(internalStore, options);
  handler.store = internalStore;

  return handler;
};

module.exports = Query;
