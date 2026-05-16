<template>
  <div class="home-page">
    <HeroBanner />

    <section class="search-section">
      <div class="container">
        <SearchBar
          v-model="searchKeyword"
          placeholder="探索目的地、景点、游记…"
          @search="handleSearch"
        />
      </div>
    </section>

    <section class="home-quick-bar">
      <div class="container">
        <div class="quick-row">
          <span class="quick-label">热门搜索</span>
          <div class="quick-chips">
            <button
              v-for="tag in trendingSearches"
              :key="tag"
              type="button"
              class="chip-btn"
              @click="goQuickSearch(tag)"
            >
              {{ tag }}
            </button>
          </div>
        </div>
      </div>
    </section>

    <section class="home-features section">
      <div class="container">
        <div class="features-header">
          <span class="section-eyebrow">Explore</span>
          <h2 class="section-title">探索方式</h2>
          <div class="gold-divider centered"></div>
          <p class="section-subtitle">从查景点到写攻略，一站完成旅行灵感收集</p>
        </div>
        <div class="features-grid">
          <article
            v-for="feat in featureEntries"
            :key="feat.path"
            class="feature-card hover-lift"
            @click="router.push(feat.path)"
          >
            <div class="feature-icon-wrap">
              <el-icon :size="26"><component :is="feat.icon" /></el-icon>
            </div>
            <h3 class="feature-title">{{ feat.title }}</h3>
            <p class="feature-desc">{{ feat.desc }}</p>
            <span class="feature-link">立即前往 <el-icon><ArrowRight /></el-icon></span>
          </article>
        </div>
      </div>
    </section>

    <section class="home-steps">
      <div class="container">
        <div class="steps-inner">
          <div class="steps-copy">
            <span class="section-eyebrow">How it works</span>
            <h2 class="section-title">三步开启旅程</h2>
            <div class="gold-divider"></div>
            <p class="steps-intro">
              无需账号，打开即可查询国内景点、在地图上探索周边，并由 AI 生成专属攻略。
            </p>
          </div>
          <ol class="steps-list">
            <li v-for="(step, i) in journeySteps" :key="step.title" class="step-item">
              <span class="step-num">{{ i + 1 }}</span>
              <div>
                <h3>{{ step.title }}</h3>
                <p>{{ step.desc }}</p>
              </div>
            </li>
          </ol>
        </div>
      </div>
    </section>

    <section v-if="homeStats.length" class="home-stats">
      <div class="container stats-row">
        <div v-for="stat in homeStats" :key="stat.label" class="stat-block">
          <span class="stat-num">{{ stat.value }}</span>
          <span class="stat-label">{{ stat.label }}</span>
        </div>
      </div>
    </section>

    <FeaturedCarousel :scenic-list="featuredScenicList" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import HeroBanner from '@/components/home/HeroBanner.vue'
import FeaturedCarousel from '@/components/home/FeaturedCarousel.vue'
import SearchBar from '@/components/common/SearchBar.vue'
import { getHotScenic, getScenicCategories } from '@/api/scenic'
import { formatScenicList } from '@/utils/categoryLabels'

const router = useRouter()
const searchKeyword = ref('')
const featuredScenicList = ref([])
const homeStats = ref([])

async function loadHomeData() {
  try {
    const [hotRes, catRes] = await Promise.all([
      getHotScenic({ limit: 6 }),
      getScenicCategories(),
    ])
    featuredScenicList.value = formatScenicList(hotRes.data?.list || [])
    const categories = catRes.data?.categories || []
    const categoryTotal = categories.reduce((sum, c) => sum + (c.count || 0), 0)
    homeStats.value = [
      { value: categoryTotal > 0 ? `${categoryTotal}+` : '—', label: '景点收录' },
      { value: String(categories.length || '—'), label: '主题分类' },
      { value: '5', label: '探索工具' },
      { value: 'AI', label: '攻略生成' },
    ]
  } catch (error) {
    console.error('首页数据加载失败:', error)
  }
}

const trendingSearches = ['三星堆', '故宫博物院', '九寨沟', '黄山', '鼓浪屿', '张家界']

const featureEntries = [
  { title: '景点查询', desc: '按名称、分类检索国内景点，支持高德聚合入库', path: '/scenic', icon: 'Place' },
  { title: '地图探索', desc: '点击地图发现周边景点，查看酒店美食与路线', path: '/map', icon: 'Location' },
  { title: 'AI 攻略', desc: '输入主题即可生成图文并茂的行程攻略', path: '/guide', icon: 'Reading' },
  { title: '智能推荐', desc: '根据出发地、预算与天数推荐合适目的地', path: '/recommend', icon: 'MagicStick' },
  { title: '3D 地球', desc: '旋转地球浏览全球地标与热门区域', path: '/globe', icon: 'Promotion' },
]

const journeySteps = [
  { title: '搜索或浏览景点', desc: '在景点库中检索，或从首页进入详情。' },
  { title: '地图实地探索', desc: '在地图模式查看坐标、周边设施，并一键规划驾车路线。' },
  { title: '生成 AI 攻略', desc: '选定景点后生成专属攻略，保存在浏览器中随时回看。' },
]

