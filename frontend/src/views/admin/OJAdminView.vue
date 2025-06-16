<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAdminCrud } from '@/composables/useAdminCrud'
import { PlusIcon, DocumentArrowUpIcon, ArrowDownTrayIcon, TrashIcon, MagnifyingGlassIcon, DocumentTextIcon } from '@heroicons/vue/24/outline'
import { md } from '@/composables/useMarked'
import { api } from '@/api'
import type { OJProblem, OJTestCase, OJRequest, Result } from '@/types/api'
import AdminModal from '@/components/admin/AdminModal.vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import { OJ_ACTION_BUTTONS, OJ_MESSAGES } from '@/config/oj-admin'
import { FileHandler, TestCaseUtils, ZipExporter } from '@/utils/oj-admin'

// v4.0 新增导入
import VirtualList from '@/components/common/VirtualList.vue'
import BatchOperationToolbar from '@/components/common/BatchOperationToolbar.vue'
import { useSmartCache } from '@/composables/useSmartCache'
import { useBatchOperations } from '@/composables/useBatchOperations'
import { useDataExport, createCommonFields } from '@/composables/useDataExport'
import { BASE_CLASSES } from '@/config/admin'

// v4.0 智能缓存
const { fetchWithCache, clearCache } = useSmartCache({
  key: 'oj-problems-list',
  ttl: 300000, // 5分钟缓存
  enablePersist: true
})

// v4.0 数据导出
const { exportData, supportedFormats } = useDataExport<OJProblem>()

// v4.0 批量操作
const {
  selectedCount,
  hasSelection,
  isProcessing: isBatchProcessing,
  operationProgress,
  deselectItem,
  toggleItem,
  selectAll,
  deselectAll,
  isSelected,
  getSelectedItems,
  executeBatchOperation,
  createDeleteOperation,
  createExportOperation
} = useBatchOperations<OJProblem>()

// Main CRUD operations
const {
  items: ojProblems,
  isLoading,
  errorMessage,
  showForm: showProblemForm,
  handleCreate: createProblem,
  handleDelete: deleteProblem,
  loadItems: loadProblems
} = useAdminCrud<OJProblem>({
  fetch: async () => {
    const result = await fetchWithCache(async () => {
      const apiResult = await api.getOJProblems()
      return apiResult.status ? apiResult.data || [] : []
    })
    return result
  },
  create: async (problem) => {
    // 转换为 OJRequest 格式，只包含 API 期望的字段
    const ojRequest: OJRequest = {
      title: problem.title,
      description: problem.description,
      difficulty: problem.difficulty,
      timeLimit: problem.timeLimit,
      memoryLimit: problem.memoryLimit
    }
    const { status } = await api.postOJProblem(ojRequest)
    if (status) {
      clearCache() // 清除缓存
    }
    return status ? { id: Date.now(), ...problem } : Promise.reject('创建题目失败')
  },
  delete: async (id) => {
    const { status } = await api.deleteOJProblem(id)
    if (status) {
      clearCache() // 清除缓存
    }
    return status ? undefined : Promise.reject('删除题目失败')
  }
})

// State management
const showTestCaseForm = ref(false)
const showTestCaseView = ref(false)
const showContentPreview = ref(false)
const currentProblemId = ref<number | null>(null)
const previewContent = ref('')
const newProblem = ref<Omit<OJProblem, 'id'>>({
  title: '',
  description: '',
  difficulty: 'Easy',
  timeLimit: 1000,
  memoryLimit: 128,
  createdAt: '',
  updatedAt: ''
})
const testCases = ref<OJTestCase[]>([])
const existingTestCases = ref<OJTestCase[]>([])
const showConfirmDelete = ref(false)
const problemToDelete = ref<OJProblem | null>(null)

// v4.0 搜索功能
const searchQuery = ref('')

// v4.0 计算属性
const filteredProblems = computed(() => {
  if (!searchQuery.value) return ojProblems.value

  const query = searchQuery.value.toLowerCase()
  return ojProblems.value.filter(problem =>
    problem.title.toLowerCase().includes(query) ||
    problem.description.toLowerCase().includes(query)
  )
})

