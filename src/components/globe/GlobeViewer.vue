<template>
  <div class="globe-container">
    <div ref="cesiumContainer" class="cesium-viewer"></div>

    <!-- 提示信息 -->
    <div class="hint glass-dark">
      <el-icon><Pointer /></el-icon>
      <span>点击地图探索各国标志性目的地（每国最多 5 个）</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as Cesium from 'cesium'
import { CESIUM_CONFIG, TIANDITU_CONFIG } from '@/config/cesium.config.js'
import { reverseGeocode } from '@/utils/geocoder.js'

const props = defineProps({
  onLocationSelect: {
    type: Function,
    required: true
  }
})

const cesiumContainer = ref(null)
let viewer = null
const autoRotate = ref(false)
let rotationInterval = null
let clickHandler = null
let countryMarkerEntity = null

/** 国家点击防抖：加载中忽略；两次有效点击间隔 */
const COUNTRY_CLICK_DEBOUNCE_MS = 800
let countryLoadInProgress = false
let lastCountryClickAt = 0

// 初始化 Cesium 地球
const initCesium = async () => {
  if (!cesiumContainer.value) return

  if (CESIUM_CONFIG.ionToken) {
    Cesium.Ion.defaultAccessToken = CESIUM_CONFIG.ionToken
  }

  viewer = new Cesium.Viewer(cesiumContainer.value, {
    imageryProvider: false,
    requestRenderMode: true,
    maximumRenderTimeChange: Infinity,

    terrainProvider: await Cesium.createWorldTerrainAsync({
      requestWaterMask: true,
      requestVertexNormals: true
    }),

    baseLayerPicker: false,
    geocoder: false,
    homeButton: false,
    sceneModePicker: false,
    navigationHelpButton: false,
    animation: false,
    timeline: false,
    fullscreenButton: false,
    vrButton: false,
    creditContainer: document.createElement('div')
  })

  addTianDiTuImagery()
  setDefaultView()
  addClickHandler()
  enhanceVisualEffects()
}

// 添加天地图影像
const addTianDiTuImagery = () => {
  const { token, imageryUrl, annotationUrl, subdomains, maximumLevel } = TIANDITU_CONFIG

  const formatUrl = (url) => {
    return url.replace('{token}', token)
  }

  const imageryProvider = new Cesium.UrlTemplateImageryProvider({
    url: formatUrl(imageryUrl),
    subdomains: subdomains,
    tilingScheme: new Cesium.WebMercatorTilingScheme(),
    maximumLevel: maximumLevel,
    tileWidth: 256,
    tileHeight: 256
  })

  viewer.imageryLayers.addImageryProvider(imageryProvider)

  const annotationProvider = new Cesium.UrlTemplateImageryProvider({
    url: formatUrl(annotationUrl),
    subdomains: subdomains,
    tilingScheme: new Cesium.WebMercatorTilingScheme(),
    maximumLevel: maximumLevel,
    tileWidth: 256,
    tileHeight: 256
  })

  viewer.imageryLayers.addImageryProvider(annotationProvider)
}

// 设置默认视角
const setDefaultView = () => {
  const { longitude, latitude, height } = CESIUM_CONFIG.defaultView

  viewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(longitude, latitude, height),
    orientation: {
      heading: Cesium.Math.toRadians(0.0),
      pitch: Cesium.Math.toRadians(-90.0),
      roll: 0.0
    },
    duration: 2
  })
}

// 添加点击处理
const addClickHandler = () => {
  const handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas)

  handler.setInputAction(async (click) => {
    if (countryLoadInProgress) return

    const now = Date.now()
    if (now - lastCountryClickAt < COUNTRY_CLICK_DEBOUNCE_MS) return
    lastCountryClickAt = now

    const cartesian = viewer.camera.pickEllipsoid(click.position)
    if (!cartesian) return

    const cartographic = Cesium.Cartographic.fromCartesian(cartesian)
    const longitude = Cesium.Math.toDegrees(cartographic.longitude)
    const latitude = Cesium.Math.toDegrees(cartographic.latitude)

    countryLoadInProgress = true
    setCountryMarker(cartesian, { loading: true })
    props.onLocationSelect({
      loading: true,
      longitude,
      latitude,
    })

    try {
      const result = await reverseGeocode(longitude, latitude)

      if (result.success) {
        setCountryMarker(cartesian, {
          loading: false,
          label: result.country?.name || '已选国家',
        })
        props.onLocationSelect({
          success: true,
          country: result.country,
          longitude,
          latitude,
        })
      } else {
        clearCountryMarker()
        props.onLocationSelect({
          success: false,
          message: result.message,
          longitude,
          latitude,
        })
      }
    } catch {
      clearCountryMarker()
      props.onLocationSelect({
        success: false,
        message: '加载失败，请稍后重试',
        longitude,
        latitude,
      })
    } finally {
      countryLoadInProgress = false
    }
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK)

  clickHandler = handler
}

