<template>
  <div class="register-page">
    <div class="register-card glass">
      <div class="register-header">
        <el-icon size="40" color="#0ea5e9"><Compass /></el-icon>
        <h2 class="gradient-text">旅途智览</h2>
        <p>创建新账号</p>
      </div>
      <RegisterForm @submit="handleRegister" />
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
}

.register-card {
  width: 420px;
  padding: var(--spacing-2xl);
  border-radius: var(--radius-xl);
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  box-shadow: var(--shadow-xl);
}

.register-header {
  text-align: center;
  margin-bottom: var(--spacing-xl);
}

.register-header h2 {
  font-size: var(--font-size-2xl);
  font-weight: 700;
  margin: var(--spacing-sm) 0;
}

.register-header p {
  color: var(--color-text-muted);
  font-size: var(--font-size-sm);
}
</style>
