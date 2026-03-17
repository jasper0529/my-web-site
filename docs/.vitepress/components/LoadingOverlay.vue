<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vitepress'

const route = useRoute()
const isLoading = ref(false)
let timeoutId: ReturnType<typeof setTimeout> | null = null
const isClient = typeof window !== 'undefined'

// 监听路由变化
const handleRouteChange = () => {
  // 显示加载动画
  isLoading.value = true
  
  // 清除之前的定时器
  if (timeoutId) {
    clearTimeout(timeoutId)
  }
  
  // 最小显示时间，避免闪烁
  timeoutId = setTimeout(() => {
    isLoading.value = false
  }, 300)
}

// 监听路由变化
onMounted(() => {
  // 监听链接点击
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement
    const link = target.closest('a')
    
    if (link) {
      const href = link.getAttribute('href')
      // 只处理内部链接
      if (href && href.startsWith('/') && !href.startsWith('//')) {
        handleRouteChange()
      }
    }
  })
  
  if (!isClient) return
  // 监听页面加载完成
  window.addEventListener('load', () => {
    isLoading.value = false
  })
})

onUnmounted(() => {
  if (timeoutId) {
    clearTimeout(timeoutId)
  }
})
</script>

<template>
  <Transition name="loading-fade">
    <div v-if="isLoading" class="loading-overlay">
      <div class="loading-spinner">
        <div class="spinner"></div>
        <span class="loading-text">加载中...</span>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 9999;
  display: flex;
  justify-content: center;
  padding-top: 80px;
  pointer-events: none;
}

.loading-spinner {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.25rem;
  background: var(--vp-c-bg);
  border-radius: 50px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  border: 1px solid var(--vp-c-divider);
}

.spinner {
  width: 18px;
  height: 18px;
  border: 2px solid var(--vp-c-divider);
  border-top-color: var(--vp-c-brand-1);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.loading-text {
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
  white-space: nowrap;
}

/* 过渡动画 */
.loading-fade-enter-active,
.loading-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.loading-fade-enter-from,
.loading-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* 深色模式优化 */
.dark .loading-spinner {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
}
</style>
