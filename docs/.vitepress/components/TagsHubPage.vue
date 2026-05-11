<script setup>
import { ref, computed, onMounted } from 'vue'
import { data } from '../posts.data'

const selectedTag = ref('')
const isClient = typeof window !== 'undefined'
const posts = data.posts
const hotThreshold = 2

onMounted(() => {
  if (!isClient) return
  const params = new URLSearchParams(window.location.search)
  selectedTag.value = params.get('tag') || ''

  if (window.location.hash) {
    const hashTag = decodeURIComponent(window.location.hash.slice(1))
    if (hashTag && Object.keys(tagStats.value).includes(hashTag)) {
      selectedTag.value = hashTag
    }
  }
})

const tagStats = computed(() => {
  const stats = {}
  posts.forEach(post => {
    ;(post.tags || []).forEach(tag => {
      if (!stats[tag]) {
        stats[tag] = { count: 0, posts: [] }
      }
      stats[tag].count++
      stats[tag].posts.push(post)
    })
  })
  return stats
})

const sortedTags = computed(() =>
  Object.entries(tagStats.value).sort((a, b) => b[1].count - a[1].count)
)

const filteredPosts = computed(() => {
  if (!selectedTag.value) {
    return [...posts].sort((a, b) => new Date(b.date) - new Date(a.date))
  }
  return posts
    .filter(post => (post.tags || []).includes(selectedTag.value))
    .sort((a, b) => new Date(b.date) - new Date(a.date))
})

const hotTagCount = computed(() =>
  Object.values(tagStats.value).filter(item => item.count >= hotThreshold).length
)

const getTagSize = count => {
  const values = Object.values(tagStats.value)
  const maxCount = values.length ? Math.max(...values.map(t => t.count)) : 1
  const minSize = 0.88
  const maxSize = 1.14
  const ratio = count / maxCount
  return minSize + (maxSize - minSize) * ratio
}

const isHotTag = count => count >= hotThreshold

const selectTag = tag => {
  selectedTag.value = tag
  if (!isClient) return
  const url = new URL(window.location.href)
  if (tag) {
    url.searchParams.set('tag', tag)
  } else {
    url.searchParams.delete('tag')
  }
  window.history.pushState({}, '', url)
}

const formatDate = date =>
  new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
</script>

<template>
  <div class="hub-page tags-page">
    <section class="hub-hero">
      <div class="hub-eyebrow">
        <span class="hub-code">TAGS</span>
        <span class="hub-card-status">Topic Navigation</span>
      </div>
      <h1 class="hub-title">标签分类</h1>
      <p class="hub-desc">
        这里按标签聚合全部文章，适合在不知道具体标题时按主题反向检索。相比时间线归档，这一页更适合快速判断某个方向是否已经被系统写过。
      </p>
      <div class="hub-stats">
        <div class="hub-stat">
          <span class="hub-stat-value">{{ sortedTags.length }}</span>
          <span class="hub-stat-label">标签总数</span>
        </div>
        <div class="hub-stat">
          <span class="hub-stat-value">{{ hotTagCount }}</span>
          <span class="hub-stat-label">热门标签</span>
        </div>
        <div class="hub-stat">
          <span class="hub-stat-value">{{ filteredPosts.length }}</span>
          <span class="hub-stat-label">{{ selectedTag ? '当前结果' : '全部文章' }}</span>
        </div>
      </div>
    </section>

    <section class="hub-section">
      <h2 class="hub-section-title">标签筛选</h2>
      <p class="hub-section-desc">
        热门标签代表该主题已有多篇文章；字号略大表示内容覆盖更密集。你也可以直接点击文章卡片里的标签继续切换。
      </p>
      <div class="tags-cloud">
        <button class="tag-button all-tag" :class="{ active: !selectedTag }" @click="selectTag('')">
          全部
          <span class="tag-count">{{ posts.length }}</span>
        </button>
        <button
          v-for="item in sortedTags"
          :key="item[0]"
          class="tag-button"
          :class="{ active: selectedTag === item[0], 'hot-tag': isHotTag(item[1].count) }"
          :style="{ fontSize: getTagSize(item[1].count) + 'rem' }"
          @click="selectTag(item[0])"
        >
          {{ item[0] }}
          <span class="tag-count">{{ item[1].count }}</span>
        </button>
      </div>
    </section>

    <section class="hub-section">
      <h2 class="hub-section-title">{{ selectedTag ? `标签：${selectedTag}` : '全部文章' }}</h2>
      <p class="hub-section-desc">
        当前列表按时间倒序展示，保留标题、摘要、日期与标签，方便你快速决定是否进入正文。
      </p>
      <div v-if="filteredPosts.length === 0" class="tags-empty">
        暂无相关文章
      </div>
      <div v-else class="tag-posts">
        <a v-for="post in filteredPosts" :key="post.link" :href="post.link" class="tag-post-card">
          <div class="tag-post-head">
            <h3 class="tag-post-title">{{ post.title }}</h3>
            <span class="tag-post-date">{{ formatDate(post.date) }}</span>
          </div>
          <p v-if="post.description" class="tag-post-desc">{{ post.description }}</p>
          <div class="tag-post-tags">
            <span
              v-for="tag in post.tags"
              :key="tag"
              class="tag-post-tag"
              :class="{ highlight: tag === selectedTag, 'is-hot': isHotTag(tagStats[tag]?.count || 0) }"
              @click.stop="selectTag(tag)"
            >
              {{ tag }}
            </span>
          </div>
        </a>
      </div>
    </section>
  </div>
