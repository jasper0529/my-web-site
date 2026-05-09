<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'

const isVisible = ref(false)
const scrollPercent = ref(0)
const scrollThreshold = 300
const isClient = typeof window !== 'undefined'
let ticking = false

// 使用 requestAnimationFrame 节流滚动事件
const handleScroll = () => {
  if (!isClient) return
  if (ticking) return
  ticking = true
  requestAnimationFrame(() => {
    const scrollTop = window.scrollY
    const docHeight = document.documentElement.scrollHeight - window.innerHeight
    isVisible.value = scrollTop > scrollThreshold
    if (docHeight > 0) {
      scrollPercent.value = Math.min(100, Math.max(0, Math.round((scrollTop / docHeight) * 100)))
    }
    ticking = false
  })
}

const scrollToTop = () => {
  if (!isClient) return
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

const percentDisplay = computed(() => {
  if (scrollPercent.value >= 100) return '✓'
  return `${scrollPercent.value}%`
})
</script>

<template>
  <Transition name="fade">
    <button
      v-show="isVisible"
      class="back-to-top"
      :class="{ 'is-complete': scrollPercent >= 100 }"
      @click="scrollToTop"
      aria-label="返回顶部"
    >
      <svg class="btt-ring" viewBox="0 0 48 48">
        <circle class="btt-ring-bg" cx="24" cy="24" r="20" fill="none" stroke-width="2.5" />
        <circle
          class="btt-ring-progress"
          cx="24" cy="24" r="20"
          fill="none"
          stroke-width="2.5"
          :stroke-dasharray="`${scrollPercent * 1.2566} 125.66`"
          stroke-linecap="round"
        />
      </svg>
      <span class="btt-percent">{{ percentDisplay }}</span>
      <svg class="btt-arrow" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="18 15 12 9 6 15"></polyline>
      </svg>
    </button>
  </Transition>
</template>

<style scoped>
.back-to-top {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(37, 99, 235, 0.15);
  border-radius: 50%;
  color: var(--vp-c-brand-1);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(255, 255, 255, 0.1) inset;
  transition: all 0.3s ease;
  z-index: 999;
  overflow: hidden;
}

.back-to-top:hover {
  background: rgba(255, 255, 255, 0.85);
  border-color: var(--vp-c-brand-1);
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(37, 99, 235, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.2) inset;
}

.back-to-top:active {
  transform: translateY(-1px);
}

/* 进度环 */
.btt-ring {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.btt-ring-bg {
  stroke: rgba(37, 99, 235, 0.1);
}

.btt-ring-progress {
  stroke: var(--vp-c-brand-1);
  transition: stroke-dasharray 0.15s ease-out;
}

/* 百分比文字 */
.btt-percent {
  position: relative;
  font-size: 0.65rem;
  font-weight: 700;
  line-height: 1;
  color: var(--vp-c-brand-1);
  letter-spacing: -0.02em;
  z-index: 1;
}

/* 箭头（完成时显示） */
.btt-arrow {
  position: absolute;
  opacity: 0;
  transform: translateY(4px);
  transition: all 0.3s ease;
  z-index: 1;
}

.back-to-top.is-complete .btt-percent {
  opacity: 0;
  transform: translateY(-4px);
  transition: all 0.3s ease;
}

.back-to-top.is-complete .btt-arrow {
  opacity: 1;
  transform: translateY(0);
}

/* 呼吸动画 */
.back-to-top.is-complete {
  animation: breathe 2.5s ease-in-out infinite;
}

@keyframes breathe {
  0%, 100% {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(255, 255, 255, 0.1) inset;
  }
  50% {
    box-shadow: 0 4px 16px rgba(37, 99, 235, 0.2), 0 0 12px rgba(37, 99, 235, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.1) inset;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

@media (max-width: 640px) {
  .back-to-top {
    bottom: 1.5rem;
    right: 1.5rem;
    width: 40px;
    height: 40px;
  }
  .btt-percent {
    font-size: 0.55rem;
  }
}
</style>

<style>
/* 暗色模式适配 */
.dark .back-to-top {
  background: rgba(15, 23, 42, 0.7);
  border-color: rgba(59, 130, 246, 0.2);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(59, 130, 246, 0.1) inset;
}

.dark .back-to-top:hover {
  background: rgba(15, 23, 42, 0.85);
  border-color: rgba(59, 130, 246, 0.4);
  box-shadow: 0 8px 24px rgba(59, 130, 246, 0.2), 0 0 0 1px rgba(59, 130, 246, 0.15) inset;
}

.dark .btt-ring-bg {
  stroke: rgba(59, 130, 246, 0.15);
}

.dark .back-to-top.is-complete {
  animation: breathe-dark 2.5s ease-in-out infinite;
}

@keyframes breathe-dark {
  0%, 100% {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(59, 130, 246, 0.1) inset;
  }
  50% {
    box-shadow: 0 4px 16px rgba(59, 130, 246, 0.25), 0 0 12px rgba(59, 130, 246, 0.15), 0 0 0 1px rgba(59, 130, 246, 0.1) inset;
  }
}
</style>
