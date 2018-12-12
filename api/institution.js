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
