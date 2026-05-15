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
          <span>旅游攻略</span>
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

      <!-- 用户区域 -->
      <div class="header-actions">
        <template v-if="userStore.isLoggedIn">
          <el-dropdown trigger="click">
            <div class="user-trigger">
              <el-avatar :size="34" icon="UserFilled" />
              <span class="user-name">{{ userStore.username }}</span>
              <el-icon><ArrowDown /></el-icon>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="$router.push('/user/profile')">
                  <el-icon><User /></el-icon>个人信息
                </el-dropdown-item>
                <el-dropdown-item @click="$router.push('/user/preferences')">
                  <el-icon><Setting /></el-icon>旅游偏好
                </el-dropdown-item>
                <el-dropdown-item @click="$router.push('/user/favorites')">
                  <el-icon><Star /></el-icon>我的收藏
                </el-dropdown-item>
                <el-dropdown-item divided @click="handleLogout">
                  <el-icon><SwitchButton /></el-icon>退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
        <template v-else>
          <el-button class="btn-login" round @click="$router.push('/login')">
            登录
          </el-button>
        </template>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()
const isScrolled = ref(false)

function handleScroll() {
  isScrolled.value = window.scrollY > 20
}

function handleLogout() {
  userStore.logout()
  router.push('/')
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
  justify-content: space-between;
  height: 100%;
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
  gap: var(--spacing-xs);
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
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

/* 用户区域 */
.header-actions {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.user-trigger {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  cursor: pointer;
  padding: 4px 10px;
  border-radius: var(--radius-full);
  transition: background var(--transition-fast);
}

.user-trigger:hover {
  background: var(--color-bg-card-hover);
}

.user-name {
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--color-text-primary);
}

.btn-login {
  background: transparent;
  border: 1px solid var(--color-gold-border);
  color: var(--color-gold);
  font-weight: 500;
}

.btn-login:hover {
  background: var(--color-gold-bg);
  border-color: var(--color-gold);
  color: var(--color-gold);
}
</style>
