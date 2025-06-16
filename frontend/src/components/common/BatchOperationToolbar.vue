<template>
  <!-- 批量操作工具栏 -->
  <div v-if="hasSelection || alwaysShow" class="batch-toolbar" :class="[
    'flex items-center justify-between gap-4 p-4 mb-4',
    'bg-primary/5 dark:bg-primary/10 border border-primary/20 rounded-lg',
    'transition-all duration-300',
    hasSelection ? 'opacity-100 scale-100' : 'opacity-60 scale-95'
  ]" role="toolbar" :aria-label="`批量操作工具栏，已选择 ${selectedCount} 个项目`">
    <!-- 左侧：选择信息 -->
    <div class="flex items-center gap-4">
      <!-- 选择计数 -->
      <div class="flex items-center gap-2">
        <div class="w-4 h-4 rounded border-2 border-primary bg-primary text-white flex items-center justify-center"
          :aria-label="`已选择 ${selectedCount} 个项目`">
          <CheckIcon class="w-3 h-3" />
        </div>
        <span class="text-sm font-medium text-gray-900 dark:text-white">
          已选择 <span class="text-primary font-bold">{{ selectedCount }}</span> 个项目
        </span>
      </div>

      <!-- 全选/取消全选 -->
      <button v-if="showSelectAll" @click="handleSelectAll"
        class="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
        :aria-label="isAllSelected ? '取消全选' : '全选'">
        {{ isAllSelected ? '取消全选' : `全选 (${totalCount})` }}
      </button>
    </div>

    <!-- 右侧：操作按钮 -->
    <div class="flex items-center gap-2">
      <!-- 操作按钮组 -->
      <div class="flex items-center gap-1" role="group" aria-label="批量操作">
        <button v-for="operation in availableOperations" :key="operation.id" @click="executeOperation(operation)"
          :disabled="isProcessing || (operation.disabled && operation.disabled(selectedItems))"
          class="batch-operation-btn" :class="[
            'inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg',
            'border transition-all duration-200',
            operation.isDestructive
              ? 'text-red-700 dark:text-red-400 border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20'
              : 'text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'focus:outline-none focus:ring-2 focus:ring-primary/50'
          ]" :aria-label="`${operation.label}选中的项目`">
          <component :is="getOperationIcon(operation.icon)" class="w-4 h-4" />
          {{ operation.label }}
        </button>
      </div>

      <!-- 更多操作下拉菜单 -->
      <div v-if="moreOperations.length > 0" class="relative" ref="dropdownRef">
        <button @click="showMoreMenu = !showMoreMenu" class="more-operations-btn" :class="[
          'inline-flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg',
          'text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700',
          'hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-primary/50'
        ]" :aria-expanded="showMoreMenu" aria-haspopup="true" aria-label="更多批量操作">
          <EllipsisHorizontalIcon class="w-4 h-4" />
          更多
          <ChevronDownIcon class="w-3 h-3" :class="{ 'rotate-180': showMoreMenu }" />
        </button>

        <!-- 下拉菜单 -->
        <Transition enter-active-class="transition ease-out duration-200"
          enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100"
          leave-active-class="transition ease-in duration-150" leave-from-class="transform opacity-100 scale-100"
          leave-to-class="transform opacity-0 scale-95">
          <div v-if="showMoreMenu" class="more-operations-menu" :class="[
            'absolute right-0 top-full mt-2 w-48',
            { 'z-[15]': true }, // Dropdown level
            'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700',
            'rounded-lg shadow-lg py-1'
          ]" role="menu" aria-label="更多批量操作菜单">
            <button v-for="operation in moreOperations" :key="operation.id" @click="executeOperation(operation)"
              :disabled="isProcessing || (operation.disabled && operation.disabled(selectedItems))"
              class="more-operation-item" :class="[
                'w-full flex items-center gap-3 px-4 py-2 text-sm text-left',
                'hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                operation.isDestructive
                  ? 'text-red-700 dark:text-red-400'
                  : 'text-gray-700 dark:text-gray-300'
              ]" role="menuitem">
              <component :is="getOperationIcon(operation.icon)" class="w-4 h-4" />
              {{ operation.label }}
            </button>
          </div>
        </Transition>
      </div>

      <!-- 清除选择 -->
      <button @click="$emit('clear-selection')" class="clear-selection-btn" :class="[
        'inline-flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg',
        'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300',
        'hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors',
        'focus:outline-none focus:ring-2 focus:ring-primary/50'
      ]" aria-label="清除选择">
        <XMarkIcon class="w-4 h-4" />
        清除
      </button>
    </div>
  </div>

  <!-- 批量操作进度对话框 -->
  <BaseModal :show="showProgressDialog" @CloseShow="() => { if (!isProcessing) showProgressDialog = false }">
    <div class="p-6 space-y-6">
      <!-- 对话框头部 -->
      <div class="flex items-center gap-3 mb-6">
        <div class="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
          <component :is="getOperationIcon(currentOperation?.icon)" class="w-4 h-4 text-primary" />
        </div>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
          {{ currentOperation?.label || '批量操作' }}
        </h3>
      </div>

      <!-- 进度信息 -->
      <div class="space-y-3">
        <div class="flex items-center justify-between text-sm">
          <span class="text-gray-600 dark:text-gray-400">
            {{ getStageText(progress.stage) }}
          </span>
          <span class="font-medium text-gray-900 dark:text-white">
            {{ progress.current }} / {{ progress.total }}
          </span>
        </div>

        <!-- 进度条 -->
        <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div class="bg-primary rounded-full h-2 transition-all duration-300"
            :style="{ width: progressPercentage + '%' }" :aria-label="`进度 ${progressPercentage}%`"></div>
        </div>

        <!-- 当前处理项目 -->
        <div v-if="progress.currentItem" class="text-sm text-gray-600 dark:text-gray-400">
          正在处理: <span class="font-medium">{{ progress.currentItem }}</span>
        </div>
      </div>

      <!-- 操作结果 -->
      <div v-if="operationResult" class="space-y-3">
        <!-- 成功统计 -->
        <div class="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <CheckCircleIcon class="w-5 h-5 text-green-600 dark:text-green-400" />
          <span class="text-green-800 dark:text-green-300">
            成功处理 {{ operationResult.successCount }} 个项目
          </span>
        </div>

        <!-- 错误统计 -->
        <div v-if="operationResult.errorCount > 0" class="space-y-2">
          <div class="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <ExclamationTriangleIcon class="w-5 h-5 text-red-600 dark:text-red-400" />
            <span class="text-red-800 dark:text-red-300">
              {{ operationResult.errorCount }} 个项目处理失败
            </span>
          </div>

          <!-- 错误详情（可展开） -->
          <details class="group">
            <summary
              class="cursor-pointer text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200">
              查看错误详情
            </summary>
            <div class="mt-2 max-h-32 overflow-y-auto">
              <div v-for="(error, index) in operationResult.errors" :key="index"
                class="text-xs text-red-600 dark:text-red-400 p-2 bg-red-50 dark:bg-red-900/10 rounded border-l-2 border-red-200 dark:border-red-800">
                <div class="font-medium">{{ getItemDisplayName(error.item) }}</div>
                <div class="text-red-500 dark:text-red-400">{{ error.error }}</div>
              </div>
            </div>
          </details>
        </div>

        <!-- 耗时信息 -->
        <div class="text-xs text-gray-500 dark:text-gray-400">
          耗时: {{ Math.round(operationResult.duration) }}ms
        </div>
      </div>

      <!-- 对话框底部按钮 -->
      <div class="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button v-if="!isProcessing" @click="showProgressDialog = false"
          class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
          关闭
        </button>
        <button v-if="isProcessing" @click="cancelCurrentOperation"
          class="px-4 py-2 text-sm font-medium text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
          取消操作
        </button>
      </div>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import {
  CheckIcon,
  XMarkIcon,
  EllipsisHorizontalIcon,
  ChevronDownIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  TrashIcon,
  ArrowDownTrayIcon,
  PencilIcon,
  DocumentDuplicateIcon,
  ArchiveBoxIcon
} from '@heroicons/vue/24/outline'
import BaseModal from '../composable/BaseModal.vue'
import type { BatchOperation, BatchOperationResult } from '@/composables/useBatchOperations'

