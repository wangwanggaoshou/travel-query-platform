<template>
  <div class="register-page">
    <div class="register-card glass-dark">
      <div class="register-header">
        <el-icon size="44" color="#c8a951"><Compass /></el-icon>
        <h2 class="register-brand">旅途智览</h2>
        <span class="register-subtitle">WANDERLUST EDITORIAL</span>
        <div class="gold-divider centered"></div>
        <p class="register-desc">创建账号，开始您的旅行探索</p>
      </div>
      <RegisterForm @submit="handleRegister" />
      <div class="register-footer">
        <p>
          已有账号？
          <router-link to="/login" class="register-link">立即登录</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import RegisterForm from '@/components/user/RegisterForm.vue'

const router = useRouter()

async function handleRegister(form) {
  try {
    // TODO: 调用注册API
    ElMessage.success('注册成功，请登录')
    router.push('/login')
  } catch (error) {
    ElMessage.error('注册失败')
  }
}
</script>

<style scoped>
.register-page {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-xl);
  position: relative;
  z-index: 1;
}

.register-card {
  width: 480px;
  padding: var(--spacing-2xl);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-xl), 0 0 40px rgba(200, 169, 81, 0.05);
}

.register-header {
  text-align: center;
  margin-bottom: var(--spacing-xl);
}

.register-brand {
  font-family: var(--font-display);
  font-size: var(--font-size-3xl);
  font-weight: 700;
  color: var(--color-text-primary);
  margin: var(--spacing-sm) 0 0;
  letter-spacing: -0.02em;
}

.register-subtitle {
  font-family: var(--font-display);
  font-size: 10px;
  color: var(--color-gold);
  letter-spacing: 0.25em;
  text-transform: uppercase;
  opacity: 0.7;
}

.register-desc {
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  margin-top: var(--spacing-sm);
}

.register-footer {
  text-align: center;
  margin-top: var(--spacing-lg);
  padding-top: var(--spacing-lg);
  border-top: 1px solid var(--color-border-light);
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
}

.register-link {
  color: var(--color-gold);
  font-weight: 500;
  transition: color var(--transition-fast);
}

.register-link:hover {
  color: var(--color-gold-light);
}
</style>
