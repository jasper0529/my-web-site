<template>
  <div class="prompt-library">
    <!-- 页面头部 -->
    <div class="prompt-hero">
      <div class="prompt-hero-inner">
        <h2 class="prompt-hero-title">
          <span class="hero-icon">✨</span>
          Prompt 提示词库
        </h2>
        <p class="prompt-hero-desc">
          精心整理的 AI 提示词集合，助你高效使用 AI 工具。点击即可复制，快速使用。
        </p>
        <!-- 搜索框 -->
        <div class="prompt-search-box">
          <svg class="search-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="搜索提示词..."
            class="prompt-search-input"
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
    <div class="prompt-stats">
      <div class="stat-item">
        <span class="stat-number">{{ totalCount }}</span>
        <span class="stat-label">提示词总数</span>
      </div>
      <div class="stat-item">
        <span class="stat-number">{{ promptCategories.length }}</span>
        <span class="stat-label">分类数</span>
      </div>
      <div class="stat-item">
        <span class="stat-number">{{ filteredPrompts.length }}</span>
        <span class="stat-label">当前展示</span>
      </div>
    </div>

    <!-- 分类标签 -->
    <div class="prompt-categories">
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
        v-for="cat in promptCategories"
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

    <!-- 提示词列表 -->
    <div class="prompt-list">
      <TransitionGroup name="prompt-fade">
        <div
          v-for="prompt in paginatedPrompts"
          :key="prompt.id"
          class="prompt-card"
          :class="{ expanded: expandedId === prompt.id }"
        >
          <!-- 卡片头部 -->
          <div class="prompt-card-header" @click="toggleExpand(prompt.id)">
            <div class="prompt-card-info">
              <h3 class="prompt-card-title">{{ prompt.title }}</h3>
              <p class="prompt-card-desc">{{ prompt.description }}</p>
              <div class="prompt-card-tags" v-if="prompt.tags?.length">
                <span v-for="tag in prompt.tags" :key="tag" class="prompt-tag">{{ tag }}</span>
              </div>
            </div>
            <div class="prompt-card-actions">
              <button
                class="action-btn copy-btn"
                @click.stop="copyPrompt(prompt)"
                :title="copiedId === prompt.id ? '已复制！' : '复制提示词'"
              >
                <svg v-if="copiedId !== prompt.id" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
                <svg v-else viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </button>
              <button
                class="action-btn expand-btn"
                :class="{ 'is-expanded': expandedId === prompt.id }"
                @click.stop="toggleExpand(prompt.id)"
                title="展开/收起"
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
            </div>
          </div>

          <!-- 卡片展开内容 -->
          <Transition name="expand">
            <div v-if="expandedId === prompt.id" class="prompt-card-body">
              <div class="prompt-content-wrapper">
                <!-- 变量提示 -->
                <div v-if="prompt.variables?.length" class="prompt-variables">
                  <span class="variables-label">📝 模板变量：</span>
                  <code v-for="v in prompt.variables" :key="v" class="variable-code" v-text="'{{' + v + '}}'"></code>
                  <span class="variables-hint">请替换为实际内容后使用</span>
                </div>
                <!-- 提示词内容 -->
                <pre class="prompt-content"><code>{{ prompt.content }}</code></pre>
                <!-- 底部操作栏 -->
                <div class="prompt-card-footer">
                  <button class="footer-btn copy-full" @click="copyPrompt(prompt)">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                    {{ copiedId === prompt.id ? '已复制！' : '复制完整提示词' }}
                  </button>
                  <span v-if="prompt.author" class="prompt-author">贡献者：{{ prompt.author }}</span>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </TransitionGroup>

      <!-- 空状态 -->
      <div v-if="filteredPrompts.length === 0" class="prompt-empty">
        <div class="empty-icon">🔍</div>
        <p class="empty-text">没有找到匹配的提示词</p>
        <p class="empty-hint">试试其他关键词或切换分类</p>
      </div>
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

    <!-- 底部提示 -->
    <div class="prompt-footer-hint">
      <p>💡 点击提示词卡片可展开查看完整内容，点击复制按钮可一键复制</p>
      <p>📝 带有 <code v-text="'{{变量名}}'"></code> 标记的为模板变量，使用时请替换为实际内容</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

// 使用 Vite 的 glob 功能动态加载所有 JSON 文件
const promptModules = import.meta.glob('../data/prompts/*.json', { eager: true })

// 类型定义
interface PromptCategory {
  id: string
  name: string
  icon: string
  description: string
}

interface PromptItem {
  id: string
  category: string
  title: string
  description: string
  content: string
  tags?: string[]
  variables?: string[]
}

// 每页显示数量
const PAGE_SIZE = 6

// 从 glob 加载的结果中提取数据
const promptCategories = ref<PromptCategory[]>([])
const allPrompts = ref<PromptItem[]>([])

