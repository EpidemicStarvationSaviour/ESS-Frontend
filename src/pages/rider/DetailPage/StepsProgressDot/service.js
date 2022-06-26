import { request } from 'umi';
export async function queryOrder(id) {
  return request('/api/group/details/' + id);
}

export async function groupfd(data) {
  return request('/api/rider/groupfd', {
    method: 'POST',
    data,
  });
}
