import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const docsDir = path.resolve(__dirname, '../docs')

// 分类到标签的映射
const categoryToTags: Record<string, string[]> = {
  'python': ['Python', '编程语言'],
  'algorithm': ['算法', '数据结构'],
  'notes': ['技术笔记'],
  'tools': ['工具', '效率'],
  'others': ['其他']
}

// 从文件名生成标题
function generateTitle(filename: string): string {
  const name = filename.replace(/\.md$/, '')
  if (name === 'index') return ''
  
  // 处理特殊命名
  return name
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase())
    .trim()
}

// 从文件路径推断标签
function inferTags(filePath: string): string[] {
  const parts = filePath.split(path.sep)
  const tags: string[] = []
  
  for (const part of parts) {
    if (categoryToTags[part]) {
      tags.push(...categoryToTags[part])
    }
  }
  
  return [...new Set(tags)]
}

// 生成描述
function generateDescription(title: string, content: string): string {
  // 从内容中提取前 160 个字符作为描述（搜索引擎通常显示 150-160 字符）
  const cleanContent = content
    .replace(/^---[\s\S]*?---/, '') // 移除 frontmatter
    .replace(/^#+\s.*$/gm, '') // 移除标题
    .replace(/```[\s\S]*?```/g, '') // 移除代码块
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // 移除链接，保留文本
    .replace(/<[^>]+>/g, '') // 移除 HTML 标签
    .replace(/[*_`~]/g, '') // 移除格式标记
    .replace(/[+\-|]/g, '') // 移除列表标记
    .replace(/\s+/g, ' ') // 合并空白
    .trim()

  // 截取 155 字符，在最近的完整句子或空格处截断
  const maxLength = 155
  if (cleanContent.length <= maxLength) return cleanContent
  
  const truncated = cleanContent.substring(0, maxLength)
  // 尝试在句号、感叹号、问号处截断
  const sentenceEnd = Math.max(
    truncated.lastIndexOf('。'),
    truncated.lastIndexOf('！'),
    truncated.lastIndexOf('？'),
    truncated.lastIndexOf('，'),
    truncated.lastIndexOf('；'),
    truncated.lastIndexOf(' ')
  )
  
  if (sentenceEnd > maxLength * 0.6) {
    return truncated.substring(0, sentenceEnd) + '…'
  }
  return truncated + '…'
}

// 处理单个文件
function processFile(filePath: string): void {
  const content = fs.readFileSync(filePath, 'utf-8')
  const relativePath = path.relative(docsDir, filePath)
  
  // 检查是否已有 frontmatter
  if (content.startsWith('---')) {
    console.log(`⏭️  跳过 ${relativePath} (已有 frontmatter)`)
    return
  }
  
  // 跳过 index.md 文件
  const filename = path.basename(filePath)
  if (filename === 'index.md') {
    console.log(`⏭️  跳过 ${relativePath} (索引文件)`)
    return
  }
  
  // 生成 frontmatter
  const title = generateTitle(filename)
  if (!title) {
    console.log(`⏭️  跳过 ${relativePath} (无法生成标题)`)
    return
  }
  
  const tags = inferTags(relativePath)
  const date = new Date().toISOString().split('T')[0]
  const description = generateDescription(title, content)
  
  const frontmatter = `---
title: ${title}
date: ${date}
tags: [${tags.map(t => `'${t}'`).join(', ')}]
description: ${description}
---

`
  
  // 写入文件
  fs.writeFileSync(filePath, frontmatter + content, 'utf-8')
  console.log(`✅ 已添加 frontmatter: ${relativePath}`)
  console.log(`   标题: ${title}`)
  console.log(`   标签: ${tags.join(', ')}`)
}

// 递归处理目录
function processDirectory(dir: string): void {
  const items = fs.readdirSync(dir, { withFileTypes: true })
  
  for (const item of items) {
    const fullPath = path.join(dir, item.name)
    
    if (item.isDirectory()) {
      // 跳过特殊目录
      if (item.name.startsWith('.') || item.name === 'public') {
        continue
      }
      processDirectory(fullPath)
    } else if (item.name.endsWith('.md')) {
      processFile(fullPath)
    }
  }
}

// 主函数
function main(): void {
  console.log('🚀 开始自动生成 frontmatter...\n')
  console.log(`📁 扫描目录: ${docsDir}\n`)
  
  if (!fs.existsSync(docsDir)) {
    console.error('❌ docs 目录不存在')
    process.exit(1)
  }
  
  processDirectory(docsDir)
  
  console.log('\n✨ 完成!')
}

main()
