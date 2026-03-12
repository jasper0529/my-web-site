import { h, onMounted, watch, nextTick } from 'vue'
import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import mediumZoom from 'medium-zoom'
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
    // 初始化图片缩放功能
    const initZoom = () => {
      mediumZoom('.main img', {
        background: 'var(--vp-c-bg)',
        margin: 24
      })
    }

    onMounted(() => {
      initZoom()
    })

    watch(
      () => window.location.pathname,
      () => nextTick(() => initZoom())
    )
  }
} satisfies Theme
