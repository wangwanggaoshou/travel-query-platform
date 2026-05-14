<template>
  <div class="blank-layout">
    <router-view />
  </div>
</template>

<script setup>
// 空白布局 - 用于登录/注册页面
</script>

<style scoped>
.blank-layout {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #0ea5e9 0%, #6366f1 50%, #a855f7 100%);
}
</style>
