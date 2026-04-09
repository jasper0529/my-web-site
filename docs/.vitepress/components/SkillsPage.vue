<template>
  <div class="skills-page">
    <!-- Hero 区域 -->
    <div class="skills-hero">
      <div class="skills-hero-inner">
        <div class="hero-badge">
          <span class="badge-icon">⚡</span>
          <span>AI 编程增强</span>
        </div>
        <h1 class="skills-hero-title">
          <span class="title-icon">🎯</span>
          Agent Skills 技能库
        </h1>
        <p class="skills-hero-desc">
          扩展 AI 编程助手能力的标准化功能模块，通过 SKILL.md 文件定义使用规则和执行步骤。
          支持 Claude Code、OpenAI Codex CLI 等主流 AI 编程工具。
        </p>
        
        <!-- 快速统计 -->
        <div class="hero-stats">
          <div class="hero-stat">
            <span class="stat-value">{{ totalCount }}</span>
            <span class="stat-label">Skills 总数</span>
          </div>
          <div class="hero-stat">
            <span class="stat-value">{{ skillCategories.length }}</span>
            <span class="stat-label">分类数</span>
          </div>
          <div class="hero-stat">
            <span class="stat-value">2</span>
            <span class="stat-label">支持平台</span>
          </div>
        </div>

        <!-- 安装说明 -->
        <div class="install-guide">
          <div class="guide-title">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
            快速安装
          </div>
          <div class="guide-content">
            <div class="guide-item">
              <span class="guide-label">Claude Code:</span>
              <code>~/.claude/skills/</code>
            </div>
            <div class="guide-item">
              <span class="guide-label">OpenAI Codex:</span>
              <code>~/.codex/skills/</code>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 搜索和分类 -->
    <div class="skills-filter">
      <div class="search-box">
        <svg class="search-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="搜索 Skills 名称、描述..."
          class="search-input"
        />
        <button v-if="searchQuery" class="search-clear" @click="searchQuery = ''">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      <!-- 分类标签 -->
      <div class="category-tags">
        <button
          class="category-tag"
          :class="{ active: activeCategory === 'all' }"
          @click="handleCategoryChange('all')"
        >
          <span class="tag-icon">🏷️</span>
          全部
          <span class="tag-count">{{ totalCount }}</span>
        </button>
        <button
          v-for="cat in skillCategories"
          :key="cat.id"
          class="category-tag"
          :class="{ active: activeCategory === cat.id }"
          @click="handleCategoryChange(cat.id)"
          :title="cat.description"
        >
          <span class="tag-icon">{{ cat.icon }}</span>
          {{ cat.name }}
          <span class="tag-count">{{ getCategoryCount(cat.id) }}</span>
        </button>
      </div>
    </div>

    <!-- Skills 列表 -->
    <div class="skills-grid">
      <TransitionGroup name="skill-fade">
        <div
          v-for="skill in paginatedSkills"
          :key="skill.id"
          class="skill-card"
          :class="{ expanded: expandedId === skill.id }"
        >
          <!-- 卡片头部 -->
          <div class="skill-card-header" @click="toggleExpand(skill.id)">
            <div class="skill-card-icon">
              {{ getCategoryIcon(skill.category) }}
            </div>
            <div class="skill-card-info">
              <h3 class="skill-card-title">{{ skill.title }}</h3>
              <p class="skill-card-desc">{{ skill.description }}</p>
              <div class="skill-card-tags">
                <span v-for="tag in skill.tags" :key="tag" class="skill-tag">{{ tag }}</span>
              </div>
            </div>
            <div class="expand-icon" :class="{ rotated: expandedId === skill.id }">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>
          </div>

          <!-- 卡片展开内容 -->
          <Transition name="slide">
            <div v-if="expandedId === skill.id" class="skill-card-body">
              <div class="skill-content">
                <pre class="skill-content-text">{{ skill.content }}</pre>
              </div>
              <div class="skill-card-footer">
                <a
                  v-if="skill.source"
                  :href="skill.source"
                  target="_blank"
                  class="source-link"
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <line x1="10" y1="14" x2="21" y2="3"></line>
                  </svg>
                  查看来源
                </a>
                <button class="copy-btn" @click.stop="copySkill(skill)">
                  <svg v-if="copiedId !== skill.id" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                  <svg v-else viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  {{ copiedId === skill.id ? '已复制' : '复制内容' }}
                </button>
              </div>
            </div>
          </Transition>
        </div>
      </TransitionGroup>

      <!-- 空状态 -->
      <div v-if="filteredSkills.length === 0" class="empty-state">
        <div class="empty-icon">🔍</div>
        <div class="empty-text">未找到匹配的 Skills</div>
        <div class="empty-hint">试试调整搜索条件或选择其他分类</div>
      </div>
    </div>

    <!-- 分页 -->
    <div v-if="totalPages > 1" class="pagination">
      <button
        class="page-btn"
        :disabled="currentPage === 1"
        @click="currentPage--"
      >
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
        上一页
      </button>

      <div class="page-numbers">
        <button
          v-for="page in visiblePages"
          :key="page"
          class="page-num"
          :class="{ active: currentPage === page }"
          @click="currentPage = page"
        >
          {{ page }}
        </button>
      </div>

      <button
        class="page-btn"
        :disabled="currentPage === totalPages"
        @click="currentPage++"
      >
        下一页
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </button>
    </div>

    <!-- FAQ 区域 -->
    <div class="faq-section">
      <h2 class="faq-title">
        <span class="title-icon">❓</span>
        常见问题
      </h2>
      <div class="faq-grid">
        <div class="faq-item">
          <h3 class="faq-question">1. 什么是 Agent Skills？</h3>
          <p class="faq-answer">
            Agent Skills 是用来扩展 AI 编程助手能力的一种标准化功能模块，通常通过一个 SKILL.md 文件来说明使用规则和执行步骤，也可以附带脚本或模板作为辅助。2025 年 12 月，Anthropic 将 Agent Skills 的规范以开放标准的形式发布，随后 OpenAI 在 Codex CLI 和 ChatGPT 中采用了相同的格式。
          </p>
        </div>
        <div class="faq-item">
          <h3 class="faq-question">2. 如何安装 Skills？</h3>
          <p class="faq-answer">
            Claude Code：添加到 ~/.claude/skills/（个人）或 .claude/skills/（项目）。OpenAI Codex CLI：添加到 ~/.codex/skills/。两者使用相同的 SKILL.md 格式。克隆 GitHub 仓库并将 skill 文件夹复制到对应目录，AI 会自动发现并加载。
          </p>
        </div>
        <div class="faq-item">
          <h3 class="faq-question">3. Claude Skills 如何工作？</h3>
          <p class="faq-answer">
            通过统一的集成机制生效。安装后，这些技能会在对话过程中直接对 Claude 可用，Claude 在执行特定任务时按需读取和使用这些内容。整个运行过程由系统统一管理，在提升任务完成能力的同时，确保调用范围和行为符合既定的安全限制。
          </p>
        </div>
        <div class="faq-item">
          <h3 class="faq-question">4. 我可以同时使用多个 Skills 吗？</h3>
          <p class="faq-answer">
            可以。Claude Code 支持同时使用多个技能。技能是模块化的，设计为可以协同工作。例如，你可以将文档处理类的技能与开发工具类的技能结合使用。Claude 会根据你的请求上下文智能选择合适的技能。
          </p>
        </div>
        <div class="faq-item">
          <h3 class="faq-question">5. 如何获取最新的 Skills？</h3>
          <p class="faq-answer">
            我们会定期更新 Skills 库，您可以收藏本站，或关注公众号，确保您能及时获得最新的 Claude AI 工作流和编程技能分享。
          </p>
        </div>
        <div class="faq-item">
          <h3 class="faq-question">6. 我可以创建自己的 Skills 吗？</h3>
          <p class="faq-answer">
            你可以使用官方存储库中的技能创建者指南，创建自定义 Agent Skill 并在 GitHub 上分享。许多开发者都会贡献他们的创作来帮助他人解决类似问题。
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

