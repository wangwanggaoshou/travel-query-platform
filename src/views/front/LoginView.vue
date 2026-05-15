<template>
  <div class="login-page">
    <div class="login-card glass-dark">
      <div class="login-header">
        <el-icon size="44" color="#c8a951"><Compass /></el-icon>
        <h2 class="login-brand">旅途智览</h2>
        <span class="login-subtitle">WANDERLUST EDITORIAL</span>
        <div class="gold-divider centered"></div>
        <p class="login-desc">登录您的账号，继续探索世界</p>
      </div>
      <LoginForm @submit="handleLogin" />
      <div class="login-footer">
        <p>
          还没有账号？
          <router-link to="/register" class="login-link">立即注册</router-link>
        </p>
      </div>
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
  position: relative;
  z-index: 1;
}

.login-card {
  width: 440px;
  padding: var(--spacing-2xl);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-xl), 0 0 40px rgba(200, 169, 81, 0.05);
}

.login-header {
  text-align: center;
  margin-bottom: var(--spacing-xl);
}

.login-brand {
  font-family: var(--font-display);
  font-size: var(--font-size-3xl);
  font-weight: 700;
  color: var(--color-text-primary);
  margin: var(--spacing-sm) 0 0;
  letter-spacing: -0.02em;
}

.login-subtitle {
  font-family: var(--font-display);
  font-size: 10px;
  color: var(--color-gold);
  letter-spacing: 0.25em;
  text-transform: uppercase;
  opacity: 0.7;
}

.login-desc {
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  margin-top: var(--spacing-sm);
}

.login-footer {
  text-align: center;
  margin-top: var(--spacing-lg);
  padding-top: var(--spacing-lg);
  border-top: 1px solid var(--color-border-light);
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
}

.login-link {
  color: var(--color-gold);
  font-weight: 500;
  transition: color var(--transition-fast);
}

.login-link:hover {
  color: var(--color-gold-light);
}
</style>
