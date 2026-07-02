<template>
  <div class="recommend-page">
    <div class="container">
      <div class="page-header">
        <h1 class="page-title gradient-text">智能推荐</h1>
        <p class="page-desc">
          结合出发地、预算与出行天数，AI 将为您精选合适的景点并说明推荐理由
        </p>
        <div class="agent-status">
          <el-tag v-if="agentReady" type="success" size="small" effect="plain">Agent 已就绪</el-tag>
          <el-tag v-else type="info" size="small" effect="plain">Agent 待配置</el-tag>
        </div>
      </div>

      <el-alert
        v-if="!agentReady"
        title="尚未配置推荐 Agent"
        description="请在 back-end/.env 中配置大模型（GUIDE_AGENT_LLM_*）与联网搜索（GUIDE_AGENT_WEB_SEARCH_API_KEY），配置后重启后端。"
        type="warning"
        show-icon
        :closable="false"
        class="agent-alert"
      />

      <el-card class="preference-card" shadow="never">
        <template #header>
          <span>填写您的旅行需求</span>
        </template>

        <div class="pref-section">
          <label>出发地 <span class="required">*</span></label>
          <el-select
            v-model="departureCity"
            filterable
            allow-create
            default-first-option
            placeholder="请选择或输入您的出发城市"
            :disabled="loading"
            class="departure-select"
          >
            <el-option
              v-for="city in departureCities"
              :key="city"
              :label="city"
              :value="city"
            />
          </el-select>
          <p class="pref-hint">将结合交通距离、预算与行程天数推荐合适目的地</p>
        </div>

        <div class="pref-section">
          <label>自定义需求（选填）</label>
          <el-input
            v-model="customPrompt"
            type="textarea"
            :rows="3"
            maxlength="500"
            show-word-limit
            placeholder="例如：想带老人去川西看雪山、周末上海周边亲子游、预算有限的学生党成都美食…"
            :disabled="loading"
          />
        </div>

        <div class="pref-section">
          <label>旅行类型</label>
          <div class="pref-options">
            <el-check-tag
              v-for="type in travelTypes"
              :key="type"
              :checked="selectedTypes.includes(type)"
              @change="toggleType(type)"
            >
              {{ type }}
            </el-check-tag>
          </div>
        </div>

        <div class="pref-section">
          <label>预算范围（元）</label>
          <el-slider
            v-model="budget"
            :min="0"
            :max="50000"
            :step="1000"
            :format-tooltip="formatBudget"
            range
            :disabled="loading"
          />
        </div>

        <div class="pref-section">
          <label>出行天数</label>
          <el-input-number v-model="days" :min="1" :max="30" :disabled="loading" />
          <p class="pref-hint">行程总时长，影响可到达范围</p>
        </div>

        <div class="pref-actions">
          <el-button
            type="primary"
            :loading="loading"
            :disabled="!canSubmit"
            @click="getRecommendations"
          >
            <el-icon><MagicStick /></el-icon>
            AI 智能推荐
          </el-button>
        </div>
      </el-card>

      <div v-if="resultSummary" class="result-summary">
        <el-alert :title="resultSummary" type="success" show-icon :closable="false" />
      </div>

      <!-- AI 处理进度覆盖 -->
      <ProgressOverlay
        :visible="loading"
        title="AI 正在为您规划行程"
        :steps="recommendSteps"
        :externalProgress="progressPercent"
      />

      <div class="recommend-results">
        <h2 v-if="recommendations.length" class="section-title">
          为您推荐
          <span class="section-subtitle">{{ activeIndex + 1 }} / {{ recommendations.length }}</span>
          <el-tag v-if="cachedResult" type="info" size="small" effect="plain" class="cache-tag">
            上次结果
          </el-tag>
        </h2>

        <!-- Card Stack -->
        <div class="card-stack" v-if="recommendations.length">
          <button
            class="stack-arrow stack-arrow-left"
            @click="prevCard"
            aria-label="上一个推荐"
          >
            <el-icon><ArrowLeft /></el-icon>
          </button>

          <div class="card-stack-stage">
            <div
              v-for="(item, index) in recommendations"
              :key="item.id"
              class="stack-card"
              :class="getCardStackClass(index)"
              :style="{ position: index === activeIndex ? 'relative' : 'absolute' }"
              @click="activeIndex = index"
            >
              <div class="stack-card-image">
                <img :src="resolveScenicCover(item)" :alt="item.name" @error="onScenicImageError" />
                <div class="stack-card-image-shade"></div>
                <span class="stack-card-category">{{ item.category }}</span>
                <span class="stack-card-number">#{{ index + 1 }}</span>
              </div>
              <div class="stack-card-body">
                <!-- Inactive card: compact header only -->
                <template v-if="index !== activeIndex">
                  <div class="stack-card-header">
                    <h3 class="stack-card-name">{{ item.name }}</h3>
                    <p class="stack-card-location">
                      <el-icon><Location /></el-icon>{{ item.location }}
                    </p>
                  </div>
                </template>

                <!-- Active card: two-column layout -->
                <div v-if="index === activeIndex" class="stack-card-columns">
                  <!-- Left: info -->
                  <div class="stack-card-left">
                    <div class="stack-card-header">
                      <h3 class="stack-card-name">{{ item.name }}</h3>
                      <p class="stack-card-location">
                        <el-icon><Location /></el-icon>{{ item.location }}
                      </p>
                      <span class="stack-card-price" v-if="item.price">
                        <span class="price-currency">¥</span>{{ item.price }}
                      </span>
                    </div>
                    <section v-if="item.matchReason" class="intro-block">
                      <h4 class="intro-label">推荐理由</h4>
                      <p class="intro-text">{{ item.matchReason }}</p>
                    </section>
                    <section v-if="item.description" class="intro-block">
                      <h4 class="intro-label">景点介绍</h4>
                      <p class="intro-text">{{ item.description }}</p>
                    </section>
                    <div class="recommend-actions">
                      <el-button
                        type="primary"
                        plain
                        :disabled="!guideAgentReady"
                        @click.stop="goGenerateGuide(item)"
                      >
                        <el-icon><Document /></el-icon>
                        生成攻略
                      </el-button>
                    </div>
                  </div>

                  <!-- Right: trip plan -->
                  <div class="stack-card-right">
                    <section v-if="item.tripPlan" class="trip-plan">
                      <h4 class="intro-label trip-plan-title">📋 行程预案</h4>
                      <div class="trip-plan-grid">
                        <div v-if="item.tripPlan.transportation" class="trip-plan-item">
                          <span class="trip-plan-icon">🚗</span>
                          <div class="trip-plan-content">
                            <span class="trip-plan-key">出行方式</span>
                            <span v-if="item.tripPlan.transportation.mode">{{ item.tripPlan.transportation.mode }}</span>
                            <span v-if="item.tripPlan.transportation.duration">，{{ item.tripPlan.transportation.duration }}</span>
                            <span v-if="item.tripPlan.transportation.costEstimate">，{{ item.tripPlan.transportation.costEstimate }}</span>
                          </div>
                        </div>
                        <div v-if="item.tripPlan.weather" class="trip-plan-item">
                          <span class="trip-plan-icon">🌤️</span>
                          <div class="trip-plan-content">
                            <span class="trip-plan-key">天气</span>
                            <span>{{ item.tripPlan.weather }}</span>
                          </div>
                        </div>
                        <div v-if="item.tripPlan.clothing" class="trip-plan-item">
                          <span class="trip-plan-icon">👔</span>
                          <div class="trip-plan-content">
                            <span class="trip-plan-key">穿搭建议</span>
                            <span>{{ item.tripPlan.clothing }}</span>
                          </div>
                        </div>
                        <div v-if="item.tripPlan.accommodation" class="trip-plan-item">
                          <span class="trip-plan-icon">🏨</span>
                          <div class="trip-plan-content">
                            <span class="trip-plan-key">住宿建议</span>
                            <span>{{ item.tripPlan.accommodation }}</span>
                          </div>
                        </div>
                      </div>
                      <div v-if="item.tripPlan.itinerary && item.tripPlan.itinerary.length" class="trip-plan-itinerary">
                        <span class="trip-plan-key">📅 日程安排</span>
                        <ul class="itinerary-list">
                          <li v-for="(day, idx) in item.tripPlan.itinerary" :key="idx">{{ day }}</li>
                        </ul>
                      </div>
                    </section>
                    <div v-else class="trip-plan-empty">
                      <p class="intro-text">暂无行程预案</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button
            class="stack-arrow stack-arrow-right"
            @click="nextCard"
            aria-label="下一个推荐"
          >
            <el-icon><ArrowRight /></el-icon>
          </button>
        </div>

        <!-- Number Indicators -->
        <div class="stack-indicators" v-if="recommendations.length > 1">
          <button
            v-for="(item, index) in recommendations"
            :key="'dot-' + item.id"
            class="stack-dot"
            :class="{ active: index === activeIndex }"
            @click="activeIndex = index"
            :aria-label="`切换到第 ${index + 1} 个推荐`"
          >
            {{ index + 1 }}
          </button>
        </div>

        <el-empty
          v-if="!loading && recommendations.length === 0 && hasSearched"
          description="暂无推荐结果，请调整出发地、标签、预算或行程天数后重试"
        />

        <!-- 更多推荐 -->
        <div v-if="recommendations.length > 0" class="more-recommend">
          <div v-if="noMoreResults" class="more-tip">
            <el-divider>已无更多推荐</el-divider>
            <p class="more-tip-text">当前条件下暂无更多匹配景点，可调整需求后重新搜索</p>
          </div>
          <el-button
            v-else
            type="default"
            :loading="loadingMore"
            :disabled="loadingMore"
            class="more-btn"
            @click="getMoreRecommendations"
          >
            <el-icon><RefreshRight /></el-icon>
            更多推荐
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { getRecommendAgentStatus, postRecommendAgent, postRecommendAgentMore } from '@/api/scenic'
import { getGuideAgentStatus } from '@/api/guide'
import { formatScenicList, SCENIC_CATEGORY_LABELS } from '@/utils/categoryLabels'
import { DEPARTURE_CITIES } from '@/constants/departureCities'
import { resolveScenicCover, onScenicImageError } from '@/utils/scenicImage'
import { saveRecommendCache, loadRecommendCache, clearRecommendCache } from '@/utils/recommendCache'
import ProgressOverlay from '@/components/common/ProgressOverlay.vue'
import { ElMessage } from 'element-plus'
import { Document, RefreshRight, ArrowLeft, ArrowRight, Location } from '@element-plus/icons-vue'

