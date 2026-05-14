<template>
  <section class="hero-banner">
    <el-carousel height="520px" :interval="5000" arrow="always" indicator-position="outside">
      <el-carousel-item v-for="(item, index) in banners" :key="index">
        <div class="banner-slide" :style="{ background: item.gradient }">
          <div class="container banner-content">
            <div class="banner-text">
              <h1 class="banner-title">{{ item.title }}</h1>
              <p class="banner-desc">{{ item.description }}</p>
              <el-button type="primary" size="large" round @click="$router.push(item.link)">
                {{ item.buttonText }}
                <el-icon class="el-icon--right"><ArrowRight /></el-icon>
              </el-button>
            </div>
          </div>
        </div>
      </el-carousel-item>
    </el-carousel>
  </section>
</template>

<script setup>
import { ref } from 'vue'

const banners = ref([
  {
    title: '探索世界的美好',
    description: '汇聚全球热门景点信息，为您提供最全面的旅游查询服务',
    gradient: 'linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)',
    buttonText: '开始探索',
    link: '/scenic',
  },
  {
    title: '智能旅行建议',
    description: '基于您的旅游偏好和签证信息，为您推荐最合适的目的地',
    gradient: 'linear-gradient(135deg, #10b981 0%, #0ea5e9 100%)',
    buttonText: '获取推荐',
    link: '/recommend',
  },
  {
    title: '真实评价汇聚',
    description: '聚合多平台真实评论，让您做出更明智的旅行决策',
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
    buttonText: '查看攻略',
    link: '/guide',
  },
])
</script>

<style scoped>
.hero-banner {
  margin-bottom: var(--spacing-2xl);
}

.banner-slide {
  height: 100%;
  display: flex;
  align-items: center;
}

.banner-content {
  color: #ffffff;
}

.banner-text {
  max-width: 600px;
}

.banner-title {
  font-size: 48px;
  font-weight: 800;
  margin-bottom: var(--spacing-md);
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.banner-desc {
  font-size: var(--font-size-lg);
  opacity: 0.9;
  margin-bottom: var(--spacing-xl);
  line-height: 1.8;
}

@media (max-width: 768px) {
  .banner-title {
    font-size: 28px;
  }
  .banner-desc {
    font-size: var(--font-size-base);
  }
}
</style>
