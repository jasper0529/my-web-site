<template>
  <div class="tag-section">
    <div class="tag-header">
      <p class="tag-summary">
        <span class="dot"></span>
        已收录 <strong>{{ tags.length }}</strong> 个热门主题
      </p>
      <a class="more-link" href="/tags/">
        查看更多标签
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M8 5l8 7-8 7" fill="none" stroke="currentColor" stroke-width="2"/>
        </svg>
      </a>
    </div>
    <div class="tag-list">
      <button
        v-for="tag in tags"
        :key="tag"
        class="tag-pill"
        :class="{ active: activeTag === tag }"
        @click="$emit('select', tag)"
        type="button"
      >
        <span class="pill-label">{{ tag }}</span>
        <span class="pill-count" v-if="counts[tag]">{{ counts[tag] }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  tags: string[]
  activeTag?: string
  stats?: Record<string, number>
}>()

defineEmits<{
  select: [tag: string]
}>()

const counts = computed(() => props.stats ?? {})
</script>

<style scoped>
.tag-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin: 1.5rem 0 0.5rem;
}

.tag-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}

.tag-summary {
  margin: 0;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--vp-c-text-3);
  font-size: 0.95rem;
}

.tag-summary .dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: var(--vp-c-brand-1);
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.15);
}

.more-link {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-weight: 600;
  color: var(--vp-c-brand-1);
  text-decoration: none;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.more-link svg {
  width: 18px;
  height: 18px;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.tag-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 0.75rem;
}

.tag-pill {
  border: 1px solid rgba(15, 23, 42, 0.08);
  background: rgba(248, 250, 252, 0.6);
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.55rem 0.95rem;
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
  cursor: pointer;
  transition: all 0.25s ease;
  font-weight: 500;
}

.tag-pill:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
  box-shadow: 0 12px 24px rgba(37, 99, 235, 0.12);
}

.tag-pill.active {
  background: linear-gradient(120deg, var(--vp-c-brand-1), var(--vp-c-brand-2));
  color: white;
  border-color: transparent;
  box-shadow: 0 15px 30px rgba(37, 99, 235, 0.3);
}

.tag-pill .pill-count {
  display: inline-flex;
  min-width: 32px;
  padding: 0.15rem 0.6rem;
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.06);
  font-size: 0.75rem;
  justify-content: center;
}

.tag-pill.active .pill-count {
  background: rgba(255, 255, 255, 0.25);
  color: white;
}

.dark .tag-pill {
  border-color: rgba(148, 163, 184, 0.2);
  background: rgba(15, 23, 42, 0.5);
}

.dark .tag-pill .pill-count {
  background: rgba(148, 163, 184, 0.15);
}

.dark .tag-pill.active .pill-count {
  background: rgba(15, 23, 42, 0.4);
}

@media (max-width: 640px) {
  .tag-list {
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  }

  .tag-pill {
    justify-content: space-between;
  }
}
</style>
