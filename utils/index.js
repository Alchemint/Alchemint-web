import math from 'mathjs'

/**
 * time formatting
 * @param  {Number}  timestamp
 * @param  {Boolean} isFullTime
 * @return {String}
 */
const formatTime = function (timestamp = new Date(), isFullTime) {
  let t = new Date(+timestamp);

  function F(s) {
    return s < 10 ? ('0' + s) : s;
  }

  let y = t.getFullYear();
  let M = F(t.getMonth() + 1);
  let d = F(t.getDate());
  let h = F(t.getHours());
  let m = F(t.getMinutes());
  let s = F(t.getSeconds());
  let t1 = y + '-' + M + '-' + d;
  let t2 = t1 + ' ' + h + ':' + m + ':' + s;
  return isFullTime ? t2 : t1;
};

const bigmath = math.create({
  number: 'BigNumber',  // Choose 'number' (default), 'BigNumber', or 'Fraction'
  precision: 32      // 64 by default, only applicable for BigNumbers
});

function printNumber(value, precision = 10) {
  return bigmath.format(
    Number(value),
    {notation: 'fixed', precision: precision}
  );
}

function formatPrecision(value, precision = 8) {
  let val;
  if (typeof value === 'number') {
    val = value.toString();
  } else if (typeof value === 'string') {
    val = value;
  }

  let index = val.indexOf('.');
  let result;
  if (index > -1) {
    result = val.substring(0, val.indexOf('.') + precision + 1);
  } else {
    result = val;
  }
  return printNumber(result, precision);
}

export {
  formatTime,
  formatPrecision,
  bigmath,
  printNumber,
}
