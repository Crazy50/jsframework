'use strict';

// TODO: yep
function extend(extentionName, dependencies) {
}

function queueToStart(fn, allowMultiple) {
  if (allowMultiple || this._internals.startItems.indexOf(fn) === -1) {
    this._internals.startItems.push(fn);
  }
}

// This executes the in reverse order, as it is a queue
function start() {
  var startItems = this._internals.startItems;
  for (var i = startItems.length; i--;) {
    startItems[i]();
  }
}

var defaultCore = {
  _internals: {
    startItems: []
  }
};
defaultCore.extend = extend.bind(defaultCore);
defaultCore.queueToStart = queueToStart.bind(defaultCore);
defaultCore.start = start.bind(defaultCore);

var _internalCore = null;

module.exports = function(Core) {
  if (Core) {
    _internalCore = Core;
  } else {
    _internalCore = defaultCore;
  }

  // TODO: any options that are good except globals? and avoiding a bunch of function calls with bundles...
  global.Core = _internalCore;
  return _internalCore;
};
