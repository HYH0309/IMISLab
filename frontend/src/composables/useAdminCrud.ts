import { ref } from 'vue'

interface CrudConfig<T extends { id: number }> {
  fetch: () => Promise<T[]>
  create: (item: Omit<T, 'id'>) => Promise<T>
  delete: (id: number) => Promise<void>
  update?: (id: number, item: Partial<T>) => Promise<T>
}

export function useAdminCrud<T extends { id: number }>(config: CrudConfig<T>) {
  const items = ref<T[]>([])
  const isLoading = ref(false)
  const errorMessage = ref('')
  const showForm = ref(false)
  const currentItem = ref<Partial<T>>({})

  const loadItems = async () => {
    try {
      isLoading.value = true
      items.value = await config.fetch()
    } catch (error) {
      errorMessage.value = error instanceof Error ? error.message : '加载失败'
    } finally {
      isLoading.value = false
    }
  }

  const handleCreate = async (item: Omit<T, 'id'>) => {
    try {
      isLoading.value = true
      await config.create(item)
      await loadItems()
      showForm.value = false
    } catch (error) {
      errorMessage.value = error instanceof Error ? error.message : '创建失败'
    } finally {
      isLoading.value = false
    }
  }

  const handleDelete = async (id: number) => {
    try {
      isLoading.value = true
      await config.delete(id)
      await loadItems()
    } catch (error) {
      errorMessage.value = error instanceof Error ? error.message : '删除失败'
    } finally {
      isLoading.value = false
    }
  }

  const handleUpdate = async (id: number, item: Partial<T>) => {
    if (!config.update) {
      errorMessage.value = '更新功能未配置'
      return
    }
    try {
      isLoading.value = true
      await config.update(id, item)
      await loadItems()
      showForm.value = false
    } catch (error) {
      errorMessage.value = error instanceof Error ? error.message : '更新失败'
    } finally {
      isLoading.value = false
    }
  }

  return {
    items,
    isLoading,
    errorMessage,
    showForm,
    currentItem,
    loadItems,
    handleCreate,
    handleDelete,
    handleUpdate,
  }
}
