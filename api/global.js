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