/** 点击位置上方：加载中或国家名称（无黄色光点/波纹） */
const setCountryMarker = (position, { loading, label = '' }) => {
  if (!viewer) return

  if (countryMarkerEntity) {
    viewer.entities.remove(countryMarkerEntity)
    countryMarkerEntity = null
  }

  const text = loading ? '加载中…' : label
  if (!text) return

  countryMarkerEntity = viewer.entities.add({
    position,
    label: {
      text,
      font: loading ? 'bold 14px sans-serif' : '14px sans-serif',
      fillColor: loading
        ? Cesium.Color.fromCssColorString('#e2e8f0')
        : Cesium.Color.WHITE,
      outlineColor: Cesium.Color.BLACK,
      outlineWidth: 2,
      style: Cesium.LabelStyle.FILL_AND_OUTLINE,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      pixelOffset: new Cesium.Cartesian2(0, -8),
      showBackground: true,
      backgroundColor: loading
        ? Cesium.Color.fromCssColorString('rgba(15, 23, 42, 0.88)')
        : Cesium.Color.fromCssColorString('rgba(17, 24, 39, 0.75)'),
      backgroundPadding: new Cesium.Cartesian2(10, 6),
      disableDepthTestDistance: Number.POSITIVE_INFINITY,
    },
  })
  viewer.scene.requestRender()
}

const clearCountryMarker = () => {
  if (viewer && countryMarkerEntity) {
    viewer.entities.remove(countryMarkerEntity)
    countryMarkerEntity = null
    viewer.scene.requestRender()
  }
}

// 优化视觉效果与性能
const enhanceVisualEffects = () => {
  viewer.resolutionScale = 0.85
  viewer.scene.globe.enableLighting = false
  viewer.scene.skyAtmosphere.show = true
  viewer.scene.fog.enabled = true
  viewer.scene.fog.density = 0.0002
  viewer.scene.fog.minimumBrightness = 0.1
  viewer.shadows = false
  viewer.scene.highDynamicRange = false
  viewer.scene.postProcessStages.fxaa.enabled = true
}

// 重置视角
const resetView = () => {
  setDefaultView()
}

// 自动旋转处理
const rotateTick = () => {
  if (viewer && autoRotate.value) {
    viewer.camera.rotate(Cesium.Cartesian3.UNIT_Z, 0.002)
  }
}

// 切换自动旋转
const toggleRotation = () => {
  autoRotate.value = !autoRotate.value

  if (autoRotate.value) {
    viewer.clock.onTick.addEventListener(rotateTick)
  } else {
    viewer.clock.onTick.removeEventListener(rotateTick)
  }
}

onMounted(() => {
  setTimeout(() => {
    initCesium()
  }, 100)
})

onUnmounted(() => {
  if (viewer && autoRotate.value) {
    viewer.clock.onTick.removeEventListener(rotateTick)
  }
  if (clickHandler) {
    clickHandler.destroy()
  }
  countryMarkerEntity = null
  countryLoadInProgress = false
  if (viewer) {
    viewer.destroy()
  }
})

// 暴露方法给父组件调用
defineExpose({
  resetView,
  toggleRotation,
  clearCountryMarker,
})
</script>

<style scoped>
.globe-container {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}

.cesium-viewer {
  width: 100%;
  height: 100%;
}

.hint {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  padding: 12px 24px;
  border-radius: var(--radius-full);
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  z-index: 100;
  display: flex;
  align-items: center;
  gap: 8px;
  animation: fadeInUp 0.8s ease;
}

.hint .el-icon {
  color: var(--color-gold);
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

/* 响应式 */
@media (max-width: 768px) {
  .hint {
    bottom: 20px;
    font-size: var(--font-size-xs);
    padding: 10px 16px;
  }
}
</style>