/**
 * 路由主配置
 */
import { createRouter, createWebHistory } from 'vue-router'
import { isAuthenticated } from '@/utils/auth'
import frontRoutes from './frontRoutes'
import FrontLayout from '@/layouts/FrontLayout.vue'
import BlankLayout from '@/layouts/BlankLayout.vue'

const routes = [
  // 前台路由（使用前台布局）
  {
    path: '/',
    component: FrontLayout,
    children: frontRoutes.filter(r => r.meta?.layout !== 'blank'),
  },
  // 登录/注册（使用空白布局）
  {
    path: '/',
    component: BlankLayout,
    children: frontRoutes.filter(r => r.meta?.layout === 'blank'),
  },
  // 404
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

// 路由守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  document.title = `${to.meta.title || '旅途智览'} - 旅游查询与建议系统`

  // 权限校验
  if (to.meta.requiresAuth && !isAuthenticated()) {
    next({ name: 'Login', query: { redirect: to.fullPath } })
  } else {
    next()
  }
})

export default router
