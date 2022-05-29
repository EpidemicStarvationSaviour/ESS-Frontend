import { request } from 'umi';
export async function deleteAddress(id) {
  return request('/api/user/address', {
    method: 'DELETE',
    data: {
      address_id: id,
    },
  });
}
export async function setDefaultAddress(id) {
  return request('/api/user/address', {
    method: 'PUT',
    data: {
      address_id: id,
    },
  });
}
export async function newAddress(body) {
  return request('/api/user/address', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
  });
}
