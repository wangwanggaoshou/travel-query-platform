<template>
  <div class="front-layout atmosphere-gradient">
    <AppHeader />
    <main class="front-main">
      <router-view v-slot="{ Component }">
        <transition name="page" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
  </div>
</template>

<script setup>
import AppHeader from '@/components/common/AppHeader.vue'
</script>

<style scoped>
.front-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--color-bg-deep);
}

.front-main {
  flex: 1;
  margin-top: 64px;
}

/* 页面切换动画 */
.page-enter-active {
  transition: opacity 400ms cubic-bezier(0.16, 1, 0.3, 1), transform 400ms cubic-bezier(0.16, 1, 0.3, 1);
}

.page-leave-active {
  transition: opacity 250ms ease, transform 250ms ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(16px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
