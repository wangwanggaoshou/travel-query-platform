<template>
  <div class="globe-explore-page">
    <!-- 加载动画 -->
    <LoadingSpinner :visible="loading" text="正在初始化3D地球..." />

    <!-- AI 景点搜索进度 -->
    <ProgressOverlay
      :visible="countryLoading"
      title="AI 正在探索这个国家"
      :steps="discoverSteps"
      :externalProgress="progressPercent"
    />

    <!-- 地球视图 -->
    <GlobeViewer
      ref="globeViewerRef"
      v-show="!loading"
      :onLocationSelect="handleLocationSelect"
    />

    <!-- 景点卡片 -->
    <AttractionCard
      :visible="cardVisible"
      :loading="countryLoading"
      :countryData="selectedCountry"
      @close="closeCard"
      @select="handleAttractionSelect"
    />

    <GlobeAttractionDetail
      :visible="detailVisible"
      :attraction="selectedAttraction"
      :countryName="selectedCountry?.name"
      @close="closeDetail"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'
import GlobeViewer from '@/components/globe/GlobeViewer.vue'
import AttractionCard from '@/components/globe/AttractionCard.vue'
import GlobeAttractionDetail from '@/components/globe/GlobeAttractionDetail.vue'
import LoadingSpinner from '@/components/globe/LoadingSpinner.vue'
import ProgressOverlay from '@/components/common/ProgressOverlay.vue'

// 地球控制状态
const autoRotate = ref(false)
const globeViewerRef = ref(null)

// 状态
const loading = ref(true)
const cardVisible = ref(false)
const selectedCountry = ref(null)
const countryLoading = ref(false)
const detailVisible = ref(false)
const selectedAttraction = ref(null)

// AI 搜索进度百分比 & SSE 连接源
const progressPercent = ref(-1)
const sseSource = ref(null)

// AI 搜索进度步骤
const discoverSteps = ref([
  { label: '正在识别国家/地区...', duration: 1500 },
  { label: 'AI 联网搜索目的地...', duration: 3000 },
  { label: '正在分析生成推荐...', duration: 4000 },
  { label: '正在获取景点图片...', duration: 3000 },
])

// 关闭/断开 SSE
const cleanSSE = () => {
  if (sseSource.value) {
    sseSource.value.close()
    sseSource.value = null
  }
}

// 重置视角
const resetView = () => {
  // 通过 GlobeViewer 组件的 expose 调用
  globeViewerRef.value?.resetView()
}

// 切换自动旋转
const toggleRotation = (forceValue = null) => {
  if (forceValue !== null) {
    autoRotate.value = forceValue
  } else {
    autoRotate.value = !autoRotate.value
  }
  globeViewerRef.value?.toggleRotation()
  // 通知 header 更新旋转状态
  window.dispatchEvent(new CustomEvent('globe-rotation-changed', {
    detail: { active: autoRotate.value }
  }))
}

// 接收来自 Header 的控制事件
const handleGlobeToggleRotate = () => {
  toggleRotation()
}

const handleGlobeReset = () => {
  resetView()
}

// 初始化
onMounted(() => {
  setTimeout(() => {
    loading.value = false
  }, 2000)

  window.addEventListener('globe-toggle-rotate', handleGlobeToggleRotate)
  window.addEventListener('globe-reset', handleGlobeReset)

  // 初始同步状态给 Header
  window.dispatchEvent(new CustomEvent('globe-rotation-changed', {
    detail: { active: autoRotate.value }
  }))
})

onUnmounted(() => {
  window.removeEventListener('globe-toggle-rotate', handleGlobeToggleRotate)
  window.removeEventListener('globe-reset', handleGlobeReset)
  cleanSSE()
})

const handleLocationSelect = ({ longitude, latitude }) => {
  // 1. 重置进度和卡片状态
  progressPercent.value = 0
  countryLoading.value = true
  cardVisible.value = true
  selectedCountry.value = {
    name: '加载中…',
    nameEn: 'Loading',
    flag: '🌍',
    attractions: [],
  }

  // 恢复默认步骤标签
  discoverSteps.value = [
    { label: '正在识别国家/地区...', duration: 1500 },
    { label: 'AI 联网搜索目的地...', duration: 3000 },
    { label: '正在分析生成推荐...', duration: 4000 },
    { label: '正在获取景点图片...', duration: 3000 },
  ]

  cleanSSE()

  // 2. 建立 SSE 连接读取真实后端进度
  const url = `/api/globe/resolve/stream?lon=${longitude}&lat=${latitude}`
  const sse = new EventSource(url)
  sseSource.value = sse

  sse.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data)

      if (data.error) {
        sse.close()
        cleanSSE()
        countryLoading.value = false
        cardVisible.value = false
        selectedCountry.value = null
        globeViewerRef.value?.clearCountryMarker()
        globeViewerRef.value?.setLoading(false)
        ElMessage({
          message: data.error,
          type: 'warning',
          duration: 3000,
          offset: 100,
        })
        return
      }

      if (data.progress !== undefined) {
        progressPercent.value = data.progress
      }

      if (data.step !== undefined && data.message) {
        const stepIdx = data.step
        if (stepIdx >= 0 && stepIdx < discoverSteps.value.length) {
          discoverSteps.value[stepIdx].label = data.message
        }
      }

      if (data.done) {
        sse.close()
        cleanSSE()

        // 成功获取数据（SSE 流中 result 直接就是 country 对象，无需 .data）
        const countryData = data.result
        selectedCountry.value = countryData
        cardVisible.value = true

        // 更新三维球上的标签
        globeViewerRef.value?.setCountryLabel(countryData.name)
        globeViewerRef.value?.setLoading(false)

        const sourceLabel = countryData.source === 'ai' ? '（AI 实时发现）' : ''
        ElMessage({
          message: `已加载 ${countryData.name} ${sourceLabel} ${countryData.attractions?.length || 0} 个目的地`,
          type: 'success',
          duration: 3000,
          offset: 100,
        })

        // 延迟半秒关闭遮罩，确保用户能看到100%成功的状态
        setTimeout(() => {
          countryLoading.value = false
        }, 500)
      }
    } catch (e) {
      console.error('解析 SSE 数据错误:', e)
    }
  }

  sse.onerror = (err) => {
    console.error('SSE 连接错误:', err)
    sse.close()
    cleanSSE()

    countryLoading.value = false
    cardVisible.value = false
    selectedCountry.value = null
    globeViewerRef.value?.clearCountryMarker()
    globeViewerRef.value?.setLoading(false)

    ElMessage({
      message: '数据传输连接中断，请重新尝试',
      type: 'error',
      duration: 3000,
      offset: 100,
    })
  }
}

// 关闭卡片
const closeCard = () => {
  cardVisible.value = false
  countryLoading.value = false
  cleanSSE()
  globeViewerRef.value?.clearCountryMarker()
  globeViewerRef.value?.setLoading(false)
}

const closeDetail = () => {
  detailVisible.value = false
  selectedAttraction.value = null
}

const handleAttractionSelect = (attraction) => {
  if (!attraction) return
  selectedAttraction.value = attraction
  detailVisible.value = true
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


/* 响应式 */
@media (max-width: 768px) {
  .globe-explore-page {
    height: calc(100vh - 64px);
  }
}
</style>