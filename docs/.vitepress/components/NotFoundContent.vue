<script setup lang="ts">
import { useData } from 'vitepress'

const { theme } = useData()
</script>

<template>
  <div class="not-found-container">
    <div class="not-found-code">404</div>
    <h1 class="not-found-title">页面走丢了 🌀</h1>
    <p class="not-found-desc">抱歉，你访问的页面不存在或已被移动。请检查链接是否正确，或返回首页浏览其他内容。</p>
    <div class="not-found-actions">
      <a href="/" class="not-found-btn primary">返回首页</a>
      <a href="/others/archives" class="not-found-btn secondary">浏览文章归档</a>
    </div>
    <div class="not-found-search">
      <p>或者尝试搜索：</p>
    </div>
  </div>
</template>

<style>
.not-found-container {
  text-align: center;
  padding: 4rem 1.5rem;
  max-width: 560px;
  margin: 0 auto;
}

.not-found-code {
  font-size: 8rem;
  font-weight: 800;
  line-height: 1;
  background: linear-gradient(135deg, #2563EB 0%, #F97316 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 1rem;
}

.dark .not-found-code {
  background: linear-gradient(135deg, #3B82F6 0%, #FB923C 100%);
  -webkit-background-clip: text;
  background-clip: text;
}

.not-found-title {
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0 0 1rem;
  color: var(--vp-c-text-1);
}

.not-found-desc {
  font-size: 1rem;
  color: var(--vp-c-text-2);
  line-height: 1.7;
  margin: 0 0 2rem;
}

.not-found-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.not-found-btn {
  display: inline-flex;
  align-items: center;
  padding: 0.625rem 1.5rem;
  border-radius: 999px;
  font-size: 0.9375rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.25s ease;
}

.not-found-btn.primary {
  background: var(--vp-c-brand-1);
  color: #fff;
  border: 1px solid transparent;
}

.not-found-btn.primary:hover {
  background: var(--vp-c-brand-2);
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(37, 99, 235, 0.3);
}

.not-found-btn.secondary {
  background: transparent;
  color: var(--vp-c-brand-1);
  border: 1.5px solid var(--vp-c-brand-1);
}

.not-found-btn.secondary:hover {
  background: var(--vp-c-brand-soft);
  transform: translateY(-2px);
}

.not-found-search {
  margin-top: 2rem;
  color: var(--vp-c-text-3);
  font-size: 0.875rem;
}

@media (max-width: 480px) {
  .not-found-code {
    font-size: 5rem;
  }
  .not-found-title {
    font-size: 1.35rem;
  }
  .not-found-actions {
    flex-direction: column;
    align-items: center;
  }
}
</style>
