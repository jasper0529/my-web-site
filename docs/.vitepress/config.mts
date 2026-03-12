import { defineConfig } from 'vitepress'
import { generateSidebar } from './utils/sidebar'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Jasper Labs",
  titleTemplate: "Jasper Labs",
  description: "个人知识库和博客网站，包含Python、算法、技术笔记等内容",
  lang: 'zh-CN',
  
  // SEO 相关配置
  head: [
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
    ['meta', { name: 'og:type', content: 'website' }],
    ['meta', { name: 'og:locale', content: 'zh-CN' }],
    ['link', { rel: 'icon', href: '/images/logo.ico' }],
    // 图片防盗链解决 - 设置 referrer policy
    ['meta', { name: 'referrer', content: 'no-referrer' }],
  ],

  // 最后更新时间
  lastUpdated: true,
  
  // 清理出站链接
  cleanUrls: true,
  
  // Markdown 配置
  markdown: {
    lineNumbers: true,
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
      { text: '技术笔记', link: '/notes/', activeMatch: '/notes/' },
      { text: '标签', link: '/tags/', activeMatch: '/tags/' },
      { text: '常用工具', link: '/tools/', activeMatch: '/tools/' },
      { text: '其他内容', link: '/others/', activeMatch: '/others/' }
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
  }
})
