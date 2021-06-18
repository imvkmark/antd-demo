import React from 'react';
import ProLayout, { PageContainer } from '@ant-design/pro-layout';
import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import menu from './menu';

export default (): React.ReactNode => {
    return (
        <ProLayout
            className={'layout-secondary'}
            location={{
                pathname: '/home/overview'
            }}
            route={{
                routes: menu
            }}
            navTheme="light"
            style={{
                height: '400px'
            }}
            rightContentRender={() => (
                <div>
                    <Avatar shape="square" size="small" icon={<UserOutlined/>}/>
                </div>
            )}
            menuHeaderRender={false}
        >
            <PageContainer content="欢迎使用">
                <div>Hello World</div>
            </PageContainer>
        </ProLayout>
    );
};
