<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { onClickOutside } from '@vueuse/core'
import { PlusIcon, DocumentTextIcon, TrashIcon, MagnifyingGlassIcon, XMarkIcon, ChevronUpDownIcon } from '@heroicons/vue/24/outline'
import { CheckIcon } from '@heroicons/vue/24/solid'
import { api } from '@/api'
import type { ArticleRequest, Tag, ArticleSummary } from '@/types/api'
import AdminModal from '@/components/admin/AdminModal.vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import BatchOperationToolbar from '@/components/common/BatchOperationToolbar.vue'
import VirtualList from '@/components/common/VirtualList.vue'
import { useAdminCrud } from '@/composables/useAdminCrud'
import { useBatchOperations, type BatchOperation } from '@/composables/useBatchOperations'
import { useSmartCache } from '@/composables/useSmartCache'
import { useDataExport, createCommonFields } from '@/composables/useDataExport'
import { BASE_CLASSES } from '@/config/admin'

// ===================== 使用组合式函数 =====================
// v4.0 CRUD操作
const {
  items: articles,
  isLoading,
  showForm: showCreateForm,
  loadItems: loadArticles,
  handleCreate: createArticle,
  handleDelete: deleteArticle
} = useAdminCrud<ArticleSummary>({
  fetch: async () => {
    const result = await fetchWithCache(async () => {
      const apiResult = await api.getArticles()
      return apiResult.status ? apiResult.data || [] : []
    })
    return result
  },
  create: async (article) => {
    // 获取对应的ArticleRequest数据
    const articleRequest: ArticleRequest = {
      title: article.title,
      content: newArticle.value.content, // 从表单获取content
      tagIds: newArticle.value.tagIds, // 从表单获取tagIds
      coverUrl: article.coverUrl
    }
    const { status } = await api.createArticle(articleRequest)
    return status ? {
      id: Date.now(),
      title: article.title,
      summary: newArticle.value.summary || '',
      tagIds: newArticle.value.tagIds,
      createdAt: new Date().toISOString(),
      coverUrl: article.coverUrl
    } as ArticleSummary : Promise.reject('创建文章失败')
  },
  delete: async (id) => {
    const { status } = await api.deleteArticle(id)
    if (status) {
      clearCache() // 清除缓存
    }
    return status ? undefined : Promise.reject('删除文章失败')
  }
})

// v4.0 智能缓存
const { fetchWithCache, clearCache } = useSmartCache({
  key: 'article-list',
  ttl: 300000, // 5分钟缓存
  enablePersist: true
})

// v4.0 数据导出
const { exportData, supportedFormats } = useDataExport<ArticleSummary>()

// v4.0 批量操作
const {
  selectedCount,
  isProcessing: isBatchProcessing,
  operationProgress,
  lastOperationResult,
  deselectItem,
  toggleItem,
  selectAll,
  deselectAll,
  isSelected,
  getSelectedItems,
  executeBatchOperation,
  createDeleteOperation,
  createExportOperation
} = useBatchOperations<ArticleSummary>()

// ===================== 状态管理 =====================
const searchQuery = ref('')
const showMarkdownHelp = ref(false)
const articleToDelete = ref<ArticleSummary | null>(null)
const showSingleDeleteConfirm = ref(false)

// 表单状态
const newArticle = ref<ArticleRequest>({
  title: '',
  content: '',
  tagIds: [] as number[],
  coverUrl: ''
})
const tags = ref<Tag[]>([])
const tagSearch = ref('')
const showTagDropdown = ref(false)
const tagDropdownRef = ref(null)

// 图片上传相关状态
const coverFile = ref<File | null>(null)
const coverPreview = ref<string>('')
const uploadError = ref<string>('')

// 点击外部关闭下拉菜单
onClickOutside(tagDropdownRef, () => {
  showTagDropdown.value = false
})

