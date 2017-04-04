const DataType = require('../data-types');

class NumberSchema {
  constructor(name) {
    this.name = name;
    this.fieldType = DataType.Number;
    this.isRequired = false;
    this.decimalPlaces = 0;
    this.defaultValue = 0;
  }

  default(defaultValue) {
    this.defaultValue = defaultValue;
    return this;
  }

  decimal(decimalPlaces) {
    this.decimalPlaces = decimalPlaces;
    return this;
  }

  min(minValue) {
    this.minValue = minValue;
    return this;
  }

  max(maxValue){
    this.maxValue = maxValue;
    return this;
  }

  mandatory() {
    this.isRequired = true;
    return this;
  }
}

module.exports = NumberSchema;

