<template>
  <div class="post-list">
    <div v-for="post in posts" :key="post.url" class="post-item">
      <a :href="post.url" class="post-link">
        <div class="post-card">
          <div class="post-header">
            <h3 class="post-title">{{ post.title }}</h3>
            <span v-if="post.date" class="post-date">{{ formatDate(post.date) }}</span>
          </div>
          <p v-if="post.description" class="post-desc">{{ post.description }}</p>
          <div v-if="post.tags && post.tags.length" class="post-tags">
            <span v-for="tag in post.tags" :key="tag" class="tag">{{ tag }}</span>
          </div>
        </div>
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Post {
  title: string
  url: string
  date?: string
  description?: string
  tags?: string[]
}

const props = defineProps<{
  data?: Post[]
}>()

const posts = ref<Post[]>(props.data || [])

onMounted(async () => {
  // 如果没有传入数据，尝试从全局数据获取
  if (!props.data) {
    // 可以在这里实现从 API 或其他数据源获取文章列表的逻辑
  }
})

const formatDate = (date: string) => {
  const d = new Date(date)
  return d.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })
}
</script>

<style scoped>
.post-list {
  display: grid;
  gap: 1.5rem;
  margin: 2rem 0;
}

.post-item {
  transition: transform 0.2s ease;
}

.post-item:hover {
  transform: translateX(8px);
}

.post-link {
  text-decoration: none;
  color: inherit;
}

.post-card {
  padding: 1.5rem;
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  transition: all 0.3s ease;
}

.post-card:hover {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.post-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
  gap: 1rem;
}

.post-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  flex: 1;
}

.post-date {
  font-size: 0.875rem;
  color: var(--vp-c-text-3);
  white-space: nowrap;
}

.post-desc {
  margin: 0 0 1rem;
  color: var(--vp-c-text-2);
  line-height: 1.6;
}

.post-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
  border-radius: 999px;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
}
</style>