// v4.0 批量操作状态
const isEmpty = computed(() => ojProblems.value.length === 0)
const isFiltered = computed(() => searchQuery.value !== '')
const noFilterResults = computed(() => isFiltered.value && filteredProblems.value.length === 0)
const hasSelectedAll = computed(() => selectedCount.value === filteredProblems.value.length && filteredProblems.value.length > 0)

// v4.0 虚拟滚动配置
const useVirtualList = computed(() => filteredProblems.value.length > 50)

// v4.0 批量操作配置
const batchOperations = computed(() => [
  createDeleteOperation(
    async (items: OJProblem[]) => {
      for (const problem of items) {
        await api.deleteOJProblem(problem.id)
      }
      await loadProblems() // 刷新列表
      clearCache() // 清除缓存
    },
    {
      confirmationMessage: `确定要删除选中的 ${selectedCount.value} 道题目吗？此操作不可撤销。`
    }
  ),
  createExportOperation(
    async (items: OJProblem[]) => {
      const commonFields = createCommonFields()
      const problemFields = [
        commonFields.id,
        { key: 'title', label: '题目标题', type: 'string' as const },
        { key: 'description', label: '题目内容', type: 'string' as const, formatter: (description: string) => description.substring(0, 100) + '...' },
        { key: 'createdAt', label: '创建时间', type: 'date' as const },
        { key: 'updatedAt', label: '更新时间', type: 'date' as const }
      ]

      await exportData(items, {
        format: supportedFormats[0],
        fields: problemFields,
        filename: `oj_problems_export_${items.length}`,
        includeHeaders: true
      })
    },
    {
      label: '导出题目',
      successMessage: '题目导出成功'
    }
  )
])

// JSON computed property for test cases
const testCaseJson = computed({
  get: () => TestCaseUtils.toJSON(testCases.value),
  set: (value: string) => {
    testCases.value = TestCaseUtils.fromJSON(value)
  }
})

// File upload handler
const handleFileUpload = async (event: Event) => {
  const files = Array.from((event.target as HTMLInputElement).files || [])
  const result = await FileHandler.processUploadedFiles(files)

  if (result.error) {
    errorMessage.value = result.error
  } else {
    testCases.value = [...testCases.value, ...result.testCases]
  }
}

// Test case operations
const addTestCase = () => testCases.value.push(TestCaseUtils.createEmpty())
const removeTestCase = (index: number) => testCases.value.splice(index, 1)
const downloadTestCases = async () => {
  try {
    await ZipExporter.exportTestCases(testCases.value)
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : '导出失败'
  }
}
const createTestCases = async () => {
  errorMessage.value = ''

  if (!currentProblemId.value) {
    errorMessage.value = OJ_MESSAGES.error.selectProblem
    return
  }

  if (testCases.value.length === 0) {
    errorMessage.value = OJ_MESSAGES.error.noTestCases
    return
  }

  try {
    isLoading.value = true
    const result: Result = await api.postOJTestCase(testCases.value, currentProblemId.value)
    if (result.status) {
      showTestCaseForm.value = false
      testCases.value = []
      currentProblemId.value = null
    } else {
      errorMessage.value = '测试用例保存失败，请检查数据格式'
    }
  } catch {
    errorMessage.value = '请求异常，请稍后重试'
  } finally {
    isLoading.value = false
  }
}

// Content and modals
const showProblemContent = (description: string) => {
  previewContent.value = md.render(description)
  showContentPreview.value = true
}

const viewTestCases = async (problemId: number) => {
  try {
    isLoading.value = true
    const { status, data } = await api.getOJTestCases(problemId)
    if (status && data) {
      existingTestCases.value = data
      showTestCaseView.value = true
    }
  } finally {
    isLoading.value = false
  }
}

// Action handlers
const actions = {
  handleAddTestCase: (problem: OJProblem) => {
    currentProblemId.value = problem.id
    showTestCaseForm.value = true
  },

  handlePreview: (problem: OJProblem) => {
    showProblemContent(problem.description)
  },

  handleViewTestCases: (problem: OJProblem) => {
    viewTestCases(problem.id)
  },

  handleDelete: (problem: OJProblem, event?: Event) => {
    if (event) event.preventDefault()
    problemToDelete.value = problem
    showConfirmDelete.value = true
  }
}

