// https://umijs.org/config/
import {defineConfig} from 'umi';

export default defineConfig({
    outputPath: 'build/idc-local',
    define: {
        'process.env.API_URL': 'https://poppy.duoli.com/'
    }
});
