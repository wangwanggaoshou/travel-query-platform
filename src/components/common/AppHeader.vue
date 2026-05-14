<template>
  <header class="app-header glass" :class="{ scrolled: isScrolled }">
    <div class="container header-container">
      <!-- Logo -->
      <router-link to="/" class="header-logo">
        <el-icon size="28" color="#0ea5e9"><Compass /></el-icon>
        <span class="logo-text gradient-text">旅途智览</span>
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
          <el-button type="primary" round @click="$router.push('/login')">
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
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid transparent;
  transition: all var(--transition-normal);
}

.app-header.scrolled {
  border-bottom-color: var(--color-border-light);
  box-shadow: var(--shadow-sm);
}

.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
}

.header-logo {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  text-decoration: none;
}

.logo-text {
  font-size: var(--font-size-xl);
  font-weight: 700;
}

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
  border-radius: var(--radius-full);
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  font-weight: 500;
  transition: all var(--transition-fast);
  text-decoration: none;
}

.nav-link:hover {
  color: var(--color-primary);
  background: var(--color-primary-bg);
}

.nav-link.active {
  color: var(--color-primary);
  background: var(--color-primary-bg);
  font-weight: 600;
}

.header-actions {
  display: flex;
  align-items: center;
}

.user-trigger {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  cursor: pointer;
  padding: 4px 8px;
  border-radius: var(--radius-full);
  transition: background var(--transition-fast);
}

.user-trigger:hover {
  background: var(--color-bg-hover);
}

.user-name {
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--color-text-primary);
}
</style>
