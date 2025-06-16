<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import ArticleCard from '@/components/article/ArticleCard.vue'
import ArticleFilter from '@/components/article/ArticleFilter.vue'
import { api } from '@/api/index'
import type { ArticleSummary, Tag } from '@/types/api'

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

    <div class="container mx-auto px-4 py-8 relative">
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
          <div class="loading-spinner"></div>
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
            <svg class="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 19c-.77.833.192 2.5 1.732 2.5z">
              </path>
            </svg>
          </div>
          <p class="text-red-700 dark:text-red-300 text-lg font-medium mb-4">{{ error }}</p>
          <button class="retry-btn" @click="onMounted">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15">
              </path>
            </svg>
            重试加载
          </button>
        </div>
      </div>

      <div v-else-if="isEmpty" class="empty-state">
        <div
          class="backdrop-blur-sm bg-gray-50/80 dark:bg-gray-800/50 rounded-2xl p-12 text-center border border-gray-200/50">
          <div
            class="w-20 h-20 mx-auto mb-6 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
            <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z">
              </path>
            </svg>
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
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                </svg>
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
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
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
            :style="{ animationDelay: `${index * 0.1}s` }" class="article-card-animated" />
        </div>


      </div>
    </div>
  </div>
</template>

<style scoped>
/* 加载动画 */
.loading-spinner {
  @apply animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-blue-500 mx-auto;
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
  @apply flex items-center justify-center w-8 h-8 rounded-lg;
  @apply bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400;
  @apply border border-gray-200 dark:border-gray-600;
  @apply hover:bg-blue-500 hover:text-white hover:border-blue-500;
  @apply transition-all duration-200 transform hover:scale-105;
  @apply focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-700;
}

.nav-disabled {
  @apply opacity-40 cursor-not-allowed;
  @apply hover:bg-gray-100 dark:hover:bg-gray-700;
  @apply hover:text-gray-600 dark:hover:text-gray-400;
  @apply hover:border-gray-200 dark:hover:border-gray-600;
  @apply hover:scale-100;
}

.page-selector {
  @apply relative flex items-center gap-1 px-3 py-1.5 rounded-lg;
  @apply bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600;
  @apply text-sm font-medium text-gray-700 dark:text-gray-300;
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

/* 文章网格 */
.article-grid {
  @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6;
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

  .header-pagination {
    @apply flex-row items-center w-full justify-between;
  }

  .pagination-mini {
    @apply gap-1;
  }

  .page-nav-btn {
    @apply w-7 h-7;
  }

  .page-selector {
    @apply px-2 py-1 text-xs;
  }

  .article-grid {
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

/* 滚动平滑 */
html {
  scroll-behavior: smooth;
}

/* 过渡动画 */
* {
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}
</style>
