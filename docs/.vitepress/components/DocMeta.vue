<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'

const { frontmatter, page } = useData()

const formatDate = (date: string | Date) => {
  if (!date) return ''
  const d = new Date(date)
  return d.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const hasMeta = computed(() => {
  return frontmatter.value.date ||
         (frontmatter.value.tags && frontmatter.value.tags.length > 0)
})

const articleTitle = computed(() => {
  return frontmatter.value.title || page.value.title
})
</script>

<template>
  <div class="doc-meta-container">
    <!-- 文章标题 -->
    <h1 v-if="articleTitle" class="article-title">{{ articleTitle }}</h1>
    
    <!-- 元信息 -->
    <div v-if="hasMeta" class="doc-meta">
      <div class="meta-info">
        <!-- 创建时间 -->
        <span v-if="frontmatter.date" class="meta-item date">
          <span class="icon">📅</span>
          <span class="label">创建于</span>
          <span class="value">{{ formatDate(frontmatter.date) }}</span>
        </span>
        
        <!-- 标签 -->
        <span v-if="frontmatter.tags && frontmatter.tags.length > 0" class="meta-item tags">
          <span class="icon">🏷️</span>
          <span class="label">标签</span>
          <span class="tag-list">
            <a
              v-for="tag in frontmatter.tags"
              :key="tag"
              :href="`/tags/?tag=${encodeURIComponent(tag)}`"
              class="tag"
            >
              {{ tag }}
            </a>
          </span>
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.doc-meta-container {
  margin-bottom: 1.5rem;
}

.article-title {
  margin: 0 0 1rem 0;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid var(--vp-c-brand-1);
  font-size: 2rem;
  font-weight: 700;
  line-height: 1.3;
  color: var(--vp-c-text-1);
}

.doc-meta {
  padding: 0.75rem 0;
}

.meta-info {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.meta-item .icon {
  font-size: 1rem;
}

.meta-item .label {
  font-weight: 500;
  color: var(--vp-c-text-1);
}

.meta-item .value {
  color: var(--vp-c-brand-1);
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag {
  display: inline-flex;
  align-items: center;
  padding: 0.125rem 0.5rem;
  background: var(--vp-button-alt-bg);
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--vp-button-alt-text);
  text-decoration: none;
  transition: all 0.25s;
  cursor: pointer;
}

.tag:hover {
  background: var(--vp-button-alt-hover-bg);
  color: var(--vp-button-alt-hover-text);
  transform: translateY(-1px);
}

@media (max-width: 640px) {
  .article-title {
    font-size: 1.5rem;
  }
  
  .meta-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
}
</style>
