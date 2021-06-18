// https://umijs.org/config/
import {defineConfig} from 'umi';

export default defineConfig({
    outputPath: 'build/idc-dev',
    define: {
        'process.env.API_URL': 'https://dev.miq.iliexiang.com/'
    }
});
