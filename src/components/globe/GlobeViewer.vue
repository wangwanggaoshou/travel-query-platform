<template>
  <div class="globe-container">
    <div ref="cesiumContainer" class="cesium-viewer"></div>

    <!-- 提示信息 -->
    <div class="hint glass-dark">
      <el-icon><Pointer /></el-icon>
      <span>点击地图任意位置查看景点</span>
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
    const cartesian = viewer.camera.pickEllipsoid(click.position)

    if (cartesian) {
      showClickAnimation(click.position)

      const cartographic = Cesium.Cartographic.fromCartesian(cartesian)
      const longitude = Cesium.Math.toDegrees(cartographic.longitude)
      const latitude = Cesium.Math.toDegrees(cartographic.latitude)

      const result = await reverseGeocode(longitude, latitude)

      if (result.success) {
        props.onLocationSelect({
          success: true,
          country: result.country,
          longitude,
          latitude
        })
        addMarker(cartesian)
      } else {
        props.onLocationSelect({
          success: false,
          message: result.message,
          longitude,
          latitude
        })
      }
    }
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK)

  clickHandler = handler
}

// 显示点击动画
const showClickAnimation = (position) => {
  const element = document.createElement('div')
  element.className = 'click-ripple'
  element.style.left = position.x + 'px'
  element.style.top = position.y + 'px'
  document.body.appendChild(element)

  setTimeout(() => {
    element.remove()
  }, 600)
}

// 添加标记点
const addMarker = (position) => {
  viewer.entities.removeAll()

  viewer.entities.add({
    position: position,
    point: {
      pixelSize: 12,
      color: Cesium.Color.fromCssColorString('#c8a951'),
      outlineColor: Cesium.Color.WHITE,
      outlineWidth: 2,
      scaleByDistance: new Cesium.NearFarScalar(1.5e2, 2.0, 1.5e7, 0.5)
    },
    label: {
      text: '选中位置',
      font: '14px sans-serif',
      fillColor: Cesium.Color.WHITE,
      outlineColor: Cesium.Color.BLACK,
      outlineWidth: 2,
      style: Cesium.LabelStyle.FILL_AND_OUTLINE,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      pixelOffset: new Cesium.Cartesian2(0, -10)
    }
  })
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
  if (viewer) {
    viewer.destroy()
  }
})

// 暴露方法给父组件调用
defineExpose({
  resetView,
  toggleRotation
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

/* 点击波纹效果 */
:global(.click-ripple) {
  position: fixed;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: rgba(200, 169, 81, 0.6);
  transform: translate(-50%, -50%) scale(1);
  pointer-events: none;
  animation: ripple 0.6s ease-out;
  z-index: 9999;
}

@keyframes ripple {
  to {
    transform: translate(-50%, -50%) scale(4);
    opacity: 0;
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