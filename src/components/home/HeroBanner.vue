<template>
  <section ref="heroRef" class="hero-banner">
    <div class="hero-slide">
      <div class="hero-backdrop"></div>
      <div class="hero-content">
        <span class="hero-eyebrow">Wanderlust Editorial</span>
        <h1 class="hero-title">
          探索世界<br /><span class="hero-title-accent">发现未知之美</span>
        </h1>
        <p class="hero-desc">
          汇聚国内热门景点信息与智能推荐，<br />让每一次旅途都成为值得珍藏的故事
        </p>
        <div class="hero-actions">
          <el-button class="hero-btn-primary" size="large" round @click="$router.push('/scenic')">
            开始探索
            <el-icon class="el-icon--right"><ArrowRight /></el-icon>
          </el-button>
          <el-button class="hero-btn-secondary" size="large" round @click="$router.push('/recommend')">
            智能推荐
          </el-button>
        </div>
        <div class="hero-stats">
          <div class="stat-item">
            <span class="stat-value">全球灵感</span>
            <span class="stat-label">景点与攻略聚合</span>
          </div>
          <div class="stat-divider" aria-hidden="true" />
          <div class="stat-item">
            <span class="stat-value">高德 POI</span>
            <span class="stat-label">真实坐标与地址</span>
          </div>
          <div class="stat-divider" aria-hidden="true" />
          <div class="stat-item">
            <span class="stat-value">地图 · 3D</span>
            <span class="stat-label">双模式探索</span>
          </div>
        </div>
      </div>
    </div>
    <button
      type="button"
      class="hero-scroll-hint"
      :class="{ 'is-hidden': !showScrollHint }"
      aria-label="向下滚动浏览更多内容"
      @click="scrollToContent"
    >
      <span>向下探索</span>
      <el-icon><ArrowDown /></el-icon>
    </button>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const heroRef = ref(null)
const showScrollHint = ref(true)

function updateScrollHint() {
  const el = heroRef.value
  if (!el) return
  const rect = el.getBoundingClientRect()
  // 仍在首屏 Hero 区域内时保持显示（约 25% 高度滚出后才隐藏）
  showScrollHint.value = rect.bottom > window.innerHeight * 0.25
}

function scrollToContent() {
  const el = heroRef.value
  if (!el) return
  const target = Math.max(0, el.offsetHeight - 72)
  window.scrollTo({ top: target, behavior: 'smooth' })
}

onMounted(() => {
  updateScrollHint()
  window.addEventListener('scroll', updateScrollHint, { passive: true })
  window.addEventListener('resize', updateScrollHint, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', updateScrollHint)
  window.removeEventListener('resize', updateScrollHint)
})
</script>

<style scoped>
.hero-banner {
  position: relative;
  min-height: min(88vh, 820px);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  margin-bottom: 0;
  padding-bottom: 48px;
}

/* 深色大气背景 */
.hero-backdrop {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 70% 55% at 50% 35%, rgba(200, 169, 81, 0.18), transparent 65%),
    radial-gradient(ellipse 50% 40% at 15% 75%, rgba(13, 148, 136, 0.12), transparent 55%),
    radial-gradient(ellipse 45% 50% at 85% 45%, rgba(200, 169, 81, 0.08), transparent 50%),
    linear-gradient(180deg, var(--color-bg-deep) 0%, var(--color-bg-primary) 45%, var(--color-bg-deep) 100%);
  pointer-events: none;
}

/* 背景几何装饰 */
.hero-backdrop::before {
  content: '';
  position: absolute;
  top: 10%;
  right: -5%;
  width: 50%;
  height: 60%;
  background:
    linear-gradient(135deg, transparent 49.5%, rgba(200, 169, 81, 0.06) 49.5%, rgba(200, 169, 81, 0.06) 50.5%, transparent 50.5%);
  opacity: 0.5;
}

.hero-content {
  position: relative;
  z-index: 2;
  text-align: center;
  max-width: 800px;
  padding: 0 var(--content-padding);
}

/* 首屏文案默认可见，不依赖全局 .reveal 动画 */
.hero-content :is(.hero-eyebrow, .hero-title, .hero-desc, .hero-actions, .hero-stats) {
  opacity: 1;
  transform: none;
}

