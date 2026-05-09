<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { useData, useRoute } from 'vitepress'

const { frontmatter } = useData()
const route = useRoute()
const progress = ref(0)
const isClient = typeof window !== 'undefined'

// 判断是否显示进度条（排除首页）
const shouldShow = computed(() => {
  // 只在非首页显示
  return frontmatter.value.layout !== 'home' && route.path !== '/'
})

const updateProgress = () => {
  if (!isClient) return
  const scrollTop = window.scrollY
  const docHeight = document.documentElement.scrollHeight - window.innerHeight
  
  if (docHeight > 100) { // 确保页面内容足够长
    progress.value = Math.min(100, Math.max(0, (scrollTop / docHeight) * 100))
  }
}

// 监听页面变化
if (isClient) {
  watch(
    () => route.path,
    () => {
      progress.value = 0
      setTimeout(updateProgress, 100)
    }
  )
}

onMounted(() => {
  setTimeout(updateProgress, 100)
  if (!isClient) return
  window.addEventListener('scroll', updateProgress, { passive: true })
  window.addEventListener('resize', updateProgress, { passive: true })
})

onUnmounted(() => {
  if (!isClient) return
  window.removeEventListener('scroll', updateProgress)
  window.removeEventListener('resize', updateProgress)
})
</script>

<template>
  <Transition name="progress-fade">
    <div
      v-if="shouldShow"
      class="reading-progress"
      :style="{ '--progress': `${progress}%` }"
    >
      <div class="progress-bar">
        <div class="progress-glow-dot"></div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.reading-progress {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  z-index: 10000;
  background: transparent;
}

.progress-bar {
  position: relative;
  height: 100%;
  width: var(--progress);
  background: linear-gradient(90deg, #2563EB 0%, #7C3AED 50%, #EC4899 100%);
  transition: width 0.1s ease-out;
  box-shadow: 0 0 8px rgba(124, 58, 237, 0.4), 0 0 16px rgba(37, 99, 235, 0.2);
  border-radius: 0 2px 2px 0;
}

.progress-glow-dot {
  position: absolute;
  right: -4px;
  top: 50%;
  transform: translateY(-50%);
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #EC4899;
  box-shadow: 0 0 6px rgba(236, 72, 153, 0.8), 0 0 12px rgba(236, 72, 153, 0.4), 0 0 20px rgba(236, 72, 153, 0.2);
  animation: glow-pulse 1.5s ease-in-out infinite;
}

@keyframes glow-pulse {
  0%, 100% {
    box-shadow: 0 0 6px rgba(236, 72, 153, 0.8), 0 0 12px rgba(236, 72, 153, 0.4), 0 0 20px rgba(236, 72, 153, 0.2);
    transform: translateY(-50%) scale(1);
  }
  50% {
    box-shadow: 0 0 8px rgba(236, 72, 153, 1), 0 0 16px rgba(236, 72, 153, 0.6), 0 0 28px rgba(236, 72, 153, 0.3);
    transform: translateY(-50%) scale(1.2);
  }
}

.progress-fade-enter-active,
.progress-fade-leave-active {
  transition: opacity 0.3s ease;
}

.progress-fade-enter-from,
.progress-fade-leave-to {
  opacity: 0;
}
</style>

<style>
/* 深色模式适配 */
.dark .reading-progress .progress-bar {
  background: linear-gradient(90deg, #3B82F6 0%, #A78BFA 50%, #F472B6 100%);
  box-shadow: 0 0 8px rgba(167, 139, 250, 0.4), 0 0 16px rgba(59, 130, 246, 0.2);
}

.dark .reading-progress .progress-glow-dot {
  background: #F472B6;
  box-shadow: 0 0 6px rgba(244, 114, 182, 0.8), 0 0 12px rgba(244, 114, 182, 0.4), 0 0 20px rgba(244, 114, 182, 0.2);
}
</style>
