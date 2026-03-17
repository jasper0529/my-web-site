<template>
  <div class="post-list">
    <div v-for="post in posts" :key="post.url" class="post-item">
      <a :href="post.url" class="post-link">
        <article class="post-card">
          <div class="post-cover" :class="{ 'has-image': post.cover }" aria-hidden="true">
            <img v-if="post.cover" :src="post.cover" :alt="post.title" loading="lazy" />
            <span v-else class="cover-placeholder">{{ getInitial(post.title) }}</span>
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
                <span>阅读全文</span>
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

const getInitial = (title: string) => (title?.[0] || 'J').toUpperCase()
</script>

<style scoped>
.post-list {
  display: grid;
  gap: 1.75rem;
  margin: 2.5rem 0 1.5rem;
}

.post-item {
  transition: transform 0.35s ease, filter 0.35s ease;
}

.post-item:hover {
  transform: translateY(-6px);
}

.post-link {
  text-decoration: none;
  color: inherit;
  display: block;
}

.post-card {
  display: grid;
  grid-template-columns: minmax(120px, 180px) 1fr;
  gap: 1.5rem;
  padding: 1.75rem;
  border-radius: 20px;
  background: var(--vp-c-bg);
  border: 1px solid color-mix(in srgb, var(--vp-c-border), transparent 30%);
  box-shadow: 0 25px 65px rgba(15, 23, 42, 0.08);
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.post-card:hover {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 35px 75px rgba(37, 99, 235, 0.18);
}

.post-cover {
  position: relative;
  border-radius: 18px;
  overflow: hidden;
  background: linear-gradient(135deg, rgba(37, 99, 235, 0.15), rgba(249, 115, 22, 0.15));
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
  background: radial-gradient(circle, rgba(37, 99, 235, 0.4), transparent 70%);
  filter: blur(20px);
  opacity: 0.5;
  animation: post-glow 6s ease-in-out infinite alternate;
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
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.post-desc {
  margin: 0;
  color: var(--vp-c-text-2);
  line-height: 1.7;
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
  letter-spacing: 0.05em;
  text-transform: uppercase;
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
  background: rgba(37, 99, 235, 0.12);
  color: var(--vp-c-brand-1);
  border: 1px solid rgba(37, 99, 235, 0.1);
}

.tag::before {
  content: '#';
  font-weight: 600;
  opacity: 0.65;
}

.dark .post-card {
  background: color-mix(in srgb, var(--vp-c-bg), rgba(255, 255, 255, 0.02));
  box-shadow: 0 20px 55px rgba(2, 6, 23, 0.75);
}

.dark .post-cover .cover-glow {
  opacity: 0.8;
}

@keyframes post-glow {
  from {
    transform: rotate(0deg) scale(1);
  }
  to {
    transform: rotate(8deg) scale(1.1);
  }
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
