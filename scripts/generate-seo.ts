/**
 * SEO 生成脚本
 * 生成 sitemap.xml 和 RSS feed
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import { glob } from 'glob'
import matter from 'gray-matter'
import { SitemapStream, streamToPromise } from 'sitemap'
import { Feed } from 'feed'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const docsDir = path.resolve(__dirname, '../docs')
const publicDir = path.resolve(docsDir, 'public')

// 站点配置
const SITE_URL = process.env.SITE_URL || 'https://jasper-labs.cn'
const SITE_TITLE = 'Jasper Labs'
const SITE_DESCRIPTION = '个人知识库和博客网站，包含Python、算法、技术笔记等内容'
const AUTHOR_NAME = 'Jasper'
const AUTHOR_EMAIL = 'fanren123@protonmail.com'

// 需要排除的路径
const EXCLUDE_PATHS = [
  '/tags/',
  '/others/about',
  '/others/index'
]

interface PageData {
  url: string
  title: string
  description: string
  date: Date
  tags?: string[]
  content?: string
}

function sanitizeText(text: string): string {
  return text
    ? text
        .replace(/<[^>]+>/g, '')
        .replace(/[*_`~]/g, '')
        .replace(/\s+/g, ' ')
        .trim()
    : ''
}

/**
 * 规范化 URL，移除双斜杠
 */
function normalizeUrl(url: string): string {
  return url.replace(/\/+/g, '/').replace(/^(https?:\/)/, '$1/')
}

/**
 * 读取 markdown 文件的 frontmatter
 */
function readMarkdownFile(filePath: string): PageData | null {
  try {
    const content = fs.readFileSync(filePath, 'utf-8')
    const { data, content: body } = matter(content)
    
    // 转换文件路径为 URL
    let relativePath = path.relative(docsDir, filePath)
      .replace(/\.md$/, '')
      .replace(/\\/g, '/')
    
    // 规范化路径：处理 index 文件
    if (relativePath === 'index') {
      relativePath = ''
    } else if (relativePath.endsWith('/index')) {
      relativePath = relativePath.slice(0, -6)
    }
    
    // 构建 URL，确保没有双斜杠
    const url = relativePath === '' ? '/' : normalizeUrl(`/${relativePath}/`)
    
    // 检查是否在排除列表中
    if (EXCLUDE_PATHS.some(exclude => url.startsWith(exclude))) {
      return null
    }
    
    return {
      url,
      title: data.title || 'Untitled',
      description: sanitizeText(data.description || ''),
      date: data.date ? new Date(data.date) : getModifiedDate(filePath),
      tags: data.tags || [],
      content: body
    }
  } catch (error) {
    console.warn(`Warning: Could not read ${filePath}`)
    return null
  }
}

/**
 * 获取文件的最后修改时间
 */
function getModifiedDate(filePath: string): Date {
  try {
    const stats = fs.statSync(filePath)
    return stats.mtime
  } catch {
    return new Date()
  }
}

/**
 * 获取所有 markdown 文件
 */
async function getAllMarkdownFiles(): Promise<string[]> {
  const pattern = path.join(docsDir, '**/*.md').replace(/\\/g, '/')
  const files = await glob(pattern, {
    ignore: [
      '**/node_modules/**',
      '**/.vitepress/**'
    ]
  })
  return files
}

/**
 * 生成 sitemap.xml
 */
async function generateSitemap(pages: PageData[]): Promise<void> {
  console.log('📊 Generating sitemap.xml...')
  
  const sitemap = new SitemapStream({
    hostname: SITE_URL
  })
  
  // 添加首页
  sitemap.write({
    url: '/',
    changefreq: 'daily',
    priority: 1.0,
    lastmod: new Date().toISOString()
  })
  
  // 去重：使用 Map 按 URL 去重，跳过首页（已手动添加）
  const uniquePages = new Map<string, PageData>()
  for (const page of pages) {
    // 跳过首页，避免与手动添加的首页重复
    if (page.url === '/') continue
    if (!uniquePages.has(page.url)) {
      uniquePages.set(page.url, page)
    }
  }
  
  // 添加所有页面（已去重）
  for (const page of uniquePages.values()) {
    // 确保URL不以双斜杠开头
    const cleanUrl = page.url.startsWith('/') ? page.url : `/${page.url}`
    sitemap.write({
      url: cleanUrl,
      changefreq: getPageChangefreq(page.url),
      priority: getPagePriority(page.url),
      lastmod: page.date.toISOString()
    })
  }
  
  sitemap.end()
  
  const sitemapXml = await streamToPromise(sitemap)
  const sitemapPath = path.join(publicDir, 'sitemap.xml')
  
  // 确保 public 目录存在
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true })
  }
  
  fs.writeFileSync(sitemapPath, sitemapXml.toString())
  console.log(`✅ sitemap.xml generated with ${uniquePages.size} pages`)
}

