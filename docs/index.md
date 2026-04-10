---
layout: home
title: Jasper Labs - 个人技术知识库与博客
description: Jasper Labs 是一个专注于 Python 编程、算法与数据结构、AI 技术、Linux 运维等领域的技术知识库，提供高质量的技术教程、学习笔记和最佳实践分享。
keywords: [Python教程, 算法, 数据结构, LeetCode, Linux运维, AI, 技术博客, 编程学习, Vibe Coding]
head:
  - - meta
    - name: robots
      content: index, follow
  - - link
    - rel: canonical
      href: https://jasper-labs.cn/

hero:
    name: "Jasper Labs"
    text: "个人技术知识库与博客"
    tagline: 记录学习、分享知识、沉淀成长
    image:
      src: /images/hero-image.svg
      alt: Jasper Labs 技术知识库
    actions:
      - theme: brand
        text: 开始探索
        link: /python/
      - theme: alt
        text: 最新文章
        link: /others/archives
      - theme: alt
        text: AI 专题导航
        link: /ai/

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

const aiTopics = [
  {
    icon: '🤖',
    title: '大模型基础',
    desc: 'Prompt、RAG、向量检索与知识库构建的入门与最佳实践。',
    link: '/ai/#大模型基础',
    items: ['Prompt 工程', 'RAG 管线', '向量数据库']
  },
  {
    icon: '🧭',
    title: '智能体与编排',
    desc: 'Agent 框架、工作流编排与复杂任务拆解案例。',
    link: '/ai/#智能体与编排',
    items: ['Agent 设计', '函数调用', '多步工作流']
  },
  {
    icon: '🎨',
    title: 'AIGC 生成',
    desc: '文本、图片、音频的生成式应用与提示模板策略。',
    link: '/ai/#aigc-生成',
    items: ['文生图', '多模态', '提示模板']
  },
  {
    icon: '🛠️',
    title: '工程化与部署',
    desc: '服务化部署、缓存加速、观测与安全防护全链路。',
    link: '/ai/#工程化与部署',
    items: ['API 网关', '缓存与检索', '安全防护']
  },
  {
    icon: '📊',
    title: '评测与优化',
    desc: '质量评测、对齐调优与数据迭代的方法论。',
    link: '/ai/#评测与优化',
    items: ['自动化评测', '对齐与偏见', '数据迭代']
  }
]
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
    <p class="section-eyebrow">AI</p>
    <h2>AI 专题导航</h2>
    <p class="section-desc">覆盖大模型、RAG、Agent、AIGC、工程化与评测的专题入口，便于快速定位内容。</p>
  </div>
  <div class="ai-grid">
    <a v-for="topic in aiTopics" :key="topic.title" class="ai-card" :href="topic.link">
      <div class="ai-card-icon">{{ topic.icon }}</div>
      <div class="ai-card-title">{{ topic.title }}</div>
      <p class="ai-card-desc">{{ topic.desc }}</p>
      <ul class="ai-card-list">
        <li v-for="item in topic.items" :key="item">{{ item }}</li>
      </ul>
    </a>
  </div>
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

.ai-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
}

.ai-card {
  display: block;
  padding: 16px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
  transition: border-color 0.2s ease, transform 0.2s ease;
}

.ai-card:hover {
  border-color: var(--vp-c-brand-1);
  transform: translateY(-2px);
}

.ai-card-icon {
  font-size: 24px;
}

.ai-card-title {
  margin: 8px 0 4px;
  font-weight: 700;
  font-size: 18px;
}

.ai-card-desc {
  margin: 0 0 8px;
  color: var(--vp-c-text-2);
  font-size: 14px;
}

.ai-card-list {
  margin: 0;
  padding-left: 18px;
  color: var(--vp-c-text-1);
  font-size: 13px;
  line-height: 1.6;
}

.ai-card-list li {
  list-style: disc;
}
</style>
