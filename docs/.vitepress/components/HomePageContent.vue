<script setup lang="ts">
import { computed } from 'vue'
import { data } from '../posts.data'

const latestPosts = data.posts.slice(0, 4)

const featuredPaths = [
  '/python/advanced/python-redis-pool/',
  '/notes/linux/linux-commands/',
  '/ai/vibe-coding/03-prompt-engineering-evolution/'
]

const featuredPosts = computed(() => {
  const postMap = new Map(data.posts.map(post => [post.link, post]))
  const curated = featuredPaths
    .map(path => postMap.get(path))
    .filter(Boolean)

  return curated.length ? curated : data.posts.slice(0, 3)
})

const countByPrefix = (prefix: string) =>
  data.posts.filter(post => post.link?.startsWith(prefix)).length

const focusAreas = [
  {
    code: 'PY',
    title: 'Python 工程实践',
    count: countByPrefix('/python/'),
    desc: '围绕真实开发问题展开，强调组件封装、数据处理、性能优化与可复用实现。',
    highlights: ['高可用组件封装', '批量任务与性能优化', '工程边界与可维护性'],
    link: '/python/'
  },
  {
    code: 'OPS',
    title: 'Linux 运维实战',
    count: countByPrefix('/notes/linux/'),
    desc: '聚焦部署、编译、排障与资源管理，优先沉淀可复现的命令与处理过程。',
    highlights: ['环境编译与依赖处理', '常见命令与排障路径', '磁盘与资源治理'],
    link: '/notes/'
  },
  {
    code: 'AI',
    title: 'AI 应用落地',
    count: countByPrefix('/ai/'),
    desc: '关注 LLM、Prompt、Agent 与工作流设计，重点放在真正可用的工程方法。',
    highlights: ['LLM 基础机制', 'Prompt 体系设计', '评测与迭代方法'],
    link: '/ai/'
  }
]

const methodology = [
  {
    title: '问题背景',
    desc: '先交代场景、约束与为什么值得解决，而不是一上来就给结论。'
  },
  {
    title: '原理拆解',
    desc: '解释核心机制、数据流与关键设计点，避免只有步骤没有判断依据。'
  },
  {
    title: '实现与验证',
    desc: '提供可复现的代码、命令和验证方式，尽量把落地路径写完整。'
  },
  {
    title: '边界与替代',
    desc: '说明风险、适用边界和替代方案，帮助你判断什么时候该用、什么时候不该用。'
  }
]
</script>

<template>
  <section class="home-section section-blue">
    <div class="section-header">
      <p class="section-eyebrow">精选长文</p>
    </div>
    <div class="featured-callout">
      <span class="featured-badge">推荐顺序</span>
      <p>先读代表文章，再进入专题页按主线扩展，会比直接浏览全部文章更快建立整体判断。</p>
    </div>
    <PostList :data="featuredPosts"></PostList>
  </section>

  <section class="home-section section-orange">
    <div class="section-header">
      <p class="section-eyebrow">核心专题</p>
      
      
    </div>
    <div class="focus-grid">
      <a v-for="area in focusAreas" :key="area.title" class="focus-card" :href="area.link">
        <div class="focus-top">
          <span class="focus-code">{{ area.code }}</span>
          <span class="focus-count">{{ area.count }} 篇</span>
        </div>
        <h3>{{ area.title }}</h3>
        <p>{{ area.desc }}</p>
        <ul class="focus-list">
          <li v-for="item in area.highlights" :key="item">{{ item }}</li>
        </ul>
        <span class="focus-link">进入专题</span>
      </a>
    </div>
  </section>

  <section class="home-section section-green">
    <div class="section-header">
      <p class="section-eyebrow">最近更新</p>
    </div>
    <PostList :data="latestPosts"></PostList>
  </section>

  <section class="home-section section-purple home-section-about">
    <div class="section-header">
      <p class="section-eyebrow">关于本站</p>
      <h2>这是一个偏工程型的个人技术知识库</h2>
      <p class="section-desc">
        重点不在于追求概念数量，而在于把做过的东西写清楚：为什么这样做、怎么做、怎么验证、哪里会出问题。
      </p>
    </div>
    <div class="about-grid">
      <article class="about-card">
        <h3>关注方向</h3>
        <p>Python 工程、Linux 运维、AI 应用与工作流设计。</p>
      </article>
      <article class="about-card">
        <h3>内容标准</h3>
        <p>尽量提供可复用方法、关键命令、实现细节与边界说明，而不是只给结论。</p>
      </article>
      <article class="about-card">
        <h3>阅读入口</h3>
        <p>如果你第一次访问，建议先从精选长文开始，再进入专题页系统浏览。</p>
      </article>
    </div>
  </section>
