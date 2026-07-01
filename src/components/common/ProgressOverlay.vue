<template>
  <Teleport to="body">
    <Transition name="progress-fade">
      <div v-if="visible" class="progress-overlay">
        <!-- 背景装饰光晕 -->
        <div class="progress-bg-glow"></div>

        <div class="progress-card">
          <!-- 标题 -->
          <div class="progress-header">
            <div class="progress-icon">
              <svg viewBox="0 0 40 40" class="icon-sparkle">
                <path
                  d="M20 4 L22 16 L34 18 L22 20 L20 32 L18 20 L6 18 L18 16 Z"
                  fill="currentColor"
                  opacity="0.9"
                >
                  <animate
                    attributeName="opacity"
                    values="0.4;1;0.4"
                    dur="1.5s"
                    repeatCount="indefinite"
                  />
                </path>
              </svg>
            </div>
            <h3 class="progress-title">{{ title }}</h3>
          </div>

          <!-- 进度条 -->
          <div class="progress-bar-wrap">
            <div class="progress-bar-track">
              <div
                class="progress-bar-fill"
                :style="{ width: progressPercent + '%' }"
              ></div>
              <div
                class="progress-bar-glow"
                :style="{ left: progressPercent + '%' }"
              ></div>
            </div>
            <span class="progress-percent">{{ Math.round(progressPercent) }}%</span>
          </div>

          <!-- 步骤列表 -->
          <div class="progress-steps">
            <div
              v-for="(step, idx) in steps"
              :key="idx"
              class="progress-step"
              :class="{
                'is-done': idx < currentStep,
                'is-active': idx === currentStep,
                'is-pending': idx > currentStep,
              }"
            >
              <!-- 步骤图标 -->
              <div class="step-dot">
                <el-icon v-if="idx < currentStep" class="step-icon-done">
                  <CircleCheck />
                </el-icon>
                <span v-else-if="idx === currentStep" class="step-loading">
                  <span class="step-pulse"></span>
                </span>
                <span v-else class="step-idle">{{ idx + 1 }}</span>
              </div>

              <!-- 步骤文字 -->
              <span class="step-label">{{ step.label }}</span>

              <!-- 连接线 -->
              <div v-if="idx < steps.length - 1" class="step-connector" :class="{ done: idx < currentStep }"></div>
            </div>
          </div>

          <!-- 底部提示 -->
          <p class="progress-footer">{{ footerText }}</p>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, onUnmounted } from 'vue'
import { CircleCheck } from '@element-plus/icons-vue'

const props = defineProps({
  visible: { type: Boolean, default: false },
  title: { type: String, default: 'AI 处理中' },
  steps: {
    type: Array,
    default: () => [
      { label: '正在联网搜索...', duration: 2000 },
      { label: 'AI 分析候选中...', duration: 3000 },
      { label: '正在发现景点数据...', duration: 4000 },
      { label: 'AI 生成行程预案...', duration: 4000 },
    ],
  },
  // 外部可手动控制进度百分比（来自真实后端进度）
  externalProgress: { type: Number, default: -1 },
})

const currentStep = ref(0)
const stepProgress = ref(0)
let stepTimer = null
let frameId = null

const progressPercent = computed(() => {
  // 优先使用外部进度
  if (props.externalProgress >= 0) return props.externalProgress

  const totalSteps = props.steps.length
  if (totalSteps === 0) return 100

  // 已完成步骤的进度
  const basePercent = (currentStep.value / totalSteps) * 100
  // 当前步骤内的进度
  const currentPercent = stepProgress.value * (100 / totalSteps)

  return Math.min(basePercent + currentPercent, 100)
})

const footerText = computed(() => {
  const total = props.steps.length
  if (currentStep.value >= total) return '即将完成...'
  return `步骤 ${currentStep.value + 1} / ${total}`
})

function resetAndStart() {
  stopTimers()
  currentStep.value = 0
  stepProgress.value = 0
  if (props.steps.length > 0) {
    animateCurrentStep()
  }
}

function animateCurrentStep() {
  const total = props.steps.length
  if (currentStep.value >= total) return

  const duration = props.steps[currentStep.value]?.duration || 2000
  const startTime = performance.now()

  function tick(now) {
    const elapsed = now - startTime
    const pct = Math.min(elapsed / duration, 1)
    stepProgress.value = pct

    if (pct >= 1) {
      stepProgress.value = 1
      currentStep.value++
      if (currentStep.value < total) {
        stepProgress.value = 0
        animateCurrentStep()
      }
    } else {
      frameId = requestAnimationFrame(tick)
    }
  }

  frameId = requestAnimationFrame(tick)
}

function stopTimers() {
  if (frameId) {
    cancelAnimationFrame(frameId)
    frameId = null
  }
  if (stepTimer) {
    clearTimeout(stepTimer)
    stepTimer = null
  }
}

// 外部可调用：强制跳到某一步
function jumpTo(stepIndex, progress = 0) {
  currentStep.value = Math.max(0, Math.min(stepIndex, props.steps.length))
  stepProgress.value = Math.max(0, Math.min(progress, 1))
  stopTimers()
}

// 外部可调用：立即完成
function finish() {
  stopTimers()
  currentStep.value = props.steps.length
  stepProgress.value = 1
}

