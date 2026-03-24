import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const docsDir = path.resolve(__dirname, '../../')

interface SidebarItem {
  text: string
  link?: string
  collapsed?: boolean
  items?: SidebarItem[]
}

interface SidebarConfig {
  [key: string]: SidebarItem[]
}

// 目录标题映射
const categoryTitles: Record<string, string> = {
  'python': 'Python',
  'algorithm': '算法',
  'notes': '技术笔记',
  'tools': '常用工具',
  'others': '其他内容',
  'ai': 'AI 专题',
  'basics': '基础',
  'advanced': '进阶特性',
  'libraries': '常用库',
  'data-structure': '数据结构',
  'leetcode': 'LeetCode 刷题',
  'sorting': '排序算法',
  'topics': '专题系列',
  '2024': '2024'
}

// 特定文件的标题覆盖
const fileTitleOverrides: Record<string, string> = {
  'others/about': '关于我',
  'others/archives': '文章归档',
  'others/sitemap-page': '站点地图',
  'others/update': '网站更新记录'
}

// 从文件名生成标题
function generateTitle(filename: string): string {
  // 移除扩展名
  const name = filename.replace(/\.md$/, '')
  
  // 处理特殊文件名
  if (name === 'index') return '概览'
  
  // 将 kebab-case 或空格分隔转换为标题
  return name
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase())
    .trim()
}

// 获取目录下的所有 markdown 文件
function getMarkdownFiles(dir: string): string[] {
  try {
    const files = fs.readdirSync(dir)
    return files
      .filter(file => file.endsWith('.md'))
      .sort((a, b) => {
        // index.md 排在最前面
        if (a === 'index.md') return -1
        if (b === 'index.md') return 1
        return a.localeCompare(b, 'zh-CN')
      })
  } catch {
    return []
  }
}

// 获取子目录
function getSubdirectories(dir: string): string[] {
  try {
    const items = fs.readdirSync(dir, { withFileTypes: true })
    return items
      .filter(item => item.isDirectory() && !item.name.startsWith('.'))
      .map(item => item.name)
      .sort((a, b) => a.localeCompare(b, 'zh-CN'))
  } catch {
    return []
  }
}

// 生成单个目录的侧边栏项
function generateSidebarItems(
  dirPath: string,
  basePath: string,
  maxDepth: number = 3,
  currentDepth: number = 0
): SidebarItem[] {
  const items: SidebarItem[] = []
  const subdirs = getSubdirectories(dirPath)
  const mdFiles = getMarkdownFiles(dirPath)

  // 如果当前目录有 markdown 文件，创建一个分组
  if (mdFiles.length > 0) {
    const categoryPath = path.basename(dirPath)
    const categoryTitle = categoryTitles[categoryPath] || generateTitle(categoryPath)
    
    const sidebarItems: SidebarItem[] = mdFiles.map(file => {
      const fileName = file.replace(/\.md$/, '')
      const link = fileName === 'index' ? basePath : `${basePath}${fileName}`
      const relativeKey = `${categoryPath}/${fileName}`
      const overrideTitle = fileTitleOverrides[relativeKey]
      
      return {
        text: fileName === 'index'
          ? `${categoryTitle}概览`
          : overrideTitle || generateTitle(file),
        link: link
      }
    })

    // 如果是顶级目录且有子目录，返回多个分组
    if (currentDepth === 0 && subdirs.length > 0) {
      items.push({
        text: categoryTitle,
        collapsed: false,
        items: sidebarItems
      })
    } else if (mdFiles.length === 1 && mdFiles[0] === 'index.md') {
      // 如果只有 index.md，直接添加链接
      if (currentDepth > 0) {
        items.push({
          text: categoryTitle,
          link: basePath
        })
      }
    } else {
      // 多个文件，创建分组
      items.push({
        text: categoryTitle,
        collapsed: currentDepth > 0,
        items: sidebarItems
      })
    }
  }

  // 递归处理子目录
  if (currentDepth < maxDepth) {
    for (const subdir of subdirs) {
      const subdirPath = path.join(dirPath, subdir)
      const subItems = generateSidebarItems(
        subdirPath,
        `${basePath}${subdir}/`,
        maxDepth,
        currentDepth + 1
      )

      if (subItems.length > 0) {
        if (currentDepth === 0) {
          // 顶级目录，直接添加子目录的分组
          items.push(...subItems)
        } else {
          // 嵌套目录，合并到当前分组
          const existingGroup = items.find(item => item.items)
          if (existingGroup && existingGroup.items) {
            existingGroup.items.push(...subItems)
          }
        }
      }
    }
  }

  return items
}

// 为特定路径生成侧边栏
function generateSidebarForPath(sectionPath: string): SidebarItem[] {
  const fullPath = path.join(docsDir, sectionPath)
  
  if (!fs.existsSync(fullPath)) {
    return []
  }

  return generateSidebarItems(fullPath, `/${sectionPath}/`)
}

// 生成完整的侧边栏配置
export function generateSidebar(): SidebarConfig {
  const sidebar: SidebarConfig = {}
  
  // 主要章节
  const sections = ['python', 'algorithm', 'notes', 'tools', 'others', 'ai']
  
  for (const section of sections) {
    const items = generateSidebarForPath(section)
    if (items.length > 0) {
      sidebar[`/${section}/`] = items
    }
  }
  
  return sidebar
}

// 导出一个函数来获取指定目录的侧边栏
export function getSidebar(pathPrefix: string): SidebarItem[] {
  return generateSidebarForPath(pathPrefix.replace(/^\/|\/$/g, ''))
}
