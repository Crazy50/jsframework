'use strict';

function defaultMessage(prop) {
  return 'The value for ' + prop + ' is invalid';
}

// TODO: maybe a way to reference the value within the message?
// more TODO: refactor so certain Types have certain validators available
// and also handle string, number, etc
function confirmValidator(value, validator, message) {
  // we don't handle Array here, only at the top most level
  if (validator instanceof RegExp) {
    if (!validator.test(value)) {
      return message;
    }
  } else if (validator instanceof Function) {
    // TODO: maybe async validators?
    if (!validator(value)) {
      return message;
    }
  } else if (validator instanceof Object) {
    if (validator.validator) {
      return confirmValidator(value, validator.validator, validator.message || defaultMessage(prop));
    }
  } else {
    // TODO: uhm. probably invalid validator
    throw new Exception('Invalid validator for ' + prop);
  }

  return null;
}

var Validator = function Validator(options) {
  var params = options.params || {};
  // strict mode makes sure there isn't extra parameters
  var strict = options.strict || false;

  return function(values) {
    var prop;
    if (strict) {
      for (prop in values) {
        if (!(prop in params)) {
          // TODO: maybe we return error? throw it? wat do?
          return prop + ' is not a valid parameter';
        }
      }
    }

    for (prop in params) {
      var paramInfo = params[prop];
      var val = values[prop];

      // TODO: not convinced this is the best way to tell
      if (paramInfo instanceof Function) {
        if (!(val instanceof paramInfo)) {
          return prop + ' is not the correct type';
        }
      } else if (paramInfo instanceof Object) {
        if (paramInfo.type && !(val instanceof paramInfo.type)) {
          return prop + ' is not the correct type';
        }

        if (paramInfo.validator) {
          if (paramInfo.validator instanceof Array) {
            for (var i=0; i < paramInfo.validator.length; i++) {
              var ret = confirmValidator(val, paramInfo.validator[i], defaultMessage(prop));
              if (ret) {
                return ret;
              }
            }
          } else {
            var ret = confirmValidator(val, paramInfo.validator, defaultMessage(prop));
            if (ret) {
              return ret;
            }
          }
        }
      } else {
        var ret = confirmValidator(val, paramInfo, defaultMessage(prop));
        if (ret) {
          return ret;
        }
      }
    }

    return null;
  }
};

module.exports = Validator;
