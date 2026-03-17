---
title: 其他内容
description: 关于我、读书笔记、友情链接等内容。
---

# 📚 其他内容

这里是个人介绍、读书笔记和其他杂项内容的聚集地。

## 内容导航

<div class="card-grid">

<div class="feature-card">
  <div class="feature-icon">📚</div>
  <h3>文章归档</h3>
  <p>按时间线浏览所有文章，方便查找历史内容。</p>
  <a href="/others/archives">浏览归档 →</a>
</div>

<div class="feature-card">
  <div class="feature-icon">🗺️</div>
  <h3>站点地图</h3>
  <p>可视化网站结构，快速了解全站内容。</p>
  <a href="/others/sitemap-page">查看地图 →</a>
</div>

<div class="feature-card">
  <div class="feature-icon">👋</div>
  <h3>关于我</h3>
  <p>了解更多关于本站和作者的信息。</p>
  <a href="/others/about">了解更多 →</a>
</div>

</div>

## 站点信息

- **构建工具**: VitePress
- **部署平台**: Vercel / Netlify
- **主题**: 自定义主题
- **最后更新**: 持续更新中...

<style>
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  margin: 2rem 0;
}

.feature-card {
  padding: 1.5rem;
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  transition: all 0.3s ease;
}

.feature-card:hover {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.feature-icon {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.feature-card h3 {
  margin: 0 0 0.75rem;
  font-size: 1.125rem;
  font-weight: 600;
}

.feature-card p {
  margin: 0 0 1rem;
  color: var(--vp-c-text-2);
  line-height: 1.6;
}

.feature-card a {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--vp-c-brand-1);
  text-decoration: none;
}
</style>
