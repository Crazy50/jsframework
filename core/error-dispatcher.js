'use strict';

var sendHtml = require('../base-html');

module.exports = function ErrorDispatcher(request, response, error) {
  var statusCode = error.statusCode || 500;

  /*

    make an Error factory?
      creates a handler
    have defaults

  */

};