// 使用 Vite 的 glob 功能动态加载所有 JSON 文件
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

// 每页显示数量
const PAGE_SIZE = 9

// 从 glob 加载的结果中提取数据
const skillCategories = ref<SkillCategory[]>([])
const allSkills = ref<SkillItem[]>([])

// 加载分类
import categoriesData from '../data/skills/categories.json'
skillCategories.value = categoriesData as SkillCategory[]

// 加载 Skills
if (skillModules && Object.keys(skillModules).length > 0) {
  const skillsData: SkillItem[] = Object.values(skillModules)
    .map((mod: any) => mod.default)
    .filter(Boolean)
  
  allSkills.value = skillsData
}

// 状态
const searchQuery = ref('')
const activeCategory = ref('all')
const expandedId = ref<string | null>(null)
const copiedId = ref<string | null>(null)
const currentPage = ref(1)

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

const totalPages = computed(() => Math.ceil(filteredSkills.value.length / PAGE_SIZE))

const paginatedSkills = computed(() => {
  const start = (currentPage.value - 1) * PAGE_SIZE
  const end = start + PAGE_SIZE
  return filteredSkills.value.slice(start, end)
})

const visiblePages = computed(() => {
  const pages: number[] = []
  const total = totalPages.value
  const current = currentPage.value
  
  let start = Math.max(1, current - 2)
  let end = Math.min(total, current + 2)
  
  if (end - start < 4) {
    if (start === 1) {
      end = Math.min(total, start + 4)
    } else {
      start = Math.max(1, end - 4)
    }
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})

// 方法
const getCategoryCount = (categoryId: string) => {
  return allSkills.value.filter(s => s.category === categoryId).length
}

const getCategoryIcon = (categoryId: string) => {
  const category = skillCategories.value.find(c => c.id === categoryId)
  return category?.icon || '📦'
}

const handleCategoryChange = (category: string) => {
  activeCategory.value = category
  currentPage.value = 1
}

const toggleExpand = (id: string) => {
  expandedId.value = expandedId.value === id ? null : id
}

const copySkill = async (skill: SkillItem) => {
  try {
    await navigator.clipboard.writeText(skill.content)
    copiedId.value = skill.id
    setTimeout(() => {
      copiedId.value = null
    }, 2000)
  } catch (err) {
    console.error('复制失败:', err)
  }
}

// 监听搜索和分类变化，重置分页
watch([searchQuery, activeCategory], () => {
  currentPage.value = 1
})
</script>

<style scoped>
/* ---- Hero 区域 ---- */
.skills-hero {
  background: linear-gradient(135deg, var(--vp-c-bg) 0%, var(--vp-c-bg-soft) 100%);
  border-radius: 20px;
  padding: 3rem 2rem;
  margin-bottom: 2rem;
  border: 1px solid var(--vp-c-divider);
  position: relative;
  overflow: hidden;
}

.skills-hero::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -20%;
  width: 60%;
  height: 200%;
  background: radial-gradient(ellipse, rgba(37, 99, 235, 0.08) 0%, transparent 70%);
  pointer-events: none;
}

