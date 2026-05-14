<template>
  <div class="scenic-filter">
    <el-card shadow="never" class="filter-card">
      <div class="filter-row">
        <span class="filter-label">分类：</span>
        <div class="filter-options">
          <el-check-tag
            v-for="cat in categories"
            :key="cat.value"
            :checked="currentCategory === cat.value"
            @change="handleCategoryChange(cat.value)"
          >
            {{ cat.label }}
          </el-check-tag>
        </div>
      </div>
      <div class="filter-row">
        <span class="filter-label">地区：</span>
        <div class="filter-options">
          <el-check-tag
            v-for="region in regions"
            :key="region.value"
            :checked="currentRegion === region.value"
            @change="handleRegionChange(region.value)"
          >
            {{ region.label }}
          </el-check-tag>
        </div>
      </div>
      <div class="filter-row">
        <span class="filter-label">评分：</span>
        <div class="filter-options">
          <el-check-tag
            v-for="rating in ratings"
            :key="rating.value"
            :checked="currentRating === rating.value"
            @change="handleRatingChange(rating.value)"
          >
            {{ rating.label }}
          </el-check-tag>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['filter-change'])

const currentCategory = ref('')
const currentRegion = ref('')
const currentRating = ref('')

const categories = [
  { label: '全部', value: '' },
  { label: '自然风光', value: 'nature' },
  { label: '历史古迹', value: 'history' },
  { label: '主题乐园', value: 'theme_park' },
  { label: '海滨度假', value: 'beach' },
  { label: '山岳景观', value: 'mountain' },
  { label: '城市观光', value: 'city' },
]

const regions = [
  { label: '全部', value: '' },
  { label: '国内', value: 'domestic' },
  { label: '东南亚', value: 'southeast_asia' },
  { label: '日韩', value: 'japan_korea' },
  { label: '欧洲', value: 'europe' },
  { label: '北美', value: 'north_america' },
  { label: '大洋洲', value: 'oceania' },
]

const ratings = [
  { label: '全部', value: '' },
  { label: '4.5分以上', value: '4.5' },
  { label: '4.0分以上', value: '4.0' },
  { label: '3.5分以上', value: '3.5' },
]

function handleCategoryChange(value) {
  currentCategory.value = currentCategory.value === value ? '' : value
  emitChange()
}

function handleRegionChange(value) {
  currentRegion.value = currentRegion.value === value ? '' : value
  emitChange()
}

function handleRatingChange(value) {
  currentRating.value = currentRating.value === value ? '' : value
  emitChange()
}

function emitChange() {
  emit('filter-change', {
    category: currentCategory.value,
    region: currentRegion.value,
    rating: currentRating.value,
  })
}
</script>

<style scoped>
.filter-card {
  margin-bottom: var(--spacing-lg);
  border-radius: var(--radius-md);
}

.filter-row {
  display: flex;
  align-items: flex-start;
  padding: var(--spacing-sm) 0;
}

.filter-row + .filter-row {
  border-top: 1px solid var(--color-border-light);
}

.filter-label {
  width: 60px;
  flex-shrink: 0;
  font-weight: 500;
  color: var(--color-text-primary);
  font-size: var(--font-size-sm);
  line-height: 32px;
}

.filter-options {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
}
</style>
