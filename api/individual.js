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
