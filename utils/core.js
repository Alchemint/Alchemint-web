import BigNumber from 'bignumber.js';

/** 设置config,进行大数运算 */
export const BN = BigNumber.clone();
BN.config({
  DECIMAL_PLACES: 20, //除法截留到20位小数
  ROUNDING_MODE: 3, //直接截留小数(舍入模式)
  EXPONENTIAL_AT: 1e+9,
  RANGE: 100,
  CRYPTO: true,
  MODULO_MODE: 1,
  POW_PRECISION: 0,
  FORMAT: {
    prefix: '',
    decimalSeparator: '.',
    groupSeparator: ',',
    groupSize: 3,
    secondaryGroupSize: 0,
    fractionGroupSeparator: ' ',
    fractionGroupSize: 0,
    suffix: ''
  }
});

/** 格式化时间
 * @param  {Number} timestamp 时间戳
 * @param  {Boolean} isFullTime 是否显示完整时间
 * @return {String} */
export function formatTime(timestamp = new Date(), isFullTime) {
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
export function setDp(val, dp = 8, rm = 3) {
  if (!val && Number(val) !== 0) {
    return;
  }
  let bn = new BN(parseFloat(val));
  let str = bn.toFormat(dp, rm);
  return str;
}

//判断是否是eth地址
export const isValidEthAddress = addressString => /^0x([A-Fa-f0-9]{40})$/.test(addressString);
