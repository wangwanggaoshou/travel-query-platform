<template>
  <div class="guide-detail-page">
    <div class="container" v-loading="loading">
      <AppBreadcrumb :items="[{ title: '旅游攻略', path: '/guide' }, { title: guide.title || '攻略详情' }]" />

      <article class="guide-article">
        <!-- 封面图 -->
        <div class="article-cover" v-if="guide.cover">
          <img :src="guide.cover" :alt="guide.title" />
        </div>

        <!-- 文章头部 -->
        <header class="article-header">
          <div class="article-tags" v-if="guide.tags">
            <el-tag v-for="tag in guide.tags" :key="tag" size="small" type="info" effect="plain">
              {{ tag }}
            </el-tag>
          </div>
          <h1 class="article-title">{{ guide.title }}</h1>
          <div class="article-meta">
            <span class="meta-author">
              <el-avatar :size="28" icon="UserFilled" />
              {{ guide.author }}
            </span>
            <span class="meta-date">
              <el-icon><Calendar /></el-icon>
              {{ guide.date }}
            </span>
            <span class="meta-views">
              <el-icon><View /></el-icon>
              {{ guide.views || 0 }}次浏览
            </span>
          </div>
        </header>

        <!-- 文章内容 -->
        <div class="article-content" v-html="guide.content"></div>

        <!-- 相关景点 -->
        <section class="related-scenic" v-if="guide.relatedScenic && guide.relatedScenic.length">
          <h2>相关景点</h2>
          <div class="related-grid">
            <ScenicCard
              v-for="scenic in guide.relatedScenic"
              :key="scenic.id"
              :scenic="scenic"
              @click="$router.push(`/map?id=${scenic.id}`)"
            />
          </div>
        </section>
      </article>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import AppBreadcrumb from '@/components/common/AppBreadcrumb.vue'
import ScenicCard from '@/components/scenic/ScenicCard.vue'

const route = useRoute()
const loading = ref(false)
const guide = ref({})

onMounted(() => {
  const id = route.params.id
  // TODO: 获取攻略详情
})
</script>

<style scoped>
.guide-detail-page {
  padding: var(--spacing-lg) 0 var(--spacing-3xl);
}

.guide-article {
  max-width: 860px;
  margin: 0 auto;
  background: var(--color-bg-card);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
}

.article-cover {
  height: 400px;
  overflow: hidden;
}

.article-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.article-header {
  padding: var(--spacing-xl) var(--spacing-xl) 0;
}

.article-tags {
  display: flex;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
}

.article-title {
  font-size: var(--font-size-3xl);
  font-weight: 700;
  line-height: 1.4;
  margin-bottom: var(--spacing-md);
}

.article-meta {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
  color: var(--color-text-muted);
  font-size: var(--font-size-sm);
  padding-bottom: var(--spacing-lg);
  border-bottom: 1px solid var(--color-border-light);
}

.meta-author {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.meta-date,
.meta-views {
  display: flex;
  align-items: center;
  gap: 4px;
}

.article-content {
  padding: var(--spacing-xl);
  line-height: 2;
  color: var(--color-text-secondary);
  font-size: var(--font-size-base);
}

.article-content :deep(img) {
  max-width: 100%;
  border-radius: var(--radius-md);
  margin: var(--spacing-md) 0;
}

.article-content :deep(h2) {
  font-size: var(--font-size-xl);
  margin: var(--spacing-xl) 0 var(--spacing-md);
  color: var(--color-text-primary);
}

.related-scenic {
  padding: var(--spacing-xl);
  border-top: 1px solid var(--color-border-light);
}

.related-scenic h2 {
  font-size: var(--font-size-xl);
  margin-bottom: var(--spacing-lg);
}

.related-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: var(--spacing-md);
}
</style>
