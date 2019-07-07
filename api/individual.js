import {fetchGet} from '../utils/fetch';

export function getSarCHistory(params) {
  return fetchGet(
    'getsar4COperatedBySAR', params
  )
}

export function getSarCListByType(params) {
  return fetchGet(
    'getsar4CListByType', params
  )
}

export function getSarCCount(params) {
  return fetchGet(
    'getsar4ccount', params,
  )
}

export function getSarCByAddr(params) {
  return fetchGet(
    'getOperated4CByaddr', params
  )
}

//获取系统数据
export function getStaticReport(params) {
  return fetchGet(
    'getStaticReport', params
  )
}

/** 获取单个sar的数据
 * @param address 比如：AHgozj1reiiBRh58nhSRUc2pmgLPNTSmcZ
 * @param contractHash 比如:0xb4df68fd65a3ce11c7d55325f95845be100b9710
 * @return sar所有数据
 * */
export function getsar4CDetailByAdd(params) {
  return fetchGet(
    'getsar4CDetailByAdd', params,
  )
}


/** 获取sar列表数据
 * @param 1
 * @param contractHash 比如:0xb4df68fd65a3ce11c7d55325f95845be100b9710
 * @param perPageNum 每页条数
 * @param currentPage 当前第几页
 * @return sar所有数据
 * */
export function getsar4CDetailList(params) {
  return fetchGet(
    'getsar4CDetailList', params
  )
}


export function getUsableUtxoForNEO(params) {
  return fetchGet(
    'getUsableUtxoForNEO', params,
  )
}

/** 获取全局代缴手续费*/
export function getPredictFeeTotal() {
  return fetchGet(
    'predictFeeTotal', []
  )
}

/** 抵押率区间筛选 */
export function processSARFilterByRate(params) {
  return fetchGet(
    'processSARFilterByRate', params
  )
}

/** 交易打包标记UTXO*/
export function setRefundFlagByTxid(params) {
  return fetchGet(
    'setRefundFlagByTxid', params
  )
}

/** 交易失败标记UTXO */
export function setRefundErrorFlagByTxid(params) {
  return fetchGet(
    'setRefundErrorFlagByTxid',params
  )
}
