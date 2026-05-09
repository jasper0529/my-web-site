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
import NotFoundContent from './NotFoundContent.vue' // 自定义 404 页面内容

const { Layout } = DefaultTheme
const { frontmatter } = useData()

// 判断是否为首页
const isHome = computed(() => frontmatter.value.layout === 'home')

// 判断是否显示文档元信息
const showDocMeta = () => {
  return frontmatter.value.date ||
    (frontmatter.value.tags && frontmatter.value.tags.length > 0) ||
    frontmatter.value.title
}

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
      <ReadingProgress />
      <LoadingOverlay />
      <HeroParticles v-if="isHome" />
    </template>

    <!-- 自定义 404 页面 -->
    <template #not-found>
      <NotFoundContent />
    </template>

    <!-- 在文档内容前插入面包屑和元信息 -->
    <template #doc-before>
      <Breadcrumb />
      <DocMeta v-if="showDocMeta()" />
    </template>

    <!-- 在文档内容后插入相关文章、版权信息和评论 -->
    <template #doc-after>
      <RelatedPosts />
      <ArticleCopyright />
      <GiscusComment />
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

<style>
</style>
