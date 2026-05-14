<template>
  <div class="profile-page">
    <div class="container">
      <div class="user-layout">
        <!-- 侧边菜单 -->
        <aside class="user-sidebar">
          <div class="user-card">
            <el-avatar :size="80" icon="UserFilled" />
            <h3>{{ userStore.username || '用户' }}</h3>
            <p>{{ userStore.location || '未设置所在地' }}</p>
          </div>
          <el-menu :default-active="$route.path" router>
            <el-menu-item index="/user/profile">
              <el-icon><User /></el-icon>
              <span>个人信息</span>
            </el-menu-item>
            <el-menu-item index="/user/preferences">
              <el-icon><Setting /></el-icon>
              <span>旅游偏好</span>
            </el-menu-item>
            <el-menu-item index="/user/visa">
              <el-icon><Tickets /></el-icon>
              <span>签证信息</span>
            </el-menu-item>
            <el-menu-item index="/user/favorites">
              <el-icon><Star /></el-icon>
              <span>我的收藏</span>
            </el-menu-item>
          </el-menu>
        </aside>

        <!-- 内容区 -->
        <main class="user-content">
          <el-card shadow="never">
            <template #header>
              <h2>个人信息</h2>
            </template>
            <el-form :model="profileForm" label-width="100px" style="max-width: 500px">
              <el-form-item label="用户名">
                <el-input v-model="profileForm.username" disabled />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input v-model="profileForm.email" />
              </el-form-item>
              <el-form-item label="所在地">
                <el-input v-model="profileForm.location" placeholder="请输入您的所在城市" />
              </el-form-item>
              <el-form-item label="个人简介">
                <el-input v-model="profileForm.bio" type="textarea" :rows="3" placeholder="介绍一下自己吧" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="handleSave">保存修改</el-button>
              </el-form-item>
            </el-form>
          </el-card>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'

const userStore = useUserStore()

const profileForm = ref({
  username: '',
  email: '',
  location: '',
  bio: '',
})

function handleSave() {
  // TODO: 调用更新 API
  ElMessage.success('保存成功')
}

onMounted(() => {
  if (userStore.userInfo) {
    profileForm.value = { ...userStore.userInfo }
  }
})
</script>

<style scoped>
.profile-page {
  padding: var(--spacing-xl) 0 var(--spacing-3xl);
}

.user-layout {
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: var(--spacing-xl);
}

.user-sidebar {
  position: sticky;
  top: 80px;
  align-self: start;
}

.user-card {
  text-align: center;
  padding: var(--spacing-xl);
  background: var(--color-bg-card);
  border-radius: var(--radius-lg);
  margin-bottom: var(--spacing-md);
  box-shadow: var(--shadow-sm);
}

.user-card h3 {
  margin-top: var(--spacing-md);
  font-size: var(--font-size-lg);
}

.user-card p {
  color: var(--color-text-muted);
  font-size: var(--font-size-sm);
  margin-top: 4px;
}

.user-content :deep(.el-card) {
  border-radius: var(--radius-md);
}

.user-content h2 {
  font-size: var(--font-size-xl);
}

@media (max-width: 768px) {
  .user-layout {
    grid-template-columns: 1fr;
  }
}
</style>
