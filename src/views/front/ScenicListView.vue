<template>
  <div class="scenic-list-page atmosphere-gradient">
    <div class="container">
      <AppBreadcrumb :items="[{ title: '景点查询' }]" />

      <!-- 页面标题 -->
      <div class="page-header">
        <span class="page-eyebrow">Discover</span>
        <h1 class="page-title">探索目的地</h1>
        <div class="gold-divider"></div>
      </div>

      <!-- 搜索栏 -->
      <div class="search-section">
        <SearchBar v-model="keyword" placeholder="搜索景点名称、城市、关键词…" @search="handleSearch" />
        <div class="search-options">
          <label class="discover-toggle">
            <input type="checkbox" v-model="discoverEnabled" />
            <span>无结果时自动发现新景点</span>
          </label>
        </div>
      </div>

      <!-- 筛选器 -->
      <ScenicFilter @filter-change="handleFilterChange" />

      <!-- 景点列表 -->
      <!-- 骨架屏 -->
      <div class="scenic-grid" v-if="loading && scenicList.length === 0">
        <div v-for="n in 6" :key="'skeleton-' + n" class="skeleton-card">
          <div class="skeleton-cover shimmer"></div>
          <div class="skeleton-body">
            <div class="skeleton-line w-60 shimmer"></div>
            <div class="skeleton-line w-40 shimmer"></div>
            <div class="skeleton-line w-80 shimmer"></div>
          </div>
        </div>
      </div>
      <div class="scenic-grid" v-else v-loading="loading">
        <ScenicCard
          v-for="item in scenicList"
          :key="item.id"
          :scenic="item"
          :keyword="keyword"
          @click="goToDetail(item)"
        />
      </div>

      <el-empty v-if="!loading && scenicList.length === 0" description="暂无景点数据">
        <el-button type="primary" @click="handleSearch(keyword)">重新搜索</el-button>
      </el-empty>

      <!-- 分页 -->
      <el-pagination
        v-if="total > 0"
        :current-page="currentPage"
        :page-size="pageSize"
        :total="total"
        layout="total, prev, pager, next, jumper"
        @current-change="handlePageChange"
      />

      <!-- 景点详情抽屉 -->
      <ScenicDetailDrawer
        :visible="drawerVisible"
        :scenic="drawerScenic"
        :scenicId="drawerScenicId"
        @close="closeDrawer"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter, onBeforeRouteUpdate } from 'vue-router'
import { ElMessage } from 'element-plus'
import AppBreadcrumb from '@/components/common/AppBreadcrumb.vue'
import SearchBar from '@/components/common/SearchBar.vue'
import ScenicFilter from '@/components/scenic/ScenicFilter.vue'
import ScenicCard from '@/components/scenic/ScenicCard.vue'
import ScenicDetailDrawer from '@/components/scenic/ScenicDetailDrawer.vue'
import { getScenicList, searchScenic } from '@/api/scenic'
import { formatScenicList } from '@/utils/categoryLabels'

const route = useRoute()
const router = useRouter()

const scenicList = ref([])
const loading = ref(false)
const keyword = ref(route.query.keyword || '')
const currentPage = ref(1)
const pageSize = ref(12)
const total = ref(0)
const filters = ref({})
const discoverEnabled = ref(true)
const drawerVisible = ref(false)
const drawerScenic = ref(null)
const drawerScenicId = ref(null)

function handleSearch(kw) {
  currentPage.value = 1
  const q = { ...route.query }
  if (kw && String(kw).trim()) {
    q.keyword = String(kw).trim()
  } else {
    delete q.keyword
  }
  router.replace({ path: route.path, query: q })
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
  drawerScenic.value = scenic
  drawerScenicId.value = scenic.id
  drawerVisible.value = true
}

function closeDrawer() {
  drawerVisible.value = false
  drawerScenic.value = null
  drawerScenicId.value = null
}

async function fetchData() {
  loading.value = true
  try {
    const params = {
      page: currentPage.value,
      pageSize: pageSize.value,
      ...filters.value,
    }
    const res = keyword.value
      ? await searchScenic({
          keyword: keyword.value,
          discover: discoverEnabled.value,
          ...params,
        })
      : await getScenicList(params)
    scenicList.value = formatScenicList(res.data?.list || [])
    total.value = res.data?.total || 0
    if (res.data?.discoveredNew) {
      ElMessage.success({
        message: '未在库中找到完全匹配项，已通过高德与公开资料聚合景点并入库。',
        duration: 5000,
      })
    }
  } catch (error) {
    console.error('获取景点列表失败:', error)
    scenicList.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (route.query.category) {
    filters.value = { ...filters.value, category: route.query.category }
  }
  keyword.value = route.query.keyword ? String(route.query.keyword) : ''
  fetchData()
})

onBeforeRouteUpdate((to) => {
  keyword.value = to.query.keyword ? String(to.query.keyword) : ''
  currentPage.value = 1
  fetchData()
})
</script>

<style scoped>
.scenic-list-page {
  padding: var(--spacing-lg) 0 var(--spacing-3xl);
}

.page-header {
  margin-bottom: var(--spacing-xl);
}

.page-eyebrow {
  font-family: var(--font-display);
  font-size: 11px;
  color: var(--color-gold);
  letter-spacing: 0.2em;
  text-transform: uppercase;
}

.page-title {
  font-family: var(--font-display);
  font-size: var(--font-size-4xl);
  font-weight: 700;
  color: var(--color-text-primary);
  letter-spacing: -0.02em;
  margin-bottom: var(--spacing-sm);
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

.search-options {
  display: flex;
  justify-content: center;
  margin-top: var(--spacing-sm);
}

.discover-toggle {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
  cursor: pointer;
  user-select: none;
}

.discover-toggle input {
  accent-color: var(--color-gold);
}

/* 骨架屏 */
.skeleton-card {
  background: var(--color-bg-card);
  border-radius: var(--radius-md);
  overflow: hidden;
  border: 1px solid var(--color-border-light);
}

.skeleton-cover {
  height: 200px;
}

.skeleton-body {
  padding: var(--spacing-md);
}

.skeleton-line {
  height: 14px;
  border-radius: 4px;
  background: var(--color-border);
  margin-bottom: 10px;
}

.skeleton-line:last-child {
  margin-bottom: 0;
}

.w-60 { width: 60%; }
.w-40 { width: 40%; }
.w-80 { width: 80%; }

.shimmer {
  background: linear-gradient(
    90deg,
    var(--color-border) 25%,
    rgba(200, 169, 81, 0.1) 50%,
    var(--color-border) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
</style>
