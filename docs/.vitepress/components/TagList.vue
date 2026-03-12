<template>
  <div class="tag-list">
    <span
      v-for="tag in tags"
      :key="tag"
      class="tag"
      :class="{ active: activeTag === tag }"
      @click="$emit('select', tag)"
    >
      {{ tag }}
    </span>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  tags: string[]
  activeTag?: string
}>()

defineEmits<{
  select: [tag: string]
}>()
</script>

<style scoped>
.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 1rem 0;
}

.tag {
  display: inline-block;
  padding: 0.375rem 0.875rem;
  font-size: 0.875rem;
  border-radius: 999px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-2);
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;
}

.tag:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.tag.active {
  background: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-white);
}
</style>
