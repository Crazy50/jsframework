'use strict';

var BaseStore = function BaseStore(options) {
  var store = {
    name: options.name,
    data: options.initialData || {},

    observers: []
  };
  store.observe = function observe(listener) {
    if (this.observers.indexOf(listener) === -1) {
      this.observers.push(listener);
    }

    return function stopObserving() {
      var index = this.observers.indexOf(listener);
      if (index !== -1) {
        this.observers.splice(index, 1);
      }
    }
  }.bind(store);
  store.emit = function emit() {
    for (var i = this.observers.length; i--;) {
      // TODO: what should be sent?
      this.observers[i](this);
    }
  }.bind(store);
  store.getData = function() {
    return this.data;
  }.bind(store);

  Core.stores.push(store);
  return store;
};

module.exports = BaseStore;
