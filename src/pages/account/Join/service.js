// @ts-ignore

/* eslint-disable */
import { request } from 'umi';

export async function searchGroup(data) {
  return request('/api/group/search', {
    method: 'GET',
    params: data,
  });
}
export async function joinGroup(data) {
  return request('/api/group/join', {
    data,
    method: 'POST',
  });
}
