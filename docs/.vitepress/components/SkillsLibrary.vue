<template>
  <div class="skill-library">
    <!-- 页面头部 -->
    <div class="skill-hero">
      <div class="skill-hero-inner">
        <h2 class="skill-hero-title">
          <span class="hero-icon">⚡</span>
          Agent Skills 技能库
        </h2>
        <p class="skill-hero-desc">
          扩展 AI 编程助手能力的标准化功能模块，涵盖代码审查、测试、重构、文档生成等场景。点击即可复制使用。
        </p>
        <!-- 搜索框 -->
        <div class="skill-search-box">
          <svg class="search-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="搜索技能名称、描述或标签..."
            class="skill-search-input"
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
    <div class="skill-stats">
      <div class="stat-item">
        <span class="stat-number">{{ totalCount }}</span>
        <span class="stat-label">技能总数</span>
      </div>
      <div class="stat-item">
        <span class="stat-number">{{ skillCategories.length }}</span>
        <span class="stat-label">分类数</span>
      </div>
      <div class="stat-item">
        <span class="stat-number">{{ filteredSkills.length }}</span>
        <span class="stat-label">当前展示</span>
      </div>
    </div>

    <!-- 分类标签 -->
    <div class="skill-categories">
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
        v-for="cat in skillCategories"
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

    <!-- 技能列表 -->
    <div class="skill-section">
      <h3 class="section-title" v-if="activeCategory === 'all' && !searchQuery.trim()">
        <span class="section-icon">📋</span>
        全部技能
      </h3>
      <div class="skill-grid">
        <TransitionGroup name="skill-fade">
          <div
            v-for="skill in paginatedSkills"
            :key="skill.id"
            class="skill-card"
            :class="{ expanded: expandedId === skill.id }"
          >
            <!-- 卡片头部 -->
            <div class="skill-card-header" @click="toggleExpand(skill.id)">
              <div class="skill-card-info">
                <h4 class="skill-card-title">
                  {{ skill.title }}
                </h4>
                <p class="skill-card-desc">{{ skill.description }}</p>
                <div v-if="skill.tags?.length" class="skill-card-tags">
                  <span v-for="tag in skill.tags" :key="tag" class="skill-tag">{{ tag }}</span>
                </div>
              </div>
              <div class="skill-card-actions">
                <button
                  class="action-btn copy-btn"
                  @click.stop="copySkill(skill)"
                  :title="copiedId === skill.id ? '已复制！' : '复制技能'"
                >
                  <svg v-if="copiedId !== skill.id" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                  <svg v-else viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </button>
                <button
                  class="action-btn expand-btn"
                  :class="{ 'is-expanded': expandedId === skill.id }"
                  @click.stop="toggleExpand(skill.id)"
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
              <div v-if="expandedId === skill.id" class="skill-card-body">
                <div class="skill-content-wrapper">
                  <!-- Tab 切换 -->
                  <div class="skill-tabs">
                    <button
                      class="skill-tab"
                      :class="{ active: activeTab[skill.id] !== 'source' }"
                      @click="setActiveTab(skill.id, 'preview')"
                    >
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                      预览
                    </button>
                    <button
                      class="skill-tab"
                      :class="{ active: activeTab[skill.id] === 'source' }"
                      @click="setActiveTab(skill.id, 'source')"
                    >
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="16 18 22 12 16 6" />
                        <polyline points="8 6 2 12 8 18" />
                      </svg>
                      源码
                    </button>
                  </div>
                  
                  <!-- 预览内容 -->
                  <div v-if="activeTab[skill.id] !== 'source'" class="skill-preview">
                    <div class="skill-preview-content" v-html="renderMarkdown(skill.content)"></div>
                  </div>
                  
                  <!-- 源码内容 -->
                  <div v-else class="skill-source-code">
                    <pre class="skill-content"><code>{{ skill.content }}</code></pre>
                  </div>
                  
                  <!-- 底部操作栏 -->
                  <div class="skill-card-footer">
                    <button class="footer-btn copy-full" @click="copySkill(skill)">
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                      </svg>
                      {{ copiedId === skill.id ? '已复制！' : '复制完整技能' }}
                    </button>
                    <a v-if="skill.source" :href="skill.source" target="_blank" rel="noopener noreferrer" class="skill-source">
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                      </svg>
                      查看来源
                    </a>
                  </div>
                </div>
              </div>
            </Transition>
          </div>
        </TransitionGroup>
      </div>

      <!-- 空状态 -->
      <div v-if="filteredSkills.length === 0" class="skill-empty">
        <div class="empty-icon">🔍</div>
        <p class="empty-text">没有找到匹配的技能</p>
        <p class="empty-hint">试试其他关键词或切换分类</p>
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
    </div>

    <!-- 底部提示 -->
    <div class="skill-footer-hint">
      <p>💡 点击技能卡片可展开查看完整内容，点击复制按钮可一键复制</p>
      <p>📦 Skills 是扩展 AI 编程助手能力的标准化功能模块，复制后可在 Claude Code 或 Codex CLI 中使用</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import MarkdownIt from 'markdown-it'

