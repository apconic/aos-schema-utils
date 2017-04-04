const DataType = require('../data-types');

class StringSchema {
  constructor(name) {
    this.name = name;
    this.fieldType = DataType.String;
    this.isRequired = false;
    this.defaultValue = '';
  }

  default(defaultValue) {
    this.defaultValue = defaultValue;
    return this;
  }

  mandatory() {
    this.isRequired = true;
    return this;
  }

  regex(validationRegex) {
    this.validationRegex = validationRegex;
    return this;
  }

  trim() {
    this.truncate = true;
    return this;
  }

  lowercase() {
    this.lowerCase = true;
    return this;
  }

  uppercase() {
    this.upperCase = true;
    return this;
  }

  maxLen(value) {
    if (value < 0) {
      throw new Error('Value should be greater than 0.')
    }
    this.maxLength = value;
    return this;
  }

  minLen(value) {
    if (value < 0) {
      throw new Error('Value should be greater or equal to 0.')
    }
    this.minLength = value;
    return this;
  }
}

module.exports = StringSchema;
