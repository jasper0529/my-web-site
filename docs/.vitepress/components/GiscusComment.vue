<template>
  <section class="comments-shell">
    <div class="comments-head">
      <span class="comments-code">DISCUSS</span>
      <div>
        <h3 class="comments-title">评论与讨论</h3>
        <p class="comments-subtitle">如果这篇文章对你有帮助，或你对实现细节有不同判断，可以直接在这里继续讨论。</p>
      </div>
    </div>
    <div class="comments-body">
      <ClientOnly>
        <Giscus
          id="comments"
          :key="route.path"
          repo="jasper0529/giscus"
          repo-id="R_kgDORlvm_g"
          category="Announcements"
          category-id="DIC_kwDORlvm_s4C4Rpo"
          mapping="title"
          strict="0"
          :term="commentTerm"
          reactions-enabled="1"
          emit-metadata="0"
          input-position="top"
          lang="zh-CN"
          loading="lazy"
          :theme="isDark ? 'dark_tritanopia' : 'light_tritanopia'"
        ></Giscus>
      </ClientOnly>
    </div>
  </section>
</template>

<script setup>
import Giscus from '@giscus/vue'
import { computed, watch } from 'vue'
import { inBrowser, useData, useRoute } from 'vitepress'

const { isDark, frontmatter, page } = useData()
const route = useRoute()

const commentTerm = computed(() => frontmatter.value.title || page.value.title || '请不吝赐教!')

watch(isDark, dark => {
  if (!inBrowser) return

  const iframe = document.querySelector('giscus-widget')?.shadowRoot?.querySelector('iframe')

  iframe?.contentWindow?.postMessage({ giscus: { setConfig: { theme: dark ? 'dark_tritanopia' : 'light_tritanopia' } } }, 'https://giscus.app')
})
</script>

<style scoped>
.comments-shell {
  margin-top: 2.6rem;
  padding: 1.3rem 1.35rem;
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: var(--radius-xl);
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.97), rgba(248, 250, 252, 0.99)),
    linear-gradient(135deg, rgba(37, 99, 235, 0.03), rgba(15, 23, 42, 0.02));
  box-shadow: 0 16px 34px rgba(15, 23, 42, 0.05);
}

.comments-head {
  display: flex;
  align-items: flex-start;
  gap: 0.9rem;
  margin-bottom: 1rem;
}

.comments-code {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 5.5rem;
  padding: 0.26rem 0.72rem;
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.92);
  color: #f8fafc;
  font-size: 0.76rem;
  font-weight: 700;
  letter-spacing: 0.08em;
}

.comments-title {
  margin: 0;
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
}

.comments-subtitle {
  margin: 0.35rem 0 0;
  color: var(--vp-c-text-2);
  font-size: 0.88rem;
  line-height: 1.7;
}

.comments-body {
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.dark .comments-shell {
  border-color: rgba(59, 130, 246, 0.15);
  background: rgba(15, 23, 42, 0.82);
  box-shadow: 0 0 15px rgba(59, 130, 246, 0.06);
}

@media (max-width: 640px) {
  .comments-shell {
    padding: 1.05rem 1rem;
    border-radius: var(--radius-lg);
  }

  .comments-head {
    flex-direction: column;
  }
}
</style>
