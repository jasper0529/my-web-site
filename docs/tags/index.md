---
title: 标签分类
description: 按标签浏览所有文章
---

# 标签分类

<div id="tags-page"></div>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vitepress'
import { data } from '../.vitepress/posts.data'

const route = useRoute()
const selectedTag = ref('')
const isClient = typeof window !== 'undefined'

// 从 posts.data.ts 自动获取文章数据
const posts = data.posts

// 热门标签阈值（文章数量超过此值的标签被认为是热门）
const hotThreshold = 2

// 从 URL 获取选中的标签
onMounted(() => {
  if (!isClient) return
  const params = new URLSearchParams(window.location.search)
  selectedTag.value = params.get('tag') || ''
  
  // 支持通过 URL hash 直接定位标签
  if (window.location.hash) {
    const hashTag = decodeURIComponent(window.location.hash.slice(1))
    if (hashTag && Object.keys(tagStats.value).includes(hashTag)) {
      selectedTag.value = hashTag
    }
  }
})

// 提取所有标签及其文章数量
const tagStats = computed(() => {
  const stats = {}
  posts.forEach(post => {
    post.tags.forEach(tag => {
      if (!stats[tag]) {
        stats[tag] = { count: 0, posts: [] }
      }
      stats[tag].count++
      stats[tag].posts.push(post)
    })
  })
  return stats
})

// 按文章数量排序的标签列表
const sortedTags = computed(() => {
  return Object.entries(tagStats.value)
    .sort((a, b) => b[1].count - a[1].count)
})

// 计算标签大小（基于文章数量）
const getTagSize = (count) => {
  const maxCount = Math.max(...Object.values(tagStats.value).map(t => t.count))
  const minSize = 0.85
  const maxSize = 1.25
  const ratio = count / maxCount
  return minSize + (maxSize - minSize) * ratio
}

// 判断是否为热门标签
const isHotTag = (count) => count >= hotThreshold

// 根据选中标签筛选文章
const filteredPosts = computed(() => {
  if (!selectedTag.value) {
    return posts.sort((a, b) => new Date(b.date) - new Date(a.date))
  }
  return posts
    .filter(post => post.tags.includes(selectedTag.value))
    .sort((a, b) => new Date(b.date) - new Date(a.date))
})

// 选择标签
const selectTag = (tag) => {
  selectedTag.value = tag
  // 更新 URL
  const url = isClient ? new URL(window.location.href) : null
  if (url) {
    if (tag) {
      url.searchParams.set('tag', tag)
    } else {
      url.searchParams.delete('tag')
    }
    window.history.pushState({}, '', url)
  }
}

// 格式化日期
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>

<div class="tags-container">
  <!-- 标签云 -->
  <div class="tag-cloud">
    <button
      class="tag-button all-tag"
      :class="{ active: !selectedTag }"
      @click="selectTag('')"
    >
      📚 全部 ({{ posts.length }})
    </button>
    <button
      v-for="item in sortedTags"
      :key="item[0]"
      class="tag-button"
      :class="{
        active: selectedTag === item[0],
        'hot-tag': isHotTag(item[1].count)
      }"
      :style="{ fontSize: getTagSize(item[1].count) + 'rem' }"
      @click="selectTag(item[0])"
    >
      <span v-if="isHotTag(item[1].count)" class="hot-badge">🔥</span>
      {{ item[0] }}
      <span class="tag-count">{{ item[1].count }}</span>
    </button>
  </div>

  <!-- 标签说明 -->
  <div class="tag-legend">
    <span class="legend-item">
      <span class="legend-badge hot">🔥</span> 热门标签 (≥{{ hotThreshold }}篇)
    </span>
    <span class="legend-item">
      <span class="legend-hint">字号越大 = 文章越多</span>
    </span>
  </div>

  <!-- 文章列表 -->
  <div class="post-list">
    <div v-if="filteredPosts.length === 0" class="no-posts">
      📭 暂无相关文章
    </div>
    <div v-else class="posts">
      <a 
        v-for="post in filteredPosts" 
        :key="post.link" 
        :href="post.link"
        class="post-card"
      >
        <div class="post-header">
          <h3 class="post-title">{{ post.title }}</h3>
          <span class="post-date">{{ formatDate(post.date) }}</span>
        </div>
        <p v-if="post.description" class="post-description">{{ post.description }}</p>
        <div class="post-tags">
          <span 
            v-for="tag in post.tags" 
            :key="tag" 
            class="post-tag"
            :class="{ 
              highlight: tag === selectedTag,
              'is-hot': isHotTag(tagStats[tag]?.count || 0)
            }"
            @click.stop="selectTag(tag)"
          >
            {{ tag }}
          </span>
        </div>
      </a>
    </div>
  </div>