// Action dispatcher
const handleAction = (actionType: string, problem: OJProblem, event?: Event) => {
  const handler = actions[actionType as keyof typeof actions]
  if (handler) handler(problem, event)
}

loadProblems()

// 确认删除操作

// v4.0 批量操作方法
const handleSelectAll = () => {
  if (selectedCount.value === filteredProblems.value.length) {
    deselectAll()
  } else {
    selectAll(filteredProblems.value, (problem) => problem.id)
  }
}

// v4.0 虚拟列表选择处理
const handleVirtualListSelect = (item: OJProblem) => {
  toggleItem(item.id)
}

// v4.0 单个删除处理
const executeSingleDelete = async () => {
  if (!problemToDelete.value) return

  try {
    await deleteProblem(problemToDelete.value.id)
    // 从批量选择中移除
    deselectItem(problemToDelete.value.id)
    clearCache() // 清除缓存
  } catch (error) {
    console.error('删除题目失败:', error)
  } finally {
    showConfirmDelete.value = false
    problemToDelete.value = null
  }
}
</script>

<template>
  <!-- v4.0 工具栏区域 -->
  <div class="space-y-4 mb-6">
    <!-- 统计和操作栏 -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4" role="toolbar"
      aria-label="OJ题目管理工具栏">
      <div class="flex items-center gap-4">
        <div class="text-sm text-gray-600 dark:text-gray-400" aria-live="polite" role="status">
          <span v-if="isFiltered && filteredProblems.length !== ojProblems.length">
            显示 {{ filteredProblems.length }} / {{ ojProblems.length }} 道题目
          </span>
          <span v-else>
            OJ题目管理 (共 {{ ojProblems.length }} 道题目)
          </span>
          <span v-if="hasSelection" :class="['text-xs px-2 py-1 rounded-full ml-2', BASE_CLASSES.badge]">
            已选择 {{ selectedCount }} 项
          </span>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <button @click="showProblemForm = true"
          class="w-full sm:w-auto px-3 py-1.5 bg-purple-500 text-white text-sm rounded-lg flex items-center justify-center hover:bg-purple-600 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          aria-label="新建OJ题目">
          <PlusIcon class="h-4 w-4 mr-1" aria-hidden="true" />
          新建题目
        </button>
      </div>
    </div>

    <!-- v4.0 搜索栏 -->
    <div class="relative">
      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <MagnifyingGlassIcon class="h-4 w-4 text-gray-400" aria-hidden="true" />
      </div>
      <input v-model="searchQuery" type="text" placeholder="搜索题目标题或内容..."
        :class="['w-full pl-10 pr-4 py-2 border rounded-lg', BASE_CLASSES.input]" aria-label="搜索OJ题目" />
    </div>

    <!-- v4.0 批量操作工具栏 -->
    <BatchOperationToolbar v-if="hasSelection" :selected-count="selectedCount" :total-count="filteredProblems.length"
      :operations="batchOperations" :is-processing="isBatchProcessing" :progress="operationProgress"
      @execute-operation="(operation) => executeBatchOperation(operation, getSelectedItems(filteredProblems, (p) => p.id))"
      @clear-selection="deselectAll" @select-all="handleSelectAll" />
  </div>

  <!-- v4.0 主要内容区域 -->
  <section class="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
    aria-labelledby="problems-table-title">
    <h2 id="problems-table-title" class="sr-only">OJ题目列表</h2>

    <!-- v4.0 空状态处理 -->
    <div v-if="isEmpty" class="p-12 text-center">
      <div class="flex flex-col items-center">
        <div class="w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mb-4">
          <DocumentTextIcon class="w-8 h-8 text-purple-600 dark:text-purple-400" />
        </div>
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">暂无OJ题目</h3>
        <p class="text-gray-500 dark:text-gray-400 mb-4">创建您的第一个编程题目开始管理</p>
        <button @click="showProblemForm = true"
          class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
          <PlusIcon class="w-4 h-4 mr-2 inline" />
          新建题目
        </button>
      </div>
    </div>

    <!-- v4.0 搜索无结果状态 -->
    <div v-else-if="noFilterResults" class="p-12 text-center">
      <div class="flex flex-col items-center">
        <div class="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
          <MagnifyingGlassIcon class="w-8 h-8 text-gray-400" />
        </div>
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">未找到匹配的题目</h3>
        <p class="text-gray-500 dark:text-gray-400 mb-4">尝试调整搜索条件或创建新的题目</p>
        <div class="flex gap-2">
          <button @click="searchQuery = ''"
            class="px-4 py-2 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            清除搜索
          </button>
          <button @click="showProblemForm = true"
            class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
            <PlusIcon class="w-4 h-4 mr-2 inline" />
            新建题目
          </button>
        </div>
      </div>
    </div>

    <!-- v4.0 虚拟滚动列表或普通列表 -->
    <div v-else-if="useVirtualList">
      <VirtualList :items="filteredProblems" :item-height="80" :container-height="600" :selectable="true"
        @select="handleVirtualListSelect" class="virtual-problems-list">
        <template #item="{ item: problem }">
          <div class="flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <!-- v4.0 批量选择复选框 -->
            <div class="flex-shrink-0">
              <input type="checkbox" :checked="isSelected(problem.id)" @change="toggleItem(problem.id)"
                class="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 dark:focus:ring-purple-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                :aria-label="`选择题目: ${problem.title}`" />
            </div>

            <!-- 题目信息 -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-3">
                <span
                  class="text-xs font-mono text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                  #{{ problem.id }}
                </span>
                <h3 class="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {{ problem.title }}
                </h3>
              </div>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                {{ problem.description.substring(0, 100) }}{{ problem.description.length > 100 ? '...' : '' }}
              </p>
            </div>

            <!-- 操作按钮 -->
            <div class="flex gap-1 flex-shrink-0">
              <button v-for="action in OJ_ACTION_BUTTONS" :key="action.type"
                @click="handleAction(action.handler, problem, $event)" :class="[
                  'p-2 rounded-lg hover:scale-105 active:scale-95 transition-all duration-200 transform-gpu focus:outline-none focus:ring-2 focus:ring-offset-2 shadow-sm',
                  action.bgColor,
                  action.textColor,
                  action.hoverBg
                ]" :title="action.title" :aria-label="`${action.title}: ${problem.title}`">
                <component :is="action.icon" class="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </template>
      </VirtualList>
    </div>

    <!-- v4.0 普通表格布局 -->
    <div v-else>
      <!-- 表格头部 -->
      <div class="bg-gray-50 dark:bg-gray-800/50 px-6 py-3 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <!-- 全选复选框 -->
            <input type="checkbox" :checked="hasSelectedAll" :indeterminate="hasSelection && !hasSelectedAll"
              @change="handleSelectAll"
              class="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 dark:focus:ring-purple-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              aria-label="全选题目" />
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
              {{ hasSelection ? `已选择 ${selectedCount} 项` : '选择题目' }}
            </span>
          </div>

          <div class="text-xs text-gray-500 dark:text-gray-400">
            共 {{ filteredProblems.length }} 道题目
          </div>
        </div>
      </div>

      <!-- 表格内容 -->
      <div class="divide-y divide-gray-200 dark:divide-gray-700">
        <div v-for="problem in filteredProblems" :key="problem.id"
          class="flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          :class="{ 'bg-purple-50 dark:bg-purple-900/10': isSelected(problem.id) }">
          <!-- 批量选择复选框 -->
          <div class="flex-shrink-0">
            <input type="checkbox" :checked="isSelected(problem.id)" @change="toggleItem(problem.id)"
              class="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 dark:focus:ring-purple-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              :aria-label="`选择题目: ${problem.title}`" />
          </div>

          <!-- 题目信息 -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-3 mb-1">
              <span
                class="text-xs font-mono text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                #{{ problem.id }}
              </span>
              <h3 class="text-sm font-medium text-gray-900 dark:text-white truncate">
                {{ problem.title }}
              </h3>
            </div>

            <!-- 移动端显示内容预览 -->
            <p class="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 md:hidden">
              {{ problem.description.substring(0, 80) }}{{ problem.description.length > 80 ? '...' : '' }}
            </p>

            <!-- 桌面端显示更多内容 -->
            <p class="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 hidden md:block">
              {{ problem.description.substring(0, 150) }}{{ problem.description.length > 150 ? '...' : '' }}
            </p>
          </div>

          <!-- 操作按钮 -->
          <div class="flex gap-1 flex-shrink-0">
            <button v-for="action in OJ_ACTION_BUTTONS" :key="action.type"
              @click="handleAction(action.handler, problem, $event)" :class="[
                'p-2 rounded-lg hover:scale-105 active:scale-95 transition-all duration-200 transform-gpu focus:outline-none focus:ring-2 focus:ring-offset-2 shadow-sm',
                action.bgColor,
                action.textColor,
                action.hoverBg
              ]" :title="action.title" :aria-label="`${action.title}: ${problem.title}`">
              <component :is="action.icon" class="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- 模态框 -->
  <AdminModal v-model="showProblemForm" title="新建题目" width="xl" :loading="isLoading">
    <div class="space-y-6">
      <div>
        <label class="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">标题</label>
        <input v-model="newProblem.title"
          class="block w-3/4 mx-auto text-sm px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-800 dark:text-white transition-colors"
          placeholder="请输入题目标题" />
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">难度级别</label>
          <select v-model="newProblem.difficulty"
            class="block w-full text-sm px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-800 dark:text-white transition-colors">
            <option value="Easy">简单</option>
            <option value="Medium">中等</option>
            <option value="Hard">困难</option>
          </select>
        </div>
        <div>
          <label class="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">时间限制 (ms)</label>
          <input v-model.number="newProblem.timeLimit" type="number" min="100" max="10000" step="100"
            class="block w-full text-sm px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-800 dark:text-white transition-colors"
            placeholder="1000" />
        </div>
        <div>
          <label class="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">内存限制 (MB)</label>
          <input v-model.number="newProblem.memoryLimit" type="number" min="16" max="512" step="16"
            class="block w-full text-sm px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-800 dark:text-white transition-colors"
            placeholder="128" />
        </div>
      </div>

      <div>
        <label class="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">题目内容 (支持Markdown)</label>
        <textarea v-model="newProblem.description"
          class="block w-3/4 mx-auto h-48 text-sm px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-800 dark:text-white transition-colors resize-none"
          placeholder="请输入题目内容，支持Markdown格式"></textarea>
      </div>
    </div>
    <template #footer>
      <div class="flex justify-end space-x-3">
        <button @click="showProblemForm = false"
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600 transition-colors">
          取消
        </button>
        <button @click="createProblem(newProblem)"
          class="px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-purple-600 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors">
          保存
        </button>
      </div>
    </template>
  </AdminModal>

  <!-- 题目内容预览弹窗 -->
  <AdminModal v-model="showContentPreview" title="题目内容预览" width="xl">
    <div class="prose prose-sm max-w-none dark:prose-invert">
      <div v-html="previewContent"></div>
    </div>
  </AdminModal>

  <!-- 查看测试用例弹窗 -->
  <AdminModal v-model="showTestCaseView" title="测试用例详情" width="xl">
    <div class="max-h-[60vh] overflow-y-auto pr-1 scrollbar scrollbar-w-1 scrollbar-thumb-rounded-full">
      <template v-if="existingTestCases.length">
        <div v-for="(testCase, index) in existingTestCases" :key="index"
          class="p-3 mb-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label class="block mb-1 text-xs font-medium text-gray-700 dark:text-gray-300">输入 #{{ index + 1 }}</label>
              <pre
                class="font-mono text-xs p-2 bg-white dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700 max-h-32 overflow-auto">{{ testCase.input }}</pre>
            </div>
            <div>
              <label class="block mb-1 text-xs font-medium text-gray-700 dark:text-gray-300">输出 #{{ index + 1 }}</label>
              <pre
                class="font-mono text-xs p-2 bg-white dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700 max-h-32 overflow-auto">{{ testCase.output }}</pre>
            </div>
          </div>
        </div>
      </template>
      <div v-else class="flex flex-col items-center justify-center p-8 text-gray-500 dark:text-gray-400">
        <p class="mb-2">暂无测试用例数据</p>
        <button @click="showTestCaseForm = true; currentProblemId = null"
          class="text-sm text-purple-600 dark:text-purple-400 hover:underline">
          添加测试用例
        </button>
      </div>
    </div>
    <template #footer>
      <button @click="downloadTestCases"
        class="px-3 py-1.5 bg-gray-500 text-white hover:bg-gray-600 text-sm rounded-lg">
        <ArrowDownTrayIcon class="h-4 w-4 mr-1 inline" />
        导出ZIP包
      </button>
    </template>
  </AdminModal>

  <AdminModal v-model="showTestCaseForm" title="添加测试用例" width="xl" :loading="isLoading">
    <div class="space-y-3">
      <!-- 操作按钮行 -->
      <div class="flex flex-col sm:flex-row gap-2">
        <div class="flex gap-2 flex-shrink-0">
          <button @click="addTestCase" class="px-2 py-1 bg-green-500 hover:bg-green-600 text-white text-xs rounded-lg">
            <PlusIcon class="h-3 w-3 mr-0.5 inline" />新增
          </button>
        </div>
        <!-- 文件上传区域 -->
        <div class="flex-grow">
          <input type="file" webkitdirectory multiple @change="handleFileUpload"
            class="w-full text-xs text-gray-500 dark:text-gray-400 file:mr-2 file:py-1 file:px-2 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-gray-50 file:text-gray-700 dark:file:bg-gray-700 dark:file:text-gray-200" />
        </div>
      </div>

      <div class="space-y-4 max-h-[50vh] overflow-y-auto pr-2">
        <div v-for="(testCase, index) in testCases" :key="index"
          class="group relative p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 transition-all duration-200">
          <button @click="removeTestCase(index)"
            class="absolute right-2 top-2 p-1 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            title="删除用例">
            <TrashIcon class="h-4 w-4" />
          </button>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div>
              <label class="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                输入 #{{ index + 1 }}
              </label>
              <textarea v-model="testCase.input"
                class="block w-full h-24 font-mono text-sm px-3 py-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors resize-none"
                placeholder="输入测试数据..."></textarea>
            </div>
            <div>
              <label class="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                输出 #{{ index + 1 }}
              </label>
              <textarea v-model="testCase.output"
                class="block w-full h-24 font-mono text-sm px-3 py-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors resize-none"
                placeholder="期望输出..." />
            </div>
          </div>
        </div>
        <div v-if="testCases.length === 0"
          class="flex flex-col items-center justify-center p-8 text-gray-500 dark:text-gray-400 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50/50 dark:bg-gray-800/50">
          <p class="mb-3 text-sm">请添加测试用例或上传文件</p>
          <button @click="addTestCase"
            class="text-sm text-purple-600 dark:text-purple-400 hover:underline focus:outline-none focus:ring-2 focus:ring-purple-500 rounded">
            点击添加第一个测试用例
          </button>
        </div>
      </div>

      <details
        class="cursor-pointer text-xs bg-gray-50 dark:bg-gray-800 rounded-lg p-2 border border-dashed border-gray-200 dark:border-gray-700">
        <summary class="font-medium text-gray-700 dark:text-gray-300">JSON 预览</summary>
        <pre class="mt-1 font-mono text-gray-600 dark:text-gray-300 overflow-auto max-h-24">{{ testCaseJson }}</pre>
      </details>
    </div>
    <template #footer>
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <p class="text-xs text-gray-500 dark:text-gray-400" v-if="currentProblemId">
          正在为题目 #{{ currentProblemId }} 添加测试用例
        </p>
        <button @click="createTestCases"
          class="w-full sm:w-auto px-3 py-1.5 bg-purple-500 hover:bg-purple-600 text-white text-sm rounded-lg flex items-center justify-center">
          <DocumentArrowUpIcon class="h-4 w-4 mr-1" />
          保存测试用例
        </button>
      </div>
    </template>
  </AdminModal>

  <!-- v4.0 删除确认对话框 -->
  <ConfirmDialog v-model:show="showConfirmDelete" title="删除题目"
    :content="`确定要删除题目 &quot;${problemToDelete?.title || ''}&quot; 吗？此操作不可恢复。`" confirmText="删除" cancelText="取消"
    :danger="true" @confirm="executeSingleDelete" />
</template>
