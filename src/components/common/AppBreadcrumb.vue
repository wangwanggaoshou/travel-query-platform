<template>
  <el-breadcrumb separator="/" class="app-breadcrumb">
    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item v-for="item in items" :key="item.path" :to="item.path ? { path: item.path } : undefined">
      {{ item.title }}
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup>
defineProps({
  items: {
    type: Array,
    default: () => [],
    // items: [{ title: '页面名', path: '/xxx' }]
  },
})
</script>

<style scoped>
.app-breadcrumb {
  padding: var(--spacing-md) 0;
}
</style>
