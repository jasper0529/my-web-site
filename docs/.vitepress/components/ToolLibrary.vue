<template>
  <div class="tool-library">
    <!-- 页面头部 -->
    <div class="tool-hero">
      <div class="tool-hero-inner">
        <h2 class="tool-hero-title">
          <span class="hero-icon">🛠️</span>
          常用工具箱
        </h2>
        <p class="tool-hero-desc">
          精心筛选的开发者工具与服务，覆盖开发、设计、AI 等多个领域，助你高效工作。
        </p>
        <!-- 搜索框 -->
        <div class="tool-search-box">
          <svg class="search-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="搜索工具名称、描述或标签..."
            class="tool-search-input"
          />
          <button v-if="searchQuery" class="search-clear" @click="searchQuery = ''">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- 统计信息 -->
    <div class="tool-stats">
      <div class="stat-item">
        <span class="stat-number">{{ totalCount }}</span>
        <span class="stat-label">工具总数</span>
      </div>
      <div class="stat-item">
        <span class="stat-number">{{ toolCategories.length }}</span>
        <span class="stat-label">分类数</span>
      </div>
      <div class="stat-item">
        <span class="stat-number">{{ filteredTools.length }}</span>
        <span class="stat-label">当前展示</span>
      </div>
    </div>

    <!-- 分类标签 -->
    <div class="tool-categories">
      <button
        class="category-tag"
        :class="{ active: activeCategory === 'all' }"
        @click="handleCategoryChange('all')"
      >
        <span class="category-icon">🏷️</span>
        全部
        <span class="category-count">{{ totalCount }}</span>
      </button>
      <button
        v-for="cat in toolCategories"
        :key="cat.id"
        class="category-tag"
        :class="{ active: activeCategory === cat.id }"
        @click="handleCategoryChange(cat.id)"
        :title="cat.description"
      >
        <span class="category-icon">{{ cat.icon }}</span>
        {{ cat.name }}
        <span class="category-count">{{ getCategoryCount(cat.id) }}</span>
      </button>
    </div>

    <!-- 工具列表 -->
    <div class="tool-section">
      <h3 class="section-title" v-if="activeCategory === 'all' && !searchQuery.trim()">
        <span class="section-icon">📋</span>
        全部工具
      </h3>
      <div class="tool-grid">
        <TransitionGroup name="tool-fade">
          <a
            v-for="tool in paginatedTools"
            :key="tool.id"
            :href="tool.url"
            target="_blank"
            rel="noopener noreferrer"
            class="tool-card"
          >
            <div class="tool-card-icon">
              <img
                v-if="tool.icon"
                :src="tool.icon"
                :alt="tool.name"
                @error="handleIconError($event)"
              />
              <span v-else class="tool-card-fallback">{{ tool.name.charAt(0) }}</span>
            </div>
            <div class="tool-card-info">
              <h4 class="tool-card-name">
                {{ tool.name }}
                <svg class="external-link-icon" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </h4>
              <p class="tool-card-desc">{{ tool.description }}</p>
              <div v-if="tool.tags?.length" class="tool-card-tags">
                <span v-for="tag in tool.tags" :key="tag" class="tool-tag">{{ tag }}</span>
              </div>
            </div>
          </a>
        </TransitionGroup>
      </div>

      <!-- 分页控件 -->
      <div v-if="totalPages > 1" class="pagination">
        <button
          class="page-btn nav-btn"
          :disabled="currentPage === 1"
          @click="currentPage--"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          上一页
        </button>

        <div class="page-numbers">
          <!-- 首页 -->
          <button
            v-if="showFirstPage"
            class="page-num"
            :class="{ active: currentPage === 1 }"
            @click="currentPage = 1"
          >
            1
          </button>
          <span v-if="showFirstPage && currentPage > 3" class="page-ellipsis">...</span>

          <!-- 中间页码 -->
          <button
            v-for="page in visiblePages"
            :key="page"
            class="page-num"
            :class="{ active: currentPage === page }"
            @click="currentPage = page"
          >
            {{ page }}
          </button>

          <!-- 末页 -->
          <span v-if="showLastPage && currentPage < totalPages - 2" class="page-ellipsis">...</span>
          <button
            v-if="showLastPage"
            class="page-num"
            :class="{ active: currentPage === totalPages }"
            @click="currentPage = totalPages"
          >
            {{ totalPages }}
          </button>
        </div>

        <button
          class="page-btn nav-btn"
          :disabled="currentPage === totalPages"
          @click="currentPage++"
        >
          下一页
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      <!-- 空状态 -->
      <div v-if="filteredTools.length === 0" class="tool-empty">
        <div class="empty-icon">🔍</div>
        <p class="empty-text">没有找到匹配的工具</p>
        <p class="empty-hint">试试其他关键词或切换分类</p>
      </div>
    </div>

    <!-- 底部提示 -->
    <div class="tool-footer-hint">
      <p>💡 点击工具卡片可直接访问官网，所有工具均经过筛选推荐</p>
      <p>📮 如果你有好用的工具推荐，欢迎通过 GitHub Issue 提交</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

