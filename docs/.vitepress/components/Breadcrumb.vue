<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'

const { page, frontmatter } = useData()

// 定义路径映射
const pathMap: Record<string, { name: string, icon: string }> = {
  'python': { name: 'Python 学习', icon: '🐍' },
  'algorithm': { name: '算法与数据结构', icon: '📊' },
  'notes': { name: '技术笔记', icon: '📝' },
  'tools': { name: '常用工具', icon: '🛠️' },
  'others': { name: '其他', icon: '📚' },
  'tags': { name: '标签分类', icon: '🏷️' },
  'basics': { name: '基础语法', icon: '🚀' },
  'advanced': { name: '进阶特性', icon: '⚡' },
  'data-structure': { name: '数据结构', icon: '🏗️' },
  'leetcode': { name: 'LeetCode', icon: '🎯' },
  'sorting': { name: '排序算法', icon: '📈' }
}

// 计算面包屑路径
const breadcrumbs = computed(() => {
  const path = page.value.relativePath.replace(/\.md$/, '').replace(/\\/g, '/')
  const parts = path.split('/').filter(Boolean)
  
  // 如果是首页，不显示面包屑
  if (parts.length <= 1 && (parts[0] === 'index' || path === '')) {
    return []
  }
  
  const result: Array<{ name: string; icon?: string; path?: string }> = [
    { name: '首页', icon: '🏠', path: '/' }
  ]
  
  let accumulatedPath = ''
  
  parts.forEach((part, index) => {
    accumulatedPath += '/' + part
    
    // 跳过 index 文件
    if (part === 'index' && index === parts.length - 1) {
      return
    }
    
    // 获取路径信息
    const info = pathMap[part]
    
    if (info) {
      result.push({
        name: info.name,
        icon: info.icon,
        path: index === parts.length - 1 && parts[parts.length - 1] !== 'index' 
          ? undefined 
          : accumulatedPath + '/'
      })
    } else {
      // 如果是文章文件名，使用 frontmatter 中的标题
      const title = frontmatter.value.title || part
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
        <span v-if="index > 0" class="breadcrumb-separator">/</span>
        <a v-if="item.path" :href="item.path" class="breadcrumb-link">
          <span v-if="item.icon" class="breadcrumb-icon">{{ item.icon }}</span>
          <span class="breadcrumb-text">{{ item.name }}</span>
        </a>
        <span v-else class="breadcrumb-current">
          <span v-if="item.icon" class="breadcrumb-icon">{{ item.icon }}</span>
          <span class="breadcrumb-text">{{ item.name }}</span>
        </span>
      </li>
    </ol>
  </nav>
</template>

<style scoped>
.breadcrumb {
  margin-bottom: 1rem;
  padding: 0.75rem 1rem;
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
  gap: 0.25rem;
}

.breadcrumb-item {
  display: flex;
  align-items: center;
  font-size: 0.875rem;
}

.breadcrumb-separator {
  color: var(--vp-c-text-3);
  margin: 0 0.5rem;
  user-select: none;
}

.breadcrumb-link {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  color: var(--vp-c-text-2);
  text-decoration: none;
  transition: color 0.2s ease;
}

.breadcrumb-link:hover {
  color: var(--vp-c-brand-1);
}

.breadcrumb-current {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  color: var(--vp-c-text-1);
  font-weight: 500;
}

.breadcrumb-icon {
  font-size: 1rem;
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
  
  .breadcrumb-icon {
    font-size: 0.875rem;
  }
}

/* 隐藏首页的面包屑 */
@media (max-width: 480px) {
  .breadcrumb-text {
    max-width: 80px;
  }
}
</style>