// ===================== 计算属性 =====================
const allTagIds = computed(() => tags.value.map(t => t.id))

// 根据tagIds获取标签名称
const getTagNames = (tagIds: number[]) => {
  return tagIds.map(id => {
    const tag = tags.value.find(t => t.id === id)
    return tag ? tag.name : ''
  }).filter(Boolean)
}

const filteredTags = computed(() => {
  if (!tagSearch.value) return tags.value
  return tags.value.filter(tag =>
    tag.name.toLowerCase().includes(tagSearch.value.toLowerCase())
  )
})

const filteredArticles = computed(() => {
  if (!searchQuery.value) return articles.value

  const query = searchQuery.value.toLowerCase()
  return articles.value.filter(article =>
    article.title.toLowerCase().includes(query) ||
    getTagNames(article.tagIds).some(tag => tag.toLowerCase().includes(query))
  )
})

// v4.0 批量操作计算属性
const isEmpty = computed(() => articles.value.length === 0)
const isFiltered = computed(() => searchQuery.value !== '')
const noFilterResults = computed(() => isFiltered.value && filteredArticles.value.length === 0)
const hasSelectedAll = computed(() => selectedCount.value === filteredArticles.value.length && filteredArticles.value.length > 0)

// v4.0 批量操作列表
const batchOperations = computed(() => [
  createDeleteOperation(
    async (items: ArticleSummary[]) => {
      for (const article of items) {
        await api.deleteArticle(article.id)
      }
      await loadArticles() // 刷新列表
      clearCache() // 清除缓存
    },
    {
      confirmationMessage: `确定要删除选中的 ${selectedCount.value} 篇文章吗？此操作不可撤销。`
    }
  ),
  createExportOperation(
    async (items: ArticleSummary[]) => {
      const commonFields = createCommonFields()
      const articleFields = [
        commonFields.id,
        { key: 'title', label: '标题', type: 'string' as const },
        { key: 'tags', label: '标签', type: 'array' as const, formatter: (tags: string[]) => tags.join(', ') },
        { key: 'createdAt', label: '创建时间', type: 'date' as const },
        { key: 'updatedAt', label: '更新时间', type: 'date' as const }
      ]

      await exportData(items, {
        format: supportedFormats[0],
        fields: articleFields,
        filename: `articles_export_${items.length}`,
        includeHeaders: true
      })
    },
    {
      label: '导出文章',
      successMessage: '文章导出成功'
    }
  )
])

// v4.0 虚拟滚动配置
const useVirtualList = computed(() => filteredArticles.value.length > 50)

// 标签选择相关计算属性
const selectedTags = computed(() =>
  tags.value.filter(tag => newArticle.value.tagIds.includes(tag.id))
)

// ===================== 方法 =====================
// v4.0 批量操作相关
const handleSelectAll = () => {
  if (selectedCount.value === filteredArticles.value.length) {
    deselectAll()
  } else {
    selectAll(filteredArticles.value, (article) => article.id)
  }
}

// v4.0 虚拟列表选择处理
const handleVirtualListSelect = (item: ArticleSummary) => {
  toggleItem(item.id)
}

const handleToggleSelect = (article: ArticleSummary) => {
  toggleItem(article.id)
}

const handleBatchOperation = async (operation: BatchOperation<ArticleSummary>) => {
  const selectedArticleList = getSelectedItems(filteredArticles.value, (article) => article.id)

  try {
    await executeBatchOperation(operation, selectedArticleList)
    // 操作成功后刷新数据
    await loadArticles()
    clearCache() // 清除缓存确保数据最新
  } catch (error) {
    console.error('批量操作失败:', error)
  }
}

// 标签管理
const toggleAllTags = () => {
  newArticle.value.tagIds = newArticle.value.tagIds.length === allTagIds.value.length
    ? []
    : [...allTagIds.value]
}

