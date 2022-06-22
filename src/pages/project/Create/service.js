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

export async function queryGroupList(params) {
  return request('/api/group/list', {
    method: 'GET',
    data: params,
  });
}
