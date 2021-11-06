import { defineConfig } from 'umi';

export default defineConfig({
  title: '用户中心',
  qiankun: {
    slave: {},
  },
  fastRefresh: {},
  nodeModulesTransform: {
    type: 'none',
  },
  routes: [
    {
      path: '/',
      component: '@/layouts/',
      routes: [
        { path: '/', redirect: '/profile/' },
        { path: '/profile/', component: 'profile' },
        { path: '/login/', component: 'login' },
        { path: '/mgt/', component: 'mgt' },
        // { redirect: '/profile/' },
      ],
    },
  ],
  helmet: false,
  dva: false,
  model: false,
  initialState: false,
  layout: false,
  locale: false,
  preact: false,
  request: false,
  sass: false,
  hash: true,
  base: '/user-center',
  publicPath: '/user-center/',
  runtimePublicPath: true,
  externals: {
    moment: 'moment',
  },
  devServer: {
    port: 80,
    proxy: {
      '/user-center/api': {
        target: 'http://user-center-go-dev',
        changeOrigin: true,
        pathRewrite: {
          '/user-center/api': '',
        },
      },
    },
  },
  scripts: ['https://lib.baomitu.com/moment.js/latest/moment.min.js'],
  extraBabelPlugins: [
    [
      'babel-plugin-styled-components',
      {
        namespace: 'user-center',
      },
    ],
  ],
});
