'use strict';

module.exports = function optionalAll(dirname) {
  function requireAll(r) { r.keys().forEach(r); }

  // TODO: I think that commenting everything except view-models makes it
  // so that only items that are used client side are really loaded
  // requireAll(require.context('types/', true, /\.js$/));
  // requireAll(require.context('stores/', true, /\.js$/));
  // requireAll(require.context('queries/', true, /\.js$/));
  // requireAll(require.context('methods/', true, /\.js$/));
  requireAll(require.context(dirname + '/', true, /\.js$/));
};