/**
 * 根据页面路径获取更新频率
 */
function getPageChangefreq(url: string): string {
  if (url === '/') return 'daily'
  if (url.endsWith('/') && url.split('/').length <= 3) return 'weekly'
  return 'monthly'
}

/**
 * 根据页面路径获取优先级
 */
function getPagePriority(url: string): number {
  if (url === '/') return 1.0
  if (url.startsWith('/python/')) return 0.9
  if (url.startsWith('/algorithm/')) return 0.9
  if (url.startsWith('/ai/')) return 0.9
  if (url.startsWith('/notes/')) return 0.8
  if (url.startsWith('/tools/')) return 0.7
  if (url.startsWith('/skills/')) return 0.7
  if (url.startsWith('/prompts/')) return 0.7
  return 0.6
}

/**
 * 生成 RSS feed
 */
async function generateRSSFeed(pages: PageData[]): Promise<void> {
  console.log('📡 Generating RSS feed...')
  
  const feed = new Feed({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    id: SITE_URL,
    link: SITE_URL,
    language: 'zh-CN',
    image: `${SITE_URL}/images/logo.svg`,
    favicon: `${SITE_URL}/images/logo.ico`,
    copyright: `Copyright © ${new Date().getFullYear()} ${AUTHOR_NAME}`,
    updated: new Date(),
    feedLinks: {
      rss2: `${SITE_URL}/rss.xml`,
      atom: `${SITE_URL}/atom.xml`,
      json: `${SITE_URL}/feed.json`
    },
    author: {
      name: AUTHOR_NAME,
      email: AUTHOR_EMAIL,
      link: SITE_URL
    }
  })
  
  // 按日期排序，取最新的 20 篇文章
  const recentPages = pages
    .filter(page => page.date && page.title !== '概览')
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 20)
  
  for (const page of recentPages) {
    feed.addItem({
      title: page.title,
      id: `${SITE_URL}${page.url}`,
      link: `${SITE_URL}${page.url}`,
      description: page.description || page.title,
      date: page.date,
      category: page.tags?.map(tag => ({ name: tag })) || []
    })
  }
  
  // 确保 public 目录存在
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true })
  }
  
  // 生成多种格式的 feed
  fs.writeFileSync(path.join(publicDir, 'rss.xml'), feed.rss2())
  fs.writeFileSync(path.join(publicDir, 'atom.xml'), feed.atom1())
  fs.writeFileSync(path.join(publicDir, 'feed.json'), feed.json1())
  
  console.log('✅ RSS feed generated:')
  console.log('   - rss.xml (RSS 2.0)')
  console.log('   - atom.xml (Atom 1.0)')
  console.log('   - feed.json (JSON Feed)')
}

/**
 * 主函数
 */
async function main(): Promise<void> {
  console.log('🚀 Starting SEO generation...\n')
  
  // 获取所有 markdown 文件
  const files = await getAllMarkdownFiles()
  console.log(`📄 Found ${files.length} markdown files`)
  
  // 读取所有页面数据
  const pages: PageData[] = []
  for (const file of files) {
    const pageData = readMarkdownFile(file)
    if (pageData) {
      pages.push(pageData)
    }
  }
  
  console.log(`📑 Processing ${pages.length} pages\n`)
  
  // 生成 sitemap
  await generateSitemap(pages)
  
  // 生成 RSS feed
  await generateRSSFeed(pages)
  
  console.log('\n🎉 SEO generation completed!')
}

main().catch(console.error)
