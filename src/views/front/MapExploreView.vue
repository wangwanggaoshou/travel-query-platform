<template>
  <div class="map-explore-page">
    <div class="sidebar-panel glass-dark" :class="{ 'is-collapsed': isSidebarCollapsed }">
      <div class="toggle-btn" @click="isSidebarCollapsed = !isSidebarCollapsed">
        <el-icon><component :is="isSidebarCollapsed ? 'ArrowRight' : 'ArrowLeft'" /></el-icon>
      </div>

      <div class="sidebar-content" v-if="currentScenic">
        <div class="scenic-header">
          <h2>{{ currentScenic.name }}</h2>
          <p class="address"><el-icon><Location /></el-icon> {{ currentScenic.address }}</p>
        </div>

        <div class="scenic-body">
            <div class="scenic-desc">
              <img :src="coverImage" class="desc-img" @error="onScenicImageError" />
              <p>{{ currentScenic.description || '暂无详细介绍' }}</p>

              <div class="poi-actions">
                <h4>周边探索</h4>
                <p class="poi-route-hint">
                  点击地图空白处可搜索附近景点；点击标记可查看详情或规划路径。
                </p>
                <p v-if="nearbySearchKeyword && canShowRouteForNearby()" class="poi-route-hint">
                  酒店/美食标记的弹窗中可选择「规划路径」，从当前景点规划驾车路线。
                </p>
                <div class="btn-group">
                  <el-button size="small" type="primary" @click="searchNearby('酒店')"><el-icon><House /></el-icon> 附近酒店</el-button>
                  <el-button size="small" type="success" @click="searchNearby('美食')"><el-icon><ForkSpoon /></el-icon> 附近美食</el-button>
                  <el-button size="small" type="warning" @click="searchNearby('公交站')"><el-icon><Van /></el-icon> 附近交通</el-button>
                  <el-button
                    size="small"
                    type="info"
                    :disabled="!currentScenic?.id || !guideAgentReady"
                    @click="goGenerateGuide"
                  >
                    <el-icon><Document /></el-icon> 生成攻略
                  </el-button>
                </div>
              </div>
            </div>
        </div>
      </div>

      <div class="empty-state" v-else>
        <el-empty description="点击地图空白处搜索附近景点，或查看热门景点">
          <el-button type="primary" @click="showDefaultSpots">查看热门景点</el-button>
        </el-empty>
      </div>
    </div>

    <div id="amap-container" ref="mapContainer"></div>

    <el-dialog
      v-model="nearbyScenicDialogVisible"
      title="附近景点"
      width="420px"
      align-center
      destroy-on-close
      class="nearby-scenic-dialog"
    >
      <div v-loading="nearbyScenicLoading" class="nearby-scenic-body">
        <p v-if="nearbyScenicClickHint" class="nearby-scenic-hint">{{ nearbyScenicClickHint }}</p>
        <el-empty v-if="!nearbyScenicLoading && !nearbyScenicList.length" description="附近未找到景点" />
        <ul v-else-if="nearbyScenicList.length" class="nearby-scenic-list">
          <li
            v-for="poi in nearbyScenicList"
            :key="poi.id || poi.name"
            class="nearby-scenic-item"
            :class="{ 'is-loading': importingScenicName === stripPoiName(poi.name) }"
            @click="importNearbyScenic(poi)"
          >
            <div class="item-main">
              <span class="item-name">{{ stripPoiName(poi.name) }}</span>
              <span v-if="poi.distance" class="item-distance">{{ formatDistance(poi.distance) }}</span>
            </div>
            <p class="item-address">{{ poi.address || formatPoiRegion(poi) }}</p>
          </li>
        </ul>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import AMapLoader from '@amap/amap-jsapi-loader'
