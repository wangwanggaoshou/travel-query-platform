<template>
  <transition name="card-fade">
    <div class="attraction-card glass-dark" v-if="visible" @click.stop>
      <!-- 关闭按钮 -->
      <button class="close-btn" @click="onClose">
        <el-icon><Close /></el-icon>
      </button>

      <!-- 国家标题 -->
      <div class="country-header">
        <span class="flag">{{ countryData?.flag }}</span>
        <div class="title">
          <h2>{{ countryData?.name }}</h2>
          <span class="subtitle">{{ countryData?.nameEn }}</span>
        </div>
        <div v-if="loading" class="header-loading">
          <el-icon class="is-loading"><Loading /></el-icon>
          <span>景色加载中</span>
        </div>
      </div>

      <!-- 景点列表 -->
      <div class="attractions-list" v-loading="loading" element-loading-text="正在加载标志性目的地…">
        <div
          v-for="attraction in attractions"
          :key="attraction.id"
          class="attraction-item"
          @click="onAttractionClick(attraction)"
        >
          <div class="image-wrapper">
            <img
              :src="coverUrl(attraction)"
              :alt="attraction.name"
              loading="lazy"
              @error="onScenicImageError"
            />
            <div class="image-overlay"></div>
          </div>
          <div class="content">
            <h3 class="name">{{ attraction.name }}</h3>
            <p class="location">
              <el-icon><Location /></el-icon>
              {{ attraction.location }}
            </p>
            <p class="description">{{ attraction.description }}</p>
            <span v-if="typeLabel(attraction.type)" class="type-badge">{{ typeLabel(attraction.type) }}</span>
          </div>
        </div>
      </div>

      <div class="card-footer">
        <span>AI 实时发现 · 最多 5 个目的地 · 点击查看详情与攻略</span>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { computed } from 'vue'
import { resolveScenicCover, onScenicImageError } from '@/utils/scenicImage'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  countryData: {
    type: Object,
    default: null
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'select'])

const attractions = computed(() => {
  return props.countryData?.attractions || []
})

const onClose = () => {
  emit('close')
}

const onAttractionClick = (attraction) => {
  emit('select', attraction)
}

const TYPE_LABELS = {
  landmark: '地标',
  nature: '自然奇观',
  event: '节庆/体验',
}

function typeLabel(type) {
  return TYPE_LABELS[type] || ''
}

function coverUrl(attraction) {
  return resolveScenicCover(attraction)
}
</script>

<style scoped>
.attraction-card {
  position: fixed;
  right: 32px;
  top: 50%;
  transform: translateY(-50%);
  width: 440px;
  max-height: 82vh;
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-xl), 0 0 40px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  border: 1px solid var(--color-border-light);
}

.close-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 38px;
  height: 38px;
  border: none;
  background: rgba(15, 23, 42, 0.75);
  backdrop-filter: blur(8px);
  border-radius: var(--radius-full);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  z-index: 10;
  color: var(--color-text-secondary);
}

.close-btn:hover {
  background: rgba(239, 68, 68, 0.25);
  transform: rotate(90deg);
  color: #fff;
}

.country-header {
  padding: 28px 28px 20px;
  background: linear-gradient(160deg, rgba(17, 24, 39, 0.98) 0%, rgba(30, 41, 59, 0.95) 100%);
  color: var(--color-text-primary);
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 18px;
  border-bottom: 1px solid rgba(200, 169, 81, 0.15);
  position: relative;
}

.country-header::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 28px;
  right: 28px;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(200, 169, 81, 0.3), transparent);
}

.header-loading {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: var(--font-size-xs);
  color: var(--color-gold);
}

.header-loading .el-icon {
  font-size: 16px;
}

.flag {
  font-size: 52px;
  line-height: 1;
  filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.3));
}

.title h2 {
  font-family: var(--font-display);
  font-size: var(--font-size-2xl);
  font-weight: 700;
  margin: 0;
  letter-spacing: 0.02em;
  color: var(--color-text-primary);
}

