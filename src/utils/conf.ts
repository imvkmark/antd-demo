/*
 * 全局配置
 * 文件描述：
 *    主要存放路径及接口相关
 *      iconUrl: 字体文件路径
 *    storageKey: 存入的 storage 的 key
 *      api: 系统接口相关
 */

// 访问接口URL
export const basePath = process.env.API_URL;

// 字体文件路径
export const iconUrl = '//at.alicdn.com/t/font_1873351_ou9avaul9xn.js';

// 版本号
export const version = process.env.VERSION;

// 存储KEY
export const storageKey = {
    TOKEN: 'token', // token
    USER: 'user' // 用户资料
}

export const STATUS_OK = 0;
export const STATUS_ERR = 1;