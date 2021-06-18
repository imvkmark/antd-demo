// https://umijs.org/config/
import {defineConfig} from 'umi';

export default defineConfig({
    plugins: [
        // https://github.com/zthxxx/react-dev-inspector
        'react-dev-inspector/plugins/umi/react-inspector'
    ],
    // https://github.com/zthxxx/react-dev-inspector#inspector-loader-props
    inspectorConfig: {
        exclude: [],
        babelPlugins: [],
        babelOptions: {}
    },
    outputPath: 'build/idc-dev',
    define: {
        'process.env.API_URL': 'https://dev.miq.iliexiang.com/'
    }
    // mfsu: {},
    // webpack5: {
    //   // lazyCompilation: {},
    // },
});
