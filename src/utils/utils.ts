import {clone, forEach, isBoolean, keys} from 'lodash-es'
import md5 from 'crypto-js/md5';
import {basePath, storageKey, version} from '@/utils/conf';
import {domain, localStore as _localStore} from '@popjs/util';

/* eslint no-useless-escape:0 import/prefer-default-export:0 */
const reg =
    /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export const isUrl = (path: string): boolean => reg.test(path);

export const isAntDesignPro = (): boolean => {
    if (ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
        return true;
    }
    return window.location.hostname === 'preview.pro.ant.design';
};

// 给官方演示站点用，用于关闭真实开发环境不需要使用的特性
export const isAntDesignProOrDev = (): boolean => {
    const {NODE_ENV} = process.env;
    if (NODE_ENV === 'development') {
        return true;
    }
    return isAntDesignPro();
};
export const requestParam = (params: object) => {
    forEach(params, function (value, key) {
        if (isBoolean(value)) {
            params[key] = value ? '1' : '0';
        }
    });
    return params;
}

/**
 * 实现localStorage缓存的 存, 取, 删操作
 * @param key 对象, 批量设置
 * @param val 有值:设置; 无值: 获取; null, 删除;
 */
export const localStore = (key: any, val?: any) => {
    /**
     * Hash Key: 用于多地址之间数据共存, 不至于更换地址出现问题
     * @param key
     * @returns {string}
     * @private
     */
    let _hashKey = (key: string) => {
        return 'DD-' + hashKey().substr(0, 6).toUpperCase() + ':' + key;
    };

    return _localStore(_hashKey(key), val);
};

/**
 * 实现sessionStorage缓存的 存, 取, 删操作
 * @param key 对象, 批量设置
 * @param val 有值:设置; 无值: 获取; null, 删除;
 */
export const sessionStore = (key: any, val: any) => {
    // 本地数据存储封装，随页面回话结束而结束，仅限于该页面的协议
    if (val === null) {
        if (typeof key === 'object') {
            forEach(key, function (ele, idx) {
                sessionStorage.setItem(idx, ele);
            });
            return;
        } else {
            sessionStorage.removeItem(key);
            return;
        }
    }
    if (typeof val === 'undefined') {
        let data = sessionStorage.getItem(key);
        if (typeof data === 'string') {
            try {
                data = JSON.parse(data);
                return data; // 获取数据
            } catch (err) {
                return sessionStorage.getItem(key); // 获取数据
            }
        }
        return data; // 获取数据
    }
    if (typeof val === 'object') {
        sessionStorage.setItem(key, JSON.stringify(val));
        return;
    } else {
        sessionStorage.setItem(key, val);
        return;
    }
};


/**
 * 通过域名 + 版本号摒弃缓存
 * @returns {*}
 */
export const hashKey = () => {
    return md5(domain(basePath) + version).toString();
};

export const requestHeaderInterceptor = (url: string, options: any) => {
    // Token
    let token = localStore(storageKey.TOKEN) ?? '';

    // params
    let params = clone(requestParam(options['params'] ?? {}));
    params['timestamp'] = Math.round(new Date().getTime() / 1000);
    params['sign'] = requestSign(params, token);
    options.params = {};
    options.data = params;

    // headers
    let headers = options.headers ?? {};
    headers['Content-Type'] = 'application/json';
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    return {
        url: `${url}`,
        options: {...options, interceptors: true, headers}
    };
}

/**
 * 加密串生成
 * @param {object} params 请求接口时的参数
 * @param {string} token token字段
 * @returns {string}
 */
export const requestSign = (params: object, token = '') => {
    let debug = false;
    let kvStr = '';
    let arrKeys = keys(params);
    arrKeys.sort();
    forEach(arrKeys, function (key) {
        if (key !== 'image' && key !== 'file') {
            kvStr += key + '=' + params[key] + ','
        }
    });
    kvStr = kvStr.slice(0, -1);
    let v1Md5 = md5(md5(kvStr).toString() + token).toString();
    if (debug) {
        console.log(kvStr, md5(kvStr).toString(), v1Md5);
    }
    return v1Md5.charAt(1) + v1Md5.charAt(3) + v1Md5.charAt(15) + v1Md5.charAt(31)
};
