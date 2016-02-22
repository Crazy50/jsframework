var TodoStore = require('../stores/todo');

module.exports = Query({
  name: 'alltodos',
  store: TodoStore,

  client: true,
  rest: {
    url: '/todos'
  },

  publisher: function() {
    return this.store.find();
  }
});
