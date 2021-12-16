export default [
  {
    path: '/',
    component: '@/layouts/',
    routes: [
      { path: '/', redirect: '/profile/' },
      { path: '/profile/', component: 'profile' },
      { path: '/login/', component: 'login' },
      { path: '/mgt/', component: 'mgt' },
      { path: '/perm/', component: 'perm' },
      { path: '/role/', component: 'role' },
      // { redirect: '/profile/' },
    ],
  },
];
