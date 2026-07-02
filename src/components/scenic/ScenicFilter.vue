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
            <span v-if="cat.count != null" class="chip-count">{{ cat.count }}</span>
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
        <span class="filter-label">排序</span>
        <div class="filter-options">
          <button
            v-for="opt in sortOptions"
            :key="opt.value"
            class="filter-chip"
            :class="{ active: currentSort === opt.value }"
            @click="handleSortChange(opt.value)"
          >
            {{ opt.label }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getScenicCategories } from '@/api/scenic'

const emit = defineEmits(['filter-change'])

const currentCategory = ref('')
const currentRegion = ref('')
const currentSort = ref('')
const categories = ref([{ label: '全部', value: '' }])

const regions = [
  { label: '全部', value: '' },
  { label: '国内', value: 'domestic' },
]

const sortOptions = [
  { label: '综合排序', value: '' },
  { label: '价格低→高', value: 'price_asc' },
  { label: '价格高→低', value: 'price_desc' },
]

function handleCategoryChange(value) {
  currentCategory.value = currentCategory.value === value ? '' : value
  emitChange()
}

function handleRegionChange(value) {
  currentRegion.value = currentRegion.value === value ? '' : value
  emitChange()
}

function handleSortChange(value) {
  currentSort.value = currentSort.value === value ? '' : value
  emitChange()
}

function emitChange() {
  emit('filter-change', {
    category: currentCategory.value,
    region: currentRegion.value,
    sortBy: currentSort.value,
  })
}

onMounted(async () => {
  try {
    const res = await getScenicCategories()
    const apiCats = (res.data?.categories || []).map((c) => ({
      label: c.label,
      value: c.value,
      count: c.count,
    }))
    categories.value = [{ label: '全部', value: '', count: null }, ...apiCats]
  } catch (error) {
    console.error('获取景点分类失败:', error)
  }
})
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
  display: inline-flex;
  align-items: center;
  gap: 4px;
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

.chip-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  border-radius: 9px;
  background: rgba(200, 169, 81, 0.15);
  font-size: 11px;
  font-weight: 600;
  color: var(--color-gold-light);
  line-height: 1;
}
</style>
