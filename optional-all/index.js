'use strict';

var fs = require('fs');
var requireAll = require('require-all');

module.exports = function optionalAll(dirname) {
  var cwd = process.cwd();
  var fulldir = cwd + '/' + dirname;
  if (fs.existsSync(fulldir)) {
    return requireAll(fulldir);
  }
  return {};
};
