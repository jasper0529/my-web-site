<script setup>
const milestones = [
  {
    period: '2026 · Q1',
    items: [
      '内容体系校准：重构算法、Python、关于页与归档页，统一专题入口风格与元信息策略。',
      '体验优化：调整首页 Hero、专题页视觉和文章卡片层级，收紧站点整体风格。'
    ]
  },
  {
    period: '2025 · Q4',
    items: [
      '知识库扩充：新增 Redis 连接池、mimesis 等工程实践文章，补齐部分专题索引页。',
      '内容治理：梳理标签、归档、About 页面，接入 frontmatter 生成与 SEO 辅助脚本。'
    ]
  },
  {
    period: '2025 · Q2-Q3',
    items: [
      '站点能力扩展：增加 Notes、Others 分类，并补充 sitemap、robots、Feed 等公开文件。',
      '主题升级：迁移到 VitePress 体系，统一导航、侧边栏与辅助脚本结构。'
    ]
  },
  {
    period: '2024 · 初始上线',
    items: [
      '完成算法笔记与 Python 基础内容首批发布，并接入自动化部署流程。',
      '建立仓库目录结构、构建预览链路与基础 SEO 公开文件。'
    ]
  }
]

const capabilities = [
  {
    code: 'CONTENT',
    title: '内容体系',
    desc: '覆盖 Python、算法、Linux 笔记、AI 应用、工具与资源页，并通过专题页组织入口。'
  },
  {
    code: 'SEO',
    title: '可发现性',
    desc: '提供 canonical、结构化数据、Feed、Sitemap、Robots 以及自动生成的基础元信息。'
  },
  {
    code: 'DX',
    title: '维护能力',
    desc: '借助 frontmatter 生成与 SEO 脚本降低维护成本，并保持主题、侧边栏和数据来源的模块化。'
  }
]

const plans = [
  '继续补齐算法、Python 高阶专题，并增强“总览文 + 子专题”结构。',
  '逐步给核心文章补封面、代表图和更紧凑的摘要信息。',
  '评估是否增加轻量反馈渠道与更清晰的更新订阅入口。'
]
</script>

<template>
  <div class="hub-page update-page">
    <section class="hub-hero">
      <div class="hub-eyebrow">
        <span class="hub-code">CHANGELOG</span>
        <span class="hub-card-status">Site Evolution</span>
      </div>
      <h1 class="hub-title">网站更新记录</h1>
      <p class="hub-desc">
        这页记录 Jasper Labs 的重要演进节点，不只追踪“新增了什么”，也说明站点在内容结构、阅读体验和维护方式上是如何逐步收敛的。
      </p>
      <div class="hub-stats">
        <div class="hub-stat">
          <span class="hub-stat-value">2024</span>
          <span class="hub-stat-label">起始年份</span>
        </div>
        <div class="hub-stat">
          <span class="hub-stat-value">4</span>
          <span class="hub-stat-label">阶段节点</span>
        </div>
        <div class="hub-stat">
          <span class="hub-stat-value">3</span>
          <span class="hub-stat-label">当前能力面</span>
        </div>
      </div>
    </section>

    <section class="hub-section">
      <h2 class="hub-section-title">版本演进</h2>
      <p class="hub-section-desc">
        这里保留对站点结构演变更有代表性的更新，而不是把所有微小改动都堆成流水账。
      </p>
      <div class="update-timeline">
        <section v-for="milestone in milestones" :key="milestone.period" class="update-block">
          <div class="update-period">
            <h3>{{ milestone.period }}</h3>
          </div>
          <div class="update-card">
            <ul class="hub-note-list">
              <li v-for="item in milestone.items" :key="item">{{ item }}</li>
            </ul>
          </div>
        </section>
      </div>
    </section>

    <section class="hub-section">
      <h2 class="hub-section-title">当前能力</h2>
      <p class="hub-section-desc">
        当前站点已经不只是一个博客首页，而是围绕内容组织、SEO 能力和维护效率形成了比较稳定的基础骨架。
      </p>
      <div class="hub-grid">
        <div v-for="item in capabilities" :key="item.code" class="hub-card">
          <div class="hub-card-top">
            <span class="hub-card-label">{{ item.code }}</span>
            <span class="hub-card-status">Current</span>
          </div>
          <h3>{{ item.title }}</h3>
          <p>{{ item.desc }}</p>
        </div>
      </div>
    </section>

    <section class="hub-section">
      <h2 class="hub-section-title">后续方向</h2>
      <div class="hub-subgrid">
        <div class="hub-note">
          <h3>接下来要补什么</h3>
          <ul class="hub-note-list">
            <li v-for="item in plans" :key="item">{{ item }}</li>
          </ul>
        </div>
        <div class="hub-note">
          <h3>如何阅读这页</h3>
          <p>如果你想看“这个站现在能做什么”，优先看当前能力；如果你关心演进过程和设计取舍，再顺着时间线回看每个阶段。</p>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.update-page {
  margin-bottom: 1.5rem;
}

.update-timeline {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.update-block {
  display: grid;
  grid-template-columns: 180px 1fr;
  gap: 1rem;
  align-items: start;
}

.update-period h3 {
  margin: 0;
  font-size: 1.18rem;
}

.update-card {
  border-radius: 18px;
  border: 1px solid rgba(15, 23, 42, 0.08);
  background: rgba(255, 255, 255, 0.72);
  padding: 1rem 1.15rem;
}

.dark .update-card {
  border-color: rgba(148, 163, 184, 0.14);
  background: rgba(15, 23, 42, 0.78);
}

@media (max-width: 960px) {
  .update-block {
    grid-template-columns: 1fr;
  }
}
</style>
