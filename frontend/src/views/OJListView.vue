<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { Icon } from '@iconify/vue'
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
  return Array.from(new Set([...titles, ...ids, ...searchHistory.value])).filter(Boolean)
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
    <div class="container mx-auto p-6 max-w-7xl relative mobile-optimized pb-20 sm:pb-6">
      <!-- 智能标题栏：主标题 + 统计信息 + 排序控制 -->
      <div class="smart-header">
        <div class="header-left">
          <div class="flex items-center space-x-4 lg:space-x-6">
            <!-- 主标题区域 -->
            <div class="main-title-section">
              <h1
                class="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent mb-1">
                算法题库
              </h1>
              <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                挑战编程思维，提升算法能力
              </p>
            </div>

            <!-- 分隔线 - 在小屏幕隐藏 -->
            <div
              class="hidden md:block w-px h-12 bg-gradient-to-b from-emerald-300 to-cyan-300 dark:from-emerald-600 dark:to-cyan-600">
            </div>

            <!-- 统计信息 -->
            <div class="stats-section flex-1 min-w-0">
              <div class="flex items-center space-x-2 mb-1">
                <div class="w-1.5 h-4 sm:w-2 sm:h-6 bg-gradient-to-b from-emerald-500 to-cyan-500 rounded-full"></div>
                <h2 class="text-sm sm:text-base lg:text-lg font-semibold text-gray-800 dark:text-gray-200 truncate">
                  <template v-if="searchStats.isFiltered">
                    找到 <span class="text-emerald-600 dark:text-emerald-400">{{ searchStats.filtered }}</span> / {{
                      searchStats.total }} 道题目
                  </template>
                  <template v-else>
                    共 <span class="text-emerald-600 dark:text-emerald-400">{{ searchStats.total }}</span> 道题目
                  </template>
                </h2>
              </div>
              <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 ml-3.5 sm:ml-4 truncate">
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
            <span class="hidden sm:inline text-sm text-gray-500 dark:text-gray-400 mr-3">排序：</span>
            <div class="sort-buttons">
              <button @click="updateSort('id')" :class="['sort-btn touch-btn', { 'sort-active': sortBy === 'id' }]"
                title="按ID排序">
                <span class="hidden sm:inline">ID</span>
                <span class="sm:hidden">#</span>
                <Icon v-if="sortBy === 'id'" icon="tabler:chevron-up"
                  :class="['w-3 h-3 ml-1 transition-transform duration-200', { 'rotate-180': sortOrder === 'desc' }]" />
              </button>
              <button @click="updateSort('title')"
                :class="['sort-btn touch-btn', { 'sort-active': sortBy === 'title' }]" title="按标题排序">
                <span class="hidden sm:inline">标题</span>
                <Icon icon="tabler:abc" class="sm:hidden w-3.5 h-3.5" />
                <Icon v-if="sortBy === 'title'" icon="tabler:chevron-up"
                  :class="['w-3 h-3 ml-1 transition-transform duration-200', { 'rotate-180': sortOrder === 'desc' }]" />
              </button>
              <button @click="updateSort('newest')"
                :class="['sort-btn touch-btn', { 'sort-active': sortBy === 'newest' }]" title="按最新排序">
                <span class="hidden sm:inline">最新</span>
                <Icon icon="tabler:clock" class="sm:hidden w-3.5 h-3.5" />
                <Icon v-if="sortBy === 'newest'" icon="tabler:chevron-up"
                  :class="['w-3 h-3 ml-1 transition-transform duration-200', { 'rotate-180': sortOrder === 'desc' }]" />
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
        <div class="text-center mb-6 sm:mb-8">
          <div class="inline-flex items-center space-x-2 text-gray-600 dark:text-gray-300">
            <div
              class="w-5 h-5 sm:w-6 sm:h-6 border-3 sm:border-4 border-emerald-200 border-t-emerald-500 rounded-full animate-spin">
            </div>
            <span class="text-base sm:text-lg font-medium">正在加载题目...</span>
          </div>
        </div>

        <div class="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <div v-for="i in 8" :key="i" class="skeleton-card">
            <div class="p-4 sm:p-6">
              <div
                class="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-emerald-200 to-cyan-200 dark:from-emerald-700 dark:to-cyan-700 rounded-xl mb-3 sm:mb-4 animate-pulse">
              </div>
              <div class="space-y-2 sm:space-y-3">
                <div
                  class="h-4 sm:h-5 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-lg animate-pulse">
                </div>
                <div
                  class="h-3 sm:h-4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded w-3/4 animate-pulse">
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
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <div class="flex items-center space-x-2 flex-1 min-w-0">
              <Icon icon="tabler:circle-check" class="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500 flex-shrink-0" />
              <span class="text-sm sm:text-base text-gray-600 dark:text-gray-300 font-medium truncate">
                为 "<span class="text-emerald-600 dark:text-emerald-400 font-bold">{{ searchQuery }}</span>"
                找到 <span class="text-emerald-600 dark:text-emerald-400 font-bold">{{ filteredProblems.length }}</span>
                个结果
              </span>
            </div>
            <button @click="clearSearch" class="clear-search-btn touch-btn flex-shrink-0">
              <Icon icon="tabler:x" class="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1" />
              <span class="hidden sm:inline">清除搜索</span>
              <span class="sm:hidden">清除</span>
            </button>
          </div>
        </div>

        <div class="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <OJProblemCard v-for="(problem, index) in filteredProblems" :key="problem.id" :problem="problem"
            :style="{ animationDelay: `${index * 0.1}s` }" class="problem-card-animated" />
        </div>
      </div>

      <!-- 空状态 -->
      <div v-else class="empty-state">
        <div
          class="backdrop-blur-sm bg-white/70 dark:bg-gray-800/70 rounded-xl sm:rounded-2xl p-8 sm:p-12 text-center border border-white/20 shadow-xl">
          <div
            class="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 bg-gradient-to-br from-emerald-100 to-cyan-100 dark:from-emerald-900 dark:to-cyan-900 rounded-full flex items-center justify-center">
            <Icon icon="tabler:search" class="w-8 h-8 sm:w-10 sm:h-10 text-emerald-500 dark:text-emerald-400" />
          </div>
          <h3 class="text-lg sm:text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            <template v-if="searchQuery.trim()">
              未找到匹配的题目
            </template>
            <template v-else>
              还没有题目
            </template>
          </h3>
          <p class="text-sm sm:text-base text-gray-500 dark:text-gray-400 mb-4 sm:mb-6 max-w-md mx-auto">
            <template v-if="searchQuery.trim()">
              试试调整搜索关键词，或者使用其他搜索条件
            </template>
            <template v-else>
              题库正在建设中，敬请期待
            </template>
          </p>
          <div class="flex flex-col sm:flex-row gap-3 justify-center max-w-sm sm:max-w-none mx-auto">
            <button v-if="searchQuery.trim()" @click="clearSearch" class="search-action-btn primary touch-btn">
              <Icon icon="tabler:refresh" class="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              清除搜索条件
            </button>
            <button @click="searchQuery = ''" class="search-action-btn secondary touch-btn">
              <Icon icon="tabler:eye" class="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
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
  @apply flex items-start justify-between flex-wrap gap-4 lg:gap-6 mb-6 sm:mb-8;
  @apply backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8;
  @apply shadow-xl border border-white/20 dark:border-gray-700/20;
}

