'use strict';

// var TodosQuery = require('../queries/alltodos');
// var TodoQuery = require('../queries/todo');

var Todo = require('../types/todo');
var TodoStore = require('../stores/todo');
var TodosQuery = require('../queries/alltodos');

// TODO: MondayOSCOPY day:
/*

ViewModel.defauts.pageTitle = 'Default Page Title';

// override even Core.Config.ViewModel.defaults
ViewModel.defauts.policies = myPolicy;
ViewModel.defauts.policies = [myPolicy1, myPolicy2];

// extend from the Core.Config.ViewModel.defaults
ViewModel.defauts.policies.push(myPolicy);

ViewModel({
  ...
  policies: 'extendedPolicy',

  // or an array
  policies: ['extendedPolicy1', 'extendedPolicy2'],

  // to override and use only ones set here:
  overridePolicies: true
  ...
})


var error400 = Error({
  view: require('../views/errors/error400')
  props: function(error) {},
  pageTitle: function(error) {},
  handler: function(request, response) {}
});
  ...
  errors: {
    4xx: error400
  }
  ...

As such, need to build a CoreResponse for client side to do things like:
  redirect

without it, the handler() for errors doesn't work.

*/

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
