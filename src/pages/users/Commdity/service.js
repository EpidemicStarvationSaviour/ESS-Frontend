import { request } from 'umi';
export async function queryCommodityList(params) {
  return request('/api/commodity/list', {
    params,
  });
}

export async function addCommodity(data) {
  return request('/api/commodity/add', {
    data,
    method: 'POST',
  });
}
export async function deleteCommodity(id) {
  return request('/api/commodity/delete', {
    data: { id },
    method: 'DELETE',
  });
}
