const toNumber = require('lodash').toNumber;
const isNumber = require('lodash').isNumber;
const isNull = require('lodash').isNull;
const isUndefined = require('lodash').isUndefined;
const forOwn = require('lodash').forOwn;

module.exports = {
  isNullOrUndefined(value) {
    return isNull(value) || isUndefined(value);
  },

  isDefined(value) {
    return !(isNull(value) || isUndefined(value));
  },

  createError(msg) {
    return { result: false, error: msg };
  },

  createSuccess(value) {
    return { result: true, value };
  },

  isLessThanMinValue(value, minValue){
    if (isNull(minValue) || isUndefined(minValue)) {
      return false;
    }

    if (isNull(value) || isUndefined(value)) {
      return true;
    } else if (value < minValue) {
      return true;
    }
    return false;
  },

  isGreaterThanMaxValue(value, maxValue) {
    if (isNull(maxValue) || isUndefined(maxValue)) {
      return false;
    }
    if (isNull(value) || isUndefined(value)) {
      return true;
    } else if (value > maxValue) {
      return true;
    }
    return false;
  },

  getDefaultValues(formSchema) {
    const defaultValues = {};
    forOwn(formSchema, (value, key) => {
      if (value && value.defaultValue) {
        defaultValues[key] = value.defaultValue;
      }
    });
    return defaultValues;
  },

  numToWord(inputNumber) {
    const str = `${inputNumber}`;
    const splt = str.split('');
    const rev = splt.reverse();
    const once = ['Zero', ' One', ' Two', ' Three', ' Four', ' Five',
      ' Six', ' Seven', ' Eight', ' Nine'];
    const twos = ['Ten', ' Eleven', ' Twelve', ' Thirteen',
      ' Fourteen', ' Fifteen', ' Sixteen', ' Seventeen', ' Eighteen', ' Nineteen'];
    const tens = ['', 'Ten', ' Twenty', ' Thirty', ' Forty',
      ' Fifty', ' Sixty', ' Seventy', ' Eighty', ' Ninety'];

    const numLength = rev.length;
    const word = [];
    let j = 0;
    let i = 0;

    for (i = 0; i < numLength; i += 1) {
      switch (i) {

        case 0:
          if ((rev[i] === 0) || (rev[i + 1] === 1)) {
            word[j] = '';
          } else {
            word[j] = `${once[rev[i]]}`;
          }
          word[j] = word[j];
          break;

        case 1:
          aboveTens();
          break;

        case 2:
          if (rev[i] === 0) {
            word[j] = '';
          } else if ((rev[i - 1] === 0) || (rev[i - 2] === 0)) {
            word[j] = `${once[rev[i]]}  Hundred`;
          } else {
            word[j] = `${once[rev[i]]} Hundred and`;
          }
          break;

        case 3:
          if (rev[i] === 0 || rev[i + 1] === 1) {
            word[j] = '';
          } else {
            word[j] = once[rev[i]];
          }
          if ((rev[i + 1] !== 0) || (rev[i] > 0)) {
            word[j] = `${word[j]} Thousand`;
          }
          break;

        case 4:
          aboveTens();
          break;

        case 5:
          if ((rev[i] === 0) || (rev[i + 1] === 1)) {
            word[j] = '';
          } else {
            word[j] = once[rev[i]];
          }
          if (rev[i + 1] !== '0' || rev[i] > '0') {
            word[j] = `${word[j]} Lakh`;
          }
          break;

        case 6:
          aboveTens();
          break;

        case 7:
          if ((rev[i] === 0) || (rev[i + 1] === 1)) {
            word[j] = '';
          } else {
            word[j] = once[rev[i]];
          }
          if (rev[i + 1] !== '0' || rev[i] > '0') {
            word[j] = `${word[j]} Crore`;
          }
          break;
        case 8:
          aboveTens();
          break;
        default: break;
      }
      j += 1;
    }

    function aboveTens() {
      if (rev[i] === 0) {
        word[j] = '';
      } else if (rev[i] === 1) {
        word[j] = twos[rev[i - 1]];
      } else {
        word[j] = tens[rev[i]];
      }
    }

    word.reverse();
    let finalOutput = '';
    for (i = 0; i < numLength; i += 1) {
      finalOutput = finalOutput + word[i];
    }
    return finalOutput;
  },

  stringToNumber(value) {
    return toNumber(value);
  },

  fixDouble(value, decimalPlaces = 0) {
    if (isNumber(value)) {
      const valueInString = value.toFixed(decimalPlaces);
      return toNumber(valueInString);
    }
    return value;
  },
};
