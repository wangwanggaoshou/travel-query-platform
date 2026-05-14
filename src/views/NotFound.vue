<template>
  <div class="not-found-page">
    <div class="not-found-content">
      <h1 class="error-code gradient-text">404</h1>
      <h2>页面未找到</h2>
      <p>抱歉，您访问的页面不存在或已被移除</p>
      <div class="actions">
        <el-button type="primary" size="large" round @click="$router.push('/')">
          <el-icon><HomeFilled /></el-icon>
          返回首页
        </el-button>
        <el-button size="large" round @click="$router.back()">
          <el-icon><Back /></el-icon>
          返回上页
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
// 404 页面
</script>

<style scoped>
.not-found-page {
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: var(--spacing-xl);
}

.error-code {
  font-size: 120px;
  font-weight: 900;
  line-height: 1;
  margin-bottom: var(--spacing-md);
}

.not-found-content h2 {
  font-size: var(--font-size-2xl);
  margin-bottom: var(--spacing-sm);
}

.not-found-content p {
  color: var(--color-text-muted);
  margin-bottom: var(--spacing-xl);
}

.actions {
  display: flex;
  gap: var(--spacing-md);
  justify-content: center;
}
</style>
