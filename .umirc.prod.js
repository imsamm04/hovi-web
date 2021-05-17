import {resolve} from 'path';

// ref: https://umijs.org/config/
export default {
  treeShaking: true,
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    ['umi-plugin-react', {
      antd: true,
      dva: {
        immer: true,
      },
      dynamicImport: false,
      title: 'Homo House',
      dll: false,
      routes: {
        exclude: [
          /components\//,
        ],
      },
    }],
  ],
  extraBabelPlugins: [
    ['import', {libraryName: 'antd', style: 'css'}],
  ],
  define: {
    'process.env.APIKey': process.env.APIKey,
    'process.env.ENDPOINT': 'https://api.homohouse.ga',
    'process.env.ES_ENDPOINT': 'https://es.homohouse.ga',
  },
  alias: {
    assets: resolve(__dirname, './src/assets'),
    utils: resolve(__dirname, './src/utils'),
    components: resolve(__dirname, './src/components'),
    services: resolve(__dirname, './src/services'),
  },
};
