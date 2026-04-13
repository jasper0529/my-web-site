<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useRoute } from 'vitepress'

// Google Analytics 配置
const GA_ID = 'G-8DKGELKCKF' // 在这里填入你的 Google Analytics ID，如 'G-XXXXXXXXXX'

// 百度统计配置
const BA_ID = '' // 在这里填入你的百度统计 ID

const route = useRoute()
const isClient = typeof window !== 'undefined'

// 初始化 Google Analytics
function initGA() {
  if (!GA_ID || !isClient) return
  
  // 动态加载 GA 脚本
  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`
  document.head.appendChild(script)
  
  // 初始化 gtag
  window.dataLayer = window.dataLayer || []
  function gtag(...args: any[]) {
    window.dataLayer.push(args)
  }
  (window as any).gtag = gtag
  
  gtag('js', new Date())
  gtag('config', GA_ID, {
    page_path: route.path
  })
}

// 初始化百度统计
function initBaidu() {
  if (!BA_ID || !isClient) return
  
  const script = document.createElement('script')
  script.async = true
  script.src = `https://hm.baidu.com/hm.js?${BA_ID}`
  document.head.appendChild(script)
  
  (window as any)._hmt = (window as any)._hmt || []
}

// 页面访问统计
function trackPageView() {
  if (!isClient) return
  
  // Google Analytics 页面访问
  if (GA_ID && (window as any).gtag) {
    (window as any).gtag('event', 'page_view', {
      page_path: route.path,
      page_title: document.title
    })
  }
  
  // 百度统计页面访问
  if (BA_ID && (window as any)._hmt) {
    (window as any)._hmt.push(['_trackPageview', route.path])
  }
}

onMounted(() => {
  if (!isClient) return
  initGA()
  initBaidu()
})

// 监听路由变化
if (isClient) {
  watch(
    () => route.path,
    () => {
      trackPageView()
    }
  )
}
</script>

<template>
  <!-- 分析工具通过 JavaScript 动态加载 -->
</template>
