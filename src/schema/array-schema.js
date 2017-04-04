const DataType = require('../data-types');
const cloneDeep = require('lodash').cloneDeep;

class ArraySchema {
  constructor(name) {
    this.name = name;
    this.fieldType = DataType.Array;
  }

  default(defaultArray = []) {
    this.defaultValue = cloneDeep(defaultArray);
    return this;
  }

  length(val) {
    this.length = val;
    return this;
  }

  maxItems(val) {
    this.maxItems = val;
    return this;
  }

  minItems(val) {
    this.minItems = val;
    return this;
  }
}

module.exports = ArraySchema;
