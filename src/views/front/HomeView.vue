<template>
  <div class="home-page">
    <!-- Hero 全屏 -->
    <HeroBanner />

    <!-- 搜索区域 -->
    <section class="search-section">
      <div class="container">
        <SearchBar
          v-model="searchKeyword"
          placeholder="探索目的地、景点、游记…"
          @search="handleSearch"
        />
      </div>
    </section>

    <!-- 热门景点 -->
    <HotScenic :scenic-list="hotScenicList" />

    <!-- 特色目的地条带 -->
    <section class="featured-strip section atmosphere-gradient">
      <div class="container">
        <div class="featured-header">
          <span class="section-eyebrow">Curated</span>
          <h2 class="section-title">特色目的地</h2>
          <div class="gold-divider centered"></div>
          <p class="section-subtitle">从山峦到海滩，精心策划的旅行灵感</p>
        </div>
        <div class="featured-grid">
          <div class="featured-item" v-for="dest in featuredDestinations" :key="dest.label">
            <div class="featured-bg" :style="{ background: dest.gradient }">
              <span class="featured-icon">{{ dest.icon }}</span>
              <span class="featured-label">{{ dest.label }}</span>
              <span class="featured-count">{{ dest.count }}+</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 推荐攻略 -->
    <RecommendGuide :guide-list="recommendGuides" />

    <!-- CTA 区域 -->
    <section class="cta-section">
      <div class="cta-card">
        <h2 class="cta-title reveal">准备好开启旅程了吗？</h2>
        <p class="cta-desc reveal reveal-delay-1">加入我们，发现属于你的下一个目的地</p>
        <el-button class="cta-btn reveal reveal-delay-2" size="large" round @click="$router.push('/register')">
          立即注册
          <el-icon class="el-icon--right"><ArrowRight /></el-icon>
        </el-button>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import HeroBanner from '@/components/home/HeroBanner.vue'
import HotScenic from '@/components/home/HotScenic.vue'
import RecommendGuide from '@/components/home/RecommendGuide.vue'
import SearchBar from '@/components/common/SearchBar.vue'

const router = useRouter()
const searchKeyword = ref('')
const hotScenicList = ref([])
const recommendGuides = ref([])

const featuredDestinations = ref([
  { icon: '🏔️', label: '山岳景观', count: 128, gradient: 'linear-gradient(135deg, #1a2236, #232d42)' },
  { icon: '🏖️', label: '海滨度假', count: 96, gradient: 'linear-gradient(135deg, #1a2236, #1f2a3f)' },
  { icon: '🏛️', label: '历史古迹', count: 85, gradient: 'linear-gradient(135deg, #1a2236, #232d42)' },
  { icon: '🌆', label: '城市观光', count: 142, gradient: 'linear-gradient(135deg, #1a2236, #1f2a3f)' },
  { icon: '🎢', label: '主题乐园', count: 54, gradient: 'linear-gradient(135deg, #1a2236, #232d42)' },
  { icon: '🌿', label: '自然风光', count: 203, gradient: 'linear-gradient(135deg, #1a2236, #1f2a3f)' },
])

function handleSearch(keyword) {
  router.push({ path: '/scenic', query: { keyword } })
}
</script>

<style scoped>
.search-section {
  margin-top: -60px;
  position: relative;
  z-index: 10;
  padding: 0 0 var(--spacing-lg);
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

/* 特色目的地条带 */
.featured-strip {
  padding: var(--spacing-3xl) 0;
}

.featured-header {
  text-align: center;
  margin-bottom: var(--spacing-2xl);
}

.featured-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: var(--spacing-md);
}

.featured-item {
  cursor: pointer;
  transition: transform var(--transition-normal);
}

.featured-item:hover {
  transform: translateY(-6px);
}

.featured-item:hover .featured-bg {
  border-color: var(--color-gold-border);
  box-shadow: var(--shadow-gold);
}

.featured-bg {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-lg);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border-light);
  transition: all var(--transition-normal);
}

.featured-icon {
  font-size: 2rem;
}

.featured-label {
  font-family: var(--font-display);
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
  font-weight: 600;
}

.featured-count {
  font-family: var(--font-display);
  font-size: var(--font-size-sm);
  color: var(--color-gold);
  font-weight: 700;
}

/* CTA 区域 */
.cta-section {
  padding: var(--spacing-3xl) var(--content-padding);
}

.cta-card {
  max-width: 700px;
  margin: 0 auto;
  text-align: center;
  padding: var(--spacing-3xl);
  background: var(--color-bg-card);
  border: 1px solid var(--color-gold-border);
  border-radius: var(--radius-xl);
  position: relative;
  overflow: hidden;
}

.cta-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 50% 0%, rgba(200, 169, 81, 0.08), transparent 50%);
  pointer-events: none;
}

.cta-title {
  font-family: var(--font-display);
  font-size: var(--font-size-3xl);
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-sm);
  letter-spacing: -0.02em;
}

.cta-desc {
  color: var(--color-text-secondary);
  font-size: var(--font-size-lg);
  font-weight: 300;
  margin-bottom: var(--spacing-xl);
}

.cta-btn {
  background: linear-gradient(135deg, var(--color-gold-dark), var(--color-gold)) !important;
  border: none !important;
  color: var(--color-bg-deep) !important;
  font-weight: 600 !important;
  padding: 14px 40px !important;
  letter-spacing: 0.03em;
  box-shadow: 0 4px 20px rgba(200, 169, 81, 0.25);
}

.cta-btn:hover {
  transform: translateY(-2px) !important;
  box-shadow: 0 8px 30px rgba(200, 169, 81, 0.35) !important;
}

@media (max-width: 768px) {
  .featured-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 480px) {
  .featured-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
