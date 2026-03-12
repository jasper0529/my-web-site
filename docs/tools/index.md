---
title: 常用工具
description: 精选开发工具推荐，提升效率的软件和在线服务。
---

# 🛠️ 常用工具

这里收集了我在日常开发中使用的优质工具和服务，希望对你有所帮助。

## 开发工具

<div class="tool-grid">

<ToolCard 
  name="VS Code"
  description="轻量级但功能强大的代码编辑器，拥有丰富的插件生态系统。"
  url="https://code.visualstudio.com/"
  :tags="['编辑器', '免费']"
  :external="true"
/>

<ToolCard 
  name="PyCharm"
  description="专业的 Python IDE，提供智能代码补全、调试和测试功能。"
  url="https://www.jetbrains.com/pycharm/"
  :tags="['IDE', 'Python']"
  :external="true"
/>

<ToolCard 
  name="Git"
  description="分布式版本控制系统，团队协作必备工具。"
  url="https://git-scm.com/"
  :tags="['版本控制', '免费']"
  :external="true"
/>

<ToolCard 
  name="Docker"
  description="容器化平台，简化应用部署和环境管理。"
  url="https://www.docker.com/"
  :tags="['容器', 'DevOps']"
  :external="true"
/>

</div>

## 在线服务

<div class="tool-grid">

<ToolCard 
  name="GitHub"
  description="全球最大的代码托管平台，开源项目首选。"
  url="https://github.com/"
  :tags="['代码托管', '协作']"
  :external="true"
/>

<ToolCard 
  name="Vercel"
  description="前端项目部署平台，支持自动构建和 CDN 加速。"
  url="https://vercel.com/"
  :tags="['部署', '前端']"
  :external="true"
/>

<ToolCard 
  name="Netlify"
  description="静态网站托管平台，支持自动化部署和边缘函数。"
  url="https://www.netlify.com/"
  :tags="['托管', '静态网站']"
  :external="true"
/>

<ToolCard 
  name="Notion"
  description="多功能协作工具，笔记、文档、项目管理一体化。"
  url="https://www.notion.so/"
  :tags="['笔记', '协作']"
  :external="true"
/>

</div>

## 效率工具

<div class="tool-grid">

<ToolCard 
  name="Raycast"
  description="macOS 效率启动器，替代 Spotlight，支持扩展。"
  url="https://www.raycast.com/"
  :tags="['启动器', 'macOS']"
  :external="true"
/>

<ToolCard 
  name="Alfred"
  description="macOS 效率工具，工作流自动化神器。"
  url="https://www.alfredapp.com/"
  :tags="['启动器', 'macOS']"
  :external="true"
/>

<ToolCard 
  name="Fig"
  description="终端自动补全工具，提升命令行效率。"
  url="https://fig.io/"
  :tags="['终端', '自动补全']"
  :external="true"
/>

<ToolCard 
  name="Tldr"
  description="简化版 man 手册，快速查看命令常用用法。"
  url="https://tldr.sh/"
  :tags="['命令行', '文档']"
  :external="true"
/>

</div>

## 设计资源

<div class="tool-grid">

<ToolCard 
  name="Figma"
  description="在线协作设计工具，UI/UX 设计首选。"
  url="https://www.figma.com/"
  :tags="['设计', '协作']"
  :external="true"
/>

<ToolCard 
  name="Canva"
  description="在线设计平台，快速制作海报、演示文稿等。"
  url="https://www.canva.com/"
  :tags="['设计', '模板']"
  :external="true"
/>

<ToolCard 
  name="Unsplash"
  description="高质量免费图片资源网站。"
  url="https://unsplash.com/"
  :tags="['图片', '免费']"
  :external="true"
/>

<ToolCard 
  name="IconFont"
  description="阿里巴巴图标库，海量图标资源。"
  url="https://www.iconfont.cn/"
  :tags="['图标', '矢量']"
  :external="true"
/>

</div>

## 更多工具

- [软件推荐](/tools/software) - 本地软件推荐清单
- [在线工具](/tools/online-tools) - 实用在线工具集合

<style>
.tool-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
  margin: 2rem 0;
}
</style>
