'use strict';

// returns a constructor (myItem = new MyType) but has a MyType.validate(myItem);
var Type = function Type(schema) {
  // return a constructor for the type
  var construct = function construct(values) {
    for (var prop in schema) {
      if (values.hasOwnProperty(prop)) {
        this[prop] = values[prop];
      } else {
        this[prop] = construct.schema[prop].defaultValue || null;
      }
    }
  }

  construct.schema = schema;
  construct.properties = Object.keys(schema);

  construct.validate = function validate(item) {
    // make sure it has all props defined
    for (var i=this.properties.length; i--;) {
      if (!item.hasOwnProperty(this.properties[i])) {
        return (prop + ' is not defined in the item');
      }
    }

    for (var prop in item) {
      // check if prop should not exist in type
      if (this.properties.indexOf(prop) === -1) {
        return (prop + ' is not defined in the type');
      }

      // check for required
      if (!this.schema[prop].nullable && item[prop] === null) {
        return (prop + ' must not be null');
      }

      // check type

      // check validators
    }

    return null;
  }.bind(construct);

  return construct;
};

module.exports = Type;
