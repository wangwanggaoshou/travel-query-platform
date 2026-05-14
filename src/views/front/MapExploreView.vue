<template>
  <div class="map-explore-page">
    <!-- 左侧信息面板 -->
    <div class="sidebar-panel glass" :class="{ 'is-collapsed': isSidebarCollapsed }">
      <div class="toggle-btn" @click="isSidebarCollapsed = !isSidebarCollapsed">
        <el-icon><component :is="isSidebarCollapsed ? 'ArrowRight' : 'ArrowLeft'" /></el-icon>
      </div>

      <div class="sidebar-content" v-if="currentScenic">
        <div class="scenic-header">
          <h2>{{ currentScenic.name }}</h2>
          <div class="scenic-meta">
            <el-rate v-model="currentScenic.rating" disabled show-score size="small" />
            <span class="price" v-if="currentScenic.price">¥{{ currentScenic.price }}</span>
            <span class="price free" v-else>免费</span>
          </div>
          <p class="address"><el-icon><Location /></el-icon> {{ currentScenic.address }}</p>
        </div>

        <el-tabs v-model="activeTab" class="sidebar-tabs">
          <!-- 景点介绍 -->
          <el-tab-pane label="景点介绍" name="info">
            <div class="scenic-desc">
              <img v-if="currentScenic.images && currentScenic.images.length" :src="currentScenic.images[0]" class="desc-img" />
              <p>{{ currentScenic.description || '暂无详细介绍' }}</p>
              
              <div class="poi-actions">
                <h4>周边探索</h4>
                <div class="btn-group">
                  <el-button size="small" type="primary" @click="searchNearby('酒店')"><el-icon><House /></el-icon> 附近酒店</el-button>
                  <el-button size="small" type="success" @click="searchNearby('美食')"><el-icon><ForkSpoon /></el-icon> 附近美食</el-button>
                  <el-button size="small" type="warning" @click="searchNearby('公交站')"><el-icon><Van /></el-icon> 附近交通</el-button>
                </div>
              </div>
            </div>
          </el-tab-pane>

          <!-- 真实评论 -->
          <el-tab-pane label="真实评论" name="reviews">
            <div class="reviews-wrapper">
              <ReviewList :reviews="reviews" :total="reviews.length" />
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>

      <!-- 未选中景点时的提示 -->
      <div class="empty-state" v-else>
        <el-empty description="在地图上点击景点或搜索查看详情">
          <el-button type="primary" @click="showDefaultSpots">查看热门景点</el-button>
        </el-empty>
      </div>
    </div>

    <!-- 地图容器 -->
    <div id="amap-container" ref="mapContainer"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import AMapLoader from '@amap/amap-jsapi-loader'
import ReviewList from '@/components/review/ReviewList.vue'

const route = useRoute()
const router = useRouter()

const mapContainer = ref(null)
const isSidebarCollapsed = ref(false)
const activeTab = ref('info')
const currentScenic = ref(null)
const reviews = ref([])

let map = null
let placeSearch = null
let markers = [] // 保存地图上的所有标记点

// 模拟数据：热门景点
const mockScenics = [
  { id: 1, name: '北京故宫', coordinates: [116.397428, 39.90923], rating: 4.9, price: 60, address: '北京市东城区景山前街4号', description: '中国明清两代的皇家宫殿，旧称紫禁城，位于北京中轴线的中心。' },
  { id: 2, name: '颐和园', coordinates: [116.273, 39.993], rating: 4.8, price: 30, address: '北京市海淀区新建宫门路19号', description: '中国清朝时期皇家园林，前身为清漪园。' },
  { id: 3, name: '八达岭长城', coordinates: [116.011, 40.359], rating: 4.7, price: 40, address: '北京市延庆区G6京藏高速58号出口', description: '万里长城的重要组成部分，是明长城的一个隘口。' },
]

// 模拟爬虫评论数据
const mockReviews = [
  { id: 1, author: '旅行达人', content: '非常震撼，值得一去！建议提前一天在网上买好票，不然现场排队很久。', rating: 5, date: '2023-10-01', source: '携程', sourceUrl: '#' },
  { id: 2, author: '背包客小王', content: '风景很好，但是节假日人太多了，体验稍打折扣。', rating: 4, date: '2023-09-15', source: '马蜂窝', sourceUrl: '#' },
  { id: 3, author: '周末游记', content: '周边交通很方便，出了地铁走几步就到了。里面的文创雪糕不错！', rating: 5, date: '2023-08-20', source: '大众点评', sourceUrl: '#' },
]

onMounted(async () => {
  initMap()
})

async function initMap() {
  try {
    // 您的安全密钥 (如果API加载失败报鉴权错误，请去高德控制台获取安全密钥并填入此处)
    window._AMapSecurityConfig = {
      securityJsCode: '', // TODO: 如有需要，填写安全密钥
    }

    const AMap = await AMapLoader.load({
      key: '65a5302c2cbd34e599933b9ea6eafa60', // 您提供的高德 Key
      version: '2.0',
      plugins: ['AMap.Scale', 'AMap.ToolBar', 'AMap.PlaceSearch', 'AMap.InfoWindow'],
    })

    map = new AMap.Map(mapContainer.value, {
      viewMode: '2D',
      zoom: 11,
      center: [116.397428, 39.90923], // 默认北京
    })

    map.addControl(new AMap.Scale())
    map.addControl(new AMap.ToolBar())

    // 初始化周边搜索插件
    placeSearch = new AMap.PlaceSearch({
      map: map,
      panel: null, // 不使用默认面板，我们自己在地图上展示点
      autoFitView: true,
    })

    // 如果URL中带有 id，则加载指定景点
    const scenicId = route.query.id
    if (scenicId) {
      loadScenicDetail(parseInt(scenicId))
    } else {
      showDefaultSpots()
    }
  } catch (e) {
    console.error('高德地图加载失败', e)
    ElMessage.error('地图加载失败，请检查网络或 API Key 设置')
  }
}

