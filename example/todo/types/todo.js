'use strict';

module.exports = Type({
  message: {
    validators: /\\w+/ // maybe a function, maybe an array, maybe an object with a custom error message
  },
  complete: {}
});
