<template>
  <div class="review-list">
    <div class="review-header">
      <h3 class="review-title">
        <el-icon><ChatDotRound /></el-icon>
        网友评论
        <el-tag type="info" size="small">来自网络爬虫</el-tag>
      </h3>
      <!-- 来源筛选 -->
      <div class="review-source-filter">
        <span class="filter-label">来源：</span>
        <el-select v-model="currentSource" placeholder="全部来源" size="small" clearable>
          <el-option label="全部来源" value="" />
          <el-option
            v-for="source in sources"
            :key="source.value"
            :label="source.label"
            :value="source.value"
          />
        </el-select>
      </div>
    </div>

    <!-- 评论列表 -->
    <div class="reviews">
      <div v-for="review in reviews" :key="review.id" class="review-item">
        <div class="review-user">
          <el-avatar :size="40" icon="UserFilled" />
          <div class="user-info">
            <span class="user-name">{{ review.username }}</span>
            <div class="review-rating">
              <el-rate v-model="review.rating" disabled size="small" />
              <span class="review-date">{{ review.date }}</span>
            </div>
          </div>
        </div>
        <p class="review-content">{{ review.content }}</p>
        <!-- 来源信息 -->
        <div class="review-source">
          <el-icon><Link /></el-icon>
          <span>来源：</span>
          <a :href="review.sourceUrl" target="_blank" rel="noopener noreferrer" class="source-link">
            {{ review.sourceName }}
          </a>
          <el-tag size="small" type="info" effect="plain">
            {{ review.sourcePlatform }}
          </el-tag>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <el-empty v-if="reviews.length === 0" description="暂无评论数据" />

    <!-- 分页 -->
    <el-pagination
      v-if="total > pageSize"
      v-model:current-page="currentPage"
      :page-size="pageSize"
      :total="total"
      layout="prev, pager, next"
      @current-change="handlePageChange"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  reviews: {
    type: Array,
    default: () => [],
  },
  sources: {
    type: Array,
    default: () => [
      { label: '携程', value: 'ctrip' },
      { label: '马蜂窝', value: 'mafengwo' },
      { label: '去哪儿', value: 'qunar' },
      { label: '大众点评', value: 'dianping' },
      { label: 'TripAdvisor', value: 'tripadvisor' },
    ],
  },
  total: {
    type: Number,
    default: 0,
  },
  pageSize: {
    type: Number,
    default: 10,
  },
})

const emit = defineEmits(['page-change', 'source-change'])

const currentPage = ref(1)
const currentSource = ref('')

function handlePageChange(page) {
  emit('page-change', page)
}
</script>

<style scoped>
.review-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
  flex-wrap: wrap;
  gap: var(--spacing-md);
}

.review-title {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-size: var(--font-size-lg);
}

.review-source-filter {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.filter-label {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.review-item {
  padding: var(--spacing-lg) 0;
  border-bottom: 1px solid var(--color-border-light);
}

.review-item:last-child {
  border-bottom: none;
}

.review-user {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-sm);
}

.user-name {
  font-weight: 500;
  font-size: var(--font-size-sm);
}

.review-rating {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.review-date {
  color: var(--color-text-muted);
  font-size: var(--font-size-xs);
}

.review-content {
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  line-height: 1.8;
  margin-bottom: var(--spacing-sm);
  padding-left: 52px;
}

.review-source {
  display: flex;
  align-items: center;
  gap: 6px;
  padding-left: 52px;
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
}

.source-link {
  color: var(--color-primary);
  text-decoration: none;
  transition: color var(--transition-fast);
}

.source-link:hover {
  color: var(--color-primary-dark);
  text-decoration: underline;
}
</style>
