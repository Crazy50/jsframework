'use strict';
// TODO: magic globals soon. i know. globals. deal with it.
var ViewModel = require('../../factories/view-model');

ViewModel({
  url: '/',
  view: {
    file: require('../views/Hello')
  }
});
