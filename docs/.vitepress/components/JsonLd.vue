<script setup lang="ts">
import { computed, onMounted, watch, h } from 'vue'
import { useData } from 'vitepress'

const { frontmatter, page, site } = useData()

const siteUrl = 'https://jasper-labs.cn'

// 生成结构化数据
const jsonLd = computed(() => {
  const title = frontmatter.value.title || page.value.title
  const description = frontmatter.value.description || site.value.description
  const url = `${siteUrl}${page.value.path}`
  const date = frontmatter.value.date
  const tags = frontmatter.value.tags || []
  
  // 如果是文章页面，添加 Article 结构化数据（TechArticle 更精确）
  if (date && frontmatter.value.layout !== 'home') {
    const publishedDate = new Date(date).toISOString()
    // dateModified 优先使用 lastUpdated，否则使用发布时间
    const modifiedDate = frontmatter.value.lastUpdated
      ? new Date(frontmatter.value.lastUpdated).toISOString()
      : publishedDate
    
    return {
      '@context': 'https://schema.org',
      '@type': 'TechArticle',
      'headline': title,
      'description': description,
      'url': url,
      'datePublished': publishedDate,
      'dateModified': modifiedDate,
      'inLanguage': 'zh-CN',
      'author': {
        '@type': 'Person',
        'name': frontmatter.value.author || 'Jasper',
        'url': siteUrl
      },
      'publisher': {
        '@type': 'Organization',
        'name': 'Jasper Labs',
        'url': siteUrl,
        'logo': {
          '@type': 'ImageObject',
          'url': `${siteUrl}/images/logo.svg`
        }
      },
      'mainEntityOfPage': {
        '@type': 'WebPage',
        '@id': url
      },
      'keywords': tags.join(', '),
      'articleSection': getArticleSection(page.value.relativePath),
      'wordCount': frontmatter.value.wordCount || undefined
    }
  }
  
  // 如果是首页，添加 WebSite 结构化数据
  if (page.value.path === '/') {
    return {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      'name': site.value.title,
      'description': site.value.description,
      'url': siteUrl,
      'inLanguage': 'zh-CN',
      'potentialAction': {
        '@type': 'SearchAction',
        'target': {
          '@type': 'EntryPoint',
          'urlTemplate': `${siteUrl}/search?q={search_term_string}`
        },
        'query-input': 'required name=search_term_string'
      }
    }
  }
  
  // 默认 WebPage 结构化数据
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    'name': title,
    'description': description,
    'url': url,
    'inLanguage': 'zh-CN',
    'isPartOf': {
      '@type': 'WebSite',
      'name': site.value.title,
      'url': siteUrl
    }
  }
})

// 获取文章分类
function getArticleSection(path: string): string {
  if (path.startsWith('python/')) return 'Python 编程'
  if (path.startsWith('algorithm/')) return '算法与数据结构'
  if (path.startsWith('ai/')) return 'AI 人工智能'
  if (path.startsWith('notes/')) return '技术笔记'
  if (path.startsWith('tools/')) return '工具推荐'
  if (path.startsWith('prompts/')) return '提示词工程'
  if (path.startsWith('skills/')) return '技能提升'
  return '技术'
}

// 动态插入 JSON-LD script 标签到 head
function insertJsonLd() {
  if (typeof document === 'undefined') return
  
  // 移除旧的 JSON-LD 标签
  const oldScript = document.querySelector('script[type="application/ld+json"]#json-ld')
  if (oldScript) {
    oldScript.remove()
  }
  
  // 创建新的 JSON-LD 标签
  const script = document.createElement('script')
  script.type = 'application/ld+json'
  script.id = 'json-ld'
  script.textContent = JSON.stringify(jsonLd.value)
  document.head.appendChild(script)
}

// 监听路由变化
watch(
  () => page.value.path,
  () => {
    setTimeout(insertJsonLd, 100)
  }
)

onMounted(() => {
  insertJsonLd()
})
</script>

<template>
  <!-- JSON-LD 通过 JavaScript 动态插入到 head 中 -->
</template>
