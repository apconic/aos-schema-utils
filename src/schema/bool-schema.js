const DataType = require('../data-types');

class BoolSchema {
  constructor(name) {
    this.name = name;
    this.fieldType = DataType.Boolean;
    this.defaultValue = false;
  }

  default(defaultValue) {
    this.defaultValue = defaultValue;
    return this;
  }
}

module.exports = BoolSchema;
