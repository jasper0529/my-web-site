import { defineConfig } from 'vitepress'
import { generateSidebar } from './utils/sidebar'
import { groupIconMdPlugin, groupIconVitePlugin } from 'vitepress-plugin-group-icons'

const SITE_URL = 'https://jasper-labs.cn'

function normalizeLooseInlineMath(md) {
  const pattern = /\$\s+([^$\n]+?)\s+\$/g

  md.core.ruler.push('normalize-loose-inline-math', (state) => {
    const Token = state.Token

    state.tokens.forEach((blockToken) => {
      if (blockToken.type !== 'inline' || !blockToken.children) return

      const newChildren: typeof blockToken.children = []

      blockToken.children.forEach((child) => {
        if (child.type !== 'text') {
          newChildren.push(child)
          return
        }

        const text = child.content
        pattern.lastIndex = 0
        let lastIndex = 0
        let match
        const segments: typeof blockToken.children = []

        while ((match = pattern.exec(text)) !== null) {
          if (match.index > lastIndex) {
            const before = new Token('text', '', 0)
            before.content = text.slice(lastIndex, match.index)
            segments.push(before)
          }

          const mathToken = new Token('math_inline', 'math', 0)
          mathToken.markup = '$'
          mathToken.content = match[1].trim()
          mathToken.info = 'tex'
          segments.push(mathToken)

          lastIndex = pattern.lastIndex
        }

        if (segments.length) {
          if (lastIndex < text.length) {
            const after = new Token('text', '', 0)
            after.content = text.slice(lastIndex)
            segments.push(after)
          }

          newChildren.push(...segments)
        } else {
          newChildren.push(child)
        }
      })

      blockToken.children = newChildren
    })
  })
}