.subtitle {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.18em;
  font-weight: 500;
}

.attractions-list {
  flex: 1;
  overflow-y: auto;
  padding: 20px 16px;
  background: rgba(10, 15, 26, 0.4);
}

.attractions-list::-webkit-scrollbar {
  width: 5px;
}

.attractions-list::-webkit-scrollbar-thumb {
  background: rgba(200, 169, 81, 0.2);
  border-radius: var(--radius-full);
}

.attractions-list::-webkit-scrollbar-track {
  background: transparent;
}

.attraction-item {
  display: flex;
  gap: 16px;
  padding: 16px;
  margin-bottom: 14px;
  background: rgba(17, 24, 39, 0.6);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(255, 255, 255, 0.04);
  position: relative;
}

.attraction-item::before {
  content: '';
  position: absolute;
  inset: -1px;
  border-radius: var(--radius-lg);
  padding: 1px;
  background: linear-gradient(135deg, rgba(200, 169, 81, 0), rgba(200, 169, 81, 0));
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  transition: all 0.3s ease;
  pointer-events: none;
}

.attraction-item:hover {
  transform: translateX(-6px);
  background: rgba(30, 41, 59, 0.7);
  border-color: rgba(200, 169, 81, 0.3);
  box-shadow: 0 4px 20px rgba(200, 169, 81, 0.1);
}

.attraction-item:hover::before {
  background: linear-gradient(135deg, rgba(200, 169, 81, 0.4), rgba(13, 148, 136, 0.2));
}

.attraction-item:last-child {
  margin-bottom: 0;
}

.image-wrapper {
  flex-shrink: 0;
  width: 110px;
  height: 110px;
  border-radius: var(--radius-md);
  overflow: hidden;
  position: relative;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
}

.image-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.attraction-item:hover .image-wrapper img {
  transform: scale(1.08);
}

.image-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(200, 169, 81, 0.15), transparent 60%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.attraction-item:hover .image-overlay {
  opacity: 1;
}

.content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.name {
  font-family: var(--font-display);
  font-size: var(--font-size-base);
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0 0 6px 0;
  line-height: 1.3;
}

.attraction-item:hover .name {
  color: var(--color-gold-light);
}

.location {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
  margin: 0 0 8px 0;
  display: flex;
  align-items: center;
  gap: 4px;
}

.location .el-icon {
  color: var(--color-gold);
  font-size: 13px;
}

.description {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  line-height: 1.65;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.type-badge {
  display: inline-block;
  margin-top: 8px;
  padding: 3px 10px;
  font-size: 10px;
  color: var(--color-gold);
  border: 1px solid rgba(200, 169, 81, 0.3);
  border-radius: var(--radius-full);
  background: rgba(200, 169, 81, 0.06);
  letter-spacing: 0.04em;
  font-weight: 500;
}

.card-footer {
  padding: 14px 24px;
  background: rgba(17, 24, 39, 0.9);
  border-top: 1px solid rgba(200, 169, 81, 0.1);
  text-align: center;
}

.card-footer span {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
  letter-spacing: 0.03em;
}

/* 动画效果 */
.card-fade-enter-active {
  transition: all 0.45s cubic-bezier(0.22, 1, 0.36, 1);
}

.card-fade-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.card-fade-enter-from {
  opacity: 0;
  transform: translateY(-50%) translateX(60px);
}

.card-fade-leave-to {
  opacity: 0;
  transform: translateY(-50%) translateX(40px);
}

/* 响应式 */
@media (max-width: 768px) {
  .attraction-card {
    right: 12px;
    left: 12px;
    width: auto;
    max-height: 72vh;
  }

  .country-header {
    padding: 20px 20px 16px;
  }

  .flag {
    font-size: 40px;
  }

  .image-wrapper {
    width: 80px;
    height: 80px;
  }

  .card-fade-enter-from,
  .card-fade-leave-to {
    transform: translateY(30%);
  }
}
</style>
