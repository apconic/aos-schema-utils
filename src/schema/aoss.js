const NumberSchema = require('./number-schema');
const StringSchema = require('./string-schema');
const DateSchema = require('./date-schema');
const BoolSchema = require('./bool-schema');
const ArraySchema = require('./array-schema');

class Aoss {
  static number(name) {
    return new NumberSchema(name);
  }

  static string(name) {
    return new StringSchema(name);
  }

  static date(name) {
    return new DateSchema(name);
  }

  static bool(name) {
    return new BoolSchema(name);
  }

  static array(name) {
    return new ArraySchema(name);
  }
}

module.exports = Aoss;
