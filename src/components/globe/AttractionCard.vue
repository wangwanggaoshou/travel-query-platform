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
      </div>

      <!-- 景点列表 -->
      <div class="attractions-list">
        <div
          v-for="attraction in attractions"
          :key="attraction.id"
          class="attraction-item"
          @click="onAttractionClick(attraction)"
        >
          <div class="image-wrapper">
            <img
              :src="attraction.image"
              :alt="attraction.name"
              loading="lazy"
              @error="onImageError"
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
          </div>
        </div>
      </div>

      <!-- 底部提示 -->
      <div class="card-footer">
        <span>点击地图其他位置发现更多</span>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  countryData: {
    type: Object,
    default: null
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

const onImageError = (e) => {
  e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect fill="%231a2236" width="400" height="300"/%3E%3Ctext fill="%236b6560" font-family="sans-serif" font-size="20" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3E景点图片%3C/text%3E%3C/svg%3E'
}
</script>

<style scoped>
.attraction-card {
  position: fixed;
  right: 30px;
  top: 50%;
  transform: translateY(-50%);
  width: 400px;
  max-height: 80vh;
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-xl);
  overflow: hidden;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  border: 1px solid var(--color-border);
}

.close-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 36px;
  height: 36px;
  border: none;
  background: rgba(200, 169, 81, 0.1);
  border-radius: var(--radius-full);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-normal);
  z-index: 10;
  color: var(--color-text-secondary);
}

.close-btn:hover {
  background: rgba(239, 68, 68, 0.2);
  transform: rotate(90deg);
  color: var(--color-danger);
}

.country-header {
  padding: 24px 24px 16px;
  background: linear-gradient(135deg, var(--color-bg-secondary) 0%, var(--color-bg-elevated) 100%);
  color: var(--color-text-primary);
  display: flex;
  align-items: center;
  gap: 16px;
  border-bottom: 1px solid var(--color-border-light);
}

.flag {
  font-size: 48px;
  line-height: 1;
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
  letter-spacing: 0.15em;
}

.attractions-list {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.attractions-list::-webkit-scrollbar {
  width: 6px;
}

.attractions-list::-webkit-scrollbar-thumb {
  background: var(--color-border);
  border-radius: var(--radius-full);
}

.attraction-item {
  display: flex;
  gap: 16px;
  padding: 16px;
  margin-bottom: 12px;
  background: var(--color-bg-secondary);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all var(--transition-normal);
  border: 1px solid transparent;
}

.attraction-item:hover {
  transform: translateX(-4px);
  background: var(--color-bg-card-hover);
  border-color: var(--color-gold-border);
  box-shadow: var(--shadow-gold);
}

.attraction-item:last-child {
  margin-bottom: 0;
}

.image-wrapper {
  flex-shrink: 0;
  width: 100px;
  height: 100px;
  border-radius: var(--radius-md);
  overflow: hidden;
  position: relative;
}

.image-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-normal);
}

.attraction-item:hover .image-wrapper img {
  transform: scale(1.05);
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to top, rgba(200, 169, 81, 0.2), transparent);
  opacity: 0;
  transition: opacity var(--transition-normal);
}

.attraction-item:hover .image-overlay {
  opacity: 1;
}

.content {
  flex: 1;
  min-width: 0;
}

.name {
  font-family: var(--font-display);
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0 0 6px 0;
  line-height: 1.3;
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
}

.description {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  line-height: 1.6;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-footer {
  padding: 12px 24px;
  background: var(--color-bg-secondary);
  border-top: 1px solid var(--color-border-light);
  text-align: center;
}

.card-footer span {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
}

/* 动画效果 */
.card-fade-enter-active,
.card-fade-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.card-fade-enter-from {
  opacity: 0;
  transform: translateY(-50%) translateX(50px);
}

.card-fade-leave-to {
  opacity: 0;
  transform: translateY(-50%) translateX(50px);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .attraction-card {
    right: 16px;
    left: 16px;
    width: auto;
    max-height: 70vh;
  }

  .card-fade-enter-from,
  .card-fade-leave-to {
    transform: translateY(100%);
  }
}
</style>