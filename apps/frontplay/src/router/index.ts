import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { loading } from '@/utils/loading'

const routes: Array<RouteRecordRaw> = [
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

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((_, _from, next) => {
  if (!window.existLoading) {
    loading.show()
    window.existLoading = true
  }
  next()
})

router.afterEach(() => {
  if (window.existLoading) {
    loading.hide()
    window.existLoading = false
  }
})

export default router
