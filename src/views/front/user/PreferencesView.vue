<template>
  <div class="preferences-page">
    <div class="container">
      <div class="user-layout">
        <aside class="user-sidebar">
          <div class="user-card">
            <el-avatar :size="80" icon="UserFilled" />
            <h3>{{ userStore.username || '用户' }}</h3>
          </div>
          <el-menu :default-active="$route.path" router>
            <el-menu-item index="/user/profile"><el-icon><User /></el-icon><span>个人信息</span></el-menu-item>
            <el-menu-item index="/user/preferences"><el-icon><Setting /></el-icon><span>旅游偏好</span></el-menu-item>
            <el-menu-item index="/user/visa"><el-icon><Tickets /></el-icon><span>签证信息</span></el-menu-item>
            <el-menu-item index="/user/favorites"><el-icon><Star /></el-icon><span>我的收藏</span></el-menu-item>
          </el-menu>
        </aside>

        <main class="user-content">
          <el-card shadow="never">
            <template #header>
              <h2>旅游偏好设置</h2>
            </template>

            <el-form label-width="120px" style="max-width: 600px">
              <el-form-item label="偏好旅行类型">
                <el-checkbox-group v-model="prefForm.travelTypes">
                  <el-checkbox v-for="type in travelTypeOptions" :key="type" :label="type">{{ type }}</el-checkbox>
                </el-checkbox-group>
              </el-form-item>

              <el-form-item label="偏好气候">
                <el-checkbox-group v-model="prefForm.climates">
                  <el-checkbox v-for="c in climateOptions" :key="c" :label="c">{{ c }}</el-checkbox>
                </el-checkbox-group>
              </el-form-item>

              <el-form-item label="预算范围">
                <el-slider v-model="prefForm.budget" :min="0" :max="50000" :step="1000" range :format-tooltip="v => `¥${v}`" />
              </el-form-item>

              <el-form-item label="出行天数偏好">
                <el-radio-group v-model="prefForm.duration">
                  <el-radio label="short">短途(1-3天)</el-radio>
                  <el-radio label="medium">中程(4-7天)</el-radio>
                  <el-radio label="long">长途(7天以上)</el-radio>
                </el-radio-group>
              </el-form-item>

              <el-form-item label="饮食偏好">
                <el-checkbox-group v-model="prefForm.foodPrefs">
                  <el-checkbox v-for="f in foodOptions" :key="f" :label="f">{{ f }}</el-checkbox>
                </el-checkbox-group>
              </el-form-item>

              <el-form-item label="语言能力">
                <el-checkbox-group v-model="prefForm.languages">
                  <el-checkbox v-for="l in languageOptions" :key="l" :label="l">{{ l }}</el-checkbox>
                </el-checkbox-group>
              </el-form-item>

              <el-form-item>
                <el-button type="primary" @click="handleSave">保存偏好</el-button>
                <el-button @click="handleReset">重置</el-button>
              </el-form-item>
            </el-form>
          </el-card>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'

const userStore = useUserStore()

const travelTypeOptions = ['自然风光', '历史古迹', '海滨度假', '城市观光', '主题乐园', '山岳徒步', '文化体验', '美食之旅', '购物', '探险']
const climateOptions = ['热带', '温带', '寒带', '四季分明', '常年温暖']
const foodOptions = ['中餐', '西餐', '日料', '韩餐', '东南亚', '清真', '素食']
const languageOptions = ['中文', '英语', '日语', '韩语', '法语', '西班牙语']

const prefForm = ref({
  travelTypes: [],
  climates: [],
  budget: [0, 10000],
  duration: 'medium',
  foodPrefs: [],
  languages: ['中文'],
})

function handleSave() {
  // TODO: 调用偏好更新 API
  ElMessage.success('偏好已保存')
}

function handleReset() {
  prefForm.value = {
    travelTypes: [],
    climates: [],
    budget: [0, 10000],
    duration: 'medium',
    foodPrefs: [],
    languages: ['中文'],
  }
}
</script>

<style scoped>
.preferences-page {
  padding: var(--spacing-xl) 0 var(--spacing-3xl);
}

.user-layout {
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: var(--spacing-xl);
}

.user-sidebar { position: sticky; top: 80px; align-self: start; }
.user-card { text-align: center; padding: var(--spacing-xl); background: var(--color-bg-card); border-radius: var(--radius-lg); margin-bottom: var(--spacing-md); box-shadow: var(--shadow-sm); }
.user-card h3 { margin-top: var(--spacing-md); font-size: var(--font-size-lg); }
.user-content :deep(.el-card) { border-radius: var(--radius-md); }
.user-content h2 { font-size: var(--font-size-xl); }

@media (max-width: 768px) {
  .user-layout { grid-template-columns: 1fr; }
}
</style>
