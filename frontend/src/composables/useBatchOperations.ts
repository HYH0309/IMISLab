import { ref, computed, nextTick } from 'vue'

export interface BatchOperation<T = any> {
  id: string
  label: string
  icon?: string
  action: (items: T[]) => Promise<void>
  requiresConfirmation?: boolean
  confirmationMessage?: string
  isDestructive?: boolean
  disabled?: (items: T[]) => boolean
  successMessage?: string
  errorMessage?: string
}

export interface BatchOperationResult {
  success: boolean
  successCount: number
  errorCount: number
  errors: Array<{ item: any; error: string }>
  duration: number
}

/**
 * 批量操作组合式函数
 */
export function useBatchOperations<T = any>() {
  // 状态管理
  const selectedItems = ref<Set<string | number>>(new Set())
  const isProcessing = ref(false)
  const lastOperationResult = ref<BatchOperationResult | null>(null)
  const showConfirmDialog = ref(false)
  const pendingOperation = ref<{
    operation: BatchOperation<T>
    items: T[]
  } | null>(null)

  // 进度追踪
  const operationProgress = ref({
    current: 0,
    total: 0,
    currentItem: '',
    stage: '' as 'preparing' | 'processing' | 'cleanup' | 'completed',
  })

  // 计算属性
  const selectedCount = computed(() => selectedItems.value.size)
  const hasSelection = computed(() => selectedCount.value > 0)
  const isOperationInProgress = computed(() => isProcessing.value)

  // 选择管理
  const selectItem = (id: string | number) => {
    selectedItems.value.add(id)
  }

  const deselectItem = (id: string | number) => {
    selectedItems.value.delete(id)
  }

  const toggleItem = (id: string | number) => {
    if (selectedItems.value.has(id)) {
      deselectItem(id)
    } else {
      selectItem(id)
    }
  }

  const selectAll = (items: T[], getItemId: (item: T) => string | number) => {
    items.forEach((item) => {
      selectedItems.value.add(getItemId(item))
    })
  }

  const deselectAll = () => {
    selectedItems.value.clear()
  }

  const selectRange = (
    items: T[],
    getItemId: (item: T) => string | number,
    startIndex: number,
    endIndex: number,
  ) => {
    const start = Math.min(startIndex, endIndex)
    const end = Math.max(startIndex, endIndex)

    for (let i = start; i <= end && i < items.length; i++) {
      selectedItems.value.add(getItemId(items[i]))
    }
  }

  const isSelected = (id: string | number) => {
    return selectedItems.value.has(id)
  }

  const getSelectedItems = <TItem = T>(
    items: TItem[],
    getItemId: (item: TItem) => string | number,
  ): TItem[] => {
    return items.filter((item) => selectedItems.value.has(getItemId(item)))
  }

  // 批量操作执行
  const executeBatchOperation = async (
    operation: BatchOperation<T>,
    items: T[],
    options: {
      skipConfirmation?: boolean
      onProgress?: (progress: { current: number; total: number; item: any }) => void
    } = {},
  ): Promise<BatchOperationResult> => {
    const startTime = performance.now()

    try {
      // 检查是否需要确认
      if (!options.skipConfirmation && operation.requiresConfirmation) {
        return await requestConfirmation(operation, items)
      }

      // 检查操作是否可执行
      if (operation.disabled && operation.disabled(items)) {
        throw new Error('当前操作不可执行')
      }

      isProcessing.value = true
      operationProgress.value = {
        current: 0,
        total: items.length,
        currentItem: '',
        stage: 'preparing',
      }

      let successCount = 0
      let errorCount = 0
      const errors: Array<{ item: T; error: string }> = []

      // 批量处理
      if (operation.id === 'bulk-action') {
        // 整体批量操作
        operationProgress.value.stage = 'processing'
        try {
          await operation.action(items)
          successCount = items.length
        } catch (error) {
          errorCount = items.length
          errors.push(
            ...items.map((item) => ({
              item,
              error: error instanceof Error ? error.message : '操作失败',
            })),
          )
        }
      } else {
        // 逐项处理
        operationProgress.value.stage = 'processing'

        for (let i = 0; i < items.length; i++) {
          const item = items[i]
          operationProgress.value.current = i + 1
          operationProgress.value.currentItem = getItemDisplayName(item)

          try {
            await operation.action([item])
            successCount++
          } catch (error) {
            errorCount++
            errors.push({
              item,
              error: error instanceof Error ? error.message : '操作失败',
            })
          }

          // 进度回调
          options.onProgress?.({
            current: i + 1,
            total: items.length,
            item,
          })

          // 让出执行权，保持UI响应
          if (i % 10 === 0) {
            await nextTick()
          }
        }
      }

      operationProgress.value.stage = 'cleanup'

      // 清理选择状态
      if (successCount > 0) {
        const successfulItems = items.filter(
          (_, index) => !errors.some((error) => error.item === items[index]),
        )

        successfulItems.forEach((item) => {
          const itemId = getItemDisplayId(item)
          if (itemId !== undefined) {
            selectedItems.value.delete(itemId)
          }
        })
      }

      const result: BatchOperationResult = {
        success: errorCount === 0,
        successCount,
        errorCount,
        errors,
        duration: performance.now() - startTime,
      }

      operationProgress.value.stage = 'completed'
      lastOperationResult.value = result

      return result
    } finally {
      isProcessing.value = false
      operationProgress.value.current = 0
      operationProgress.value.total = 0
    }
  }

  // 请求用户确认
  const requestConfirmation = async (
    operation: BatchOperation<T>,
    items: T[],
  ): Promise<BatchOperationResult> => {
    return new Promise((resolve) => {
      pendingOperation.value = { operation, items }
      showConfirmDialog.value = true

      // 这里需要与UI组件配合，实际确认逻辑在组件中处理
      const checkConfirmation = () => {
        if (!showConfirmDialog.value && pendingOperation.value) {
          // 确认对话框已关闭，执行操作
          const pending = pendingOperation.value
          pendingOperation.value = null

          executeBatchOperation(pending.operation, pending.items as T[], {
            skipConfirmation: true,
          }).then(resolve)
        } else if (!showConfirmDialog.value) {
          // 取消操作
          resolve({
            success: false,
            successCount: 0,
            errorCount: 0,
            errors: [],
            duration: 0,
          })
        } else {
          // 继续等待
          setTimeout(checkConfirmation, 100)
        }
      }

      checkConfirmation()
    })
  }

  // 确认对话框操作
  const confirmOperation = async () => {
    if (!pendingOperation.value) return

    showConfirmDialog.value = false
    // 实际执行将在requestConfirmation的检查循环中处理
  }

  const cancelOperation = () => {
    showConfirmDialog.value = false
    pendingOperation.value = null
  }

  // 常用批量操作工厂函数
  const createDeleteOperation = (
    deleteAction: (items: T[]) => Promise<void>,
    options: Partial<BatchOperation<T>> = {},
  ): BatchOperation<T> => ({
    id: 'delete',
    label: '删除',
    icon: 'trash',
    action: deleteAction,
    requiresConfirmation: true,
    confirmationMessage: `确定要删除选中的 ${selectedCount.value} 个项目吗？此操作不可撤销。`,
    isDestructive: true,
    successMessage: '删除成功',
    errorMessage: '删除失败',
    ...options,
  })

  const createExportOperation = (
    exportAction: (items: T[]) => Promise<void>,
    options: Partial<BatchOperation<T>> = {},
  ): BatchOperation<T> => ({
    id: 'export',
    label: '导出',
    icon: 'download',
    action: exportAction,
    requiresConfirmation: false,
    successMessage: '导出成功',
    errorMessage: '导出失败',
    ...options,
  })

  const createUpdateOperation = (
    updateAction: (items: T[]) => Promise<void>,
    label: string,
    options: Partial<BatchOperation<T>> = {},
  ): BatchOperation<T> => ({
    id: 'update',
    label,
    icon: 'edit',
    action: updateAction,
    requiresConfirmation: true,
    confirmationMessage: `确定要${label}选中的 ${selectedCount.value} 个项目吗？`,
    successMessage: `${label}成功`,
    errorMessage: `${label}失败`,
    ...options,
  })

  // 工具函数
  const getItemDisplayName = (item: T): string => {
    if (typeof item === 'object' && item !== null) {
      return (
        (item as any).name ||
        (item as any).title ||
        (item as any).label ||
        (item as any).id?.toString() ||
        '未知项目'
      )
    }
    return String(item)
  }

  const getItemDisplayId = (item: T): string | number | undefined => {
    if (typeof item === 'object' && item !== null) {
      return (item as any).id
    }
    return undefined
  }

  // 性能统计
  const getOperationStats = () => {
    return {
      selectedCount: selectedCount.value,
      isProcessing: isProcessing.value,
      lastResult: lastOperationResult.value,
      progress: operationProgress.value,
    }
  }

  // 重置状态
  const reset = () => {
    selectedItems.value.clear()
    isProcessing.value = false
    lastOperationResult.value = null
    showConfirmDialog.value = false
    pendingOperation.value = null
    operationProgress.value = {
      current: 0,
      total: 0,
      currentItem: '',
      stage: 'completed',
    }
  }

  return {
    // 状态
    selectedItems: computed(() => selectedItems.value),
    selectedCount,
    hasSelection,
    isProcessing: isOperationInProgress,
    operationProgress: computed(() => operationProgress.value),
    lastOperationResult: computed(() => lastOperationResult.value),
    showConfirmDialog: computed(() => showConfirmDialog.value),
    pendingOperation: computed(() => pendingOperation.value),

    // 选择管理
    selectItem,
    deselectItem,
    toggleItem,
    selectAll,
    deselectAll,
    selectRange,
    isSelected,
    getSelectedItems,

    // 批量操作
    executeBatchOperation,
    confirmOperation,
    cancelOperation,

    // 操作工厂
    createDeleteOperation,
    createExportOperation,
    createUpdateOperation,

    // 工具方法
    getOperationStats,
    reset,
  }
}

/**
 * 批量操作进度组件的Props类型
 */
export interface BatchProgressProps {
  show: boolean
  progress: {
    current: number
    total: number
    currentItem: string
    stage: string
  }
  operation?: {
    label: string
    icon?: string
  }
}
