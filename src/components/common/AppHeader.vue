<template>
  <header class="app-header glass-dark" :class="{ scrolled: isScrolled }">
    <div class="container header-container">
      <!-- Logo -->
      <router-link to="/" class="header-logo">
        <el-icon size="28" color="#c8a951"><Compass /></el-icon>
        <span class="logo-text">旅途智览</span>
        <span class="logo-accent">WANDERLUST</span>
      </router-link>

      <!-- 导航菜单 -->
      <nav class="header-nav">
        <router-link to="/" class="nav-link" active-class="active">
          <el-icon><HomeFilled /></el-icon>
          <span>首页</span>
        </router-link>
        <router-link to="/scenic" class="nav-link" active-class="active">
          <el-icon><Place /></el-icon>
          <span>景点查询</span>
        </router-link>
        <router-link to="/guide" class="nav-link" active-class="active">
          <el-icon><Reading /></el-icon>
          <span>AI 攻略</span>
        </router-link>
        <router-link to="/recommend" class="nav-link" active-class="active">
          <el-icon><MagicStick /></el-icon>
          <span>智能推荐</span>
        </router-link>
        <router-link to="/map" class="nav-link" active-class="active">
          <el-icon><Location /></el-icon>
          <span>地图探索</span>
        </router-link>
        <router-link to="/globe" class="nav-link" active-class="active">
          <el-icon><Promotion /></el-icon>
          <span>3D地球</span>
        </router-link>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const isScrolled = ref(false)

function handleScroll() {
  isScrolled.value = window.scrollY > 20
}

onMounted(() => window.addEventListener('scroll', handleScroll))
onUnmounted(() => window.removeEventListener('scroll', handleScroll))
</script>

<style scoped>
.app-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  height: 64px;
  transition: all var(--transition-normal);
}

.app-header.scrolled {
  border-bottom-color: var(--color-gold-border);
  box-shadow: 0 1px 20px rgba(0, 0, 0, 0.4);
}

.header-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: clamp(24px, 4vw, 56px);
  height: 100%;
  max-width: 1120px;
  margin: 0 auto;
  padding: 0 var(--content-padding);
}

/* Logo */
.header-logo {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  text-decoration: none;
  flex-shrink: 0;
}

.logo-text {
  font-family: var(--font-display);
  font-size: var(--font-size-xl);
  font-weight: 700;
  color: var(--color-text-primary);
  letter-spacing: -0.01em;
}

.logo-accent {
  font-family: var(--font-display);
  font-size: 10px;
  color: var(--color-gold);
  letter-spacing: 0.2em;
  text-transform: uppercase;
  opacity: 0.7;
  margin-top: 4px;
}

/* 导航 */
.header-nav {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2px;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border-radius: var(--radius-sm);
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  font-weight: 500;
  transition: all var(--transition-fast);
  text-decoration: none;
  position: relative;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: 2px;
  left: 16px;
  right: 16px;
  height: 2px;
  background: var(--color-gold);
  transform: scaleX(0);
  transition: transform var(--transition-normal);
}

.nav-link:hover {
  color: var(--color-gold);
  background: var(--color-gold-bg);
}

.nav-link:hover::after {
  transform: scaleX(1);
}

.nav-link.active {
  color: var(--color-gold);
  background: var(--color-gold-bg);
  font-weight: 600;
}

.nav-link.active::after {
  transform: scaleX(1);
}

@media (max-width: 900px) {
  .header-container {
    flex-direction: column;
    justify-content: center;
    gap: 4px;
    padding-top: 6px;
    padding-bottom: 6px;
  }

  .app-header {
    height: auto;
    min-height: 64px;
  }

  .header-nav {
    padding-bottom: 4px;
  }

  .nav-link span {
    display: none;
  }

  .nav-link {
    padding: 8px 10px;
  }
}
</style>
