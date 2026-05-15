<template>
  <div class="breadcrumb-wrapper">
    <el-breadcrumb separator="·" class="app-breadcrumb">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item v-for="item in items" :key="item.path" :to="item.path ? { path: item.path } : undefined">
        {{ item.title }}
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script setup>
defineProps({
  items: {
    type: Array,
    default: () => [],
  },
})
</script>

<style scoped>
.breadcrumb-wrapper {
  padding: var(--spacing-md) 0;
  border-bottom: 1px solid var(--color-border-light);
  margin-bottom: var(--spacing-lg);
}

.app-breadcrumb {
  font-size: var(--font-size-sm);
  letter-spacing: 0.02em;
}

.app-breadcrumb :deep(.el-breadcrumb__separator) {
  color: var(--color-gold);
  font-weight: 300;
}
</style>
