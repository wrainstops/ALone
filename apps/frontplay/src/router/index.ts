import { createRouter, createWebHistory } from 'vue-router'
import { routes } from './routes'
import { loading } from '@/utils/loading'

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
