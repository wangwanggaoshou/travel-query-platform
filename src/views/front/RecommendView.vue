<template>
  <div class="recommend-page">
    <div class="container">
      <div class="page-header">
        <h1 class="page-title gradient-text">🎯 智能推荐</h1>
        <p class="page-desc">根据您的旅游偏好、所在地和签证信息，为您推荐最合适的目的地</p>
      </div>

      <!-- 未登录提示 -->
      <el-alert
        v-if="!isLoggedIn"
        title="登录后获取个性化推荐"
        description="请先登录并完善您的旅游偏好、所在地和签证信息，以获取更精准的推荐"
        type="info"
        show-icon
        :closable="false"
        class="login-alert"
      >
        <template #default>
          <el-button type="primary" size="small" @click="$router.push('/login')">
            立即登录
          </el-button>
        </template>
      </el-alert>

      <!-- 快速偏好选择 -->
      <el-card class="preference-card" shadow="never">
        <template #header>
          <span>选择您的旅行偏好</span>
        </template>
        <div class="pref-section">
          <label>旅行类型：</label>
          <div class="pref-options">
            <el-check-tag
              v-for="type in travelTypes"
              :key="type"
              :checked="selectedTypes.includes(type)"
              @change="toggleType(type)"
            >
              {{ type }}
            </el-check-tag>
          </div>
        </div>
        <div class="pref-section">
          <label>预算范围：</label>
          <el-slider v-model="budget" :min="0" :max="50000" :step="1000" :format-tooltip="formatBudget" range />
        </div>
        <div class="pref-section">
          <label>出行天数：</label>
          <el-input-number v-model="days" :min="1" :max="30" />
        </div>
        <div class="pref-actions">
          <el-button type="primary" @click="getRecommendations" :loading="loading">
            <el-icon><MagicStick /></el-icon>
            获取推荐
          </el-button>
        </div>
      </el-card>

      <!-- 推荐结果 -->
      <div class="recommend-results" v-loading="loading">
        <h2 class="section-title" v-if="recommendations.length">为您推荐</h2>
        <div class="recommend-grid">
          <ScenicCard
            v-for="item in recommendations"
            :key="item.id"
            :scenic="item"
            @click="$router.push(`/map?id=${item.id}`)"
          />
        </div>
        <el-empty v-if="!loading && recommendations.length === 0 && hasSearched" description="暂无推荐结果，请调整偏好后重试" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useUserStore } from '@/stores/user'
import ScenicCard from '@/components/scenic/ScenicCard.vue'

const userStore = useUserStore()
const isLoggedIn = computed(() => userStore.isLoggedIn)

const loading = ref(false)
const hasSearched = ref(false)
const recommendations = ref([])
const selectedTypes = ref([])
const budget = ref([0, 10000])
const days = ref(5)

const travelTypes = ['自然风光', '历史古迹', '海滨度假', '城市观光', '主题乐园', '山岳徒步', '文化体验', '美食之旅']

function toggleType(type) {
  const index = selectedTypes.value.indexOf(type)
  if (index > -1) {
    selectedTypes.value.splice(index, 1)
  } else {
    selectedTypes.value.push(type)
  }
}

function formatBudget(val) {
  return `¥${val}`
}

async function getRecommendations() {
  loading.value = true
  hasSearched.value = true
  // TODO: 调用推荐 API
  loading.value = false
}
</script>

<style scoped>
.recommend-page {
  padding: var(--spacing-xl) 0 var(--spacing-3xl);
}

.page-header {
  text-align: center;
  margin-bottom: var(--spacing-xl);
}

.page-title {
  font-size: var(--font-size-4xl);
  font-weight: 800;
  margin-bottom: var(--spacing-sm);
}

.page-desc {
  color: var(--color-text-secondary);
  font-size: var(--font-size-lg);
}

.login-alert {
  margin-bottom: var(--spacing-xl);
}

.preference-card {
  margin-bottom: var(--spacing-xl);
  border-radius: var(--radius-md);
}

.pref-section {
  margin-bottom: var(--spacing-lg);
}

.pref-section label {
  display: block;
  font-weight: 500;
  margin-bottom: var(--spacing-sm);
  color: var(--color-text-primary);
}

.pref-options {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
}

.pref-actions {
  text-align: center;
  padding-top: var(--spacing-md);
}

.recommend-results {
  min-height: 200px;
}

.recommend-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--spacing-lg);
}
</style>
