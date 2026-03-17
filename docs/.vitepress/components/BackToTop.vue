<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const isVisible = ref(false)
const scrollThreshold = 300
const isClient = typeof window !== 'undefined'

const handleScroll = () => {
  if (!isClient) return
  isVisible.value = window.scrollY > scrollThreshold
}

const scrollToTop = () => {
  if (!isClient) return
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

onMounted(() => {
  if (!isClient) return
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  if (!isClient) return
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <Transition name="fade">
    <button 
      v-show="isVisible" 
      class="back-to-top"
      @click="scrollToTop"
      aria-label="返回顶部"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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
  background: var(--vp-c-brand-1);
  border: none;
  border-radius: 50%;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  z-index: 999;
}

.back-to-top:hover {
  background: var(--vp-c-brand-2);
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

.back-to-top:active {
  transform: translateY(-1px);
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
}
</style>
