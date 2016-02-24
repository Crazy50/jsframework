'use strict';

var Bluebird = require('bluebird');
var Validator = require('../../core/validator')

var BaseStore = require('../../core/base-store');

// temp: this is both server & client side, as is
// to remain consistent, this is not a "new"-style constructor
// TODO: add observation ability
// TODO: add ability for things to auto-fill a store based on type
var MemoryStore = function MemoryStore(options) {
  var schema = options.schema;

  var store = BaseStore(options);
  store.sameClient = true;
  store.nextId = 1;

  store.insert = function insert(item) {
    if (schema) {
      if (!(item instanceof schema)) {
        // TODO: not use generic error
        console.log('not correct type');
        return Bluebird.reject(new Error('Cannot insert item of different type'));
      }

      var validationErrors = schema.validate(item);
      if (validationErrors) {
        console.log('not valid');
        return Bluebird.reject(validationErrors);
      }
    }
    item.id = this.nextId++;
    this.data[item.id] = item;

    this.emit();
    return Bluebird.resolve(item);
  }.bind(store);

  store.remove = function insert(itemId) {
    var item = this.data[itemId];
    delete this.data[itemId];

    this.emit();
    return Bluebird.resolve(item);
  }.bind(store);

  store.find = function insert(itemId) {
    var items = [];

    for (var p in this.data) {
      if (!itemId || p === itemId) {
        items.push(this.data[p]);
      }
    }

    return Bluebird.resolve(items);
  }.bind(store);

  return store;
};

module.exports = MemoryStore;
