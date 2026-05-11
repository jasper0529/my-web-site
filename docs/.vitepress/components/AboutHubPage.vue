<script setup>
import { computed } from 'vue'
import { data } from '../posts.data'

const totalPosts = computed(() => data.stats.totalPosts)
const totalTags = computed(() => data.stats.totalTags)
const categoryCount = computed(() => data.stats.categories)
</script>

<template>
  <div class="hub-page">
    <section class="hub-hero">
      <div class="hub-eyebrow">
        <span class="hub-code">ABOUT</span>
        <span class="hub-card-status">Author & Method</span>
      </div>
      <h1 class="hub-title">关于作者与这个知识库</h1>
      <p class="hub-desc">
        Jasper Labs 的目标不是把零散笔记堆成一个博客，而是把 Python 工程实践、Linux 运维实战、AI 应用落地中的问题、实现、边界和取舍整理成长期可检索的技术知识库。
      </p>
      <div class="hub-stats">
        <div class="hub-stat">
          <span class="hub-stat-value">{{ totalPosts }}</span>
          <span class="hub-stat-label">已发布文章</span>
        </div>
        <div class="hub-stat">
          <span class="hub-stat-value">{{ totalTags }}</span>
          <span class="hub-stat-label">主题标签</span>
        </div>
        <div class="hub-stat">
          <span class="hub-stat-value">{{ categoryCount }}</span>
          <span class="hub-stat-label">内容板块</span>
        </div>
      </div>
    </section>

    <section class="hub-section">
      <h2 class="hub-section-title">站点定位</h2>
      <p class="hub-section-desc">
        这里更接近工程型知识库，而不是资讯流博客。内容会优先聚焦那些可以复用、可验证、可迁移的经验，而不是只记录结论本身。
      </p>
      <div class="hub-grid">
        <div class="hub-card">
          <div class="hub-card-top">
            <span class="hub-card-label">PY</span>
            <span class="hub-card-status">后端工程</span>
          </div>
          <h3>Python 工程实践</h3>
          <p>关注批量任务、连接池封装、工程脚本、性能与可维护性，强调“能落地”的实现细节。</p>
        </div>
        <div class="hub-card">
          <div class="hub-card-top">
            <span class="hub-card-label">OPS</span>
            <span class="hub-card-status">系统与排障</span>
          </div>
          <h3>Linux 运维实战</h3>
          <p>记录命令、安装、扩容、资源排查与环境问题，不写空泛概念，优先沉淀真实排障路径。</p>
        </div>
        <div class="hub-card">
          <div class="hub-card-top">
            <span class="hub-card-label">AI</span>
            <span class="hub-card-status">应用与流程</span>
          </div>
          <h3>AI 应用落地</h3>
          <p>关注 Prompt、Agent、Vibe Coding 和工作流设计，重点放在应用方式、边界和实际效率收益。</p>
        </div>
      </div>
    </section>

    <section class="hub-section">
      <h2 class="hub-section-title">写作方法</h2>
      <p class="hub-section-desc">
        每篇文章都尽量遵循固定结构，保证它不只是“当时记了一下”，而是几个月后回来看依然有用。
      </p>
      <div class="hub-subgrid">
        <div class="hub-note">
          <h3>问题驱动</h3>
          <p>先交代问题出现在哪个场景，为什么要解决，而不是一上来就贴结论和代码。</p>
        </div>
        <div class="hub-note">
          <h3>原理拆解</h3>
          <p>如果一个方案成立，我会尽量补上背后的机制、成本与边界，避免只有步骤没有判断依据。</p>
        </div>
        <div class="hub-note">
          <h3>实现过程</h3>
          <p>优先写可复现的命令、配置、代码片段和排障过程，而不是只给抽象描述。</p>
        </div>
        <div class="hub-note">
          <h3>复用价值</h3>
          <p>文章会尽量抽象出模板、注意事项和替代方案，方便后续迁移到别的项目或环境中。</p>
        </div>
      </div>
    </section>

    <section class="hub-section">
      <h2 class="hub-section-title">作者信息</h2>
      <p class="hub-section-desc">
        目前主要从后端开发视角写作，偏好结构化、克制、以工程判断为中心的表达方式。
      </p>
      <div class="hub-subgrid">
        <div class="hub-note">
          <h3>基础信息</h3>
          <ul class="hub-note-list">
            <li>工作方向：Python 后端开发</li>
            <li>常驻地点：北京</li>
            <li>兴趣延伸：游戏、电影、长期技术研究</li>
            <li>创作偏好：少空话，重原理、过程与复盘</li>
          </ul>
        </div>
        <div class="hub-note">
          <h3>联系与追踪</h3>
          <ul class="hub-note-list">
            <li>Email：<a href="mailto:fanren123@protonmail.com">fanren123@protonmail.com</a></li>
            <li>GitHub：<a href="https://github.com/jasper0529" target="_blank" rel="noreferrer">github.com/jasper0529</a></li>
            <li>站点：<a href="https://jasper-labs.cn" target="_blank" rel="noreferrer">jasper-labs.cn</a></li>
          </ul>
        </div>
      </div>
    </section>
  </div>
</template>
