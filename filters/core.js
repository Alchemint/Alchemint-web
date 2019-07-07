import {find} from 'lodash';
import {BN} from '~/utils/core'

/** 从数组中获取匹配当前value的label
 * @param {String |Number} val
 * @param {Array} arr
 * @param {String} label
 * @param {String | Number} value
 * */
export function filterMethod(val, arr, label = 'label', value = 'value') {
  let tempObj = find(arr, o => o.value === val);
  if (tempObj) {
    return tempObj.label;
  }
  return val;
}

/** 格式化时间
 * @param  {Number} timestamp 时间戳
 * @param  {Boolean} isFullTime 是否显示完整时间
 * @return {String} */
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


/** @param {Number | String}val 转入的值
 *  @param {Number} dp 小数位数 默认位8
 *  @param {Number} rm 舍入模式，默认为3
 *  @return {String} */
export function decimalPlaces(val, dp = 8, rm = 3) {
  if (!val && Number(val) !== 0) {
    return;
  }
  let bn = new BN(parseFloat(val));
  let str = bn.toFormat(dp, rm);
  return str;
}
