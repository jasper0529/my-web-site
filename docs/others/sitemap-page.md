---
title: 站点地图
description: 可视化浏览网站结构
---

<script setup>
import { computed } from 'vue'
import { data } from '../.vitepress/posts.data'

// 获取分类数据
const categories = computed(() => data.categories)
const stats = computed(() => data.stats)
const groupedPosts = computed(() => data.groupedPosts)

// 获取编码后的链接
const getEncodedLink = (link) => {
  return link.split('/').map(part => encodeURIComponent(part)).join('/')
}

// 特殊页面配置
const specialPages = [
  { title: '关于我', link: '/others/about', icon: '👋', desc: '了解更多关于本站和作者的信息' },
  { title: '文章归档', link: '/others/archives', icon: '📚', desc: '按时间线浏览所有文章' },
  { title: '站点地图', link: '/others/sitemap-page', icon: '🗺️', desc: '可视化网站结构' }
]

// 计算所有标签
const allTags = computed(() => {
  const tagMap = new Map()
  data.posts.forEach(post => {
    post.tags.forEach(tag => {
      tagMap.set(tag, (tagMap.get(tag) || 0) + 1)
    })
  })
  return Array.from(tagMap.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
})
</script>

# 🗺️ 站点地图

这里展示网站的完整结构，帮助你快速找到需要的内容。

## 📊 网站概览

<div class="stats-grid">
  <div class="stat-card">
    <div class="stat-icon">📝</div>
    <div class="stat-info">
      <span class="stat-value">{{ stats.totalPosts }}</span>
      <span class="stat-label">篇文章</span>
    </div>
  </div>
  <div class="stat-card">
    <div class="stat-icon">📁</div>
    <div class="stat-info">
      <span class="stat-value">{{ stats.categories }}</span>
      <span class="stat-label">个分类</span>
    </div>
  </div>
  <div class="stat-card">
    <div class="stat-icon">🏷️</div>
    <div class="stat-info">
      <span class="stat-value">{{ stats.totalTags }}</span>
      <span class="stat-label">个标签</span>
    </div>
  </div>
  <div class="stat-card">
    <div class="stat-icon">📅</div>
    <div class="stat-info">
      <span class="stat-value">{{ groupedPosts.length }}</span>
      <span class="stat-label">个年份</span>
    </div>
  </div>
</div>

## 🏠 首页

<div class="sitemap-item highlight">
  <a href="/" class="main-link">Jasper Labs 首页</a>
  <span class="desc">个人技术知识库与博客</span>
</div>

## 📁 内容分类

<div class="category-grid">
  <div v-for="cat in categories" :key="cat.link" class="category-card">
    <div class="category-header">
      <span class="category-icon">{{ cat.icon }}</span>
      <div class="category-info">
        <a :href="cat.link" class="category-name">{{ cat.name }}</a>
        <span class="category-count">{{ cat.children.length }} 篇文章</span>
      </div>
    </div>
    <p v-if="cat.description" class="category-desc">{{ cat.description }}</p>
    <div v-if="cat.children && cat.children.length" class="post-list">
      <a v-for="post in cat.children.slice(0, 5)" :key="post.link" 
         :href="getEncodedLink(post.link)" 
         class="post-link">
        {{ post.title }}
      </a>
      <a v-if="cat.children.length > 5" :href="cat.link" class="more-link">
        查看全部 {{ cat.children.length }} 篇 →
      </a>
    </div>
  </div>
</div>

## 🏷️ 热门标签

<div class="tags-cloud">
  <a v-for="tag in allTags.slice(0, 20)" :key="tag.name" 
     :href="`/tags/#${encodeURIComponent(tag.name)}`"
     class="tag-item"
     :style="{ fontSize: `${Math.min(1 + tag.count * 0.1, 1.5)}rem` }">
    #{{ tag.name }}
    <span class="tag-count">{{ tag.count }}</span>
  </a>
</div>

## 📚 其他页面

<div class="special-pages">
  <a v-for="page in specialPages" :key="page.link" :href="page.link" class="special-card">
    <span class="special-icon">{{ page.icon }}</span>
    <div class="special-info">
      <span class="special-title">{{ page.title }}</span>
      <span class="special-desc">{{ page.desc }}</span>
    </div>
  </a>
</div>

## 🔗 快速链接

<div class="quick-links">
  <a href="/rss.xml" class="quick-link">
    <span class="link-icon">📡</span>
    <span>RSS 订阅</span>
  </a>
  <a href="/sitemap.xml" class="quick-link">
    <span class="link-icon">🔍</span>
    <span>站点地图</span>
  </a>
  <a href="https://github.com/jasper0529" target="_blank" class="quick-link">
    <span class="link-icon">🐙</span>
    <span>GitHub</span>
  </a>
</div>

<style>
/* 统计卡片 */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin: 2rem 0;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
  border: 1px solid var(--vp-c-divider);
  transition: all 0.3s ease;
}

