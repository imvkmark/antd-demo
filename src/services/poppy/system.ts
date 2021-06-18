import { request } from 'umi';
import { ApiPoppy } from '@/services/poppy/typings';

/**
 * 登录
 * @param {object} params
 * @param {object} options
 */
export async function apiAuthLogin(params: ApiPoppy.AuthLoginParams, options?: { [key: string]: any }) {
    return request<any>('/api_v1/system/auth/login', {
        method: 'POST',
        params: { ...params },
        ...(options || {})
    });
}

/**
 * 获取用户信息
 */
export async function apiAuthAccess() {
    return request<any>('/api_v1/system/auth/access', {
        method: 'POST'
    });
}