function goQuickSearch(tag) {
  searchKeyword.value = tag
  router.push({ path: '/scenic', query: { keyword: tag } })
}

function handleSearch(keyword) {
  const q = (keyword || '').trim()
  if (!q) {
    router.push({ path: '/scenic' })
    return
  }
  router.push({ path: '/scenic', query: { keyword: q } })
}

onMounted(() => loadHomeData())
</script>

<style scoped>
.search-section { margin-top: -40px; position: relative; z-index: 10; padding: 0 0 var(--spacing-lg); }
.search-section .container { max-width: 720px; }
.home-quick-bar { padding: 0 0 var(--spacing-xl); position: relative; z-index: 9; }
.home-quick-bar .container { max-width: 900px; }
.quick-row { display: flex; align-items: flex-start; justify-content: center; gap: var(--spacing-md); flex-wrap: wrap; }
.home-features { padding: var(--spacing-2xl) 0 var(--spacing-xl); }
.features-header { text-align: center; margin-bottom: var(--spacing-xl); }
.features-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: var(--spacing-md); max-width: 1100px; margin: 0 auto; }
.feature-card { cursor: pointer; padding: var(--spacing-lg); border-radius: var(--radius-lg); border: 1px solid var(--color-border-light); background: var(--color-bg-card); display: flex; flex-direction: column; gap: var(--spacing-sm); min-height: 200px; transition: border-color var(--transition-normal), box-shadow var(--transition-normal); }
.feature-card:hover { border-color: var(--color-gold-border); box-shadow: var(--shadow-gold); }
.feature-icon-wrap { width: 48px; height: 48px; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; background: var(--color-gold-bg); color: var(--color-gold); }
.feature-title { font-family: var(--font-display); font-size: var(--font-size-base); font-weight: 600; color: var(--color-text-primary); }
.feature-desc { font-size: var(--font-size-sm); color: var(--color-text-secondary); line-height: 1.5; flex: 1; }
.feature-link { display: inline-flex; align-items: center; gap: 4px; font-size: var(--font-size-xs); color: var(--color-gold); margin-top: auto; }
.home-steps { padding: var(--spacing-2xl) 0; background: var(--color-bg-card); border-block: 1px solid var(--color-border-light); }
.steps-inner { display: grid; grid-template-columns: minmax(240px, 1fr) minmax(280px, 1.2fr); gap: var(--spacing-2xl); align-items: start; max-width: 960px; margin: 0 auto; }
.steps-copy .section-title { margin-bottom: var(--spacing-sm); }
.steps-intro { color: var(--color-text-secondary); line-height: 1.7; margin-top: var(--spacing-md); max-width: 36ch; }
.steps-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: var(--spacing-md); }
.step-item { display: flex; gap: var(--spacing-md); padding: var(--spacing-md) var(--spacing-lg); border-radius: var(--radius-md); border: 1px solid var(--color-border-light); background: var(--color-bg-primary); }
.step-num { flex-shrink: 0; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: var(--font-size-sm); color: var(--color-bg-deep); background: linear-gradient(135deg, var(--color-gold-dark), var(--color-gold)); }
.step-item h3 { font-size: var(--font-size-base); font-weight: 600; color: var(--color-text-primary); margin-bottom: 4px; }
.step-item p { font-size: var(--font-size-sm); color: var(--color-text-secondary); line-height: 1.5; margin: 0; }
.home-stats { padding: var(--spacing-xl) 0; }
.stats-row { display: flex; justify-content: center; flex-wrap: wrap; gap: var(--spacing-lg); max-width: 800px; margin: 0 auto; }
.stat-block { flex: 1; min-width: 120px; text-align: center; padding: var(--spacing-md) var(--spacing-lg); border-radius: var(--radius-md); border: 1px solid var(--color-border-light); background: var(--color-bg-card); }
.stat-num { display: block; font-family: var(--font-display); font-size: var(--font-size-2xl); font-weight: 700; color: var(--color-gold); margin-bottom: 4px; }
.stat-block .stat-label { font-size: var(--font-size-xs); color: var(--color-text-muted); letter-spacing: 0.06em; }
.quick-label { flex-shrink: 0; font-size: var(--font-size-sm); color: var(--color-text-muted); letter-spacing: 0.08em; text-transform: uppercase; padding-top: 6px; }
.quick-chips { display: flex; flex-wrap: wrap; gap: var(--spacing-sm); }
.chip-btn { cursor: pointer; font: inherit; font-size: var(--font-size-sm); padding: 6px 14px; border-radius: var(--radius-full); border: 1px solid var(--color-border-light); background: var(--color-bg-card); color: var(--color-text-secondary); transition: border-color var(--transition-fast), color var(--transition-fast), box-shadow var(--transition-fast); }
.chip-btn:hover { border-color: var(--color-gold-border); color: var(--color-gold); box-shadow: var(--shadow-sm); }
.section-eyebrow { font-family: var(--font-display); font-size: 11px; color: var(--color-gold); letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: var(--spacing-sm); display: inline-block; }
@media (max-width: 1024px) { .features-grid { grid-template-columns: repeat(3, 1fr); } .steps-inner { grid-template-columns: 1fr; } }
@media (max-width: 768px) { .features-grid { grid-template-columns: repeat(2, 1fr); } }
</style>