function normalizeFontStrong(md) {
  const fontStrongPattern = /\*\*<font([^>]*)>([\s\S]*?)<\/font>\*\*/g

  md.core.ruler.before('normalize', 'normalize-font-strong', (state) => {
    state.src = state.src.replace(fontStrongPattern, '<strong><font$1>$2</font></strong>')
  })
}

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Jasper Labs',
  titleTemplate: 'Jasper Labs',
  description: "Jasper Labs - 个人技术知识库与博客，专注 Python 编程、算法与数据结构、Linux 运维、AI 技术等高质量技术内容分享",
  lang: 'zh-CN',
  
  // SEO 相关配置
  head: [
    // 字体预加载
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    ['link', { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Noto+Sans+SC:wght@400;700&display=swap' }],

    // 基础 meta
    ['meta', { name: 'theme-color', content: '#2563EB' }],
    ['meta', { name: 'referrer', content: 'no-referrer' }],
    ['meta', { name: 'author', content: 'Jasper' }],
    ['meta', { name: 'robots', content: 'index, follow' }],
    ['meta', { name: 'googlebot', content: 'index, follow' }],
    ['meta', { name: 'baiduspider', content: 'index, follow' }],
    
    // Open Graph 标签
    ['meta', { property: 'og:locale', content: 'zh_CN' }],
    ['meta', { property: 'og:site_name', content: 'Jasper Labs' }],
    
    // Twitter Card
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:site', content: '@jasper_labs' }],
    
    // Favicon
    ['link', { rel: 'icon', href: '/images/logo.ico' }],
    ['link', { rel: 'apple-touch-icon', href: '/images/index.png' }],
    ['link', { rel: 'mask-icon', href: '/images/logo.svg', color: '#2563EB' }],
    
    // RSS Feed
    ['link', { rel: 'alternate', type: 'application/rss+xml', title: 'Jasper Labs RSS Feed', href: '/rss.xml' }],
    ['link', { rel: 'alternate', type: 'application/atom+xml', title: 'Jasper Labs Atom Feed', href: '/atom.xml' }],
    ['link', { rel: 'alternate', type: 'application/feed+json', title: 'Jasper Labs JSON Feed', href: '/feed.json' }],
    
    // Sitemap
    ['link', { rel: 'sitemap', type: 'application/xml', title: 'Sitemap', href: '/sitemap.xml' }],
    
    // Apple Web App 支持
    ['meta', { name: 'apple-mobile-web-app-title', content: 'Jasper Labs' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'default' }],
  ],
  // 最后更新时间
  lastUpdated: true,
  
  // 清理出站链接
  cleanUrls: true,
  
  // Markdown 配置
  markdown: {
    // 允许渲染内联 HTML
    html: true,
    lineNumbers: true,
    theme: {
      light: 'github-light',
      dark: 'github-dark'
    },
    math: {
      parseInlineDollar: true,
      allowEscapeDollar: true,
      inlineOpen: '$',
      inlineClose: '$',
    },
    config(md) {
      md.set({ html: true })
      md.use(groupIconMdPlugin)
      md.use(normalizeLooseInlineMath)
      md.use(normalizeFontStrong)

      // 允许在内联代码反引号中直接渲染特定的 HTML（如 `<font ...>text</font>`）
      const defaultCodeInline = md.renderer.rules.code_inline
      md.renderer.rules.code_inline = (tokens, idx, options, env, self) => {
        const content = tokens[idx].content
        const isFontHtml = /<font\s+style=.*?>[\s\S]*?<\/font>/i.test(content)

        if (isFontHtml) {
          // 直接输出原始 HTML，跳过默认的 <code> 包裹与转义
          return content
        }

        return defaultCodeInline
          ? defaultCodeInline(tokens, idx, options, env, self)
          : self.renderToken(tokens, idx, options)
      }
    },
  },

  // Vite 配置
  vite: {
    plugins: [
      groupIconVitePlugin({ // [!code focus:22]
        customIcon: {
           mts: "vscode-icons:file-type-typescript",
           cts: "vscode-icons:file-type-typescript",
           ts: "vscode-icons:file-type-typescript",
           tsx: "vscode-icons:file-type-typescript",
           mjs: "vscode-icons:file-type-js",
           cjs: "vscode-icons:file-type-js",
           json: "vscode-icons:file-type-json",
           js: "vscode-icons:file-type-js",
           jsx: "vscode-icons:file-type-javaScript",
           md: "vscode-icons:file-type-markdown",
           py: "vscode-icons:file-type-python",
           ico: "vscode-icons:file-type-favicon",
           html: "vscode-icons:file-type-html",
           css: "vscode-icons:file-type-css",
           scss: "vscode-icons:file-type-scss",
           yml: "vscode-icons:file-type-light-yaml",
           shell: "vscode-icons:file-type-shell",
           go: "vscode-icons:file-type-go",
         },
       }),
      ]
  },

  // 主题配置
  themeConfig: {
    // Logo
    logo: '/images/index.png',
    siteTitle: 'Jasper Labs',
    
    // 导航栏
    nav: [
        { text: '首页', link: '/' },
        { text: 'Python', link: '/python/', activeMatch: '/python/' },
        { text: '算法', link: '/algorithm/', activeMatch: '/algorithm/' },
        { text: 'AI 专题', link: '/ai/', activeMatch: '/ai/' },
        { text: '技术笔记', link: '/notes/', activeMatch: '/notes/' },
        { text: '常用工具', link: '/tools/', activeMatch: '/tools/' },
        {
          text: '更多',
          items: [
            { text: '提示词库', link: '/prompts/' },
            { text: '技能库', link: '/skills/' },
            { text: '标签', link: '/tags/' },
            { text: '文章归档', link: '/others/archives' },
            { text: '站点地图', link: '/others/sitemap-page' },
            { text: 'RSS 订阅', link: '/rss.xml' },
            { text: '关于我', link: '/others/about' }
          ]
        }
      ],

    // 侧边栏配置 - 自动生成
    sidebar: generateSidebar(),

    // 社交链接
    socialLinks: [
      { icon: 'github', link: 'https://github.com/jasper0529' }
    ],

// 页脚（已使用自定义 SiteFooter 组件替代）

    // 大纲配置
    outline: {
      level: [2, 4],
      label: '目录'
    },

    // 文档页脚
    docFooter: {
      prev: '上一篇',
      next: '下一篇'
    },

    // 最后更新时间
    lastUpdated: {
      text: '最后更新于',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'short'
      }
    },

    // 搜索配置
    search: {
      provider: 'local',
      options: {
        translations: {
          button: {
            buttonText: '搜索文档',
            buttonAriaLabel: '搜索文档'
          },
          modal: {
            displayDetails: '显示详情',
            noResultsText: '未找到相关结果',
            resetButtonTitle: '清除查询条件',
            backButtonTitle: '关闭搜索',
            footer: {
              selectText: '选择',
              navigateText: '切换',
              closeText: '关闭'
            }
          }
        },
        miniSearch: {
          options: {
            fuzzy: 0.2,
            prefix: true,
            boost: { title: 4, textContent: 2, titles: 3 },
          },
          searchOptions: {
            boost: { title: 4, textContent: 2, titles: 3 },
            fuzzy: 0.2,
            prefix: true
          }
        },
      }
    },

    // 编辑链接
    // editLink: {
    //   pattern: 'https://github.com/yourusername/knowledge-base/edit/main/docs/:path',
    //   text: '在 GitHub 上编辑此页'
    // },

    // 返回顶部
    returnToTopLabel: '返回顶部',

    // 侧边栏菜单标签
    sidebarMenuLabel: '菜单',

    // 深色模式切换标签
    darkModeSwitchLabel: '主题',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式'
  },

  // 动态 SEO 标签
  transformHead({ pageData, siteConfig }) {
    const relativePath = pageData.relativePath.replace(/\\/g, '/')
    const normalizedPath = relativePath
      .replace(/index\.md$/, '')
      .replace(/\.md$/, '')
      .replace(/\/$/, '')
    const url = normalizedPath ? `${SITE_URL}/${normalizedPath}/` : `${SITE_URL}/`
    const title = pageData.frontmatter.title || pageData.title || siteConfig.site.title
    const description = pageData.frontmatter.description || siteConfig.site.description
    const tags = Array.isArray(pageData.frontmatter.tags) ? pageData.frontmatter.tags : []
    const date = pageData.frontmatter.date
    const lastUpdated = pageData.lastUpdated ? new Date(pageData.lastUpdated).toISOString() : null
    const imagePath = pageData.frontmatter.cover || pageData.frontmatter.image || '/images/og-image.svg'
    const image = String(imagePath).startsWith('http')
      ? String(imagePath)
      : `${SITE_URL}${imagePath}`
    
    // 获取文章类型
    const isArticle = !!date && pageData.frontmatter.layout !== 'home'
    const ogType = isArticle ? 'article' : 'website'
    
    const headTags: any[] = [
      // Canonical URL - 确保没有双斜杠
      ['link', { rel: 'canonical', href: url }],
      
      // Open Graph 动态标签
      ['meta', { property: 'og:title', content: title }],
      ['meta', { property: 'og:description', content: description }],
      ['meta', { property: 'og:url', content: url }],
      ['meta', { property: 'og:image', content: image }],
      ['meta', { property: 'og:image:width', content: '1200' }],
      ['meta', { property: 'og:image:height', content: '630' }],
      ['meta', { property: 'og:image:alt', content: title }],
      ['meta', { property: 'og:type', content: ogType }],
      
      // Twitter 动态标签
      ['meta', { name: 'twitter:title', content: title }],
      ['meta', { name: 'twitter:description', content: description }],
      ['meta', { name: 'twitter:image', content: image }],
      ['meta', { name: 'twitter:image:alt', content: title }],
    ]
    
    // 文章页面添加额外标签
    if (isArticle) {
      // 文章发布时间
      const publishedTime = new Date(date).toISOString()
      headTags.push(
        ['meta', { property: 'article:published_time', content: publishedTime }],
        ['meta', { property: 'article:modified_time', content: lastUpdated || publishedTime }],
        ['meta', { property: 'article:author', content: pageData.frontmatter.author || 'Jasper' }],
        ['meta', { property: 'article:section', content: getArticleSection(normalizedPath) }],
      )
      // 文章标签
      tags.forEach((tag: string) => {
        headTags.push(['meta', { property: 'article:tag', content: tag }])
      })
    }
    
    // 关键词 meta 标签
    if (tags.length > 0) {
      headTags.push(['meta', { name: 'keywords', content: tags.join(', ') }])
    }

    const jsonLd = isArticle
      ? {
          '@context': 'https://schema.org',
          '@type': 'TechArticle',
          headline: title,
          description,
          url,
          datePublished: new Date(date).toISOString(),
          dateModified: lastUpdated || new Date(date).toISOString(),
          inLanguage: 'zh-CN',
          author: {
            '@type': 'Person',
            name: pageData.frontmatter.author || 'Jasper',
            url: SITE_URL
          },
          publisher: {
            '@type': 'Organization',
            name: 'Jasper Labs',
            url: SITE_URL,
            logo: {
              '@type': 'ImageObject',
              url: `${SITE_URL}/images/logo.svg`
            }
          },
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': url
          },
          image,
          keywords: tags.join(', '),
          articleSection: getArticleSection(normalizedPath)
        }
      : {
          '@context': 'https://schema.org',
          '@type': pageData.frontmatter.layout === 'home' ? 'WebSite' : 'WebPage',
          name: title,
          description,
          url,
          inLanguage: 'zh-CN'
        }

    headTags.push(['script', { type: 'application/ld+json' }, JSON.stringify(jsonLd)])

    const breadcrumbs = getBreadcrumbItems(relativePath, String(title))
    if (breadcrumbs.length > 1) {
      headTags.push([
        'script',
        { type: 'application/ld+json' },
        JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: breadcrumbs.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            ...(item.path ? { item: `${SITE_URL}${item.path}` } : {})
          }))
        })
      ])
    }
    
    return headTags
  }
})