.skills-hero-inner {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
  position: relative;
  z-index: 1;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 1rem;
  background: rgba(37, 99, 235, 0.1);
  border: 1px solid rgba(37, 99, 235, 0.2);
  border-radius: 20px;
  font-size: 0.85rem;
  color: var(--vp-c-brand-1);
  margin-bottom: 1.25rem;
}

.badge-icon {
  font-size: 1rem;
}

.skills-hero-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
  margin: 0 0 1rem;
  line-height: 1.2;
}

.title-icon {
  margin-right: 0.5rem;
}

.skills-hero-desc {
  font-size: 1.1rem;
  color: var(--vp-c-text-2);
  line-height: 1.7;
  margin: 0 0 2rem;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
}

.hero-stats {
  display: flex;
  justify-content: center;
  gap: 3rem;
  margin-bottom: 2rem;
}

.hero-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: var(--vp-c-brand-1);
}

.stat-label {
  font-size: 0.85rem;
  color: var(--vp-c-text-3);
}

.install-guide {
  display: inline-block;
  text-align: left;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 1rem 1.5rem;
}

.guide-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin-bottom: 0.75rem;
}

.guide-content {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.guide-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.85rem;
}

.guide-label {
  color: var(--vp-c-text-2);
  min-width: 100px;
}

.install-guide code {
  background: var(--vp-c-bg);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  color: var(--vp-c-brand-1);
}

/* ---- 搜索和分类 ---- */
.skills-filter {
  margin-bottom: 2rem;
}

.search-box {
  position: relative;
  max-width: 500px;
  margin: 0 auto 1.5rem;
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--vp-c-text-3);
}

.search-input {
  width: 100%;
  padding: 0.875rem 2.75rem;
  border: 2px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 1rem;
  transition: all 0.25s ease;
}

