<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import ArticleCard from '@/components/article/ArticleCard.vue'
import ArticleFilter from '@/components/article/ArticleFilter.vue'
import { api } from '@/api/index'
import type { ArticleSummary, Tag } from '@/types/api'
import { Icon } from '@iconify/vue'

const allArticles = ref<ArticleSummary[]>([]) // Initialize as empty array
const allTags = ref<Tag[]>([]) // Initialize as empty array
const searchTitle = ref('')
const selectedTags = ref<string[]>([])
const isLoading = ref(true)
const error = ref<string | null>(null)

// 分页相关状态
const currentPage = ref(1)
const pageSize = ref(9) // 每页显示9篇文章，适合3x3网格
const totalItems = computed(() => filteredArticles.value.length)
const totalPages = computed(() => Math.ceil(totalItems.value / pageSize.value))
const isEmpty = computed(() => filteredArticles.value.length === 0)

onMounted(async () => {
  try {
    const [articlesRes, tagsRes] = await Promise.all([
      api.getArticles(),
      api.getTags()
    ])

    // More robust data validation
    if (articlesRes.status && articlesRes.data) {
      console.log('Raw articles data:', articlesRes.data)
      allArticles.value = articlesRes.data
    } else {
      throw new Error('bug')
    }
    if (tagsRes.status && tagsRes.data) {
      console.log('Raw tags data:', tagsRes.data)
      allTags.value = Array.isArray(tagsRes.data) ? tagsRes.data : []
    } else {
      throw new Error('标签数据格式不正确')
    }

  } catch (err) {
    error.value = '数据加载失败，请稍后重试'
    console.error('加载数据错误:', err)
    // Ensure we have empty arrays even on error
    allArticles.value = []
    allTags.value = []
  } finally {
    isLoading.value = false
  }
})

const availableTags = computed(() => {
  return (allTags.value || []).map(tag => tag?.name || '').filter(Boolean)
})

const filteredArticles = computed(() => {
  // Ensure we're always working with an array
  console.log('Filtering articles:', allArticles.value)
  const articles = Array.isArray(allArticles.value) ? allArticles.value : []

  return articles
    .filter(article => {
      // Additional null checks for article properties
      if (!article?.title) return false

      const titleMatch = article.title.toLowerCase().includes(searchTitle.value.toLowerCase())

      // 新的标签匹配逻辑：基于tagIds数组和标签名称
      let tagMatch = true
      if (selectedTags.value.length > 0) {
        // 根据选中的标签名称找到对应的标签ID
        const selectedTagIds = selectedTags.value
          .map(tagName => allTags.value.find(tag => tag.name === tagName)?.id)
          .filter(Boolean) as number[]

        // 检查文章的tagIds数组是否包含任何选中的标签ID
        tagMatch = selectedTagIds.length === 0 ||
          (article.tagIds && selectedTagIds.some(tagId => article.tagIds.includes(tagId)))
      }

      return titleMatch && tagMatch
    })
    .sort((a, b) => {
      // Handle potential missing createdAt
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0
      return dateB - dateA
    })
})

// 分页后的文章列表
const paginatedArticles = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredArticles.value.slice(start, end)
})

// 分页控制函数
const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    // 滚动到顶部
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    goToPage(currentPage.value + 1)
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    goToPage(currentPage.value - 1)
  }
}



// 重置分页当筛选条件改变时
const resetPagination = () => {
  currentPage.value = 1
}

// 监听筛选条件变化
const updateSearchTitle = (val: string) => {
  searchTitle.value = val
  resetPagination()
}

const updateSelectedTags = (val: string[]) => {
  selectedTags.value = val
  resetPagination()
}
</script>