// 获取文章分类
function getArticleSection(path: string): string {
  if (path.startsWith('python')) return 'Python 编程'
  if (path.startsWith('algorithm')) return '算法与数据结构'
  if (path.startsWith('ai')) return 'AI 人工智能'
  if (path.startsWith('notes')) return '技术笔记'
  if (path.startsWith('tools')) return '工具推荐'
  return '技术'
}

const breadcrumbNameMap: Record<string, string> = {
  python: 'Python 学习',
  algorithm: '算法与数据结构',
  notes: '技术笔记',
  tools: '常用工具',
  others: '其他',
  tags: '标签分类',
  basics: '基础语法',
  advanced: '进阶特性',
  'data-structure': '数据结构',
  leetcode: 'LeetCode',
  sorting: '排序算法',
  ai: 'AI 专题',
  'vibe-coding': 'Vibe Coding',
  prompts: '提示词库',
  skills: 'Skills',
  linux: 'Linux'
}

function formatBreadcrumbSegment(segment: string): string {
  return decodeURIComponent(segment)
    .replace(/[-_]/g, ' ')
    .trim()
}

function getBreadcrumbItems(relativePath: string, title: string) {
  const path = relativePath.replace(/\.md$/, '').replace(/\\/g, '/')
  const parts = path.split('/').filter(Boolean)

  if (parts.length <= 1 && (parts[0] === 'index' || path === '')) {
    return []
  }

  const result: Array<{ name: string; path?: string }> = [
    { name: '首页', path: '/' }
  ]

  let accumulatedPath = ''

  parts.forEach((part, index) => {
    accumulatedPath += `/${part}`
    const isLast = index === parts.length - 1

    if (part === 'index' && isLast) {
      return
    }

    const mappedName = breadcrumbNameMap[part]

    if (mappedName) {
      result.push({
        name: mappedName,
        path: isLast ? undefined : `${accumulatedPath}/`
      })
      return
    }

    if (!isLast) {
      result.push({
        name: formatBreadcrumbSegment(part),
        path: `${accumulatedPath}/`
      })
      return
    }

    result.push({
      name: title || formatBreadcrumbSegment(part),
      path: undefined
    })
  })

  return result
}
