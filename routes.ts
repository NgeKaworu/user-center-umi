export default [
  {
    path: '/',
    component: '@/layouts/',
    routes: [
      { path: '/', redirect: '/profile/' },
      { path: '/perm/', component: 'perm' },
      { path: '/role/', component: 'role' },
      { path: '/user/', component: 'user' },
      // { redirect: '/profile/' },
    ],
  },
];
