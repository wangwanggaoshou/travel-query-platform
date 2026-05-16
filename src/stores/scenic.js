/**
 * 景点状态管理
 */
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getScenicList, getScenicDetail, searchScenic, getHotScenic } from '@/api/scenic'
import { formatScenicList, formatScenicItem } from '@/utils/categoryLabels'

export const useScenicStore = defineStore('scenic', () => {
  // 状态
  const scenicList = ref([])
  const currentScenic = ref(null)
  const hotScenicList = ref([])
  const loading = ref(false)
  const total = ref(0)
  const searchKeyword = ref('')
  const filters = ref({
    category: '',
    region: '',
    priceRange: '',
  })

  // 获取景点列表
  async function fetchScenicList(params = {}) {
    loading.value = true
    try {
      const res = await getScenicList(params)
      scenicList.value = formatScenicList(res.data.list || [])
      total.value = res.data.total || 0
    } catch (error) {
      console.error('获取景点列表失败:', error)
    } finally {
      loading.value = false
    }
  }

  // 获取景点详情
  async function fetchScenicDetail(id) {
    loading.value = true
    try {
      const res = await getScenicDetail(id)
      currentScenic.value = formatScenicItem(res.data)
    } catch (error) {
      console.error('获取景点详情失败:', error)
    } finally {
      loading.value = false
    }
  }

  // 搜索景点
  async function search(keyword) {
    searchKeyword.value = keyword
    loading.value = true
    try {
      const res = await searchScenic({ keyword, ...filters.value })
      scenicList.value = formatScenicList(res.data.list || [])
      total.value = res.data.total || 0
    } catch (error) {
      console.error('搜索景点失败:', error)
    } finally {
      loading.value = false
    }
  }

  // 获取热门景点
  async function fetchHotScenic(params = {}) {
    try {
      const res = await getHotScenic(params)
      hotScenicList.value = formatScenicList(res.data?.list || res.data || [])
    } catch (error) {
      console.error('获取热门景点失败:', error)
    }
  }

  // 更新筛选条件
  function updateFilters(newFilters) {
    filters.value = { ...filters.value, ...newFilters }
  }

  // 重置筛选
  function resetFilters() {
    filters.value = { category: '', region: '', priceRange: '' }
    searchKeyword.value = ''
  }

  return {
    scenicList,
    currentScenic,
    hotScenicList,
    loading,
    total,
    searchKeyword,
    filters,
    fetchScenicList,
    fetchScenicDetail,
    search,
    fetchHotScenic,
    updateFilters,
    resetFilters,
  }
})
