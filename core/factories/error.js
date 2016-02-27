'use strict';

var ErrorFactory = function ErrorFactory(options) {
  var BaseClass = options.extend || Error;
  var defaultError = options.defaultMessage || 'An error occurred';

  // it should support both "new" syntax or the Factory pattern. everything else is factory pattern.
  // but, need instanceof for the Errors.
  var CustomError = function CustomError(message) {
    if (!(this instanceof CustomError)) {
      return new CustomError(message);
    }

    BaseClass.call(this);

    if (options.statusCode) {
      this.statusCode = options.statusCode;
    } else if (!this.statusCode) {
      // only if the parent class never set it
      this.statusCode = 500;
    }

    this.message = message || defaultError;
  };
  CustomError.prototype = Object.create(BaseClass.prototype);
  CustomError.prototype.constructor = CustomError;

  return CustomError;
};

module.exports = ErrorFactory;
