<script setup>
import { computed } from 'vue'
import { data } from '../posts.data'

const categories = computed(() => data.categories)
const stats = computed(() => data.stats)
const groupedPosts = computed(() => data.groupedPosts)

const getEncodedLink = link => link.split('/').map(part => encodeURIComponent(part)).join('/')

const specialPages = [
  { title: '关于作者', link: '/others/about', code: 'ABOUT', desc: '了解作者、站点定位与写作方法。' },
  { title: '文章归档', link: '/others/archives', code: 'ARCHIVE', desc: '按时间线浏览全部文章。' },
  { title: '更新记录', link: '/others/update', code: 'CHANGELOG', desc: '查看站点的演进轨迹与当前能力。' }
]

const allTags = computed(() => {
  const tagMap = new Map()
  data.posts.forEach(post => {
    ;(post.tags || []).forEach(tag => {
      tagMap.set(tag, (tagMap.get(tag) || 0) + 1)
    })
  })
  return Array.from(tagMap.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
})
</script>

<template>
  <div class="hub-page sitemap-page">
    <section class="hub-hero">
      <div class="hub-eyebrow">
        <span class="hub-code">MAP</span>
        <span class="hub-card-status">Site Structure</span>
      </div>
      <h1 class="hub-title">站点地图</h1>
      <p class="hub-desc">
        这页用于快速查看 Jasper Labs 的整体结构。相比首页的重点推荐，这里更接近一份结构索引，适合在你明确要找哪一类内容时直接跳转。
      </p>
      <div class="hub-stats">
        <div class="hub-stat">
          <span class="hub-stat-value">{{ stats.totalPosts }}</span>
          <span class="hub-stat-label">篇文章</span>
        </div>
        <div class="hub-stat">
          <span class="hub-stat-value">{{ stats.categories }}</span>
          <span class="hub-stat-label">个分类</span>
        </div>
        <div class="hub-stat">
          <span class="hub-stat-value">{{ stats.totalTags }}</span>
          <span class="hub-stat-label">个标签</span>
        </div>
      </div>
    </section>

    <section class="hub-section">
      <h2 class="hub-section-title">核心栏目</h2>
      <p class="hub-section-desc">
        主要内容按分类组织，每个分类展示简介和最近的代表文章，方便快速定位主题入口。
      </p>
      <div class="hub-grid">
        <a v-for="cat in categories" :key="cat.link" :href="cat.link" class="hub-card">
          <div class="hub-card-top">
            <span class="hub-card-label">{{ cat.name }}</span>
            <span class="hub-card-status">{{ cat.children.length }} 篇</span>
          </div>
          <h3>{{ cat.description || cat.name }}</h3>
          <p v-if="cat.children && cat.children.length">
            最近内容包括：{{ cat.children.slice(0, 2).map(post => post.title).join('、') }}。
          </p>
          <p v-else>当前以入口页形式存在，后续将持续补充内容。</p>
          <span class="hub-link">进入栏目 →</span>
        </a>
      </div>
    </section>

    <section class="hub-section">
      <h2 class="hub-section-title">辅助页面</h2>
      <p class="hub-section-desc">
        这些页面不承担主内容输出，但负责解释站点、归档历史和补充导航能力。
      </p>
      <div class="hub-subgrid">
        <a v-for="page in specialPages" :key="page.link" :href="page.link" class="hub-card">
          <div class="hub-card-top">
            <span class="hub-card-label">{{ page.code }}</span>
            <span class="hub-card-status">Page</span>
          </div>
          <h3>{{ page.title }}</h3>
          <p>{{ page.desc }}</p>
        </a>
      </div>
    </section>

    <section class="hub-section">
      <h2 class="hub-section-title">热门标签</h2>
      <p class="hub-section-desc">
        标签可以作为主题密度的补充信号。数量越多，说明该方向目前已经积累了更多文章。
      </p>
      <div class="sitemap-tags">
        <a
          v-for="tag in allTags.slice(0, 18)"
          :key="tag.name"
          :href="`/tags/#${encodeURIComponent(tag.name)}`"
          class="sitemap-tag"
          :style="{ fontSize: `${Math.min(0.92 + tag.count * 0.06, 1.08)}rem` }"
        >
          <span>#{{ tag.name }}</span>
          <span class="sitemap-tag-count">{{ tag.count }}</span>
        </a>
      </div>
    </section>

    <section class="hub-section">
      <h2 class="hub-section-title">最近内容分布</h2>
      <p class="hub-section-desc">
        如果你更喜欢按时间检索，而不是按分类跳转，可以直接从年份分布反向进入文章。
      </p>
      <div class="year-grid">
        <div v-for="group in groupedPosts" :key="group.year" class="year-card">
          <div class="year-card-head">
            <h3>{{ group.year }}</h3>
            <span>{{ group.posts.length }} 篇</span>
          </div>
          <div class="year-links">
            <a
              v-for="post in group.posts.slice(0, 4)"
              :key="post.link"
              :href="getEncodedLink(post.link)"
              class="year-link"
            >
              {{ post.title }}
            </a>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.sitemap-page {
  margin-bottom: 1.5rem;
}

.sitemap-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.sitemap-tag {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.42rem 0.78rem;
  border-radius: 999px;
  border: 1px solid rgba(15, 23, 42, 0.08);
  background: rgba(255, 255, 255, 0.74);
  color: var(--vp-c-text-1);
  text-decoration: none;
  transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
}

.sitemap-tag:hover {
  transform: translateY(-2px);
  border-color: rgba(37, 99, 235, 0.24);
  box-shadow: 0 10px 20px rgba(15, 23, 42, 0.06);
}

.sitemap-tag-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.45rem;
  height: 1.45rem;
  padding: 0 0.35rem;
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.08);
  color: var(--vp-c-text-2);
  font-size: 0.72rem;
  font-weight: 700;
}

.year-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.year-card {
  padding: 1rem 1.1rem;
  border-radius: 18px;
  border: 1px solid rgba(15, 23, 42, 0.08);
  background: rgba(255, 255, 255, 0.72);
}

.year-card-head {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: center;
  margin-bottom: 0.8rem;
}

.year-card-head h3 {
  margin: 0;
  font-size: 1.05rem;
}

.year-card-head span {
  color: var(--vp-c-text-3);
  font-size: 0.8rem;
}

.year-links {
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
}

.year-link {
  color: var(--vp-c-text-2);
  text-decoration: none;
  line-height: 1.55;
}

.year-link:hover {
  color: var(--vp-c-brand-1);
}

.dark .sitemap-tag,
.dark .year-card {
  border-color: rgba(148, 163, 184, 0.14);
  background: rgba(15, 23, 42, 0.78);
}

.dark .sitemap-tag-count {
  background: rgba(148, 163, 184, 0.12);
}

@media (max-width: 960px) {
  .year-grid {
    grid-template-columns: 1fr;
  }
}
</style>
