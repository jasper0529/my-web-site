<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'
import { data } from '../posts.data'

const { frontmatter, page } = useData()

// 获取当前文章信息
const currentPath = computed(() => page.value.relativePath.replace(/\.md$/, '').replace(/\\/g, '/'))
const currentTags = computed(() => frontmatter.value.tags || [])

// 基于标签计算相关文章
const relatedPosts = computed(() => {
  if (!currentTags.value.length) return []
  
  const posts = data.posts
  const currentUrl = '/' + currentPath.value
  
  // 计算每篇文章的相关度分数
  const scoredPosts = posts
    .filter(post => post.link !== currentUrl) // 排除当前文章
    .map(post => {
      // 计算标签重叠数量
      const commonTags = post.tags.filter(tag => currentTags.value.includes(tag))
      return {
        ...post,
        score: commonTags.length
      }
    })
    .filter(post => post.score > 0) // 只保留有共同标签的文章
    .sort((a, b) => {
      // 先按相关度排序，再按日期排序
      if (b.score !== a.score) return b.score - a.score
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })
    .slice(0, 3) // 最多显示3篇
  
  return scoredPosts
})

// 格式化日期
const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}
</script>

<template>
  <div v-if="relatedPosts.length > 0" class="related-posts">
    <h3 class="related-title">
      <span class="related-icon">📌</span>
      相关文章推荐
    </h3>
    <div class="related-list">
      <a 
        v-for="post in relatedPosts" 
        :key="post.link" 
        :href="post.link"
        class="related-item"
      >
        <div class="related-content">
          <h4 class="related-post-title">{{ post.title }}</h4>
          <p v-if="post.description" class="related-desc">{{ post.description }}</p>
          <div class="related-meta">
            <span class="related-date">{{ formatDate(post.date) }}</span>
            <div v-if="post.tags.length" class="related-tags">
              <span v-for="tag in post.tags.slice(0, 2)" :key="tag" class="tag">
                {{ tag }}
              </span>
            </div>
          </div>
        </div>
      </a>
    </div>
  </div>
</template>

<style scoped>
.related-posts {
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid var(--vp-c-divider);
}

.related-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin-bottom: 1.5rem;
}

.related-icon {
  font-size: 1.25rem;
}

.related-list {
  display: grid;
  gap: 1rem;
}

.related-item {
  display: block;
  padding: 1rem 1.25rem;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  text-decoration: none;
  color: inherit;
  transition: all 0.25s ease;
}

.related-item:hover {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.1);
  transform: translateX(4px);
}

.dark .related-item:hover {
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
}

.related-content {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.related-post-title {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  line-height: 1.4;
}

.related-desc {
  margin: 0;
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.related-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.25rem;
}

.related-date {
  font-size: 0.75rem;
  color: var(--vp-c-text-3);
}

.related-tags {
  display: flex;
  gap: 0.375rem;
}

.tag {
  display: inline-block;
  padding: 0.125rem 0.5rem;
  font-size: 0.7rem;
  border-radius: 999px;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
}

/* 响应式设计 */
@media (max-width: 640px) {
  .related-item {
    padding: 0.875rem 1rem;
  }
  
  .related-post-title {
    font-size: 0.9375rem;
  }
  
  .related-meta {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
