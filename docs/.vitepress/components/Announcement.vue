<script setup lang="ts">
import { ref, onMounted } from 'vue'

const props = defineProps<{
  message?: string
  type?: 'info' | 'warning' | 'success' | 'error'
  id?: string
}>()

const isVisible = ref(false)
const announcementId = props.id || 'default-announcement'

// 检查是否已经关闭过
onMounted(() => {
  if (typeof localStorage !== 'undefined') {
    const dismissed = localStorage.getItem(`announcement-dismissed-${announcementId}`)
    if (dismissed !== 'true') {
      // 延迟显示，增加动画效果
      setTimeout(() => {
        isVisible.value = true
      }, 1000)
    }
  } else {
    isVisible.value = true
  }
})

const dismiss = () => {
  isVisible.value = false
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(`announcement-dismissed-${announcementId}`, 'true')
  }
}

const typeClass = props.type || 'info'
</script>

<template>
  <Transition name="announcement-slide">
    <div 
      v-if="isVisible && message" 
      class="announcement-card"
      :class="[`announcement-${typeClass}`]"
    >
      <div class="announcement-header">
        <span class="announcement-icon">
          <svg v-if="type === 'info'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
          <svg v-else-if="type === 'warning'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
          <svg v-else-if="type === 'success'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          <svg v-else-if="type === 'error'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
        </span>
        <span class="announcement-title">公告</span>
        <button 
          class="announcement-close"
          @click="dismiss"
          aria-label="关闭公告"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      <div class="announcement-body">
        <span class="announcement-text" v-html="message"></span>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.announcement-card {
  position: fixed;
  right: 20px;
  bottom: 80px;
  width: 320px;
  max-width: calc(100vw - 40px);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  overflow: hidden;
  z-index: 9998;
  font-size: 14px;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.announcement-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.announcement-icon {
  display: flex;
  align-items: center;
}

.announcement-title {
  font-weight: 600;
  flex: 1;
}

.announcement-close {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  background: transparent;
  border: none;
  cursor: pointer;
  opacity: 0.6;
  transition: opacity 0.2s;
  border-radius: 4px;
}

.announcement-close:hover {
  opacity: 1;
  background: rgba(0, 0, 0, 0.1);
}

.announcement-body {
  padding: 12px 16px;
}

.announcement-text {
  line-height: 1.6;
}

.announcement-text :deep(a) {
  text-decoration: underline;
  font-weight: 500;
}

/* Info 样式 */
.announcement-info {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.95) 0%, rgba(37, 99, 235, 0.95) 100%);
  color: #fff;
}

.dark .announcement-info {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.9) 0%, rgba(37, 99, 235, 0.9) 100%);
}

/* Warning 样式 */
.announcement-warning {
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.95) 0%, rgba(217, 119, 6, 0.95) 100%);
  color: #fff;
}

.dark .announcement-warning {
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.9) 0%, rgba(217, 119, 6, 0.9) 100%);
}

/* Success 样式 */
.announcement-success {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.95) 0%, rgba(5, 150, 105, 0.95) 100%);
  color: #fff;
}

.dark .announcement-success {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.9) 0%, rgba(5, 150, 105, 0.9) 100%);
}

/* Error 样式 */
.announcement-error {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.95) 0%, rgba(220, 38, 38, 0.95) 100%);
  color: #fff;
}

.dark .announcement-error {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.9) 0%, rgba(220, 38, 38, 0.9) 100%);
}

/* 动画 */
.announcement-slide-enter-active,
.announcement-slide-leave-active {
  transition: all 0.3s ease;
}

.announcement-slide-enter-from,
.announcement-slide-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

/* 移动端适配 */
@media (max-width: 768px) {
  .announcement-card {
    right: 10px;
    bottom: 70px;
    width: calc(100vw - 20px);
    max-width: 300px;
  }
}
</style>
