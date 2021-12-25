import { defineConfig } from 'umi';
import theme from './src/theme';
import routes from './routes';
import base from './src/js-sdk/configs/.umirc.default';

export default defineConfig({
  ...base,
  theme,
  title: '用户中心',
  base: '/user-center',
  publicPath: '/user-center/',
  routes,
  devServer: {
    port: 80,
    proxy: {
      '/api/user-center': {
        // target: 'http://user-center-go-dev',
        target: 'http://localhost:8088',
        changeOrigin: true,
        pathRewrite: {
          '/api/user-center': '',
        },
      },
    },
  },
  extraBabelPlugins: [
    [
      'babel-plugin-styled-components',
      {
        namespace: 'user-center',
      },
    ],
  ],
});