// 加载分类
import categoriesData from '../data/categories.json'
promptCategories.value = categoriesData as PromptCategory[]

// 加载提示词
if (promptModules && Object.keys(promptModules).length > 0) {
  const promptsData: PromptItem[] = Object.values(promptModules)
    .map((mod: any) => mod.default)
    .filter(Boolean)
  
  allPrompts.value = promptsData
}

// 状态
const searchQuery = ref('')
const activeCategory = ref('all')
const expandedId = ref<string | null>(null)
const copiedId = ref<string | null>(null)
const currentPage = ref(1)

// 计算属性
const totalCount = computed(() => allPrompts.value.length)

const filteredPrompts = computed(() => {
  let prompts = allPrompts.value

  // 按分类过滤
  if (activeCategory.value !== 'all') {
    prompts = prompts.filter(p => p.category === activeCategory.value)
  }

  // 按关键词搜索
  if (searchQuery.value.trim()) {
    const keyword = searchQuery.value.toLowerCase()
    prompts = prompts.filter(p =>
      p.title.toLowerCase().includes(keyword) ||
      p.description.toLowerCase().includes(keyword) ||
      p.content.toLowerCase().includes(keyword) ||
      p.tags?.some(tag => tag.toLowerCase().includes(keyword))
    )
  }

  return prompts
})

// 总页数
const totalPages = computed(() => Math.ceil(filteredPrompts.value.length / PAGE_SIZE))

