<script setup lang="ts">
import { computed } from 'vue'

export interface FormFieldProps {
  label?: string
  name?: string
  required?: boolean
  error?: string
  help?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'compact'
  width?: 'full' | 'auto' | 'sm' | 'md' | 'lg' | 'xl'
}

const props = withDefaults(defineProps<FormFieldProps>(), {
  size: 'md',
  variant: 'default',
  width: 'full'
})

const fieldId = computed(() => props.name || `field-${Math.random().toString(36).substr(2, 9)}`)

const sizeClasses = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg'
}

const inputSizeClasses = {
  sm: 'px-2 py-1 text-sm',
  md: 'px-3 py-2 text-sm',
  lg: 'px-4 py-3 text-base'
}

const spacingClasses = {
  default: 'space-y-3',
  compact: 'space-y-2'
}

const widthClasses = {
  full: 'w-full',
  auto: 'w-auto',
  sm: 'w-48',
  md: 'w-64',
  lg: 'w-80',
  xl: 'w-96'
}
</script>

<template>
  <div :class="[spacingClasses[variant]]">
    <!-- 标签 -->
    <label
      v-if="label"
      :for="fieldId"
      :class="[
        'block font-medium text-gray-700 dark:text-gray-300',
        sizeClasses[size]
      ]"
    >
      {{ label }}
      <span v-if="required" class="text-red-500 ml-1" aria-label="必填">*</span>
    </label>

    <!-- 输入字段容器 -->
    <div class="relative">
      <slot
        :id="fieldId"
        :class="[
          'block border rounded-lg transition-colors',
          'border-gray-300 dark:border-gray-600',
          'bg-white dark:bg-gray-800',
          'text-gray-900 dark:text-white',
          'placeholder-gray-400 dark:placeholder-gray-500',
          'focus:ring-2 focus:border-transparent',
          'focus:outline-none',
          error
            ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
            : 'focus:ring-blue-500 focus:border-blue-500',
          inputSizeClasses[size],
          widthClasses[width]
        ]"
        :aria-invalid="!!error"
        :aria-describedby="error ? `${fieldId}-error` : help ? `${fieldId}-help` : undefined"
      />
    </div>

    <!-- 错误消息 -->
    <p
      v-if="error"
      :id="`${fieldId}-error`"
      class="text-sm text-red-600 dark:text-red-400"
      role="alert"
    >
      {{ error }}
    </p>

    <!-- 帮助文本 -->
    <p
      v-else-if="help"
      :id="`${fieldId}-help`"
      class="text-sm text-gray-500 dark:text-gray-400"
    >
      {{ help }}
    </p>
  </div>
</template>
