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
  titleTemplate: "Jasper Labs",
  description: "个人知识库和博客网站，包含Python、算法、技术笔记等内容",
  lang: 'zh-CN',
  
  // SEO 相关配置
  head: [
    // 基础 meta
    ['meta', { name: 'theme-color', content: '#2563EB' }],
    ['meta', { name: 'referrer', content: 'no-referrer' }],
    
    // Open Graph 标签
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:locale', content: 'zh-CN' }],
    ['meta', { property: 'og:site_name', content: 'Jasper Labs' }],
    ['meta', { property: 'og:image', content: 'https://jasper-labs.cn/images/logo.svg' }],
    ['meta', { property: 'og:url', content: 'https://jasper-labs.cn/' }],
    
    // Twitter Card
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:site', content: '@jasper_labs' }],
    ['meta', { name: 'twitter:image', content: 'https://jasper-labs.cn/images/logo.svg' }],
    
    // Favicon
    ['link', { rel: 'icon', href: '/images/logo.ico' }],
    ['link', { rel: 'apple-touch-icon', href: '/images/logo.svg' }],
    
    // RSS Feed
    ['link', { rel: 'alternate', type: 'application/rss+xml', title: 'RSS Feed', href: '/rss.xml' }],
    ['link', { rel: 'alternate', type: 'application/atom+xml', title: 'Atom Feed', href: '/atom.xml' }],
    
    // Canonical URL (通过 transformHead 动态设置)
    // Sitemap
    ['link', { rel: 'sitemap', type: 'application/xml', title: 'Sitemap', href: '/sitemap.xml' }],
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
      { text: '🏠 首页', link: '/' },
      { text: '🐍 Python', link: '/python/', activeMatch: '/python/' },
      { text: '🎯 算法', link: '/algorithm/', activeMatch: '/algorithm/' },
      { text: '🤖 AI 专题', link: '/ai/', activeMatch: '/ai/' },
      { text: '📝 技术笔记', link: '/notes/', activeMatch: '/notes/' },
      { text: '🏷️ 标签', link: '/tags/', activeMatch: '/tags/' },
      { text: '💡 提示词库', link: '/prompts/', activeMatch: '/prompts/' },
      { text: '🔧 常用工具', link: '/tools/', activeMatch: '/tools/' },
      {
        text: '📋 更多',
        items: [
          { text: '📚 文章归档', link: '/others/archives' },
          { text: '🗺️ 站点地图', link: '/others/sitemap-page' },
          { text: '📡 RSS 订阅', link: '/rss.xml' },
          { text: '👋 关于我', link: '/others/about' }
        ]
      }
    ],

    // 侧边栏配置 - 自动生成
    sidebar: generateSidebar(),

    // 社交链接
    socialLinks: [
      { icon: 'github', link: 'https://github.com/jasper0529' }
    ],

    // 页脚
    footer: {
      message: '基于 VitePress 构建',
      copyright: 'Copyright © 2024-present'
    },

    // 大纲配置
    outline: {
      level: [1, 6],
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
            noResultsText: '无法找到相关结果',
            resetButtonTitle: '清除查询条件',
            footer: {
              selectText: '选择',
              navigateText: '切换'
            }
          }
        }
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
    const url = `${SITE_URL}${pageData.relativePath.replace(/\.md$/, '').replace(/\/index$/, '/') || '/'}`
    const title = pageData.frontmatter.title || pageData.title
    const description = pageData.frontmatter.description || siteConfig.site.description
    
    return [
      // Canonical URL
      ['link', { rel: 'canonical', href: url }],
      // Open Graph 动态标签
      ['meta', { property: 'og:title', content: title }],
      ['meta', { property: 'og:description', content: description }],
      ['meta', { property: 'og:url', content: url }],
      // Twitter 动态标签
      ['meta', { name: 'twitter:title', content: title }],
      ['meta', { name: 'twitter:description', content: description }],
    ]
  }
})
