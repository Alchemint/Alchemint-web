import {find} from 'lodash';

export function filterMethod(val, arr, label = 'label', value = 'value') {
  let tempObj = find(arr, o => o.value === val);
  if (tempObj) {
    return tempObj.label;
  }
  return val;
}

export function filterTime(timestamp = new Date, isFullTime = true) {
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
}

export function numFormat(value) {
  if (!value) return '0.00';

  if (value === '--') {
    return value;
  }

  value = value + '';

  let arr = value.split('.');

  let intPart = arr[0].toString();
  let intPartFormat = intPart.replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');

  if (arr[1]) {
    let floatPart = arr[1].toString();
    return intPartFormat + '.' + floatPart;
  } else {
    return intPartFormat;
  }
}