.stat-card:hover {
  border-color: var(--vp-c-brand-1);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.stat-icon {
  font-size: 2rem;
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--vp-c-brand-1);
}

.stat-label {
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
}

/* 分类网格 */
.category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
  margin: 1.5rem 0;
}

.category-card {
  padding: 1.25rem;
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
  border: 1px solid var(--vp-c-divider);
  transition: all 0.3s ease;
}

.category-card:hover {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
}

.category-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.category-icon {
  font-size: 1.75rem;
}

.category-info {
  display: flex;
  flex-direction: column;
}

.category-name {
  font-weight: 600;
  color: var(--vp-c-text-1);
  text-decoration: none;
}

.category-name:hover {
  color: var(--vp-c-brand-1);
}

.category-count {
  font-size: 0.75rem;
  color: var(--vp-c-text-3);
}

.category-desc {
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
  margin: 0 0 1rem;
}

.post-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.post-link {
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
  text-decoration: none;
  padding: 0.35rem 0.5rem;
  border-radius: 4px;
  transition: all 0.2s;
}

.post-link:hover {
  background: var(--vp-c-bg);
  color: var(--vp-c-brand-1);
}

.more-link {
  font-size: 0.875rem;
  color: var(--vp-c-brand-1);
  text-decoration: none;
  padding: 0.35rem 0.5rem;
}

/* 标签云 */
.tags-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin: 1.5rem 0;
}

.tag-item {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.35rem 0.75rem;
  background: var(--vp-c-bg-soft);
  border-radius: 20px;
  border: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-1);
  text-decoration: none;
  transition: all 0.2s;
}

.tag-item:hover {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
}

.tag-count {
  font-size: 0.75rem;
  color: var(--vp-c-text-3);
  background: var(--vp-c-bg);
  padding: 0.1rem 0.4rem;
  border-radius: 10px;
}

/* 特殊页面 */
.special-pages {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
  margin: 1.5rem 0;
}

.special-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.25rem;
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
  border: 1px solid var(--vp-c-divider);
  text-decoration: none;
  transition: all 0.3s ease;
}

.special-card:hover {
  border-color: var(--vp-c-brand-1);
  transform: translateX(4px);
}

.special-icon {
  font-size: 1.5rem;
}

.special-info {
  display: flex;
  flex-direction: column;
}

.special-title {
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.special-desc {
  font-size: 0.75rem;
  color: var(--vp-c-text-3);
}

/* 快速链接 */
.quick-links {
  display: flex;
  gap: 1rem;
  margin: 1.5rem 0;
  flex-wrap: wrap;
}

.quick-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-1);
  text-decoration: none;
  transition: all 0.2s;
}

.quick-link:hover {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
}

.link-icon {
  font-size: 1.25rem;
}

/* 高亮项 */
.sitemap-item {
  padding: 1rem;
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
  margin: 0.5rem 0;
}

.sitemap-item.highlight {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
}

.main-link {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--vp-c-brand-1);
  text-decoration: none;
}

.desc {
  display: block;
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
  margin-top: 0.25rem;
}

@media (max-width: 640px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .category-grid {
    grid-template-columns: 1fr;
  }
}
</style>