<template>
  <div
    class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-blue-900 dark:to-indigo-900">
    <!-- 页面头部装饰 -->
    <div class="relative overflow-hidden">
      <div
        class="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 dark:from-blue-400/5 dark:to-purple-400/5">
      </div>
      <div class="absolute -top-4 -right-4 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl"></div>
      <div class="absolute -bottom-4 -left-4 w-72 h-72 bg-purple-400/20 rounded-full blur-3xl"></div>
    </div>

    <div class="container mx-auto px-4 py-8 relative mobile-optimized">
      <!-- 筛选组件 -->
      <div
        class="backdrop-blur-sm bg-white/70 dark:bg-gray-800/70 rounded-2xl p-6 mb-8 shadow-xl border border-white/20">
        <ArticleFilter :available-tags="availableTags" :initial-search-title="searchTitle"
          :initial-selected-tags="selectedTags" @update:search-title="updateSearchTitle"
          @update:selected-tags="updateSelectedTags" />
      </div>

      <!-- 状态显示 -->
      <div v-if="isLoading" class="loading-state">
        <div class="flex flex-col items-center justify-center py-20">
          <Icon icon="mdi:loading" class="w-16 h-16 text-blue-500 animate-spin" />
          <p class="mt-6 text-lg text-gray-600 dark:text-gray-300 animate-pulse">正在加载文章...</p>
          <div class="mt-4 flex space-x-2">
            <div class="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
            <div class="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
            <div class="w-3 h-3 bg-indigo-500 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
          </div>
        </div>
      </div>

      <div v-else-if="error" class="error-state">
        <div
          class="backdrop-blur-sm bg-red-50/80 dark:bg-red-900/20 rounded-2xl p-8 text-center border border-red-200/50">
          <div
            class="w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-900/50 rounded-full flex items-center justify-center">
            <Icon icon="mdi:alert-circle" class="w-8 h-8 text-red-500" />
          </div>
          <p class="text-red-700 dark:text-red-300 text-lg font-medium mb-4">{{ error }}</p>
          <button class="retry-btn" @click="onMounted">
            <Icon icon="mdi:refresh" class="w-5 h-5 mr-2" />
            重试加载
          </button>
        </div>
      </div>

      <div v-else-if="isEmpty" class="empty-state">
        <div
          class="backdrop-blur-sm bg-gray-50/80 dark:bg-gray-800/50 rounded-2xl p-12 text-center border border-gray-200/50">
          <div
            class="w-20 h-20 mx-auto mb-6 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
            <Icon icon="mdi:file-document-outline" class="w-10 h-10 text-gray-400" />
          </div>
          <h3 class="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">没有找到文章</h3>
          <p class="text-gray-500 dark:text-gray-400">试试调整搜索条件或稍后再来看看</p>
        </div>
      </div>

      <!-- 文章网格 -->
      <div v-else class="articles-section">
        <!-- 智能标题栏：主标题 + 统计信息 + 分页控制 -->
        <div class="smart-header">
          <div class="header-left">
            <div class="flex items-center space-x-4">
              <!-- 主标题区域 -->
              <div class="main-title-section">
                <h1
                  class="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-1">
                  文章集合
                </h1>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  探索知识的海洋，发现精彩内容
                </p>
              </div>

              <!-- 分隔线 -->
              <div class="w-px h-12 bg-gradient-to-b from-blue-300 to-purple-300 dark:from-blue-600 dark:to-purple-600">
              </div>

              <!-- 统计信息 -->
              <div class="stats-section">
                <div class="flex items-center space-x-2 mb-1">
                  <div class="w-2 h-6 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
                  <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-200">
                    共 <span class="text-blue-600 dark:text-blue-400">{{ totalItems }}</span> 篇文章
                  </h2>
                </div>
                <p class="text-sm text-gray-500 dark:text-gray-400 ml-4">
                  当前显示第 {{ currentPage }} 页，每页 {{ pageSize }} 篇
                </p>
              </div>
            </div>
          </div>

          <!-- 内嵌分页控制 -->
          <div v-if="totalPages > 1" class="header-pagination">
            <div class="pagination-mini">
              <!-- 上一页 -->
              <button class="page-nav-btn" :disabled="currentPage === 1" @click="prevPage"
                :class="{ 'nav-disabled': currentPage === 1 }" title="上一页">
                <Icon icon="mdi:chevron-left" class="w-4 h-4" />
              </button>

              <!-- 页码显示/快速跳转 -->
              <div class="page-selector">
                <span class="page-info">{{ currentPage }}</span>
                <span class="page-divider">/</span>
                <span class="page-total">{{ totalPages }}</span>

                <!-- 快速跳转下拉 -->
                <select :value="currentPage" @change="goToPage(parseInt(($event.target as HTMLSelectElement).value))"
                  class="page-select" title="快速跳转到指定页">
                  <option v-for="page in totalPages" :key="page" :value="page">
                    第 {{ page }} 页
                  </option>
                </select>
              </div>

              <!-- 下一页 -->
              <button class="page-nav-btn" :disabled="currentPage === totalPages" @click="nextPage"
                :class="{ 'nav-disabled': currentPage === totalPages }" title="下一页">
                <Icon icon="mdi:chevron-right" class="w-4 h-4" />
              </button>
            </div>

            <!-- 页码信息 -->
            <div class="page-info-text">
              <span class="text-xs text-gray-500 dark:text-gray-400">
                共 {{ totalPages }} 页
              </span>
            </div>
          </div>
        </div>

        <!-- 文章卡片网格 -->
        <div class="article-grid">
          <ArticleCard v-for="(article, index) in paginatedArticles" :key="article.id" :article="article"
            :tags="allTags" :style="{ animationDelay: `${index * 0.1}s` }" class="article-card-animated" />
        </div>


      </div>
    </div>
  </div>
