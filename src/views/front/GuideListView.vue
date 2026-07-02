<template>
  <div class="guide-list-page">
    <div class="container">
      <AppBreadcrumb :items="[{ title: 'AI 攻略' }]" />

      <div class="page-header">
        <h1 class="page-title">AI 攻略</h1>
        <p class="page-desc">输入目的地或主题，由 AI 联网检索并撰写专属行程攻略</p>
      </div>

      <!-- AI 生成攻略进度覆盖 -->
      <ProgressOverlay
        :visible="generating"
        title="AI 正在撰写攻略"
        :steps="guideSteps"
        :externalProgress="progressPercent"
      />

      <div class="agent-panel">
        <div class="agent-panel-head">
          <el-icon><MagicStick /></el-icon>
          <span>智能生成攻略</span>
          <el-tag v-if="agentReady" type="success" size="small" effect="plain">已就绪</el-tag>
          <el-tag v-else type="info" size="small" effect="plain">待配置</el-tag>
        </div>
        <div class="agent-form">
          <el-input
            v-model="generateTopic"
            placeholder="例如：成都三日游、西湖周末轻徒步…"
            clearable
            :disabled="generating"
            @keyup.enter="handleGenerate"
          />
          <el-select
            v-model="generateCategory"
            placeholder="风格（可选）"
            clearable
            class="agent-category"
            :disabled="generating"
          >
            <el-option
              v-for="cat in categoryOptions"
              :key="cat.value"
              :label="cat.label"
              :value="cat.value"
            />
          </el-select>
          <el-button
            type="primary"
            :loading="generating"
            :disabled="!agentReady || !generateTopic.trim()"
            @click="handleGenerate"
          >
            生成攻略
          </el-button>
        </div>
        <p v-if="!generating && !agentReady" class="agent-hint">
          请在 back-end/.env 中配置大模型（GUIDE_AGENT_LLM_API_KEY、GUIDE_AGENT_LLM_BASE_URL）及联网搜索（GUIDE_AGENT_WEB_SEARCH_API_KEY）。
        </p>
      </div>

      <section v-if="recentGuides.length" class="history-section">
        <h2 class="history-title">最近生成的攻略</h2>
        <p class="history-desc">仅保存在当前浏览器会话</p>
        <div class="guide-grid">
          <GuideCard
            v-for="guide in recentGuides"
            :key="guide.id"
            :guide="guide"
            @click="goToDetail(guide)"
          />
        </div>
      </section>

      <el-empty
        v-else-if="!generating && agentReady"
        description="暂无攻略，输入主题开始生成"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { MagicStick } from '@element-plus/icons-vue'
import AppBreadcrumb from '@/components/common/AppBreadcrumb.vue'
import GuideCard from '@/components/guide/GuideCard.vue'
import ProgressOverlay from '@/components/common/ProgressOverlay.vue'
import { getGuideAgentStatus, generateGuide } from '@/api/guide'
import {
  getRecentGuides,
  saveRecentGuide,
  buildGuideFromApi,
} from '@/utils/recentGuides'

const route = useRoute()
const router = useRouter()

const recentGuides = ref([])
const agentReady = ref(false)
const generating = ref(false)
const generateTopic = ref('')
const generateCategory = ref('')
const pendingScenicId = ref(null)
const pendingScenicName = ref('')
const pendingLocation = ref('')
const pendingCoverImage = ref('')

const progressPercent = ref(-1)
const sseSource = ref(null)

// 攻略生成步骤
const guideSteps = ref([
  { label: '正在联网搜索目的地资料...', duration: 3000 },
  { label: 'AI 正在查阅相关信息...', duration: 4000 },
  { label: '正在整理景点与行程数据...', duration: 5000 },
  { label: 'AI 正在撰写攻略内容...', duration: 6000 },
  { label: '正在排版与优化...', duration: 3000 },
])

const categoryOptions = [
  { label: '城市漫步', value: 'city' },
  { label: '自然风光', value: 'nature' },
  { label: '美食之旅', value: 'food' },
  { label: '自驾攻略', value: 'roadtrip' },
  { label: '预算旅行', value: 'budget' },
  { label: '历史古迹', value: 'history' },
]

function cleanSSE() {
  if (sseSource.value) {
    sseSource.value.close()
    sseSource.value = null
  }
}

onUnmounted(() => {
  cleanSSE()
})

function loadRecentGuides() {
  recentGuides.value = getRecentGuides()
}

function goToDetail(guide) {
  router.push(`/guide/${guide.id}`)
}

