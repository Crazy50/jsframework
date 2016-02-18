var fs = require('fs');
var requireAll = require('require-all');

module.exports = function optionalAll(dirname) {
  if (fs.existsSync(dirname)) {
    return requireAll(dirname);
  }
  return {};
};
