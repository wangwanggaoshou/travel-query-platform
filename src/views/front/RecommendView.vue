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

      <div class="recommend-results" v-loading="loading">
        <h2 v-if="recommendations.length" class="section-title">为您推荐</h2>
        <div class="recommend-list">
          <div v-for="item in recommendations" :key="item.id" class="recommend-item">
            <div class="recommend-scenic">
              <ScenicCard
                :scenic="item"
                :show-description="false"
                @click="$router.push(`/map?id=${item.id}`)"
              />
            </div>
            <div class="recommend-intro">
              <section v-if="item.matchReason" class="intro-block">
                <h4 class="intro-label">推荐理由</h4>
                <p class="intro-text">{{ item.matchReason }}</p>
              </section>
              <section v-if="item.description" class="intro-block">
                <h4 class="intro-label">景点介绍</h4>
                <p class="intro-text">{{ item.description }}</p>
              </section>
              <!-- 行程预案 -->
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
          </div>
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
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import ScenicCard from '@/components/scenic/ScenicCard.vue'
import { getRecommendAgentStatus, postRecommendAgent, postRecommendAgentMore } from '@/api/scenic'
import { getGuideAgentStatus } from '@/api/guide'
import { formatScenicList, SCENIC_CATEGORY_LABELS } from '@/utils/categoryLabels'
import { DEPARTURE_CITIES } from '@/constants/departureCities'
import { ElMessage } from 'element-plus'
import { Document, RefreshRight } from '@element-plus/icons-vue'

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

async function getRecommendations() {
  if (!canSubmit.value) return
  loading.value = true
  hasSearched.value = true
  resultSummary.value = ''
  noMoreResults.value = false
  try {
    const params = {
      departureCity: departureCity.value.trim(),
      travelStyles: selectedTypes.value,
      budgetMin: budget.value[0],
      budgetMax: budget.value[1],
      days: days.value,
      customPrompt: customPrompt.value.trim() || undefined,
      limit: 3,
    }
    lastSearchParams.value = params

    const res = await postRecommendAgent(params)

    recommendations.value = (res.data?.list || []).map((raw) => {
      const formatted = formatScenicList([raw])[0]
      return { ...formatted, categoryRaw: raw.category }
    })
    const fromDb = res.data?.fromDatabase ?? 0
    const fromWeb = res.data?.fromWeb ?? 0
    resultSummary.value = res.data?.summary || ''
    if (recommendations.value.length) {
      ElMessage.success(
        fromWeb > 0
          ? `已推荐 ${recommendations.value.length} 处（库内 ${fromDb}，新入库 ${fromWeb}）`
          : `已推荐 ${recommendations.value.length} 处景点`
      )
    } else {
      ElMessage.info('暂无推荐结果，请调整条件后重试')
      noMoreResults.value = true
    }
  } catch (error) {
    console.error('获取推荐失败:', error)
    recommendations.value = []
  } finally {
    loading.value = false
  }
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

onMounted(() => {
  fetchAgentStatus()
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
}

.recommend-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
  max-width: 960px;
  margin: 0 auto;
}

.recommend-item {
  display: flex;
  align-items: stretch;
  gap: 0;
  background: var(--color-bg-card);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-md);
  overflow: hidden;
  transition: border-color var(--transition-normal);
}

.recommend-item:hover {
  border-color: var(--color-gold-border);
}

.recommend-scenic {
  flex: 0 0 300px;
  max-width: 300px;
  border-right: 1px solid var(--color-border-light);
}

.recommend-scenic :deep(.scenic-card) {
  border: none;
  border-radius: 0;
  height: 100%;
}

.recommend-scenic :deep(.scenic-card:hover) {
  box-shadow: none;
}

.recommend-intro {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: var(--spacing-lg);
  padding: var(--spacing-lg) var(--spacing-xl);
  min-width: 0;
}

.intro-block {
  border-left: 3px solid var(--color-gold);
  padding-left: var(--spacing-md);
}

.intro-label {
  font-size: var(--font-size-xs);
  color: var(--color-gold);
  font-weight: 600;
  letter-spacing: 0.06em;
  margin-bottom: var(--spacing-sm);
}

.intro-text {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  line-height: 1.8;
}

/* 行程预案 */
.trip-plan {
  border-left: 3px solid var(--color-primary);
  padding-left: var(--spacing-md);
  margin-top: var(--spacing-sm);
}

.trip-plan-title {
  color: var(--color-primary) !important;
  margin-bottom: var(--spacing-md);
}

.trip-plan-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-sm) var(--spacing-lg);
}

.trip-plan-item {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-xs);
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  line-height: 1.6;
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
  margin-top: var(--spacing-md);
  padding-top: var(--spacing-sm);
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
  line-height: 1.8;
  padding: 2px 0;
}

.recommend-actions {
  margin-top: var(--spacing-md);
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--color-border-light);
}

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

@media (max-width: 768px) {
  .recommend-item {
    flex-direction: column;
  }

  .recommend-scenic {
    flex: none;
    max-width: none;
    border-right: none;
    border-bottom: 1px solid var(--color-border-light);
  }

  .trip-plan-grid {
    grid-template-columns: 1fr;
  }
}
</style>
