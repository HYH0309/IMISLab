<script setup lang="ts">
import { ref, computed } from 'vue'
import { PlusIcon, TrashIcon, PencilSquareIcon, TagIcon, MagnifyingGlassIcon, XCircleIcon } from '@heroicons/vue/24/outline'
import { api } from '@/api'
import type { Tag } from '@/types/api'
import AdminModal from '@/components/admin/AdminModal.vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import BatchOperationToolbar from '@/components/common/BatchOperationToolbar.vue'
import { useAdminCrud } from '@/composables/useAdminCrud'
import { useBatchOperations } from '@/composables/useBatchOperations'
import { useSmartCache } from '@/composables/useSmartCache'
import { useDataExport, createCommonFields } from '@/composables/useDataExport'
import { BASE_CLASSES } from '@/config/admin'

// ===================== 使用组合式函数 =====================
// CRUD操作
const {
  items: tags,
  isLoading,
  showForm: showTagForm,
  currentItem: editingTag,
  loadItems: loadTags,
  handleCreate: createTag,
  handleUpdate: updateTag,
  handleDelete: deleteTag
} = useAdminCrud<Tag>({
  fetch: async () => {
    const { status, data } = await api.getTags()
    return status ? data || [] : []
  },
  create: async (tag) => {
    const { status } = await api.createTag(tag.name)
    return status ? { id: Date.now(), ...tag } : Promise.reject('创建标签失败')
  },
  delete: async (id) => {
    const { status } = await api.deleteTag(id)
    return status ? undefined : Promise.reject('删除标签失败')
  },
  update: async (id, tag) => {
    if (!tag.name) return Promise.reject('标签名称不能为空')
    const { status } = await api.updateTag(id, { name: tag.name })
    return status ? { id, name: tag.name } : Promise.reject('更新标签失败')
  }
})

// 智能缓存
const { clearCache } = useSmartCache({
  key: 'tag-list',
  ttl: 300000, // 5分钟缓存
  enablePersist: true
})

// 数据导出
const { exportData, supportedFormats } = useDataExport<Tag>()

// 批量操作
const {
  selectedCount,
  isProcessing: isBatchProcessing,
  operationProgress,
  lastOperationResult,
  toggleItem,
  selectAll,
  deselectAll,
  isSelected,
  getSelectedItems,
  executeBatchOperation,
  createDeleteOperation,
  createExportOperation
} = useBatchOperations<Tag>()

// ===================== 状态管理 =====================
const searchQuery = ref('')
const showConfirmDelete = ref(false)
const tagToDelete = ref<Tag | null>(null)
const newTag = ref<Omit<Tag, 'id'>>({ name: '' })
const validationError = ref('')

// ===================== 计算属性 =====================
const filteredTags = computed(() => {
  if (!searchQuery.value) return tags.value
  return tags.value.filter(tag =>
    tag.name.toLowerCase().includes(searchQuery.value.toLowerCase()))
})

const isEmpty = computed(() => tags.value.length === 0)
const isFiltered = computed(() => searchQuery.value !== '')
const noFilterResults = computed(() => isFiltered.value && filteredTags.value.length === 0)

// 批量操作列表
const batchOperations = computed(() => [
  createDeleteOperation(
    async (items: Tag[]) => {
      for (const tag of items) {
        await api.deleteTag(tag.id)
      }
      await loadTags() // 刷新列表
    },
    {
      confirmationMessage: `确定要删除选中的 ${selectedCount.value} 个标签吗？此操作不可撤销。`
    }
  ),
  createExportOperation(
    async (items: Tag[]) => {
      const commonFields = createCommonFields()
      const tagFields = [
        commonFields.id,
        commonFields.name,
        {
          key: 'article_count',
          label: '关联文章数',
          type: 'number' as const,
          formatter: () => '0' // 这里可以根据实际数据计算
        },
        {
          key: 'created_date',
          label: '创建日期',
          type: 'date' as const,
          formatter: () => new Date().toISOString()
        }
      ]

      await exportData(items, {
        format: supportedFormats[0], // JSON格式
        fields: tagFields,
        filename: `tags_export_${items.length}`,
        includeHeaders: true
      })
    }
  ),
  {
    id: 'merge',
    label: '合并标签',
    icon: 'copy',
    action: async (items: Tag[]) => {
      // 这里可以实现标签合并逻辑
      console.log('合并标签:', items)
    },
    requiresConfirmation: true,
    confirmationMessage: `确定要合并选中的 ${selectedCount.value} 个标签吗？`,
    disabled: (items: Tag[]) => items.length < 2,
    successMessage: '标签合并成功',
    category: '高级操作'
  }
])

// 虚拟列表配置

// ===================== 方法 =====================
// 批量操作相关
const handleSelectAll = () => {
  if (selectedCount.value === filteredTags.value.length) {
    deselectAll()
  } else {
    selectAll(filteredTags.value, (tag) => tag.id)
  }
}

const handleToggleSelect = (tag: Tag) => {
  toggleItem(tag.id)
}

