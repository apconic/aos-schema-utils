const test = require('tape');
const validateObject = require('../src/schema-validation').validateObject;

test('Default value tests', (assert) => {
  const validObject = { val: null };
  const schema = { val: { fieldType: 'NUMBER', defaultValue: 12 } };
  assert.ok(
    validateObject(validObject, schema).value.val === 12,
    'Default value populated.'
  );
  assert.end();
});

test('Validation failed on invalid fields', (assert) => {
  const objectWithInvalidFields = { val: 1, val2: 2 };
  const schema = { val: { fieldType: 'NUMBER' }};
  assert.notOk(
    validateObject(objectWithInvalidFields, schema, true).result,
    'Validation failed as object has field not present in schema'
  );

  assert.ok(
    validateObject(objectWithInvalidFields, schema).result,
    'Validation passed.'
  );
  assert.end();
});

test('Validation test for string', (assert) => {
  const validObject = { val: '2' };
  const schema = { val: { fieldType: 'STRING' } };
  assert.ok(
    validateObject(validObject, schema).result,
    'Validate object passed.'
  );

  const invalidNullObject = { val: null };
  const schemaWithRequired = { val: { fieldType: 'STRING', isRequired: true } };
  assert.notOk(
    validateObject(invalidNullObject, schemaWithRequired).result,
    'Validation correctly failed as val is required'
  );

  const invalidUndefinedObject = { val: undefined };
  assert.notOk(
    validateObject(invalidUndefinedObject, schemaWithRequired).result,
    'Validation correctly failed as val is required'
  );

  const invalidObject = { val: 2 };
  assert.notOk(
    validateObject(invalidObject, schema).result,
    'Validate object failed'
  );

  const validNullObject = { val: null };
  assert.ok(
    validateObject(validNullObject, schema).result,
    'Validate object passed with optional field with null value'
  );

  const validUndefinedObject = { val: undefined };
  assert.ok(
    validateObject(validUndefinedObject, schema).result,
    'Validate object passed with optional field with null value'
  );

  const alphanumericObject = { val: 'ABCD123' };
  const schemaWithRegex = { val: { fieldType: 'STRING', validationRegex: '^[A-Za-z0-9]+$' } };
  assert.ok(
    validateObject(alphanumericObject, schemaWithRegex).result,
    'Validate object passed with a regex for alphanumeric'
  );

  const notAlphaNumericObject = { val: 'ASBC$$21' };
  assert.notOk(
    validateObject(notAlphaNumericObject, schemaWithRegex).result,
    'Validate object failed with a regex for alphanumeric'
  );

  assert.end();
});

test('Validate number values', (assert) => {
  const validObject = { val: 1 };
  const schema = { val: { fieldType: 'NUMBER' } };
  assert.ok(validateObject(validObject, schema).result, 'Object is valid');

  const objectWithString = { val: '1' };
  assert.notOk(
    validateObject(objectWithString, schema).result,
    'Validation correctly failed when number is passed as string'
  );

  const objectWithNull = { val: null };
  assert.ok(
    validateObject(objectWithNull, schema).result,
    'Validation passed as val is optional and can be null'
  );

  const objectWithUndefined = { val: null };
  assert.ok(
    validateObject(objectWithUndefined, schema).result,
    'Validation passed as val is optional and can be undefined'
  );

  const numberIsAboveMinValue = { val: 102 };
  const schemaWithMinValue = { val: { fieldType: 'NUMBER', minValue: 100} };
  assert.ok(validateObject(numberIsAboveMinValue, schemaWithMinValue).result,
    'Validation passed when number is above min value in schema'
  );

  const numberIsBelowMinValue = { val: 99 };
  assert.notOk(validateObject(numberIsBelowMinValue, schemaWithMinValue).result,
    'Validation fails when number is below min value in schema'
  );

  const numberIsEqualToMinValue = { val: 100 };
  assert.ok(
    validateObject(numberIsEqualToMinValue, schemaWithMinValue).result,
    'Validation passes when number is equal to minValue'
  );

  const numberIsBelowMaxValue = { val: 99 };
  const schemaWithMaxValue = { val: { fieldType: 'NUMBER', maxValue: 100 } };
  assert.ok(validateObject(numberIsBelowMaxValue, schemaWithMaxValue).result,
    'Validation passes when number is below max value'
  );

  const numberIsEqualToMaxValue = { val: 100 };
  assert.ok(
    validateObject(numberIsEqualToMaxValue, schemaWithMaxValue).result,
    'Validation passes when number is equal to maxValue'
  );

  const numberIsAboveMaxValue = { val: 102 };
  assert.notOk(
    validateObject(numberIsAboveMaxValue, schemaWithMaxValue).result,
    'Validation fails when number is above max value'
  );

  const numberIsValid = { val: 120 };
  const schemaWithMaxAndMinValue = { val: { fieldType: 'NUMBER', minValue: 100, maxValue: 150 } };
  assert.ok(validateObject(numberIsValid, schemaWithMaxAndMinValue).result,
    'Validation passes when number is between min and max values'
  );

  assert.end();
});


