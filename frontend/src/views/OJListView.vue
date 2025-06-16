<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { api } from '@/api'
import OJFilterPanel from '@/components/oj/OJFilterPanel.vue'
import OJProblemCard from '@/components/oj/OJProblemCard.vue'
import type { OJProblem } from '@/types/api'

const isLoading = ref(true)
const searchQuery = ref('')
const problems = ref<OJProblem[]>([])
const sortBy = ref<'id' | 'title' | 'newest'>('id')
const sortOrder = ref<'asc' | 'desc'>('asc')

// 搜索历史和建议
const searchHistory = ref<string[]>([])
const searchSuggestions = computed(() => {
  const titles = problems.value.map(p => p.title)
  const ids = problems.value.map(p => p.id.toString())
  return [...new Set([...titles, ...ids, ...searchHistory.value])].filter(Boolean)
})

onMounted(async () => {
  try {
    console.log('开始获取OJ题目数据...')
    const res = await api.getOJProblems()
    console.log('OJ API响应:', res)
    console.log('响应状态:', res.status)
    console.log('响应数据:', res.data)
    
    if (res.status && res.data) {
      problems.value = res.data
      console.log('设置后的problems.value:', problems.value)
    } else {
      console.warn('API响应状态或数据为空:', { status: res.status, data: res.data })
    }

    // 从本地存储加载搜索历史
    const saved = localStorage.getItem('oj-search-history')
    if (saved) {
      searchHistory.value = JSON.parse(saved).slice(0, 10) // 最多保存10条
    }
  } catch (error) {
    console.error('获取OJ题目数据失败:', error)
  } finally {
    isLoading.value = false
  }
})

// 增强的搜索功能
const filteredProblems = computed(() => {
  let result = problems.value

  // 搜索过滤
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim()
    result = result.filter(p => {
      // 支持多字段搜索：标题、ID、描述
      return (
        p.title.toLowerCase().includes(query) ||
        p.id.toString().includes(query) ||
        (p.description && p.description.toLowerCase().includes(query))
      )
    })
  }

  // 排序
  result = [...result].sort((a, b) => {
    let comparison = 0

    switch (sortBy.value) {
      case 'id':
        comparison = a.id - b.id
        break
      case 'title':
        comparison = a.title.localeCompare(b.title, 'zh-CN')
        break
      case 'newest':
        comparison = b.id - a.id // 假设ID越大越新
        break
    }

    return sortOrder.value === 'desc' ? -comparison : comparison
  })

  return result
})

// 搜索统计
const searchStats = computed(() => {
  const total = problems.value.length
  const filtered = filteredProblems.value.length
  const isFiltered = searchQuery.value.trim() !== ''

  return {
    total,
    filtered,
    isFiltered,
    matchRate: total > 0 ? Math.round((filtered / total) * 100) : 0
  }
})

// 保存搜索历史
function saveSearchHistory() {
  if (searchQuery.value.trim() && !searchHistory.value.includes(searchQuery.value.trim())) {
    searchHistory.value.unshift(searchQuery.value.trim())
    searchHistory.value = searchHistory.value.slice(0, 10)
    localStorage.setItem('oj-search-history', JSON.stringify(searchHistory.value))
  }
}

// 监听搜索查询变化
watch(searchQuery, (newValue) => {
  if (newValue.trim()) {
    // 延迟保存搜索历史，避免频繁保存
    setTimeout(saveSearchHistory, 1000)
  }
})

// 清除搜索
function clearSearch() {
  searchQuery.value = ''
}

// 排序控制
function updateSort(field: typeof sortBy.value) {
  if (sortBy.value === field) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortBy.value = field
    sortOrder.value = 'asc'
  }
}
</script>