// 使用 Vite 的 glob 功能动态加载所有工具 JSON 文件
const toolModules = import.meta.glob('../data/tools/*.json', { eager: true })

// 类型定义
interface ToolCategory {
  id: string
  name: string
  icon: string
  description: string
}

interface ToolItem {
  id: string
  category: string
  name: string
  description: string
  url: string
  icon?: string
  tags?: string[]
  featured?: boolean
}

// 从 glob 加载的结果中提取数据
const toolCategories = ref<ToolCategory[]>([])
const allTools = ref<ToolItem[]>([])

// 加载分类
import categoriesData from '../data/tools/categories.json'
toolCategories.value = categoriesData as ToolCategory[]

// 加载工具数据
if (toolModules && Object.keys(toolModules).length > 0) {
  const toolsData: ToolItem[] = Object.values(toolModules)
    .flatMap((mod: any) => {
      const data = mod.default
      if (Array.isArray(data)) {
        return data
      }
      return data ? [data] : []
    })
    .filter((item: any) => item && typeof item === 'object' && typeof item.url === 'string' && typeof item.name === 'string')

  allTools.value = toolsData
}

// 每页显示数量
const PAGE_SIZE = 9

// 状态
const searchQuery = ref('')
const activeCategory = ref('all')
const currentPage = ref(1)

// 计算属性
const totalCount = computed(() => allTools.value.length)

const filteredTools = computed(() => {
  let tools = allTools.value

  // 按分类过滤
  if (activeCategory.value !== 'all') {
    tools = tools.filter(t => t.category === activeCategory.value)
  }

  // 按关键词搜索
  if (searchQuery.value.trim()) {
    const keyword = searchQuery.value.toLowerCase()
    tools = tools.filter(t =>
      t.name.toLowerCase().includes(keyword) ||
      t.description.toLowerCase().includes(keyword) ||
      t.tags?.some(tag => tag.toLowerCase().includes(keyword))
    )
  }

  return tools
})

// 展示的工具列表
const displayTools = computed(() => {
  return filteredTools.value
})

// 总页数
const totalPages = computed(() => Math.ceil(displayTools.value.length / PAGE_SIZE))

// 当前页工具
const paginatedTools = computed(() => {
  const start = (currentPage.value - 1) * PAGE_SIZE
  const end = start + PAGE_SIZE
  return displayTools.value.slice(start, end)
})

// 分页显示相关计算属性
const maxVisiblePages = 5 // 最多显示5个页码