// 当前页的提示词
const paginatedPrompts = computed(() => {
  const start = (currentPage.value - 1) * PAGE_SIZE
  const end = start + PAGE_SIZE
  return filteredPrompts.value.slice(start, end)
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

// 监听过滤条件变化，重置页码
watch([searchQuery, activeCategory], () => {
  currentPage.value = 1
  expandedId.value = null
})

// 方法
function getCategoryCount(categoryId: string): number {
  return allPrompts.value.filter(p => p.category === categoryId).length
}

function handleCategoryChange(categoryId: string) {
  activeCategory.value = categoryId
}

function toggleExpand(id: string) {
  expandedId.value = expandedId.value === id ? null : id
}

async function copyPrompt(prompt: PromptItem) {
  try {
    await navigator.clipboard.writeText(prompt.content)
    copiedId.value = prompt.id
    setTimeout(() => {
      if (copiedId.value === prompt.id) {
        copiedId.value = null
      }
    }, 2000)
  } catch (err) {
    // 降级方案
    const textarea = document.createElement('textarea')
    textarea.value = prompt.content
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
    copiedId.value = prompt.id
    setTimeout(() => {
      if (copiedId.value === prompt.id) {
        copiedId.value = null
      }
    }, 2000)
  }
}
</script>

<style scoped>
/* ========================================
   提示词库页面样式
   使用网站主题色系，保持一致性
   ======================================== */

.prompt-library {
  max-width: 960px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* ---- 页面头部 Hero ---- */
.prompt-hero {
  text-align: center;
  padding: 2.5rem 0 1.5rem;
}

.prompt-hero-inner {
  max-width: 600px;
  margin: 0 auto;
}

.prompt-hero-title {
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

.prompt-hero-desc {
  font-size: 1rem;
  color: var(--vp-c-text-2);
  line-height: 1.6;
  margin: 0 0 1.5rem;
}

/* ---- 搜索框 ---- */
.prompt-search-box {
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

.prompt-search-input {
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

.prompt-search-input::placeholder {
  color: var(--vp-c-text-3);
}

.prompt-search-input:focus {
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
.prompt-stats {
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
.prompt-categories {
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

/* ---- 提示词列表 ---- */
.prompt-list {
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
  min-height: 400px;
}

/* ---- 提示词卡片 ---- */
.prompt-card {
  border: 1.5px solid var(--vp-c-border);
  border-radius: 14px;
  background: var(--vp-c-bg);
  overflow: hidden;
  transition: all 0.3s ease;
}

.prompt-card:hover {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 4px 16px rgba(37, 99, 235, 0.08);
}

.prompt-card.expanded {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 4px 20px rgba(37, 99, 235, 0.12);
}

.prompt-card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 1.125rem 1.25rem;
  cursor: pointer;
  gap: 1rem;
  transition: background 0.2s ease;
}

.prompt-card-header:hover {
  background: var(--vp-c-bg-soft);
}

.prompt-card-info {
  flex: 1;
  min-width: 0;
}

.prompt-card-title {
  margin: 0 0 0.375rem;
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  line-height: 1.4;
}

.prompt-card-desc {
  margin: 0 0 0.625rem;
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
  line-height: 1.5;
}

.prompt-card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
}

.prompt-tag {
  display: inline-block;
  padding: 0.15rem 0.5rem;
  font-size: 0.75rem;
  border-radius: 999px;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  font-weight: 500;
}

/* ---- 卡片操作按钮 ---- */
.prompt-card-actions {
  display: flex;
  gap: 0.375rem;
  flex-shrink: 0;
  padding-top: 0.125rem;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-3);
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-btn:hover {
  color: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
}

.expand-btn.is-expanded svg {
  transform: rotate(180deg);
}

.expand-btn svg {
  transition: transform 0.3s ease;
}

/* ---- 卡片展开内容 ---- */
.prompt-card-body {
  border-top: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
}

.prompt-content-wrapper {
  padding: 1.25rem;
}

.prompt-variables {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.875rem;
  padding: 0.625rem 0.875rem;
  background: var(--vp-c-bg);
  border-radius: 8px;
  border: 1px dashed var(--vp-c-brand-1);
}

.variables-label {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--vp-c-text-2);
}

.variable-code {
  padding: 0.125rem 0.5rem;
  background: rgba(37, 99, 235, 0.1);
  color: var(--vp-c-brand-1);
  border-radius: 4px;
  font-size: 0.8rem;
  font-family: var(--vp-font-family-mono);
}

.variables-hint {
  font-size: 0.75rem;
  color: var(--vp-c-text-3);
  font-style: italic;
}

.prompt-content {
  margin: 0;
  padding: 1rem 1.25rem;
  background: var(--vp-c-bg);
  border-radius: 10px;
  border: 1px solid var(--vp-c-border);
  overflow-x: auto;
  font-size: 0.85rem;
  line-height: 1.7;
  color: var(--vp-c-text-2);
  white-space: pre-wrap;
  word-wrap: break-word;
  font-family: var(--vp-font-family-mono);
}

.prompt-content code {
  background: none;
  padding: 0;
  font-size: inherit;
  color: inherit;
}

/* ---- 卡片底部操作 ---- */
.prompt-card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 0.875rem;
  gap: 1rem;
}

.footer-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 1rem;
  border: 1.5px solid var(--vp-c-brand-1);
  border-radius: 8px;
  background: var(--vp-c-brand-1);
  color: #fff;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.25s ease;
}

.footer-btn:hover {
  background: var(--vp-c-brand-2);
  border-color: var(--vp-c-brand-2);
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.3);
}

.prompt-author {
  font-size: 0.8rem;
  color: var(--vp-c-text-3);
}

/* ---- 空状态 ---- */
.prompt-empty {
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
  font-weight: 500;
}

.empty-hint {
  font-size: 0.9rem;
  color: var(--vp-c-text-3);
  margin: 0;
}

/* ---- 分页 ---- */
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 2rem 0;
  margin-top: 1rem;
}

.page-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 1rem;
  border: 1.5px solid var(--vp-c-border);
  border-radius: 8px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.25s ease;
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
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.25s ease;
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
  font-size: 0.875rem;
}

/* ---- 底部提示 ---- */
.prompt-footer-hint {
  text-align: center;
  padding: 2rem 0;
  margin-top: 1rem;
  border-top: 1px solid var(--vp-c-divider);
}

.prompt-footer-hint p {
  margin: 0.25rem 0;
  font-size: 0.85rem;
  color: var(--vp-c-text-3);
}

.prompt-footer-hint code {
  padding: 0.125rem 0.375rem;
  background: var(--vp-c-bg-mute);
  border-radius: 4px;
  font-size: 0.8rem;
  color: var(--vp-c-brand-1);
  font-family: var(--vp-font-family-mono);
}

/* ---- 动画 ---- */
.prompt-fade-enter-active,
.prompt-fade-leave-active {
  transition: all 0.3s ease;
}

.prompt-fade-enter-from {
  opacity: 0;
  transform: translateY(12px);
}

.prompt-fade-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}

.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  max-height: 0;
}

.expand-enter-to,
.expand-leave-from {
  opacity: 1;
  max-height: 800px;
}

/* ---- 响应式 ---- */
@media (max-width: 640px) {
  .prompt-hero-title {
    font-size: 1.5rem;
  }

  .prompt-hero-desc {
    font-size: 0.9rem;
  }

  .prompt-stats {
    gap: 1.25rem;
  }

  .stat-number {
    font-size: 1.25rem;
  }

  .prompt-card-header {
    padding: 1rem;
    flex-direction: column;
  }

  .prompt-card-actions {
    align-self: flex-end;
  }

  .prompt-content-wrapper {
    padding: 1rem;
  }

  .category-tag {
    padding: 0.4rem 0.75rem;
    font-size: 0.8rem;
  }

  .pagination {
    gap: 0.5rem;
  }

  .page-btn {
    padding: 0.4rem 0.75rem;
    font-size: 0.8rem;
  }
}
</style>