// 加载指定景点详情
function loadScenicDetail(id) {
  // 模拟 API 请求获取数据
  const scenic = mockScenics.find(s => s.id === id) || mockScenics[0]
  currentScenic.value = scenic
  reviews.value = mockReviews
  activeTab.value = 'info'
  isSidebarCollapsed.value = false

  if (map) {
    clearMarkers()
    
    // 添加当前景点主标记
    const marker = new AMap.Marker({
      position: scenic.coordinates,
      title: scenic.name,
      icon: '//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-red.png',
    })
    
    // 点击标记打开信息窗体
    marker.on('click', () => {
      const infoWindow = new AMap.InfoWindow({
        content: `<div style="padding:10px;"><h4>${scenic.name}</h4><p>${scenic.address}</p></div>`,
        offset: new AMap.Pixel(0, -30)
      })
      infoWindow.open(map, marker.getPosition())
    })

    map.add(marker)
    markers.push(marker)
    
    // 视野平滑移动到景点
    map.setZoomAndCenter(15, scenic.coordinates)
  }
}

// 在地图上展示默认的热门景点
function showDefaultSpots() {
  if (!map) return
  clearMarkers()
  
  mockScenics.forEach(scenic => {
    const marker = new AMap.Marker({
      position: scenic.coordinates,
      title: scenic.name,
      label: {
        content: `<div class="marker-label">${scenic.name}</div>`,
        direction: 'bottom'
      }
    })
    
    marker.on('click', () => {
      // 点击地图上的景点，更新 URL 和侧边栏
      router.push({ query: { id: scenic.id } })
      loadScenicDetail(scenic.id)
    })
    
    map.add(marker)
    markers.push(marker)
  })
  
  map.setFitView(markers)
}

// 搜索周边 POI（如酒店、美食）
function searchNearby(keyword) {
  if (!map || !placeSearch || !currentScenic.value) return
  
  ElMessage.info(`正在查找周边的${keyword}...`)
  
  // 清除之前的周边搜索结果
  placeSearch.clear()
  
  // 以当前景点坐标为中心，搜索半径 2000 米内的设施
  placeSearch.searchNearBy(keyword, currentScenic.value.coordinates, 2000, (status, result) => {
    if (status === 'complete' && result.info === 'OK') {
      ElMessage.success(`找到 ${result.poiList.count} 个相关结果`)
    } else {
      ElMessage.warning(`未在附近找到合适的${keyword}`)
    }
  })
}

// 清除自己添加的标记点（不影响 placeSearch 的结果）
function clearMarkers() {
  if (map && markers.length > 0) {
    map.remove(markers)
    markers = []
  }
  if (placeSearch) {
    placeSearch.clear()
  }
}

// 监听 URL id 参数变化
watch(() => route.query.id, (newId) => {
  if (newId) {
    loadScenicDetail(parseInt(newId))
  }
})

onUnmounted(() => {
  if (map) {
    map.destroy()
  }
})
</script>

<style scoped>
.map-explore-page {
  position: relative;
  width: 100%;
  height: calc(100vh - 64px); /* 减去 Header 的高度 */
  overflow: hidden;
}

#amap-container {
  width: 100%;
  height: 100%;
}

/* 左侧信息面板 */
.sidebar-panel {
  position: absolute;
  top: 20px;
  left: 20px;
  width: 360px;
  bottom: 20px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  z-index: 100;
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease;
  overflow: visible;
}

.sidebar-panel.is-collapsed {
  transform: translateX(calc(-100% - 20px));
}

.toggle-btn {
  position: absolute;
  right: -24px;
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
  height: 60px;
  background: #fff;
  border-radius: 0 8px 8px 0;
  box-shadow: 4px 0 6px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 101;
}

.toggle-btn:hover {
  background: var(--color-primary-light);
  color: #fff;
}

.sidebar-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.scenic-header {
  padding: var(--spacing-lg);
  border-bottom: 1px solid var(--color-border-light);
}

.scenic-header h2 {
  font-size: var(--font-size-2xl);
  font-weight: 700;
  margin-bottom: var(--spacing-sm);
  color: var(--color-text-primary);
}

.scenic-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-sm);
}

.price {
  font-size: var(--font-size-lg);
  font-weight: 700;
  color: var(--color-primary);
}

.price.free {
  color: var(--color-success);
}

.address {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  display: flex;
  align-items: center;
  gap: 4px;
}

.sidebar-tabs {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.sidebar-tabs :deep(.el-tabs__header) {
  margin-bottom: 0;
  padding: 0 var(--spacing-lg);
}

.sidebar-tabs :deep(.el-tabs__content) {
  flex: 1;
  overflow-y: auto;
  padding: var(--spacing-lg);
}

.scenic-desc p {
  color: var(--color-text-secondary);
  line-height: 1.6;
  margin-bottom: var(--spacing-lg);
}

.desc-img {
  width: 100%;
  height: 160px;
  object-fit: cover;
  border-radius: var(--radius-md);
  margin-bottom: var(--spacing-md);
}

.poi-actions h4 {
  font-size: var(--font-size-base);
  margin-bottom: var(--spacing-sm);
}

.btn-group {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
}

.empty-state {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.reviews-wrapper {
  padding-bottom: var(--spacing-xl);
}

/* 地图标记标签样式 */
:deep(.marker-label) {
  background: #fff;
  padding: 4px 8px;
  border-radius: 4px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.2);
  font-weight: 600;
  font-size: 12px;
  white-space: nowrap;
}
</style>
