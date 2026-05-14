<template>
  <section class="hot-scenic section">
    <div class="container">
      <h2 class="section-title">🔥 热门景点</h2>
      <p class="section-subtitle">精选全球热门旅游目的地</p>
      <div class="scenic-grid">
        <div
          v-for="item in scenicList"
          :key="item.id"
          class="scenic-card hover-lift"
          @click="$router.push(`/map?id=${item.id}`)"
        >
          <div class="card-image">
            <img :src="item.image" :alt="item.name" />
            <div class="card-badge">
              <el-tag type="primary" size="small" effect="dark">{{ item.category }}</el-tag>
            </div>
            <div class="card-rating">
              <el-icon color="#fbbf24"><Star /></el-icon>
              <span>{{ item.rating }}</span>
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
              <span class="card-price" v-if="item.price">¥{{ item.price }}起</span>
              <span class="card-reviews">{{ item.reviewCount }}条评论</span>
            </div>
          </div>
        </div>
      </div>
      <div class="view-more">
        <el-button type="primary" round @click="$router.push('/scenic')">
          查看更多景点
          <el-icon class="el-icon--right"><ArrowRight /></el-icon>
        </el-button>
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  scenicList: {
    type: Array,
    default: () => [],
  },
})
</script>

<style scoped>
.scenic-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--spacing-lg);
}

.scenic-card {
  background: var(--color-bg-card);
  border-radius: var(--radius-lg);
  overflow: hidden;
  cursor: pointer;
  box-shadow: var(--shadow-sm);
}

.card-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-slow);
}

.scenic-card:hover .card-image img {
  transform: scale(1.08);
}

.card-badge {
  position: absolute;
  top: 12px;
  left: 12px;
}

.card-rating {
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  padding: 4px 10px;
  border-radius: var(--radius-full);
  color: #fff;
  font-size: var(--font-size-sm);
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 4px;
}

.card-body {
  padding: var(--spacing-md);
}

.card-title {
  font-size: var(--font-size-lg);
  font-weight: 600;
  margin-bottom: var(--spacing-xs);
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

.card-footer {
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
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
}

.view-more {
  text-align: center;
  margin-top: var(--spacing-xl);
}
</style>
