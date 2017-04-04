const DataType = require('../data-types');

class DateSchema {
  constructor(name) {
    this.name = name;
    this.fieldType = DataType.Date;
    this.isRequired = false;
  }

  default(defaultValue) {
    this.defaultValue = defaultValue;
    return this;
  }

  mandatory() {
    this.isRequired = true;
    return this;
  }
}

module.exports = DateSchema;