</template>

<style scoped>
/* 基础 home-section 样式由全局 components.css 管理，此处仅保留首页专属覆盖 */

.section-header {
  margin-bottom: 1.5rem;
}

.section-eyebrow {
  display: inline-flex;
  align-items: center;
  padding: 0.22rem 0.72rem;
  border-radius: 999px;
  background: rgba(37, 99, 235, 0.08);
  color: var(--vp-c-brand-1);
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.12em;
}

.section-header h2 {
  margin: 0.9rem 0 0.55rem;
  font-size: clamp(1.4rem, 1.2rem + 0.7vw, 1.8rem);
  line-height: 1.3;
}

.section-desc {
  margin: 0;
  max-width: 780px;
  color: var(--vp-c-text-2);
  line-height: 1.8;
}

.featured-callout {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  margin: 0 0 1.15rem;
  padding: 0.9rem 1rem;
  border-radius: 16px;
  border: 1px solid rgba(37, 99, 235, 0.12);
  background: rgba(37, 99, 235, 0.04);
}

.featured-callout p {
  margin: 0;
  color: var(--vp-c-text-2);
  line-height: 1.7;
}

.featured-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.35rem 0.7rem;
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.92);
  color: #f8fafc;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  white-space: nowrap;
}

.focus-grid,
.method-grid,
.about-grid {
  display: grid;
  gap: 1rem;
}

.focus-grid {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.focus-card,
.method-card,
.about-card {
  border-radius: var(--radius-lg);
  border: 1px solid rgba(15, 23, 42, 0.08);
  background: rgba(255, 255, 255, 0.74);
}

.dark .focus-card,
.dark .method-card,
.dark .about-card {
  border-color: rgba(148, 163, 184, 0.14);
  background: rgba(15, 23, 42, 0.56);
}

.dark .featured-callout {
  border-color: rgba(96, 165, 250, 0.18);
  background: rgba(37, 99, 235, 0.08);
}

.focus-card {
  display: block;
  padding: 1.25rem;
  text-decoration: none;
  color: inherit;
  transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
}

.focus-card:hover {
  transform: translateY(-4px);
  border-color: rgba(37, 99, 235, 0.4);
  box-shadow: 0 14px 30px rgba(37, 99, 235, 0.12);
}

.focus-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.9rem;
}

.focus-code {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 3rem;
  padding: 0.3rem 0.55rem;
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.88);
  color: #f8fafc;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.08em;
}

.focus-count {
  color: var(--vp-c-text-3);
  font-size: 0.88rem;
  font-variant-numeric: tabular-nums;
}

.focus-card h3,
.method-card h3,
.about-card h3 {
  margin: 0 0 0.6rem;
  font-size: 1.08rem;
  line-height: 1.4;
}

.focus-card p,
.method-card p,
.about-card p {
  margin: 0;
  color: var(--vp-c-text-2);
  line-height: 1.75;
}

.focus-list {
  margin: 1rem 0 1.1rem;
  padding-left: 1rem;
  color: var(--vp-c-text-1);
}

.focus-list li + li {
  margin-top: 0.38rem;
}

.focus-link {
  display: inline-flex;
  align-items: center;
  font-size: 0.88rem;
  font-weight: 700;
  color: var(--vp-c-brand-1);
}

.method-grid {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.method-card,
.about-card {
  padding: 1.25rem;
}

.method-index {
  display: inline-flex;
  margin-bottom: 0.8rem;
  color: var(--vp-c-brand-1);
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.12em;
}

.about-grid {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.home-section-about .section-desc {
  max-width: 720px;
}

@media (max-width: 960px) {
  .focus-grid {
    grid-template-columns: 1fr;
  }

  .method-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .about-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .home-section {
    padding: 1.3rem;
    border-radius: 18px;
    margin: 1.5rem 0;
  }

  .method-grid {
    grid-template-columns: 1fr;
  }

  .featured-callout {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