const router = useRouter()

const loading = ref(false)
const hasSearched = ref(false)
const agentReady = ref(false)
const guideAgentReady = ref(false)
const recommendations = ref([])
const resultSummary = ref('')
const departureCities = DEPARTURE_CITIES
const departureCity = ref('')
const selectedTypes = ref([])
const customPrompt = ref('')
const budget = ref([0, 10000])
const days = ref(5)
const loadingMore = ref(false)
const noMoreResults = ref(false)
const lastSearchParams = ref(null)
const activeIndex = ref(0)
const cachedResult = ref(false)

const progressPercent = ref(-1)
const sseSource = ref(null)

// 推荐加载步骤
const recommendSteps = ref([
  { label: '正在联网搜索目的地...', duration: 2500 },
  { label: 'AI 分析候选目的地...', duration: 3000 },
  { label: '正在发现景点数据（高德 + 百度百科 + 维基导游）...', duration: 5000 },
  { label: '获取实时天气信息...', duration: 2000 },
  { label: 'AI 生成行程预案...', duration: 4000 },
])

const travelTypes = [
  '自然风光',
  '历史古迹',
  '海滨度假',
  '城市观光',
  '主题乐园',
  '山岳徒步',
  '文化体验',
  '美食之旅',
]

const canSubmit = computed(
  () =>
    agentReady.value &&
    departureCity.value.trim().length >= 2 &&
    (selectedTypes.value.length > 0 || customPrompt.value.trim().length > 0)
)

