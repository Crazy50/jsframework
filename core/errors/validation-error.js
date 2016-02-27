'use strict';

module.exports = Core.Factory.Error({
  extend: require('./bad-request')
  defaultMessage: 'The value does not pass validation'
});
