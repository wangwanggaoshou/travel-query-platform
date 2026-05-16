<template>
  <teleport to="body">
    <transition name="detail-fade">
      <div v-if="visible" class="detail-root">
        <div class="detail-backdrop" @click="onClose" />
        <aside class="attraction-detail glass-dark" @click.stop>
          <button class="close-btn" type="button" @click="onClose" aria-label="关闭">
            <el-icon><Close /></el-icon>
          </button>

          <div class="detail-gallery" v-loading="loadingImages">
            <el-carousel
              v-if="displayImages.length"
              height="220px"
              indicator-position="outside"
              :interval="5000"
            >
              <el-carousel-item v-for="(img, idx) in displayImages" :key="`${img}-${idx}`">
                <img :src="img" :alt="attraction?.name" loading="lazy" @error="onScenicImageError" />
              </el-carousel-item>
            </el-carousel>
            <div v-else class="gallery-placeholder">
              <span>{{ attraction?.name }}</span>
            </div>
          </div>

          <div class="detail-body">
            <el-tag v-if="typeLabel" size="small" type="warning" effect="plain">{{ typeLabel }}</el-tag>
            <h2 class="detail-title">{{ attraction?.name }}</h2>
            <p v-if="attraction?.nameEn" class="detail-subtitle">{{ attraction.nameEn }}</p>
            <p class="detail-location">
              <el-icon><Location /></el-icon>
              {{ attraction?.location }}
            </p>
            <p class="detail-desc">{{ attraction?.description }}</p>

            <el-alert
              class="map-notice"
              type="info"
              :closable="false"
              show-icon
              title="为何没有地图导航？"
              description="高德地图 API 不支持国外地图展示，海外及全球标志性目的地仅提供图集浏览与 AI 攻略生成。"
            />

            <div class="detail-actions">
              <el-button
                type="primary"
                size="large"
                :disabled="!guideAgentReady"
                @click="goGenerateGuide"
              >
                <el-icon><MagicStick /></el-icon>
                生成 AI 攻略
              </el-button>
              <p v-if="!guideAgentReady" class="agent-hint">
                请在 back-end/.env 配置 GUIDE_AGENT_LLM_* 后使用 AI 攻略
              </p>
            </div>
          </div>
        </aside>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { fetchLandmarkImages } from '@/api/globe'
import { getGuideAgentStatus } from '@/api/guide'
import { resolveScenicCover, onScenicImageError, SCENIC_IMAGE_PLACEHOLDER } from '@/utils/scenicImage'

const props = defineProps({
  visible: { type: Boolean, default: false },
  attraction: { type: Object, default: null },
  countryName: { type: String, default: '' },
})

const emit = defineEmits(['close'])

const router = useRouter()
const guideAgentReady = ref(false)
const loadingImages = ref(false)
const extraImages = ref([])

const TYPE_LABELS = {
  landmark: '地标',
  nature: '自然奇观',
  event: '节庆/体验',
}

const typeLabel = computed(() => TYPE_LABELS[props.attraction?.type] || '')

const displayImages = computed(() => {
  const cover = resolveScenicCover(props.attraction)
  const base =
    props.attraction?.images?.length > 0
      ? props.attraction.images.filter((u) => u && u !== SCENIC_IMAGE_PLACEHOLDER)
      : cover && cover !== SCENIC_IMAGE_PLACEHOLDER
        ? [cover]
        : []
  const merged = [...base]
  for (const url of extraImages.value) {
    if (url && !merged.includes(url)) merged.push(url)
  }
  return merged.slice(0, 10)
})

async function loadExtraImages() {
  const name = props.attraction?.name
  if (!name) return
  loadingImages.value = true
  extraImages.value = []
  try {
    const res = await fetchLandmarkImages(name, {
      max: 6,
      nameEn: props.attraction?.nameEn,
      location: props.attraction?.location,
    })
    if (res.code === 200) {
      const list = res.data?.images?.length ? res.data.images : res.data?.image ? [res.data.image] : []
      extraImages.value = list
    }
  } catch (e) {
    console.warn('补充图片失败', e)
  } finally {
    loadingImages.value = false
  }
}

async function fetchAgentStatus() {
  try {
    const res = await getGuideAgentStatus()
    guideAgentReady.value = !!res.data?.configured
  } catch {
    guideAgentReady.value = false
  }
}

function onClose() {
  emit('close')
}

function goGenerateGuide() {
  if (!guideAgentReady.value) {
    ElMessage.warning('攻略 Agent 未就绪')
    return
  }
  const topic = props.attraction?.guideTopic || `${props.attraction?.name}旅游攻略`
  const category = props.attraction?.guideCategory || 'city'
  const country = props.countryName ? `${props.countryName} ` : ''
  router.push({
    path: '/guide',
    query: {
      auto: '1',
      topic: props.attraction?.guideTopic || topic,
      scenicName: props.attraction?.name,
      location: props.attraction?.location || '',
      category,
    },
  })
}

watch(
  () => [props.visible, props.attraction?.id],
  ([vis]) => {
    if (vis && props.attraction) {
      fetchAgentStatus()
      loadExtraImages()
    } else {
      extraImages.value = []
    }
  }
)
</script>

<style scoped>
.detail-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  z-index: 1100;
}

.attraction-detail {
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: min(520px, calc(100vw - 32px));
  max-height: 90vh;
  overflow-y: auto;
  border-radius: var(--radius-xl);
  z-index: 1101;
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-xl);
}

.close-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 5;
  width: 36px;
  height: 36px;
  border: none;
  border-radius: var(--radius-full);
  background: rgba(0, 0, 0, 0.4);
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.detail-gallery {
  background: var(--color-bg-deep);
}

.detail-gallery :deep(.el-carousel__container) {
  border-radius: var(--radius-xl) var(--radius-xl) 0 0;
}

.detail-gallery img {
  width: 100%;
  height: 220px;
  object-fit: cover;
}

.gallery-placeholder {
  height: 220px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-muted);
}

.detail-body {
  padding: 20px 24px 24px;
}

.detail-title {
  font-family: var(--font-display);
  font-size: var(--font-size-xl);
  margin: 8px 0 4px;
  color: var(--color-text-primary);
}

.detail-subtitle {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  margin: 0 0 8px;
}

.detail-location {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: var(--font-size-sm);
  color: var(--color-gold);
  margin: 0 0 12px;
}

.detail-desc {
  font-size: var(--font-size-sm);
  line-height: 1.7;
  color: var(--color-text-secondary);
  margin: 0 0 16px;
}

.map-notice {
  margin-bottom: 20px;
}

.detail-actions .el-button {
  width: 100%;
}

.agent-hint {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
  margin: 8px 0 0;
  text-align: center;
}

.detail-fade-enter-active,
.detail-fade-leave-active {
  transition: opacity 0.3s ease;
}

.detail-fade-enter-from,
.detail-fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .attraction-detail {
    top: auto;
    bottom: 0;
    left: 0;
    right: 0;
    transform: none;
    width: 100%;
    max-height: 85vh;
    border-radius: var(--radius-xl) var(--radius-xl) 0 0;
  }
}
</style>