// 使用 Vite 的 glob 功能动态加载所有技能 JSON 文件
const skillModules = import.meta.glob('../data/skills/*.json', { eager: true })

// 类型定义
interface SkillCategory {
  id: string
  name: string
  icon: string
  description: string
}

interface SkillItem {
  id: string
  category: string
  title: string
  description: string
  content: string
  tags?: string[]
  source?: string
}

// 从 glob 加载的结果中提取数据
const skillCategories = ref<SkillCategory[]>([])
const allSkills = ref<SkillItem[]>([])

// 加载分类
import categoriesData from '../data/skills/categories.json'
skillCategories.value = (categoriesData as any[]).filter((cat: any) => cat.id !== 'categories')

// 加载技能数据
if (skillModules && Object.keys(skillModules).length > 0) {
  const skillsData: SkillItem[] = Object.entries(skillModules)
    .filter(([path]) => !path.endsWith('categories.json'))
    .map(([, mod]: [string, any]) => mod.default)
    .filter(Boolean)

  allSkills.value = skillsData
}

// 每页显示数量
const PAGE_SIZE = 6

// 状态
const searchQuery = ref('')
const activeCategory = ref('all')
const expandedId = ref<string | null>(null)
const copiedId = ref<string | null>(null)
const currentPage = ref(1)
const activeTab = ref<Record<string, string>>({})

// 计算属性
const totalCount = computed(() => allSkills.value.length)

const filteredSkills = computed(() => {
  let skills = allSkills.value

  // 按分类过滤
  if (activeCategory.value !== 'all') {
    skills = skills.filter(s => s.category === activeCategory.value)
  }

  // 按关键词搜索
  if (searchQuery.value.trim()) {
    const keyword = searchQuery.value.toLowerCase()
    skills = skills.filter(s =>
      s.title.toLowerCase().includes(keyword) ||
      s.description.toLowerCase().includes(keyword) ||
      s.content.toLowerCase().includes(keyword) ||
      s.tags?.some(tag => tag.toLowerCase().includes(keyword))
    )
  }

  return skills
})

// 总页数
const totalPages = computed(() => Math.ceil(filteredSkills.value.length / PAGE_SIZE))

// 当前页的技能
const paginatedSkills = computed(() => {
  const start = (currentPage.value - 1) * PAGE_SIZE
  const end = start + PAGE_SIZE
  return filteredSkills.value.slice(start, end)
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
  return allSkills.value.filter(s => s.category === categoryId).length
}

function handleCategoryChange(categoryId: string) {
  activeCategory.value = categoryId
}

function toggleExpand(id: string) {
  expandedId.value = expandedId.value === id ? null : id
}

function setActiveTab(id: string, tab: string) {
  activeTab.value = { ...activeTab.value, [id]: tab }
}
// Markdown 渲染器（使用 markdown-it）
const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  breaks: true
})

function renderMarkdown(text: string): string {
  if (!text) return ''
  return md.render(text)
}

async function copySkill(skill: SkillItem) {
  try {
    await navigator.clipboard.writeText(skill.content)
    copiedId.value = skill.id
    setTimeout(() => {
      if (copiedId.value === skill.id) {
        copiedId.value = null
      }
    }, 2000)
  } catch (err) {
    // 降级方案
    const textarea = document.createElement('textarea')
    textarea.value = skill.content
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
    copiedId.value = skill.id
    setTimeout(() => {
      if (copiedId.value === skill.id) {
        copiedId.value = null
      }
    }, 2000)
  }
}