test('Validation of date type', (assert) => {
  const nullDate = { val: null };
  const schemaWithDateFieldOptional = { val: { fieldType: 'DATE' } };
  const schemaWithDateFieldMandatory = { val: { fieldType: 'DATE', isRequired: true } };
  const schemaWithTimeFieldOptional = { val: { fieldType: 'TIME' } };
  const schemaWithTimeFieldMandatory = { val: { fieldType: 'TIME', isRequired: true } };
  assert.ok(
    validateObject(nullDate, schemaWithDateFieldOptional).result,
    'Validation passes as null value are allowed for optional fields'
  );

  const undefinedDate = { val: undefined };
  assert.ok(
    validateObject(undefinedDate, schemaWithDateFieldOptional).result,
    'Validation passes as undefined value are allowed for optional fields'
  );

  const validDate = { val: new Date() };
  assert.ok(
    validateObject(validDate, schemaWithDateFieldOptional).result,
    'Validation passes when valid date is provided.'
  );

  assert.notOk(
    validateObject(nullDate, schemaWithDateFieldMandatory).result,
    'Validation fails as null value are not allowed for mandatory fields'
  );

  assert.notOk(
    validateObject(undefinedDate, schemaWithDateFieldMandatory).result,
    'Validation fails as undefined value are not allowed for mandatory fields'
  );

  assert.ok(
    validateObject(validDate, schemaWithDateFieldMandatory).result,
    'Validation passes when valid date is provided and mandatory.'
  );

  assert.ok(
    validateObject(validDate, schemaWithTimeFieldMandatory).result,
    'Validation passes when valid date is provided and mandatory.'
  );

  assert.ok(
    validateObject(nullDate, schemaWithTimeFieldOptional).result,
    'Validation passes as null value are allowed for optional fields'
  );

  assert.ok(
    validateObject(undefinedDate, schemaWithTimeFieldOptional).result,
    'Validation passes as undefined value are allowed for optional fields'
  );

  assert.ok(
    validateObject(validDate, schemaWithTimeFieldOptional).result,
    'Validation passes when valid date is provided.'
  );

  assert.notOk(
    validateObject(nullDate, schemaWithTimeFieldMandatory).result,
    'Validation fails as null value are not allowed for mandatory fields'
  );

  assert.notOk(
    validateObject(undefinedDate, schemaWithTimeFieldMandatory).result,
    'Validation fails as undefined value are not allowed for mandatory fields'
  );

  assert.end();
});

test('Validate array', (assert) => {
  const validArray = { val: [1, 2, 3] };
  const invalidArrayField = { val: '1' };
  const schema = { val: { fieldType: 'ARRAY', defaultValue: [] } };
  assert.ok(
    validateObject(validArray, schema).result,
    'Validation passes for valid array'
  );

  assert.notOk(
    validateObject(invalidArrayField, schema).result,
    'Validation fails for array when field is string for mandatory field'
  );

  const nullArray = { val: null };
  assert.ok(
    validateObject(nullArray, schema).result,
    'Validation passes for null array for optional field'
  );

  assert.ok(
    validateObject(nullArray, schema).value.val.length === 0,
    'Validation passed empty array for optional field'
  );

  const undefinedArray = { val: undefined };
  assert.ok(
    validateObject(undefinedArray, schema).result,
    'Validation passes for undefined array for optional field'
  );

  const schemaWithMandatoryField = { val: { fieldType: 'ARRAY', isRequired: true } };
  assert.ok(
    validateObject(validArray, schemaWithMandatoryField),
    'Validation passes for valid array'
  );

  assert.notOk(
    validateObject(nullArray, schemaWithMandatoryField).result,
    'Validation fails for null array for mandatory field'
  );

  assert.notOk(
    validateObject(undefinedArray, schemaWithMandatoryField).result,
    'Validation fails for undefined array for mandatory field'
  );

  assert.end();
});