/* 移动端智能标题栏响应式优化 */
@media (max-width: 768px) {
  .smart-header {
    @apply flex-col items-stretch gap-4 p-4;
  }

  .header-left {
    @apply w-full;
  }

  .header-left>div {
    @apply flex-col space-x-0 space-y-3 items-start;
  }

  .main-title-section h1 {
    @apply text-xl;
  }

  .stats-section h2 {
    @apply text-sm;
  }

  .stats-section p {
    @apply text-xs;
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
}

@media (max-width: 640px) {
  .smart-header {
    @apply p-3;
  }

  /* 隐藏分隔线在小屏幕上 */
  .header-left>div>div:nth-child(2) {
    @apply hidden;
  }

  .main-title-section h1 {
    @apply text-lg;
  }

  .stats-section {
    @apply mt-2;
  }
}

@media (max-width: 480px) {
  .smart-header {
    @apply p-2.5;
  }
}

/* 移动端容器优化 */
.mobile-optimized {
  @apply transition-all duration-300;
  /* 全局底部间距，避免被导航栏遮挡 */
  padding-bottom: calc(env(safe-area-inset-bottom) + 80px);
}

@media (min-width: 768px) {
  .mobile-optimized {
    @apply p-6;
    padding-bottom: 1.5rem;
  }
}

@media (max-width: 767px) {
  .mobile-optimized {
    @apply p-4;
  }
}

@media (max-width: 640px) {
  .mobile-optimized {
    @apply p-3;
  }
}

@media (max-width: 480px) {
  .mobile-optimized {
    @apply p-2;
  }
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

/* 排序控制和按钮样式 */
.header-controls {
  @apply flex flex-col items-end gap-2;
}

.sort-controls {
  @apply flex items-center;
}

.sort-buttons {
  @apply flex gap-2;
}

/* 触摸友好按钮基础样式 */
.touch-btn {
  /* 确保最小触摸目标尺寸 */
  min-height: 44px;
  min-width: 44px;
  /* 触摸反馈优化 */
  user-select: none;
  -webkit-tap-highlight-color: transparent;
  /* 防止双击缩放 */
  touch-action: manipulation;
}

.sort-btn {
  @apply flex items-center justify-center px-3 py-1.5 rounded-lg text-sm font-medium;
  @apply bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400;
  @apply border border-gray-200 dark:border-gray-600;
  @apply hover:bg-emerald-50 dark:hover:bg-emerald-900/20;
  @apply hover:text-emerald-600 dark:hover:text-emerald-400;
  @apply hover:border-emerald-200 dark:hover:border-emerald-700;
  @apply transition-all duration-200;
  @apply focus:outline-none focus:ring-2 focus:ring-emerald-200 dark:focus:ring-emerald-800;
}

/* 移动端排序按钮优化 */
@media (max-width: 768px) {
  .sort-btn {
    @apply px-2.5 py-2 text-xs;
    min-height: 40px;
    min-width: 40px;
  }
}

@media (max-width: 480px) {
  .sort-btn {
    @apply px-2 py-1.5 text-xs;
    min-height: 36px;
    min-width: 36px;
  }
}

/* 触摸设备排序按钮优化 */
@media (hover: none) and (pointer: coarse) {
  .sort-btn:hover {
    @apply bg-gray-100 dark:bg-gray-700;
    @apply text-gray-600 dark:text-gray-400;
    @apply border-gray-200 dark:border-gray-600;
  }

  .sort-btn:active {
    @apply bg-emerald-50 dark:bg-emerald-900/20;
    @apply text-emerald-600 dark:text-emerald-400;
    @apply scale-95;
    transition: all 0.1s ease-out;
  }
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
  @apply focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-600;
}

/* 移动端清除搜索按钮优化 */
@media (max-width: 768px) {
  .clear-search-btn {
    @apply px-2.5 py-2 text-xs;
    min-height: 40px;
  }
}

@media (max-width: 480px) {
  .clear-search-btn {
    @apply px-2 py-1.5 text-xs;
    min-height: 36px;
  }
}

/* 触摸设备清除按钮优化 */
@media (hover: none) and (pointer: coarse) {
  .clear-search-btn:hover {
    @apply text-gray-500 dark:text-gray-400;
    @apply bg-gray-100 dark:bg-gray-700;
  }

  .clear-search-btn:active {
    @apply scale-95 bg-gray-200 dark:bg-gray-600;
    transition: all 0.1s ease-out;
  }
}

/* 搜索操作按钮 */
.search-action-btn {
  @apply inline-flex items-center justify-center px-4 sm:px-6 py-2.5 sm:py-3 font-medium rounded-xl shadow-lg;
  @apply transform hover:scale-105 transition-all duration-200;
  @apply focus:outline-none focus:ring-4;
  @apply text-sm sm:text-base;
}

/* 移动端搜索操作按钮优化 */
@media (max-width: 768px) {
  .search-action-btn {
    @apply px-4 py-2.5 text-sm;
    min-height: 44px;
  }
}

@media (max-width: 480px) {
  .search-action-btn {
    @apply px-3 py-2 text-sm;
    min-height: 40px;
    @apply w-full justify-center;
  }
}

/* 触摸设备搜索按钮优化 */
@media (hover: none) and (pointer: coarse) {
  .search-action-btn {
    @apply hover:scale-100;
  }

  .search-action-btn:active {
    @apply scale-95;
    transition: all 0.1s ease-out;
  }
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

/* 题目卡片网格优化 */
.grid {
  @apply gap-4 sm:gap-6;
}

/* 响应式网格 */
@media (max-width: 640px) {
  .grid {
    @apply gap-3;
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

/* 过渡动画和交互优化 */
* {
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}

/* 滚动平滑 */
html {
  scroll-behavior: smooth;
}

/* 移动端滚动优化 */
@media (max-width: 768px) {
  * {
    /* 减少动画以提升性能 */
    transition-duration: 150ms;
  }
}

/* 横屏模式优化 */
@media (max-height: 480px) and (orientation: landscape) {
  .mobile-optimized {
    padding-bottom: calc(env(safe-area-inset-bottom) + 60px);
  }

  .smart-header {
    @apply p-3 mb-4;
  }

  .main-title-section h1 {
    @apply text-lg;
  }

  .stats-section h2 {
    @apply text-sm;
  }

  .stats-section p {
    @apply text-xs;
  }
}

/* 高分辨率屏幕优化 */
@media (-webkit-min-device-pixel-ratio: 2),
(min-resolution: 2dppx) {

  .sort-btn,
  .clear-search-btn,
  .search-action-btn {
    /* 高分屏更精细的边框 */
    border-width: 0.5px;
  }
}

/* 无障碍优化 */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* 大字体支持 */
@media (prefers-font-size: large) {

  .sort-btn,
  .clear-search-btn,
  .search-action-btn {
    @apply text-base;
    min-height: 48px;
  }
}

/* 焦点可见性优化 */
@media (prefers-reduced-motion: no-preference) {

  .sort-btn:focus-visible,
  .clear-search-btn:focus-visible,
  .search-action-btn:focus-visible {
    @apply ring-2 ring-offset-2;
  }
}
</style>
