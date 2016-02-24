'use strict';

var Todo = require('../types/todo');

module.exports = Store.MemoryStore({
  name: 'todos',
  schema: Todo
});
