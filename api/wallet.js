import { fetchGet, fetchPost } from "../utils/fetch";

//nep5 assets
export function getAllNep5Assets(params) {
  return fetchGet("getallnep5assetofaddress", params);
}

//nep55 assets
export function getAllNep55Assets(params) {
  return fetchGet("getallnep55assetofaddress", params);
}

//global assets
export function getAllGlobalAssets(params) {
  return fetchGet("getbalance", params);
}

//nep5 transfer
export function getNep5Transfer(params) {
  return fetchGet("getnep5transferbyaddress", params);
}

//nep5 transfer count
export function getNep5TransferCount(params) {
  return fetchGet("getnep5transferbyaddresscount", params);
}

//nep55 transfer
export function getNep55Transfer(params) {
  return fetchGet("getnep55transfersbyaddress", params);
}

//nep55 transfer count
export function getNep55TransferCount(params) {
  return fetchGet("getnep55transfersbyaddresscount", params);
}

//global transfer
export function getGlobalTransfer(params) {
  return fetchGet("getTransByAddress", params);
}

//global transfer count
export function getGlobalTransferCount(params) {
  return fetchGet("getTransByAddresscount", params);
}

//global transfer detail
export function getGlobalTransferDetail(params) {
  return fetchGet("getTxByTxid", params);
}

//all nep5 contract hash
export function getAllNep5Hash() {
  return fetchPost("getallnep5asset");
}
/**
 *
 * @param {*} params
 * lockHash:0x85d3e487098b43fb1df5d2ca5d5201bdb19cc43d,
 * userAddr:AZ77FiX7i9mRUPF2RyuJD2L8kS6UDnQ9Y7
 */
export function getLockListByAddr(params) {
  return fetchPost("getLockListByAdd", params);
}

/**
 *
 * @param {*} params
 * userAddr:AZ77FiX7i9mRUPF2RyuJD2L8kS6UDnQ9Y7,
 * pageNum: 10,
 * currentPage:1,
 */
export function getLockHistory(params) {
  return fetchGet("getLockHistory", params);
}

export function getLockTypeByAddr(params) {
  return fetchGet("getLockTypeByAdd", params);
}
