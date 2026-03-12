<template>
  <div class="feature-card">
    <div class="feature-icon" v-if="icon">{{ icon }}</div>
    <h3 class="feature-title">{{ title }}</h3>
    <p class="feature-desc">{{ description }}</p>
    <a v-if="link" :href="link" class="feature-link">
      了解更多 →
    </a>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  description: string
  icon?: string
  link?: string
}>()
</script>

<style scoped>
.feature-card {
  padding: 1.5rem;
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  transition: all 0.3s ease;
}

.feature-card:hover {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.feature-icon {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.feature-title {
  margin: 0 0 0.75rem;
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.feature-desc {
  margin: 0 0 1rem;
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
  line-height: 1.6;
}

.feature-link {
  display: inline-flex;
  align-items: center;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--vp-c-brand-1);
  text-decoration: none;
  transition: color 0.2s;
}

.feature-link:hover {
  color: var(--vp-c-brand-2);
}
</style>