import { AMAP_KEY, applyAmapSecurityConfig } from '@/config/amap.config'
import { getScenicDetail, getHotScenic, searchScenic } from '@/api/scenic'
import { getGuideAgentStatus } from '@/api/guide'
import { getCategoryLabel, SCENIC_CATEGORY_LABELS } from '@/utils/categoryLabels'
import { resolveScenicCover, onScenicImageError } from '@/utils/scenicImage'
import { buildPoiInfoContent, stripPoiIndexPrefix, toLngLat } from '@/utils/amapPoi'

const route = useRoute()
const router = useRouter()

const mapContainer = ref(null)
const isSidebarCollapsed = ref(false)
const currentScenic = ref(null)
const hotScenics = ref([])
const nearbySearchKeyword = ref('')
const routePlanning = ref(false)
const guideAgentReady = ref(false)
const nearbyScenicDialogVisible = ref(false)
const nearbyScenicLoading = ref(false)
const nearbyScenicList = ref([])
const nearbyScenicClickHint = ref('')
const importingScenicName = ref('')

let suppressMapClickUntil = 0

let map = null
let AMapLib = null
let placeSearch = null
let driving = null
let markers = []
let nearbyPoiMarkers = []
let activePoiInfoWindow = null
let activeRoutePoi = null
let infoWindowSeq = 0

const ROUTE_ENABLED_KEYWORDS = ['酒店', '美食']
const NEARBY_SCENIC_KEYWORD = '风景名胜|旅游景点|公园'
const NEARBY_SCENIC_RADIUS = 3000

const SCENIC_CATEGORY_TO_GUIDE = {
  nature: 'nature',
  history: 'history',
  beach: 'nature',
  city: 'city',
  theme_park: 'city',
  mountain: 'nature',
}

const LABEL_TO_GUIDE_CATEGORY = Object.fromEntries(
  Object.entries(SCENIC_CATEGORY_LABELS).map(([key, label]) => [
    label,
    SCENIC_CATEGORY_TO_GUIDE[key] || 'city',
  ])
)

const coverImage = computed(() => resolveScenicCover(currentScenic.value))

function markMarkerClick() {
  suppressMapClickUntil = Date.now() + 350
}

function stripPoiName(name) {
  return stripPoiIndexPrefix(name)
}

function formatDistance(meters) {
  const m = Number(meters)
  if (!Number.isFinite(m) || m <= 0) return ''
  if (m < 1000) return `${Math.round(m)}m`
  return `${(m / 1000).toFixed(1)}km`
}

function formatPoiRegion(poi) {
  return [poi.pname, poi.cityname, poi.adname].filter(Boolean).join('')
}

function toMapScenic(data) {
  const coords = data.coordinates
  return {
    id: data.id,
    name: data.name,
    address: data.location,
    location: data.location,
    description: data.description,
    images: data.images || (data.image ? [data.image] : []),
    image: data.image || data.images?.[0],
    category: getCategoryLabel(data.category),
    categoryRaw: data.category,
    coordinates: coords ? [coords.lng, coords.lat] : null,
  }
}

function goGenerateGuide() {
  const scenic = currentScenic.value
  if (!scenic?.id) {
    ElMessage.warning('请先选择景点')
    return
  }
  if (!guideAgentReady.value) {
    ElMessage.warning('攻略 Agent 未就绪，请配置后端大模型与联网搜索')
    return
  }
  const topic = `${scenic.name}旅游攻略`
  const category = scenic.categoryRaw
    ? SCENIC_CATEGORY_TO_GUIDE[scenic.categoryRaw] || ''
    : LABEL_TO_GUIDE_CATEGORY[scenic.category] || ''
  router.push({
    path: '/guide',
    query: {
      auto: '1',
      topic,
      scenicId: String(scenic.id),
      scenicName: scenic.name,
      category,
    },
  })
}

async function fetchGuideAgentStatus() {
  try {
    const res = await getGuideAgentStatus()
    guideAgentReady.value = !!res.data?.configured
  } catch {
    guideAgentReady.value = false
  }
}

