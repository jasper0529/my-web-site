<template>
  <div class="post-list">
    <div v-for="post in posts" :key="post.url" class="post-item">
      <a :href="post.url" class="post-link">
        <article class="post-card">
          <div class="post-cover" :class="{ 'has-image': post.cover }" aria-hidden="true">
            <img v-if="post.cover" :src="post.cover" :alt="post.title" loading="lazy" />
            <CoverPlaceholder v-else :title="post.title" :category="post.tags?.[0]" />
            <span class="cover-glow"></span>
          </div>
          <div class="post-body">
            <div class="post-header">
              <p class="post-meta">
                <span v-if="post.date" class="meta-item">
                  <span class="dot"></span>
                  {{ formatDate(post.date) }}
                </span>
                <span v-if="post.author" class="meta-item">
                  <span class="dot"></span>
                  {{ post.author }}
                </span>
              </p>
              <h3 class="post-title">{{ post.title }}</h3>
            </div>
            <p v-if="post.description" class="post-desc">{{ post.description }}</p>
            <div class="post-footer">
              <div v-if="post.tags && post.tags.length" class="post-tags">
                <span v-for="tag in post.tags" :key="tag" class="tag">{{ tag }}</span>
              </div>
              <span class="post-arrow">
                <span>查看细节</span>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </span>
            </div>
          </div>
        </article>
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import CoverPlaceholder from './CoverPlaceholder.vue'

interface Post {
  title: string
  url?: string
  link?: string
  date?: string
  description?: string
  tags?: string[]
  cover?: string
  author?: string
}

const props = defineProps<{
  data?: Post[]
}>()

const posts = computed(() => {
  return (props.data || []).map(post => ({
    ...post,
    url: post.url || post.link || '#'
  }))
})

const formatDate = (date: string) => {
  const d = new Date(date)
  return d.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })
}

</script>

<style scoped>
.post-list {
  display: grid;
  gap: 1.25rem;
  margin: 1.5rem 0 1rem;
}

.post-item {
  transition: transform 0.35s ease, filter 0.35s ease;
}

.post-item:hover {
  transform: translateY(-4px);
}

.post-link {
  text-decoration: none;
  color: inherit;
  display: block;
}

.post-card {
  display: grid;
  grid-template-columns: minmax(100px, 150px) 1fr;
  gap: 1.25rem;
  padding: 1.25rem;
  border-radius: 16px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.96), rgba(248, 250, 252, 0.98));
  border: 1px solid color-mix(in srgb, var(--vp-c-border), transparent 30%);
  box-shadow: 0 10px 26px rgba(15, 23, 42, 0.05);
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.post-card:hover {
  border-color: rgba(37, 99, 235, 0.35);
  box-shadow: 0 16px 34px rgba(15, 23, 42, 0.08);
}

.post-cover {
  position: relative;
  border-radius: 18px;
  overflow: hidden;
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.92), rgba(30, 41, 59, 0.88));
  display: flex;
  align-items: center;
  justify-content: center;
  isolation: isolate;
}

.post-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.post-card:hover .post-cover img {
  transform: scale(1.05);
}

.post-cover .cover-placeholder {
  font-size: 3rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.85);
  letter-spacing: 0.08em;
}

.post-cover .cover-glow {
  position: absolute;
  inset: auto auto -40% -30%;
  width: 140%;
  height: 140%;
  background: radial-gradient(circle, rgba(37, 99, 235, 0.32), transparent 70%);
  filter: blur(20px);
  opacity: 0.36;
  z-index: -1;
}

.post-body {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.post-header {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.post-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin: 0;
  font-size: 0.875rem;
  color: var(--vp-c-text-3);
}

.meta-item {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
}

.meta-item .dot {
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: var(--vp-c-brand-1);
}

.post-title {
  margin: 0;
  font-size: clamp(1.25rem, 1.15rem + 0.5vw, 1.5rem);
  font-weight: 700;
  color: var(--vp-c-text-1);
  line-height: 1.35;
}

.post-desc {
  margin: 0;
  color: var(--vp-c-text-2);
  line-height: 1.7;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.post-footer {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}

.post-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.post-arrow {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  font-size: 0.875rem;
  color: var(--vp-c-brand-1);
}

.post-arrow svg {
  width: 22px;
  height: 22px;
  transition: transform 0.3s ease;
}

.post-card:hover .post-arrow svg {
  transform: translateX(4px);
}

.tag {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.35rem 0.9rem;
  font-size: 0.78rem;
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.04);
  color: var(--vp-c-text-2);
  border: 1px solid rgba(15, 23, 42, 0.08);
}

.tag::before {
  content: '#';
  font-weight: 600;
  opacity: 0.65;
}

.dark .post-card {
  background: linear-gradient(180deg, rgba(15, 23, 42, 0.84), rgba(15, 23, 42, 0.96));
  box-shadow: 0 8px 24px rgba(2, 6, 23, 0.5);
}

.dark .post-cover .cover-glow {
  opacity: 0.44;
}

@media (max-width: 960px) {
  .post-card {
    grid-template-columns: 1fr;
  }

  .post-cover {
    min-height: 160px;
  }
}

@media (max-width: 600px) {
  .post-card {
    padding: 1.25rem;
  }
}
</style>
