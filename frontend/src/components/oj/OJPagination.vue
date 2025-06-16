<script setup lang="ts">
import { toRefs } from 'vue'

const props = defineProps<{
  currentPage: number
  totalPages: number
  pageSize: number
}>()

const emit = defineEmits(['update:currentPage', 'update:pageSize'])

const pageSizes = [10, 20, 50, 100]

const { totalPages: totalPagesRef } = toRefs(props)

function goToPage(page: number) {
  if (page >= 1 && page <= totalPagesRef.value) {
    emit('update:currentPage', page)
  }
}
</script>

<template>
  <div class="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
    <div class="flex items-center gap-2">
      <span class="text-sm text-gray-500">每页显示</span>
      <select :value="pageSize" @change="emit('update:pageSize', parseInt(($event.target as HTMLSelectElement).value))"
        class="p-1 border rounded bg-white dark:bg-gray-700">
        <option v-for="size in pageSizes" :key="size" :value="size">
          {{ size }}
        </option>
      </select>
    </div>

    <div class="flex items-center gap-1">
      <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1" class="p-2 rounded disabled:opacity-50">
      </button>

      <template v-for="page in totalPagesRef" :key="page">
        <button @click="goToPage(page)" :class="{
          'bg-blue-500 text-white': page === currentPage,
          'hover:bg-gray-100 dark:hover:bg-gray-700': page !== currentPage
        }" class="w-8 h-8 rounded">
          {{ page }}
        </button>
      </template>

      <button @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPagesRef"
        class="p-2 rounded disabled:opacity-50">
        >
      </button>
    </div>
  </div>
</template>
