<template>
  <div class="blank-layout">
    <div class="blank-backdrop"></div>
    <router-view v-slot="{ Component }">
      <transition name="page" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<script setup>
// 空白布局 — Wanderlust Editorial 深色大气背景
</script>

<style scoped>
.blank-layout {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  background: var(--color-bg-deep);
}

/* 深色大气渐变背景 */
.blank-backdrop {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 80% 60% at 50% 0%, rgba(200, 169, 81, 0.07), transparent 70%),
    radial-gradient(ellipse 50% 50% at 20% 80%, rgba(13, 148, 136, 0.06), transparent 60%),
    radial-gradient(ellipse 50% 50% at 80% 80%, rgba(200, 169, 81, 0.04), transparent 60%),
    var(--color-bg-deep);
  pointer-events: none;
}

.page-enter-active {
  transition: opacity 400ms cubic-bezier(0.16, 1, 0.3, 1), transform 400ms cubic-bezier(0.16, 1, 0.3, 1);
}

.page-leave-active {
  transition: opacity 250ms ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(12px);
}

.page-leave-to {
  opacity: 0;
}
</style>