function cleanSSE() {
  if (sseSource.value) {
    sseSource.value.close()
    sseSource.value = null
  }
}

function toggleType(type) {
  const index = selectedTypes.value.indexOf(type)
  if (index > -1) {
    selectedTypes.value.splice(index, 1)
  } else {
    selectedTypes.value.push(type)
  }
}

function formatBudget(val) {
  return `¥${val}`
}

async function fetchAgentStatus() {
  try {
    const res = await getRecommendAgentStatus()
    agentReady.value = !!res.data?.configured
  } catch {
    agentReady.value = false
  }
  try {
    const res = await getGuideAgentStatus()
    guideAgentReady.value = !!res.data?.configured
  } catch {
    guideAgentReady.value = false
  }
}

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

function goGenerateGuide(item) {
  if (!guideAgentReady.value) {
    ElMessage.warning('攻略 Agent 未就绪')
    return
  }
  const daysText = days.value ? `${days.value}天` : ''
  const topic = [item.name, daysText, '旅游攻略'].filter(Boolean).join('')
  router.push({
    path: '/guide',
    query: {
      auto: '1',
      topic,
      scenicId: String(item.id),
      scenicName: item.name,
      category: item.categoryRaw
        ? SCENIC_CATEGORY_TO_GUIDE[item.categoryRaw] || ''
        : LABEL_TO_GUIDE_CATEGORY[item.category] || '',
    },
  })
}