</template>

<style scoped>
.tags-page {
  margin-bottom: 1.5rem;
}

.tags-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.tag-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.52rem 0.9rem;
  background: rgba(255, 255, 255, 0.78);
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 999px;
  color: var(--vp-c-text-1);
  cursor: pointer;
  transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
  line-height: 1.3;
}

.tag-button:hover {
  transform: translateY(-2px);
  border-color: rgba(37, 99, 235, 0.22);
  box-shadow: 0 10px 20px rgba(15, 23, 42, 0.06);
}

.tag-button.active {
  background: rgba(15, 23, 42, 0.92);
  border-color: rgba(15, 23, 42, 0.92);
  color: #f8fafc;
}

.tag-button.hot-tag {
  border-color: rgba(37, 99, 235, 0.28);
  background: rgba(37, 99, 235, 0.06);
}

.tag-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.5rem;
  height: 1.5rem;
  padding: 0 0.4rem;
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.08);
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--vp-c-text-2);
}

.tag-button.active .tag-count {
  background: rgba(255, 255, 255, 0.16);
  color: #f8fafc;
}

.tag-posts {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.tag-post-card {
  display: block;
  padding: 1.15rem 1.2rem;
  border-radius: 18px;
  border: 1px solid rgba(15, 23, 42, 0.08);
  background: rgba(255, 255, 255, 0.72);
  text-decoration: none;
  color: inherit;
  transition: transform 0.22s ease, border-color 0.22s ease, box-shadow 0.22s ease;
}

.tag-post-card:hover {
  transform: translateY(-2px);
  border-color: rgba(37, 99, 235, 0.24);
  box-shadow: 0 14px 28px rgba(15, 23, 42, 0.07);
}

.tag-post-head {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: flex-start;
}

.tag-post-title {
  margin: 0;
  font-size: 1.06rem;
  line-height: 1.45;
}

.tag-post-date {
  flex-shrink: 0;
  padding: 0.28rem 0.65rem;
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.06);
  color: var(--vp-c-text-3);
  font-size: 0.78rem;
}

.tag-post-desc {
  margin: 0.7rem 0 0;
  color: var(--vp-c-text-2);
  line-height: 1.7;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.tag-post-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.85rem;
}

.tag-post-tag {
  display: inline-flex;
  align-items: center;
  padding: 0.28rem 0.72rem;
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.05);
  color: var(--vp-c-text-2);
  font-size: 0.75rem;
  transition: background 0.2s ease, color 0.2s ease;
}

.tag-post-tag.highlight {
  background: rgba(15, 23, 42, 0.92);
  color: #f8fafc;
}

.tag-post-tag.is-hot {
  color: var(--vp-c-brand-1);
  background: rgba(37, 99, 235, 0.08);
}

.tag-post-tag.is-hot.highlight {
  background: rgba(15, 23, 42, 0.92);
  color: #f8fafc;
}

.tags-empty {
  padding: 2rem 1rem;
  border-radius: 18px;
  background: rgba(15, 23, 42, 0.04);
  color: var(--vp-c-text-2);
  text-align: center;
}

.dark .tag-button,
.dark .tag-post-card {
  border-color: rgba(148, 163, 184, 0.14);
  background: rgba(15, 23, 42, 0.78);
}

.dark .tag-button.active,
.dark .tag-post-tag.highlight,
.dark .tag-post-tag.is-hot.highlight {
  background: rgba(96, 165, 250, 0.18);
  color: #dbeafe;
  border-color: transparent;
}

.dark .tag-post-date,
.dark .tag-count {
  background: rgba(148, 163, 184, 0.12);
}

@media (max-width: 768px) {
  .tag-post-head {
    flex-direction: column;
  }
}
</style>
