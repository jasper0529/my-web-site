<script setup lang="ts">
import { useData } from 'vitepress'
import { computed } from 'vue'

const { frontmatter, page, site } = useData()
const isClient = typeof window !== 'undefined'

// 获取文章信息
const articleInfo = computed(() => {
  const title = frontmatter.value.title || page.value.title || '未命名文章'
  const author = frontmatter.value.author || site.value.title || '作者'
  const date = frontmatter.value.date || ''
  const permalink = frontmatter.value.permalink || ''
  
  // 构建完整链接
  const baseUrl = site.value.base || '/'
  const pageUrl = page.value.relativePath || ''
  const origin = isClient ? window.location.origin : ''
  const fullUrl = permalink 
    ? `${origin}${permalink}`
    : `${origin}${baseUrl}${pageUrl.replace(/\.md$/, '.html')}`
  
  return {
    title,
    author,
    date,
    url: fullUrl
  }
})

// 是否显示版权信息（排除首页等特殊页面）
const showCopyright = computed(() => {
  const path = page.value.relativePath
  // 排除首页和特殊页面
  if (path === 'index.md' || path.endsWith('/index.md')) {
    return false
  }
  return frontmatter.value.title !== undefined
})
</script>

<template>
  <div v-if="showCopyright" class="article-copyright">
    <div class="copyright-header">
      <svg class="copyright-icon" viewBox="0 0 24 24" width="20" height="20">
        <path fill="currentColor" d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
      </svg>
      <span class="copyright-title">版权声明</span>
    </div>
    
    <div class="copyright-content">
      <div class="copyright-item">
        <span class="item-label">本文作者：</span>
        <span class="item-value">{{ articleInfo.author }}</span>
      </div>
      
      <div class="copyright-item">
        <span class="item-label">文章标题：</span>
        <span class="item-value">{{ articleInfo.title }}</span>
      </div>
      
      <div class="copyright-item">
        <span class="item-label">本文链接：</span>
        <a :href="articleInfo.url" class="item-link" target="_blank" rel="noopener noreferrer">
          {{ articleInfo.url }}
        </a>
      </div>
      
      <div class="copyright-item">
        <span class="item-label">版权声明：</span>
        <span class="item-value license-text">
          本博客所有文章除特别声明外，均采用 
          <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" 
             target="_blank" 
             rel="noopener noreferrer"
             class="license-link">
            CC BY-NC-SA 4.0
          </a> 
          许可协议。转载请注明出处！
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.article-copyright {
  margin: 2rem 0;
  padding: 1.25rem 1.5rem;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-border);
  border-radius: 12px;
  position: relative;
  overflow: hidden;
}

.article-copyright::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: linear-gradient(180deg, var(--vp-c-brand-1), var(--vp-c-brand-2));
}

.copyright-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px dashed var(--vp-c-border);
}

.copyright-icon {
  color: var(--vp-c-brand-1);
}

.copyright-title {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.copyright-content {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.copyright-item {
  display: flex;
  align-items: flex-start;
  font-size: 0.875rem;
  line-height: 1.6;
}

.item-label {
  color: var(--vp-c-text-2);
  min-width: 80px;
  flex-shrink: 0;
}

.item-value {
  color: var(--vp-c-text-1);
  word-break: break-all;
}

.item-link {
  color: var(--vp-c-brand-1);
  word-break: break-all;
  text-decoration: none;
  transition: color 0.2s ease;
}

.item-link:hover {
  color: var(--vp-c-brand-2);
  text-decoration: underline;
}

.license-text {
  color: var(--vp-c-text-2);
}

.license-link {
  color: var(--vp-c-brand-1);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;
}

.license-link:hover {
  color: var(--vp-c-brand-2);
  text-decoration: underline;
}

/* 暗色模式优化 */
.dark .article-copyright {
  background: var(--vp-c-bg-mute);
}

/* 移动端适配 */
@media (max-width: 768px) {
  .article-copyright {
    padding: 1rem 1.25rem;
    margin: 1.5rem 0;
  }
  
  .copyright-item {
    flex-direction: column;
    gap: 0.25rem;
  }
  
  .item-label {
    min-width: auto;
  }
}
</style>
