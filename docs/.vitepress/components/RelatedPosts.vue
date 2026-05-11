<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'
import { data } from '../posts.data'

const { frontmatter, page } = useData()

const currentPath = computed(() => page.value.relativePath.replace(/\.md$/, '').replace(/\\/g, '/'))
const currentTags = computed(() => frontmatter.value.tags || [])

const relatedPosts = computed(() => {
  if (!currentTags.value.length) return []

  const posts = data.posts
  const currentUrl = '/' + currentPath.value

  return posts
    .filter(post => post.link !== currentUrl)
    .map(post => {
      const commonTags = post.tags.filter(tag => currentTags.value.includes(tag))
      return {
        ...post,
        score: commonTags.length
      }
    })
    .filter(post => post.score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })
    .slice(0, 3)
})

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}
</script>

<template>
  <section v-if="relatedPosts.length > 0" class="related-posts">
    <div class="related-head">
      <span class="related-code">NEXT</span>
      <div>
        <h3 class="related-title">相关文章推荐</h3>
        <p class="related-subtitle">基于当前文章标签筛出更接近的内容，适合顺着同一条主题继续深入。</p>
      </div>
    </div>
    <div class="related-list">
      <a
        v-for="(post, index) in relatedPosts"
        :key="post.link"
        :href="post.link"
        class="related-item"
      >
        <span class="related-index">0{{ index + 1 }}</span>
        <div class="related-content">
          <h4 class="related-post-title">{{ post.title }}</h4>
          <p v-if="post.description" class="related-desc">{{ post.description }}</p>
          <div class="related-meta">
            <span class="related-date">{{ formatDate(post.date) }}</span>
            <div v-if="post.tags.length" class="related-tags">
              <span v-for="tag in post.tags.slice(0, 2)" :key="tag" class="related-tag">
                {{ tag }}
              </span>
            </div>
          </div>
        </div>
      </a>
    </div>
  </section>
</template>

<style scoped>
.related-posts {
  margin-top: 3rem;
  padding: 1.3rem 1.35rem;
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: var(--radius-xl);
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.97), rgba(248, 250, 252, 0.99)),
    linear-gradient(135deg, rgba(37, 99, 235, 0.03), rgba(15, 23, 42, 0.02));
  box-shadow: 0 16px 34px rgba(15, 23, 42, 0.05);
}

.related-head {
  display: flex;
  align-items: flex-start;
  gap: 0.9rem;
  margin-bottom: 1.1rem;
}

.related-code {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 3.8rem;
  padding: 0.26rem 0.72rem;
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.92);
  color: #f8fafc;
  font-size: 0.76rem;
  font-weight: 700;
  letter-spacing: 0.08em;
}

.related-title {
  margin: 0;
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
}

.related-subtitle {
  margin: 0.35rem 0 0;
  color: var(--vp-c-text-2);
  font-size: 0.88rem;
  line-height: 1.7;
}

.related-list {
  display: grid;
  gap: 0.9rem;
}

.related-item {
  display: grid;
  grid-template-columns: 52px 1fr;
  gap: 0.95rem;
  padding: 1rem 1.05rem;
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: var(--radius-lg);
  background: rgba(255, 255, 255, 0.76);
  text-decoration: none;
  color: inherit;
  transition: transform 0.24s ease, border-color 0.24s ease, box-shadow 0.24s ease;
}

.related-item:hover {
  transform: translateY(-2px);
  border-color: rgba(37, 99, 235, 0.22);
  box-shadow: 0 14px 26px rgba(15, 23, 42, 0.07);
}

.related-index {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  border-radius: var(--radius-md);
  background: rgba(15, 23, 42, 0.92);
  color: #f8fafc;
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.06em;
}

.related-content {
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
}

.related-post-title {
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
  line-height: 1.45;
}

.related-desc {
  margin: 0;
  font-size: 0.88rem;
  color: var(--vp-c-text-2);
  line-height: 1.65;
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
}

.related-date {
  font-size: 0.76rem;
  color: var(--vp-c-text-3);
}

.related-tags {
  display: flex;
  gap: 0.42rem;
  flex-wrap: wrap;
}

.related-tag {
  display: inline-flex;
  padding: 0.18rem 0.56rem;
  font-size: 0.72rem;
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.05);
  color: var(--vp-c-text-2);
  font-weight: 600;
}

.dark .related-posts,
.dark .related-item {
  border-color: rgba(59, 130, 246, 0.15);
  background: rgba(15, 23, 42, 0.82);
  box-shadow: 0 0 15px rgba(59, 130, 246, 0.06);
}

.dark .related-item {
  border-color: rgba(59, 130, 246, 0.12);
  transition: transform 0.24s ease, border-color 0.24s ease, box-shadow 0.24s ease;
}

.dark .related-item:hover {
  border-color: rgba(59, 130, 246, 0.3);
  box-shadow: 0 0 20px rgba(59, 130, 246, 0.12);
}

.dark .related-tag {
  background: rgba(59, 130, 246, 0.12);
}

@media (max-width: 640px) {
  .related-posts {
    padding: 1.05rem 1rem;
    border-radius: var(--radius-lg);
  }

  .related-head,
  .related-item {
    grid-template-columns: 1fr;
  }

  .related-index {
    width: 44px;
    height: 44px;
  }

  .related-meta {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
