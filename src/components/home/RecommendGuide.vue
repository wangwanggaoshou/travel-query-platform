<template>
  <section class="recommend-guide section">
    <div class="container">
      <h2 class="section-title">📖 精选攻略</h2>
      <p class="section-subtitle">来自旅行达人的真实分享与建议</p>
      <div class="guide-grid">
        <div
          v-for="item in guideList"
          :key="item.id"
          class="guide-card hover-lift"
          @click="$router.push(`/guide/${item.id}`)"
        >
          <div class="guide-image">
            <img :src="item.cover" :alt="item.title" />
          </div>
          <div class="guide-body">
            <div class="guide-tags">
              <el-tag v-for="tag in item.tags" :key="tag" size="small" type="info" effect="plain">
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
.guide-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: var(--spacing-lg);
}

.guide-card {
  display: flex;
  background: var(--color-bg-card);
  border-radius: var(--radius-lg);
  overflow: hidden;
  cursor: pointer;
  box-shadow: var(--shadow-sm);
}

.guide-image {
  width: 180px;
  min-height: 180px;
  flex-shrink: 0;
  overflow: hidden;
}

.guide-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-slow);
}

.guide-card:hover .guide-image img {
  transform: scale(1.08);
}

.guide-body {
  flex: 1;
  padding: var(--spacing-md);
  display: flex;
  flex-direction: column;
}

.guide-tags {
  display: flex;
  gap: var(--spacing-xs);
  margin-bottom: var(--spacing-sm);
  flex-wrap: wrap;
}

.guide-title {
  font-size: var(--font-size-base);
  font-weight: 600;
  margin-bottom: var(--spacing-sm);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.guide-summary {
  color: var(--color-text-muted);
  font-size: var(--font-size-sm);
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.guide-meta {
  display: flex;
  justify-content: space-between;
  color: var(--color-text-muted);
  font-size: var(--font-size-xs);
  margin-top: var(--spacing-sm);
}

.guide-author {
  display: flex;
  align-items: center;
  gap: 4px;
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
    height: 180px;
  }
}
</style>
