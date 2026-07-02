<template>
  <teleport to="body">
    <transition name="drawer-fade">
      <div v-if="visible" class="drawer-root">
        <div class="drawer-backdrop" @click="onClose" />
        <aside class="drawer-panel glass-dark" @click.stop>
          <button class="close-btn" type="button" @click="onClose" aria-label="关闭">
            <el-icon><Close /></el-icon>
          </button>

          <div class="drawer-body" v-loading="loading">
            <!-- 图集 -->
            <div class="gallery-section" v-if="images.length">
              <ScenicGallery :images="images" />
            </div>
            <div class="gallery-placeholder" v-else>
              <img :src="coverUrl" :alt="scenic.name" @error="onScenicImageError" />
            </div>

            <!-- 基本信息 -->
            <div class="info-section">
              <div class="info-tags">
                <el-tag size="small" type="warning" effect="plain">{{ scenic.categoryLabel || scenic.category }}</el-tag>
                <el-tag v-if="scenic.region === 'domestic'" size="small" type="info" effect="plain">国内</el-tag>
              </div>
              <h2 class="scenic-name">{{ scenic.name }}</h2>
              <p class="scenic-location" v-if="scenic.location">
                <el-icon><Location /></el-icon>
                {{ scenic.location }}
              </p>
              <p class="scenic-price" v-if="scenic.price">
                <span class="price-currency">¥</span>{{ scenic.price }}<span class="price-suffix"> 起</span>
              </p>
            </div>

            <!-- 描述 -->
            <div class="desc-section" v-if="scenic.description">
              <h3>景点介绍</h3>
              <p>{{ scenic.description }}</p>
            </div>

            <!-- 实用信息 -->
            <div class="meta-grid" v-if="scenic.openingHours || scenic.bestSeason">
              <div class="meta-item" v-if="scenic.openingHours">
                <span class="meta-label">开放时间</span>
                <span class="meta-value">{{ scenic.openingHours }}</span>
              </div>
              <div class="meta-item" v-if="scenic.bestSeason">
                <span class="meta-label">最佳季节</span>
                <span class="meta-value">{{ scenic.bestSeason }}</span>
              </div>
            </div>

            <!-- 小贴士 -->
            <div class="tips-section" v-if="scenic.tips">
              <h3>出行贴士</h3>
              <p>{{ scenic.tips }}</p>
            </div>

            <!-- 操作 -->
            <div class="actions">
              <el-button type="primary" size="large" @click="goToMap">
                <el-icon><MapLocation /></el-icon>
                在地图上查看
              </el-button>
              <el-button size="large" @click="goToGuide">
                <el-icon><MagicStick /></el-icon>
                生成 AI 攻略
              </el-button>
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
import { getScenicDetail } from '@/api/scenic'
import ScenicGallery from '@/components/scenic/ScenicGallery.vue'
import { resolveScenicCover, onScenicImageError } from '@/utils/scenicImage'
import { formatScenicItem } from '@/utils/categoryLabels'

const props = defineProps({
  visible: { type: Boolean, default: false },
  scenicId: { type: Number, default: null },
  scenic: { type: Object, default: null },
})

const emit = defineEmits(['close'])
const router = useRouter()

const loading = ref(false)
const detail = ref(null)

const scenic = computed(() => {
  if (detail.value) return detail.value
  if (props.scenic) return formatScenicItem(props.scenic)
  return {}
})

const images = computed(() => {
  const list = scenic.value?.images || []
  const cover = scenic.value?.image
  const merged = cover ? [cover, ...list.filter((u) => u !== cover)] : list
  return [...new Set(merged)].filter(Boolean).slice(0, 10)
})

const coverUrl = computed(() => resolveScenicCover(scenic.value))

async function loadDetail() {
  if (!props.scenicId || props.scenic) {
    detail.value = null
    return
  }
  loading.value = true
  try {
    const res = await getScenicDetail(props.scenicId)
    if (res.code === 200) {
      detail.value = formatScenicItem(res.data)
    }
  } catch (e) {
    console.error('加载景点详情失败:', e)
  } finally {
    loading.value = false
  }
}

function onClose() {
  emit('close')
}

function goToMap() {
  const id = scenic.value?.id
  if (id) {
    emit('close')
    router.push(`/map?id=${id}`)
  }
}

function goToGuide() {
  const name = scenic.value?.name || ''
  const location = scenic.value?.location || ''
  const category = scenic.value?.category || 'city'
  emit('close')
  router.push({
    path: '/guide',
    query: {
      auto: '1',
      topic: `${name}旅游攻略`,
      scenicName: name,
      location,
      category,
    },
  })
}

watch(() => [props.visible, props.scenicId], ([vis]) => {
  if (vis && props.scenicId) loadDetail()
  if (!vis) detail.value = null
})
</script>

<style scoped>
.drawer-root {
  position: fixed;
  inset: 0;
  z-index: 1200;
}

.drawer-backdrop {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
}

.drawer-panel {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: min(520px, calc(100vw - 48px));
  overflow-y: auto;
  border-left: 1px solid var(--color-border);
  box-shadow: var(--shadow-xl);
}

.close-btn {
  position: sticky;
  top: 12px;
  float: right;
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
  margin-right: 12px;
}

.drawer-body {
  padding: 0 24px 32px;
}

.gallery-section {
  margin: -12px -24px 0;
}

.gallery-placeholder {
  height: 240px;
  margin: -12px -24px 0;
  overflow: hidden;
}

.gallery-placeholder img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.info-section {
  padding-top: 20px;
}

.info-tags {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.scenic-name {
  font-family: var(--font-display);
  font-size: var(--font-size-2xl);
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: 8px;
}

.scenic-location {
  display: flex;
  align-items: center;
  gap: 4px;
  color: var(--color-gold);
  font-size: var(--font-size-sm);
  margin-bottom: 8px;
}

.scenic-price {
  font-family: var(--font-display);
  font-size: var(--font-size-2xl);
  font-weight: 700;
  color: var(--color-gold);
  margin-bottom: 0;
}

.price-currency {
  font-size: var(--font-size-sm);
  vertical-align: super;
}

.price-suffix {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  font-weight: 400;
}

.desc-section,
.tips-section {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid var(--color-border-light);
}

.desc-section h3,
.tips-section h3 {
  font-size: var(--font-size-base);
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 8px;
}

.desc-section p,
.tips-section p {
  font-size: var(--font-size-sm);
  line-height: 1.8;
  color: var(--color-text-secondary);
}

.meta-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid var(--color-border-light);
}

.meta-item {
  background: rgba(200, 169, 81, 0.06);
  border-radius: var(--radius-md);
  padding: 12px 16px;
}

.meta-label {
  display: block;
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
  margin-bottom: 4px;
}

.meta-value {
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
  font-weight: 500;
}

.actions {
  display: flex;
  gap: 12px;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid var(--color-border-light);
}

.actions .el-button {
  flex: 1;
}

.drawer-fade-enter-active,
.drawer-fade-leave-active {
  transition: opacity 0.3s ease;
}

.drawer-fade-enter-active .drawer-panel,
.drawer-fade-leave-active .drawer-panel {
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.drawer-fade-enter-from,
.drawer-fade-leave-to {
  opacity: 0;
}

.drawer-fade-enter-from .drawer-panel {
  transform: translateX(100%);
}

.drawer-fade-leave-to .drawer-panel {
  transform: translateX(100%);
}

@media (max-width: 768px) {
  .drawer-panel {
    width: 100%;
    max-width: none;
  }
}
</style>