</div>

<style scoped>
.tags-container {
  margin-top: 2rem;
}

.tag-cloud {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
  padding: 1.5rem;
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
  border: 1px solid var(--vp-c-divider);
}

.tag-button {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem 1rem;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--vp-c-text-1);
  cursor: pointer;
  transition: all 0.25s ease;
  line-height: 1.4;
}

.tag-button:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(37, 99, 235, 0.15);
}

.tag-button.active {
  background: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
  color: white;
  transform: scale(1.05);
}

/* 热门标签样式 */
.tag-button.hot-tag {
  background: linear-gradient(135deg, var(--vp-c-brand-soft) 0%, var(--vp-c-bg) 100%);
  border-color: var(--vp-c-brand-1);
  font-weight: 600;
}

.tag-button.hot-tag:hover {
  background: linear-gradient(135deg, var(--vp-c-brand-1) 0%, var(--vp-c-brand-2) 100%);
  color: white;
}

.tag-button.hot-tag.active {
  background: linear-gradient(135deg, var(--vp-c-brand-1) 0%, var(--vp-c-brand-2) 100%);
}

.hot-badge {
  font-size: 0.75em;
}

.tag-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.25rem;
  height: 1.25rem;
  padding: 0 0.375rem;
  background: var(--vp-c-divider);
  border-radius: 10px;
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--vp-c-text-2);
  margin-left: 0.125rem;
}

.tag-button.active .tag-count {
  background: rgba(255, 255, 255, 0.25);
  color: white;
}

.tag-button.hot-tag .tag-count {
  background: var(--vp-c-brand-1);
  color: white;
}

/* 标签说明 */
.tag-legend {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
  padding: 0.75rem 1rem;
  background: var(--vp-c-bg-mute);
  border-radius: 8px;
  font-size: 0.8rem;
  color: var(--vp-c-text-3);
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.375rem;
}

.legend-badge {
  font-size: 0.9rem;
}

.legend-hint {
  font-style: italic;
}

/* 文章列表 */
.post-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.no-posts {
  text-align: center;
  padding: 3rem;
  color: var(--vp-c-text-2);
  font-size: 1rem;
}

.post-card {
  display: block;
  padding: 1.5rem;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  text-decoration: none;
  transition: all 0.25s ease;
}

.post-card:hover {
  background: var(--vp-c-bg);
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 4px 16px rgba(37, 99, 235, 0.12);
  transform: translateY(-3px);
}

.post-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 0.75rem;
}

.post-title {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  line-height: 1.4;
}

.post-date {
  flex-shrink: 0;
  font-size: 0.8rem;
  color: var(--vp-c-text-3);
}

.post-description {
  margin: 0 0 1rem;
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.post-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.post-tag {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
  border-radius: 12px;
  background: var(--vp-c-bg-mute);
  color: var(--vp-c-text-2);
  cursor: pointer;
  transition: all 0.2s ease;
}

.post-tag:hover {
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
}

.post-tag.highlight {
  background: var(--vp-c-brand-1);
  color: white;
}

.post-tag.is-hot {
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  font-weight: 500;
}

.post-tag.is-hot.highlight {
  background: var(--vp-c-brand-1);
  color: white;
}

/* 响应式设计 */
@media (max-width: 640px) {
  .tag-cloud {
    padding: 1rem;
    gap: 0.5rem;
  }
  
  .tag-button {
    padding: 0.375rem 0.75rem;
    font-size: 0.8rem !important;
  }
  
  .tag-legend {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .post-header {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .post-date {
    font-size: 0.75rem;
  }
}
</style>
