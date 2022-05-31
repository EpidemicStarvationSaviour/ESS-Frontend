import { request } from 'umi';
export async function SubmitForm(params) {
  return request('/api/group/create', {
    method: 'POST',
    data: params,
  });
}

export async function QueryCurrent() {
  return request('/api/user/info', {
    method: 'GET',
  });
}

export async function QueryGroupList(params) {
  return request('/api/group/list', {
    method: 'GET',
    data: params,
  });
}