const handleBatchOperation = async (operation: import('@/composables/useBatchOperations').BatchOperation<Tag>) => {
  const selectedTags = getSelectedItems(filteredTags.value, (tag) => tag.id)

  try {
    await executeBatchOperation(operation, selectedTags)
    // 操作成功后刷新数据
    await loadTags()
    clearCache() // 清除缓存确保数据最新
  } catch (error) {
    console.error('批量操作失败:', error)
  }
}

// 提交表单
const submitTag = async () => {
  validationError.value = ''

  if (!newTag.value.name.trim()) {
    validationError.value = '请输入标签名称'
    return
  }

  // 检查标签名称是否重复
  if (!editingTag.value && tags.value.some(t => t.name.toLowerCase() === newTag.value.name.toLowerCase())) {
    validationError.value = '标签名称已存在'
    return
  }

  try {
    if (editingTag.value && editingTag.value.id) {
      await updateTag(editingTag.value.id, newTag.value)
    } else {
      await createTag(newTag.value)
    }
    showTagForm.value = false
    resetForm()
  } catch (error) {
    console.error('操作标签失败:', error)
  }
}

// 确认删除
const confirmDelete = async () => {
  if (tagToDelete.value) {
    try {
      await deleteTag(tagToDelete.value.id)
      showConfirmDelete.value = false
      tagToDelete.value = null
    } catch (error) {
      console.error('删除标签失败:', error)
    }
  }
}

// 编辑标签
const editTag = (tag: Tag) => {
  editingTag.value = tag
  newTag.value = { name: tag.name }
  showTagForm.value = true
}

// 准备删除
const prepareDelete = (tag: Tag) => {
  tagToDelete.value = tag
  showConfirmDelete.value = true
}

// 重置表单
const resetForm = () => {
  newTag.value = { name: '' }
  validationError.value = ''
}

// 清除搜索
const clearSearch = () => {
  searchQuery.value = ''
}

