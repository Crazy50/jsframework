'use strict';

var Todo = require('../types/todo');
var TodoStore = require('../stores/todo');

exports.Add = Method({
  name: 'addtodo',

  params: {
    message: String
  },

  client: true, // let the store auto-update take over

  server: {
    method: 'post',
    url: '/addtodo',
    redirectPost: '/'
  },

  handler: function() {
    var item = new Todo({message: message});
    // TODO: how does the query get updated along with view?
    return TodoStore.insert(item);
  }
});

exports.Remove = Method({
  name: 'removetodo',

  params: {
    item: Todo
  },

  client: true,

  server: {
    method: 'post',
    url: '/removetodo',
    redirectPost: '/'
  },

  handler: function() {
    // TODO: how does the query get updated along with view?
    return TodoStore.remove(this.item.id);
  }
});
