<template>
  <div class="scenic-filter">
    <div class="filter-card">
      <div class="filter-row">
        <span class="filter-label">分类</span>
        <div class="filter-options">
          <button
            v-for="cat in categories"
            :key="cat.value"
            class="filter-chip"
            :class="{ active: currentCategory === cat.value }"
            @click="handleCategoryChange(cat.value)"
          >
            {{ cat.label }}
          </button>
        </div>
      </div>
      <div class="filter-row">
        <span class="filter-label">地区</span>
        <div class="filter-options">
          <button
            v-for="region in regions"
            :key="region.value"
            class="filter-chip"
            :class="{ active: currentRegion === region.value }"
            @click="handleRegionChange(region.value)"
          >
            {{ region.label }}
          </button>
        </div>
      </div>
      <div class="filter-row">
        <span class="filter-label">评分</span>
        <div class="filter-options">
          <button
            v-for="rating in ratings"
            :key="rating.value"
            class="filter-chip"
            :class="{ active: currentRating === rating.value }"
            @click="handleRatingChange(rating.value)"
          >
            {{ rating.label }}
          </button>
        </div>
      </div>
    </div>
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
.scenic-filter {
  margin-bottom: var(--spacing-xl);
}

.filter-card {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-md);
  padding: var(--spacing-md) var(--spacing-lg);
}

.filter-row {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-md);
  padding: var(--spacing-sm) 0;
}

.filter-row + .filter-row {
  border-top: 1px solid var(--color-border-light);
}

.filter-label {
  width: 48px;
  flex-shrink: 0;
  font-family: var(--font-display);
  font-weight: 600;
  color: var(--color-gold);
  font-size: var(--font-size-sm);
  line-height: 32px;
  letter-spacing: 0.03em;
}

.filter-options {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
}

.filter-chip {
  padding: 4px 16px;
  border-radius: var(--radius-full);
  border: 1px solid var(--color-border);
  background: transparent;
  color: var(--color-text-muted);
  font-size: var(--font-size-sm);
  font-family: var(--font-body);
  cursor: pointer;
  transition: all var(--transition-fast);
  white-space: nowrap;
}

.filter-chip:hover {
  border-color: var(--color-gold-border);
  color: var(--color-gold);
  background: var(--color-gold-bg);
}

.filter-chip.active {
  background: var(--color-gold-bg);
  border-color: var(--color-gold-border);
  color: var(--color-gold);
  font-weight: 600;
}
</style>