function getRecommendations() {
  if (!canSubmit.value) return
  loading.value = true
  hasSearched.value = true
  resultSummary.value = ''
  noMoreResults.value = false
  activeIndex.value = 0
  progressPercent.value = 0

  // 恢复默认步骤标签
  recommendSteps.value = [
    { label: '正在联网搜索目的地...', duration: 2500 },
    { label: 'AI 分析候选目的地...', duration: 3000 },
    { label: '正在发现景点数据（高德 + 百度百科 + 维基导游）...', duration: 5000 },
    { label: '获取实时天气信息...', duration: 2000 },
    { label: 'AI 生成行程预案...', duration: 4000 },
  ]

  cleanSSE()

  const params = new URLSearchParams()
  params.append('departureCity', departureCity.value.trim())
  selectedTypes.value.forEach(type => params.append('travelStyles', type))
  params.append('budgetMin', String(budget.value[0]))
  params.append('budgetMax', String(budget.value[1]))
  params.append('days', String(days.value))
  if (customPrompt.value.trim()) {
    params.append('customPrompt', customPrompt.value.trim())
  }
  params.append('limit', '3')

  // 保存本次搜索参数，供“更多推荐”使用
  lastSearchParams.value = {
    departureCity: departureCity.value.trim(),
    travelStyles: selectedTypes.value,
    budgetMin: budget.value[0],
    budgetMax: budget.value[1],
    days: days.value,
    customPrompt: customPrompt.value.trim() || undefined,
    limit: 3,
  }

  const url = `/api/scenic/recommend/agent/stream?${params.toString()}`
  const sse = new EventSource(url)
  sseSource.value = sse

  sse.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data)

      if (data.error) {
        sse.close()
        cleanSSE()
        loading.value = false
        ElMessage.warning(data.error)
        return
      }

      if (data.progress !== undefined) {
        progressPercent.value = data.progress
      }

      if (data.step !== undefined && data.message) {
        const stepIdx = data.step
        if (stepIdx >= 0 && stepIdx < recommendSteps.value.length) {
          recommendSteps.value[stepIdx].label = data.message
        }
      }

      if (data.done) {
        sse.close()
        cleanSSE()

        const resData = data.result.data
        recommendations.value = (resData?.list || []).map((raw) => {
          const formatted = formatScenicList([raw])[0]
          return { ...formatted, categoryRaw: raw.category }
        })
        const fromDb = resData?.fromDatabase ?? 0
        const fromWeb = resData?.fromWeb ?? 0
        resultSummary.value = resData?.summary || ''

        if (recommendations.value.length) {
          cachedResult.value = false
          saveRecommendCache({
            recommendations: recommendations.value,
            resultSummary: resultSummary.value,
            departureCity: departureCity.value.trim(),
            selectedTypes: selectedTypes.value,
            budget: budget.value,
            days: days.value,
            customPrompt: customPrompt.value.trim(),
          })
          ElMessage.success(
            fromWeb > 0
              ? `已推荐 ${recommendations.value.length} 处（库内 ${fromDb}，新入库 ${fromWeb}）`
              : `已推荐 ${recommendations.value.length} 处景点`
          )
        } else {
          ElMessage.info('暂无推荐结果，请调整条件后重试')
          noMoreResults.value = true
        }

        setTimeout(() => {
          loading.value = false
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
    loading.value = false
    ElMessage.error('智能推荐连接中断，请重试')
  }
}

function prevCard() {
  const len = recommendations.value.length
  if (!len) return
  activeIndex.value = (activeIndex.value - 1 + len) % len
}

function nextCard() {
  const len = recommendations.value.length
  if (!len) return
  activeIndex.value = (activeIndex.value + 1) % len
}

function getCardStackClass(index) {
  const len = recommendations.value.length
  if (len <= 1) return index === activeIndex.value ? 'is-active' : ''
  // Cyclic distance: shortest path around the ring
  let diff = index - activeIndex.value
  if (Math.abs(diff) > len / 2) {
    diff = diff > 0 ? diff - len : diff + len
  }
  if (diff === 0) return 'is-active'
  if (diff === -1) return 'is-left-1'
  if (diff === 1) return 'is-right-1'
  if (diff === -2) return 'is-left-2'
  if (diff === 2) return 'is-right-2'
  if (diff < -2) return 'is-far-left'
  if (diff > 2) return 'is-far-right'
  return ''
}

async function getMoreRecommendations() {
  if (!lastSearchParams.value || loadingMore.value) return
  loadingMore.value = true
  const excludeIds = recommendations.value.map((item) => item.id)
  try {
    const res = await postRecommendAgentMore({
      ...lastSearchParams.value,
      excludeIds,
    })

    const newList = (res.data?.list || []).map((raw) => {
      const formatted = formatScenicList([raw])[0]
      return { ...formatted, categoryRaw: raw.category }
    })

    if (newList.length > 0) {
      recommendations.value = [...recommendations.value, ...newList]
      saveRecommendCache({
        recommendations: recommendations.value,
        resultSummary: resultSummary.value,
        departureCity: departureCity.value.trim(),
        selectedTypes: selectedTypes.value,
        budget: budget.value,
        days: days.value,
        customPrompt: customPrompt.value.trim(),
      })
      const fromDb = res.data?.fromDatabase ?? 0
      const fromWeb = res.data?.fromWeb ?? 0
      ElMessage.success(
        fromWeb > 0
          ? `再推荐 ${newList.length} 处（库内 ${fromDb}，新入库 ${fromWeb}）`
          : `再推荐 ${newList.length} 处景点`
      )
    } else {
      noMoreResults.value = true
      ElMessage.info('当前条件下暂无更多匹配景点')
    }
  } catch (error) {
    console.error('获取更多推荐失败:', error)
    ElMessage.error('获取更多推荐失败，请稍后重试')
  } finally {
    loadingMore.value = false
  }
}

function handleKeydown(e) {
  if (e.key === 'ArrowLeft') {
    e.preventDefault()
    prevCard()
  } else if (e.key === 'ArrowRight') {
    e.preventDefault()
    nextCard()
  }
}

onMounted(() => {
  fetchAgentStatus()
  window.addEventListener('keydown', handleKeydown)

  // 尝试从本地缓存恢复上次推荐结果
  const cache = loadRecommendCache()
  if (cache && cache.recommendations?.length) {
    recommendations.value = cache.recommendations
    resultSummary.value = cache.resultSummary || ''
    departureCity.value = cache.departureCity || ''
    selectedTypes.value = cache.selectedTypes || []
    budget.value = cache.budget || [0, 10000]
    days.value = cache.days || 5
    customPrompt.value = cache.customPrompt || ''
    hasSearched.value = true
    cachedResult.value = true
  }
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  cleanSSE()
})
</script>

<style scoped>
.recommend-page {
  padding: var(--spacing-xl) 0 var(--spacing-3xl);
}

.page-header {
  text-align: center;
  margin-bottom: var(--spacing-xl);
}

.page-title {
  font-size: var(--font-size-4xl);
  font-weight: 800;
  margin-bottom: var(--spacing-sm);
}

.page-desc {
  color: var(--color-text-secondary);
  font-size: var(--font-size-lg);
  max-width: 560px;
  margin: 0 auto var(--spacing-md);
}

.agent-status {
  display: flex;
  justify-content: center;
  gap: var(--spacing-sm);
}

.agent-alert {
  margin-bottom: var(--spacing-lg);
}

.preference-card {
  margin-bottom: var(--spacing-xl);
  border-radius: var(--radius-md);
}

.pref-section {
  margin-bottom: var(--spacing-lg);
}

.pref-section label {
  display: block;
  font-weight: 500;
  margin-bottom: var(--spacing-sm);
  color: var(--color-text-primary);
}

.pref-section .required {
  color: var(--color-gold);
}

.departure-select {
  width: 100%;
  max-width: 320px;
}

.pref-hint {
  margin-top: var(--spacing-xs);
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
  line-height: 1.5;
}

.pref-options {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
}

.pref-actions {
  text-align: center;
  padding-top: var(--spacing-md);
}

.result-summary {
  margin-bottom: var(--spacing-lg);
}

.recommend-results {
  min-height: 200px;
}

.section-title {
  font-size: var(--font-size-xl);
  font-weight: 600;
  margin-bottom: var(--spacing-lg);
  display: flex;
  align-items: baseline;
  gap: var(--spacing-md);
}

.section-subtitle {
  font-size: var(--font-size-sm);
  font-weight: 400;
  color: var(--color-gold);
  white-space: nowrap;
}

.cache-tag {
  margin-left: var(--spacing-xs);
  vertical-align: middle;
}

/* ========== Card Stack ========== */
.card-stack {
  position: relative;
  display: flex;
  align-items: center;
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 52px;
}

/* ---- Stage ---- */
.card-stack-stage {
  position: relative;
  width: 100%;
  perspective: 1200px;
}

/* ---- Individual Card ---- */
.stack-card {
  top: 0;
  left: 0;
  width: 100%;
  height: 620px;
  max-width: 1100px;
  background: var(--color-bg-card);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-lg);
  overflow: hidden;
  cursor: pointer;
  transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
  transform-origin: center center;
  box-shadow: var(--shadow-md);
  display: flex;
  flex-direction: column;
}

