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
  //没有数值的情况
  if (!value) return '0.00';

  //value为--
  if (value === '--') {
    return value;
  }

  value = value + ''; //将数值转换为字符串

  let arr = value.split('.');

  let intPart = arr[0].toString(); //获取整数部分
  let intPartFormat = intPart.replace(/(\d)(?=(?:\d{3})+$)/g, '$1,'); //将整数部分逢三一断

  if (arr[1]) {
    let floatPart = arr[1].toString(); //获取小数部分
    return intPartFormat + '.' + floatPart;
  } else {
    return intPartFormat;
  }
}