// Props 定义
interface Props {
  selectedCount: number
  totalCount: number
  operations: BatchOperation[]
  isProcessing: boolean
  progress: {
    current: number
    total: number
    currentItem: string
    stage: string
  }
  operationResult?: BatchOperationResult | null
  alwaysShow?: boolean
  showSelectAll?: boolean
  maxVisibleOperations?: number
}

const props = withDefaults(defineProps<Props>(), {
  alwaysShow: false,
  showSelectAll: true,
  maxVisibleOperations: 3
})

// Emits 定义
const emit = defineEmits<{
  'execute-operation': [operation: BatchOperation]
  'select-all': []
  'clear-selection': []
  'cancel-operation': []
}>()

// 响应式状态
const showMoreMenu = ref(false)
const showProgressDialog = ref(false)
const currentOperation = ref<BatchOperation | null>(null)
const dropdownRef = ref<HTMLElement>()

// 计算属性
const hasSelection = computed(() => props.selectedCount > 0)
const isAllSelected = computed(() => props.selectedCount === props.totalCount)

const availableOperations = computed(() =>
  props.operations.slice(0, props.maxVisibleOperations)
)

const moreOperations = computed(() =>
  props.operations.slice(props.maxVisibleOperations)
)

const progressPercentage = computed(() => {
  if (props.progress.total === 0) return 0
  return Math.round((props.progress.current / props.progress.total) * 100)
})

