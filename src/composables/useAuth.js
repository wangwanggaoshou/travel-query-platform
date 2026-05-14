/**
 * 认证组合式函数
 */
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

export function useAuth() {
  const router = useRouter()
  const userStore = useUserStore()

  const isLoggedIn = computed(() => userStore.isLoggedIn)
  const user = computed(() => userStore.userInfo)

  async function login(form) {
    await userStore.login(form)
    const redirect = router.currentRoute.value.query.redirect || '/'
    router.push(redirect)
  }

  function logout() {
    userStore.logout()
    router.push('/')
  }

  function requireAuth() {
    if (!isLoggedIn.value) {
      router.push({ name: 'Login', query: { redirect: router.currentRoute.value.fullPath } })
      return false
    }
    return true
  }

  return {
    isLoggedIn,
    user,
    login,
    logout,
    requireAuth,
  }
}
