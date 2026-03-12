---
title: Python 学习
titleTemplate: Python 教程与笔记
description: 系统学习 Python 编程，从基础语法到高级特性，包含常用库的使用教程和最佳实践。
---

# 🐍 Python 学习

欢迎来到 Python 学习模块！这里汇集了从入门到进阶的 Python 知识体系。

## 📚 学习路径

<div class="card-grid">

<div class="feature-card">
  <div class="feature-icon">🚀</div>
  <h3>基础语法</h3>
  <p>环境搭建、数据类型、控制流、函数等基础知识，适合 Python 初学者入门。</p>
  <a href="/python/basics/setup">开始学习 →</a>
</div>

<div class="feature-card">
  <div class="feature-icon">⚡</div>
  <h3>进阶特性</h3>
  <p>装饰器、生成器、面向对象、异步编程等高级特性，提升代码质量和开发效率。</p>
  <a href="/python/advanced/decorators">深入学习 →</a>
</div>

<div class="feature-card">
  <div class="feature-icon">📦</div>
  <h3>常用库</h3>
  <p>NumPy、Pandas、Requests 等热门第三方库的使用教程和实战案例。</p>
  <a href="/python/libraries/numpy">探索库 →</a>
</div>

</div>

## 🎯 学习建议

::: tip 循序渐进
建议按照"基础语法 → 进阶特性 → 常用库"的顺序学习，每个阶段都要结合实践项目巩固知识。
:::

::: info 多写代码
Python 是一门实践性很强的语言，多写代码、多调试是掌握它的最佳方式。
:::

## 📖 章节概览

| 章节 | 内容 | 难度 |
|------|------|------|
| 环境搭建 | Python 安装、虚拟环境配置 | ⭐ |
| 数据类型 | 数字、字符串、列表、字典等 | ⭐ |
| 控制流 | 条件判断、循环语句 | ⭐ |
| 函数 | 函数定义、参数、返回值 | ⭐⭐ |
| 装饰器 | 函数装饰器、类装饰器 | ⭐⭐⭐ |
| 生成器 | yield、生成器表达式 | ⭐⭐⭐ |
| 异步编程 | async/await、协程 | ⭐⭐⭐⭐ |

<style>
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  margin: 2rem 0;
}

.feature-card {
  padding: 1.5rem;
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  transition: all 0.3s ease;
}

.feature-card:hover {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.feature-icon {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.feature-card h3 {
  margin: 0 0 0.75rem;
  font-size: 1.125rem;
  font-weight: 600;
}

.feature-card p {
  margin: 0 0 1rem;
  color: var(--vp-c-text-2);
  line-height: 1.6;
}

.feature-card a {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--vp-c-brand-1);
  text-decoration: none;
}

.feature-card a:hover {
  text-decoration: underline;
}
</style>
