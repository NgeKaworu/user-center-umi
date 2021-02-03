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

  hash: true,
  base: '/user-center',
  publicPath: '/user-center/',
  runtimePublicPath: true,
  externals: {
    moment: 'moment',
  },
  scripts: ['https://lib.baomitu.com/moment.js/latest/moment.min.js'],
});
