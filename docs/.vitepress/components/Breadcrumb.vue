<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { useData } from 'vitepress'

const { page, frontmatter } = useData()
const siteUrl = 'https://jasper-labs.cn'

// 通用名称格式化（避免每个目录手动硬编码）
const formatSegmentName = (segment: string) =>
  decodeURIComponent(segment)
    .replace(/[-_]/g, ' ')
    .trim()

// 定义路径映射（icon 字段保留用于数据标识，模板中用 SVG 替代）
const pathMap: Record<string, { name: string }> = {
  'python': { name: 'Python 学习' },
  'algorithm': { name: '算法与数据结构' },
  'notes': { name: '技术笔记' },
  'tools': { name: '常用工具' },
  'others': { name: '其他' },
  'tags': { name: '标签分类' },
  'basics': { name: '基础语法' },
  'advanced': { name: '进阶特性' },
  'data-structure': { name: '数据结构' },
  'leetcode': { name: 'LeetCode' },
  'sorting': { name: '排序算法' },
  'ai': { name: 'AI 专题' },
  'vibe-coding': { name: 'Vibe Coding' },
  'prompts': { name: '提示词库' },
  'skills': { name: 'Skills' },
  'linux': { name: 'Linux' }
}

// 计算面包屑路径
const breadcrumbs = computed(() => {
  const path = page.value.relativePath.replace(/\.md$/, '').replace(/\\/g, '/')
  const parts = path.split('/').filter(Boolean)

  // 如果是首页，不显示面包屑
  if (parts.length <= 1 && (parts[0] === 'index' || path === '')) {
    return []
  }

  const result: Array<{ name: string; path?: string }> = [
    { name: '首页', path: '/' }
  ]

  let accumulatedPath = ''

  parts.forEach((part, index) => {
    accumulatedPath += '/' + part
    const isLast = index === parts.length - 1

    // 跳过 index 文件
    if (part === 'index' && index === parts.length - 1) {
      return
    }

    // 获取路径信息
    const info = pathMap[part]

    if (info) {
      result.push({
        name: info.name,
        path: isLast ? undefined : accumulatedPath + '/'
      })
      return
    }

    // 未配置映射：目录使用格式化目录名并可点击，文件使用 frontmatter 标题
    if (!isLast) {
      result.push({
        name: formatSegmentName(part),
        path: accumulatedPath + '/'
      })
    } else {
      const title = frontmatter.value.title || formatSegmentName(part)
      result.push({
        name: title,
        path: undefined
      })
    }
  })

  return result
})

// 是否显示面包屑（首页不显示）
const showBreadcrumb = computed(() => {
  return breadcrumbs.value.length > 1
})

// 生成 BreadcrumbList JSON-LD 结构化数据
const breadcrumbJsonLd = computed(() => {
  if (!showBreadcrumb.value) return null

  const items = breadcrumbs.value.map((item, index) => ({
    '@type': 'ListItem',
    'position': index + 1,
    'name': item.name,
    ...(item.path ? { 'item': `${siteUrl}${item.path}` } : {})
  }))

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': items
  }
})

// 动态插入 BreadcrumbList JSON-LD
function insertBreadcrumbJsonLd() {
  if (typeof document === 'undefined' || !breadcrumbJsonLd.value) return

  // 移除旧的面包屑 JSON-LD
  const oldScript = document.querySelector('script[type="application/ld+json"]#breadcrumb-json-ld')
  if (oldScript) {
    oldScript.remove()
  }

  // 创建新的 JSON-LD 标签
  const script = document.createElement('script')
  script.type = 'application/ld+json'
  script.id = 'breadcrumb-json-ld'
  script.textContent = JSON.stringify(breadcrumbJsonLd.value)
  document.head.appendChild(script)
}

// 监听路由变化
watch(
  () => page.value.path,
  () => {
    setTimeout(insertBreadcrumbJsonLd, 150)
  }
)

onMounted(() => {
  setTimeout(insertBreadcrumbJsonLd, 100)
})
</script>

<template>
  <nav v-if="showBreadcrumb" class="breadcrumb" aria-label="面包屑导航">
    <ol class="breadcrumb-list">
      <li
        v-for="(item, index) in breadcrumbs"
        :key="index"
        class="breadcrumb-item"
        :class="{ 'is-current': !item.path }"
      >
        <span v-if="index > 0" class="breadcrumb-separator" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="14" height="14"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </span>
        <a v-if="item.path" :href="item.path" class="breadcrumb-link">
          <svg v-if="index === 0" class="breadcrumb-svg-icon" viewBox="0 0 24 24" width="14" height="14"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          <svg v-else class="breadcrumb-svg-icon" viewBox="0 0 24 24" width="14" height="14"><circle cx="12" cy="12" r="3" fill="currentColor" opacity="0.5"/></svg>
          <span class="breadcrumb-text">{{ item.name }}</span>
        </a>
        <span v-else class="breadcrumb-current">
          <svg class="breadcrumb-svg-icon breadcrumb-current-icon" viewBox="0 0 24 24" width="14" height="14"><path d="M9 12l2 2 4-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          <span class="breadcrumb-text">{{ item.name }}</span>
        </span>
      </li>
    </ol>
  </nav>
</template>

<style scoped>
.breadcrumb {
  margin-bottom: 1rem;
  padding: 0.6rem 1rem;
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
}

.breadcrumb-list {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 0;
}

.breadcrumb-item {
  display: flex;
  align-items: center;
  font-size: 0.875rem;
}

.breadcrumb-separator {
  display: flex;
  align-items: center;
  color: var(--vp-c-text-3);
  margin: 0 0.35rem;
  user-select: none;
  opacity: 0.5;
}

.breadcrumb-link {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  color: var(--vp-c-text-2);
  text-decoration: none;
  padding: 0.15rem 0.4rem;
  border-radius: 4px;
  transition: color 0.2s ease, background 0.2s ease;
}

.breadcrumb-link:hover {
  color: var(--vp-c-brand-1);
  background: rgba(37, 99, 235, 0.06);
}

.breadcrumb-current {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  color: var(--vp-c-brand-1);
  font-weight: 600;
  padding: 0.15rem 0.4rem;
  border-radius: 4px;
  background: rgba(37, 99, 235, 0.08);
}

.breadcrumb-svg-icon {
  display: inline-flex;
  flex-shrink: 0;
}

.breadcrumb-current-icon {
  color: var(--vp-c-brand-1);
}

.breadcrumb-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 150px;
}

/* 响应式设计 */
@media (max-width: 640px) {
  .breadcrumb {
    padding: 0.5rem 0.75rem;
    margin-bottom: 0.75rem;
  }

  .breadcrumb-item {
    font-size: 0.8125rem;
  }

  .breadcrumb-text {
    max-width: 100px;
  }
}

@media (max-width: 480px) {
  .breadcrumb-text {
    max-width: 80px;
  }
}
</style>

<style>
/* 暗色模式适配 */
.dark .breadcrumb {
  border-color: rgba(59, 130, 246, 0.12);
}

.dark .breadcrumb-link:hover {
  background: rgba(59, 130, 246, 0.1);
}

.dark .breadcrumb-current {
  background: rgba(59, 130, 246, 0.12);
}
</style>
