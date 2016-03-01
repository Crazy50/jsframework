'use strict';

function extend(extentionName, dependencies) {
}

function queueToStart(fn, allowMultiple) {
  if (allowMultiple || this._internals.startItems.indexOf(fn) !== -1) {
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

// TODO: Core may just have some functions to help extend itself, check for deps, and check for already-loaded
module.exports = function(Core) {
  if (Core) {
    return Core;
  }

  var newCore = {
    _internals: {
      startItems: []
    }
  };

  newCore.extend = extend.bind(newCore);
  newCore.queueToStart = queueToStart.bind(newCore);
  newCore.start = start.bind(newCore);

  return newCore;
};
