<script setup lang="ts">
import { computed } from 'vue'
import { data } from '../posts.data'

const structurePosts = computed(() =>
  data.posts.filter(post => post.link.startsWith('/algorithm/data-structure/'))
)

const roadmap = [
  {
    code: 'ARRAY',
    title: '数组、链表与顺序结构',
    desc: '理解连续内存、随机访问、插入删除成本，以及链表在不同场景下的取舍。'
  },
  {
    code: 'STACK',
    title: '栈、队列与受限访问',
    desc: '把 LIFO / FIFO 的访问模式和实际题型联系起来，例如括号匹配、滑动窗口、BFS。'
  },
  {
    code: 'TREE',
    title: '树、堆、图与层次结构',
    desc: '从树的递归定义延伸到堆和图，补齐遍历、搜索、优先级与关系建模。'
  }
]
</script>

<template>
  <div class="hub-page">
    <section class="hub-hero">
      <div class="hub-eyebrow">
        <span class="hub-code">DS</span>
        <span class="hub-card-status">Data Structure</span>
      </div>
      <h1 class="hub-title">数据结构</h1>
      <p class="hub-desc">
        数据结构不是单独背概念，而是理解“数据如何被组织”和“为什么某种操作更快”。
        这一页会把结构特性、复杂度成本和典型使用场景串在一起。
      </p>
      <div class="hub-stats">
        <div class="hub-stat">
          <span class="hub-stat-value">{{ structurePosts.length }}</span>
          <span class="hub-stat-label">当前文章</span>
        </div>
        <div class="hub-stat">
          <span class="hub-stat-value">3</span>
          <span class="hub-stat-label">建设主线</span>
        </div>
        <div class="hub-stat">
          <span class="hub-stat-value">O(n)</span>
          <span class="hub-stat-label">高频基础复杂度</span>
        </div>
      </div>
    </section>

    <section class="hub-section">
      <h2 class="hub-section-title">当前内容</h2>
      <p class="hub-section-desc">
        已有内容先从时间复杂度切入。建议先把复杂度概念吃透，再去看具体结构的插入、删除、查找和遍历成本。
      </p>
      <div class="hub-grid">
        <a v-for="post in structurePosts" :key="post.link" :href="post.link" class="hub-card">
          <div class="hub-card-top">
            <span class="hub-card-label">{{ post.category || 'Data Structure' }}</span>
            <span class="hub-card-status">{{ post.date }}</span>
          </div>
          <h3>{{ post.title }}</h3>
          <p>{{ post.description || '查看这篇内容中的复杂度分析、结构特性与使用场景。' }}</p>
          <ul v-if="post.tags && post.tags.length" class="hub-list">
            <li v-for="tag in post.tags.slice(0, 3)" :key="tag">{{ tag }}</li>
          </ul>
          <span class="hub-link">进入文章</span>
        </a>
      </div>
    </section>

    <section class="hub-section">
      <h2 class="hub-section-title">建设路线</h2>
      <p class="hub-section-desc">
        后续会优先补齐这些基础结构。目标不是面面俱到，而是把最常用、最容易迁移到算法题和工程代码里的内容先打牢。
      </p>
      <div class="hub-grid">
        <div v-for="item in roadmap" :key="item.code" class="hub-card">
          <div class="hub-card-top">
            <span class="hub-card-label">{{ item.code }}</span>
            <span class="hub-card-status">Roadmap</span>
          </div>
          <h3>{{ item.title }}</h3>
          <p>{{ item.desc }}</p>
        </div>
      </div>
    </section>

    <section class="hub-section">
      <h2 class="hub-section-title">阅读方式</h2>
      <div class="hub-subgrid">
        <div class="hub-note">
          <h3>先看操作，再记结构</h3>
          <p>不要先背定义。更有效的方式是先问“我要频繁做什么操作”，再反推数组、链表、哈希表还是树更合适。</p>
          <ul class="hub-note-list">
            <li>查询多还是修改多</li>
            <li>是否要求顺序或排序</li>
            <li>是否需要去重、映射或优先级</li>
          </ul>
        </div>
        <div class="hub-note">
          <h3>把复杂度和空间一起看</h3>
          <p>很多结构在时间上更优，但会引入额外空间或实现复杂度。理解这些取舍，才能真正把结构用到工程问题里。</p>
          <ul class="hub-note-list">
            <li>哈希表换时间但占更多内存</li>
            <li>链表插删快但随机访问慢</li>
            <li>堆适合 top-k，不适合完整有序遍历</li>
          </ul>
        </div>
      </div>
    </section>
  </div>
</template>
