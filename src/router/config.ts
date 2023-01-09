const routes: Array<any> = [
  {
    path: '/',
    redirect: '/contacts',
  },
  {
    path: '/',
    component: () => import('@/layout/index.vue'),
    children: [
      {
        path: 'message',
        component: () => import('@/views/message/index.vue'),
      },
      {
        path: 'contacts',
        component: () => import('@/views/contacts/index.vue'),
      },
      {
        path: 'pyq',
        component: () => import('@/views/pyq/index.vue'),
      },
      {
        path: 'life',
        component: () => import('@/views/life/index.vue'),
      },
    ],
  },
]

export default routes