<template>
  <div
    class="min-h-screen bg-gradient-to-br from-emerald-50 via-cyan-50 to-blue-50 dark:from-emerald-900 dark:via-cyan-900 dark:to-blue-900">
    <!-- 页面头部装饰 -->
    <div class="relative overflow-hidden">
      <div
        class="absolute inset-0 bg-gradient-to-r from-emerald-600/10 to-cyan-600/10 dark:from-emerald-400/5 dark:to-cyan-400/5">
      </div>
      <div class="absolute -top-4 -right-4 w-72 h-72 bg-emerald-400/20 rounded-full blur-3xl"></div>
      <div class="absolute -bottom-4 -left-4 w-72 h-72 bg-cyan-400/20 rounded-full blur-3xl"></div>
    </div>

    <div class="container mx-auto p-6 max-w-7xl relative">
      <!-- 智能标题栏：主标题 + 统计信息 + 排序控制 -->
      <div class="smart-header">
        <div class="header-left">
          <div class="flex items-center space-x-4">
            <!-- 主标题区域 -->
            <div class="main-title-section">
              <h1
                class="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent mb-1">
                算法题库
              </h1>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                挑战编程思维，提升算法能力
              </p>
            </div>

            <!-- 分隔线 -->
            <div class="w-px h-12 bg-gradient-to-b from-emerald-300 to-cyan-300 dark:from-emerald-600 dark:to-cyan-600">
            </div>

            <!-- 统计信息 -->
            <div class="stats-section">
              <div class="flex items-center space-x-2 mb-1">
                <div class="w-2 h-6 bg-gradient-to-b from-emerald-500 to-cyan-500 rounded-full"></div>
                <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  <template v-if="searchStats.isFiltered">
                    找到 <span class="text-emerald-600 dark:text-emerald-400">{{ searchStats.filtered }}</span> / {{
                    searchStats.total }} 道题目
                  </template>
                  <template v-else>
                    共 <span class="text-emerald-600 dark:text-emerald-400">{{ searchStats.total }}</span> 道题目
                  </template>
                </h2>
              </div>
              <p class="text-sm text-gray-500 dark:text-gray-400 ml-4">
                <template v-if="searchStats.isFiltered">
                  匹配度 {{ searchStats.matchRate }}%，准备挑战吧！
                </template>
                <template v-else>
                  选择你感兴趣的题目开始练习
                </template>
              </p>
            </div>
          </div>
        </div>

        <!-- 排序控制 -->
        <div class="header-controls">
          <div class="sort-controls">
            <span class="text-sm text-gray-500 dark:text-gray-400 mr-3">排序：</span>
            <div class="sort-buttons">
              <button @click="updateSort('id')" :class="['sort-btn', { 'sort-active': sortBy === 'id' }]">
                ID
                <svg v-if="sortBy === 'id'" class="w-3 h-3 ml-1" :class="{ 'rotate-180': sortOrder === 'desc' }"
                  fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path>
                </svg>
              </button>
              <button @click="updateSort('title')" :class="['sort-btn', { 'sort-active': sortBy === 'title' }]">
                标题
                <svg v-if="sortBy === 'title'" class="w-3 h-3 ml-1" :class="{ 'rotate-180': sortOrder === 'desc' }"
                  fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path>
                </svg>
              </button>
              <button @click="updateSort('newest')" :class="['sort-btn', { 'sort-active': sortBy === 'newest' }]">
                最新
                <svg v-if="sortBy === 'newest'" class="w-3 h-3 ml-1" :class="{ 'rotate-180': sortOrder === 'desc' }"
                  fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 增强搜索筛选 -->
      <div
        class="backdrop-blur-sm bg-white/70 dark:bg-gray-800/70 rounded-2xl p-6 mb-8 shadow-xl border border-white/20">
        <OJFilterPanel v-model="searchQuery" :suggestions="searchSuggestions" placeholder="搜索题目名称、ID 或关键词..."
          @clear="clearSearch" />
      </div>

      <!-- 骨架屏 -->
      <div v-if="isLoading" class="loading-section">
        <div class="text-center mb-8">
          <div class="inline-flex items-center space-x-2 text-gray-600 dark:text-gray-300">
            <div class="w-6 h-6 border-4 border-emerald-200 border-t-emerald-500 rounded-full animate-spin"></div>
            <span class="text-lg font-medium">正在加载题目...</span>
          </div>
        </div>

        <div class="grid gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          <div v-for="i in 8" :key="i" class="skeleton-card">
            <div class="p-6">
              <div
                class="w-12 h-12 bg-gradient-to-br from-emerald-200 to-cyan-200 dark:from-emerald-700 dark:to-cyan-700 rounded-xl mb-4 animate-pulse">
              </div>
              <div class="space-y-3">
                <div
                  class="h-5 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-lg animate-pulse">
                </div>
                <div
                  class="h-4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded w-3/4 animate-pulse">
                </div>
                <div
                  class="h-3 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded w-full animate-pulse">
                </div>
                <div
                  class="h-3 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded w-2/3 animate-pulse">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 题目卡片 -->
      <div v-else-if="filteredProblems.length" class="problems-section">
        <!-- 搜索结果提示 -->
        <div v-if="searchQuery.trim()" class="search-results-tip">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center space-x-2">
              <svg class="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span class="text-gray-600 dark:text-gray-300 font-medium">
                为 "<span class="text-emerald-600 dark:text-emerald-400 font-bold">{{ searchQuery }}</span>"
                找到 <span class="text-emerald-600 dark:text-emerald-400 font-bold">{{ filteredProblems.length }}</span>
                个结果
              </span>
            </div>
            <button @click="clearSearch" class="clear-search-btn">
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
              清除搜索
            </button>
          </div>
        </div>

        <div class="grid gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          <OJProblemCard v-for="(problem, index) in filteredProblems" :key="problem.id" :problem="problem"
            :style="{ animationDelay: `${index * 0.1}s` }" class="problem-card-animated" />
        </div>
      </div>

      <!-- 空状态 -->
      <div v-else class="empty-state">
        <div
          class="backdrop-blur-sm bg-white/70 dark:bg-gray-800/70 rounded-2xl p-12 text-center border border-white/20 shadow-xl">
          <div
            class="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-emerald-100 to-cyan-100 dark:from-emerald-900 dark:to-cyan-900 rounded-full flex items-center justify-center">
            <svg class="w-10 h-10 text-emerald-500 dark:text-emerald-400" fill="none" stroke="currentColor"
              viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            <template v-if="searchQuery.trim()">
              未找到匹配的题目
            </template>
            <template v-else>
              还没有题目
            </template>
          </h3>
          <p class="text-gray-500 dark:text-gray-400 mb-4">
            <template v-if="searchQuery.trim()">
              试试调整搜索关键词，或者使用其他搜索条件
            </template>
            <template v-else>
              题库正在建设中，敬请期待
            </template>
          </p>
          <div class="flex flex-col sm:flex-row gap-3 justify-center">
            <button v-if="searchQuery.trim()" @click="clearSearch" class="search-action-btn primary">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15">
                </path>
              </svg>
              清除搜索条件
            </button>
            <button @click="searchQuery = ''" class="search-action-btn secondary">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z">
                </path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z">
                </path>
              </svg>
              浏览所有题目
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 智能标题栏样式 */
.smart-header {
  @apply flex items-start justify-between flex-wrap gap-6 mb-8;
  @apply backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 rounded-2xl p-8;
  @apply shadow-xl border border-white/20 dark:border-gray-700/20;
}

