<template>
  <div class="loading-spinner" v-if="visible">
    <div class="spinner">
      <div class="earth"></div>
      <div class="orbit"></div>
    </div>
    <p class="text">{{ text }}</p>
  </div>
</template>

<script setup>
defineProps({
  visible: {
    type: Boolean,
    default: true
  },
  text: {
    type: String,
    default: '正在加载地球...'
  }
})
</script>

<style scoped>
.loading-spinner {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--color-bg-deep);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.loading-spinner::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 60% 50% at 50% -10%, rgba(200, 169, 81, 0.08), transparent),
    radial-gradient(ellipse 40% 60% at 10% 80%, rgba(13, 148, 136, 0.06), transparent);
  pointer-events: none;
}

.spinner {
  position: relative;
  width: 100px;
  height: 100px;
}

.earth {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--color-teal-light) 0%, var(--color-teal-dark) 50%, var(--color-bg-secondary) 100%);
  box-shadow:
    0 0 20px rgba(13, 148, 136, 0.4),
    inset -10px -10px 20px rgba(0, 0, 0, 0.4),
    inset 10px 10px 20px rgba(200, 169, 81, 0.1);
  animation: rotate 3s linear infinite;
}

.earth::before {
  content: '';
  position: absolute;
  top: 20%;
  left: 20%;
  width: 60%;
  height: 25%;
  background: linear-gradient(90deg, transparent 20%, rgba(200, 169, 81, 0.4) 30%, rgba(200, 169, 81, 0.4) 50%, transparent 60%);
  border-radius: 50%;
}

.earth::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 10%;
  width: 40%;
  height: 20%;
  background: linear-gradient(90deg, transparent, rgba(200, 169, 81, 0.3), transparent);
  border-radius: 50%;
}

.orbit {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80px;
  height: 80px;
  border: 2px dashed rgba(200, 169, 81, 0.25);
  border-radius: 50%;
  animation: orbit 4s linear infinite;
}

.orbit::before {
  content: '';
  position: absolute;
  top: -5px;
  left: 50%;
  transform: translateX(-50%);
  width: 10px;
  height: 10px;
  background: var(--color-gold);
  border-radius: 50%;
  box-shadow: 0 0 10px var(--color-gold);
}

@keyframes rotate {
  from { transform: translate(-50%, -50%) rotate(0deg); }
  to { transform: translate(-50%, -50%) rotate(360deg); }
}

@keyframes orbit {
  from { transform: translate(-50%, -50%) rotate(0deg); }
  to { transform: translate(-50%, -50%) rotate(360deg); }
}

.text {
  margin-top: 30px;
  color: var(--color-text-secondary);
  font-size: var(--font-size-base);
  font-family: var(--font-display);
  letter-spacing: 0.1em;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
}
</style>