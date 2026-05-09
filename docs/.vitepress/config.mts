import { defineConfig } from 'vitepress'
import { generateSidebar } from './utils/sidebar'
import { groupIconMdPlugin, groupIconVitePlugin,localIconLoader } from 'vitepress-plugin-group-icons'

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
  title: "Jasper Labs",
  titleTemplate: "%s | Jasper Labs",
  description: "Jasper Labs - 个人技术知识库与博客，专注 Python 编程、算法与数据结构、Linux 运维、AI 技术等高质量技术内容分享",
  lang: 'zh-CN',
  
  // SEO 相关配置
  head: [
    // 基础 meta
    ['meta', { name: 'theme-color', content: '#2563EB' }],
    ['meta', { name: 'referrer', content: 'no-referrer' }],
    ['meta', { name: 'author', content: 'Jasper' }],
    ['meta', { name: 'robots', content: 'index, follow' }],
    ['meta', { name: 'googlebot', content: 'index, follow' }],
    ['meta', { name: 'baiduspider', content: 'index, follow' }],
    
    // Open Graph 标签
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:locale', content: 'zh_CN' }],
    ['meta', { property: 'og:site_name', content: 'Jasper Labs' }],
    ['meta', { property: 'og:image', content: 'https://jasper-labs.cn/images/logo.svg' }],
    ['meta', { property: 'og:image:width', content: '1200' }],
    ['meta', { property: 'og:image:height', content: '630' }],
    ['meta', { property: 'og:image:alt', content: 'Jasper Labs - 个人技术知识库' }],
    ['meta', { property: 'og:url', content: 'https://jasper-labs.cn/' }],
    
    // Twitter Card
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:site', content: '@jasper_labs' }],
    ['meta', { name: 'twitter:image', content: 'https://jasper-labs.cn/images/logo.svg' }],
    ['meta', { name: 'twitter:image:alt', content: 'Jasper Labs - 个人技术知识库' }],
    
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
    
    // 加载 Fira Code 等宽字体（代码块使用）
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://cdn.jsdelivr.net' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    ['link', { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;600&display=swap' }],
    
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
        { text: '<span class="nav-icon"><svg viewBox="0 0 24 24" width="16" height="16"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></span> 首页', link: '/' },
        { text: '<span class="nav-icon"><svg viewBox="0 0 24 24" width="16" height="16"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-4H7l5-7v4h4l-5 7z" fill="currentColor"/></svg></span> Python', link: '/python/', activeMatch: '/python/' },
        { text: '<span class="nav-icon"><svg viewBox="0 0 24 24" width="16" height="16"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="1.5"/><line x1="12" y1="2" x2="12" y2="5" stroke="currentColor" stroke-width="1.5"/><line x1="12" y1="19" x2="12" y2="22" stroke="currentColor" stroke-width="1.5"/></svg></span> 算法', link: '/algorithm/', activeMatch: '/algorithm/' },
        { text: '<span class="nav-icon"><svg viewBox="0 0 24 24" width="16" height="16"><path d="M12 2a4 4 0 014 4v1a1 1 0 01-1 1H9a1 1 0 01-1-1V6a4 4 0 014-4zm0 14a3 3 0 100 6 3 3 0 000-6zm-7-3h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1v-2a1 1 0 011-1z" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="12" cy="18" r="2" fill="currentColor"/></svg></span> AI 专题', link: '/ai/', activeMatch: '/ai/' },
        { text: '<span class="nav-icon"><svg viewBox="0 0 24 24" width="16" height="16"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M18.5 1.5a2.121 2.121 0 013 3L12 14l-4 1 1-4 9.5-9.5z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></span> 技术笔记', link: '/notes/', activeMatch: '/notes/' },
        { text: '<span class="nav-icon"><svg viewBox="0 0 24 24" width="16" height="16"><path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.87-.34-1.703-.943-2.281z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></span> 提示词库', link: '/prompts/', activeMatch: '/prompts/' },
        { text: '<span class="nav-icon"><svg viewBox="0 0 24 24" width="16" height="16"><path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></span> Skills', link: '/skills/', activeMatch: '/skills/' },
        { text: '<span class="nav-icon"><svg viewBox="0 0 24 24" width="16" height="16"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></span> 常用工具', link: '/tools/', activeMatch: '/tools/' },
        {
          text: '<span class="nav-icon"><svg viewBox="0 0 24 24" width="16" height="16"><path d="M4 6h16M4 12h16M4 18h16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg></span> 更多',
          items: [
            { text: '<span class="nav-icon"><svg viewBox="0 0 24 24" width="14" height="14"><path d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></span> 标签', link: '/tags/' },
            { text: '<span class="nav-icon"><svg viewBox="0 0 24 24" width="14" height="14"><path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></span> 文章归档', link: '/others/archives' },
            { text: '<span class="nav-icon"><svg viewBox="0 0 24 24" width="14" height="14"><path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></span> 站点地图', link: '/others/sitemap-page' },
            { text: '<span class="nav-icon"><svg viewBox="0 0 24 24" width="14" height="14"><path d="M6 5c7.18 0 13 5.82 13 13M6 11c3.86 0 7 3.14 7 7" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><circle cx="6" cy="18" r="2" fill="currentColor"/></svg></span> RSS 订阅', link: '/rss.xml' },
            { text: '<span class="nav-icon"><svg viewBox="0 0 24 24" width="14" height="14"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></span> 关于我', link: '/others/about' }
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
    const relativePath = pageData.relativePath
      .replace(/\.md$/, '')
      .replace(/\\/g, '/')
      .replace(/\/index$/, '/')
    const url = relativePath === 'index' ? `${SITE_URL}/` : `${SITE_URL}/${relativePath}/`
    const title = pageData.frontmatter.title || pageData.title
    const description = pageData.frontmatter.description || siteConfig.site.description
    const tags = pageData.frontmatter.tags || []
    const date = pageData.frontmatter.date
    const image = pageData.frontmatter.image
      ? `${SITE_URL}${pageData.frontmatter.image}`
      : `${SITE_URL}/images/logo.svg`
    
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
      ['meta', { property: 'og:type', content: ogType }],
      
      // Twitter 动态标签
      ['meta', { name: 'twitter:title', content: title }],
      ['meta', { name: 'twitter:description', content: description }],
      ['meta', { name: 'twitter:image', content: image }],
    ]
    
    // 文章页面添加额外标签
    if (isArticle) {
      // 文章发布时间
      const publishedTime = new Date(date).toISOString()
      headTags.push(
        ['meta', { property: 'article:published_time', content: publishedTime }],
        ['meta', { property: 'article:author', content: pageData.frontmatter.author || 'Jasper' }],
        ['meta', { property: 'article:section', content: getArticleSection(relativePath) }],
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
