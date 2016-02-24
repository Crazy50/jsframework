'use strict';

// TODO: is components the right place for this?

var Bluebird = require('bluebird');
var React = require('react');

// TODO: maybe we may need a way to pass other props
// TODO: knowing if we are still loading or not?
module.exports = function DataFetcher(view, query) {
  var Element = React.createFactory(view);

  return React.createClass({
    displayName: 'DataFetcher',

    mergedProps: null,

    getInitialState: function() {
      return {storeData: null};
    },

    componentDidMount: function() {
      if (!this.unlisten) {
        this.unlisten = query.store.observe(this.dataUpdate);
        this.dataUpdate(query.store);
      }
    },

    componentWillUnmount: function() {
      if (this.unlisten) {
        this.unlisten();
        this.unlisten = null;
      }
    },

    updateMergeProps: function(storeInstance) {
      var newMergedProps = {};
      var storeData = null;

      var p;
      for (p in this.props) {
        newMergedProps[p] = this.props[p];
      }

      if (storeInstance) {
        storeData = storeInstance.getData();
        newMergedProps[storeInstance.name] = storeData;
      }

      this.mergedProps = newMergedProps;

      return storeData;
    },

    dataUpdate: function(storeInstance) {
      var storeData = this.updateMergeProps(storeInstance);
      this.setState({storeData: storeData});
    },

    render: function() {
      if (!this.mergedProps) {
        this.updateMergeProps();
      }

      return Element(this.mergedProps);
    }
  });
};
