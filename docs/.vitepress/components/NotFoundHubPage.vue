<template>
  <div class="hub-page notfound-page">
    <section class="hub-hero">
      <div class="hub-eyebrow">
        <span class="hub-code">404</span>
        <span class="hub-card-status">Not Found</span>
      </div>
      <h1 class="hub-title">页面未找到</h1>
      <p class="hub-desc">
        你访问的页面不存在，可能是链接已失效、地址输入有误，或对应内容已经迁移到新的路径。下面这些入口通常能帮你更快找回要看的内容。
      </p>
      <div class="hub-stats">
        <div class="hub-stat">
          <span class="hub-stat-value">/</span>
          <span class="hub-stat-label">返回首页</span>
        </div>
        <div class="hub-stat">
          <span class="hub-stat-value">MAP</span>
          <span class="hub-stat-label">站点结构索引</span>
        </div>
        <div class="hub-stat">
          <span class="hub-stat-value">ARCHIVE</span>
          <span class="hub-stat-label">历史文章入口</span>
        </div>
      </div>
    </section>

    <section class="hub-section">
      <h2 class="hub-section-title">建议入口</h2>
      <div class="hub-grid">
        <a class="hub-card" href="/">
          <div class="hub-card-top">
            <span class="hub-card-label">HOME</span>
            <span class="hub-card-status">Start</span>
          </div>
          <h3>回到首页</h3>
          <p>从首页重新进入代表文章、核心专题和最近更新，是最快的重定位方式。</p>
        </a>
        <a class="hub-card" href="/others/sitemap-page">
          <div class="hub-card-top">
            <span class="hub-card-label">MAP</span>
            <span class="hub-card-status">Structure</span>
          </div>
          <h3>查看站点地图</h3>
          <p>如果你知道大概的主题方向，但不确定具体路径，站点地图会比手动猜 URL 更有效。</p>
        </a>
        <a class="hub-card" href="/others/archives">
          <div class="hub-card-top">
            <span class="hub-card-label">ARCHIVE</span>
            <span class="hub-card-status">Timeline</span>
          </div>
          <h3>浏览文章归档</h3>
          <p>如果你记得文章的大致发布时间，可以直接从时间线回溯到对应内容。</p>
        </a>
      </div>
    </section>
  </div>
</template>
