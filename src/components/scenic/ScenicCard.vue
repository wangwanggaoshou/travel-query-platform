<template>
  <div class="scenic-card hover-lift" @click="$emit('click', scenic)">
    <div class="card-cover">
      <img ref="coverRef" :src="coverUrl" :alt="scenic.name" @error="handleImageError" />
      <div class="card-cover-gradient"></div>
      <div class="card-overlay">
        <span class="card-category">{{ scenic.categoryLabel || scenic.category }}</span>
      </div>
    </div>
    <div class="card-info">
      <h3 class="card-name" v-html="displayName"></h3>
      <p class="card-location">
        <el-icon><Location /></el-icon>
        {{ scenic.location }}
      </p>
      <p v-if="showDescription" class="card-desc" v-html="displayDesc"></p>
      <div class="card-bottom">
        <span class="card-price" v-if="scenic.price">
          <span class="price-currency">¥</span>{{ scenic.price }}
        </span>
        <span class="card-region" v-if="scenic.region === 'domestic'">国内</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { resolveScenicCover, onScenicImageError, tryEnrichScenicImage } from '@/utils/scenicImage'

const props = defineProps({
  scenic: {
    type: Object,
    required: true,
  },
  showDescription: {
    type: Boolean,
    default: true,
  },
  keyword: {
    type: String,
    default: '',
  },
})

defineEmits(['click'])

const coverUrl = computed(() => resolveScenicCover(props.scenic))
const coverRef = ref(null)

function highlight(text) {
  if (!text || !props.keyword) return text
  const kw = String(props.keyword).trim()
  if (!kw) return text
  const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return String(text).replace(
    new RegExp(`(${escaped})`, 'gi'),
    '<mark class="kw-hl">$1</mark>'
  )
}

const displayName = computed(() => highlight(props.scenic.name))
const displayDesc = computed(() => highlight(props.scenic.description))

function handleImageError(e) {
  onScenicImageError(e)
  tryEnrichScenicImage(props.scenic, e.target)
}
</script>

<style scoped>
.scenic-card {
  background: var(--color-bg-card);
  border-radius: var(--radius-md);
  overflow: hidden;
  cursor: pointer;
  border: 1px solid var(--color-border-light);
  transition: all var(--transition-normal);
}

.scenic-card:hover {
  border-color: var(--color-gold-border);
  box-shadow: var(--shadow-lg), var(--shadow-gold);
}

.card-cover {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.card-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 600ms cubic-bezier(0.16, 1, 0.3, 1);
}

.scenic-card:hover .card-cover img {
  transform: scale(1.06);
}

.card-cover-gradient {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(10, 15, 26, 0.72) 0%,
    rgba(10, 15, 26, 0.2) 32%,
    transparent 48%,
    transparent 60%,
    rgba(10, 15, 26, 0.5) 100%
  );
}

.card-overlay {
  position: absolute;
  top: 12px;
  left: 12px;
}

.card-category {
  display: inline-block;
  padding: 5px 12px;
  background: rgba(10, 15, 26, 0.88);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(200, 169, 81, 0.45);
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  font-weight: 600;
  color: var(--color-gold-light);
  font-family: var(--font-display);
  letter-spacing: 0.05em;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.35);
}

.card-info {
  padding: var(--spacing-md);
}

.card-name {
  font-family: var(--font-display);
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 4px;
  letter-spacing: -0.01em;
}

.card-location {
  display: flex;
  align-items: center;
  gap: 4px;
  color: var(--color-text-muted);
  font-size: var(--font-size-sm);
  margin-bottom: var(--spacing-md);
}

.card-desc {
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  line-height: 1.7;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: var(--spacing-md);
}

.card-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--color-border-light);
}

.card-price {
  font-family: var(--font-display);
  font-size: var(--font-size-2xl);
  font-weight: 700;
  color: var(--color-gold);
}

.price-currency {
  font-size: var(--font-size-sm);
  vertical-align: super;
}

.card-region {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
}

:deep(.kw-hl) {
  background: rgba(200, 169, 81, 0.25);
  color: var(--color-gold-light);
  border-radius: 2px;
  padding: 0 2px;
}
</style>