function searchNearbyScenicAt(lnglat) {
  if (!map || !placeSearch) return
  const center = toLngLat(lnglat)
  if (!center) return

  nearbyScenicDialogVisible.value = true
  nearbyScenicLoading.value = true
  nearbyScenicList.value = []
  nearbyScenicClickHint.value = '正在搜索附近景点…'

  placeSearch.searchNearBy(NEARBY_SCENIC_KEYWORD, center, NEARBY_SCENIC_RADIUS, (status, result) => {
    nearbyScenicLoading.value = false
    if (status === 'complete' && result.info === 'OK') {
      const pois = result.poiList?.pois || []
      nearbyScenicList.value = pois
      nearbyScenicClickHint.value = pois.length
        ? `共找到 ${result.poiList?.count || pois.length} 处，点击可查看并入库`
        : ''
      if (!pois.length) {
        ElMessage.info('附近未找到景点')
      }
    } else {
      nearbyScenicClickHint.value = ''
      ElMessage.warning('附近景点搜索失败，请稍后重试')
    }
  })
}

function handleMapClick(e) {
  if (Date.now() < suppressMapClickUntil) return
  if (!e?.lnglat) return
  searchNearbyScenicAt(e.lnglat)
}

async function importNearbyScenic(poi) {
  const name = stripPoiName(poi.name)
  if (!name || importingScenicName.value) return

  importingScenicName.value = name
  const city = (poi.cityname || poi.adname || '').trim() || undefined

  const loadingMsg = ElMessage.info({
    message: `正在加载「${name}」…`,
    duration: 0,
  })

  try {
    const res = await searchScenic({
      keyword: name,
      discover: true,
      city,
      page: 1,
      pageSize: 10,
    })
    const list = res.data?.list || []
    const scenic =
      list.find((s) => s.name === name) ||
      list.find((s) => s.name?.includes(name) || name.includes(s.name)) ||
      list[0]

    if (!scenic?.id) {
      loadingMsg?.close?.()
      ElMessage.warning('未能入库该景点，请换一处重试')
      return
    }

    loadingMsg?.close?.()
    if (res.data?.discoveredNew) {
      ElMessage.success(`「${scenic.name}」已通过高德与公开资料聚合并入库`)
    } else {
      ElMessage.success(`已加载「${scenic.name}」`)
    }

    nearbyScenicDialogVisible.value = false
    router.push({ query: { id: scenic.id } })
    await loadScenicDetail(scenic.id)
  } catch (error) {
    loadingMsg?.close?.()
    console.error('景点入库失败:', error)
    ElMessage.error('景点加载失败，请稍后重试')
  } finally {
    importingScenicName.value = ''
  }
}

async function loadScenicDetail(id) {
  try {
    const res = await getScenicDetail(id)
    const scenic = toMapScenic(res.data)
    if (!scenic.coordinates) {
      ElMessage.warning('该景点暂无坐标信息')
      return
    }
    currentScenic.value = scenic
    isSidebarCollapsed.value = false
    renderScenicMarker(scenic)
  } catch (error) {
    console.error('加载景点详情失败:', error)
    ElMessage.error('加载景点详情失败')
  }
}

function renderScenicMarker(scenic) {
  if (!map || !AMapLib || !scenic.coordinates) return
  clearMarkers()

  const marker = new AMapLib.Marker({
    position: scenic.coordinates,
    title: scenic.name,
    icon: '//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-red.png',
  })

  marker.on('click', () => {
    markMarkerClick()
    openPoiInfoWindow({
      location: scenic.coordinates,
      name: scenic.name,
      address: scenic.address,
    })
  })

  map.add(marker)
  markers.push(marker)
  map.setZoomAndCenter(15, scenic.coordinates)
}

