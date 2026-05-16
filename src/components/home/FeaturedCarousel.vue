<template>
  <section class="featured-carousel-section">
    <div class="container">
      <div class="section-header">
        <span class="section-eyebrow">Featured</span>
        <h2 class="section-title">精选景点</h2>
        <div class="gold-divider centered"></div>
        <p class="section-subtitle">发现令人心动的旅行目的地</p>
      </div>

      <el-carousel
        :interval="5000"
        :autoplay="true"
        indicator-position="outside"
        :height="360"
        class="featured-carousel"
      >
        <el-carousel-item v-for="item in scenicList" :key="item.id">
          <div class="carousel-slide" @click="goToDetail(item)">
            <div class="slide-image">
              <img :src="resolveScenicCover(item)" :alt="item.name" @error="onScenicImageError" />
              <div class="slide-overlay"></div>
            </div>
            <div class="slide-content">
              <div class="slide-badge">
                <el-tag size="small" effect="dark" class="category-tag">{{ item.categoryLabel || item.category }}</el-tag>
              </div>
              <h3 class="slide-title">{{ item.name }}</h3>
              <p class="slide-location">
                <el-icon><Location /></el-icon>
                {{ item.location }}
              </p>
              <p class="slide-desc">{{ truncateText(item.description, 80) }}</p>
              <div class="slide-meta">
                <div class="price-box" v-if="item.price">
                  <span class="price-currency">¥</span>
                  <span class="price-value">{{ item.price }}</span>
                  <span class="price-label">起</span>
                </div>
              </div>
              <el-button class="slide-btn" size="default" round>
                查看详情
                <el-icon class="el-icon--right"><ArrowRight /></el-icon>
              </el-button>
            </div>
          </div>
        </el-carousel-item>
      </el-carousel>

      <!-- 快速导航缩略图 -->
      <div class="carousel-nav">
        <div
          v-for="(item, idx) in scenicList"
          :key="item.id"
          class="nav-thumb"
          @click="scrollToSlide(idx)"
        >
          <img :src="resolveScenicCover(item)" :alt="item.name" @error="onScenicImageError" />
          <span class="nav-name">{{ item.name }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { resolveScenicCover, onScenicImageError } from '@/utils/scenicImage'
import { truncateText } from '@/utils/format'

const router = useRouter()

defineProps({
  scenicList: {
    type: Array,
    default: () => [],
  },
})

function goToDetail(item) {
  router.push(`/map?id=${item.id}`)
}

function scrollToSlide(idx) {
  // 触发轮播切换
  const carousel = document.querySelector('.featured-carousel .el-carousel__container')
  if (carousel) {
    carousel.click()
  }
}
</script>

<style scoped>
.featured-carousel-section {
  padding: var(--spacing-2xl) 0;
}

.section-header {
  text-align: center;
  margin-bottom: var(--spacing-xl);
}

.section-eyebrow {
  font-family: var(--font-display);
  font-size: 11px;
  color: var(--color-gold);
  letter-spacing: 0.2em;
  text-transform: uppercase;
  margin-bottom: var(--spacing-sm);
  display: inline-block;
}

.section-title {
  font-family: var(--font-display);
  font-size: var(--font-size-3xl);
  font-weight: 700;
  color: var(--color-text-primary);
  letter-spacing: -0.02em;
  margin-bottom: var(--spacing-sm);
}

.section-subtitle {
  color: var(--color-text-secondary);
  font-size: var(--font-size-base);
  font-weight: 300;
}

.featured-carousel {
  border-radius: var(--radius-xl);
  overflow: hidden;
}

.carousel-slide {
  display: flex;
  height: 100%;
  background: var(--color-bg-card);
  border-radius: var(--radius-xl);
  overflow: hidden;
  cursor: pointer;
  transition: transform var(--transition-normal);
}

.slide-image {
  position: relative;
  width: 55%;
  height: 100%;
  overflow: hidden;
}

.slide-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 600ms cubic-bezier(0.16, 1, 0.3, 1);
}

.carousel-slide:hover .slide-image img {
  transform: scale(1.05);
}

