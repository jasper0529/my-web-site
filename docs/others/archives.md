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
/* ========================================
   归档页统计卡片
   ======================================== */
.archive-stats {
  display: flex;
  gap: 1.5rem;
  margin: 2rem 0;
  padding: 0;
  background: none;
  border-radius: 0;
  border: none;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  padding: 1.25rem 1rem;
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
  border: 1px solid var(--vp-c-divider);
  transition: all 0.3s ease;
}

.stat-item:hover {
  border-color: var(--vp-c-brand-1-dimm);
  box-shadow: 0 4px 16px rgba(37, 99, 235, 0.08);
  transform: translateY(-2px);
}

.stat-item::before {
  content: '';
  display: block;
  font-size: 1.25rem;
  margin-bottom: 0.25rem;
}

.stat-item:nth-child(1)::before {
  content: '📝';
}

.stat-item:nth-child(2)::before {
  content: '🏷️';
}

.stat-item:nth-child(3)::before {
  content: '📅';
}

.stat-number {
  font-size: 2rem;
  font-weight: 700;
  background: linear-gradient(135deg, var(--vp-c-brand-1), var(--vp-c-brand-2));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stat-label {
  font-size: 0.8125rem;
  color: var(--vp-c-text-2);
  margin-top: 0.25rem;
  font-weight: 500;
}

/* ========================================
   归档容器 — 时间线布局
   ======================================== */
.archive-container {
  margin-top: 2.5rem;
}

.year-group {
  margin-bottom: 2.5rem;
  position: relative;
}

/* 年份标题 */
.year-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.25rem;
  padding: 0.625rem 1rem;
  background: linear-gradient(135deg, var(--vp-c-brand-1) 0%, var(--vp-c-brand-2) 100%);
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.2);
}

.year-title {
  margin: 0 !important;
  padding: 0 !important;
  border: none !important;
  font-size: 1.35rem !important;
  font-weight: 700 !important;
  color: #fff !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
  background: transparent !important;
}

.post-count {
  font-size: 0.8125rem;
  font-weight: 500;
  color: #fff;
  background: rgba(255, 255, 255, 0.2);
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  flex-shrink: 0;
}

/* 文章列表 — 时间线 */
.post-list {
  display: flex;
  flex-direction: column;
  gap: 0;
  border-left: 2px solid var(--vp-c-divider);
  margin-left: 0.5rem;
  padding-left: 0.75rem;
}

.post-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
  transition: all 0.3s ease;
  position: relative;
  margin-bottom: 0.75rem;
}

/* 时间线圆点 */
.post-item::before {
  content: '';
  position: absolute;
  left: -1.35rem;
  top: 50%;
  transform: translateY(-50%);
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--vp-c-divider);
  border: 2px solid var(--vp-c-bg);
  transition: all 0.3s ease;
  z-index: 1;
}

.post-item:hover::before {
  background: var(--vp-c-brand-1);
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.15);
}

.post-item:hover {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  transform: translateX(4px);
}

.post-date {
  font-family: var(--vp-font-family-mono);
  font-size: 0.8125rem;
  color: var(--vp-c-text-3);
  min-width: 88px;
  flex-shrink: 0;
  font-variant-numeric: tabular-nums;
}

.post-title {
  flex: 1;
  color: var(--vp-c-text-1);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
  font-size: 0.9375rem;
}

.post-title:hover {
  color: var(--vp-c-brand-1);
}

.post-tags {
  display: flex;
  gap: 0.375rem;
  flex-wrap: wrap;
  flex-shrink: 0;
}

.tag {
  font-size: 0.7rem;
  color: var(--vp-c-text-2);
  background: var(--vp-c-bg);
  padding: 0.1rem 0.45rem;
  border-radius: 4px;
  border: 1px solid var(--vp-c-divider);
}

/* ========================================
   暗色模式适配
   ======================================== */
.dark .stat-item:hover {
  box-shadow: 0 4px 16px rgba(59, 130, 246, 0.15);
}

.dark .post-item:hover::before {
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.2);
}

.dark .year-header {
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
}

/* ========================================
   响应式
   ======================================== */
@media (max-width: 768px) {
  .archive-stats {
    flex-direction: column;
    gap: 0.75rem;
  }

  .post-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.375rem;
    padding: 0.75rem;
  }

  .post-date {
    min-width: auto;
  }

  .post-item::before {
    top: 1.25rem;
  }

  .post-list {
    margin-left: 0;
    padding-left: 1.25rem;
  }

  .post-item::before {
    left: -1.6rem;
  }
}
</style>
