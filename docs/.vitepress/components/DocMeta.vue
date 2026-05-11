<script setup lang="ts">
import { computed, ref, onMounted, watch, nextTick } from 'vue'
import { useData } from 'vitepress'

const { frontmatter, page, site } = useData()

const sectionMap: Record<string, { code: string; name: string }> = {
  python: { code: 'PY', name: 'Python 工程实践' },
  algorithm: { code: 'ALGO', name: '算法与数据结构' },
  notes: { code: 'OPS', name: '技术笔记 / Linux' },
  ai: { code: 'AI', name: 'AI 应用落地' },
  tools: { code: 'TOOLS', name: '常用工具' },
  prompts: { code: 'PROMPT', name: '提示词库' },
  skills: { code: 'SKILL', name: '技能库' }
}

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

const articleTitle = computed(() => frontmatter.value.title || page.value.title)
const articleDescription = computed(() => frontmatter.value.description || '')

const articleSection = computed(() => {
  const path = page.value.relativePath.replace(/\\/g, '/')
  const root = path.split('/')[0]
  return sectionMap[root] || { code: 'DOC', name: '技术文章' }
})

const authorName = computed(() => {
  return frontmatter.value.author || site.value.themeConfig?.siteTitle || 'Admin'
})

const authorInitial = computed(() => {
  const name = authorName.value
  if (!name) return 'A'
  return name.charAt(0).toUpperCase()
})

const avatarGradient = computed(() => {
  const name = authorName.value
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  const palettes = [
    ['#2563EB', '#0F766E'],
    ['#0F766E', '#0891B2'],
    ['#1D4ED8', '#1E3A8A'],
    ['#0F766E', '#134E4A']
  ]
  return palettes[Math.abs(hash) % palettes.length]
})

const wordCount = ref(0)
const readingTime = ref(0)

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

const formatWordCount = (count: number) => {
  if (count < 1000) return count.toString()
  return (count / 1000).toFixed(1) + 'k'
}

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

onMounted(() => {
  nextTick(() => {
    requestAnimationFrame(calculateReadingStats)
  })
})
</script>

<template>
  <div class="doc-meta-container">
    <header class="article-header">
      <div class="article-kicker">
        <span class="article-code">{{ articleSection.code }}</span>
        <span class="article-section">{{ articleSection.name }}</span>
      </div>
      <h1 v-if="articleTitle" class="article-title">{{ articleTitle }}</h1>
      <p v-if="articleDescription" class="article-description">{{ articleDescription }}</p>
    </header>

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

.article-header {
  padding: 1.35rem 1.4rem 1.25rem;
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: var(--radius-xl);
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.97), rgba(248, 250, 252, 0.99)),
    linear-gradient(135deg, rgba(37, 99, 235, 0.03), rgba(15, 23, 42, 0.02));
  box-shadow: 0 18px 36px rgba(15, 23, 42, 0.05);
}

.article-kicker {
  display: inline-flex;
  align-items: center;
  gap: 0.65rem;
  margin-bottom: 0.95rem;
}

.article-code {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 3.9rem;
  padding: 0.26rem 0.72rem;
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.92);
  color: #f8fafc;
  font-size: 0.76rem;
  font-weight: 700;
  letter-spacing: 0.08em;
}

.article-section {
  color: var(--vp-c-text-3);
  font-size: 0.88rem;
  font-weight: 600;
}

.article-title {
  margin: 0;
  font-size: clamp(2rem, 1.7rem + 0.9vw, 2.65rem);
  font-weight: 800;
  line-height: 1.22;
  letter-spacing: -0.02em;
  color: var(--vp-c-text-1);
}

.article-description {
  margin: 1rem 0 0;
  max-width: 64ch;
  color: var(--vp-c-text-2);
  line-height: 1.9;
  font-size: 0.98rem;
}

.doc-meta-card {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 0.95rem;
  padding: 0.85rem 1rem;
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: var(--radius-lg);
  background: rgba(255, 255, 255, 0.78);
}

.meta-left {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  flex-wrap: wrap;
}

.author-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: #fff;
  font-size: 0.8rem;
  font-weight: 700;
  line-height: 1;
  box-shadow: 0 4px 10px rgba(15, 23, 42, 0.12);
}

.meta-text {
  display: inline-flex;
  align-items: center;
  gap: 0.24rem;
  font-size: 0.82rem;
  color: var(--vp-c-text-2);
  white-space: nowrap;
}

.author-name {
  font-weight: 700;
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

.meta-tags {
  display: flex;
  align-items: center;
  gap: 0.42rem;
  margin-left: auto;
  flex-wrap: wrap;
}

.meta-tag {
  display: inline-flex;
  align-items: center;
  padding: 0.24rem 0.7rem;
  background: rgba(15, 23, 42, 0.05);
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 999px;
  font-size: 0.74rem;
  font-weight: 600;
  color: var(--vp-c-text-2);
  text-decoration: none;
  transition: transform 0.2s ease, border-color 0.2s ease, color 0.2s ease, background 0.2s ease;
  cursor: pointer;
  white-space: nowrap;
}

.meta-tag:hover {
  transform: translateY(-1px);
  border-color: rgba(37, 99, 235, 0.22);
  background: rgba(37, 99, 235, 0.08);
  color: var(--vp-c-brand-1);
}

.dark .article-header {
  border-color: rgba(59, 130, 246, 0.15);
  background: rgba(15, 23, 42, 0.82);
  box-shadow: 0 18px 36px rgba(2, 6, 23, 0.4), 0 0 15px rgba(59, 130, 246, 0.06);
}

.dark .doc-meta-card {
  border-color: rgba(59, 130, 246, 0.15);
  background: rgba(15, 23, 42, 0.82);
  box-shadow: 0 0 12px rgba(59, 130, 246, 0.05);
}

.dark .author-avatar {
  box-shadow: 0 6px 14px rgba(2, 6, 23, 0.4);
}

.dark .meta-tag {
  border-color: rgba(148, 163, 184, 0.14);
  background: rgba(148, 163, 184, 0.08);
}

@media (max-width: 640px) {
  .article-header {
    padding: 1.15rem 1rem 1.05rem;
    border-radius: var(--radius-lg);
  }

  .article-title {
    font-size: 1.7rem;
  }

  .article-description {
    font-size: 0.93rem;
  }

  .doc-meta-card {
    padding: 0.8rem 0.85rem;
  }

  .meta-tags {
    margin-left: 0;
    width: 100%;
    padding-top: 0.35rem;
    border-top: 1px solid rgba(15, 23, 42, 0.08);
  }
}
</style>
