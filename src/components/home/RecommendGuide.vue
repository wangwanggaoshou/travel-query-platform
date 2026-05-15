<template>
  <section class="recommend-guide section">
    <div class="container">
      <div class="section-header">
        <span class="section-eyebrow">Travel Stories</span>
        <h2 class="section-title">精选攻略</h2>
        <div class="gold-divider centered"></div>
        <p class="section-subtitle">来自旅行者的真实分享与深度建议</p>
      </div>

      <div class="guide-grid">
        <div
          v-for="(item, idx) in guideList"
          :key="item.id"
          class="guide-card hover-lift"
          :class="`reveal reveal-delay-${idx + 1}`"
          @click="$router.push(`/guide/${item.id}`)"
        >
          <div class="guide-image">
            <img :src="item.cover" :alt="item.title" />
            <div class="guide-image-overlay"></div>
          </div>
          <div class="guide-body">
            <div class="guide-tags">
              <el-tag v-for="tag in item.tags" :key="tag" size="small" class="guide-tag">
                {{ tag }}
              </el-tag>
            </div>
            <h3 class="guide-title">{{ item.title }}</h3>
            <p class="guide-summary">{{ item.summary }}</p>
            <div class="guide-meta">
              <span class="guide-author">
                <el-icon><User /></el-icon>
                {{ item.author }}
              </span>
              <span class="guide-date">{{ item.date }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  guideList: {
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

.guide-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: var(--spacing-xl);
}

.guide-card {
  display: flex;
  background: var(--color-bg-card);
  border-radius: var(--radius-md);
  overflow: hidden;
  cursor: pointer;
  border: 1px solid var(--color-border-light);
  transition: all var(--transition-normal);
}

.guide-card:hover {
  border-color: var(--color-gold-border);
}

.guide-image {
  width: 200px;
  min-height: 200px;
  flex-shrink: 0;
  overflow: hidden;
  position: relative;
}

.guide-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 600ms cubic-bezier(0.16, 1, 0.3, 1);
}

.guide-card:hover .guide-image img {
  transform: scale(1.06);
}

.guide-image-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to right,
    transparent 60%,
    rgba(10, 15, 26, 0.4) 100%
  );
}

.guide-body {
  flex: 1;
  padding: var(--spacing-lg);
  display: flex;
  flex-direction: column;
}

.guide-tags {
  display: flex;
  gap: var(--spacing-xs);
  margin-bottom: var(--spacing-md);
  flex-wrap: wrap;
}

.guide-tag {
  background: var(--color-bg-elevated) !important;
  border: 1px solid var(--color-border) !important;
  color: var(--color-text-muted) !important;
  font-family: var(--font-body);
}

.guide-title {
  font-family: var(--font-display);
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-sm);
  line-height: 1.35;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.guide-summary {
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  line-height: 1.7;
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.guide-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--color-text-muted);
  font-size: var(--font-size-xs);
  margin-top: var(--spacing-md);
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--color-border-light);
}

.guide-author {
  display: flex;
  align-items: center;
  gap: 4px;
  color: var(--color-gold);
  font-family: var(--font-display);
  letter-spacing: 0.02em;
}

@media (max-width: 768px) {
  .guide-grid {
    grid-template-columns: 1fr;
  }

  .guide-card {
    flex-direction: column;
  }

  .guide-image {
    width: 100%;
    height: 200px;
  }
}
</style>