</template>

<style scoped>
/* 加载状态 - 移动端优化 */
@media (max-width: 640px) {
  .loading-state .w-16 {
    @apply w-12 h-12;
  }

  .loading-state p {
    @apply text-base;
  }

  .loading-state .mt-4 {
    @apply mt-3;
  }
}

/* 错误状态移动端优化 */
@media (max-width: 640px) {
  .error-state .backdrop-blur-sm {
    @apply p-6;
  }

  .error-state .w-16 {
    @apply w-12 h-12;
  }

  .error-state .w-8 {
    @apply w-6 h-6;
  }

  .error-state p {
    @apply text-base;
  }

  .retry-btn {
    @apply px-4 py-2 text-sm;
  }
}

/* 空状态移动端优化 */
@media (max-width: 640px) {
  .empty-state .backdrop-blur-sm {
    @apply p-8;
  }

  .empty-state .w-20 {
    @apply w-16 h-16;
  }

  .empty-state .w-10 {
    @apply w-8 h-8;
  }

  .empty-state h3 {
    @apply text-lg;
  }

  .empty-state p {
    @apply text-sm;
  }
}

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

/* 分页控制样式 */
.header-pagination {
  @apply flex flex-col items-end gap-2;
}

.pagination-mini {
  @apply flex items-center gap-2;
}

.page-nav-btn {
  @apply flex items-center justify-center w-9 h-9 rounded-lg;
  @apply bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400;
  @apply border border-gray-200 dark:border-gray-600;
  @apply hover:bg-blue-500 hover:text-white hover:border-blue-500;
  @apply transition-all duration-200 transform hover:scale-105;
  @apply focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-700;
  @apply active:scale-95;
  /* 添加点击反馈 */
  /* 触摸友好的最小尺寸 */
  min-width: 44px;
  min-height: 44px;
}

.nav-disabled {
  @apply opacity-40 cursor-not-allowed;
  @apply hover:bg-gray-100 dark:hover:bg-gray-700;
  @apply hover:text-gray-600 dark:hover:text-gray-400;
  @apply hover:border-gray-200 dark:hover:border-gray-600;
  @apply hover:scale-100;
}

