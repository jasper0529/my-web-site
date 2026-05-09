<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  title: string
  category?: string
}>()

/** Simple djb2 hash for deterministic color generation */
function hashStr(str: string): number {
  let hash = 5381
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash + str.charCodeAt(i)) & 0xffffffff
  }
  return Math.abs(hash)
}

/** Pre-defined gradient palettes – each entry is [angle, color1, color2, color3] */
const palettes: [number, string, string, string][] = [
  [135, '#667eea', '#764ba2', '#f093fb'],
  [135, '#f093fb', '#f5576c', '#fda085'],
  [135, '#4facfe', '#00f2fe', '#43e97b'],
  [135, '#43e97b', '#38f9d7', '#fa709a'],
  [135, '#a18cd1', '#fbc2eb', '#f6d365'],
  [135, '#ffecd2', '#fcb69f', '#ff9a9e'],
  [135, '#ff9a9e', '#fecfef', '#a1c4fd'],
  [135, '#a1c4fd', '#c2e9fb', '#d4fc79'],
  [135, '#d4fc79', '#96e6a1', '#667eea'],
  [135, '#f6d365', '#fda085', '#f093fb'],
  [135, '#89f7fe', '#66a6ff', '#764ba2'],
  [135, '#fddb92', '#d1fdff', '#4facfe'],
  [135, '#c3cfe2', '#f5f7fa', '#c3cfe2'],
  [135, '#e0c3fc', '#8ec5fc', '#667eea'],
  [135, '#f5576c', '#ff6a88', '#ffd194'],
  [135, '#667eea', '#764ba2', '#6a11cb'],
]

const gradient = computed(() => {
  const h = hashStr(props.title)
  const palette = palettes[h % palettes.length]
  const [angle, c1, c2, c3] = palette
  return `linear-gradient(${angle}deg, ${c1} 0%, ${c2} 50%, ${c3} 100%)`
})

/** Extract initials from title for display */
const initials = computed(() => {
  const words = props.title.replace(/[^\w\u4e00-\u9fff]/g, ' ').trim().split(/\s+/)
  if (words.length >= 2) {
    return words.slice(0, 2).map(w => w[0]).join('')
  }
  return props.title.slice(0, 2)
})
</script>

<template>
  <div class="cover-placeholder" :style="{ background: gradient }">
    <span class="cover-initials">{{ initials }}</span>
    <span v-if="category" class="cover-category">{{ category }}</span>
  </div>
</template>

<style scoped>
.cover-placeholder {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: var(--vp-border-radius-large, 8px) var(--vp-border-radius-large, 8px) 0 0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.cover-placeholder::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 20% 80%, rgba(255,255,255,0.15) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%);
}

.cover-initials {
  position: relative;
  font-size: 2rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.85);
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  letter-spacing: 0.05em;
  line-height: 1;
}

.cover-category {
  position: absolute;
  bottom: 8px;
  right: 10px;
  padding: 2px 8px;
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(4px);
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}
</style>
