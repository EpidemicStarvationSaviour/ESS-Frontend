import { request } from 'umi';

export async function queryList(params) {
  return request('/api/group/list', {
    method: 'GET',
    params: params,
  });
}

export async function queryOwn(params) {
  return request('/api/group/own', {
    method: 'GET',
    params: params,
  });
}

export async function joinGroup(data) {
  return request('/api/group/join', {
    method: 'POST',
    data: data,
  });
}