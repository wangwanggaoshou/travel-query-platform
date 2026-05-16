<template>
  <section class="hot-scenic section atmosphere-gradient">
    <div class="container">
      <div class="section-header">
        <span class="section-eyebrow">Editor's Pick</span>
        <h2 class="section-title">热门目的地</h2>
        <div class="gold-divider centered"></div>
        <p class="section-subtitle">精选全球最受瞩目的旅行目的地</p>
      </div>

      <div class="scenic-grid">
        <div
          v-for="(item, idx) in scenicList"
          :key="item.id"
          class="scenic-card hover-lift"
          :class="`reveal reveal-delay-${idx + 1}`"
          @click="$router.push(`/map?id=${item.id}`)"
        >
          <div class="card-image">
            <img :src="resolveScenicCover(item)" :alt="item.name" @error="onScenicImageError" />
            <div class="card-image-overlay"></div>
            <div class="card-badge">
              <el-tag size="small" effect="dark" class="gilded-tag">{{ item.category }}</el-tag>
            </div>
          </div>
          <div class="card-body">
            <h3 class="card-title">{{ item.name }}</h3>
            <p class="card-location">
              <el-icon><Location /></el-icon>
              {{ item.location }}
            </p>
            <p class="card-desc">{{ item.description }}</p>
            <div class="card-footer">
              <span class="card-price" v-if="item.price">
                <span class="price-currency">¥</span>{{ item.price }}<span class="price-suffix">起</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="view-more reveal reveal-delay-3">
        <div class="gold-divider centered" style="width:100px;margin-bottom:var(--spacing-lg)"></div>
        <el-button class="view-more-btn" round @click="$router.push('/scenic')">
          查看更多目的地
          <el-icon class="el-icon--right"><ArrowRight /></el-icon>
        </el-button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { resolveScenicCover, onScenicImageError } from '@/utils/scenicImage'

defineProps({
  scenicList: {
    type: Array,
    default: () => [],
  },
})
</script>

<style scoped>
.section-header {
  text-align: center;
  margin-bottom: var(--spacing-2xl);
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

.scenic-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--spacing-xl);
}

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

.card-image {
  position: relative;
  height: 220px;
  overflow: hidden;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 600ms cubic-bezier(0.16, 1, 0.3, 1);
}

.scenic-card:hover .card-image img {
  transform: scale(1.06);
}

.card-image-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(10, 15, 26, 0.72) 0%,
    rgba(10, 15, 26, 0.2) 32%,
    transparent 48%,
    transparent 60%,
    rgba(10, 15, 26, 0.6) 100%
  );
}

.card-badge {
  position: absolute;
  top: 16px;
  left: 16px;
}

.gilded-tag {
  background: rgba(10, 15, 26, 0.88) !important;
  backdrop-filter: blur(8px);
  border: 1px solid rgba(200, 169, 81, 0.45) !important;
  color: var(--color-gold-light) !important;
  font-family: var(--font-display);
  font-weight: 600 !important;
  letter-spacing: 0.05em;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.35);
}

.card-body {
  padding: var(--spacing-lg);
}

.card-title {
  font-family: var(--font-display);
  font-size: var(--font-size-xl);
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-xs);
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
  margin-bottom: var(--spacing-lg);
}

.card-footer {
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

.price-suffix {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  font-weight: 400;
}

.view-more {
  text-align: center;
  margin-top: var(--spacing-3xl);
}

.view-more-btn {
  background: transparent !important;
  border: 1px solid var(--color-gold-border) !important;
  color: var(--color-gold) !important;
  font-weight: 500 !important;
  letter-spacing: 0.03em !important;
  padding: 12px 32px !important;
  font-family: var(--font-body) !important;
}

.view-more-btn:hover {
  background: var(--color-gold-bg) !important;
  border-color: var(--color-gold) !important;
  color: var(--color-gold-light) !important;
}
</style>
