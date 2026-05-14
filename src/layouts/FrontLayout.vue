<template>
  <div class="front-layout">
    <AppHeader />
    <main class="front-main">
      <router-view />
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
}

.front-main {
  flex: 1;
  margin-top: 64px; /* header 高度 */
}
</style>
