<script setup lang="ts">
import { data } from '../posts.data'

const aiPosts = data.posts
  .filter(post => post.link.startsWith('/ai/'))
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

const aiTags = Array.from(new Set(aiPosts.flatMap(post => post.tags || []))).slice(0, 8)
</script>

<template>
  <div class="hub-page">
    <section class="hub-hero">
      <div class="hub-eyebrow">
        <span class="hub-code">AI</span>
        <span class="hub-card-label">工程化视角</span>
      </div>
      <h1 class="hub-title">不把 Prompt 当话术，而把 AI 当工程系统来理解</h1>
      <p class="hub-desc">
        这个专题优先关注大模型基础、Prompt 设计、上下文组织、工作流编排与评测迭代。
        内容会尽量从“概念理解”继续往前走一步，落到任务定义、约束边界和工程实现。
      </p>
      <div class="hub-stats">
        <article class="hub-stat">
          <span class="hub-stat-value">{{ aiPosts.length }}</span>
          <span class="hub-stat-label">已收录文章</span>
        </article>
        <article class="hub-stat">
          <span class="hub-stat-value">{{ aiTags.length }}</span>
          <span class="hub-stat-label">高频主题标签</span>
        </article>
        <article class="hub-stat">
          <span class="hub-stat-value">Spec</span>
          <span class="hub-stat-label">内容导向：任务规格、上下文与验证</span>
        </article>
      </div>
    </section>

    <section class="hub-section">
      <h2 class="hub-section-title">当前主线</h2>
      <p class="hub-section-desc">目前以 Vibe Coding 系列为主线，后续会继续向工作流、部署和评测扩展。</p>
      <div class="hub-grid">
        <a href="/ai/vibe-coding/01-vibe-coding-intro/" class="hub-card">
          <div class="hub-card-top">
            <span class="hub-card-label">认知建立</span>
            <span class="hub-card-status">已更新</span>
          </div>
          <h3>Vibe Coding 入口</h3>
          <p>先建立正确预期：AI 编程不是魔法，也不是纯话术，而是一种新的任务分解和协作方式。</p>
          <ul class="hub-list">
            <li>什么是 Vibe Coding</li>
            <li>为什么容易误用</li>
            <li>如何建立正确协作方式</li>
          </ul>
          <span class="hub-link">阅读系列开篇</span>
        </a>

        <a href="/ai/vibe-coding/02-llm-fundamentals/" class="hub-card">
          <div class="hub-card-top">
            <span class="hub-card-label">底层机制</span>
            <span class="hub-card-status">已更新</span>
          </div>
          <h3>大模型基础原理</h3>
          <p>如果不理解模型为什么会“猜”、为什么会偏、为什么会在上下文不足时走错，很难真正用好它。</p>
          <ul class="hub-list">
            <li>生成机制与概率本质</li>
            <li>上下文窗口与记忆边界</li>
            <li>为什么模型会偏航</li>
          </ul>
          <span class="hub-link">查看基础原理</span>
        </a>

        <a href="/ai/vibe-coding/03-prompt-engineering-evolution/" class="hub-card">
          <div class="hub-card-top">
            <span class="hub-card-label">方法升级</span>
            <span class="hub-card-status">已更新</span>
          </div>
          <h3>Prompt 到 Context 的演进</h3>
          <p>从“会聊天”升级到“会写任务规格书”，这是高质量 AI 协作最关键的分界线。</p>
          <ul class="hub-list">
            <li>Prompt 不是话术</li>
            <li>上下文组织与约束设计</li>
            <li>验证机制与迭代方式</li>
          </ul>
          <span class="hub-link">查看演进路线</span>
        </a>
      </div>
    </section>

    <section class="hub-section">
      <h2 class="hub-section-title">后续扩展方向</h2>
      <p class="hub-section-desc">这些方向暂时还在搭建中，但会继续保持“工程化视角”而不是纯概念堆积。</p>
      <div class="hub-subgrid">
        <article class="hub-note">
          <h3>工作流与智能体</h3>
          <p>重点会放在任务拆解、工具调用、显式授权、跨步骤状态传递和失败恢复，而不是只展示单次对话效果。</p>
        </article>
        <article class="hub-note">
          <h3>评测与部署</h3>
          <p>后续会补充输出质量评测、结构化验证、缓存与检索、服务化接入和安全边界等主题。</p>
        </article>
      </div>
    </section>

    <section class="hub-section">
      <h2 class="hub-section-title">阅读建议</h2>
      <p class="hub-section-desc">如果你是第一次系统接触这部分内容，建议按“认知建立 → 底层机制 → Prompt 演进”的顺序读。</p>
      <div class="hub-grid">
        <a v-for="post in aiPosts.slice(0, 3)" :key="post.link" :href="post.link" class="hub-card">
          <div class="hub-card-top">
            <span class="hub-card-label">{{ post.category || 'AI' }}</span>
            <span class="hub-card-status">{{ post.date }}</span>
          </div>
          <h3>{{ post.title }}</h3>
          <p>{{ post.description || '查看这篇文章的任务定义、上下文设计与验证方式。' }}</p>
          <ul v-if="post.tags && post.tags.length" class="hub-list">
            <li v-for="tag in post.tags.slice(0, 3)" :key="tag">{{ tag }}</li>
          </ul>
          <span class="hub-link">进入文章</span>
        </a>
      </div>
    </section>
  </div>
</template>
