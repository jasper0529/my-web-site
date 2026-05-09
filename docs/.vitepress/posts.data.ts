import { createContentLoader } from 'vitepress'

// 文章数据接口
export interface Post {
  title: string
  date: string
  tags: string[]
  link: string
  description: string
  cover?: string
  author?: string
}

// 按年份分组的接口
export interface GroupedPost {
  year: string
  posts: Post[]
}

// 分类接口
export interface Category {
  name: string
  icon: string
  link: string
  description: string
  children: Post[]
}

// 解析日期
function parseDate(value: unknown): string {
  if (typeof value === 'string') {
    return value
  }
  if (value instanceof Date) {
    return value.toISOString().split('T')[0]
  }
  return new Date().toISOString().split('T')[0]
}

// 解析 YAML 数组
function parseYamlArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map(v => String(v))
  }
  if (typeof value === 'string') {
    return value
      .replace(/[\[\]]/g, '')
      .split(',')
      .map(s => s.trim().replace(/^['"]|['"]$/g, ''))
      .filter(Boolean)
  }
  return []
}

// 分类配置
const categoryConfig: Record<string, { name: string, icon: string, description: string }> = {
  'python': { name: 'Python 学习', icon: '🐍', description: '系统学习 Python 编程' },
  'algorithm': { name: '算法与数据结构', icon: '📊', description: '深入理解算法原理' },
  'notes': { name: '技术笔记', icon: '📝', description: '开发心得与问题解决方案' },
  'tools': { name: '常用工具', icon: '🛠️', description: '精选开发工具推荐' },
  'others': { name: '其他内容', icon: '📚', description: '关于我、归档等' }
}

declare const data: { 
  posts: Post[], 
  groupedPosts: GroupedPost[],
  categories: Category[],
  stats: { totalPosts: number, totalTags: number, categories: number }
}
export { data }

export default createContentLoader(['**/*.md'], {
  transform(raw): { 
    posts: Post[], 
    groupedPosts: GroupedPost[],
    categories: Category[],
    stats: { totalPosts: number, totalTags: number, categories: number }
  } {
    // 过滤并转换数据
    const allPosts: Post[] = raw
      .filter(page => {
        // 排除站点首页
        if (page.url === '/') {
          return false
        }
  
        // 排除目录首页（以 / 结尾且非根路径的 index 页面）
        if (page.url !== '/' && page.url.endsWith('/')) {
          return false
        }
  
        // 排除特殊页面
        const excludePatterns = [
          '/others/about',
          '/others/archives',
          '/others/sitemap-page',
          '/others/update',
          '/tags/',
          '/notes/code-group-demo'
        ]
        if (excludePatterns.some(pattern => page.url.includes(pattern))) {
          return false
        }
  
        // 确保有 frontmatter 和 date（只有带 date 的才是文章）
        const frontmatter = page.frontmatter
        if (!frontmatter || !frontmatter.title || !frontmatter.date) {
          return false
        }
  
        return true
      })
      .map(page => {
        const frontmatter = page.frontmatter
        return {
          title: String(frontmatter.title || 'Untitled'),
          date: parseDate(frontmatter.date),
          tags: parseYamlArray(frontmatter.tags),
          link: page.url,
          description: String(frontmatter.description || ''),
          cover: frontmatter.cover ? String(frontmatter.cover) : undefined,
          author: frontmatter.author ? String(frontmatter.author) : undefined
        }
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    // 按年份分组
    const groupedMap = new Map<string, Post[]>()
    allPosts.forEach(post => {
      const year = new Date(post.date).getFullYear().toString()
      if (!groupedMap.has(year)) {
        groupedMap.set(year, [])
      }
      groupedMap.get(year)!.push(post)
    })

    // 转换为数组并按年份降序排序
    const groupedPosts: GroupedPost[] = Array.from(groupedMap.entries())
      .map(([year, posts]) => ({
        year,
        posts: posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      }))
      .sort((a, b) => Number(b.year) - Number(a.year))

    // 按分类分组
    const categoryMap = new Map<string, Post[]>()
    allPosts.forEach(post => {
      // 从链接中提取分类
      const parts = post.link.split('/').filter(Boolean)
      if (parts.length > 0) {
        const category = parts[0]
        if (!categoryMap.has(category)) {
          categoryMap.set(category, [])
        }
        categoryMap.get(category)!.push(post)
      }
    })

    // 构建分类数组
    const categories: Category[] = Array.from(categoryMap.entries())
      .map(([key, posts]) => {
        const config = categoryConfig[key] || { 
          name: key.charAt(0).toUpperCase() + key.slice(1), 
          icon: '📁', 
          description: '' 
        }
        return {
          name: config.name,
          icon: config.icon,
          link: `/${key}/`,
          description: config.description,
          children: posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        }
      })
      .sort((a, b) => b.children.length - a.children.length)

    // 统计信息
    const allTags = new Set<string>()
    allPosts.forEach(post => {
      post.tags.forEach(tag => allTags.add(tag))
    })

    const stats = {
      totalPosts: allPosts.length,
      totalTags: allTags.size,
      categories: categories.length
    }

    return { posts: allPosts, groupedPosts, categories, stats }
  }
})
