<script setup lang="ts">

import { ExclamationTriangleIcon } from '@heroicons/vue/24/outline'
import { BASE_CLASSES } from '@/config/admin'

defineProps({
  show: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: '确认操作'
  },
  content: {
    type: String,
    default: '确定要执行此操作吗？'
  },
  confirmText: {
    type: String,
    default: '确认'
  },
  cancelText: {
    type: String,
    default: '取消'
  },
  danger: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['update:show', 'confirm', 'cancel'])

const close = () => {
  emit('update:show', false)
  emit('cancel')
}

const confirm = () => {
  emit('confirm')
}
</script>

<template>
  <Teleport to="body">
    <div v-if="show" class="fixed inset-0 overflow-y-auto" :style="{ zIndex: 70 }"><!-- Modal level -->
      <div class="flex min-h-screen items-center justify-center p-4 text-center sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="close"></div>

        <div role="alertdialog" :aria-label="`确认对话框: ${title}`" aria-modal="true"
          :class="[BASE_CLASSES.card, 'relative transform overflow-hidden text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg']">

          <div class="p-6">
            <div class="flex items-start">
              <div :class="[
                'flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full',
                danger ? 'bg-red-100 dark:bg-red-900/20' : 'bg-blue-100 dark:bg-blue-900/20'
              ]">
                <ExclamationTriangleIcon :class="[
                  'h-6 w-6',
                  danger ? 'text-red-600 dark:text-red-400' : 'text-blue-600 dark:text-blue-400'
                ]" />
              </div>
              <div class="ml-4 mt-0">
                <h3 class="text-lg font-semibold leading-6 text-gray-900 dark:text-white">
                  {{ title }}
                </h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    {{ content }}
                  </p>
                </div>
              </div>
            </div>
            <div class="mt-6 flex justify-end gap-3">
              <button type="button" @click="close"
                class="inline-flex justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600">
                {{ cancelText }}
              </button>
              <button type="button" @click="confirm" :class="[
                'inline-flex justify-center rounded-lg border px-4 py-2 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2',
                danger
                  ? 'border-red-600 bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 dark:border-red-700 dark:bg-red-700 dark:hover:bg-red-800'
                  : 'border-blue-600 bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 dark:border-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800'
              ]">
                {{ confirmText }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
