---
title: 标签分类
description: 按标签浏览所有文章
---

# 标签分类

<div id="tags-page"></div>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vitepress'

const route = useRoute()
const allTags = ref({})
const selectedTag = ref('')
const allPosts = ref([])

// 从 URL 获取选中的标签
onMounted(() => {
  const params = new URLSearchParams(window.location.search)
  selectedTag.value = params.get('tag') || ''
})

// 文章数据（这里需要手动维护或通过构建时生成）
const posts = [
  {
    title: 'Git 使用技巧',
    date: '2024-03-15',
    tags: ['Git', '版本控制'],
    link: '/notes/git-tips',
    description: 'Git 常用命令和实用技巧，提升版本控制效率。'
  },
  {
    title: 'Rocky Linux 安装配置',
    date: '2024-12-20',
    tags: ['Linux', 'Rocky Linux', '运维', '服务器'],
    link: '/notes/Rocky Linux安装配置',
    description: 'Rocky Linux 完整安装配置指南，从系统下载到环境配置的详细步骤。'
  }
]

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
  const url = new URL(window.location)
  if (tag) {
    url.searchParams.set('tag', tag)
  } else {
    url.searchParams.delete('tag')
  }
  window.history.pushState({}, '', url)
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
      class="tag-button" 
      :class="{ active: !selectedTag }"
      @click="selectTag('')"
    >
      全部 ({{ posts.length }})
    </button>
    <button 
      v-for="(stats, tag) in tagStats" 
      :key="tag"
      class="tag-button" 
      :class="{ active: selectedTag === tag }"
      @click="selectTag(tag)"
    >
      {{ tag }} ({{ stats.count }})
    </button>
  </div>

  <!-- 文章列表 -->
  <div class="post-list">
    <div v-if="filteredPosts.length === 0" class="no-posts">
      暂无相关文章
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
            :class="{ highlight: tag === selectedTag }"
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
  gap: 0.75rem;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
}

.tag-button {
  padding: 0.5rem 1rem;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--vp-c-text-1);
  cursor: pointer;
  transition: all 0.25s;
}

.tag-button:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.tag-button.active {
  background: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
  color: white;
}

.post-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.no-posts {
  text-align: center;
  padding: 3rem;
  color: var(--vp-c-text-2);
}

.post-card {
  display: block;
  padding: 1.5rem;
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
  text-decoration: none;
  transition: all 0.25s;
}

.post-card:hover {
  background: var(--vp-c-bg);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.post-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
}

.post-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.post-date {
  flex-shrink: 0;
  margin-left: 1rem;
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
}

.post-description {
  margin: 0 0 1rem 0;
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
  line-height: 1.6;
}

.post-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.post-tag {
  padding: 0.25rem 0.75rem;
  background: var(--vp-c-bg);
  border-radius: 12px;
  font-size: 0.75rem;
  color: var(--vp-c-text-2);
  transition: all 0.25s;
}

.post-tag.highlight {
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
}

@media (max-width: 640px) {
  .post-header {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .post-date {
    margin-left: 0;
  }
}
</style>
