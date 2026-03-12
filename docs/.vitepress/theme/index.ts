import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
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
  }
} satisfies Theme
