<template>
  <div class="scenic-gallery">
    <div class="gallery-main" @click="showViewer = true">
      <img :src="images[activeIndex]" :alt="'景点图片'" />
      <div class="gallery-count">
        <el-icon><Picture /></el-icon>
        {{ activeIndex + 1 }}/{{ images.length }}
      </div>
    </div>
    <div class="gallery-thumbs" v-if="images.length > 1">
      <div
        v-for="(img, index) in images"
        :key="index"
        class="thumb-item"
        :class="{ active: activeIndex === index }"
        @click="activeIndex = index"
      >
        <img :src="img" :alt="`缩略图 ${index + 1}`" />
      </div>
    </div>

    <!-- 图片查看器 -->
    <el-image-viewer
      v-if="showViewer"
      :url-list="images"
      :initial-index="activeIndex"
      @close="showViewer = false"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  images: {
    type: Array,
    default: () => [],
  },
})

const activeIndex = ref(0)
const showViewer = ref(false)
</script>

<style scoped>
.scenic-gallery {
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.gallery-main {
  position: relative;
  height: 400px;
  cursor: pointer;
  overflow: hidden;
  border-radius: var(--radius-lg);
}

.gallery-main img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-slow);
}

.gallery-main:hover img {
  transform: scale(1.03);
}

.gallery-count {
  position: absolute;
  bottom: 16px;
  right: 16px;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  color: #fff;
  padding: 6px 14px;
  border-radius: var(--radius-full);
  font-size: var(--font-size-sm);
  display: flex;
  align-items: center;
  gap: 6px;
}

.gallery-thumbs {
  display: flex;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-sm);
  overflow-x: auto;
}

.thumb-item {
  width: 80px;
  height: 60px;
  border-radius: var(--radius-sm);
  overflow: hidden;
  cursor: pointer;
  flex-shrink: 0;
  border: 2px solid transparent;
  transition: border-color var(--transition-fast);
}

.thumb-item.active {
  border-color: var(--color-primary);
}

.thumb-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