const visiblePages = computed(() => {
  const pages: number[] = []
  const total = totalPages.value
  const current = currentPage.value
  
  if (total <= maxVisiblePages + 2) {
    // 总页数较少，显示所有中间页码（排除首尾）
    for (let i = 2; i < total; i++) {
      pages.push(i)
    }
  } else {
    // 计算显示范围
    let start = Math.max(2, current - Math.floor(maxVisiblePages / 2))
    let end = Math.min(total - 1, start + maxVisiblePages - 1)
    
    // 调整范围确保显示足够的页码
    if (end - start < maxVisiblePages - 1) {
      start = Math.max(2, end - maxVisiblePages + 1)
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
  }
  
  return pages
})

const showFirstPage = computed(() => totalPages.value > 1)
const showLastPage = computed(() => totalPages.value > maxVisiblePages + 1)

// 方法
function getCategoryCount(categoryId: string): number {
  return allTools.value.filter(t => t.category === categoryId).length
}

function handleCategoryChange(categoryId: string) {
  activeCategory.value = categoryId
}

// 键盘导航
function handleKeydown(event: KeyboardEvent) {
  // 只在分页存在且有焦点时响应
  if (totalPages.value <= 1) return
  
  // 检查当前焦点是否在输入框内
  const activeElement = document.activeElement
  const isInputFocused = activeElement &&
    (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA' ||
     activeElement.getAttribute('contenteditable') === 'true')
  
  if (isInputFocused) return

  if (event.key === 'ArrowLeft' && currentPage.value > 1) {
    event.preventDefault()
    currentPage.value--
  } else if (event.key === 'ArrowRight' && currentPage.value < totalPages.value) {
    event.preventDefault()
    currentPage.value++
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})

function handleIconError(event: Event) {
  const img = event.target as HTMLImageElement
  img.style.display = 'none'
  const parent = img.parentElement
  if (parent) {
    const fallback = parent.querySelector('.tool-card-fallback') as HTMLElement
    if (fallback) {
      fallback.style.display = 'flex'
    }
  }
}

// 监听过滤条件变化
watch([searchQuery, activeCategory], () => {
  currentPage.value = 1
})
</script>

<style scoped>
/* ========================================
   工具库页面样式
   参考自 codefather.cn/tool 的设计风格
   使用网站主题色系，保持一致性
   ======================================== */

.tool-library {
  max-width: 960px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* ---- 页面头部 Hero ---- */
.tool-hero {
  text-align: center;
  padding: 2.5rem 0 1.5rem;
}

.tool-hero-inner {
  max-width: 600px;
  margin: 0 auto;
}

.tool-hero-title {
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 0.75rem;
  color: var(--vp-c-text-1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.hero-icon {
  font-size: 1.8rem;
}

.tool-hero-desc {
  font-size: 1rem;
  color: var(--vp-c-text-2);
  line-height: 1.6;
  margin: 0 0 1.5rem;
}

/* ---- 搜索框 ---- */
.tool-search-box {
  position: relative;
  max-width: 480px;
  margin: 0 auto;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 14px;
  color: var(--vp-c-text-3);
  pointer-events: none;
}

.tool-search-input {
  width: 100%;
  padding: 0.75rem 2.5rem 0.75rem 2.75rem;
  border: 2px solid var(--vp-c-border);
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  font-size: 0.95rem;
  outline: none;
  transition: all 0.25s ease;
}

.tool-search-input::placeholder {
  color: var(--vp-c-text-3);
}

.tool-search-input:focus {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  background: var(--vp-c-bg);
}

.search-clear {
  position: absolute;
  right: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  color: var(--vp-c-text-3);
  cursor: pointer;
  padding: 4px;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.search-clear:hover {
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg-mute);
}

/* ---- 统计信息 ---- */
.tool-stats {
  display: flex;
  justify-content: center;
  gap: 2rem;
  padding: 1.25rem 0;
  margin-bottom: 1rem;
  border-bottom: 1px solid var(--vp-c-divider);
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.stat-number {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--vp-c-brand-1);
  line-height: 1;
}

.stat-label {
  font-size: 0.8rem;
  color: var(--vp-c-text-3);
}

/* ---- 分类标签 ---- */
.tool-categories {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 1rem 0 1.5rem;
  justify-content: center;
}

.category-tag {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.5rem 1rem;
  border: 1.5px solid var(--vp-c-border);
  border-radius: 999px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.25s ease;
  white-space: nowrap;
}

.category-tag:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
}

.category-tag.active {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-1);
  color: #fff;
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.3);
}

.category-icon {
  font-size: 0.9rem;
}

.category-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.25rem;
  height: 1.25rem;
  padding: 0 0.35rem;
  border-radius: 999px;
  background: var(--vp-c-default-soft);
  color: var(--vp-c-text-3);
  font-size: 0.7rem;
  font-weight: 600;
  line-height: 1;
}

.category-tag:hover .category-count {
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
}

.category-tag.active .category-count {
  background: rgba(255, 255, 255, 0.25);
  color: #fff;
}

