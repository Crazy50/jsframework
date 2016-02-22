'use strict';

var React = require('react');
var h = React.createElement;
var DataFetcher = Core.components.DataFetcher;

var Link = React.createFactory(Core.components.Link);
var Form = React.createFactory(Core.components.Form);

// var TodosQuery = require('../queries/alltodos');
var TodoMethods = require('../methods/todo');
var TodosQuery = require('../queries/alltodos');

var TodoLine = React.createFactory(function(props) {
  return (
    h('li', null,
      props.item.message,
      (props.item.complete ? ' - COMPLETE - ' : ' - in progress - '),
      h('button', {type: 'submit', name: 'item', value: props.item}, 'Remove')
    )
  );
});

var TodoList = React.createClass({
  displayName: "TodoList",

  // Form is a helper that takes the method and can do it ajax or post-redirect if JS not available
  render: function() {
    var todos = this.props.todos
      ? this.props.todos.map(function(item) { return TodoLine({item: item, key: item.id}); })
      : null;

    return (
      h('div', null,
        Form({method: TodoMethods.Remove},
          h('ul', null, todos)
        ),
        Form({method: TodoMethods.Add},
          h('input', {type: 'text', name: 'message'}),
          h('br'),
          h('button', {type: 'submit'}, 'Add New Todo')
        )
      )
    );
  }
});

module.exports = DataFetcher(TodoList, TodosQuery);
//module.exports = TodoList;
