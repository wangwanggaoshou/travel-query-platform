<template>
  <div class="globe-explore-page">
    <!-- 加载动画 -->
    <LoadingSpinner :visible="loading" text="正在初始化3D地球..." />

    <!-- 地球视图 -->
    <GlobeViewer
      ref="globeViewerRef"
      v-show="!loading"
      :onLocationSelect="handleLocationSelect"
    />

    <!-- 景点卡片 -->
    <AttractionCard
      :visible="cardVisible"
      :countryData="selectedCountry"
      @close="closeCard"
      @select="handleAttractionSelect"
    />

    <!-- 页眉信息覆盖层 -->
    <header class="page-header glass-dark" v-show="!loading">
      <div class="logo-section">
        <span class="logo-icon">🌍</span>
        <div class="title-group">
          <h1 class="page-title">环球旅游探索</h1>
          <span class="page-subtitle">GLOBE EXPLORER</span>
        </div>
      </div>
      <div class="header-controls">
        <button class="control-btn" @click="resetView" title="重置视角">
          <el-icon><HomeFilled /></el-icon>
        </button>
        <button class="control-btn" @click="toggleRotation" :class="{ active: autoRotate }" title="自动旋转">
          <el-icon><Refresh /></el-icon>
        </button>
      </div>
    </header>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import GlobeViewer from '@/components/globe/GlobeViewer.vue'
import AttractionCard from '@/components/globe/AttractionCard.vue'
import LoadingSpinner from '@/components/globe/LoadingSpinner.vue'

// 地球控制状态
const autoRotate = ref(false)
const globeViewerRef = ref(null)

// 状态
const loading = ref(true)
const cardVisible = ref(false)
const selectedCountry = ref(null)

// 初始化
onMounted(() => {
  setTimeout(() => {
    loading.value = false
  }, 2000)
})

// 重置视角
const resetView = () => {
  // 通过 GlobeViewer 组件的 expose 调用
  globeViewerRef.value?.resetView()
}

// 切换自动旋转
const toggleRotation = () => {
  autoRotate.value = !autoRotate.value
  globeViewerRef.value?.toggleRotation()
}

// 处理位置选择
const handleLocationSelect = (data) => {
  if (data.success) {
    selectedCountry.value = data.country
    cardVisible.value = true

    ElMessage({
      message: `发现 ${data.country.name}！`,
      type: 'success',
      duration: 3000,
      offset: 100
    })
  } else {
    cardVisible.value = false
    selectedCountry.value = null

    ElMessage({
      message: data.message || '该位置暂无景点数据',
      type: 'warning',
      duration: 3000,
      offset: 100
    })
  }
}

// 关闭卡片
const closeCard = () => {
  cardVisible.value = false
}

// 处理景点选择
const handleAttractionSelect = (attraction) => {
  ElMessage({
    message: `已选择: ${attraction.name}`,
    type: 'info',
    duration: 2000,
    offset: 100
  })
}
</script>

<style scoped>
.globe-explore-page {
  width: 100%;
  height: calc(100vh - 64px);
  overflow: hidden;
  position: relative;
  background: var(--color-bg-deep);
}

.page-header {
  position: absolute;
  top: 16px;
  left: 20px;
  right: 20px;
  padding: 12px 24px;
  border-radius: var(--radius-lg);
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 100;
  border: 1px solid var(--color-border-light);
}



.logo-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-icon {
  font-size: 28px;
}

.title-group {
  display: flex;
  flex-direction: column;
}

.page-title {
  font-family: var(--font-display);
  font-size: var(--font-size-lg);
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0;
  letter-spacing: 0.02em;
}

.page-subtitle {
  font-size: 10px;
  color: var(--color-gold);
  letter-spacing: 0.2em;
  text-transform: uppercase;
  opacity: 0.8;
}

/* 控制按钮 —— 与标题同行 */
.header-controls {
  display: flex;
  gap: 10px;
}

.control-btn {
  width: 38px;
  height: 38px;
  border: none;
  border-radius: var(--radius-md);
  background: rgba(17, 24, 39, 0.85);
  backdrop-filter: blur(12px);
  color: var(--color-text-secondary);
  font-size: 16px;
  cursor: pointer;
  transition: all var(--transition-normal);
  box-shadow: var(--shadow-md);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--color-border-light);
}

.control-btn:hover {
  transform: translateY(-2px);
  color: var(--color-gold);
  background: var(--color-bg-card-hover);
  border-color: var(--color-gold-border);
  box-shadow: var(--shadow-gold);
}

.control-btn.active {
  background: linear-gradient(135deg, var(--color-teal-dark) 0%, var(--color-teal) 100%);
  color: white;
  border-color: var(--color-teal);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(13, 148, 136, 0.4); }
  50% { box-shadow: 0 0 0 10px rgba(13, 148, 136, 0); }
}


/* 响应式 */
@media (max-width: 768px) {
  .page-header {
    top: 16px;
    left: 16px;
    right: 16px;
    padding: 10px 16px;
  }

  .page-title {
    font-size: var(--font-size-base);
  }

  .control-btn {
    width: 34px;
    height: 34px;
    font-size: 14px;
  }
}
</style>