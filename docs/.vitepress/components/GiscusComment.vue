<template>
  <div style="margin-top: 2rem">
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
  </div>
</template>

<script setup>
import Giscus from '@giscus/vue'
import { computed, watch } from 'vue'
import { inBrowser, useData, useRoute } from 'vitepress'

const { isDark, frontmatter, page } = useData()
const route = useRoute()

// 使用页面标题作为评论映射键，确保每篇文章有独立评论线程
const commentTerm = computed(() => frontmatter.value.title || page.value.title || '请不吝赐教!')

watch(isDark, (dark) => {
  if (!inBrowser) return

  const iframe = document.querySelector('giscus-widget')?.shadowRoot?.querySelector('iframe')

  iframe?.contentWindow?.postMessage({ giscus: { setConfig: { theme: dark ? 'dark_tritanopia' : 'light_tritanopia' } } }, 'https://giscus.app')
})
</script>   