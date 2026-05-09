<script setup lang="ts">
import { data } from '../posts.data'
import TypeWriter from './TypeWriter.vue'

const latestPosts = data.posts.slice(0, 4)
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

<template>
  <div class="hero-tagline-typewriter">
    <TypeWriter :texts="['记录学习', '分享知识', '沉淀成长', '探索技术']" :type-speed="120" :delete-speed="60" :pause-duration="2500" />
  </div>

  <section class="home-section section-blue">
    <div class="section-header">
      <p class="section-eyebrow">最新内容</p>
      <h2>最新文章</h2>
      <p class="section-desc">实时更新的文章动态，快速了解本站最新内容。</p>
    </div>
    <PostList :data="latestPosts" />
  </section>

  <div class="section-divider" aria-hidden="true">
    <svg viewBox="0 0 1200 40" preserveAspectRatio="none"><path d="M0 20 Q300 0 600 20 T1200 20 V40 H0Z" fill="var(--vp-c-bg-soft)"/></svg>
  </div>

  <section class="home-section section-orange">
    <div class="section-header">
      <p class="section-eyebrow">推荐阅读</p>
      <h2>推荐阅读</h2>
      <p class="section-desc">优先展示带「推荐」标签的精选文章，若暂未标注则展示最新文章。</p>
    </div>
    <PostList :data="recommendedPosts" />
  </section>

  <div class="section-divider section-divider-flip" aria-hidden="true">
    <svg viewBox="0 0 1200 40" preserveAspectRatio="none"><path d="M0 0 H1200 V20 Q900 40 600 20 T0 20Z" fill="var(--vp-c-bg-soft)"/></svg>
  </div>

  <section class="home-section section-green">
    <div class="section-header">
      <p class="section-eyebrow">AI 专题</p>
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

  <div class="section-divider" aria-hidden="true">
    <svg viewBox="0 0 1200 40" preserveAspectRatio="none"><path d="M0 20 C200 40 400 0 600 20 S1000 40 1200 20 V40 H0Z" fill="var(--vp-c-bg-soft)"/></svg>
  </div>

  <section class="home-section section-purple">
    <div class="section-header">
      <p class="section-eyebrow">热门主题</p>
      <h2>热门标签</h2>
      <p class="section-desc">统计所有文章的标签出现频次，优先展示最常访问的主题方向。</p>
    </div>
    <TagList :tags="hotTags" :stats="tagStats" />
  </section>
</template>

<style scoped>
.hero-tagline-typewriter {
  text-align: center;
  font-size: 1.25rem;
  font-weight: 500;
  color: var(--vp-c-text-2);
  margin: -1.5rem auto 2rem;
  padding: 0.75rem 1.5rem;
  min-height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
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
