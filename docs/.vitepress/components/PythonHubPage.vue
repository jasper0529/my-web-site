<script setup lang="ts">
import { computed } from 'vue'
import { data } from '../posts.data'

const pythonPosts = data.posts
  .filter(post => post.link.startsWith('/python/'))
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

const featured = computed(() => {
  const focus = [
    '/python/advanced/python-redis-pool/',
    '/python/advanced/python-insert-millions-to-mysql/',
    '/python/advanced/python-delete-list-elements/'
  ]
  const postMap = new Map(pythonPosts.map(post => [post.link, post]))
  return focus.map(path => postMap.get(path)).filter(Boolean)
})

const tags = Array.from(new Set(pythonPosts.flatMap(post => post.tags || []))).slice(0, 8)
</script>

<template>
  <div class="hub-page">
    <section class="hub-hero">
      <div class="hub-eyebrow">
        <span class="hub-code">PY</span>
        <span class="hub-card-label">工程实践</span>
      </div>
      <h1 class="hub-title">Python，不只讲语法，更讲可落地的实现方式</h1>
      <p class="hub-desc">
        这里优先沉淀真实开发中的 Python 工程问题：组件封装、数据处理、性能优化、批量任务与可复用实践。
        目标不是把知识点罗列完整，而是把做法、边界和适用场景讲清楚。
      </p>
      <div class="hub-stats">
        <article class="hub-stat">
          <span class="hub-stat-value">{{ pythonPosts.length }}</span>
          <span class="hub-stat-label">已收录文章</span>
        </article>
        <article class="hub-stat">
          <span class="hub-stat-value">{{ tags.length }}</span>
          <span class="hub-stat-label">高频主题标签</span>
        </article>
        <article class="hub-stat">
          <span class="hub-stat-value">实战</span>
          <span class="hub-stat-label">内容导向：问题驱动与实现细节</span>
        </article>
      </div>
    </section>

    <section class="hub-section">
      <h2 class="hub-section-title">推荐先读</h2>
      <p class="hub-section-desc">先从这几篇代表文章进入，最能体现本专题的工程取向和写作方式。</p>
      <div class="hub-grid">
        <a v-for="post in featured" :key="post.link" :href="post.link" class="hub-card">
          <div class="hub-card-top">
            <span class="hub-card-label">{{ post.category || 'Python' }}</span>
            <span class="hub-card-status">{{ post.date }}</span>
          </div>
          <h3>{{ post.title }}</h3>
          <p>{{ post.description || '查看这篇文章的实现思路、代码细节和适用边界。' }}</p>
          <ul v-if="post.tags && post.tags.length" class="hub-list">
            <li v-for="tag in post.tags.slice(0, 3)" :key="tag">{{ tag }}</li>
          </ul>
          <span class="hub-link">进入文章</span>
        </a>
      </div>
    </section>

    <section class="hub-section">
      <h2 class="hub-section-title">内容主线</h2>
      <p class="hub-section-desc">围绕三条主线持续扩展，尽量让每篇文章都能落到真实开发场景。</p>
      <div class="hub-grid">
        <a href="/python/advanced/python-redis-pool/" class="hub-card">
          <div class="hub-card-top">
            <span class="hub-card-label">稳定性</span>
            <span class="hub-card-status">已更新</span>
          </div>
          <h3>高可用组件封装</h3>
          <p>连接池、重试、监控、资源释放与可观测性，是 Python 工程化中最容易忽视但最关键的一层。</p>
          <ul class="hub-list">
            <li>连接池与重连</li>
            <li>封装边界与职责</li>
            <li>错误恢复与监控指标</li>
          </ul>
          <span class="hub-link">查看示例文章</span>
        </a>

        <a href="/python/advanced/python-insert-millions-to-mysql/" class="hub-card">
          <div class="hub-card-top">
            <span class="hub-card-label">性能</span>
            <span class="hub-card-status">已更新</span>
          </div>
          <h3>数据处理与批量任务</h3>
          <p>批量插入、事务控制、测试数据生成和执行策略，是数据型任务里最常见的性能瓶颈来源。</p>
          <ul class="hub-list">
            <li>批量写入与事务优化</li>
            <li>测试数据构造</li>
            <li>任务吞吐与成本权衡</li>
          </ul>
          <span class="hub-link">查看示例文章</span>
        </a>

        <article class="hub-card">
          <div class="hub-card-top">
            <span class="hub-card-label">演进中</span>
            <span class="hub-card-status">持续扩充</span>
          </div>
          <h3>语言特性与工程边界</h3>
          <p>后续会补充装饰器、生成器、异步编程与类型系统，但仍然会围绕工程使用场景展开，而不是只讲语法规则。</p>
          <ul class="hub-list">
            <li>异步任务与协程模型</li>
            <li>类型提示与大型项目维护</li>
            <li>高级特性的真实使用边界</li>
          </ul>
        </article>
      </div>
    </section>

    <section class="hub-section">
      <h2 class="hub-section-title">阅读建议</h2>
      <p class="hub-section-desc">如果你不是零基础读者，建议跳过“语法面面俱到”的路线，直接从问题场景进入。</p>
      <div class="hub-subgrid">
        <article class="hub-note">
          <h3>适合怎样的读法</h3>
          <p>先看你当前遇到的问题，再反查对应文章；如果是系统学习，建议先读“高可用组件”和“批量处理”两类内容。</p>
        </article>
        <article class="hub-note">
          <h3>本专题的写作标准</h3>
          <ul class="hub-note-list">
            <li>优先讲真实问题和约束条件</li>
            <li>实现代码要能迁移到其他项目</li>
            <li>尽量写清边界、风险与替代方案</li>
          </ul>
        </article>
      </div>
    </section>
  </div>
</template>