defineExpose({ jumpTo, finish, resetAndStart })

watch(
  () => props.visible,
  (v) => {
    if (v) resetAndStart()
    else stopTimers()
  },
  { immediate: true }
)

watch(
  () => props.externalProgress,
  (pct) => {
    if (pct >= 0 && pct < 100) {
      stopTimers()
      const total = props.steps.length
      const stepSpan = 100 / total
      currentStep.value = Math.min(Math.floor(pct / stepSpan), total - 1)
      stepProgress.value = (pct % stepSpan) / stepSpan
    } else if (pct >= 100) {
      finish()
    }
  }
)

onUnmounted(stopTimers)
</script>

<style scoped>
.progress-overlay {
  position: fixed;
  inset: 0;
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(10, 15, 26, 0.88);
  backdrop-filter: blur(12px);
}

.progress-bg-glow {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 50% 40% at 50% 30%, rgba(200, 169, 81, 0.06), transparent),
    radial-gradient(ellipse 30% 50% at 20% 70%, rgba(13, 148, 136, 0.04), transparent);
  pointer-events: none;
}

/* ---- 卡片 ---- */
.progress-card {
  position: relative;
  width: 480px;
  max-width: 90vw;
  padding: 36px 40px;
  background: var(--color-bg-card);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg), 0 0 60px rgba(200, 169, 81, 0.06);
}

/* ---- 标题 ---- */
.progress-header {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 28px;
}

.progress-icon {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-sm);
  background: linear-gradient(135deg, rgba(200, 169, 81, 0.15), rgba(200, 169, 81, 0.05));
  color: var(--color-gold);
}

.icon-sparkle {
  width: 24px;
  height: 24px;
}

.progress-title {
  font-family: var(--font-display);
  font-size: var(--font-size-lg);
  font-weight: 700;
  color: var(--color-text-primary);
  letter-spacing: 0.02em;
}

/* ---- 进度条 ---- */
.progress-bar-wrap {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 30px;
}

.progress-bar-track {
  flex: 1;
  height: 6px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 3px;
  overflow: visible;
  position: relative;
}

.progress-bar-fill {
  height: 100%;
  border-radius: 3px;
  background: linear-gradient(
    90deg,
    var(--color-teal),
    var(--color-teal-light) 50%,
    var(--color-gold) 100%
  );
  transition: width 0.15s linear;
  position: relative;
}

.progress-bar-glow {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--color-gold);
  box-shadow: 0 0 12px var(--color-gold), 0 0 24px rgba(200, 169, 81, 0.4);
  transition: left 0.15s linear;
}

.progress-percent {
  font-family: var(--font-display);
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--color-gold);
  min-width: 40px;
  text-align: right;
}

/* ---- 步骤 ---- */
.progress-steps {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.progress-step {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 10px 0;
  position: relative;
}

/* ---- 步骤图标 ---- */
.step-dot {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: var(--font-size-xs);
  font-weight: 700;
  font-family: var(--font-display);
  transition: all 0.35s ease;
  z-index: 1;
}

.is-done .step-dot {
  background: var(--color-teal);
  color: #fff;
  box-shadow: 0 0 8px rgba(13, 148, 136, 0.4);
}

.is-active .step-dot {
  background: transparent;
  border: 2px solid var(--color-gold);
  box-shadow: 0 0 12px rgba(200, 169, 81, 0.3);
}

.is-pending .step-dot {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: var(--color-text-muted);
}

.step-icon-done {
  font-size: var(--font-size-base);
}

/* 活跃脉冲 */
.step-pulse {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--color-gold);
  animation: dot-pulse 1.2s ease-in-out infinite;
}

@keyframes dot-pulse {
  0%, 100% { opacity: 0.4; transform: scale(0.8); }
  50% { opacity: 1; transform: scale(1.3); }
}

/* ---- 步骤文字 ---- */
.step-label {
  font-size: var(--font-size-sm);
  font-weight: 500;
  transition: color 0.35s ease;
}

.is-done .step-label {
  color: var(--color-text-muted);
}

.is-active .step-label {
  color: var(--color-text-primary);
  font-weight: 600;
}

.is-pending .step-label {
  color: rgba(255, 255, 255, 0.25);
}

/* ---- 连接线 ---- */
.step-connector {
  position: absolute;
  left: 15px;
  top: 42px;
  width: 2px;
  height: calc(100% - 10px);
  background: rgba(255, 255, 255, 0.06);
  transition: background 0.5s ease;
}

.step-connector.done {
  background: rgba(13, 148, 136, 0.35);
}

/* ---- 底部 ---- */
.progress-footer {
  margin-top: 24px;
  text-align: center;
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
  letter-spacing: 0.04em;
}

/* ---- 过渡动画 ---- */
.progress-fade-enter-active {
  transition: opacity 0.3s ease;
}

.progress-fade-leave-active {
  transition: opacity 0.35s ease;
}

.progress-fade-enter-from,
.progress-fade-leave-to {
  opacity: 0;
}

/* ---- 响应式 ---- */
@media (max-width: 520px) {
  .progress-card {
    padding: 28px 24px;
  }
}
</style>