/* Active card */
.stack-card.is-active {
  z-index: 5;
  opacity: 1;
  transform: translateX(0) scale(1);
  pointer-events: auto;
  box-shadow: var(--shadow-lg), var(--shadow-gold);
  border-color: var(--color-gold-border);
  cursor: default;
}

/* Left peek - 1 behind */
.stack-card.is-left-1 {
  z-index: 4;
  opacity: 0.45;
  transform: translateX(-7%) scale(0.88) rotateY(6deg);
  pointer-events: auto;
}

/* Right peek - 1 behind */
.stack-card.is-right-1 {
  z-index: 4;
  opacity: 0.45;
  transform: translateX(7%) scale(0.88) rotateY(-6deg);
  pointer-events: auto;
}

/* Left peek - 2 behind */
.stack-card.is-left-2 {
  z-index: 3;
  opacity: 0.2;
  transform: translateX(-12%) scale(0.78) rotateY(10deg);
  pointer-events: auto;
}

/* Right peek - 2 behind */
.stack-card.is-right-2 {
  z-index: 3;
  opacity: 0.2;
  transform: translateX(12%) scale(0.78) rotateY(-10deg);
  pointer-events: auto;
}

/* Far cards - hidden */
.stack-card.is-far-left,
.stack-card.is-far-right {
  z-index: 1;
  opacity: 0;
  transform: translateX(0) scale(0.7);
  pointer-events: none;
}

