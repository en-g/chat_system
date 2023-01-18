const routes: Array<any> = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/index.vue'),
  },
  {
    path: '/',
    component: () => import('@/layout/index.vue'),
    children: [
      {
        path: 'message',
        name: 'message',
        component: () => import('@/views/message/index.vue'),
      },
      {
        path: 'contacts',
        name: 'contacts',
        component: () => import('@/views/contacts/index.vue'),
        children: [
          {
            path: 'assistant',
            name: 'assistant',
            component: () => import('@/views/contacts/children/assistant/index.vue'),
          },
          {
            path: 'info',
            name: 'info',
            component: () => import('@/views/contacts/children/info/index.vue'),
          },
        ],
      },
      {
        path: 'pyq',
        name: 'pyq',
        component: () => import('@/views/pyq/index.vue'),
      },
      {
        path: 'life',
        name: 'life',
        component: () => import('@/views/life/index.vue'),
      },
    ],
  },
  {
    path: '/pass',
    name: 'pass',
    component: () => import('@/views/pass/index.vue'),
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/register/index.vue'),
  },
]

export default routes