.slide-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to right,
    transparent 60%,
    rgba(10, 15, 26, 0.9) 100%
  );
}

.slide-content {
  width: 45%;
  padding: var(--spacing-lg) var(--spacing-xl);
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.slide-badge {
  margin-bottom: var(--spacing-md);
}

.category-tag {
  background: rgba(10, 15, 26, 0.6) !important;
  backdrop-filter: blur(8px);
  border: 1px solid rgba(200, 169, 81, 0.45) !important;
  color: var(--color-gold-light) !important;
  font-family: var(--font-display);
  font-weight: 600 !important;
  letter-spacing: 0.05em;
}

.slide-title {
  font-family: var(--font-display);
  font-size: var(--font-size-2xl);
  font-weight: 700;
  color: var(--color-text-primary);
  letter-spacing: -0.01em;
  margin-bottom: var(--spacing-xs);
}

.slide-location {
  display: flex;
  align-items: center;
  gap: 4px;
  color: var(--color-text-muted);
  font-size: var(--font-size-sm);
  margin-bottom: var(--spacing-md);
}

.slide-desc {
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  line-height: 1.6;
  margin-bottom: var(--spacing-md);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.slide-meta {
  display: flex;
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-md);
}

.price-box {
  display: flex;
  align-items: center;
  gap: 4px;
}

.price-label {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
}

.price-currency {
  font-size: var(--font-size-sm);
  color: var(--color-gold);
  vertical-align: super;
}

.price-value {
  font-family: var(--font-display);
  font-size: var(--font-size-xl);
  font-weight: 700;
  color: var(--color-gold);
}

.slide-btn {
  background: linear-gradient(135deg, var(--color-gold-dark), var(--color-gold)) !important;
  border: none !important;
  color: var(--color-bg-deep) !important;
  font-weight: 600 !important;
  letter-spacing: 0.03em !important;
  padding: 10px 28px !important;
  box-shadow: 0 4px 16px rgba(200, 169, 81, 0.2);
}

.slide-btn:hover {
  transform: translateY(-2px) !important;
  box-shadow: 0 6px 24px rgba(200, 169, 81, 0.3) !important;
}

/* 缩略图导航 */
.carousel-nav {
  display: flex;
  justify-content: center;
  gap: var(--spacing-md);
  margin-top: var(--spacing-xl);
}

.nav-thumb {
  width: 100px;
  cursor: pointer;
  border-radius: var(--radius-md);
  overflow: hidden;
  border: 2px solid transparent;
  transition: all var(--transition-normal);
}

.nav-thumb:hover {
  border-color: var(--color-gold-border);
  transform: translateY(-4px);
}

.nav-thumb img {
  width: 100%;
  height: 60px;
  object-fit: cover;
}

.nav-name {
  display: block;
  text-align: center;
  padding: 4px;
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  background: var(--color-bg-card);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Element Plus 轮播样式覆盖 */
:deep(.el-carousel__indicators) {
  margin-top: var(--spacing-lg);
}

:deep(.el-carousel__indicator) {
  padding: 8px 4px;
}

:deep(.el-carousel__indicator .el-carousel__button) {
  width: 32px;
  height: 3px;
  background: var(--color-border-light);
  border-radius: 2px;
}

:deep(.el-carousel__indicator.is-active .el-carousel__button) {
  background: var(--color-gold);
}

@media (max-width: 900px) {
  .featured-carousel :deep(.el-carousel__container) {
    height: 320px !important;
  }

  .carousel-slide {
    flex-direction: column;
  }

  .slide-image {
    width: 100%;
    height: 50%;
  }

  .slide-content {
    width: 100%;
    padding: var(--spacing-lg);
  }

  .slide-overlay {
    background: linear-gradient(to bottom, transparent 40%, rgba(10, 15, 26, 0.9) 100%);
  }
}

@media (max-width: 600px) {
  .carousel-nav {
    display: none;
  }

  .slide-meta {
    flex-wrap: wrap;
    gap: var(--spacing-md);
  }
}
</style>