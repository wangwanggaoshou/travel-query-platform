<template>
  <div class="guide-detail-page">
    <div class="container" v-loading="loading">
      <AppBreadcrumb :items="[{ title: 'AI 攻略', path: '/guide' }, { title: guide.title || '攻略详情' }]" />

      <article v-if="guide.id" class="guide-article">
        <div class="article-cover" v-if="guide.cover">
          <img :src="guide.cover" :alt="guide.title" />
        </div>

        <header class="article-header">
          <div class="article-tags" v-if="guide.tags?.length">
            <el-tag v-for="tag in guide.tags" :key="tag" size="small" type="info" effect="plain">
              {{ tag }}
            </el-tag>
          </div>
          <h1 class="article-title">{{ guide.title }}</h1>
          <el-tag type="warning" size="small" effect="dark" class="agent-badge">AI 生成</el-tag>
          <div class="article-meta">
            <span class="meta-author">
              <el-avatar :size="28" :src="guide.authorAvatar" icon="UserFilled" />
              {{ guide.author }}
            </span>
            <span class="meta-date">
              <el-icon><Calendar /></el-icon>
              {{ guide.date }}
            </span>
          </div>
        </header>

        <div class="article-content" v-html="guide.content"></div>

        <section class="related-guides" v-if="relatedGuides.length">
          <h2>相关攻略</h2>
          <div class="related-grid">
            <div
              v-for="item in relatedGuides"
              :key="item.id"
              class="related-item"
              @click="$router.push(`/guide/${item.id}`)"
            >
              <img v-if="item.cover" :src="item.cover" :alt="item.title" />
              <p>{{ item.title }}</p>
            </div>
          </div>
        </section>

        <section class="related-scenic" v-if="guide.scenic?.id">
          <h2>相关景点</h2>
          <el-button type="primary" @click="$router.push(`/map?id=${guide.scenic.id}`)">
            在地图上查看景点
          </el-button>
        </section>
      </article>

      <el-empty v-else-if="!loading" description="攻略不存在或已过期，请重新生成">
        <el-button type="primary" @click="$router.push('/guide')">返回 AI 攻略</el-button>
      </el-empty>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import AppBreadcrumb from '@/components/common/AppBreadcrumb.vue'
import { getRecentGuideById, getRelatedRecentGuides } from '@/utils/recentGuides'

const route = useRoute()
const loading = ref(false)
const guide = ref({})

const relatedGuides = computed(() =>
  getRelatedRecentGuides(guide.value.scenic?.id, guide.value.id).map((g) => ({
    id: g.id,
    title: g.title,
    cover: g.cover,
  }))
)

function loadGuide() {
  loading.value = true
  const found = getRecentGuideById(route.params.id)
  guide.value = found || {}
  loading.value = false
}

onMounted(loadGuide)
watch(() => route.params.id, loadGuide)
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

.agent-badge {
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

.meta-date {
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

.related-guides,
.related-scenic {
  padding: var(--spacing-xl);
  border-top: 1px solid var(--color-border-light);
}

.related-guides h2,
.related-scenic h2 {
  font-size: var(--font-size-xl);
  margin-bottom: var(--spacing-lg);
}

.related-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: var(--spacing-md);
}

.related-item {
  cursor: pointer;
  border-radius: var(--radius-md);
  overflow: hidden;
  border: 1px solid var(--color-border-light);
  transition: border-color var(--transition-fast);
}

.related-item:hover {
  border-color: var(--color-gold-border);
}

.related-item img {
  width: 100%;
  height: 120px;
  object-fit: cover;
}

.related-item p {
  padding: var(--spacing-sm);
  font-size: var(--font-size-sm);
}
</style>