.page-selector {
  @apply relative flex items-center gap-1 px-4 py-2 rounded-lg;
  @apply bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600;
  @apply text-sm font-medium text-gray-700 dark:text-gray-300;
  @apply hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer;
  @apply transition-all duration-200;
  /* 触摸友好尺寸 */
  min-height: 44px;
}

.page-info {
  @apply text-blue-600 dark:text-blue-400 font-semibold;
}

.page-divider {
  @apply text-gray-400 dark:text-gray-500 mx-1;
}

.page-total {
  @apply text-gray-600 dark:text-gray-400;
}

.page-select {
  @apply absolute inset-0 w-full h-full opacity-0 cursor-pointer;
  @apply bg-transparent border-none outline-none;
}

.page-info-text {
  @apply text-right;
}

/* 文章网格 - 响应式优化 */
.article-grid {
  @apply grid gap-6;
  /* 默认桌面端：3列 */
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
}

/* 大屏幕：确保最多3列 */
@media (min-width: 1280px) {
  .article-grid {
    @apply grid-cols-3;
  }
}

/* 中等屏幕：2列 */
@media (max-width: 1024px) and (min-width: 768px) {
  .article-grid {
    @apply grid-cols-2;
    gap: 1.25rem;
    /* 5 */
  }
}

/* 平板竖屏：2列紧凑 */
@media (max-width: 768px) and (min-width: 640px) {
  .article-grid {
    @apply grid-cols-2;
    gap: 1rem;
    /* 4 */
  }
}

/* 手机屏幕：单列 */
@media (max-width: 640px) {
  .article-grid {
    @apply grid-cols-1;
    gap: 0.75rem;
    /* 3 */
  }
}

/* 超小屏幕：单列更紧凑 */
@media (max-width: 480px) {
  .article-grid {
    gap: 0.5rem;
    /* 2 */
  }
}

/* 文章卡片动画 */
.article-card-animated {
  animation: fadeInUp 0.6s ease-out forwards;
  opacity: 0;
  transform: translateY(20px);
}

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 重试按钮 */
.retry-btn {
  @apply inline-flex items-center px-6 py-3 bg-gradient-to-r from-red-500 to-red-600;
  @apply text-white font-medium rounded-xl shadow-lg;
  @apply hover:from-red-600 hover:to-red-700 hover:shadow-xl;
  @apply transform hover:scale-105 transition-all duration-200;
  @apply focus:outline-none focus:ring-4 focus:ring-red-200;
}

