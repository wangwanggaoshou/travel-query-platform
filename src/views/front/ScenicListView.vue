<template>
  <div class="scenic-list-page">
    <div class="container">
      <AppBreadcrumb :items="[{ title: '景点查询' }]" />

      <!-- 搜索栏 -->
      <div class="search-section">
        <SearchBar v-model="keyword" placeholder="搜索景点名称、城市..." @search="handleSearch" />
      </div>

      <!-- 筛选器 -->
      <ScenicFilter @filter-change="handleFilterChange" />

      <!-- 景点列表 -->
      <div class="scenic-grid" v-loading="loading">
        <ScenicCard
          v-for="item in scenicList"
          :key="item.id"
          :scenic="item"
          @click="goToDetail(item)"
        />
      </div>

      <el-empty v-if="!loading && scenicList.length === 0" description="暂无景点数据" />

      <!-- 分页 -->
      <el-pagination
        v-if="total > 0"
        v-model:current-page="currentPage"
        :page-size="pageSize"
        :total="total"
        layout="total, prev, pager, next, jumper"
        @current-change="handlePageChange"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppBreadcrumb from '@/components/common/AppBreadcrumb.vue'
import SearchBar from '@/components/common/SearchBar.vue'
import ScenicFilter from '@/components/scenic/ScenicFilter.vue'
import ScenicCard from '@/components/scenic/ScenicCard.vue'

const route = useRoute()
const router = useRouter()

const scenicList = ref([])
const loading = ref(false)
const keyword = ref(route.query.keyword || '')
const currentPage = ref(1)
const pageSize = ref(12)
const total = ref(0)
const filters = ref({})

function handleSearch(kw) {
  keyword.value = kw
  currentPage.value = 1
  fetchData()
}

function handleFilterChange(newFilters) {
  filters.value = newFilters
  currentPage.value = 1
  fetchData()
}

function handlePageChange(page) {
  currentPage.value = page
  fetchData()
}

function goToDetail(scenic) {
  router.push(`/map?id=${scenic.id}`)
}

async function fetchData() {
  loading.value = true
  // TODO: 调用 API 获取数据
  loading.value = false
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.scenic-list-page {
  padding: var(--spacing-lg) 0 var(--spacing-3xl);
}

.scenic-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--spacing-lg);
  min-height: 300px;
}

.search-section {
  margin: var(--spacing-lg) 0 var(--spacing-xl);
}
</style>
