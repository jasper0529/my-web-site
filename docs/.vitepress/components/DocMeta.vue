<script setup lang="ts">
import { computed, ref, onMounted, watch, nextTick } from 'vue'
import { useData } from 'vitepress'

const { frontmatter, page, site } = useData()

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

// 作者信息
const authorName = computed(() => {
  return frontmatter.value.author || site.value.themeConfig?.siteTitle || 'Admin'
})

const authorInitial = computed(() => {
  const name = authorName.value
  if (!name) return 'A'
  // 取第一个字符（支持中文和英文）
  return name.charAt(0).toUpperCase()
})

// 基于作者名生成头像渐变色
const avatarGradient = computed(() => {
  const name = authorName.value
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  const palettes = [
    ['#2563EB', '#7C3AED'],
    ['#059669', '#0D9488'],
    ['#D97706', '#EA580C'],
    ['#DC2626', '#E11D48'],
    ['#7C3AED', '#EC4899'],
    ['#0891B2', '#2563EB'],
    ['#4F46E5', '#7C3AED'],
    ['#B45309', '#CA8A04'],
  ]
  const idx = Math.abs(hash) % palettes.length
  return palettes[idx]
})

// 阅读统计相关
const wordCount = ref(0)
const readingTime = ref(0)

// 计算阅读字数和时间
const calculateReadingStats = () => {
  if (typeof document === 'undefined') return

  const docContent = document.querySelector('.vp-doc')
  if (!docContent) {
    wordCount.value = 0
    readingTime.value = 0
    return
  }

  const text = docContent.textContent || ''
  const chineseChars = (text.match(/[\u4e00-\u9fa5]/g) || []).length
  const englishWords = text.replace(/[\u4e00-\u9fa5]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 0).length
  const codeBlocks = docContent.querySelectorAll('div[class*="language-"]')?.length || 0

  wordCount.value = chineseChars + englishWords

  const chineseTime = chineseChars / 300
  const englishTime = englishWords / 200
  const codeTime = codeBlocks / 5

  readingTime.value = Math.max(1, Math.ceil(chineseTime + englishTime + codeTime))
}

// 格式化字数显示
const formatWordCount = (count: number) => {
  if (count < 1000) return count.toString()
  return (count / 1000).toFixed(1) + 'k'
}

// 监听页面路径变化
watch(
  () => page.value.relativePath,
  (newPath, oldPath) => {
    if (newPath !== oldPath) {
      wordCount.value = 0
      readingTime.value = 0
      nextTick(() => {
        requestAnimationFrame(calculateReadingStats)
      })
    }
  }
)

// 组件挂载时计算
onMounted(() => {
  nextTick(() => {
    requestAnimationFrame(calculateReadingStats)
  })
})
</script>

<template>
  <div class="doc-meta-container">
    <h1 v-if="articleTitle" class="article-title">{{ articleTitle }}</h1>
    <div v-if="hasMeta" class="doc-meta-card">
      <div class="meta-left">
        <div class="author-avatar" :style="{ background: `linear-gradient(135deg, ${avatarGradient[0]}, ${avatarGradient[1]})` }">
          {{ authorInitial }}
        </div>
        <span class="meta-text author-name">{{ authorName }}</span>
        <span v-if="frontmatter.date" class="meta-dot">·</span>
        <span v-if="frontmatter.date" class="meta-text meta-date">
          <svg class="meta-icon" viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          {{ formatDate(frontmatter.date) }}
        </span>
        <span v-if="wordCount > 0" class="meta-dot">·</span>
        <span v-if="wordCount > 0" class="meta-text">
          <svg class="meta-icon" viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
          {{ formatWordCount(wordCount) }} 字
        </span>
        <span v-if="readingTime > 0" class="meta-dot">·</span>
        <span v-if="readingTime > 0" class="meta-text">
          <svg class="meta-icon" viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          {{ readingTime }} 分钟
        </span>
      </div>
      <div v-if="frontmatter.tags && frontmatter.tags.length > 0" class="meta-tags">
        <a v-for="tag in frontmatter.tags" :key="tag" :href="`/tags/?tag=${encodeURIComponent(tag)}`" class="meta-tag">{{ tag }}</a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.doc-meta-container {
  margin-bottom: 1.5rem;
}

<style scoped>
.doc-meta-container {
  margin-bottom: 1.25rem;
}

.article-title {
  margin: 0 0 1rem 0;
  padding-bottom: 0.6rem;
  border-bottom: 2px solid var(--vp-c-brand-1);
  font-size: 2rem;
  font-weight: 700;
  line-height: 1.3;
  color: var(--vp-c-text-1);
}

.doc-meta-card {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.625rem;
  padding: 0.5rem 0.875rem;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  transition: border-color 0.3s, box-shadow 0.3s;
}

.doc-meta-card:hover {
  border-color: var(--vp-c-brand-1-dimm);
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.06);
}

/* 左侧信息 */
.meta-left {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  flex-wrap: wrap;
}

.author-avatar {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: #fff;
  font-size: 0.75rem;
  font-weight: 700;
  line-height: 1;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}

.meta-text {
  display: inline-flex;
  align-items: center;
  gap: 0.2rem;
  font-size: 0.8125rem;
  color: var(--vp-c-text-2);
  white-space: nowrap;
}

.author-name {
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.meta-date {
  color: var(--vp-c-text-3);
}

.meta-dot {
  color: var(--vp-c-text-3);
  font-size: 0.75rem;
  user-select: none;
}

.meta-icon {
  display: inline-flex;
  flex-shrink: 0;
  color: var(--vp-c-text-3);
  vertical-align: -1px;
}

/* 标签区域 — 推到右侧 */
.meta-tags {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  margin-left: auto;
  flex-wrap: wrap;
}

.meta-tag {
  display: inline-flex;
  align-items: center;
  padding: 0.1rem 0.45rem;
  background: var(--vp-c-brand-soft);
  border: 1px solid var(--vp-c-brand-1-dimm);
  border-radius: 10px;
  font-size: 0.7rem;
  font-weight: 500;
  color: var(--vp-c-brand-1);
  text-decoration: none;
  transition: all 0.2s;
  cursor: pointer;
  white-space: nowrap;
}

.meta-tag:hover {
  background: var(--vp-c-brand-1);
  color: #fff;
  border-color: var(--vp-c-brand-1);
  transform: translateY(-1px);
  box-shadow: 0 2px 6px rgba(37, 99, 235, 0.25);
}

/* 暗色模式 */
.dark .doc-meta-card {
  border-color: var(--glow-border, rgba(59, 130, 246, 0.12));
  background: rgba(15, 23, 42, 0.6);
}

.dark .doc-meta-card:hover {
  border-color: var(--glow-border-hover, rgba(59, 130, 246, 0.25));
  box-shadow: 0 2px 8px var(--glow-shadow, rgba(59, 130, 246, 0.08));
}

.dark .author-avatar {
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
}

.dark .meta-tag:hover {
  box-shadow: 0 2px 6px rgba(59, 130, 246, 0.35);
}

/* 响应式 */
@media (max-width: 640px) {
  .article-title {
    font-size: 1.5rem;
  }

  .doc-meta-card {
    padding: 0.5rem 0.75rem;
  }

  .meta-tags {
    margin-left: 0;
    width: 100%;
    padding-top: 0.25rem;
    border-top: 1px solid var(--vp-c-divider);
  }
}
</style>