.retry-btn:hover .iconify {
  animation: spin 0.5s ease-in-out;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

/* 响应式设计 - 平板设备 */
@media (max-width: 1024px) {
  .article-grid {
    @apply grid-cols-1 md:grid-cols-2 gap-5;
  }

  .smart-header {
    @apply p-6;
  }
}

/* 响应式设计 - 中等屏幕 */
@media (max-width: 768px) {
  .smart-header {
    @apply flex-col items-stretch gap-4 p-5;
  }

  .header-left {
    @apply w-full;
  }

  .header-left>div {
    @apply flex-col space-x-0 space-y-3 items-start;
  }

  .main-title-section h1 {
    @apply text-2xl leading-tight;
  }

  .main-title-section p {
    @apply text-xs;
  }

  .stats-section h2 {
    @apply text-base;
  }

  .stats-section p {
    @apply text-xs ml-3;
  }

  .header-pagination {
    @apply flex-row items-center w-full justify-between bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3;
  }

  .pagination-mini {
    @apply gap-2;
  }

  .page-nav-btn {
    @apply w-8 h-8 text-sm;
  }

  .page-selector {
    @apply px-3 py-1.5 text-xs;
  }

  .article-grid {
    @apply grid-cols-1 gap-4;
  }

  /* 筛选组件优化 */
  .container {
    @apply px-3;
  }
}

/* 响应式设计 - 小屏幕 */
@media (max-width: 640px) {
  .smart-header {
    @apply p-4 gap-3;
  }

  .main-title-section h1 {
    @apply text-xl;
  }

  .main-title-section p {
    @apply hidden;
    /* 在小屏幕隐藏副标题 */
  }

  .stats-section {
    @apply mt-1;
  }

  .stats-section h2 {
    @apply text-sm;
  }

  .stats-section p {
    @apply text-xs ml-2;
  }

  .header-left>div {
    @apply space-y-2;
  }

  /* 隐藏分隔线在小屏幕上 */
  .header-left>div>div:nth-child(2) {
    @apply hidden;
  }

  .header-pagination {
    @apply p-2 text-xs;
  }

  .pagination-mini {
    @apply gap-1;
  }

  .page-nav-btn {
    @apply w-7 h-7;
  }

  .page-selector {
    @apply px-2 py-1 text-xs min-w-[60px];
  }

  .page-info-text {
    @apply text-xs;
  }

  /* 容器优化 */
  .container {
    @apply px-2;
  }

  /* 文章网格优化 */
  .article-grid {
    @apply gap-3;
  }
}

/* 超小屏幕优化 */
@media (max-width: 480px) {
  .smart-header {
    @apply p-3;
  }

  .main-title-section h1 {
    @apply text-lg;
  }

  .stats-section h2 {
    @apply text-xs;
  }

  .stats-section p {
    @apply hidden;
    /* 隐藏详细统计信息 */
  }

  .header-pagination {
    @apply flex-col gap-2 p-2;
  }

  .pagination-mini {
    @apply w-full justify-center;
  }

  .page-info-text {
    @apply text-center;
  }

  /* 简化页面边距 */
  .container {
    @apply px-1 py-4;
  }

  /* 筛选组件简化 */
  .backdrop-blur-sm {
    @apply p-4;
  }
}

/* 暗色模式适配 */
@media (prefers-color-scheme: dark) {
  .smart-header {
    @apply shadow-gray-900/20;
  }

  .page-nav-btn:hover:not(.nav-disabled) {
    @apply shadow-blue-500/25;
  }
}

/* 滚动平滑 - 移动端优化 */
html {
  scroll-behavior: smooth;
}

/* 移动端滚动条优化 */
@media (max-width: 768px) {
  * {
    scrollbar-width: thin;
  }

  *::-webkit-scrollbar {
    width: 4px;
    height: 4px;
  }

  *::-webkit-scrollbar-track {
    background: transparent;
  }

  *::-webkit-scrollbar-thumb {
    background: rgba(156, 163, 175, 0.5);
    border-radius: 2px;
  }

  *::-webkit-scrollbar-thumb:hover {
    background: rgba(156, 163, 175, 0.7);
  }
}

/* 触摸优化 */
@media (hover: none) and (pointer: coarse) {

  /* 移除桌面端的 hover 效果，改为 active */
  .page-nav-btn:hover {
    @apply bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400;
    @apply border-gray-200 dark:border-gray-600 scale-100;
  }

  .page-nav-btn:active {
    @apply bg-blue-500 text-white border-blue-500;
  }

  .page-selector:hover {
    @apply bg-gray-50 dark:bg-gray-700;
  }

  .page-selector:active {
    @apply bg-gray-100 dark:bg-gray-600;
  }

  /* 文章卡片触摸优化 */
  .article-card-animated:active {
    transform: scale(0.98);
  }
}

/* 移动端容器优化 */
.mobile-optimized {
  @apply transition-all duration-300;
}

@media (max-width: 768px) {
  .mobile-optimized {
    @apply px-3 py-6;
  }
}

@media (max-width: 640px) {
  .mobile-optimized {
    @apply px-2 py-4;
  }
}

@media (max-width: 480px) {
  .mobile-optimized {
    @apply px-1 py-3;
  }
}

/* 过渡动画 */
* {
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}
</style>
