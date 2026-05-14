<template>
  <div class="favorite-page">
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
              <h2>我的收藏</h2>
            </template>

            <div class="favorite-grid" v-loading="loading">
              <ScenicCard
                v-for="item in favoriteList"
                :key="item.id"
                :scenic="item"
                @click="$router.push(`/map?id=${item.id}`)"
              />
            </div>

            <el-empty v-if="!loading && favoriteList.length === 0" description="暂无收藏，去发现精彩景点吧">
              <el-button type="primary" @click="$router.push('/scenic')">浏览景点</el-button>
            </el-empty>

            <el-pagination
              v-if="total > 0"
              v-model:current-page="currentPage"
              :page-size="pageSize"
              :total="total"
              layout="total, prev, pager, next"
              @current-change="handlePageChange"
            />
          </el-card>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import ScenicCard from '@/components/scenic/ScenicCard.vue'

const userStore = useUserStore()

const favoriteList = ref([])
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(12)
const total = ref(0)

function handlePageChange(page) {
  currentPage.value = page
  fetchFavorites()
}

async function fetchFavorites() {
  loading.value = true
  // TODO: 调用收藏列表 API
  loading.value = false
}

onMounted(() => {
  fetchFavorites()
})
</script>

<style scoped>
.favorite-page {
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

.favorite-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: var(--spacing-lg);
  min-height: 200px;
}

@media (max-width: 768px) {
  .user-layout { grid-template-columns: 1fr; }
}
</style>