const toggleTag = (tagId: number) => {
  const index = newArticle.value.tagIds.indexOf(tagId)
  if (index === -1) {
    newArticle.value.tagIds.push(tagId)
  } else {
    newArticle.value.tagIds.splice(index, 1)
  }
}

const removeTag = (tagId: number) => {
  newArticle.value.tagIds = newArticle.value.tagIds.filter(id => id !== tagId)
}

const handleTagInputFocus = () => {
  showTagDropdown.value = true
}

const toggleTagDropdown = () => {
  showTagDropdown.value = !showTagDropdown.value
}

// 单个文章删除相关方法
const confirmDeleteSingle = (article: ArticleSummary) => {
  articleToDelete.value = article
  showSingleDeleteConfirm.value = true
}

const executeSingleDelete = async () => {
  if (!articleToDelete.value) return

  try {
    await deleteArticle(articleToDelete.value.id)
    // 如果该文章在选中列表中，也要移除
    deselectItem(articleToDelete.value.id)
  } catch (error) {
    console.error('删除文章失败:', error)
  } finally {
    showSingleDeleteConfirm.value = false
    articleToDelete.value = null
  }
}

// 提交表单
const submitForm = async () => {
  if (!newArticle.value.title.trim()) {
    alert('请输入文章标题')
    return
  }

  if (!newArticle.value.content.trim()) {
    alert('请输入文章内容')
    return
  }

  try {
    // 转换为ArticleSummary格式以供useAdminCrud使用
    const articleForCrud: Omit<ArticleSummary, 'id'> = {
      title: newArticle.value.title,
      summary: newArticle.value.summary || '',
      tagIds: newArticle.value.tagIds,
      createdAt: new Date().toISOString(),
      coverUrl: newArticle.value.coverUrl
    }
    await createArticle(articleForCrud)
    // 重置表单
    newArticle.value = { title: '', content: '', tagIds: [], coverUrl: '' }
    showCreateForm.value = false
    clearCache() // 清除缓存确保列表更新
  } catch (error) {
    console.error('创建文章失败:', error)
  }
}

// 统一的弹窗关闭函数
const closeModal = () => {
  showCreateForm.value = false
  showMarkdownHelp.value = false
  newArticle.value = { title: '', content: '', tagIds: [], coverUrl: '' }
  coverFile.value = null
  coverPreview.value = ''
  uploadError.value = ''
}

// 加载标签
const loadTags = async () => {
  try {
    const { status, data } = await api.getTags()
    if (status && data) {
      tags.value = data
    }
  } catch (error) {
    console.error('加载标签失败:', error)
  }
}

