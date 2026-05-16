/**
 * 路由主配置
 */
import { createRouter, createWebHistory } from 'vue-router'
import frontRoutes from './frontRoutes'
import FrontLayout from '@/layouts/FrontLayout.vue'

const routes = [
  {
    path: '/',
    component: FrontLayout,
    children: frontRoutes,
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    return { top: 0 }
  },
})

router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title || '旅途智览'} - 旅游查询与建议系统`
  next()
})

export default router
