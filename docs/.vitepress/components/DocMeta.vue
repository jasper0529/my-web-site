<script setup lang="ts">
import { computed, ref, onMounted, watch } from 'vue'
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

// 阅读统计相关
const wordCount = ref(0)
const readingTime = ref(0)

// 计算阅读字数和时间
const calculateReadingStats = () => {
  if (typeof document === 'undefined') return
  
  // 获取文档内容区域
  const docContent = document.querySelector('.vp-doc')
  if (!docContent) {
    wordCount.value = 0
    readingTime.value = 0
    return
  }
  
  // 获取纯文本内容
  const text = docContent.textContent || ''
  
  // 计算中文字符数
  const chineseChars = (text.match(/[\u4e00-\u9fa5]/g) || []).length
  
  // 计算英文单词数
  const englishWords = text.replace(/[\u4e00-\u9fa5]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 0).length
  
  // 计算代码块数量
  const codeBlocks = docContent.querySelectorAll('div[class*="language-"]')?.length || 0
  
  // 总字数 = 中文字符 + 英文单词
  wordCount.value = chineseChars + englishWords
  
  // 阅读时间计算（中文约 300 字/分钟，英文约 200 词/分钟）
  const chineseTime = chineseChars / 300
  const englishTime = englishWords / 200
  const codeTime = codeBlocks / 5
  
  // 总阅读时间（分钟），向上取整，最少 1 分钟
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
      // 立即重置统计数据
      wordCount.value = 0
      readingTime.value = 0
      // 延迟后重新计算
      setTimeout(calculateReadingStats, 500)
    }
  }
)

// 组件挂载时计算
onMounted(() => {
  setTimeout(calculateReadingStats, 200)
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
        
        <!-- 阅读字数 -->
        <span v-if="wordCount > 0" class="meta-item words">
          <span class="icon">📝</span>
          <span class="label">字数</span>
          <span class="value">{{ formatWordCount(wordCount) }} 字</span>
        </span>
        
        <!-- 阅读时间 -->
        <span v-if="readingTime > 0" class="meta-item time">
          <span class="icon">⏱️</span>
          <span class="label">阅读</span>
          <span class="value">约 {{ readingTime }} 分钟</span>
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
