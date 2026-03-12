<script setup lang="ts">
import { useData } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import DocMeta from './DocMeta.vue'
import BackToTop from './BackToTop.vue'

const { Layout } = DefaultTheme
const { frontmatter } = useData()

// 判断是否显示文档元信息
const showDocMeta = () => {
  return frontmatter.value.date || 
         (frontmatter.value.tags && frontmatter.value.tags.length > 0) ||
         frontmatter.value.title
}
</script>

<template>
  <Layout>
    <!-- 在文档内容前插入元信息 -->
    <template #doc-before>
      <DocMeta v-if="showDocMeta()" />
    </template>
    
    <!-- 在布局后插入返回顶部按钮 -->
    <template #layout-bottom>
      <BackToTop />
    </template>
  </Layout>
</template>

<style>
</style>
