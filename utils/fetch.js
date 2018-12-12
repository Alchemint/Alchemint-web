import axios from 'axios'
import {envs} from '../utils/const'
import {find} from 'lodash'

export function fetchGet(method, params) {
  let env = process.env._ENV;
  let currentObj = find(envs, o => o.name === env);
  let baseUrl = currentObj.apiUrl;
  return new Promise((resolve, reject) => {
    axios({
      method: 'get',
      baseURL: baseUrl,
      params: {
        jsonrpc: 2,
        id: 1,
        method: method,
        params: JSON.stringify(params),
      },
      timeout: 4000000,
      headers: {
        'X-Requested-With': 'XMLHttpRequest'
      }
    }).then(response => {
      if (response.data) {
        resolve(response.data);
      } else {
        reject(response)
      }
    }).catch(err => {
      reject(err)
    })
  })
}

export function fetchPost(method, params) {
  let env = process.env._ENV;
  let currentObj = find(envs, o => o.name === env);
  let baseUrl = currentObj.apiUrl;
  return new Promise((resolve, reject) => {
    axios({
      method: 'post',
      baseURL: baseUrl,
      data: {
        "jsonrpc": "2.0",
        "method": method,
        "id": "1",
        "params": params,
      },
      timeout: 4000000,
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json; charset=UTF-8'
      }
    }).then(response => {
      if (response.data) {
        resolve(response.data);
      } else {
        reject(response)
      }
    }).catch(err => {
      reject(err);
    })
  })
}

