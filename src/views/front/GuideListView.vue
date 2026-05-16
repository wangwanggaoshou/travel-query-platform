<template>
  <div class="guide-list-page">
    <div class="container">
      <AppBreadcrumb :items="[{ title: 'AI 攻略' }]" />

      <div class="page-header">
        <h1 class="page-title">AI 攻略</h1>
        <p class="page-desc">输入目的地或主题，由 AI 联网检索并撰写专属行程攻略</p>
      </div>

      <div class="agent-panel" v-loading="generating">
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
        <p v-if="generating" class="agent-generating-hint">正在撰写攻略，请稍候…</p>
        <p v-else-if="!agentReady" class="agent-hint">
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
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { MagicStick } from '@element-plus/icons-vue'
import AppBreadcrumb from '@/components/common/AppBreadcrumb.vue'
import GuideCard from '@/components/guide/GuideCard.vue'
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

const categoryOptions = [
  { label: '城市漫步', value: 'city' },
  { label: '自然风光', value: 'nature' },
  { label: '美食之旅', value: 'food' },
  { label: '自驾攻略', value: 'roadtrip' },
  { label: '预算旅行', value: 'budget' },
  { label: '历史古迹', value: 'history' },
]

function loadRecentGuides() {
  recentGuides.value = getRecentGuides()
}

function goToDetail(guide) {
  router.push(`/guide/${guide.id}`)
}

async function runGenerate({ topic, scenicId, scenicName, location, category } = {}) {
  const t = (topic || generateTopic.value || '').trim()
  if (!t || !agentReady.value) return false

  generating.value = true
  try {
    const res = await generateGuide({
      topic: t,
      scenicId: scenicId ?? pendingScenicId.value ?? undefined,
      scenicName: scenicName || pendingScenicName.value || undefined,
      location: location || pendingLocation.value || undefined,
      category: category || generateCategory.value || undefined,
    })
    const guide = buildGuideFromApi(res.data, {
      topic: t,
      scenicId: scenicId ?? pendingScenicId.value,
      scenicName: scenicName || pendingScenicName.value,
    })
    saveRecentGuide(guide)
    loadRecentGuides()
    ElMessage.success('攻略已生成')
    generateTopic.value = ''
    pendingScenicId.value = null
    pendingScenicName.value = ''
    pendingLocation.value = ''
    router.push(`/guide/${guide.id}`)
    return true
  } catch (error) {
    console.error('生成攻略失败:', error)
    return false
  } finally {
    generating.value = false
  }
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

.agent-hint,
.agent-generating-hint {
  margin-top: var(--spacing-sm);
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
}

.agent-generating-hint {
  color: var(--color-gold);
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