async function showDefaultSpots() {
  if (!map || !AMapLib) return
  clearMarkers()

  try {
    const res = await getHotScenic({ limit: 10 })
    const list = res.data?.list || []
    const detailList = await Promise.all(
      list.map(async (item) => {
        try {
          const detailRes = await getScenicDetail(item.id)
          return toMapScenic(detailRes.data)
        } catch {
          return null
        }
      })
    )
    hotScenics.value = detailList.filter((s) => s?.coordinates)

    hotScenics.value.forEach((scenic) => {
      const marker = new AMapLib.Marker({
        position: scenic.coordinates,
        title: scenic.name,
        label: {
          content: `<div class="marker-label">${scenic.name}</div>`,
          direction: 'bottom',
        },
      })

      marker.on('click', () => {
        markMarkerClick()
        router.push({ query: { id: scenic.id } })
        loadScenicDetail(scenic.id)
      })

      map.add(marker)
      markers.push(marker)
    })

    if (markers.length) {
      map.setFitView(markers)
    } else {
      ElMessage.info('暂无带坐标的景点数据')
    }
  } catch (error) {
    console.error('加载热门景点失败:', error)
    ElMessage.error('加载热门景点失败')
  }
}

function canShowRouteForNearby() {
  return ROUTE_ENABLED_KEYWORDS.some((k) => nearbySearchKeyword.value.includes(k))
}

function bindRouteButtonInInfoWindow(poi) {
  requestAnimationFrame(() => {
    const card = document.querySelector('.map-poi-info')
    const btn = card?.querySelector('.poi-route-btn')
    if (!card || !btn || !poi) return

    const stopBubble = (e) => e.stopPropagation()
    card.onmousedown = stopBubble
    card.onclick = stopBubble
    card.ontouchstart = stopBubble

    const onActivate = (e) => {
      e.preventDefault()
      e.stopPropagation()
      if (routePlanning.value) return
      planDrivingRoute(poi)
    }
    btn.onclick = onActivate
    btn.onmousedown = stopBubble
    btn.ontouchstart = stopBubble
  })
}

function triggerPlanRoute() {
  if (routePlanning.value) return
  const poi = activeRoutePoi
  if (!poi) {
    ElMessage.warning('请重新点击地图上的标记')
    return
  }
  planDrivingRoute(poi)
}

function closePoiInfoWindow() {
  if (activePoiInfoWindow) {
    activePoiInfoWindow.close()
    activePoiInfoWindow = null
  }
  activeRoutePoi = null
}

function openPoiInfoWindow(poi, { showRoute = false } = {}) {
  if (!map || !AMapLib) return
  const position = poi.location
  if (!position) return

  const seq = ++infoWindowSeq

  if (activePoiInfoWindow) {
    activePoiInfoWindow.close()
    activePoiInfoWindow = null
  }

  activeRoutePoi = showRoute ? poi : null

  activePoiInfoWindow = new AMapLib.InfoWindow({
    isCustom: true,
    closeWhenClickMap: true,
    content: buildPoiInfoContent({
      name: poi.name,
      address: poi.address || [poi.pname, poi.cityname, poi.adname].filter(Boolean).join(''),
      tel: poi.tel,
      showRouteButton: showRoute && !!currentScenic.value?.coordinates,
    }),
    offset: new AMapLib.Pixel(0, 50),
  })
  activePoiInfoWindow.on('close', () => {
    if (seq !== infoWindowSeq) return
    activeRoutePoi = null
  })
  activePoiInfoWindow.open(map, position)
  if (showRoute && activeRoutePoi) {
    bindRouteButtonInInfoWindow(activeRoutePoi)
  }
}

/** 销毁驾车规划实例（仅 clear 会导致第二次 search 失败） */
function destroyDriving() {
  if (!driving) return
  try {
    driving.clear()
  } catch {
    /* ignore */
  }
  try {
    driving.render?.clear?.()
  } catch {
    /* ignore */
  }
  try {
    driving.setMap?.(null)
  } catch {
    /* ignore */
  }
  driving = null
}