.header-left {
  @apply flex-1 min-w-0;
}

/* 主标题区域 */
.main-title-section h1 {
  @apply text-3xl font-bold mb-1;
}

.main-title-section p {
  @apply text-sm text-gray-500 dark:text-gray-400;
}

/* 统计信息区域 */
.stats-section h2 {
  @apply text-lg font-semibold text-gray-800 dark:text-gray-200;
}

.stats-section p {
  @apply text-sm text-gray-500 dark:text-gray-400;
}

/* 排序控制 */
.header-controls {
  @apply flex flex-col items-end gap-2;
}

.sort-controls {
  @apply flex items-center;
}

.sort-buttons {
  @apply flex gap-2;
}

.sort-btn {
  @apply flex items-center px-3 py-1.5 rounded-lg text-sm font-medium;
  @apply bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400;
  @apply border border-gray-200 dark:border-gray-600;
  @apply hover:bg-emerald-50 dark:hover:bg-emerald-900/20;
  @apply hover:text-emerald-600 dark:hover:text-emerald-400;
  @apply hover:border-emerald-200 dark:hover:border-emerald-700;
  @apply transition-all duration-200;
}

.sort-active {
  @apply bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400;
  @apply border-emerald-200 dark:border-emerald-700;
}

/* 搜索结果提示 */
.search-results-tip {
  @apply mb-6;
}

