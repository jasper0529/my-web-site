<script setup>
const sortingGroups = [
  {
    code: 'BASIC',
    title: '基础排序',
    desc: '冒泡、选择、插入排序适合作为复杂度和原地交换的入门材料，用来理解为什么更优算法有存在必要。'
  },
  {
    code: 'NLOGN',
    title: '高频主力排序',
    desc: '快速排序、归并排序、堆排序是理解分治、递归、额外空间与稳定性的核心组合。'
  },
  {
    code: 'LINEAR',
    title: '线性排序',
    desc: '计数排序、桶排序、基数排序依赖输入分布或额外假设，适合用来理解突破比较排序下界的条件。'
  }
]

const compareRows = [
  ['冒泡排序', 'O(n²)', 'O(1)', '稳定', '教学入门'],
  ['插入排序', 'O(n²)', 'O(1)', '稳定', '小规模 / 近乎有序'],
  ['快速排序', 'O(n log n)', 'O(log n)', '不稳定', '通用主力'],
  ['归并排序', 'O(n log n)', 'O(n)', '稳定', '稳定排序 / 外部排序'],
  ['堆排序', 'O(n log n)', 'O(1)', '不稳定', 'Top-K / 优先队列衍生']
]
</script>

<template>
  <div class="hub-page">
    <section class="hub-hero">
      <div class="hub-eyebrow">
        <span class="hub-code">SORT</span>
        <span class="hub-card-status">Ordering Algorithms</span>
      </div>
      <h1 class="hub-title">排序算法</h1>
      <p class="hub-desc">
        排序是最容易看到复杂度差异的一类算法。这个专题会把时间复杂度、空间复杂度、稳定性和适用场景放在一起分析，而不是只背结论表格。
      </p>
      <div class="hub-stats">
        <div class="hub-stat">
          <span class="hub-stat-value">3</span>
          <span class="hub-stat-label">内容分组</span>
        </div>
        <div class="hub-stat">
          <span class="hub-stat-value">O(n log n)</span>
          <span class="hub-stat-label">主流性能基线</span>
        </div>
        <div class="hub-stat">
          <span class="hub-stat-value">2</span>
          <span class="hub-stat-label">关键维度</span>
        </div>
      </div>
    </section>

    <section class="hub-section">
      <h2 class="hub-section-title">专题结构</h2>
      <p class="hub-section-desc">
        排序板块会先按算法族拆开，再在每一类内部分析思路、复杂度来源和什么时候该用、什么时候不该用。
      </p>
      <div class="hub-grid">
        <div v-for="item in sortingGroups" :key="item.code" class="hub-card">
          <div class="hub-card-top">
            <span class="hub-card-label">{{ item.code }}</span>
            <span class="hub-card-status">Planned</span>
          </div>
          <h3>{{ item.title }}</h3>
          <p>{{ item.desc }}</p>
        </div>
      </div>
    </section>

    <section class="hub-section">
      <h2 class="hub-section-title">速览对比</h2>
      <p class="hub-section-desc">
        下面这张表只作为入口索引。真正有价值的是理解复杂度为什么这样、稳定性怎么影响场景选择，以及递归和额外空间是怎么来的。
      </p>
      <div class="sorting-table-wrap">
        <table class="sorting-table">
          <thead>
            <tr>
              <th>算法</th>
              <th>时间复杂度</th>
              <th>空间复杂度</th>
              <th>稳定性</th>
              <th>适用场景</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in compareRows" :key="row[0]">
              <td>{{ row[0] }}</td>
              <td>{{ row[1] }}</td>
              <td>{{ row[2] }}</td>
              <td>{{ row[3] }}</td>
              <td>{{ row[4] }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section class="hub-section">
      <h2 class="hub-section-title">阅读建议</h2>
      <div class="hub-subgrid">
        <div class="hub-note">
          <h3>不要死记表格</h3>
          <p>单纯背复杂度表很快会忘。更稳的方式是从“每一步做了什么比较、交换和递归”去反推时间与空间成本。</p>
        </div>
        <div class="hub-note">
          <h3>先比较，再落场景</h3>
          <p>同样是 O(n log n)，快速排序、归并排序和堆排序的常数、稳定性和空间开销完全不同，不能只看一个大 O。</p>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.sorting-table-wrap {
  overflow-x: auto;
}

.sorting-table {
  width: 100%;
  min-width: 720px;
  border-collapse: collapse;
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 18px;
  overflow: hidden;
}

.sorting-table th,
.sorting-table td {
  padding: 0.9rem 1rem;
  border-bottom: 1px solid rgba(15, 23, 42, 0.08);
  text-align: left;
}

.sorting-table thead th {
  background: rgba(15, 23, 42, 0.04);
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.04em;
}

.sorting-table tbody tr:last-child td {
  border-bottom: none;
}

.dark .sorting-table {
  border-color: rgba(148, 163, 184, 0.16);
}

.dark .sorting-table th,
.dark .sorting-table td {
  border-bottom-color: rgba(148, 163, 184, 0.14);
}

.dark .sorting-table thead th {
  background: rgba(148, 163, 184, 0.08);
}
</style>
