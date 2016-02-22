'use strict';

// var TodosQuery = require('../queries/alltodos');
// var TodoQuery = require('../queries/todo');

var Todo = require('../types/todo');
var TodoStore = require('../stores/todo');
var TodosQuery = require('../queries/alltodos');

ViewModel({
  url: '/',
  pageTitle: 'Your Todos',

  view: {
    file: require('../views/todolist')
    // props: function(result) {
    //   return {todos: result};
    // }
  },

  // prefetch the data. later on in life, this may be calculated from the views
  fetch: function() {
    // TEMP: just add some todos
    TodoStore.insert(new Todo({message: 'get a basic hello world', complete: true}));
    TodoStore.insert(new Todo({message: 'get stores working', complete: false}));
    TodoStore.insert(new Todo({message: 'validate primitive types', complete: false}));
    TodoStore.insert(new Todo({message: 'get a todo app', complete: false}));

    return TodosQuery();
    // return TodosQuery.once();
  }
});

// ViewModel({
//   url: '/todo/{todoid}'
//
//   params: {
//     todoid: {
//       validator: [
//         {
//           validator: /^[0-9]+$/,
//           message: 'The ID for the Todo is invalid'
//         }
//       ]
//     }
//   },
//
//   view: {
//     file: require('../views/todopage'),
//     props: function() {
//       return {id: this.params.todoid};
//     }
//   },
//
//   fetch: function() {
//     return TodoStore.find(this.params.todoid);
//     // return TodoQuery.once(this.params.id);
//   }
// });
