/**
 * 用户状态管理
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { login as loginApi, getUserInfo as getUserInfoApi, updateUserInfo as updateUserInfoApi } from '@/api/user'
import { setToken, removeToken, setUser, getUser, clearAuth } from '@/utils/auth'

export const useUserStore = defineStore('user', () => {
  // 状态
  const userInfo = ref(getUser())
  const token = ref(localStorage.getItem('travel_token') || '')

  // 计算属性
  const isLoggedIn = computed(() => !!token.value)
  const username = computed(() => userInfo.value?.username || '')
  const preferences = computed(() => userInfo.value?.preferences || {})
  const location = computed(() => userInfo.value?.location || '')
  const visaInfo = computed(() => userInfo.value?.visaInfo || [])

  // 登录
  async function login(loginForm) {
    try {
      const res = await loginApi(loginForm)
      token.value = res.data.token
      setToken(res.data.token)
      await fetchUserInfo()
      return res
    } catch (error) {
      throw error
    }
  }

  // 获取用户信息
  async function fetchUserInfo() {
    try {
      const res = await getUserInfoApi()
      userInfo.value = res.data
      setUser(res.data)
      return res
    } catch (error) {
      throw error
    }
  }

  // 更新用户信息
  async function updateInfo(data) {
    try {
      const res = await updateUserInfoApi(data)
      userInfo.value = { ...userInfo.value, ...data }
      setUser(userInfo.value)
      return res
    } catch (error) {
      throw error
    }
  }

  // 登出
  function logout() {
    token.value = ''
    userInfo.value = null
    clearAuth()
  }

  return {
    userInfo,
    token,
    isLoggedIn,
    username,
    preferences,
    location,
    visaInfo,
    login,
    fetchUserInfo,
    updateInfo,
    logout,
  }
})
