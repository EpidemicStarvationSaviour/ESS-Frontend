import { request } from 'umi';
export async function queryCurrent() {
  return request('/api/user/info', {
    method: 'GET',
  });
}
export async function queryProvince() {
  return request('/api/geographic/province');
}
export async function queryCity(province) {
  return request(`/api/geographic/city/${province}`);
}
export async function query() {
  return request('/api/users');
}

export async function updateInfo(body) {
  return request('/api/user/modify/info', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
  });
}