function createDriving() {
  if (!map || !AMapLib) return null
  destroyDriving()
  driving = new AMapLib.Driving({
    map,
    policy: AMapLib.DrivingPolicy.LEAST_TIME,
    hideMarkers: false,
    autoFitView: true,
    showTraffic: false,
  })
  return driving
}

function planDrivingRoute(poi) {
  const start = toLngLat(currentScenic.value?.coordinates)
  const end = toLngLat(poi?.location)
  if (!start || !end) {
    ElMessage.warning('缺少起点或终点坐标，无法规划路径')
    return
  }

  const drivingSvc = createDriving()
  if (!drivingSvc) return

  closePoiInfoWindow()
  routePlanning.value = true
  ElMessage.info(`正在规划至「${stripPoiIndexPrefix(poi.name)}」的驾车路线…`)

  drivingSvc.search(start, end, (status, result) => {
    routePlanning.value = false
    if (status === 'complete' && result?.routes?.length) {
      const route = result.routes[0]
      const km = (route.distance / 1000).toFixed(1)
      const minutes = Math.max(1, Math.round(route.time / 60))
      ElMessage.success(`路线已生成：约 ${km} 公里，预计 ${minutes} 分钟`)
    } else {
      console.warn('驾车路径规划失败', status, result)
      ElMessage.error('路径规划失败，请稍后重试')
      destroyDriving()
    }
  })
}

function clearNearbyPois(resetKeyword = true) {
  activeRoutePoi = null
  infoWindowSeq += 1
  destroyDriving()
  if (resetKeyword) {
    nearbySearchKeyword.value = ''
  }
  closePoiInfoWindow()
  if (map && nearbyPoiMarkers.length > 0) {
    map.remove(nearbyPoiMarkers)
    nearbyPoiMarkers = []
  }
  if (placeSearch) {
    placeSearch.clear()
  }
}

function renderNearbyPois(pois) {
  clearNearbyPois(false)
  if (!map || !AMapLib || !pois?.length) return

  pois.forEach((poi) => {
    const marker = new AMapLib.Marker({
      position: poi.location,
      title: stripPoiIndexPrefix(poi.name),
    })
    marker.on('click', () => {
      markMarkerClick()
      openPoiInfoWindow(poi, { showRoute: canShowRouteForNearby() })
    })
    map.add(marker)
    nearbyPoiMarkers.push(marker)
  })

  map.setFitView(nearbyPoiMarkers, false, [80, 80, 380, 80])
}

function searchNearby(keyword) {
  if (!map || !placeSearch || !currentScenic.value?.coordinates) return

  nearbySearchKeyword.value = keyword
  ElMessage.info(`正在查找周边的${keyword}...`)
  clearNearbyPois(false)

  placeSearch.searchNearBy(keyword, currentScenic.value.coordinates, 2000, (status, result) => {
    if (status === 'complete' && result.info === 'OK') {
      const pois = result.poiList?.pois || []
      renderNearbyPois(pois)
      ElMessage.success(`找到 ${result.poiList.count || pois.length} 个相关结果`)
    } else {
      ElMessage.warning(`未在附近找到合适的${keyword}`)
    }
  })
}

function clearMarkers() {
  clearNearbyPois()
  if (map && markers.length > 0) {
    map.remove(markers)
    markers = []
  }
}

