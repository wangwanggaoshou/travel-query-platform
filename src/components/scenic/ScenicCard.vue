<template>
  <div class="scenic-card hover-lift" @click="$emit('click', scenic)">
    <div class="card-cover">
      <img :src="scenic.image" :alt="scenic.name" />
      <div class="card-overlay">
        <el-tag type="primary" size="small" effect="dark">{{ scenic.category }}</el-tag>
      </div>
      <div class="card-score">
        <el-icon><Star /></el-icon>
        {{ scenic.rating }}
      </div>
    </div>
    <div class="card-info">
      <h3 class="card-name">{{ scenic.name }}</h3>
      <p class="card-location">
        <el-icon><Location /></el-icon>
        {{ scenic.location }}
      </p>
      <p class="card-desc">{{ scenic.description }}</p>
      <div class="card-bottom">
        <span class="card-price" v-if="scenic.price">¥{{ scenic.price }}</span>
        <span class="card-reviews">
          <el-icon><ChatDotRound /></el-icon>
          {{ scenic.reviewCount || 0 }}条评论
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  scenic: {
    type: Object,
    required: true,
  },
})

defineEmits(['click'])
</script>

<style scoped>
.scenic-card {
  background: var(--color-bg-card);
  border-radius: var(--radius-lg);
  overflow: hidden;
  cursor: pointer;
  box-shadow: var(--shadow-sm);
}

.card-cover {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.card-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-slow);
}

.scenic-card:hover .card-cover img {
  transform: scale(1.08);
}

.card-overlay {
  position: absolute;
  top: 12px;
  left: 12px;
}

.card-score {
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  color: #fbbf24;
  font-weight: 600;
  font-size: var(--font-size-sm);
  padding: 4px 10px;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  gap: 4px;
}

.card-info {
  padding: var(--spacing-md);
}

.card-name {
  font-size: var(--font-size-lg);
  font-weight: 600;
  margin-bottom: 4px;
}

.card-location {
  display: flex;
  align-items: center;
  gap: 4px;
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  margin-bottom: var(--spacing-sm);
}

.card-desc {
  color: var(--color-text-muted);
  font-size: var(--font-size-sm);
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: var(--spacing-md);
}

.card-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-price {
  font-size: var(--font-size-lg);
  font-weight: 700;
  color: var(--color-accent-dark);
}

.card-reviews {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
}
</style>
