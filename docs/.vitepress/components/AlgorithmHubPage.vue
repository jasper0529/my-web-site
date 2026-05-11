<script setup lang="ts">
import { computed } from 'vue'
import { data } from '../posts.data'

const algorithmPosts = computed(() =>
  data.posts.filter(post => post.link.startsWith('/algorithm/'))
)

const featuredPaths = [
  '/algorithm/data-structure/time-complexity/',
  '/algorithm/leetcode/two-sum/'
]

const featuredPosts = computed(() => {
  const featured = featuredPaths
    .map(path => algorithmPosts.value.find(post => post.link === path))
    .filter(Boolean)

  return featured.length ? featured : algorithmPosts.value.slice(0, 3)
})

const algorithmTags = computed(() => {
  const tags = new Set<string>()
  for (const post of algorithmPosts.value) {
    for (const tag of post.tags || []) {
      tags.add(tag)
    }
  }
  return Array.from(tags).slice(0, 8)
})
</script>

<template>
  <div class="hub-page">
    <section class="hub-hero">
      <div class="hub-eyebrow">
        <span class="hub-code">ALGO</span>
        <span class="hub-card-status">Problem Solving</span>
      </div>
      <h1 class="hub-title">算法与数据结构</h1>
      <p class="hub-desc">
        这里不把算法写成单纯的题库记录，而是尽量把复杂度、数据结构选择、思路推导和代码实现放在同一条链路里。
        目标是形成可以迁移到面试、竞赛和工程场景中的解题框架。
      </p>
      <div class="hub-stats">
        <div class="hub-stat">
          <span class="hub-stat-value">{{ algorithmPosts.length }}</span>
          <span class="hub-stat-label">已发布文章</span>
        </div>
        <div class="hub-stat">
          <span class="hub-stat-value">{{ algorithmTags.length }}</span>
          <span class="hub-stat-label">主题标签</span>
        </div>
        <div class="hub-stat">
          <span class="hub-stat-value">3</span>
          <span class="hub-stat-label">当前主线</span>
        </div>
      </div>
    </section>

    <section class="hub-section">
      <h2 class="hub-section-title">推荐先读</h2>
      <p class="hub-section-desc">
        如果你第一次进入这个板块，先看复杂度分析，再看一篇题解拆解，会更容易把抽象概念和实际代码联系起来。
      </p>
      <div class="hub-grid">
        <a v-for="post in featuredPosts" :key="post.link" :href="post.link" class="hub-card">
          <div class="hub-card-top">
            <span class="hub-card-label">{{ post.category || 'Algorithm' }}</span>
            <span class="hub-card-status">{{ post.date }}</span>
          </div>
          <h3>{{ post.title }}</h3>
          <p>{{ post.description || '查看这篇内容中的思路拆解、复杂度分析与实现方式。' }}</p>
          <ul v-if="post.tags && post.tags.length" class="hub-list">
            <li v-for="tag in post.tags.slice(0, 3)" :key="tag">{{ tag }}</li>
          </ul>
          <span class="hub-link">进入文章</span>
        </a>
      </div>
    </section>

    <section class="hub-section">
      <h2 class="hub-section-title">内容主线</h2>
      <p class="hub-section-desc">
        算法板块目前围绕三条线展开：基础概念、结构化题解和经典模式。后续新增内容也会优先沿着这三条线扩展。
      </p>
      <div class="hub-grid">
        <a class="hub-card" href="/algorithm/data-structure/">
          <div class="hub-card-top">
            <span class="hub-card-label">FOUNDATION</span>
            <span class="hub-card-status">复杂度 / 结构选型</span>
          </div>
          <h3>基础概念与数据结构</h3>
          <p>从时间复杂度、空间复杂度开始，逐步补齐数组、链表、栈、队列、树、图等基础结构的理解框架。</p>
          <span class="hub-link">进入数据结构</span>
        </a>

        <a class="hub-card" href="/algorithm/leetcode/two-sum/">
          <div class="hub-card-top">
            <span class="hub-card-label">PATTERN</span>
            <span class="hub-card-status">题解拆解</span>
          </div>
          <h3>经典题型与解题模式</h3>
          <p>围绕典型题目拆出暴力解、优化路径、边界处理与最终实现，让题解不只停留在“会写答案”。</p>
          <span class="hub-link">查看示例题解</span>
        </a>

        <a class="hub-card" href="/algorithm/sorting/">
          <div class="hub-card-top">
            <span class="hub-card-label">SYSTEM</span>
            <span class="hub-card-status">排序 / 查找 / 递归</span>
          </div>
          <h3>经典算法专题</h3>
          <p>把排序、查找、递归、分治这类高频主题做成独立专题，形成更适合回顾和系统复习的结构。</p>
          <span class="hub-link">进入排序专题</span>
        </a>
      </div>
    </section>

    <section class="hub-section">
      <h2 class="hub-section-title">阅读建议</h2>
      <div class="hub-subgrid">
        <div class="hub-note">
          <h3>先建立复杂度直觉</h3>
          <p>不要急着刷题数量。先能准确判断一段代码为什么是 O(n)、O(n log n) 或 O(n²)，后面的优化才有依据。</p>
          <ul class="hub-note-list">
            <li>先读复杂度基础，再读具体题解</li>
            <li>写题解时同步记录边界条件和空间消耗</li>
            <li>对比暴力法与优化法之间的信息复用差异</li>
          </ul>
        </div>
        <div class="hub-note">
          <h3>把题目归类成模式</h3>
          <p>真正提高效率的不是刷过多少题，而是能否把题目迅速映射到哈希表、双指针、二分、栈或 BFS/DFS 这类固定模式。</p>
          <ul class="hub-note-list">
            <li>按标签而不是按题号复盘</li>
            <li>为每一类模式沉淀模板和失误清单</li>
            <li>优先复盘“为什么想到这个结构”</li>
          </ul>
        </div>
      </div>
    </section>
  </div>
</template>
