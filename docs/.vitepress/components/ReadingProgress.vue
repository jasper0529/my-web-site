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
      <div class="progress-bar"></div>
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
  height: 100%;
  width: var(--progress);
  background: linear-gradient(90deg, #2563EB 0%, #3B82F6 100%);
  transition: width 0.1s ease-out;
  box-shadow: 0 0 10px rgba(37, 99, 235, 0.5);
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
  background: linear-gradient(90deg, #3B82F6 0%, #60A5FA 100%);
  box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
}
</style>