.clear-search-btn {
  @apply inline-flex items-center px-3 py-1.5 text-sm;
  @apply text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300;
  @apply bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600;
  @apply border border-gray-200 dark:border-gray-600 rounded-lg;
  @apply transition-colors duration-200;
}

/* 搜索操作按钮 */
.search-action-btn {
  @apply inline-flex items-center px-6 py-3 font-medium rounded-xl shadow-lg;
  @apply transform hover:scale-105 transition-all duration-200;
  @apply focus:outline-none focus:ring-4;
}

.search-action-btn.primary {
  @apply bg-gradient-to-r from-emerald-500 to-cyan-500 text-white;
  @apply hover:from-emerald-600 hover:to-cyan-600 hover:shadow-xl;
  @apply focus:ring-emerald-200 dark:focus:ring-emerald-800;
}

.search-action-btn.secondary {
  @apply bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300;
  @apply hover:bg-gray-200 dark:hover:bg-gray-600;
  @apply focus:ring-gray-200 dark:focus:ring-gray-600;
}

/* 骨架屏卡片 */
.skeleton-card {
  @apply backdrop-blur-sm bg-white/70 dark:bg-gray-800/70 rounded-2xl shadow-lg border border-white/20;
  @apply transform hover:scale-105 transition-all duration-300;
}

/* 题目卡片动画 */
.problem-card-animated {
  animation: fadeInUp 0.6s ease-out forwards;
  opacity: 0;
  transform: translateY(20px);
  @apply transition-all duration-300 hover:z-10 hover:shadow-xl hover:-translate-y-1 focus-within:ring-2 focus-within:ring-emerald-200;
}

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 加载状态 */
.loading-section {
  @apply py-12;
}

/* 题目区域 */
.problems-section {
  @apply space-y-6;
}

/* 空状态 */
.empty-state {
  @apply py-16;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .smart-header {
    @apply flex-col items-stretch gap-4 p-6;
  }

  .header-left {
    @apply w-full;
  }

  .header-left>div {
    @apply flex-col space-x-0 space-y-4 items-start;
  }

  .main-title-section h1 {
    @apply text-2xl;
  }

  .stats-section h2 {
    @apply text-base;
  }

  .header-controls {
    @apply flex-row items-center w-full justify-between;
  }

  .sort-controls {
    @apply flex-wrap;
  }

  .sort-buttons {
    @apply gap-1;
  }

  .sort-btn {
    @apply px-2 py-1 text-xs;
  }

  .grid {
    @apply gap-4;
  }
}

@media (max-width: 640px) {
  .smart-header {
    @apply p-4;
  }

  .main-title-section h1 {
    @apply text-xl;
  }

  .stats-section {
    @apply mt-2;
  }

  .header-left>div {
    @apply space-y-3;
  }

  /* 隐藏分隔线在小屏幕上 */
  .header-left>div>div:nth-child(2) {
    @apply hidden;
  }

  .search-action-btn {
    @apply w-full justify-center;
  }
}

/* 暗色模式适配 */
@media (prefers-color-scheme: dark) {
  .smart-header {
    @apply shadow-gray-900/20;
  }

  .skeleton-card {
    @apply shadow-emerald-500/10;
  }

  .problem-card-animated {
    @apply hover:shadow-emerald-500/25;
  }
}

/* 过渡动画 */
* {
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}

/* 滚动平滑 */
html {
  scroll-behavior: smooth;
}
</style>
