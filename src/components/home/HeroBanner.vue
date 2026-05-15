<template>
  <section class="hero-banner">
    <div class="hero-slide">
      <div class="hero-backdrop"></div>
      <div class="hero-content">
        <span class="hero-eyebrow reveal reveal-delay-1">Wanderlust Editorial</span>
        <h1 class="hero-title reveal reveal-delay-2">
          探索世界<br /><span class="hero-title-accent">发现未知之美</span>
        </h1>
        <p class="hero-desc reveal reveal-delay-3">
          汇聚全球热门景点的真实评论与智能推荐，<br />让每一次旅途都成为值得珍藏的故事
        </p>
        <div class="hero-actions reveal reveal-delay-4">
          <el-button class="hero-btn-primary" size="large" round @click="$router.push('/scenic')">
            开始探索
            <el-icon class="el-icon--right"><ArrowRight /></el-icon>
          </el-button>
          <el-button class="hero-btn-secondary" size="large" round @click="$router.push('/recommend')">
            智能推荐
          </el-button>
        </div>
      </div>
    </div>
    <div class="hero-scroll-hint">
      <span>向下探索</span>
      <el-icon><ArrowDown /></el-icon>
    </div>
  </section>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
</script>

<style scoped>
.hero-banner {
  position: relative;
  min-height: calc(100vh - 64px);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  margin-bottom: 0;
}

/* 深色大气背景 */
.hero-backdrop {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 80% 50% at 50% 0%, rgba(200, 169, 81, 0.08), transparent 60%),
    radial-gradient(ellipse 60% 40% at 20% 80%, rgba(13, 148, 136, 0.07), transparent 60%),
    radial-gradient(ellipse 40% 60% at 80% 50%, rgba(200, 169, 81, 0.04), transparent 50%),
    linear-gradient(180deg, var(--color-bg-deep) 0%, var(--color-bg-primary) 50%, var(--color-bg-deep) 100%);
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
  z-index: 1;
  text-align: center;
  max-width: 800px;
  padding: 0 var(--content-padding);
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

.hero-btn-secondary:hover {
  background: var(--color-gold-bg) !important;
  border-color: var(--color-gold) !important;
}

/* 底部滚动提示 */
.hero-scroll-hint {
  position: absolute;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  color: var(--color-text-muted);
  font-size: 11px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  animation: float 3s ease-in-out infinite;
  opacity: 0.6;
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
