<template>
  <div class="scenic-card hover-lift" @click="$emit('click', scenic)">
    <div class="card-cover">
      <img :src="scenic.image" :alt="scenic.name" />
      <div class="card-cover-gradient"></div>
      <div class="card-overlay">
        <span class="card-category">{{ scenic.category }}</span>
      </div>
      <div class="card-score">
        <el-icon color="#c8a951"><Star /></el-icon>
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
        <span class="card-price" v-if="scenic.price">
          <span class="price-currency">¥</span>{{ scenic.price }}
        </span>
        <span class="card-reviews">
          <el-icon><ChatDotRound /></el-icon>
          {{ scenic.reviewCount || 0 }} 条评论
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

.card-cover {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.card-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 600ms cubic-bezier(0.16, 1, 0.3, 1);
}

.scenic-card:hover .card-cover img {
  transform: scale(1.06);
}

.card-cover-gradient {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(10, 15, 26, 0.5) 0%,
    transparent 40%
  );
}

.card-overlay {
  position: absolute;
  top: 12px;
  left: 12px;
}

.card-category {
  display: inline-block;
  padding: 4px 12px;
  background: rgba(200, 169, 81, 0.15);
  border: 1px solid var(--color-gold-border);
  border-radius: var(--radius-sm);
  font-size: var(--font-size-xs);
  color: var(--color-gold);
  font-family: var(--font-display);
  letter-spacing: 0.05em;
}

.card-score {
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(10, 15, 26, 0.8);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(200, 169, 81, 0.2);
  color: var(--color-gold);
  font-weight: 600;
  font-size: var(--font-size-sm);
  padding: 5px 12px;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  gap: 4px;
}

.card-info {
  padding: var(--spacing-md);
}

.card-name {
  font-family: var(--font-display);
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 4px;
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
  margin-bottom: var(--spacing-md);
}

.card-bottom {
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

.card-reviews {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
}
</style>
