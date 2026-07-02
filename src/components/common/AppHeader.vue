<template>
  <header class="app-header glass-dark" :class="{ scrolled: isScrolled }">
    <div class="container header-container">
      <!-- Logo -->
      <router-link to="/" class="header-logo">
        <el-icon size="28" color="#c8a951"><Compass /></el-icon>
        <div class="logo-title-container">
          <span class="logo-text">{{ isGlobeRoute ? '环球旅游探索' : '旅途智览' }}</span>
          <span class="logo-accent">{{ isGlobeRoute ? 'GLOBE EXPLORER' : 'WANDERLUST' }}</span>
        </div>
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

      <!-- 右侧控制区 -->
      <div class="header-actions">
        <template v-if="isGlobeRoute">
          <button class="control-btn" @click="triggerGlobeReset" title="重置视角">
            <el-icon><HomeFilled /></el-icon>
          </button>
          <button class="control-btn" @click="triggerGlobeToggleRotate" :class="{ active: isGlobeRotating }" title="自动旋转">
            <el-icon><Refresh /></el-icon>
          </button>
        </template>
        <div v-else class="header-actions-placeholder"></div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const isScrolled = ref(false)
const isGlobeRotating = ref(false)

const isGlobeRoute = computed(() => route.path === '/globe')

function handleScroll() {
  isScrolled.value = window.scrollY > 20
}

function triggerGlobeReset() {
  window.dispatchEvent(new CustomEvent('globe-reset'))
}

function triggerGlobeToggleRotate() {
  window.dispatchEvent(new CustomEvent('globe-toggle-rotate'))
}

function handleRotationChanged(e) {
  isGlobeRotating.value = !!e.detail?.active
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  window.addEventListener('globe-rotation-changed', handleRotationChanged)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('globe-rotation-changed', handleRotationChanged)
})
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
  justify-content: space-between;
  height: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 var(--content-padding);
}

/* Logo */
.header-logo {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  text-decoration: none;
  width: 220px;
  flex-shrink: 0;
  white-space: nowrap;
}

.logo-title-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
}

.logo-text {
  font-family: var(--font-display);
  font-size: 18px;
  font-weight: 700;
  color: var(--color-text-primary);
  letter-spacing: 0.02em;
  white-space: nowrap;
  line-height: 1.2;
}

.logo-accent {
  font-family: var(--font-display);
  font-size: 9px;
  color: var(--color-gold);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  opacity: 0.7;
  white-space: nowrap;
  line-height: 1.1;
  margin-top: 1px;
}

/* 导航 */
.header-nav {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
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
  white-space: nowrap;
  flex-shrink: 0;
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

/* 右侧控制区 */
.header-actions {
  width: 220px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.control-btn {
  width: 34px;
  height: 34px;
  border: none;
  border-radius: var(--radius-md);
  background: rgba(17, 24, 39, 0.85);
  backdrop-filter: blur(12px);
  color: var(--color-text-secondary);
  font-size: 14px;
  cursor: pointer;
  transition: all var(--transition-normal);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--color-border-light);
}

.control-btn:hover {
  transform: translateY(-2px);
  color: var(--color-gold);
  background: var(--color-bg-card-hover);
  border-color: var(--color-gold-border);
  box-shadow: var(--shadow-gold);
}

.control-btn.active {
  background: linear-gradient(135deg, var(--color-teal-dark) 0%, var(--color-teal) 100%);
  color: white;
  border-color: var(--color-teal);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(13, 148, 136, 0.4); }
  50% { box-shadow: 0 0 0 10px rgba(13, 148, 136, 0); }
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

  .header-logo, .header-actions {
    width: auto;
    justify-content: center;
  }

  .header-actions-placeholder {
    display: none;
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
