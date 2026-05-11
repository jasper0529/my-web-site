<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import DocMeta from './DocMeta.vue'
import BackToTop from './BackToTop.vue'
import GiscusComment from './GiscusComment.vue' // 评论模块
import ArticleCopyright from './ArticleCopyright.vue' // 版权信息
import ReadingProgress from './ReadingProgress.vue' // 阅读进度条
import Announcement from './Announcement.vue' // 公告栏
import Analytics from './Analytics.vue' // 分析工具
import LoadingOverlay from './LoadingOverlay.vue' // 页面切换加载动画
import Breadcrumb from './Breadcrumb.vue' // 面包屑导航
import RelatedPosts from './RelatedPosts.vue' // 相关文章推荐
import HeroParticles from './HeroParticles.vue' // Hero 粒子动画背景
import SiteFooter from './SiteFooter.vue' // 自定义页脚
import NotFoundHubPage from './NotFoundHubPage.vue' // 404 页面

const { Layout } = DefaultTheme
const { frontmatter } = useData()

// 判断是否为首页
const isHome = computed(() => frontmatter.value.layout === 'home')

// 只有真正的文章页才显示文章头部和文章附属模块
const isArticlePage = computed(() => {
  const fm = frontmatter.value as Record<string, any>
  if (fm.layout === 'home') return false
  if (fm.docMeta === true) return true
  return Boolean(fm.date)
})

const defaultAnnouncement = {
  show: true,
  message: '🚀 Jasper Labs v2 功能上线：新增首页推荐区、站内搜索增强，<a href="/others/archives">查看更新详情</a>',
  type: 'info' as const,
  id: 'release-2025-01'
}

// 支持通过 frontmatter.announcement 关闭或自定义公告
const announcementConfig = computed(() => {
  const fm = frontmatter.value as any
  const fmAnnouncement = fm?.announcement

  if (fmAnnouncement === false) {
    return { ...defaultAnnouncement, show: false }
  }

  if (typeof fmAnnouncement === 'object' && fmAnnouncement !== null) {
    return {
      show: fmAnnouncement.show ?? true,
      message: fmAnnouncement.message ?? defaultAnnouncement.message,
      type: fmAnnouncement.type ?? defaultAnnouncement.type,
      id: fmAnnouncement.id ?? defaultAnnouncement.id
    }
  }

  return defaultAnnouncement
})

</script>

<template>
  <Layout>
    <!-- 阅读进度条、加载动画和首页粒子背景 - 放在 layout-top 插槽中 -->
    <template #layout-top>
      <a href="#main-content" class="skip-link">跳到主内容</a>
      <ReadingProgress />
      <LoadingOverlay />
      <HeroParticles v-if="isHome" />
    </template>

    <!-- 404 页面支持 -->
    <template #not-found>
      <div class="VPNotFound">
        <NotFoundHubPage />
      </div>
    </template>

    <!-- 在文档内容前插入面包屑和元信息 -->
    <template #doc-before>
      <Breadcrumb />
      <DocMeta v-if="isArticlePage" />
    </template>

    <!-- 在文档内容后插入相关文章、版权信息和评论 -->
    <template #doc-after>
      <RelatedPosts v-if="isArticlePage" />
      <ArticleCopyright v-if="isArticlePage" />
      <GiscusComment v-if="isArticlePage" />
    </template>

    <!-- 在布局后插入返回顶部按钮和公告栏 -->
    <template #layout-bottom>
      <SiteFooter />
      <Analytics />
      <BackToTop />
      <Announcement
        v-if="announcementConfig.show"
        :message="announcementConfig.message"
        :type="announcementConfig.type"
        :id="announcementConfig.id"
      />
    </template>
  </Layout>
</template>
