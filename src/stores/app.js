/**
 * 应用全局状态管理
 */
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStore = defineStore('app', () => {
  // 全局加载状态
  const globalLoading = ref(false)

  // 当前主题
  const theme = ref('light')

  // 设置加载状态
  function setLoading(status) {
    globalLoading.value = status
  }

  // 切换主题
  function toggleTheme() {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
    document.documentElement.setAttribute('data-theme', theme.value)
  }

  return {
    globalLoading,
    theme,
    setLoading,
    toggleTheme,
  }
})
