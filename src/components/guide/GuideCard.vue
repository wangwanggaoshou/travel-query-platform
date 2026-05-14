<template>
  <div class="guide-card hover-lift" @click="$emit('click', guide)">
    <div class="guide-cover">
      <img :src="guide.cover" :alt="guide.title" />
    </div>
    <div class="guide-content">
      <div class="guide-tags">
        <el-tag v-for="tag in guide.tags" :key="tag" size="small" type="info" effect="plain">
          {{ tag }}
        </el-tag>
      </div>
      <h3 class="guide-title">{{ guide.title }}</h3>
      <p class="guide-summary">{{ guide.summary }}</p>
      <div class="guide-meta">
        <span class="meta-author">
          <el-icon><User /></el-icon>
          {{ guide.author }}
        </span>
        <span class="meta-date">{{ guide.date }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  guide: {
    type: Object,
    required: true,
  },
})

defineEmits(['click'])
</script>

<style scoped>
.guide-card {
  background: var(--color-bg-card);
  border-radius: var(--radius-lg);
  overflow: hidden;
  cursor: pointer;
  box-shadow: var(--shadow-sm);
}

.guide-cover {
  height: 200px;
  overflow: hidden;
}

.guide-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-slow);
}

.guide-card:hover .guide-cover img {
  transform: scale(1.08);
}

.guide-content {
  padding: var(--spacing-md);
}

.guide-tags {
  display: flex;
  gap: var(--spacing-xs);
  flex-wrap: wrap;
  margin-bottom: var(--spacing-sm);
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
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: var(--spacing-md);
}

.guide-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--color-text-muted);
  font-size: var(--font-size-xs);
}

.meta-author {
  display: flex;
  align-items: center;
  gap: 4px;
}
</style>
