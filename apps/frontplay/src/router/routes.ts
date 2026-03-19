import { type RouteRecordRaw } from 'vue-router'

export const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: () => import('@/views/homePage/index.vue'),
  },
  {
    path: '/algorithm',
    component: () => import('@/layout/index.vue'),
    redirect: '/algorithm/sort',
    children: [
      {
        path: 'sort',
        component: () => import('@/views/algorithm/sort/index.vue'),
      },
    ],
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/error/404.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    component: () => import('@/views/error/404.vue'),
  },
]
