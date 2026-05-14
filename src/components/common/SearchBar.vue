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
        <el-icon><Search /></el-icon>
      </template>
      <template #append>
        <el-button @click="handleSearch">
          <el-icon><Search /></el-icon>
          搜索
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
    default: '搜索景点、攻略...',
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

.search-bar :deep(.el-input__wrapper) {
  border-radius: var(--radius-xl) 0 0 var(--radius-xl);
  padding: 4px 4px 4px 16px;
  box-shadow: var(--shadow-md);
  border: 2px solid transparent;
  transition: all var(--transition-normal);
}

.search-bar.focused :deep(.el-input__wrapper) {
  border-color: var(--color-primary-light);
  box-shadow: var(--shadow-lg), 0 0 0 4px var(--color-primary-bg);
}

.search-bar :deep(.el-input-group__append) {
  border-radius: 0 var(--radius-xl) var(--radius-xl) 0;
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
  border: none;
  padding: 0;
  overflow: hidden;
  box-shadow: var(--shadow-md);
}

.search-bar :deep(.el-input-group__append .el-button) {
  border: none;
  background: transparent;
  color: #fff;
  height: 100%;
  padding: 0 24px;
  margin: 0;
  border-radius: 0;
  font-weight: 600;
}

.search-bar :deep(.el-input-group__append .el-button:hover) {
  background: rgba(255, 255, 255, 0.15);
}
</style>
