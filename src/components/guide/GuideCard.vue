<template>
  <div class="guide-card hover-lift" @click="$emit('click', guide)">
    <div class="guide-cover">
      <img v-if="guide.cover" :src="guide.cover" :alt="guide.title" loading="lazy" />
      <div v-else class="cover-placeholder">
        <el-icon :size="40"><Picture /></el-icon>
        <span>{{ coverLabel }}</span>
      </div>
    </div>
    <div class="guide-content">
      <div class="guide-tags">
        <el-tag v-for="tag in guide.tags" :key="tag" size="small" type="info" effect="plain">
          {{ tag }}
        </el-tag>
      </div>
      <div class="title-row">
        <h3 class="guide-title">{{ guide.title }}</h3>
        <el-tag size="small" type="warning" effect="plain">AI</el-tag>
      </div>
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
import { computed } from 'vue'
import { Picture } from '@element-plus/icons-vue'

const props = defineProps({
  guide: {
    type: Object,
    required: true,
  },
})

defineEmits(['click'])

const coverLabel = computed(() => {
  const tag = props.guide.tags?.find((t) => t && !['AI生成', '智能攻略'].includes(t))
  return tag || props.guide.title?.slice(0, 8) || 'AI 攻略'
})
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

.cover-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  color: var(--color-text-muted);
  background: linear-gradient(145deg, var(--color-bg-deep), var(--color-border-light));
  font-size: var(--font-size-sm);
  text-align: center;
  padding: var(--spacing-md);
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

.title-row {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-xs);
  margin-bottom: var(--spacing-sm);
}

.guide-title {
  font-size: var(--font-size-base);
  font-weight: 600;
  flex: 1;
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
