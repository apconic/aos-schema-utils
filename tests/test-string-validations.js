const test = require('tape');
const validateObject = require('../src/schema-validation').validateObject;
const Aoss = require('../src/schema/aoss');

test('Validate string empty check', (assert) => {
  const obj = { firstName: '' };
  const schema = { firstName: Aoss.string('firstName').mandatory() };
  assert.notOk(validateObject(obj, schema).result, 'Validation failed for empty string when it is required');
  assert.end();
});

test('Validate string maximum length check', (assert) => {
  const obj = { firstName: 'Suhail Ansari' };
  const schemaWithMaxLengthOf5 = { firstName: Aoss.string('firstName').maxLen(5) };
  assert.notOk(validateObject(obj, schemaWithMaxLengthOf5).result,
  'Validation failed as string length is greater than 5');

  const schemaWithMaxLengthOf20 = { firstName: Aoss.string('firstName').maxLen(20) };
  assert.ok(validateObject(obj, schemaWithMaxLengthOf20).result,
  'Validation passed as string length is less than 20');
  assert.end();
});

test('Validate string minimum length check', (assert) => {
  const obj = { firstName: 'Suhail Ansari' };
  const schemaWithMinLengthOf20 = { firstName: Aoss.string('firstName').minLen(20) };
  assert.notOk(validateObject(obj, schemaWithMinLengthOf20).result,
  'Validation failed as string length is less than minimum length');
  const schemaWithMinLengthOf5 = { firstName: Aoss.string('firstName').minLen(5) };
  assert.ok(validateObject(obj, schemaWithMinLengthOf5).result,
  'Validation passed as string length is greater than minimum length');
  assert.end();
});


test('Validate string upper case schema', (assert) => {
  const obj = { firstName: 'SUHAIL' };
  const schemaWithUppercase = { firstName: Aoss.string('firstName').uppercase() };
  assert.ok(validateObject(obj, schemaWithUppercase).result, 
  'Validation passed as string is uppercase');

  const objMixedCase = { firstName: 'Suhail' };
  assert.ok(validateObject(objMixedCase, schemaWithUppercase).result,
  'Validation passed as string is converted from mixed case to uppercase.');

  assert.ok(validateObject(objMixedCase, schemaWithUppercase).value.firstName === 'SUHAIL',
  'Validation passed as string is converted from mixed case to uppercase.');

  const objUppercaseWithSpaces = { firstName: 'SUHAIL ANSARI' };
  assert.ok(validateObject(objUppercaseWithSpaces, schemaWithUppercase).result, 
  'Validation passed as string is uppercase and spaces are not considered.');
  assert.end();
});

test('Validate string lower case schema', (assert) => {
  const obj = { firstName: 'suhail' };
  const schemaWithLowercase = { firstName: Aoss.string('firstName').lowercase() };
  assert.ok(validateObject(obj, schemaWithLowercase).result,
  'Validation passed as string is lowercase');

  const objMixedCase = { firstName: 'Suhail' };
  assert.ok(validateObject(objMixedCase, schemaWithLowercase).result,
  'Validation passed and string is converted from  mixed case to lowercase.');

  assert.ok(validateObject(objMixedCase, schemaWithLowercase).value.firstName === 'suhail',
  'Validation passed and string is converted from  mixed case to lowercase.');

  const objUppercaseWithSpaces = { firstName: 'suhail ansari' };
  assert.ok(validateObject(objUppercaseWithSpaces, schemaWithLowercase).result, 
  'Validation passed as string is lowercase and spaces are not considered.');
  assert.end();
});