function runGenerate({ topic, scenicId, scenicName, location, category, coverImage } = {}) {
  const t = (topic || generateTopic.value || '').trim()
  if (!t || !agentReady.value) return false

  generating.value = true
  progressPercent.value = 0

  // 恢复默认步骤标签
  guideSteps.value = [
    { label: '正在联网搜索目的地资料...', duration: 3000 },
    { label: 'AI 正在查阅相关信息...', duration: 4000 },
    { label: '正在整理景点与行程数据...', duration: 5000 },
    { label: 'AI 正在撰写攻略内容...', duration: 6000 },
    { label: '正在排版与优化...', duration: 3000 },
  ]

  cleanSSE()

  const sId = scenicId ?? pendingScenicId.value ?? ''
  const sName = scenicName || pendingScenicName.value || ''
  const loc = location || pendingLocation.value || ''
  const cat = category || generateCategory.value || ''
  const cov = coverImage || pendingCoverImage.value || ''

  const params = new URLSearchParams()
  params.append('topic', t)
  if (sId) params.append('scenicId', String(sId))
  if (sName) params.append('scenicName', sName)
  if (loc) params.append('location', loc)
  if (cat) params.append('category', cat)
  if (cov) params.append('coverImage', cov)

  const url = `/api/guide/generate/stream?${params.toString()}`
  const sse = new EventSource(url)
  sseSource.value = sse

  sse.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data)

      if (data.error) {
        sse.close()
        cleanSSE()
        generating.value = false
        ElMessage.error(data.error)
        return
      }

      if (data.progress !== undefined) {
        progressPercent.value = data.progress
      }

      if (data.step !== undefined && data.message) {
        const stepIdx = data.step
        if (stepIdx >= 0 && stepIdx < guideSteps.value.length) {
          guideSteps.value[stepIdx].label = data.message
        }
      }

      if (data.done) {
        sse.close()
        cleanSSE()

        const guideData = data.result.data
        const guide = buildGuideFromApi(guideData, {
          topic: t,
          scenicId: sId || undefined,
          scenicName: sName || undefined,
          coverImage: cov || undefined,
        })
        saveRecentGuide(guide)
        loadRecentGuides()
        ElMessage.success('攻略已生成')
        generateTopic.value = ''
        pendingScenicId.value = null
        pendingScenicName.value = ''
        pendingLocation.value = ''
        pendingCoverImage.value = ''

        setTimeout(() => {
          generating.value = false
          router.push(`/guide/${guide.id}`)
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
    generating.value = false
    ElMessage.error('生成攻略连接中断，请重试')
  }

  return true
}

async function handleGenerate() {
  await runGenerate()
}

async function fetchAgentStatus() {
  try {
    const res = await getGuideAgentStatus()
    agentReady.value = !!res.data?.configured
  } catch {
    agentReady.value = false
  }
}

async function tryAutoGenerateFromQuery() {
  const q = route.query
  if (q.auto !== '1' || !q.topic) return

  const topic = String(q.topic).trim()
  if (!topic) return

  generateTopic.value = topic
  if (q.category) generateCategory.value = String(q.category)
  if (q.scenicId) pendingScenicId.value = Number(q.scenicId) || null
  if (q.scenicName) pendingScenicName.value = String(q.scenicName)
  if (q.location) pendingLocation.value = String(q.location)
  if (q.coverImage) pendingCoverImage.value = String(q.coverImage)

  router.replace({ path: '/guide' })

  if (!agentReady.value) {
    ElMessage.warning('攻略 Agent 未就绪，请稍后再试')
    return
  }

  await runGenerate({
    topic,
    scenicId: pendingScenicId.value,
    scenicName: pendingScenicName.value,
    location: pendingLocation.value,
    category: generateCategory.value,
    coverImage: pendingCoverImage.value,
  })
}

onMounted(async () => {
  loadRecentGuides()
  await fetchAgentStatus()
  await tryAutoGenerateFromQuery()
})
</script>

<style scoped>
.guide-list-page {
  padding: var(--spacing-lg) 0 var(--spacing-3xl);
}

.page-header {
  text-align: center;
  margin-bottom: var(--spacing-xl);
}

.page-title {
  font-size: var(--font-size-3xl);
  font-weight: 700;
  margin-bottom: var(--spacing-sm);
}

.page-desc {
  color: var(--color-text-secondary);
}

.agent-panel {
  margin-bottom: var(--spacing-xl);
  padding: var(--spacing-lg);
  background: var(--color-bg-card);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border-light);
  box-shadow: var(--shadow-sm);
}

.agent-panel-head {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
  font-weight: 600;
}

.agent-form {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
  align-items: center;
}

.agent-form .el-input {
  flex: 1;
  min-width: 220px;
}

.agent-category {
  width: 160px;
}

.agent-hint {
  margin-top: var(--spacing-sm);
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
}

.history-section {
  margin-top: var(--spacing-2xl);
}

.history-title {
  font-size: var(--font-size-xl);
  font-weight: 600;
  margin-bottom: var(--spacing-xs);
  text-align: center;
}

.history-desc {
  text-align: center;
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
  margin-bottom: var(--spacing-lg);
}

.guide-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--spacing-lg);
  min-height: 80px;
}
</style>