const selectedItems = computed(() => {
  // 这里需要从父组件获取实际的选中项目
  return []
})

// 图标映射
const iconMap = {
  trash: TrashIcon,
  download: ArrowDownTrayIcon,
  edit: PencilIcon,
  copy: DocumentDuplicateIcon,
  archive: ArchiveBoxIcon
}

const getOperationIcon = (iconName?: string) => {
  return iconMap[iconName as keyof typeof iconMap] || PencilIcon
}

// 方法
const handleSelectAll = () => {
  emit('select-all')
}

const executeOperation = (operation: BatchOperation) => {
  currentOperation.value = operation
  showMoreMenu.value = false
  showProgressDialog.value = true
  emit('execute-operation', operation)
}

const cancelCurrentOperation = () => {
  emit('cancel-operation')
}

const getStageText = (stage: string): string => {
  const stageTexts = {
    preparing: '准备中...',
    processing: '处理中...',
    cleanup: '清理中...',
    completed: '已完成'
  }
  return stageTexts[stage as keyof typeof stageTexts] || '处理中...'
}

interface DisplayableItem {
  name?: string
  title?: string
  label?: string
  id?: string | number
}

const getItemDisplayName = (item: DisplayableItem): string => {
  return item?.name || item?.title || item?.label || item?.id?.toString() || '未知项目'
}

// 点击外部关闭下拉菜单
const handleClickOutside = (event: Event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    showMoreMenu.value = false
  }
}

// 监听器
watch(() => props.isProcessing, (isProcessing) => {
  if (!isProcessing && props.operationResult) {
    // 操作完成，保持对话框打开显示结果
    setTimeout(() => {
      if (!props.isProcessing) {
        // 如果没有错误，自动关闭对话框
        if (props.operationResult?.success) {
          setTimeout(() => {
            showProgressDialog.value = false
          }, 2000)
        }
      }
    }, 1000)
  }
})

// 生命周期
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.batch-toolbar {
  backdrop-filter: blur(8px);
}

.batch-operation-btn:focus,
.more-operations-btn:focus,
.clear-selection-btn:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(var(--primary), 0.5);
}

.more-operations-menu {
  backdrop-filter: blur(16px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05);
}

/* 动画优化 */
.batch-toolbar,
.batch-operation-btn,
.more-operations-btn,
.clear-selection-btn {
  will-change: transform, background-color, border-color;
}

/* 无障碍优化 */
@media (prefers-reduced-motion: reduce) {

  .batch-toolbar,
  .batch-operation-btn,
  .more-operations-btn,
  .clear-selection-btn,
  .more-operations-menu {
    transition: none !important;
  }
}

/* 高对比度模式 */
@media (prefers-contrast: high) {
  .batch-toolbar {
    border-width: 2px;
  }

  .batch-operation-btn,
  .more-operations-btn,
  .clear-selection-btn {
    border-width: 2px;
  }
}
</style>
