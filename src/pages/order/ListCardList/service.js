import { request } from 'umi';
export async function queryList(params) {
  return request('/api/group/list', {
    params: params,
  });
}
