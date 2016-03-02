'use strict';

var _internals = {
  startItems: []
};

// TODO: yep
function extend(extentionName, dependencies) {
}

function queueToStart(fn, allowMultiple) {
  if (allowMultiple || _internals.startItems.indexOf(fn) === -1) {
    _internals.startItems.push(fn);
  }
}

// This executes the in reverse order, as it is a queue
function start() {
  var startItems = _internals.startItems;
  for (var i = startItems.length; i--;) {
    startItems[i]();
  }
}

var _internalCore = null;

module.exports = function() {
  if (_internalCore) {
    return _internalCore;
  }

  _internalCore = {
    extend: extend,
    queueToStart: queueToStart,
    start: start
  };
  global.Core = _internalCore;

  require('./router/')();
  require('./core/')();
  require('./factory-method/')();
  require('./factory-view-model/')();

  return _internalCore;
};
