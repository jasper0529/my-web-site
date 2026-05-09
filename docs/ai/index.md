---
title: AI 专题导航
description: 覆盖大模型、RAG、Agent、AIGC、工程化与评测的专题导航，便于后续扩展与收录内容。
---

# 🤖 AI 专题导航

> 涵盖大模型基础、智能体编排、AIGC 生成、工程化部署与评测优化的全景式导航。每个模块将持续更新文章与案例。

<div class="ai-topic-grid">

<a href="/ai/vibe-coding/" class="ai-topic-card card-blue">
  <div class="ai-topic-icon">🎨</div>
  <h3>Vibe Coding 系列</h3>
  <p>从氛围编程入门到大模型原理，再到 Prompt 工程进化的完整学习路径。</p>
  <ul class="ai-topic-items">
    <li>Vibe Coding 简介</li>
    <li>大模型基础原理</li>
    <li>Prompt 工程演进</li>
  </ul>
  <span class="ai-topic-link">开始学习 →</span>
</a>

<div class="ai-topic-card card-green">
  <div class="ai-topic-icon">🧠</div>
  <h3>大模型基础</h3>
  <p>Prompt、RAG、向量检索与知识库构建的入门与最佳实践。</p>
  <ul class="ai-topic-items">
    <li>Prompt 工程</li>
    <li>RAG 管线</li>
    <li>向量数据库</li>
  </ul>
  <span class="ai-topic-badge">📝 整理中</span>
</div>

<div class="ai-topic-card card-purple">
  <div class="ai-topic-icon">🧭</div>
  <h3>智能体与编排</h3>
  <p>Agent 框架、工作流编排与复杂任务拆解案例。</p>
  <ul class="ai-topic-items">
    <li>Agent 设计</li>
    <li>函数调用</li>
    <li>多步工作流</li>
  </ul>
  <span class="ai-topic-badge">📝 整理中</span>
</div>

<div class="ai-topic-card card-orange">
  <div class="ai-topic-icon">🖼️</div>
  <h3>AIGC 生成</h3>
  <p>文本、图片、音频的生成式应用与提示模板策略。</p>
  <ul class="ai-topic-items">
    <li>文生图</li>
    <li>多模态</li>
    <li>提示模板</li>
  </ul>
  <span class="ai-topic-badge">📝 整理中</span>
</div>

<div class="ai-topic-card card-teal">
  <div class="ai-topic-icon">🛠️</div>
  <h3>工程化与部署</h3>
  <p>服务化部署、缓存加速、观测与安全防护全链路。</p>
  <ul class="ai-topic-items">
    <li>API 网关</li>
    <li>缓存与检索</li>
    <li>安全防护</li>
  </ul>
  <span class="ai-topic-badge">📝 整理中</span>
</div>

<div class="ai-topic-card card-red">
  <div class="ai-topic-icon">📊</div>
  <h3>评测与优化</h3>
  <p>质量评测、对齐调优与数据迭代的方法论。</p>
  <ul class="ai-topic-items">
    <li>自动化评测</li>
    <li>对齐与偏见</li>
    <li>数据迭代</li>
  </ul>
  <span class="ai-topic-badge">📝 整理中</span>
</div>

</div>

<style>
.ai-topic-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.25rem;
  margin: 2rem 0;
}

.ai-topic-card {
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  border-radius: 16px;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-border);
  transition: all 0.3s ease;
  text-decoration: none;
  color: inherit;
}

.ai-topic-card:hover {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 12px 32px rgba(37, 99, 235, 0.12);
  transform: translateY(-4px);
}

.ai-topic-icon {
  font-size: 2rem;
  margin-bottom: 0.75rem;
}

.ai-topic-card h3 {
  margin: 0 0 0.5rem;
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
}

.ai-topic-card p {
  margin: 0 0 0.75rem;
  color: var(--vp-c-text-2);
  font-size: 0.875rem;
  line-height: 1.6;
}

.ai-topic-items {
  margin: 0 0 1rem;
  padding-left: 1.25rem;
  color: var(--vp-c-text-2);
  font-size: 0.8125rem;
  line-height: 1.7;
}

.ai-topic-items li {
  list-style: disc;
}

.ai-topic-link {
  display: inline-block;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--vp-c-brand-1);
  margin-top: auto;
}

.ai-topic-card:hover .ai-topic-link {
  text-decoration: underline;
}

.ai-topic-badge {
  display: inline-block;
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--vp-c-text-3);
  background: var(--vp-c-bg-soft);
  padding: 0.2rem 0.75rem;
  border-radius: 999px;
  border: 1px dashed var(--vp-c-border);
  margin-top: auto;
  align-self: flex-start;
}

/* 差异化配色 */
.ai-topic-card.card-blue { border-left: 4px solid #2563EB; }
.ai-topic-card.card-green { border-left: 4px solid #10B981; }
.ai-topic-card.card-purple { border-left: 4px solid #8B5CF6; }
.ai-topic-card.card-orange { border-left: 4px solid #F97316; }
.ai-topic-card.card-teal { border-left: 4px solid #14B8A6; }
.ai-topic-card.card-red { border-left: 4px solid #EF4444; }

.dark .ai-topic-card:hover {
  box-shadow: 0 12px 32px rgba(59, 130, 246, 0.15);
}

.dark .ai-topic-card.card-blue { border-left-color: #3B82F6; }
.dark .ai-topic-card.card-green { border-left-color: #34D399; }
.dark .ai-topic-card.card-purple { border-left-color: #A78BFA; }
.dark .ai-topic-card.card-orange { border-left-color: #FB923C; }
.dark .ai-topic-card.card-teal { border-left-color: #2DD4BF; }
.dark .ai-topic-card.card-red { border-left-color: #F87171; }
</style>
