/**
 * 分页组合式函数
 */
import { ref, computed } from 'vue'

export function usePagination(fetchFn, options = {}) {
  const { pageSize: defaultPageSize = 12 } = options

  const currentPage = ref(1)
  const pageSize = ref(defaultPageSize)
  const total = ref(0)
  const loading = ref(false)

  const totalPages = computed(() => Math.ceil(total.value / pageSize.value))

  async function fetchData(extraParams = {}) {
    loading.value = true
    try {
      const params = {
        page: currentPage.value,
        pageSize: pageSize.value,
        ...extraParams,
      }
      const res = await fetchFn(params)
      total.value = res.total || 0
      return res.list || []
    } catch (error) {
      console.error('分页获取数据失败:', error)
      return []
    } finally {
      loading.value = false
    }
  }

  function handlePageChange(page) {
    currentPage.value = page
  }

  function handleSizeChange(size) {
    pageSize.value = size
    currentPage.value = 1
  }

  function reset() {
    currentPage.value = 1
    total.value = 0
  }

  return {
    currentPage,
    pageSize,
    total,
    totalPages,
    loading,
    fetchData,
    handlePageChange,
    handleSizeChange,
    reset,
  }
}