.stack-card-image {
  position: relative;
  height: 300px;
  flex-shrink: 0;
  overflow: hidden;
  border-bottom: 1px solid var(--color-border-light);
}

/* Inactive cards: image fills entire card */
.stack-card:not(.is-active) .stack-card-image {
  height: 100%;
}

.stack-card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 600ms cubic-bezier(0.16, 1, 0.3, 1);
}

.stack-card.is-active:hover .stack-card-image img {
  transform: scale(1.04);
}

.stack-card-image-shade {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(10, 15, 26, 0.45) 0%,
    transparent 40%,
    rgba(10, 15, 26, 0.6) 100%
  );
  pointer-events: none;
}

/* Inactive: darker overlay for readability */
.stack-card:not(.is-active) .stack-card-image-shade {
  background: linear-gradient(
    to bottom,
    rgba(10, 15, 26, 0.35) 0%,
    rgba(10, 15, 26, 0.5) 60%,
    rgba(10, 15, 26, 0.85) 100%
  );
}

.stack-card-category {
  position: absolute;
  top: 12px;
  left: 12px;
  display: inline-block;
  padding: 5px 12px;
  background: rgba(10, 15, 26, 0.85);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(200, 169, 81, 0.5);
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  font-weight: 600;
  color: var(--color-gold-light);
  font-family: var(--font-display);
  letter-spacing: 0.05em;
}