.hero-eyebrow {
  font-family: var(--font-display);
  font-size: 12px;
  color: var(--color-gold);
  letter-spacing: 0.25em;
  text-transform: uppercase;
  margin-bottom: var(--spacing-lg);
  display: inline-block;
}

.hero-title {
  font-family: var(--font-display);
  font-size: var(--font-size-hero);
  font-weight: 700;
  color: var(--color-text-primary);
  line-height: 1.1;
  letter-spacing: -0.02em;
  margin-bottom: var(--spacing-lg);
}

.hero-title-accent {
  font-family: var(--font-display);
  font-style: italic;
  background: linear-gradient(135deg, var(--color-gold) 0%, var(--color-gold-light) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-desc {
  font-family: var(--font-body);
  font-size: var(--font-size-lg);
  color: var(--color-text-secondary);
  line-height: 1.8;
  margin-bottom: var(--spacing-xl);
  font-weight: 300;
}

.hero-actions {
  display: flex;
  gap: var(--spacing-md);
  justify-content: center;
  flex-wrap: wrap;
}

.hero-btn-primary {
  background: linear-gradient(135deg, var(--color-gold-dark), var(--color-gold)) !important;
  border: none !important;
  color: var(--color-bg-deep) !important;
  font-weight: 600 !important;
  font-family: var(--font-body) !important;
  padding: 14px 36px !important;
  letter-spacing: 0.03em;
  box-shadow: 0 4px 20px rgba(200, 169, 81, 0.25);
  font-size: var(--font-size-base) !important;
}

.hero-btn-primary:hover {
  transform: translateY(-2px) !important;
  box-shadow: 0 8px 30px rgba(200, 169, 81, 0.35) !important;
}

.hero-btn-secondary {
  background: transparent !important;
  border: 1px solid var(--color-gold-border) !important;
  color: var(--color-gold) !important;
  font-weight: 500 !important;
  font-family: var(--font-body) !important;
  padding: 14px 36px !important;
  letter-spacing: 0.03em;
  font-size: var(--font-size-base) !important;
}

.hero-stats {
  margin-top: var(--spacing-2xl);
  display: flex;
  align-items: stretch;
  justify-content: center;
  gap: var(--spacing-lg);
  flex-wrap: wrap;
  padding: var(--spacing-lg) var(--spacing-xl);
  background: rgba(17, 24, 39, 0.45);
  border: 1px solid rgba(200, 169, 81, 0.15);
  border-radius: var(--radius-lg);
  backdrop-filter: blur(12px);
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  min-width: 100px;
}

.stat-value {
  font-family: var(--font-display);
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--color-gold);
  letter-spacing: 0.06em;
}

.stat-label {
  font-size: 11px;
  color: var(--color-text-muted);
  letter-spacing: 0.04em;
}

.stat-divider {
  width: 1px;
  align-self: stretch;
  min-height: 36px;
  background: rgba(200, 169, 81, 0.2);
}

@media (max-width: 640px) {
  .hero-stats {
    flex-direction: column;
    align-items: center;
  }
  .stat-divider {
    width: 60%;
    height: 1px;
    min-height: 0;
  }
}
.hero-scroll-hint {
  position: fixed;
  bottom: 28px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border: none;
  background: transparent;
  color: var(--color-text-secondary);
  font-size: 11px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  cursor: pointer;
  animation: float 3s ease-in-out infinite;
  z-index: 50;
  transition: opacity 0.4s ease, visibility 0.4s ease;
}

.hero-scroll-hint:hover {
  color: var(--color-gold);
}

.hero-scroll-hint.is-hidden {
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  animation: none;
}

@keyframes float {
  0%, 100% { transform: translateX(-50%) translateY(0); }
  50% { transform: translateX(-50%) translateY(6px); }
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 36px;
  }

  .hero-desc {
    font-size: var(--font-size-base);
  }

  .hero-btn-primary,
  .hero-btn-secondary {
    padding: 12px 28px !important;
    font-size: var(--font-size-sm) !important;
  }
}
</style>
