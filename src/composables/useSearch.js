/**
 * 搜索组合式函数
 */
import { ref, watch } from 'vue'

export function useSearch(searchFn, options = {}) {
  const { debounceMs = 300, immediate = false } = options

  const keyword = ref('')
  const loading = ref(false)
  const results = ref([])
  let debounceTimer = null

  async function search(query) {
    if (query !== undefined) keyword.value = query
    loading.value = true
    try {
      const res = await searchFn(keyword.value)
      results.value = res
    } catch (error) {
      console.error('搜索出错:', error)
      results.value = []
    } finally {
      loading.value = false
    }
  }

  function debouncedSearch(query) {
    clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => search(query), debounceMs)
  }

  function reset() {
    keyword.value = ''
    results.value = []
  }

  if (immediate) search()

  return {
    keyword,
    loading,
    results,
    search,
    debouncedSearch,
    reset,
  }
}
