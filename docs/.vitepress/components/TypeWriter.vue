<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'

const props = withDefaults(defineProps<{
  texts: string[]
  typeSpeed?: number
  deleteSpeed?: number
  pauseDuration?: number
}>(), {
  typeSpeed: 100,
  deleteSpeed: 50,
  pauseDuration: 2000
})

const displayText = ref('')
const currentIndex = ref(0)
const isTyping = ref(true)
const isPaused = ref(false)
let timeoutId: ReturnType<typeof setTimeout> | null = null
const isClient = typeof window !== 'undefined'

const currentFullText = computed(() => props.texts[currentIndex.value] || '')

const type = () => {
  if (!isClient) return
  const full = currentFullText.value

  if (isTyping.value) {
    if (displayText.value.length < full.length) {
      displayText.value = full.slice(0, displayText.value.length + 1)
      timeoutId = setTimeout(type, props.typeSpeed)
    } else {
      // Finished typing, pause then start deleting
      isPaused.value = true
      timeoutId = setTimeout(() => {
        isPaused.value = false
        isTyping.value = false
        type()
      }, props.pauseDuration)
    }
  } else {
    // Deleting
    if (displayText.value.length > 0) {
      displayText.value = displayText.value.slice(0, -1)
      timeoutId = setTimeout(type, props.deleteSpeed)
    } else {
      // Move to next text
      isTyping.value = true
      currentIndex.value = (currentIndex.value + 1) % props.texts.length
      timeoutId = setTimeout(type, 300)
    }
  }
}

onMounted(() => {
  if (!isClient) return
  type()
})

onUnmounted(() => {
  if (timeoutId) clearTimeout(timeoutId)
})
</script>

<template>
  <span class="typewriter">
    <span class="typewriter-text">{{ displayText }}</span>
    <span class="typewriter-cursor" :class="{ paused: isPaused }">|</span>
  </span>
</template>

<style scoped>
.typewriter {
  display: inline;
}

.typewriter-text {
  color: inherit;
}

.typewriter-cursor {
  display: inline-block;
  margin-left: 2px;
  color: var(--vp-c-brand-1);
  font-weight: 300;
  animation: cursor-blink 1s step-end infinite;
}

.typewriter-cursor.paused {
  animation: cursor-blink 0.7s step-end infinite;
}

@keyframes cursor-blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
</style>
