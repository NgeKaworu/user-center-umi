import { defineConfig } from 'umi';

export default defineConfig({
  base: '/user-center',
  publicPath: '/user-center/',
  outputPath: './dist/user-center',
  mountElementId: 'user-center',
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
        { redirect: '/profile/' },
      ],
    },
  ],
});