.search-input:focus {
  outline: none;
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.search-input::placeholder {
  color: var(--vp-c-text-3);
}

.search-clear {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  padding: 0.25rem;
  cursor: pointer;
  color: var(--vp-c-text-3);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
}

.search-clear:hover {
  color: var(--vp-c-text-2);
  background: var(--vp-c-bg-soft);
}

.category-tags {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.75rem;
}

.category-tag {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 1rem;
  border: 1.5px solid var(--vp-c-divider);
  border-radius: 20px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.25s ease;
}

.category-tag:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.category-tag.active {
  background: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
  color: #fff;
}

.tag-icon {
  font-size: 1rem;
}

.tag-count {
  font-size: 0.75rem;
  padding: 0.125rem 0.375rem;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 10px;
}

.category-tag.active .tag-count {
  background: rgba(255, 255, 255, 0.2);
}

/* ---- Skills 列表 ---- */
.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.skill-card {
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.skill-card:hover {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.skill-card.expanded {
  border-color: var(--vp-c-brand-1);
}

.skill-card-header {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.25rem;
  cursor: pointer;
}

.skill-card-icon {
  font-size: 2rem;
  flex-shrink: 0;
}

.skill-card-info {
  flex: 1;
  min-width: 0;
}

.skill-card-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin: 0 0 0.5rem;
}

.skill-card-desc {
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
  margin: 0 0 0.75rem;
  line-height: 1.5;
}

.skill-card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
}

.skill-tag {
  font-size: 0.75rem;
  padding: 0.125rem 0.5rem;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  border-radius: 4px;
}

.expand-icon {
  color: var(--vp-c-text-3);
  transition: transform 0.3s ease;
  flex-shrink: 0;
}

.expand-icon.rotated {
  transform: rotate(180deg);
}

/* ---- 卡片展开内容 ---- */
.skill-card-body {
  border-top: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
}

.skill-content {
  padding: 1.25rem;
}

.skill-content-text {
  margin: 0;
  padding: 1rem;
  background: var(--vp-c-bg);
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
  font-size: 0.85rem;
  line-height: 1.6;
  color: var(--vp-c-text-2);
  white-space: pre-wrap;
  word-wrap: break-word;
  font-family: var(--vp-font-family-mono);
  max-height: 300px;
  overflow-y: auto;
}

.skill-card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem;
  border-top: 1px solid var(--vp-c-divider);
}

.source-link {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  color: var(--vp-c-brand-1);
  text-decoration: none;
  font-size: 0.85rem;
}

.source-link:hover {
  text-decoration: underline;
}

.copy-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 1rem;
  border: 1.5px solid var(--vp-c-brand-1);
  border-radius: 8px;
  background: var(--vp-c-brand-1);
  color: #fff;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.25s ease;
}

.copy-btn:hover {
  background: var(--vp-c-brand-2);
  border-color: var(--vp-c-brand-2);
}

/* ---- 空状态 ---- */
.empty-state {
  grid-column: 1 / -1;
  text-align: center;
  padding: 4rem 2rem;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.empty-text {
  font-size: 1.2rem;
  font-weight: 500;
  color: var(--vp-c-text-1);
  margin: 0 0 0.5rem;
}

.empty-hint {
  font-size: 0.9rem;
  color: var(--vp-c-text-3);
}

/* ---- 分页 ---- */
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 2rem 0;
}

.page-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 1rem;
  border: 1.5px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.25s ease;
}

.page-btn:hover:not(:disabled) {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-numbers {
  display: flex;
  gap: 0.375rem;
}

.page-num {
  width: 2.25rem;
  height: 2.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1.5px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.25s ease;
}

.page-num:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.page-num.active {
  background: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
  color: #fff;
}

/* ---- FAQ 区域 ---- */
.faq-section {
  margin-top: 4rem;
  padding-top: 3rem;
  border-top: 1px solid var(--vp-c-divider);
}

.faq-title {
  text-align: center;
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
  margin: 0 0 2.5rem;
}

.faq-title .title-icon {
  margin-right: 0.5rem;
}

.faq-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
}

.faq-item {
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 1.5rem;
}

.faq-question {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin: 0 0 0.75rem;
}

.faq-answer {
  font-size: 0.9rem;
  line-height: 1.7;
  color: var(--vp-c-text-2);
  margin: 0;
}

/* ---- 动画 ---- */
.skill-fade-enter-active,
.skill-fade-leave-active {
  transition: all 0.3s ease;
}

.skill-fade-enter-from,
.skill-fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  max-height: 0;
}

.slide-enter-to,
.slide-leave-from {
  max-height: 500px;
}

/* ---- 响应式 ---- */
@media (max-width: 768px) {
  .skills-hero {
    padding: 2rem 1rem;
  }

  .skills-hero-title {
    font-size: 1.75rem;
  }

  .hero-stats {
    gap: 1.5rem;
  }

  .stat-value {
    font-size: 1.5rem;
  }

  .skills-grid {
    grid-template-columns: 1fr;
  }

  .faq-grid {
    grid-template-columns: 1fr;
  }
}
</style>