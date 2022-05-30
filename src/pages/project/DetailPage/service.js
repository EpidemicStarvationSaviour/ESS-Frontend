import { request } from 'umi';

export async function queryCurrent() {
  return request('/api/user/info', {
    method: 'GET',
  });
}

export async function QueryProject(id, options) {
  return request('/api/group/details/' + id, {
    method: 'GET',
    ...(options || {}),
  });
}

export function EditDetail(id, data, options) {
  return request('/api/group/edit/' + id, {
    data: data,
    method: 'PUT',
    ...(options || {}),
  });
}

export async function DeleteProject(id, options) {
  return request('/api/group/details/' + id, {
    method: 'DELETE',
    ...(options || {}),
  });
}