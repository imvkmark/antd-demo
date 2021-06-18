// @ts-ignore
/* eslint-disable */
import { Protocol } from 'puppeteer-core';

declare namespace ApiPoppy {
    import integer = Protocol.integer;
    type AuthLoginParams = {
        passport: string,
        captcha?: string,
        password?: string,
        platform: string,
    };

    type AuthAccessUser = {
        created_at: string
        disable_reason: string
        email: string
        id: integer
        is_enable: string
        mobile: string
        type: string
        username: string
    }
}