// 格式化日期
const formatDate = (date: Date) => {
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

// 生命周期
onMounted(() => {
  loadArticles()
  loadTags()
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- 页面头部 -->
    <header :class="[BASE_CLASSES.card, 'shadow-sm mb-4']">
      <div class="px-6 py-4">
        <div class="flex items-center justify-between">
          <div>
            <h1 :class="['text-xl font-bold', BASE_CLASSES.heading]">文章管理</h1>
            <div class="flex items-center gap-2 mt-1">
              <p :class="['text-sm', BASE_CLASSES.subtext]">管理网站文章内容</p>
              <span v-if="articles.length > 0" :class="['text-xs px-2 py-1 rounded-full', BASE_CLASSES.badge]">
                {{ filteredArticles.length }}/{{ articles.length }}
              </span>
            </div>
          </div>
          <button @click="showCreateForm = true"
            :class="['px-4 py-2 bg-green-500 text-white rounded-lg flex items-center gap-2', BASE_CLASSES.button]">
            <PlusIcon class="h-4 w-4" />
            新建文章
          </button>
        </div>
      </div>
    </header>

    <!-- 主内容区 -->
    <main class="px-6 pb-6">
      <!-- 搜索工具栏 -->
      <div :class="[BASE_CLASSES.card, 'mb-4 p-4']">
        <div class="flex items-center gap-4">
          <div class="flex-1 relative">
            <MagnifyingGlassIcon class="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input v-model="searchQuery" type="text" placeholder="搜索文章标题或标签..."
              :class="['w-full pl-10 pr-4 py-2 border rounded-lg', BASE_CLASSES.input]" />
            <button v-if="searchQuery" @click="searchQuery = ''"
              class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <XMarkIcon class="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <!-- v4.0 批量操作工具栏 -->
      <BatchOperationToolbar v-if="!isLoading && !isEmpty" :selected-count="selectedCount"
        :total-count="filteredArticles.length" :operations="batchOperations" :is-processing="isBatchProcessing"
        :progress="operationProgress" :operation-result="lastOperationResult" @execute-operation="handleBatchOperation"
        @select-all="handleSelectAll" @clear-selection="deselectAll" />

      <!-- 文章列表卡片 -->
      <div :class="[BASE_CLASSES.card, 'overflow-hidden']">
        <section aria-labelledby="articles-heading">
          <h2 id="articles-heading" class="sr-only">文章列表</h2>

          <!-- 加载状态 -->
          <div v-if="isLoading" class="p-6" role="status" aria-live="polite">
            <div class="space-y-4">
              <div v-for="i in 3" :key="i" class="animate-pulse">
                <div class="flex items-center space-x-4">
                  <div class="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div class="flex-1 space-y-2">
                    <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                    <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 空状态 -->
          <div v-else-if="isEmpty" class="flex flex-col items-center justify-center py-12">
            <DocumentTextIcon class="h-12 w-12 text-gray-300 dark:text-gray-600 mb-4" />
            <h3 class="text-base font-medium text-gray-900 dark:text-white mb-1">暂无文章</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 max-w-sm mb-4 text-center">
              您还没有创建任何文章。开始写作，分享您的想法和知识。
            </p>
            <button @click="showCreateForm = true"
              class="px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm rounded-lg transition-colors">
              创建第一篇文章
            </button>
          </div>

          <!-- 无搜索结果 -->
          <div v-else-if="noFilterResults" class="flex flex-col items-center justify-center py-12">
            <MagnifyingGlassIcon class="h-12 w-12 text-gray-300 dark:text-gray-600 mb-4" />
            <h3 class="text-base font-medium text-gray-900 dark:text-white mb-1">无搜索结果</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-4 text-center">
              没有找到包含 "{{ searchQuery }}" 的文章
            </p>
            <button @click="searchQuery = ''"
              class="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm rounded-lg transition-colors">
              清除搜索
            </button>
          </div>

          <!-- v4.0 虚拟滚动列表（大数据集） -->
          <VirtualList v-else-if="useVirtualList" :items="filteredArticles" :item-height="100" :container-height="600"
            :selectable="true" :multi-select="true" class="border-t border-gray-200 dark:border-gray-700"
            @select="handleVirtualListSelect">
            <template #default="{ item: article, isSelected: itemSelected }">
              <article
                class="p-6 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <div class="flex items-start space-x-4">
                  <!-- 选择复选框 -->
                  <div class="flex-shrink-0 pt-1">
                    <input type="checkbox" :checked="itemSelected" @change="handleToggleSelect(article)"
                      class="h-4 w-4 text-primary focus:ring-primary border-gray-300 dark:border-gray-600 rounded"
                      :aria-label="`选择文章 ${article.title}`" />
                  </div>

                  <!-- 文章内容 -->
                  <div class="flex-1 min-w-0">
                    <h3 class="text-lg font-medium text-gray-900 dark:text-white truncate">
                      {{ article.title }}
                    </h3>
                    <div class="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <time :datetime="article.createdAt">
                        {{ formatDate(new Date(article.createdAt)) }}
                      </time>
                      <span class="mx-2">·</span>
                      <span>{{ getTagNames(article.tagIds).length }} 个标签</span>
                    </div>
                    <div v-if="getTagNames(article.tagIds).length > 0" class="mt-3 flex flex-wrap gap-1">
                      <span v-for="tag in getTagNames(article.tagIds).slice(0, 3)" :key="tag"
                        class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                        {{ tag }}
                      </span>
                      <span v-if="getTagNames(article.tagIds).length > 3"
                        class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400">
                        +{{ getTagNames(article.tagIds).length - 3 }}
                      </span>
                    </div>
                  </div>

                  <!-- 操作按钮 -->
                  <div class="flex-shrink-0 flex items-center space-x-2">
                    <button @click="confirmDeleteSingle(article)"
                      class="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      title="删除文章">
                      <TrashIcon class="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </article>
            </template>
          </VirtualList>

          <!-- 常规表格视图（小数据集） -->
          <div v-else class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead class="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th scope="col" class="px-6 py-3 text-left">
                    <input type="checkbox" :checked="hasSelectedAll" @change="handleSelectAll"
                      class="h-4 w-4 text-primary focus:ring-primary border-gray-300 dark:border-gray-600 rounded" />
                  </th>
                  <th scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    标题
                  </th>
                  <th scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">
                    标签
                  </th>
                  <th scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden lg:table-cell">
                    发布时间
                  </th>
                  <th scope="col"
                    class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                <tr v-for="article in filteredArticles" :key="article.id"
                  class="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <input type="checkbox" :checked="isSelected(article.id)" @change="handleToggleSelect(article)"
                      class="h-4 w-4 text-primary focus:ring-primary border-gray-300 dark:border-gray-600 rounded" />
                  </td>
                  <td class="px-6 py-4">
                    <div class="text-sm font-medium text-gray-900 dark:text-white">
                      {{ article.title }}
                    </div>
                  </td>
                  <td class="px-6 py-4 hidden md:table-cell">
                    <div class="flex flex-wrap gap-1">
                      <span v-for="tag in getTagNames(article.tagIds).slice(0, 2)" :key="tag"
                        class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                        {{ tag }}
                      </span>
                      <span v-if="getTagNames(article.tagIds).length > 2"
                        class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400">
                        +{{ getTagNames(article.tagIds).length - 2 }}
                      </span>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 hidden lg:table-cell">
                    {{ formatDate(new Date(article.createdAt)) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button @click="confirmDeleteSingle(article)"
                      class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                      删除
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>

    <!-- 创建文章模态框 -->
    <AdminModal v-model="showCreateForm" title="创建新文章" width="xl" :loading="isLoading">
      <div class="space-y-6">
        <!-- 标题输入 -->
        <div>
          <label for="title" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            文章标题 <span class="text-red-500">*</span>
          </label>
          <input id="title" v-model="newArticle.title" type="text" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                   bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                   focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="请输入文章标题" />
        </div>

        <!-- 标签选择 -->
        <div>
          <label for="tags" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            文章标签
          </label>

          <!-- 已选标签显示 -->
          <div class="flex flex-wrap gap-2 mb-2">
            <span v-for="tag in selectedTags" :key="tag.id"
              class="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-sm rounded-lg">
              {{ tag.name }}
              <button @click="removeTag(tag.id)" class="hover:text-blue-600 dark:hover:text-blue-400">
                <XMarkIcon class="h-3 w-3" />
              </button>
            </span>
          </div>

          <!-- 标签选择下拉框 -->
          <div class="relative" ref="tagDropdownRef">
            <button @click="toggleTagDropdown" @focus="handleTagInputFocus" type="button" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                     bg-white dark:bg-gray-800 text-left
                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                     flex items-center justify-between">
              <span class="text-gray-500 dark:text-gray-400">
                {{ selectedTags.length > 0 ? `已选择 ${selectedTags.length} 个标签` : '点击选择标签' }}
              </span>
              <ChevronUpDownIcon class="h-4 w-4 text-gray-400" />
            </button>

            <!-- 下拉选项 -->
            <div v-if="showTagDropdown"
              class="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              <!-- 搜索框 -->
              <div class="p-2 border-b border-gray-200 dark:border-gray-700">
                <input v-model="tagSearch" type="text" placeholder="搜索标签..." class="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
              </div>

              <!-- 全选选项 -->
              <div class="p-2 border-b border-gray-200 dark:border-gray-700">
                <label
                  class="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                  <input type="checkbox" :checked="newArticle.tagIds.length === allTagIds.length"
                    @change="toggleAllTags"
                    class="h-4 w-4 text-blue-600 rounded border-gray-300 dark:border-gray-600" />
                  全选/取消全选
                </label>
              </div>

              <!-- 标签选项列表 -->
              <div class="max-h-40 overflow-y-auto">
                <label v-for="tag in filteredTags" :key="tag.id"
                  class="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                  <input type="checkbox" :checked="newArticle.tagIds.includes(tag.id)" @change="toggleTag(tag.id)"
                    class="h-4 w-4 text-blue-600 rounded border-gray-300 dark:border-gray-600" />
                  {{ tag.name }}
                  <CheckIcon v-if="newArticle.tagIds.includes(tag.id)" class="h-4 w-4 text-blue-600 ml-auto" />
                </label>
              </div>

              <!-- 无结果提示 -->
              <div v-if="filteredTags.length === 0" class="p-3 text-sm text-gray-500 dark:text-gray-400 text-center">
                没有找到匹配的标签
              </div>
            </div>
          </div>
        </div>

        <!-- 内容输入 -->
        <div>
          <div class="flex items-center justify-between mb-2">
            <label for="content" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              文章内容 <span class="text-red-500">*</span>
            </label>
            <button @click="showMarkdownHelp = true" type="button"
              class="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-500">
              Markdown 语法帮助
            </button>
          </div>
          <textarea id="content" v-model="newArticle.content" rows="15" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                   bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                   focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                   font-mono text-sm" placeholder="请输入文章内容，支持 Markdown 语法"></textarea>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end gap-3">
          <button @click="closeModal" type="button" class="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700
                   hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors">
            取消
          </button>
          <button @click="submitForm" type="button" :disabled="isLoading" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg
                   disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
            {{ isLoading ? '创建中...' : '创建文章' }}
          </button>
        </div>
      </template>
    </AdminModal>

    <!-- 删除确认对话框 -->
    <ConfirmDialog v-model:show="showSingleDeleteConfirm" title="确认删除文章"
      :content="`确定要删除文章 &quot;${articleToDelete?.title}&quot; 吗？此操作不可撤销。`" confirmText="删除" cancelText="取消"
      :danger="true" @confirm="executeSingleDelete" />

    <!-- Markdown 帮助模态框 -->
    <AdminModal v-model="showMarkdownHelp" title="Markdown 语法帮助" width="lg">
      <div class="prose prose-sm max-w-none dark:prose-invert">
        <h3>常用语法</h3>
        <ul>
          <li><strong>标题：</strong> # 一级标题，## 二级标题，### 三级标题</li>
          <li><strong>粗体：</strong> **粗体文字** 或 __粗体文字__</li>
          <li><strong>斜体：</strong> *斜体文字* 或 _斜体文字_</li>
          <li><strong>链接：</strong> [链接文字](链接地址)</li>
          <li><strong>图片：</strong> ![图片描述](图片地址)</li>
          <li><strong>代码：</strong> `行内代码` 或 ```代码块```</li>
          <li><strong>列表：</strong> - 无序列表 或 1. 有序列表</li>
          <li><strong>引用：</strong> > 引用内容</li>
        </ul>
      </div>
      <template #footer>
        <button @click="showMarkdownHelp = false" class="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300
                 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors">
          关闭
        </button>
      </template>
    </AdminModal>
  </div>
</template>
