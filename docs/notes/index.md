---
title: 技术笔记
description: 开发过程中遇到的问题与解决方案，技术探索与心得体会。
---

<script setup lang="ts">
import { data } from '../.vitepress/posts.data'

// 过滤出 notes 目录下的文章
const notesPosts = data.posts
  .filter(post => post.link.startsWith('/notes/'))
  .sort((a, b) => new Date(b.date) - new Date(a.date))
  .slice(0, 10)

// 提取 notes 相关标签
const tagSet = new Set<string>()
notesPosts.forEach(post => {
  post.tags.forEach(tag => tagSet.add(tag))
})
const notesTags = Array.from(tagSet)
</script>

# 📝 技术笔记

这里记录了我在日常开发中积累的技术笔记、问题解决方案和学习心得。

## 最新文章

<PostList :data="notesPosts" />

## 分类

<TagList :tags="notesTags" />

## 关于本模块

::: info 说明
本模块主要记录：
- 开发过程中遇到的问题及解决方案
- 新技术的学习笔记和实践心得
- 常用工具和技巧的整理
- 技术书籍的阅读笔记
:::
