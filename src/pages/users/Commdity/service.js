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
