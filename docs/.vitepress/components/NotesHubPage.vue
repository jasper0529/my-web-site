<script setup lang="ts">
import { data } from '../posts.data'

const notesPosts = data.posts
  .filter(post => post.link.startsWith('/notes/'))
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

const linuxPosts = notesPosts.filter(post => post.link.startsWith('/notes/linux/'))
const notesTags = Array.from(new Set(notesPosts.flatMap(post => post.tags || []))).slice(0, 10)
</script>

<template>
  <div class="hub-page">
    <section class="hub-hero">
      <div class="hub-eyebrow">
        <span class="hub-code">OPS</span>
        <span class="hub-card-label">排障与运维</span>
      </div>
      <h1 class="hub-title">把真实环境里踩过的坑，整理成可复用笔记</h1>
      <p class="hub-desc">
        这个模块主要沉淀 Linux 运维、编译安装、命令速查、磁盘与资源管理等内容。
        重点不是“知识点覆盖面”，而是把问题背景、操作过程和验证方式写清楚，便于之后真正拿来排障。
      </p>
      <div class="hub-stats">
        <article class="hub-stat">
          <span class="hub-stat-value">{{ notesPosts.length }}</span>
          <span class="hub-stat-label">已收录笔记</span>
        </article>
        <article class="hub-stat">
          <span class="hub-stat-value">{{ linuxPosts.length }}</span>
          <span class="hub-stat-label">Linux 相关内容</span>
        </article>
        <article class="hub-stat">
          <span class="hub-stat-value">{{ notesTags.length }}</span>
          <span class="hub-stat-label">常见问题标签</span>
        </article>
      </div>
    </section>

    <section class="hub-section">
      <h2 class="hub-section-title">最近更新</h2>
      <p class="hub-section-desc">优先展示近期整理的笔记，方便快速进入当前有维护的内容。</p>
      <div class="hub-grid">
        <a v-for="post in notesPosts.slice(0, 6)" :key="post.link" :href="post.link" class="hub-card">
          <div class="hub-card-top">
            <span class="hub-card-label">{{ post.category || 'Notes' }}</span>
            <span class="hub-card-status">{{ post.date }}</span>
          </div>
          <h3>{{ post.title }}</h3>
          <p>{{ post.description || '查看这篇笔记中的命令、排障步骤与验证方法。' }}</p>
          <ul v-if="post.tags && post.tags.length" class="hub-list">
            <li v-for="tag in post.tags.slice(0, 3)" :key="tag">{{ tag }}</li>
          </ul>
          <span class="hub-link">进入笔记</span>
        </a>
      </div>
    </section>

    <section class="hub-section">
      <h2 class="hub-section-title">内容主线</h2>
      <p class="hub-section-desc">大部分内容围绕排障、部署和日常运维高频任务展开。</p>
      <div class="hub-grid">
        <a href="/notes/linux/linux-commands/" class="hub-card">
          <div class="hub-card-top">
            <span class="hub-card-label">高频操作</span>
            <span class="hub-card-status">速查可用</span>
          </div>
          <h3>命令与日常排障</h3>
          <p>适合需要快速处理线上和日常环境问题时查阅，强调命令组合、参数和典型场景。</p>
          <ul class="hub-list">
            <li>进程、磁盘、文件搜索</li>
            <li>日志与资源定位</li>
            <li>常见运维命令速查</li>
          </ul>
          <span class="hub-link">进入命令手册</span>
        </a>

        <a href="/notes/linux/centos7-compile-python312/" class="hub-card">
          <div class="hub-card-top">
            <span class="hub-card-label">部署构建</span>
            <span class="hub-card-status">已更新</span>
          </div>
          <h3>编译安装与依赖处理</h3>
          <p>很多环境问题并不是“命令不会”，而是依赖关系复杂、系统条件老旧，所以更需要过程型记录。</p>
          <ul class="hub-list">
            <li>源码编译与版本升级</li>
            <li>依赖包与镜像源处理</li>
            <li>安装后验证与风险规避</li>
          </ul>
          <span class="hub-link">查看编译实践</span>
        </a>

        <a href="/notes/linux/linux-lvm-auto-extend/" class="hub-card">
          <div class="hub-card-top">
            <span class="hub-card-label">资源管理</span>
            <span class="hub-card-status">已更新</span>
          </div>
          <h3>磁盘、扩容与系统资源</h3>
          <p>资源增长往往发生在线上压力最大的时候，因此相关内容更强调可回滚、可验证和自动化处理。</p>
          <ul class="hub-list">
            <li>LVM 与磁盘扩容</li>
            <li>脚本化处理与安全边界</li>
            <li>容量预警与后续观察</li>
          </ul>
          <span class="hub-link">查看资源管理实践</span>
        </a>
      </div>
    </section>

    <section class="hub-section">
      <h2 class="hub-section-title">模块说明</h2>
      <p class="hub-section-desc">这是一个偏“工作笔记 + 复盘整理”的模块，适合在遇到同类问题时快速检索和复用。</p>
      <div class="hub-subgrid">
        <article class="hub-note">
          <h3>适合记录什么</h3>
          <ul class="hub-note-list">
            <li>编译安装与环境兼容问题</li>
            <li>Linux 命令、排障和系统资源处理</li>
            <li>实际踩坑后的解决步骤与复盘</li>
          </ul>
        </article>
        <article class="hub-note">
          <h3>阅读建议</h3>
          <p>如果你是为了快速解决问题，建议先从最近更新和命令速查进入；如果是系统学习，再按具体专题延伸。</p>
        </article>
      </div>
    </section>
  </div>
</template>
