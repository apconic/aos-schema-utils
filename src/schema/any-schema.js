const DataType = require('../data-types');

class AnySchema {
  constructor(name) {
    this.name = name;
    this.fieldType = DataType.Any;
  }

  mandatory() {
    this.isRequired = true;
    return this;
  }
}

module.exports = AnySchema;