.stack-card-number {
  position: absolute;
  top: 12px;
  right: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: rgba(10, 15, 26, 0.85);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(200, 169, 81, 0.4);
  border-radius: 50%;
  font-size: var(--font-size-xs);
  font-weight: 700;
  color: var(--color-gold-light);
  font-family: var(--font-display);
}

/* ---- Card Body ---- */
.stack-card-body {
  flex: 1;
  overflow: hidden;
  min-height: 0;
  padding-top: 48px;
}

/* Inactive card: overlay header on top of full-bleed image */
.stack-card:not(.is-active) .stack-card-body {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: var(--spacing-lg) var(--spacing-xl);
  background: linear-gradient(transparent, rgba(10, 15, 26, 0.92));
  color: #fff;
  flex: none;
  overflow: visible;
}

.stack-card:not(.is-active) .stack-card-body .stack-card-name {
  color: #fff;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.6);
}

.stack-card:not(.is-active) .stack-card-body .stack-card-location {
  color: rgba(255, 255, 255, 0.75);
}

/* ---- Stack Card Header ---- */
.stack-card-header {
  margin-bottom: var(--spacing-md);
}

.stack-card:not(.is-active) .stack-card-header {
  margin-bottom: 0;
}

.stack-card-name {
  font-family: var(--font-display);
  font-size: var(--font-size-xl);
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: 4px;
  letter-spacing: -0.01em;
}

.stack-card:not(.is-active) .stack-card-name {
  font-size: var(--font-size-base);
}

.stack-card-location {
  display: flex;
  align-items: center;
  gap: 4px;
  color: var(--color-text-muted);
  font-size: var(--font-size-sm);
  margin-bottom: var(--spacing-xs);
}

.stack-card-price {
  font-family: var(--font-display);
  font-size: var(--font-size-2xl);
  font-weight: 700;
  color: var(--color-gold);
}

.price-currency {
  font-size: var(--font-size-sm);
  vertical-align: super;
}

.stack-card:not(.is-active) .stack-card-price {
  display: none;
}

/* ---- Two-Column Layout (active card) ---- */
.stack-card-columns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-xl);
  height: 100%;
  overflow: hidden;
  padding: var(--spacing-lg);
}

.stack-card-left {
  overflow-y: auto;
  padding-right: var(--spacing-lg);
  display: flex;
  flex-direction: column;
}

.stack-card-right {
  overflow-y: auto;
  border-left: 1px solid var(--color-border-light);
  padding-left: var(--spacing-xl);
  padding-right: var(--spacing-sm);
}

/* ---- Intro / Trip Plan blocks ---- */
.intro-block {
  border-left: 3px solid var(--color-gold);
  padding-left: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}

.intro-label {
  font-size: var(--font-size-xs);
  color: var(--color-gold);
  font-weight: 600;
  letter-spacing: 0.06em;
  margin-bottom: var(--spacing-md);
}

