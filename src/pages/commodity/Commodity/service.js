import { request } from 'umi';
export async function queryList(params) {
  return request('/api/commodity/list', {
    params,
  });
}

export async function queryMyList(params) {
  return request('/api/commodity/my', {
    params,
  });
}

export async function updateMyList(params) {
  return request('/api/commodity/restock', {
    params,
  });
}