import {fetchGet, fetchPost} from '../utils/fetch';

export function sendDrawTransaction(params) {
  return fetchPost(
    'sendrawtransaction', params
  )
}

export function getDrawTransaction(params) {
  return fetchGet(
    'getrawtransaction', params
  )
}


export function getBlockTime(params) {
  return fetchGet(
    'getblocktime', params
  )
}

export function invokeScript(params) {
  return fetchGet(
    'invokescript', params
  )
}

export function getUtxo(params) {
  return fetchGet(
    'getutxo', params,
  )
}

export function getStorage(params) {
  return fetchGet(
    'getstorage', params
  )
}

export function getContractState(params) {
  return fetchPost(
    'getcontractstate', params,
  )
}

export function getBlockCount(params) {
  return fetchGet(
    'getblockcount', params
  )
}

export function getOracleOperation(params) {
  return fetchGet(
    'getOracleOperated', params)
}

export function getNgdBlockCount(params) {
  return fetchGet(
    'getngdblockcount', params
  )
}

export function getOperatedFee(params) {
  return fetchGet(
    'getOperatedFee', params
  )
}

/** 获取所有资产列表
 * @param  String address 比如：AHgozj1reiiBRh58nhSRUc2pmgLPNTSmcZ
 * @return Array 包含价格和数量的资产列表 */
export function getAllassetBalance(params) {
  return fetchGet(
    'getAllassetBalance', params,
  )
}

/** 获取所有oracle配置参数
 * @param 四种情况：
 * 1. 不传参，返回所有typeA和typeB
 * 2. 传typeA/typeB 返回各自所有值
 * 3. typeA、key  返回单个值
 * 4. typeB、key  返回单个值 */

export function getOracleConfig(params) {
  return fetchGet(
    'getOracleConfig', params,
  )
}

/** 获取txid详情 */
export function getTxDetail(params) {
  return fetchGet(
    'getTxDetail', params,
  )
}
