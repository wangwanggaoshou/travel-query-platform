<template>
  <div class="login-page">
    <div class="login-card glass">
      <div class="login-header">
        <el-icon size="40" color="#0ea5e9"><Compass /></el-icon>
        <h2 class="gradient-text">旅途智览</h2>
        <p>登录您的账号</p>
      </div>
      <LoginForm @submit="handleLogin" />
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import LoginForm from '@/components/user/LoginForm.vue'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { login } = useAuth()

async function handleLogin(form) {
  try {
    await login(form)
    ElMessage.success('登录成功')
  } catch (error) {
    ElMessage.error('登录失败，请检查用户名和密码')
  }
}
</script>

<style scoped>
.login-page {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-xl);
}

.login-card {
  width: 420px;
  padding: var(--spacing-2xl);
  border-radius: var(--radius-xl);
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  box-shadow: var(--shadow-xl);
}

.login-header {
  text-align: center;
  margin-bottom: var(--spacing-xl);
}

.login-header h2 {
  font-size: var(--font-size-2xl);
  font-weight: 700;
  margin: var(--spacing-sm) 0;
}

.login-header p {
  color: var(--color-text-muted);
  font-size: var(--font-size-sm);
}
</style>