// 键盘导航
function handleKeydown(event: KeyboardEvent) {
  // 只在分页存在时有焦点时响应
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
</script>

<style scoped>
/* ========================================
   技能库页面样式
   与 PromptLibrary 和 ToolLibrary 保持风格统一
   ======================================== */

.skill-library {
  max-width: 960px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* ---- 页面头部 Hero ---- */
.skill-hero {
  text-align: center;
  padding: 2.5rem 0 1.5rem;
}

.skill-hero-inner {
  max-width: 600px;
  margin: 0 auto;
}

.skill-hero-title {
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

.skill-hero-desc {
  font-size: 1rem;
  color: var(--vp-c-text-2);
  line-height: 1.6;
  margin: 0 0 1.5rem;
}

/* ---- 搜索框 ---- */
.skill-search-box {
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

.skill-search-input {
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

.skill-search-input::placeholder {
  color: var(--vp-c-text-3);
}

.skill-search-input:focus {
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
.skill-stats {
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
.skill-categories {
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

/* ---- 技能区块 ---- */
.skill-section {
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

/* ---- 技能网格 ---- */
.skill-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1rem;
}

/* ---- 技能卡片 ---- */
.skill-card {
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 1.125rem;
  border: 1.5px solid var(--vp-c-border);
  border-radius: 14px;
  background: var(--vp-c-bg);
  transition: all 0.3s ease;
  overflow: hidden;
}

.skill-card:hover {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 4px 16px rgba(37, 99, 235, 0.1);
}

.skill-card.expanded {
  grid-column: 1 / -1;
}

/* ---- 卡片头部 ---- */
.skill-card-header {
  display: flex;
  gap: 0.875rem;
  cursor: pointer;
}

.skill-card-info {
  flex: 1;
  min-width: 0;
}

.skill-card-title {
  margin: 0 0 0.375rem;
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  line-height: 1.4;
}

.skill-card-desc {
  margin: 0 0 0.5rem;
  font-size: 0.825rem;
  color: var(--vp-c-text-2);
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.skill-card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
}

.skill-tag {
  display: inline-block;
  padding: 0.1rem 0.45rem;
  font-size: 0.7rem;
  border-radius: 4px;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  font-weight: 500;
}

/* ---- 卡片操作按钮 ---- */
.skill-card-actions {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  flex-shrink: 0;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-btn:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
}

.action-btn.copy-btn:hover {
  background: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
  color: #fff;
}

.expand-btn.is-expanded {
  transform: rotate(180deg);
}

/* ---- 卡片展开内容 ---- */
.skill-card-body {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--vp-c-divider);
}

.skill-content-wrapper {
  background: var(--vp-c-bg-soft);
  border-radius: 10px;
  overflow: hidden;
}

/* ---- Tab 切换 ---- */
.skill-tabs {
  display: flex;
  border-bottom: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
}

.skill-tab {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.6rem 1rem;
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--vp-c-text-3);
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  transition: all 0.2s ease;
}

.skill-tab:hover {
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg-soft);
}

.skill-tab.active {
  color: var(--vp-c-brand-1);
  border-bottom-color: var(--vp-c-brand-1);
}

/* ---- 预览内容 ---- */
.skill-preview {
  padding: 1.25rem;
  max-height: 500px;
  overflow-y: auto;
}

.skill-preview-content {
  font-size: 0.85rem;
  line-height: 1.7;
  color: var(--vp-c-text-2);
}

.skill-preview-content :deep(h1) {
  font-size: 1.3rem;
  font-weight: 700;
  margin: 1.2rem 0 0.6rem;
  color: var(--vp-c-text-1);
  padding-bottom: 0.3rem;
  border-bottom: 1px solid var(--vp-c-divider);
}

.skill-preview-content :deep(h2) {
  font-size: 1.15rem;
  font-weight: 700;
  margin: 1rem 0 0.5rem;
  color: var(--vp-c-text-1);
  padding-bottom: 0.25rem;
  border-bottom: 1px solid var(--vp-c-divider);
}

.skill-preview-content :deep(h3) {
  font-size: 1rem;
  font-weight: 600;
  margin: 0.8rem 0 0.4rem;
  color: var(--vp-c-text-1);
}

.skill-preview-content :deep(h4) {
  font-size: 0.9rem;
  font-weight: 600;
  margin: 0.6rem 0 0.3rem;
  color: var(--vp-c-text-1);
}

.skill-preview-content :deep(p) {
  margin: 0.5rem 0;
  color: var(--vp-c-text-2);
}

.skill-preview-content :deep(ul),
.skill-preview-content :deep(ol) {
  margin: 0.5rem 0;
  padding-left: 1.5rem;
}

.skill-preview-content :deep(ul) {
  list-style: disc;
}

.skill-preview-content :deep(ol) {
  list-style: decimal;
}

.skill-preview-content :deep(li) {
  margin: 0.25rem 0;
  color: var(--vp-c-text-2);
  line-height: 1.6;
}

.skill-preview-content :deep(code) {
  font-family: var(--vp-font-family-mono);
  font-size: 0.82rem;
  padding: 0.15rem 0.4rem;
  border-radius: 4px;
  background: var(--vp-c-default-soft);
  color: var(--vp-c-text-1);
}

.skill-preview-content :deep(pre) {
  margin: 0.6rem 0;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  overflow-x: auto;
}

.skill-preview-content :deep(pre code) {
  padding: 0;
  background: transparent;
  font-size: 0.8rem;
  line-height: 1.5;
}

.skill-preview-content :deep(blockquote) {
  margin: 0.5rem 0;
  padding: 0.5rem 1rem;
  border-left: 4px solid var(--vp-c-brand-1);
  background: var(--vp-c-bg-soft);
  border-radius: 0 6px 6px 0;
}

.skill-preview-content :deep(blockquote p) {
  margin: 0.2rem 0;
}

.skill-preview-content :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 0.6rem 0;
  font-size: 0.8rem;
}

.skill-preview-content :deep(th) {
  background: var(--vp-c-bg-soft);
  font-weight: 600;
  text-align: left;
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--vp-c-divider);
}

.skill-preview-content :deep(td) {
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--vp-c-divider);
}

.skill-preview-content :deep(hr) {
  border: none;
  border-top: 1px solid var(--vp-c-divider);
  margin: 1rem 0;
}

.skill-preview-content :deep(strong) {
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.skill-preview-content :deep(em) {
  font-style: italic;
}

.skill-preview-content :deep(a) {
  color: var(--vp-c-brand-1);
  text-decoration: none;
}

.skill-preview-content :deep(a:hover) {
  text-decoration: underline;
}

/* ---- 源码内容 ---- */
.skill-source-code {
  max-height: 400px;
  overflow-y: auto;
}

.skill-content {
  margin: 0;
  padding: 1rem;
  font-size: 0.825rem;
  line-height: 1.6;
  color: var(--vp-c-text-1);
  background: transparent;
  overflow-x: auto;
  white-space: pre-wrap;
  word-break: break-word;
}

.skill-content code {
  font-family: var(--vp-font-family-mono);
  font-size: 0.85rem;
  color: var(--vp-c-text-1);
  background: transparent;
  padding: 0;
}

/* ---- 底部操作栏 ---- */
.skill-card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  background: var(--vp-c-bg);
  border-top: 1px solid var(--vp-c-divider);
}

.footer-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 0.9rem;
  border: 1.5px solid var(--vp-c-brand-1);
  border-radius: 8px;
  background: var(--vp-c-brand-1);
  color: #fff;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.footer-btn:hover {
  background: var(--vp-c-brand-2);
  border-color: var(--vp-c-brand-2);
}

.skill-source {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  color: var(--vp-c-text-2);
  font-size: 0.8rem;
  text-decoration: none;
  transition: color 0.2s ease;
}

.skill-source:hover {
  color: var(--vp-c-brand-1);
}

/* ---- 空状态 ---- */
.skill-empty {
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
.skill-footer-hint {
  padding: 1.5rem 0;
  border-top: 1px solid var(--vp-c-divider);
  margin-top: 1rem;
}

.skill-footer-hint p {
  font-size: 0.85rem;
  color: var(--vp-c-text-3);
  margin: 0 0 0.5rem;
  line-height: 1.6;
}

.skill-footer-hint p:last-child {
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

/* ---- 展开过渡动画 ---- */
.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  max-height: 0;
  padding-top: 0;
  margin-top: 0;
}

.expand-enter-to,
.expand-leave-from {
  opacity: 1;
  max-height: 1000px;
}

/* ---- 过渡动画 ---- */
.skill-fade-enter-active {
  transition: all 0.3s ease;
}

.skill-fade-leave-active {
  transition: all 0.2s ease;
}

.skill-fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.skill-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* ---- 响应式适配 ---- */
@media (max-width: 640px) {
  .skill-hero-title {
    font-size: 1.5rem;
  }

  .skill-stats {
    gap: 1.25rem;
  }

  .stat-number {
    font-size: 1.25rem;
  }

  .skill-grid {
    grid-template-columns: 1fr;
  }

  .skill-card.expanded {
    grid-column: 1;
  }

  .skill-categories {
    justify-content: flex-start;
    overflow-x: auto;
    flex-wrap: nowrap;
    padding-bottom: 0.75rem;
    -webkit-overflow-scrolling: touch;
  }

  .category-tag {
    flex-shrink: 0;
  }

  .pagination {
    flex-wrap: wrap;
    gap: 0.75rem;
  }

  .page-numbers {
    order: -1;
    width: 100%;
    justify-content: center;
  }
}
</style>
