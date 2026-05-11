<script setup>
import { data } from '../posts.data'

const { groupedPosts, stats } = data
</script>

<template>
  <div class="hub-page archive-page">
    <section class="hub-hero">
      <div class="hub-eyebrow">
        <span class="hub-code">ARCHIVE</span>
        <span class="hub-card-status">Timeline</span>
      </div>
      <h1 class="hub-title">文章归档</h1>
      <p class="hub-desc">
        这里按年份整理了全部文章，适合从时间线角度回看站点的内容积累。若你更想按主题阅读，优先从首页专题页进入会更高效。
      </p>
      <div class="hub-stats">
        <div class="hub-stat">
          <span class="hub-stat-value">{{ stats.totalPosts }}</span>
          <span class="hub-stat-label">篇文章</span>
        </div>
        <div class="hub-stat">
          <span class="hub-stat-value">{{ stats.totalTags }}</span>
          <span class="hub-stat-label">个标签</span>
        </div>
        <div class="hub-stat">
          <span class="hub-stat-value">{{ groupedPosts.length }}</span>
          <span class="hub-stat-label">个年份</span>
        </div>
      </div>
    </section>

    <section class="hub-section">
      <h2 class="hub-section-title">使用建议</h2>
      <div class="hub-subgrid">
        <div class="hub-note">
          <h3>按主题读</h3>
          <p>如果你的目标是快速找到某类内容，建议先进入 Python、Linux、AI 或算法专题页，再回到归档补充历史文章。</p>
        </div>
        <div class="hub-note">
          <h3>按时间读</h3>
          <p>如果你想看站点如何逐步扩展内容边界，这个时间线会更直观，尤其适合回顾专题从零散文章到体系化入口的演进。</p>
        </div>
      </div>
    </section>

    <section class="hub-section archive-section">
      <h2 class="hub-section-title">时间线</h2>
      <p class="hub-section-desc">
        每个年份下按发布时间倒序排列，保留标题、日期和主要标签，方便快速判断是否值得进入正文。
      </p>
      <div class="archive-groups">
        <section v-for="group in groupedPosts" :key="group.year" class="archive-group">
          <div class="archive-year">
            <div>
              <h3>{{ group.year }}</h3>
              <p>{{ group.posts.length }} 篇文章</p>
            </div>
            <span class="archive-year-line"></span>
          </div>
          <div class="archive-list">
            <article v-for="post in group.posts" :key="post.link" class="archive-item">
              <div class="archive-meta">
                <span class="archive-date">{{ post.date }}</span>
              </div>
              <div class="archive-body">
                <a :href="post.link" class="archive-link">{{ post.title }}</a>
                <p v-if="post.description" class="archive-desc">{{ post.description }}</p>
                <div v-if="post.tags && post.tags.length" class="archive-tags">
                  <span v-for="tag in post.tags.slice(0, 3)" :key="tag" class="archive-tag">{{ tag }}</span>
                </div>
              </div>
            </article>
          </div>
        </section>
      </div>
    </section>
  </div>
</template>

<style scoped>
.archive-page {
  margin-bottom: 1.5rem;
}

.archive-section {
  overflow: hidden;
}

.archive-groups {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.archive-group {
  display: grid;
  grid-template-columns: 180px 1fr;
  gap: 1.25rem;
}

.archive-year {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
}

.archive-year h3 {
  margin: 0;
  font-size: 1.4rem;
}

.archive-year p {
  margin: 0.3rem 0 0;
  color: var(--vp-c-text-3);
  font-size: 0.88rem;
}

.archive-year-line {
  display: block;
  width: 2px;
  flex: 1;
  background: linear-gradient(180deg, rgba(37, 99, 235, 0.3), rgba(15, 23, 42, 0.04));
  border-radius: 999px;
}

.archive-list {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
}

.archive-item {
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 1rem;
  padding: 1rem 1.1rem;
  border-radius: 18px;
  border: 1px solid rgba(15, 23, 42, 0.08);
  background: rgba(255, 255, 255, 0.72);
  transition: transform 0.24s ease, border-color 0.24s ease, box-shadow 0.24s ease;
}

.archive-item:hover {
  transform: translateY(-2px);
  border-color: rgba(37, 99, 235, 0.24);
  box-shadow: 0 14px 28px rgba(15, 23, 42, 0.07);
}

.archive-date {
  display: inline-flex;
  align-items: center;
  padding: 0.34rem 0.7rem;
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.06);
  color: var(--vp-c-text-2);
  font-size: 0.8rem;
  font-variant-numeric: tabular-nums;
}

.archive-link {
  display: inline-block;
  margin-bottom: 0.45rem;
  color: var(--vp-c-text-1);
  text-decoration: none;
  font-size: 1.03rem;
  font-weight: 700;
  line-height: 1.45;
}

.archive-link:hover {
  color: var(--vp-c-brand-1);
}

.archive-desc {
  margin: 0;
  color: var(--vp-c-text-2);
  line-height: 1.7;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.archive-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
  margin-top: 0.8rem;
}

.archive-tag {
  display: inline-flex;
  align-items: center;
  padding: 0.28rem 0.68rem;
  border-radius: 999px;
  background: rgba(37, 99, 235, 0.08);
  color: var(--vp-c-brand-1);
  font-size: 0.75rem;
  font-weight: 600;
}

.dark .archive-item {
  border-color: rgba(148, 163, 184, 0.14);
  background: rgba(15, 23, 42, 0.78);
}

.dark .archive-date {
  background: rgba(148, 163, 184, 0.12);
}

@media (max-width: 960px) {
  .archive-group,
  .archive-item {
    grid-template-columns: 1fr;
  }

  .archive-year-line {
    display: none;
  }
}
</style>
