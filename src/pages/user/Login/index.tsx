import {
    AlipayCircleOutlined,
    LockOutlined,
    MobileOutlined,
    TaobaoCircleOutlined,
    UserOutlined,
    WeiboCircleOutlined
} from '@ant-design/icons';
import { Alert, message, Space, Tabs } from 'antd';
import React, { useState } from 'react';
import ProForm, { ProFormCaptcha, ProFormCheckbox, ProFormText } from '@ant-design/pro-form';
import { history, Link, useModel } from 'umi';
import Footer from '@/components/Footer';
import { getFakeCaptcha } from '@/services/ant-design-pro/login';
import styles from './index.less';
import { apiAuthLogin } from '@/services/poppy/system';
import { STATUS_OK, storageKey } from '@/utils/conf';
import { localStore } from '@/utils/utils';

const LoginMessage: React.FC<{
    content: string;
}> = ({ content }) => (
    <Alert
        style={{
            marginBottom: 24
        }}
        message={content}
        type="error"
        showIcon
    />
);
/** 此方法会跳转到 redirect 参数所在的位置 */

const goto = () => {
    if (!history) return;
    setTimeout(() => {
        const { query } = history.location;
        const { redirect } = query as {
            redirect: string;
        };
        history.push(redirect || '/');
    }, 10);
};

const Login: React.FC = () => {
    const [submitting, setSubmitting] = useState(false);
    const [userLoginState, setUserLoginState] = useState<API.LoginResult>({});
    const [type, setType] = useState<string>('account');
    const { initialState, setInitialState } = useModel('@@initialState');

    const fetchUserInfo = async () => {
        const userInfo = await initialState?.fetchUserInfo?.();

        if (userInfo) {
            setInitialState({ ...initialState, currentUser: userInfo });
        }
    };

    const handleSubmit = async (values: ApiPoppy.AuthLoginParams) => {
        setSubmitting(true);

        try {
            // 登录
            const { status, message: msg, data } = await apiAuthLogin({ ...values });

            if (status !== STATUS_OK) {
                message.error(msg);
            }
            const { token } = data;
            localStore(storageKey.TOKEN, token)
            message.success(msg);
            await fetchUserInfo();
            goto();
            return;

            // todo 设置用户权限以及状态[和管理员有关系]
            setUserLoginState(msg);
        } catch (error) {
            message.error('登录失败，请重试！');
        }

        setSubmitting(false);
    };

    const { status, type: loginType } = userLoginState;
    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <div className={styles.top}>
                    <div className={styles.header}>
                        <Link to="/">
                            <img alt="logo" className={styles.logo} src="/logo.svg"/>
                            <span className={styles.title}>Ant Design</span>
                        </Link>
                    </div>
                    <div className={styles.desc}>{'Ant Design 是西湖区最具影响力的 Web 设计规范'}</div>
                </div>

                <div className={styles.main}>
                    <ProForm
                        submitter={{
                            searchConfig: {
                                submitText: '登录'
                            },
                            render: (_, dom) => dom.pop(),
                            submitButtonProps: {
                                loading: submitting,
                                size: 'large',
                                style: {
                                    width: '100%'
                                }
                            }
                        }}
                        onFinish={async (values) => {
                            handleSubmit(values as ApiPoppy.AuthLoginParams);
                        }}
                    >
                        <Tabs activeKey={type} onChange={setType}>
                            <Tabs.TabPane key="account" tab={'账户密码登录'}/>
                            <Tabs.TabPane key="mobile" tab={'手机号登录'}/>
                        </Tabs>

                        {status === 'error' && loginType === 'account' && (
                            <LoginMessage content={'错误的用户名和密码（admin/ant.design)'}/>
                        )}
                        {type === 'account' && (
                            <>
                                <ProFormText
                                    name="passport"
                                    fieldProps={{
                                        size: 'large',
                                        prefix: <UserOutlined className={styles.prefixIcon}/>
                                    }}
                                    placeholder={'用户名 & 手机号 & 邮箱'}
                                    rules={[
                                        {
                                            required: true,
                                            message: '用户名是必填项！'
                                        }
                                    ]}
                                />
                                <ProFormText.Password
                                    name="password"
                                    fieldProps={{
                                        size: 'large',
                                        prefix: <LockOutlined className={styles.prefixIcon}/>
                                    }}
                                    placeholder={'密码'}
                                    rules={[
                                        {
                                            required: true,
                                            message: '密码是必填项！'
                                        }
                                    ]}
                                />
                            </>
                        )}

                        {status === 'error' && loginType === 'mobile' && <LoginMessage content="验证码错误"/>}
                        {type === 'mobile' && (
                            <>
                                <ProFormText
                                    fieldProps={{
                                        size: 'large',
                                        prefix: <MobileOutlined className={styles.prefixIcon}/>
                                    }}
                                    name="passport"
                                    placeholder={'请输入手机号！'}
                                    rules={[
                                        {
                                            required: true,
                                            message: '手机号是必填项！'
                                        },
                                        {
                                            pattern: /^1\d{10}$/,
                                            message: '不合法的手机号！'
                                        }
                                    ]}
                                />
                                <ProFormCaptcha
                                    fieldProps={{
                                        size: 'large',
                                        prefix: <LockOutlined className={styles.prefixIcon}/>
                                    }}
                                    captchaProps={{
                                        size: 'large'
                                    }}
                                    placeholder={'请输入验证码！'}
                                    captchaTextRender={(timing, count) => {
                                        if (timing) {
                                            return `${count} 秒后重新获取`;
                                        }

                                        return '获取验证码';
                                    }}
                                    name="captcha"
                                    rules={[
                                        {
                                            required: true,
                                            message: '验证码是必填项！'
                                        }
                                    ]}
                                    onGetCaptcha={async (phone) => {
                                        const result = await getFakeCaptcha({
                                            phone
                                        });

                                        if (result === false) {
                                            return;
                                        }

                                        message.success('获取验证码成功！验证码为：1234');
                                    }}
                                />
                            </>
                        )}
                        <div
                            style={{
                                marginBottom: 24
                            }}
                        >
                            <ProFormCheckbox noStyle name="autoLogin">
                                自动登录
                            </ProFormCheckbox>
                            <a
                                style={{
                                    float: 'right'
                                }}
                            >
                                忘记密码 ?
                            </a>
                        </div>
                    </ProForm>
                    <Space className={styles.other}>
                        其他登录方式 :
                        <AlipayCircleOutlined className={styles.icon}/>
                        <TaobaoCircleOutlined className={styles.icon}/>
                        <WeiboCircleOutlined className={styles.icon}/>
                    </Space>
                </div>
            </div>
            <Footer/>
        </div>
    );
};

export default Login;