loadTags()
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- 页面头部 -->
    <header :class="[BASE_CLASSES.card, 'shadow-sm mb-4']" role="banner">
      <div class="px-6 py-4">
        <div class="flex items-center justify-between">
          <div>
            <h1 :class="['text-xl font-bold', BASE_CLASSES.heading]" id="page-title">标签管理</h1>
            <p :class="['mt-1 text-sm', BASE_CLASSES.subtext]" aria-describedby="page-title">
              管理文章分类和标签，当前共 {{ filteredTags.length }} 个标签
            </p>
          </div>
          <button @click="showTagForm = true"
            :class="['flex items-center px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2', BASE_CLASSES.button]"
            aria-label="新建标签">
            <PlusIcon class="h-5 w-5 mr-2" aria-hidden="true" />
            新建标签
          </button>
        </div>
      </div>
    </header>

    <!-- 主内容区 -->
    <main class="px-6 pb-6">
      <!-- 搜索工具栏 -->
      <div :class="[BASE_CLASSES.card, 'mb-4 p-4']" role="toolbar" aria-label="标签管理工具栏">
        <div class="flex items-center justify-between gap-4">
          <div class="relative flex-grow max-w-md">
            <label for="tag-search" class="sr-only">搜索标签</label>
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input type="text" id="tag-search" v-model="searchQuery"
              class="pl-10 pr-10 py-2 w-full border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors"
              placeholder="搜索标签..." :aria-label="`搜索标签，当前显示${filteredTags.length}个标签`" aria-describedby="search-help" />
            <span id="search-help" class="sr-only">输入关键词搜索标签，支持模糊匹配</span>
            <button v-if="searchQuery" @click="clearSearch"
              class="absolute inset-y-0 right-0 pr-3 flex items-center focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-r-lg"
              aria-label="清除搜索条件">
              <XCircleIcon class="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                aria-hidden="true" />
            </button>
          </div>

          <!-- 统计信息 -->
          <div class="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <TagIcon class="h-4 w-4 mr-1" aria-hidden="true" />
            <span>{{ isFiltered ? `搜索结果: ${filteredTags.length}` : `总计: ${tags.length}` }}</span>
          </div>
        </div>
      </div>

      <!-- 批量操作工具栏 -->
      <BatchOperationToolbar v-if="!isLoading && !isEmpty" :selected-count="selectedCount"
        :total-count="filteredTags.length" :operations="batchOperations" :is-processing="isBatchProcessing"
        :progress="operationProgress" :operation-result="lastOperationResult" class="mb-4"
        @execute-operation="handleBatchOperation" @select-all="handleSelectAll" @clear-selection="deselectAll" />

      <!-- 标签列表卡片 -->
      <div :class="[BASE_CLASSES.card, 'overflow-hidden']">
        <section aria-labelledby="tags-heading">
          <h2 id="tags-heading" class="sr-only">标签列表</h2>

          <!-- 加载状态 -->
          <div v-if="isLoading" class="p-6" role="status" aria-live="polite" aria-label="正在加载标签数据">
            <div class="space-y-4">
              <div v-for="i in 3" :key="i" class="h-12 bg-gray-100 dark:bg-gray-700 animate-pulse rounded"
                aria-hidden="true"></div>
            </div>
            <span class="sr-only">正在加载标签数据，请稍候</span>
          </div>

          <!-- 空状态 -->
          <div v-else-if="isEmpty" class="p-12 flex flex-col items-center justify-center text-center" role="status">
            <TagIcon class="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" aria-hidden="true" />
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">暂无标签数据</h3>
            <p class="text-gray-500 dark:text-gray-400 mb-6 max-w-sm">
              您还没有创建任何标签。标签用于对文章进行分类，便于内容组织和查找。
            </p>
            <button @click="showTagForm = true"
              :class="['flex items-center px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2', BASE_CLASSES.button]"
              aria-label="创建第一个标签">
              <PlusIcon class="h-5 w-5 mr-2" aria-hidden="true" />
              添加第一个标签
            </button>
          </div>

          <!-- 无搜索结果 -->
          <div v-else-if="noFilterResults" class="p-12 flex flex-col items-center justify-center text-center"
            role="status">
            <MagnifyingGlassIcon class="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" aria-hidden="true" />
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">未找到相关标签</h3>
            <p class="text-gray-500 dark:text-gray-400 mb-6">
              没有找到包含 "{{ searchQuery }}" 的标签，请尝试其他关键词。
            </p>
            <button @click="clearSearch"
              class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded transition-colors"
              aria-label="清除搜索条件并显示所有标签">
              清除搜索条件
            </button>
          </div>

          <!-- 标签列表内容 -->
          <div v-else class="divide-y divide-gray-200 dark:divide-gray-700" role="list"
            :aria-label="`共${filteredTags.length}个标签`">
            <div v-for="tag in filteredTags" :key="tag.id"
              class="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              :class="{ 'bg-blue-50 dark:bg-blue-900/20': isSelected(tag.id) }" role="listitem">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <!-- 批量选择复选框 -->
                  <div class="flex-shrink-0">
                    <input :id="`tag-${tag.id}`" type="checkbox" :checked="isSelected(tag.id)"
                      @change="handleToggleSelect(tag)"
                      class="h-4 w-4 text-primary focus:ring-primary border-gray-300 dark:border-gray-600 rounded"
                      :aria-label="`选择标签 ${tag.name}`" />
                  </div>

                  <div class="flex-shrink-0">
                    <div class="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center"
                      aria-hidden="true">
                      <TagIcon class="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                  </div>
                  <div>
                    <h3 class="text-sm font-medium text-gray-900 dark:text-white">{{ tag.name }}</h3>
                    <p class="text-xs text-gray-500 dark:text-gray-400">ID: {{ tag.id }}</p>
                  </div>
                </div>
                <div class="flex space-x-2" role="group" :aria-label="`${tag.name}标签操作`">
                  <button @click="editTag(tag)"
                    :class="['p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-800/40 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500', BASE_CLASSES.button]"
                    :aria-label="`编辑标签${tag.name}`">
                    <PencilSquareIcon class="h-5 w-5" aria-hidden="true" />
                  </button>
                  <button @click="prepareDelete(tag)"
                    :class="['p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-800/40 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500', BASE_CLASSES.button]"
                    :aria-label="`删除标签${tag.name}`">
                    <TrashIcon class="h-5 w-5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  </div>

  <!-- 标签表单模态框 -->
  <AdminModal v-model="showTagForm" :title="editingTag ? `编辑标签 '${editingTag.name}'` : '新建标签'" width="md"
    :loading="isLoading" role="dialog" aria-labelledby="modal-title" aria-describedby="modal-description">
    <div class="space-y-6">
      <div>
        <label for="tag-name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          标签名称
          <span class="text-red-500" aria-label="必填项">*</span>
        </label>
        <input id="tag-name" v-model="newTag.name"
          class="block w-auto mx-auto rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 dark:bg-gray-800 dark:border-gray-600 dark:text-white transition-colors"
          placeholder="输入标签名称" :class="{ 'border-red-500 focus:border-red-500 focus:ring-red-500': validationError }"
          :aria-invalid="!!validationError" :aria-describedby="validationError ? 'tag-name-error' : 'tag-name-help'"
          required />
        <p id="tag-name-help" class="mt-2 text-xs text-gray-500 dark:text-gray-400">
          标签名称用于分类文章，建议使用简洁明了的词汇
        </p>
        <p v-if="validationError" id="tag-name-error" class="mt-2 text-sm text-red-600 dark:text-red-400" role="alert">
          {{ validationError }}
        </p>
      </div>
    </div>
    <template #footer>
      <div class="flex justify-end space-x-3">
        <button @click="showTagForm = false"
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600 transition-colors"
          aria-label="取消编辑并关闭对话框">
          取消
        </button>
        <button @click="submitTag"
          class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          :aria-label="editingTag ? '保存标签修改' : '创建新标签'">
          {{ editingTag ? '更新' : '保存' }}
        </button>
      </div>
    </template>
  </AdminModal>

  <!-- 删除确认对话框 -->
  <ConfirmDialog v-model:show="showConfirmDelete" title="删除标签"
    :content="`确定要删除标签 '${tagToDelete?.name || ''}' 吗？此操作不可恢复。`" confirmText="删除" cancelText="取消" :danger="true"
    @confirm="confirmDelete" />
</template>
