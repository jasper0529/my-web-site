---
title: 文章归档
description: 按时间线浏览所有文章，方便查找历史内容。
---

<script setup>
import { data } from '../.vitepress/posts.data'
const { groupedPosts, stats } = data
</script>

# 📚 文章归档

<div class="archive-stats">
  <div class="stat-item">
    <span class="stat-number">{{ stats.totalPosts }}</span>
    <span class="stat-label">篇文章</span>
  </div>
  <div class="stat-item">
    <span class="stat-number">{{ stats.totalTags }}</span>
    <span class="stat-label">个标签</span>
  </div>
  <div class="stat-item">
    <span class="stat-number">{{ groupedPosts.length }}</span>
    <span class="stat-label">个年份</span>
  </div>
</div>

<div class="archive-container">
  <div v-for="group in groupedPosts" :key="group.year" class="year-group">
    <div class="year-header">
      <h2 :id="group.year" class="year-title">{{ group.year }}</h2>
      <span class="post-count">{{ group.posts.length }} 篇</span>
    </div>
    <div class="post-list">
      <div v-for="post in group.posts" :key="post.link" class="post-item">
        <span class="post-date">{{ post.date }}</span>
        <a :href="post.link" class="post-title">{{ post.title }}</a>
        <div v-if="post.tags.length > 0" class="post-tags">
          <span v-for="tag in post.tags.slice(0, 3)" :key="tag" class="tag">
            {{ tag }}
          </span>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
.archive-stats {
  display: flex;
  gap: 2rem;
  margin: 2rem 0;
  padding: 1.5rem;
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
  border: 1px solid var(--vp-c-divider);
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
}

.stat-number {
  font-size: 2rem;
  font-weight: 700;
  color: var(--vp-c-brand-1);
}

.stat-label {
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
  margin-top: 0.25rem;
}

.archive-container {
  margin-top: 2rem;
}

.year-group {
  margin-bottom: 3rem;
}

.year-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  padding: 0.75rem 1rem;
  background: linear-gradient(135deg, var(--vp-c-brand-1) 0%, var(--vp-c-brand-2) 100%);
  border-radius: 12px;
}

.year-title {
  margin: 0 !important;
  padding: 0 !important;
  border: none !important;
  font-size: 1.5rem !important;
  font-weight: 700 !important;
  color: #fff !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  background: transparent !important;
}

.post-count {
  font-size: 0.875rem;
  font-weight: 500;
  color: #fff;
  background: rgba(255, 255, 255, 0.2);
  padding: 0.35rem 0.9rem;
  border-radius: 20px;
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  flex-shrink: 0;
}

.post-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.post-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
  transition: all 0.3s ease;
}

.post-item:hover {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  transform: translateX(4px);
}

.post-date {
  font-family: monospace;
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
  min-width: 90px;
  flex-shrink: 0;
}

.post-title {
  flex: 1;
  color: var(--vp-c-text-1);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.post-title:hover {
  color: var(--vp-c-brand-1);
}

.post-tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.tag {
  font-size: 0.75rem;
  color: var(--vp-c-text-2);
  background: var(--vp-c-bg);
  padding: 0.125rem 0.5rem;
  border-radius: 4px;
  border: 1px solid var(--vp-c-divider);
}

@media (max-width: 768px) {
  .archive-stats {
    flex-direction: column;
    gap: 1rem;
  }
  
  .post-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .post-date {
    min-width: auto;
  }
}
</style>
