import { request } from 'umi';
export async function reportPos(data) {
    return request('/api/rider/pos', {
        method: 'POST',
        data: data,
    });
}

export async function queryNext(params) {
    return request('/api/rider/query', {
        method: 'GET',
        params: params,
    });
}

export async function queryList(params) {
    return request('/api/group/list', {
        method: 'GET',
        params: params,
    });
}

export async function riderStart(data) {
    return request('/api/rider/start', {
        method: 'POST',
        data: data,
    });
}

export async function riderStop(data) {
    return request('/api/rider/stop', {
        method: 'POST',
        data: data,
    });
}