.intro-text {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  line-height: 1.8;
}

/* ---- Trip Plan ---- */
.trip-plan {
  margin-bottom: 0;
}

.trip-plan-title {
  color: var(--color-primary) !important;
  margin-bottom: var(--spacing-lg);
}

.trip-plan-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--color-text-muted);
}

.trip-plan-grid {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.trip-plan-item {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-sm);
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  line-height: 1.6;
  padding: var(--spacing-sm);
  background: var(--color-bg-hover);
  border-radius: var(--radius-sm);
}

.trip-plan-icon {
  flex-shrink: 0;
  font-size: var(--font-size-base);
}

.trip-plan-content {
  display: flex;
  flex-wrap: wrap;
  gap: 0 var(--spacing-xs);
}

.trip-plan-key {
  font-weight: 600;
  color: var(--color-text-primary);
  margin-right: var(--spacing-xs);
}

.trip-plan-itinerary {
  margin-top: var(--spacing-lg);
  padding-top: var(--spacing-md);
  border-top: 1px dashed var(--color-border-light);
}

.itinerary-list {
  margin: var(--spacing-xs) 0 0;
  padding-left: var(--spacing-lg);
  list-style: disc;
}

.itinerary-list li {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  line-height: 1.7;
  padding: 4px 0;
}

.recommend-actions {
  margin-top: auto;
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--color-border-light);
  text-align: center;
}

/* ---- Arrows ---- */
.stack-arrow {
  position: absolute;
  top: 50%;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border: 1px solid var(--color-border-light);
  border-radius: 50%;
  background: var(--color-bg-card);
  color: var(--color-text-primary);
  cursor: pointer;
  transition: all 0.25s ease;
  box-shadow: var(--shadow-sm);
  transform: translateY(-50%);
}

.stack-arrow:hover {
  background: var(--color-gold);
  color: #fff;
  border-color: var(--color-gold);
  box-shadow: var(--shadow-md), var(--shadow-gold);
}

.stack-arrow:active {
  transform: translateY(-50%) scale(0.95);
}

.stack-arrow-left {
  left: 0;
}

.stack-arrow-right {
  right: 0;
}

/* ---- Number Indicators ---- */
.stack-indicators {
  display: flex;
  justify-content: center;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-xl);
  padding-top: var(--spacing-md);
}

.stack-dot {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: 1px solid var(--color-border-light);
  border-radius: 50%;
  background: var(--color-bg-card);
  color: var(--color-text-muted);
  font-size: var(--font-size-sm);
  font-weight: 600;
  font-family: var(--font-display);
  cursor: pointer;
  transition: all 0.25s ease;
}

.stack-dot:hover {
  border-color: var(--color-gold-border);
  color: var(--color-gold);
}

.stack-dot.active {
  background: var(--color-gold);
  color: #fff;
  border-color: var(--color-gold);
  box-shadow: var(--shadow-gold);
}

/* ---- More Recommend ---- */
.more-recommend {
  text-align: center;
  margin-top: var(--spacing-xl);
  padding-top: var(--spacing-md);
}

.more-btn {
  min-width: 180px;
}

.more-tip {
  color: var(--color-text-secondary);
}

.more-tip-text {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  margin-top: var(--spacing-sm);
}

/* ---- Responsive ---- */
@media (max-width: 768px) {
  .card-stack {
    padding: 0 40px;
  }

  .stack-card {
    height: auto;
    min-height: 420px;
  }

  .stack-card-image {
    height: 220px;
  }

  .stack-card-columns {
    grid-template-columns: 1fr;
    overflow-y: auto;
  }

  .stack-card-right {
    border-left: none;
    border-top: 1px solid var(--color-border-light);
    padding-left: 0;
    padding-top: var(--spacing-md);
  }

  .stack-arrow {
    width: 36px;
    height: 36px;
  }

  /* Hide side-peeking cards on mobile */
  .stack-card.is-left-1,
  .stack-card.is-right-1,
  .stack-card.is-left-2,
  .stack-card.is-right-2 {
    opacity: 0;
    pointer-events: none;
    transform: translateX(0) scale(0.85);
  }
}
</style>
