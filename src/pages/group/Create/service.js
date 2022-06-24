import { request } from 'umi';
export async function submitForm(params) {
  return request('/api/group/create', {
    method: 'POST',
    data: params,
  });
}

export async function queryCurrent() {
  return request('/api/user/info', {
    method: 'GET',
  });
}

export async function queryOwn(params) {
  return request('/api/group/own', {
    method: 'GET',
    data: params,
  });
}

export async function queryCommodityList(options) {
  return request('/api/commodity/list', {
    method: 'GET',
    ...(options || {}),
  });
}