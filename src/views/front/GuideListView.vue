<template>
  <div class="guide-list-page">
    <div class="container">
      <AppBreadcrumb :items="[{ title: '旅游攻略' }]" />

      <div class="page-header">
        <h1 class="page-title">旅游攻略</h1>
        <p class="page-desc">精选旅行达人的真实分享，助你规划完美旅程</p>
      </div>

      <!-- 搜索栏 -->
      <SearchBar v-model="keyword" placeholder="搜索攻略..." @search="handleSearch" />

      <!-- 分类标签 -->
      <div class="category-tabs">
        <el-check-tag
          v-for="cat in categories"
          :key="cat.value"
          :checked="currentCategory === cat.value"
          @change="handleCategoryChange(cat.value)"
        >
          {{ cat.label }}
        </el-check-tag>
      </div>

      <!-- 攻略列表 -->
      <div class="guide-grid" v-loading="loading">
        <GuideCard
          v-for="guide in guideList"
          :key="guide.id"
          :guide="guide"
          @click="goToDetail(guide)"
        />
      </div>

      <el-empty v-if="!loading && guideList.length === 0" description="暂无攻略数据" />

      <!-- 分页 -->
      <el-pagination
        v-if="total > 0"
        v-model:current-page="currentPage"
        :page-size="pageSize"
        :total="total"
        layout="total, prev, pager, next"
        @current-change="handlePageChange"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AppBreadcrumb from '@/components/common/AppBreadcrumb.vue'
import SearchBar from '@/components/common/SearchBar.vue'
import GuideCard from '@/components/guide/GuideCard.vue'

const router = useRouter()

const guideList = ref([])
const loading = ref(false)
const keyword = ref('')
const currentPage = ref(1)
const pageSize = ref(12)
const total = ref(0)
const currentCategory = ref('')

const categories = [
  { label: '全部', value: '' },
  { label: '国内游', value: 'domestic' },
  { label: '出境游', value: 'overseas' },
  { label: '自驾游', value: 'self_drive' },
  { label: '背包客', value: 'backpacker' },
  { label: '亲子游', value: 'family' },
  { label: '蜜月游', value: 'honeymoon' },
]

function handleSearch(kw) {
  keyword.value = kw
  currentPage.value = 1
  fetchData()
}

function handleCategoryChange(value) {
  currentCategory.value = currentCategory.value === value ? '' : value
  currentPage.value = 1
  fetchData()
}

function handlePageChange(page) {
  currentPage.value = page
  fetchData()
}

function goToDetail(guide) {
  router.push(`/guide/${guide.id}`)
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
.guide-list-page {
  padding: var(--spacing-lg) 0 var(--spacing-3xl);
}

.page-header {
  text-align: center;
  margin-bottom: var(--spacing-xl);
}

.page-title {
  font-size: var(--font-size-3xl);
  font-weight: 700;
  margin-bottom: var(--spacing-sm);
}

.page-desc {
  color: var(--color-text-secondary);
}

.category-tabs {
  display: flex;
  justify-content: center;
  gap: var(--spacing-sm);
  margin: var(--spacing-xl) 0;
  flex-wrap: wrap;
}

.guide-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--spacing-lg);
  min-height: 300px;
}
</style>
