<template>
  <div class="home-page">
    <!-- Hero Banner -->
    <HeroBanner />

    <!-- 搜索区域 -->
    <section class="search-section">
      <div class="container">
        <SearchBar
          v-model="searchKeyword"
          placeholder="搜索景点、目的地、旅游攻略..."
          @search="handleSearch"
        />
      </div>
    </section>

    <!-- 热门景点 -->
    <HotScenic :scenic-list="hotScenicList" />

    <!-- 推荐攻略 -->
    <RecommendGuide :guide-list="recommendGuides" />


  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import HeroBanner from '@/components/home/HeroBanner.vue'
import HotScenic from '@/components/home/HotScenic.vue'
import RecommendGuide from '@/components/home/RecommendGuide.vue'
import SearchBar from '@/components/common/SearchBar.vue'

const router = useRouter()
const searchKeyword = ref('')
const hotScenicList = ref([])
const recommendGuides = ref([])



function handleSearch(keyword) {
  router.push({ path: '/scenic', query: { keyword } })
}

onMounted(() => {
  // TODO: 从API获取热门景点和推荐攻略
})
</script>

<style scoped>
.search-section {
  margin-top: -30px;
  position: relative;
  z-index: 10;
  padding: 0 0 var(--spacing-xl);
}


</style>
