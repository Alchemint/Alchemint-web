import {fetchGet} from '../utils/fetch';

export function getSarBType(params) {
  return fetchGet(
    'getsar4BListByType', params
  )
}

export function getSarBHistory(params) {
  return fetchGet(
    'getsarOperatedByaddr', params
  )
}

export function getSarBByName(params) {
  return fetchGet(
    'getSAR4BByName', params
  )
}

/** 获取单个sar的数据
 * @param address 比如：AHgozj1reiiBRh58nhSRUc2pmgLPNTSmcZ
 * @param contractHash 比如:0xb4df68fd65a3ce11c7d55325f95845be100b9710
 * @return sar所有数据
 * */
export function getsar4BDetailByAdd(params) {
  return fetchGet(
    'getsar4BDetailByAdd', params,
  )
}


/** 获取sar列表数据
 * @param 1
 * @param contractHash 比如:0xb4df68fd65a3ce11c7d55325f95845be100b9710
 * @param perPageNum 每页条数
 * @param currentPage 当前第几页
 * @return sar所有数据
 * */
export function getsar4BDetailList(params) {
  return fetchGet(
    'getsar4BDetailList', params
  )
}
