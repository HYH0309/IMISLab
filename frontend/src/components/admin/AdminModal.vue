<script setup lang="ts">
import { Dialog, DialogPanel, TransitionRoot, TransitionChild } from '@headlessui/vue'
import { computed, ref, watch } from 'vue';

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    default: ''
  },
  width: {
    type: String as () => 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full',
    default: 'md',
    validator: (value: string) => ['sm', 'md', 'lg', 'xl', '2xl', 'full'].includes(value)
  },
  loading: {
    type: Boolean,
    default: false
  },
  closeOnEsc: {
    type: Boolean,
    default: true
  },
  closeOnOutsideClick: {
    type: Boolean,
    default: true
  },
  theme: {
    type: String as () => 'default' | 'blue' | 'green' | 'purple' | 'red',
    default: 'default'
  }
})

const emit = defineEmits(['update:modelValue', 'close'])

const widthClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  'full': 'max-w-full mx-4'
}

const closeModal = () => {
  if (!props.loading) {
    emit('update:modelValue', false)
    emit('close')
  }
}

const handleCloseDialog = () => {
  if (props.closeOnOutsideClick) {
    closeModal()
  }
}

// 主题颜色
const themeClasses = computed(() => {
  switch (props.theme) {
    case 'blue':
      return {
        header: 'border-blue-200 dark:border-blue-800',
        title: 'text-blue-700 dark:text-blue-300'
      }
    case 'green':
      return {
        header: 'border-green-200 dark:border-green-800',
        title: 'text-green-700 dark:text-green-300'
      }
    case 'purple':
      return {
        header: 'border-purple-200 dark:border-purple-800',
        title: 'text-purple-700 dark:text-purple-300'
      }
    case 'red':
      return {
        header: 'border-red-200 dark:border-red-800',
        title: 'text-red-700 dark:text-red-300'
      }
    default:
      return {
        header: 'border-gray-200 dark:border-gray-700',
        title: 'text-gray-900 dark:text-white'
      }
  }
})

// 动画持续时间
const isOpen = ref(false)
watch(() => props.modelValue, (val) => {
  if (val) {
    setTimeout(() => {
      isOpen.value = true
    }, 50)
  } else {
    isOpen.value = false
  }
}, { immediate: true })
</script>

<template>
  <TransitionRoot appear :show="modelValue" as="template">
    <Dialog as="div" class="relative" :style="{ zIndex: 70 }" :closeOnEsc="closeOnEsc" @close="handleCloseDialog"><!-- Modal level -->
      <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0" enter-to="opacity-100"
        leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
        <div class="fixed inset-0 bg-black/30 dark:bg-black/50 backdrop-blur-sm"></div>
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-80vh items-center justify-center p-4 text-center">
          <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100" leave="duration-200 ease-in" leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95">
            <DialogPanel :class="[
              widthClasses[width],
              'w-full bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-xl transition-all transform',
              isOpen ? 'translate-y-0' : 'translate-y-4'
            ]">
              <div v-if="$slots.header" class="mb-0">
                <slot name="header"></slot>
              </div>

              <template v-else>
                <div :class="[
                  'flex items-center px-6 py-4 border-b',
                  themeClasses.header
                ]">
                  <h3 :class="['text-lg font-semibold', themeClasses.title]">{{ title }}</h3>
                </div>
              </template>

              <div class="px-6 py-4">
                <div :class="{ 'opacity-50 pointer-events-none': loading }" :aria-busy="loading">
                  <slot></slot>
                </div>

                <div v-if="loading"
                  class="absolute inset-0 flex items-center justify-center bg-white/60 dark:bg-black/60 backdrop-blur-sm rounded-xl">
                  <div
                    class="h-8 w-8 rounded-full border-3 border-gray-300 dark:border-gray-600 border-t-blue-500 dark:border-t-blue-400 animate-spin">
                  </div>
                </div>
              </div>

              <div v-if="$slots.footer"
                class="border-t border-gray-200 dark:border-gray-700 px-6 py-4 bg-gray-50/50 dark:bg-gray-900/50">
                <slot name="footer"></slot>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
