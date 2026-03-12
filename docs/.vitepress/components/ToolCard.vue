<template>
  <a :href="url" :target="external ? '_blank' : undefined" :rel="external ? 'noopener noreferrer' : undefined" class="tool-card">
    <div class="tool-icon" v-if="icon">
      <img :src="icon" :alt="name" />
    </div>
    <div class="tool-info">
      <h3 class="tool-name">
        {{ name }}
        <span v-if="external" class="external-icon">↗</span>
      </h3>
      <p class="tool-desc">{{ description }}</p>
      <div v-if="tags && tags.length" class="tool-tags">
        <span v-for="tag in tags" :key="tag" class="tag">{{ tag }}</span>
      </div>
    </div>
  </a>
</template>

<script setup lang="ts">
defineProps<{
  name: string
  description: string
  url: string
  icon?: string
  tags?: string[]
  external?: boolean
}>()
</script>

<style scoped>
.tool-card {
  display: flex;
  gap: 1rem;
  padding: 1.25rem;
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  text-decoration: none;
  color: inherit;
  transition: all 0.3s ease;
}

.tool-card:hover {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.tool-icon {
  width: 48px;
  height: 48px;
  flex-shrink: 0;
  border-radius: 10px;
  overflow: hidden;
  background: var(--vp-c-bg);
  display: flex;
  align-items: center;
  justify-content: center;
}

.tool-icon img {
  width: 32px;
  height: 32px;
  object-fit: contain;
}

.tool-info {
  flex: 1;
  min-width: 0;
}

.tool-name {
  margin: 0 0 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.external-icon {
  font-size: 0.875rem;
  color: var(--vp-c-text-3);
}

.tool-desc {
  margin: 0 0 0.75rem;
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
  line-height: 1.5;
}

.tool-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
}

.tag {
  display: inline-block;
  padding: 0.125rem 0.5rem;
  font-size: 0.7rem;
  border-radius: 4px;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
}
</style>
