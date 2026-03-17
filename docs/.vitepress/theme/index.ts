import { h, onMounted, watch, nextTick } from 'vue'
import DefaultTheme from 'vitepress/theme'
import { useRoute } from 'vitepress'
import type { Theme } from 'vitepress'
import mediumZoom from 'medium-zoom'
import 'virtual:group-icons.css'
import 'katex/dist/katex.min.css'
import './custom.css'

// 导入自定义组件
import PostList from '../components/PostList.vue'
import ToolCard from '../components/ToolCard.vue'
import FeatureCard from '../components/FeatureCard.vue'
import TagList from '../components/TagList.vue'
import Layout from '../components/Layout.vue'

export default {
  extends: DefaultTheme,
  Layout: () => h(Layout),
  enhanceApp({ app }) {
    // 注册全局组件
    app.component('PostList', PostList)
    app.component('ToolCard', ToolCard)
    app.component('FeatureCard', FeatureCard)
    app.component('TagList', TagList)
  },
  setup() {
    const isClient = typeof window !== 'undefined'
    const route = useRoute()
    let zoomInstance: ReturnType<typeof mediumZoom> | null = null
    // 初始化图片缩放功能
    const initZoom = () => {
      if (zoomInstance) zoomInstance.detach()

      const targets = document.querySelectorAll('.vp-doc img:not(.no-zoom)')
      if (!targets.length) return

      zoomInstance = mediumZoom(targets, {
        background: 'var(--vp-c-bg)',
        margin: 24
      })
    }

    const rerunEnhance = () => {
      if (!isClient) return
      nextTick(() => {
        requestAnimationFrame(() => {
          initZoom()
          initCodeFold()
        })
      })
    }

    // 初始化代码块折叠功能
    const initCodeFold = () => {
      const codeBlocks = document.querySelectorAll('.vp-doc div[class*="language-"]')
      
      codeBlocks.forEach((block) => {
        // 跳过已处理的代码块
        if (block.querySelector('.code-fold-bar')) return
        
        // 获取代码内容区域
        const codeContent = block.querySelector('pre') || block.querySelector('code')
        if (!codeContent) return
        
        // 创建底部折叠栏
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
        
        // 点击事件
        foldBar.addEventListener('click', () => {
          const isCollapsed = block.classList.toggle('code-collapsed')
          foldBar.classList.toggle('collapsed', isCollapsed)
          
          // 更新文字
          const label = foldBar.querySelector('.fold-label')
          if (label) {
            label.textContent = isCollapsed ? '展开代码' : '收起代码'
          }
          
          // 保存折叠状态到 localStorage
          const codeId = block.querySelector('code')?.textContent?.slice(0, 50) || ''
          if (codeId) {
            localStorage.setItem(`code-fold-${codeId}`, isCollapsed ? '1' : '0')
          }
        })
        
        // 添加折叠栏到代码块
        block.appendChild(foldBar)
        
        // 恢复之前的折叠状态
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

    onMounted(() => {
      rerunEnhance()
    })

    if (isClient) {
      watch(
        () => route.path,
        () => rerunEnhance()
      )
    }
  }
} satisfies Theme
