import { request } from 'umi';
export async function queryCommodityList(params) {
  return request('/api/commodity/list', {
    params,
  });
}

export async function myCommodityList(params) {
  return request('/api/commodity/my', {
    params,
  });
}
export async function restockCommodity(data) {
  return request('/api/commodity/restock', {
    data,
    method: 'POST',
  });
}
