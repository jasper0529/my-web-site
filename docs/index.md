---
layout: home
hero:
    name: "Jasper Labs"
    text: "个人技术知识库与博客"
    tagline: 记录学习、分享知识、沉淀成长
    image:
      src: /images/hero-image.svg
      alt: Jasper Labs
    actions:
      - theme: brand
        text: 开始探索
        link: /python/
      - theme: alt
        text: 最新文章
        link: /others/archives

features:
  - icon: 🐍
    title: Python 学习
    details: 从基础语法到高级特性，系统学习 Python 编程，包含常用库的使用教程和最佳实践。
    link: /python/
  - icon: 📊
    title: 算法与数据结构
    details: 深入理解算法原理，LeetCode 刷题笔记，可视化图解复杂概念。
    link: /algorithm/
  - icon: 📝
    title: 技术笔记
    details: 开发过程中遇到的问题与解决方案，技术探索与心得体会。
    link: /notes/
  - icon: 🛠️
    title: 常用工具
    details: 精选开发工具推荐，提升效率的软件和在线服务。
    link: /tools/
  - icon: 📚
    title: 文章归档
    details: 按时间线浏览所有文章，方便查找历史内容。
    link: /others/archives
  - icon: 💡
    title: 关于我
    details: 了解更多关于本站和作者的信息。
    link: /others/about
---

<script setup lang="ts">
import { data } from './.vitepress/posts.data'

const latestPosts = data.posts.slice(0, 6)
const recommendedPosts = (() => {
  const tagged = data.posts.filter(post => post.tags?.includes('推荐'))
  return (tagged.length ? tagged : data.posts).slice(0, 3)
})()

const tagCountMap = new Map<string, number>()
data.posts.forEach(post => {
  post.tags?.forEach(tag => {
    tagCountMap.set(tag, (tagCountMap.get(tag) || 0) + 1)
  })
})
const hotTagEntries = Array.from(tagCountMap.entries())
  .sort((a, b) => b[1] - a[1])
  .slice(0, 12)

const hotTags = hotTagEntries.map(([tag]) => tag)
const tagStats = Object.fromEntries(hotTagEntries)
</script>

<section class="home-section">
  <div class="section-header">
    <p class="section-eyebrow">Latest</p>
    <h2>最新文章</h2>
    <p class="section-desc">实时更新的文章动态，快速了解本站最新内容。</p>
  </div>
  <PostList :data="latestPosts" />
</section>

<section class="home-section">
  <div class="section-header">
    <p class="section-eyebrow">Recommended</p>
    <h2>推荐阅读</h2>
    <p class="section-desc">优先展示带「推荐」标签的精选文章，若暂未标注则展示最新文章。</p>
  </div>
  <PostList :data="recommendedPosts" />
</section>

<section class="home-section">
  <div class="section-header">
    <p class="section-eyebrow">Hot Topics</p>
    <h2>热门标签</h2>
    <p class="section-desc">统计所有文章的标签出现频次，优先展示最常访问的主题方向。</p>
  </div>
  <TagList :tags="hotTags" :stats="tagStats" />
</section>

<style>
:root {
  --vp-home-hero-name-color: transparent;
  --vp-home-hero-name-background: linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%);
}
</style>
