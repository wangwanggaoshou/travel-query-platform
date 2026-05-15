<template>
  <div class="search-bar" :class="{ focused: isFocused }">
    <el-input
      v-model="keyword"
      :placeholder="placeholder"
      size="large"
      clearable
      @focus="isFocused = true"
      @blur="isFocused = false"
      @keyup.enter="handleSearch"
    >
      <template #prefix>
        <el-icon :color="isFocused ? '#c8a951' : '#6b6560'"><Search /></el-icon>
      </template>
      <template #append>
        <el-button class="search-btn" @click="handleSearch">
          <el-icon><Search /></el-icon>
          探索
        </el-button>
      </template>
    </el-input>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  placeholder: {
    type: String,
    default: '搜索目的地、景点、游记…',
  },
  modelValue: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update:modelValue', 'search'])

const keyword = ref(props.modelValue)
const isFocused = ref(false)

function handleSearch() {
  emit('update:modelValue', keyword.value)
  emit('search', keyword.value)
}
</script>

<style scoped>
.search-bar {
  max-width: 640px;
  margin: 0 auto;
  transition: transform var(--transition-normal);
}

.search-bar.focused {
  transform: scale(1.02);
}

/* 深色玻璃态输入框 */
.search-bar :deep(.el-input__wrapper) {
  border-radius: var(--radius-xl) 0 0 var(--radius-xl);
  padding: 6px 6px 6px 18px;
  background: rgba(26, 34, 54, 0.85);
  backdrop-filter: blur(12px);
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-md);
  transition: all var(--transition-normal);
}

.search-bar :deep(.el-input__inner) {
  color: var(--color-text-primary);
}

.search-bar :deep(.el-input__inner::placeholder) {
  color: var(--color-text-muted);
}

.search-bar.focused :deep(.el-input__wrapper) {
  border-color: var(--color-gold);
  box-shadow: 0 0 0 1px var(--color-gold), 0 0 0 4px var(--color-gold-bg), var(--shadow-lg);
}

/* 金色搜索按钮 */
.search-bar :deep(.el-input-group__append) {
  border-radius: 0 var(--radius-xl) var(--radius-xl) 0;
  background: linear-gradient(135deg, var(--color-gold-dark), var(--color-gold));
  border: none;
  padding: 0;
  overflow: hidden;
  box-shadow: var(--shadow-gold);
}

.search-btn {
  border: none !important;
  background: transparent !important;
  color: var(--color-bg-deep) !important;
  height: 100%;
  padding: 0 28px;
  margin: 0;
  border-radius: 0;
  font-weight: 600;
  letter-spacing: 0.03em;
  font-family: var(--font-display);
}

.search-btn:hover {
  background: rgba(0, 0, 0, 0.08) !important;
}
</style>
