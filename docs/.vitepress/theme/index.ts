import { h, onMounted, watch, nextTick } from 'vue'
import DefaultTheme from 'vitepress/theme'
import { useRoute } from 'vitepress'
import type { Theme } from 'vitepress'
import mediumZoom from 'medium-zoom'
import 'virtual:group-icons.css'
import 'katex/dist/katex.min.css'
import './custom.css'

import PostList from '../components/PostList.vue'
import Layout from '../components/Layout.vue'
import PromptLibrary from '../components/PromptLibrary.vue'
import ToolLibrary from '../components/ToolLibrary.vue'
import SkillsLibrary from '../components/SkillsLibrary.vue'
import HomePageContent from '../components/HomePageContent.vue'
import PythonHubPage from '../components/PythonHubPage.vue'
import AiHubPage from '../components/AiHubPage.vue'
import NotesHubPage from '../components/NotesHubPage.vue'
import AlgorithmHubPage from '../components/AlgorithmHubPage.vue'
import DataStructureHubPage from '../components/DataStructureHubPage.vue'
import SortingHubPage from '../components/SortingHubPage.vue'
import AboutHubPage from '../components/AboutHubPage.vue'
import ArchivesHubPage from '../components/ArchivesHubPage.vue'
import OthersHubPage from '../components/OthersHubPage.vue'
import SitemapHubPage from '../components/SitemapHubPage.vue'
import UpdateHubPage from '../components/UpdateHubPage.vue'
import TagsHubPage from '../components/TagsHubPage.vue'
import NotFoundHubPage from '../components/NotFoundHubPage.vue'

export default {
  extends: DefaultTheme,
  Layout: () => h(Layout),
  enhanceApp({ app }) {
    app.component('PostList', PostList)
    app.component('PromptLibrary', PromptLibrary)
    app.component('ToolLibrary', ToolLibrary)
    app.component('SkillsLibrary', SkillsLibrary)
    app.component('HomePageContent', HomePageContent)
    app.component('PythonHubPage', PythonHubPage)
    app.component('AiHubPage', AiHubPage)
    app.component('NotesHubPage', NotesHubPage)
    app.component('AlgorithmHubPage', AlgorithmHubPage)
    app.component('DataStructureHubPage', DataStructureHubPage)
    app.component('SortingHubPage', SortingHubPage)
    app.component('AboutHubPage', AboutHubPage)
    app.component('ArchivesHubPage', ArchivesHubPage)
    app.component('OthersHubPage', OthersHubPage)
    app.component('SitemapHubPage', SitemapHubPage)
    app.component('UpdateHubPage', UpdateHubPage)
    app.component('TagsHubPage', TagsHubPage)
    app.component('NotFoundHubPage', NotFoundHubPage)
  },
  setup() {
    const isClient = typeof window !== 'undefined'
    const route = useRoute()
    let zoomInstance: ReturnType<typeof mediumZoom> | null = null

    const initZoom = () => {
      if (zoomInstance) zoomInstance.detach()

      const targets = document.querySelectorAll('.vp-doc img:not(.no-zoom)')
      if (!targets.length) return

      zoomInstance = mediumZoom(targets, {
        background: 'var(--vp-c-bg)',
        margin: 24
      })
    }

    const initCodeFold = () => {
      const codeBlocks = document.querySelectorAll('.vp-doc div[class*="language-"]')

      codeBlocks.forEach(block => {
        if (block.querySelector('.code-fold-bar')) return

        const codeContent = block.querySelector('pre') || block.querySelector('code')
        if (!codeContent) return

        const foldBar = document.createElement('div')
        foldBar.className = 'code-fold-bar'
        foldBar.innerHTML = `
          <span class="fold-text">
            <svg class="fold-icon" viewBox="0 0 24 24" width="14" height="14">
              <path fill="currentColor" d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z"/>
            </svg>
            <span class="fold-label">收起代码</span>
          </span>
        `

        foldBar.addEventListener('click', () => {
          const isCollapsed = block.classList.toggle('code-collapsed')
          foldBar.classList.toggle('collapsed', isCollapsed)

          const label = foldBar.querySelector('.fold-label')
          if (label) {
            label.textContent = isCollapsed ? '展开代码' : '收起代码'
          }

          const codeId = block.querySelector('code')?.textContent?.slice(0, 50) || ''
          if (codeId) {
            localStorage.setItem(`code-fold-${codeId}`, isCollapsed ? '1' : '0')
          }
        })

        block.appendChild(foldBar)

        const codeId = block.querySelector('code')?.textContent?.slice(0, 50) || ''
        if (codeId && localStorage.getItem(`code-fold-${codeId}`) === '1') {
          block.classList.add('code-collapsed')
          foldBar.classList.add('collapsed')
          const label = foldBar.querySelector('.fold-label')
          if (label) {
            label.textContent = '展开代码'
          }
        }
      })
    }

    // 滚动触发入场动画
    const initScrollAnimations = () => {
      const sections = document.querySelectorAll('.home-section')
      if (!sections.length) return

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('section-visible')
              observer.unobserve(entry.target)
            }
          })
        },
        { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
      )

      sections.forEach((section) => observer.observe(section))
    }

    // 标签颜色分类：为标签添加 data-tag 属性
    const initTagColors = () => {
      const tags = document.querySelectorAll('.post-tags .tag, .tag-list .tag')
      tags.forEach((tag) => {
        const text = tag.textContent?.replace('#', '').trim()
        if (text) {
          tag.setAttribute('data-tag', text)
        }
      })
    }

    const rerunEnhance = () => {
      if (!isClient) return
      nextTick(() => {
        requestAnimationFrame(() => {
          initZoom()
          initCodeFold()
          initScrollAnimations()
          initTagColors()
        })
      })
    }

    // View Transitions API 支持
    const enableViewTransitions = () => {
      if (!isClient) return
      // VitePress 通过 router 的 onAfterRouteChanged 触发
      // 通过 CSS ::view-transition-* 伪元素控制动画
      const style = document.createElement('style')
      style.textContent = `
        @keyframes vt-fade-out { from { opacity: 1 } to { opacity: 0 } }
        @keyframes vt-fade-in { from { opacity: 0 } to { opacity: 1 } }
      `
      document.head.appendChild(style)
    }

    onMounted(() => {
      rerunEnhance()
      enableViewTransitions()
    })

    if (isClient) {
      watch(
        () => route.path,
        () => rerunEnhance()
      )
    }
  }
} satisfies Theme
