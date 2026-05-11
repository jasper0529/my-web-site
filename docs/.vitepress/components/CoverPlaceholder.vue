<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  title: string
  category?: string
}>()

function hashStr(str: string): number {
  let hash = 5381
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash + str.charCodeAt(i)) & 0xffffffff
  }
  return Math.abs(hash)
}

const palettes: [string, string, string][] = [
  ['#0f172a', '#1d4ed8', '#2563eb'],
  ['#111827', '#0f766e', '#0ea5e9'],
  ['#172554', '#1e3a8a', '#2563eb'],
  ['#1e3a5f', '#2563eb', '#60a5fa'],
  ['#1e293b', '#059669', '#34d399'],
  ['#1e1b4b', '#7c3aed', '#a78bfa']
]

const palette = computed(() => palettes[hashStr(props.title) % palettes.length])

const backgroundStyle = computed(() => {
  const [base, accent, glow] = palette.value
  return {
    background: `
      linear-gradient(135deg, ${base} 0%, ${accent} 58%, ${glow} 100%)
    `,
    '--cover-glow': glow,
    '--cover-accent': accent
  }
})

const initials = computed(() => {
  const normalized = props.title.replace(/[^\w\u4e00-\u9fff]/g, ' ').trim()
  const words = normalized.split(/\s+/).filter(Boolean)

  if (words.length >= 2) {
    return words.slice(0, 2).map(word => word[0]).join('').toUpperCase()
  }

  return props.title.slice(0, 2).toUpperCase()
})

const categoryLabel = computed(() => {
  return (props.category || 'TECH').slice(0, 10).toUpperCase()
})
</script>

<template>
  <div class="cover-placeholder" :style="backgroundStyle">
    <span class="cover-initials">{{ initials }}</span>
    <span class="cover-category">{{ categoryLabel }}</span>
  </div>
</template>

<style scoped>
.cover-placeholder {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  isolation: isolate;
}

.cover-placeholder::before {
  content: '';
  position: absolute;
  inset: 8% -10% auto auto;
  width: 68%;
  height: 70%;
  background: radial-gradient(circle, color-mix(in srgb, var(--cover-glow), white 12%) 0%, transparent 72%);
  opacity: 0.28;
  filter: blur(18px);
}

.cover-initials {
  position: relative;
  z-index: 1;
  font-family: var(--vp-font-family-mono);
  font-size: 2rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.92);
  letter-spacing: 0.08em;
  text-shadow: 0 4px 18px rgba(15, 23, 42, 0.28);
}

.cover-category {
  position: absolute;
  right: 0.9rem;
  bottom: 0.9rem;
  z-index: 1;
  padding: 0.28rem 0.62rem;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  background: rgba(15, 23, 42, 0.26);
  color: rgba(255, 255, 255, 0.86);
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  backdrop-filter: blur(8px);
}
</style>
