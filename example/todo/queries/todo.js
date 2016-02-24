var TodoStore = require('../stores/todo');

module.exports = Query({
  name: 'todo',
  store: TodoStore,

  client: true,
  rest: {
    method: 'get',
    url: '/todo/{todoid}'
  },

  publisher: function(params) {
    return this.store.find(params.todoid);
  }
});
