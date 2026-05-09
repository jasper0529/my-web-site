<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

// 站点运行时间
const uptime = ref('')
const siteStartDate = '2024-01-01'

const calculateUptime = () => {
  const start = new Date(siteStartDate).getTime()
  const now = Date.now()
  const diff = now - start

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)

  uptime.value = `${days} 天 ${hours} 时 ${minutes} 分 ${seconds} 秒`
}

let timer: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  calculateUptime()
  timer = setInterval(calculateUptime, 1000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})

const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="site-footer">
    <div class="footer-inner">
      <!-- 上方：多列信息 -->
      <div class="footer-columns">
        <!-- 关于 -->
        <div class="footer-col">
          <h4 class="footer-col-title">关于本站</h4>
          <p class="footer-col-desc">记录学习，分享知识，沉淀成长。专注于 Python、AI、算法等技术领域的深度探索。</p>
        </div>

        <!-- 导航 -->
        <div class="footer-col">
          <h4 class="footer-col-title">快速导航</h4>
          <ul class="footer-links">
            <li><a href="/">首页</a></li>
            <li><a href="/python/">Python</a></li>
            <li><a href="/ai/">AI</a></li>
            <li><a href="/algorithm/">算法</a></li>
          </ul>
        </div>

        <!-- 资源 -->
        <div class="footer-col">
          <h4 class="footer-col-title">更多</h4>
          <ul class="footer-links">
            <li><a href="/tags/">标签云</a></li>
            <li><a href="/others/archives/">文章归档</a></li>
            <li><a href="/others/about/">关于作者</a></li>
            <li><a href="/others/sitemap-page/">站点地图</a></li>
          </ul>
        </div>

        <!-- 运行状态 -->
        <div class="footer-col">
          <h4 class="footer-col-title">站点状态</h4>
          <div class="footer-status">
            <div class="status-item">
              <span class="status-dot online"></span>
              <span>运行中</span>
            </div>
            <div class="status-item uptime-display">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              <span>{{ uptime }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 分隔线 -->
      <div class="footer-divider"></div>

      <!-- 下方：版权信息 -->
      <div class="footer-bottom">
        <div class="footer-copyright">
          <span>Copyright © {{ siteStartDate.split('-')[0] }}-{{ currentYear }}</span>
          <span class="footer-separator">·</span>
          <span>基于 <a href="https://vitepress.dev" target="_blank" rel="noopener">VitePress</a> 构建</span>
        </div>
        <div class="footer-meta">
          <span class="footer-separator">|</span>
          <a href="/robots.txt" target="_blank" rel="noopener">Robots</a>
          <span class="footer-separator">·</span>
          <a href="/sitemap.xml" target="_blank">Sitemap</a>
          <span class="footer-separator">·</span>
          <a href="/feed.json" target="_blank">RSS</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  background: var(--vp-c-bg-soft);
  border-top: 1px solid var(--vp-c-divider);
  padding: 2.5rem 1.5rem 1.5rem;
  margin-top: 0;
}

.footer-inner {
  max-width: 1152px;
  margin: 0 auto;
}

/* 多列布局 */
.footer-columns {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1.5fr;
  gap: 2rem;
}

.footer-col-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin: 0 0 0.75rem 0;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid var(--vp-c-brand-1);
  display: inline-block;
}

.footer-col-desc {
  font-size: 0.8125rem;
  color: var(--vp-c-text-2);
  line-height: 1.7;
  margin: 0;
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-links li {
  margin-bottom: 0.375rem;
}

.footer-links a {
  font-size: 0.8125rem;
  color: var(--vp-c-text-2);
  text-decoration: none;
  transition: color 0.2s;
}

.footer-links a:hover {
  color: var(--vp-c-brand-1);
}

/* 运行状态 */
.footer-status {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.8125rem;
  color: var(--vp-c-text-2);
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.status-dot.online {
  background: #10B981;
  box-shadow: 0 0 6px rgba(16, 185, 129, 0.5);
  animation: pulse-dot 2s ease-in-out infinite;
}

@keyframes pulse-dot {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.uptime-display {
  font-variant-numeric: tabular-nums;
  font-family: var(--vp-font-family-mono, monospace);
  font-size: 0.75rem;
}

.uptime-display svg {
  color: var(--vp-c-brand-1);
  flex-shrink: 0;
}

/* 分隔线 */
.footer-divider {
  height: 1px;
  background: var(--vp-c-divider);
  margin: 1.5rem 0;
}

/* 底部版权 */
.footer-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.footer-copyright,
.footer-meta {
  font-size: 0.75rem;
  color: var(--vp-c-text-3);
}

.footer-copyright a,
.footer-meta a {
  color: var(--vp-c-text-3);
  text-decoration: none;
  transition: color 0.2s;
}

.footer-copyright a:hover,
.footer-meta a:hover {
  color: var(--vp-c-brand-1);
}

.footer-separator {
  margin: 0 0.25rem;
  opacity: 0.5;
}

/* 暗色模式 */
.dark .site-footer {
  border-top-color: var(--glow-border, rgba(59, 130, 246, 0.12));
  background: rgba(15, 23, 42, 0.6);
}

.dark .status-dot.online {
  box-shadow: 0 0 6px rgba(16, 185, 129, 0.4);
}

/* 响应式 */
@media (max-width: 768px) {
  .footer-columns {
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
  }
}

@media (max-width: 480px) {
  .footer-columns {
    grid-template-columns: 1fr;
    gap: 1.25rem;
  }

  .footer-bottom {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
