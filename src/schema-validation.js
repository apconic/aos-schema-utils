const isEmpty = require('lodash').isEmpty;
const toUpper = require('lodash').toUpper;
const forOwn = require('lodash').forOwn;
const isString = require('lodash').isString;
const omit = require('lodash').omit;
const isNumber = require('lodash').isNumber;
const validator = require('validator');
const DataType = require('./data-types');
const Util = require('./util');
const isArray = require('lodash').isArray;
const keys = require('lodash').keys;
const isDate = require('lodash').isDate;
const isEqual = require('lodash').isEqual;

const { isNullOrUndefined, isDefined } = Util;

const createError = msg => ({ result: false, error: msg });

const createSuccess = value => ({ result: true, value });

const isLessThanMinValue = (value, minValue) => {
  if (Util.isNullOrUndefined(minValue)) {
    return false;
  }

  if (Util.isNullOrUndefined(value)) {
    return true;
  } else if (value < minValue) {
    return true;
  }
  return false;
};

const isGreaterThanMaxValue = (value, maxValue) => {
  if (Util.isNullOrUndefined(maxValue)) {
    return false;
  }
  if (Util.isNullOrUndefined(value)) {
    return true;
  } else if (value > maxValue) {
    return true;
  }
  return false;
};

const isValid = (text, validatorToUse) => {
  if (!validatorToUse) {
    return true;
  }

  if (!isEmpty(text) && !validator[validatorToUse](`${text}`)) {
    return false;
  }
  return true;
};

const isValidRegex = (text, validationRegex) => {
  if (Util.isNullOrUndefined(text) || Util.isNullOrUndefined(validationRegex)) {
    return true;
  }
  const pattern = new RegExp(validationRegex);
  const response = text.match(pattern);
  if (!response) {
    return false;
  }
  return true;
};

function validateDataAgainstSchema(name, value, schema) {
  if (Util.isNullOrUndefined(schema)) {
    return createError('Schema is undefined');
  }

  switch (toUpper(schema.fieldType)) {
    case DataType.Array:
      if (schema.isRequired && isNullOrUndefined(value)) {
        return createError(`${name} is required`);
      }

      if (isNullOrUndefined(value)) {
        return createSuccess();
      }

      if (!isArray(value)) {
        return createError(`${name} is not an array`);
      }
      return createSuccess();
    case DataType.Any:
      if (schema.isRequired && (isNullOrUndefined(value) || isEmpty(value))) {
        return createError(`${name} is required`);
      }
      if (isNullOrUndefined(value)) {
        return createSuccess();
      }
      return createSuccess();
    case DataType.String:
      if (schema.isRequired && (isNullOrUndefined(value) || isEmpty(value))) {
        return createError(`${name} is required`);
      }

      if (isNullOrUndefined(value)) {
        return createSuccess();
      }

      if (!isString(value)) {
        return createError(`${name} is not a string`);
      }

      if (!isValid(value, schema.validatorType)) {
        return createError(`${name} is invalid`);
      }

      if (!isValidRegex(value, schema.validationRegex)) {
        return createError(`${name} is invalid`);
      }

      return createSuccess();
    case DataType.Number:
      if (schema.isRequired && (isNullOrUndefined(value) || isEmpty(value))) {
        return createError(`${name} is required`);
      }

      if ((isNullOrUndefined(schema.minValue)
      && isNullOrUndefined(schema.maxValue))
      && isNullOrUndefined(value)) {
        return createSuccess();
      }

      if (!isNumber(value)) {
        return createError(`${name} is not a number`);
      }

      if (isLessThanMinValue(value, schema.minValue)) {
        return createError(`${name} is less than minimum value ${schema.minValue}`);
      }

      if (isGreaterThanMaxValue(value, schema.maxValue)) {
        return createError(`${name} = ${value} is greater than maximum value ${schema.maxValue}`);
      }

      return createSuccess();
    case DataType.Date:
    case DataType.Time:
      if (schema.isRequired && isNullOrUndefined(value)) {
        return createError(`${name} is required`);
      }

      if (isNullOrUndefined(value)) {
        return createSuccess();
      }

      if (!isDate(value)) {
        return createError(`${name} is not date`);
      }

      return createSuccess();
    default:
      return createSuccess();
  }
}

function validateSingleField(name, value, schema) {
  let fieldValue = value;
  if (isNullOrUndefined(schema)) {
    return createError('Schema is required');
  }

  if (isNullOrUndefined(value) && isDefined(schema.defaultValue)) {
    fieldValue = schema.defaultValue;
  }

  // If the field is array type than initialize it to an empty Array
  // if value is null or undefined.
  if (toUpper(schema.fieldType) === 'ARRAY' && isNullOrUndefined(fieldValue)) {
    fieldValue = [];
  }


  // Fix number of places after decimal
  const validationResult = validateDataAgainstSchema(name, value, schema);
  if (!validationResult.result) {
    return validationResult;
  }

  if (validationResult.result && (toUpper(schema.fieldType) === 'NUMBER')) {
    fieldValue = Util.fixDouble(fieldValue, schema.decimalPlaces);
  }
  return { result: validationResult.result, value: fieldValue };
}

module.exports.validateObject = (data, schema, failOnFieldNotInSchema = false) => {
  if (isEmpty(data) && isEmpty(schema)) {
    return createSuccess();
  }

  const outputData = {};
  let retValue = { result: true };
  const objectKeys = keys(schema).sort();
  const dataKeys = keys(data).sort();

  if (failOnFieldNotInSchema) {
    const fieldNotInSchema = dataKeys.filter(element =>
      !objectKeys.find(schemaElement => schemaElement === element)
    );

    if (fieldNotInSchema.length > 0) {
      // This means we need to return an error
      return createError(`Fields ${fieldNotInSchema.toString()} present in object which are not present in schema`);
    }
  }

  for (let index = 0; index < objectKeys.length; index += 1) {
    const key = objectKeys[index];
    retValue = validateSingleField(key, data[key], schema[key]);
    if (retValue.result) {
      outputData[key] = retValue.value;
    } else {
      return retValue;
    }
  }

  // output data only contain data which is present in schema and nothing
  // else.
  return { result: true, value: outputData };
};