/* ---- 工具区块 ---- */
.tool-section {
  margin-bottom: 2rem;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin: 0 0 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.section-icon {
  font-size: 1.1rem;
}

/* ---- 工具网格 ---- */
.tool-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
}

/* ---- 工具卡片 ---- */
.tool-card {
  position: relative;
  display: flex;
  gap: 0.875rem;
  padding: 1.125rem;
  border: 1.5px solid var(--vp-c-border);
  border-radius: 14px;
  background: var(--vp-c-bg);
  text-decoration: none;
  color: inherit;
  transition: all 0.3s ease;
  overflow: hidden;
}

.tool-card:hover {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 4px 16px rgba(37, 99, 235, 0.1);
  transform: translateY(-2px);
}


/* ---- 工具图标 ---- */
.tool-card-icon {
  width: 44px;
  height: 44px;
  flex-shrink: 0;
  border-radius: 10px;
  overflow: hidden;
  background: var(--vp-c-bg-soft);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--vp-c-divider);
}

.tool-card-icon img {
  width: 28px;
  height: 28px;
  object-fit: contain;
}

.tool-card-fallback {
  display: none;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
}

/* ---- 工具信息 ---- */
.tool-card-info {
  flex: 1;
  min-width: 0;
}

.tool-card-name {
  margin: 0 0 0.375rem;
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  line-height: 1.4;
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.external-link-icon {
  flex-shrink: 0;
  opacity: 0;
  color: var(--vp-c-text-3);
  transition: all 0.2s ease;
}

.tool-card:hover .external-link-icon {
  opacity: 1;
  color: var(--vp-c-brand-1);
}

.tool-card-desc {
  margin: 0 0 0.5rem;
  font-size: 0.825rem;
  color: var(--vp-c-text-2);
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.tool-card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
}

.tool-tag {
  display: inline-block;
  padding: 0.1rem 0.45rem;
  font-size: 0.7rem;
  border-radius: 4px;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  font-weight: 500;
}

/* ---- 空状态 ---- */
.tool-empty {
  text-align: center;
  padding: 3rem 1rem;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.empty-text {
  font-size: 1.1rem;
  color: var(--vp-c-text-2);
  margin: 0 0 0.5rem;
}

.empty-hint {
  font-size: 0.875rem;
  color: var(--vp-c-text-3);
  margin: 0;
}

/* ---- 底部提示 ---- */
.tool-footer-hint {
  padding: 1.5rem 0;
  border-top: 1px solid var(--vp-c-divider);
  margin-top: 1rem;
}

.tool-footer-hint p {
  font-size: 0.85rem;
  color: var(--vp-c-text-3);
  margin: 0 0 0.5rem;
  line-height: 1.6;
}

.tool-footer-hint p:last-child {
  margin-bottom: 0;
}

/* ---- 分页控件 ---- */
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.25rem;
  padding: 1.5rem 0 0.5rem;
}

.page-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.5rem 0.9rem;
  border: 1.5px solid var(--vp-c-border);
  border-radius: 10px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.page-btn:hover:not(:disabled) {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 页码数字区域 */
.page-numbers {
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.page-num {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 2rem;
  height: 2rem;
  padding: 0 0.5rem;
  border: 1.5px solid var(--vp-c-border);
  border-radius: 8px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.page-num:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
}

.page-num.active {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-1);
  color: #fff;
  font-weight: 600;
}

.page-ellipsis {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.5rem;
  color: var(--vp-c-text-3);
  font-size: 0.85rem;
}

/* ---- 过渡动画 ---- */
.tool-fade-enter-active {
  transition: all 0.3s ease;
}

.tool-fade-leave-active {
  transition: all 0.2s ease;
}

.tool-fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.tool-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* ---- 响应式适配 ---- */
@media (max-width: 640px) {
  .tool-hero-title {
    font-size: 1.5rem;
  }

  .tool-stats {
    gap: 1.25rem;
  }

  .stat-number {
    font-size: 1.25rem;
  }

  .tool-grid {
    grid-template-columns: 1fr;
  }

  .tool-categories {
    justify-content: flex-start;
    overflow-x: auto;
    flex-wrap: nowrap;
    padding-bottom: 0.75rem;
    -webkit-overflow-scrolling: touch;
  }

  .category-tag {
    flex-shrink: 0;
  }
}
</style>