async function initMap() {
  if (!AMAP_KEY) {
    ElMessage.error('未配置高德 Key，请在 front-end/.env 中设置 VITE_AMAP_KEY')
    return
  }

  if (!applyAmapSecurityConfig()) {
    ElMessage.warning({
      message:
        '未配置高德安全密钥，地图底图会显示为白屏。请在 front-end/.env 填写 VITE_AMAP_SECURITY_CODE（与 Key 同应用下的「安全密钥」）',
      duration: 10000,
      showClose: true,
    })
  }

  try {
    AMapLib = await AMapLoader.load({
      key: AMAP_KEY,
      version: '2.0',
      plugins: ['AMap.Scale', 'AMap.ToolBar', 'AMap.PlaceSearch', 'AMap.InfoWindow', 'AMap.Driving'],
    })

    map = new AMapLib.Map(mapContainer.value, {
      viewMode: '2D',
      zoom: 11,
      center: [116.397428, 39.90923],
    })

    await nextTick()
    map.resize()

    map.addControl(new AMapLib.Scale())
    map.addControl(new AMapLib.ToolBar())

    placeSearch = new AMapLib.PlaceSearch({
      pageSize: 30,
      extensions: 'all',
    })

    map.on('click', handleMapClick)

    const scenicId = route.query.id
    if (scenicId) {
      await loadScenicDetail(parseInt(scenicId, 10))
    } else {
      await showDefaultSpots()
    }
  } catch (e) {
    console.error('高德地图加载失败', e)
    ElMessage.error('地图加载失败，请检查网络或 API Key 设置')
  }
}

onMounted(async () => {
  window.__travelPlanRoute = (e) => {
    e?.preventDefault?.()
    e?.stopPropagation?.()
    triggerPlanRoute()
    return false
  }
  await fetchGuideAgentStatus()
  await nextTick()
  initMap()
})

watch(
  () => route.query.id,
  (newId) => {
    if (newId) {
      loadScenicDetail(parseInt(newId, 10))
    }
  }
)

onUnmounted(() => {
  delete window.__travelPlanRoute
  clearNearbyPois()
  destroyDriving()
  if (map) {
    map.destroy()
  }
})
</script>

<style scoped>
.map-explore-page {
  position: relative;
  width: 100%;
  height: calc(100vh - 64px);
  overflow: hidden;
}

#amap-container {
  width: 100%;
  height: 100%;
}

.sidebar-panel {
  position: absolute;
  top: 20px;
  left: 20px;
  width: 360px;
  bottom: 20px;
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
  background: var(--color-bg-card);
  color: var(--color-text-primary);
  border-radius: 0 8px 8px 0;
  box-shadow: 4px 0 6px rgba(0, 0, 0, 0.3);
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

.address {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  display: flex;
  align-items: center;
  gap: 4px;
}

.scenic-body {
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

.poi-route-hint {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
  line-height: 1.5;
  margin-bottom: var(--spacing-sm);
}

.btn-group {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
}

.btn-group :deep(.el-button) {
  margin-left: 0;
}

.empty-state {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

:deep(.marker-label) {
  background: var(--color-bg-card);
  color: var(--color-text-primary);
  padding: 4px 8px;
  border-radius: 4px;
  box-shadow: var(--shadow-sm);
  font-weight: 600;
  font-size: 12px;
  white-space: nowrap;
  border: 1px solid var(--color-border-light);
}

.nearby-scenic-body {
  min-height: 120px;
}

.nearby-scenic-hint {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  margin-bottom: var(--spacing-md);
}

.nearby-scenic-list {
  list-style: none;
  margin: 0;
  padding: 0;
  max-height: 360px;
  overflow-y: auto;
}

.nearby-scenic-item {
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border-light);
  margin-bottom: var(--spacing-sm);
  cursor: pointer;
  transition: background 0.2s, border-color 0.2s;
}

.nearby-scenic-item:hover {
  background: var(--color-bg-elevated);
  border-color: var(--color-primary-light);
}

.nearby-scenic-item.is-loading {
  opacity: 0.6;
  pointer-events: none;
}

.nearby-scenic-item .item-main {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-sm);
  margin-bottom: 4px;
}

.nearby-scenic-item .item-name {
  font-weight: 600;
  color: var(--color-text-primary);
}

.nearby-scenic-item .item-distance {
  font-size: var(--font-size-xs);
  color: var(--color-primary-light);
  flex-shrink: 0;
}

.nearby-scenic-item .item-address {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  line-height: 1.4;
  margin: 0;
}
</style>
