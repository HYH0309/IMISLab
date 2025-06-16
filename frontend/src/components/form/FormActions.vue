<script setup lang="ts">
export interface FormActionsProps {
  align?: 'left' | 'center' | 'right' | 'between'
  variant?: 'default' | 'compact'
  sticky?: boolean
}

withDefaults(defineProps<FormActionsProps>(), {
  align: 'right',
  variant: 'default',
  sticky: false
})

const alignClasses = {
  left: 'justify-start',
  center: 'justify-center',
  right: 'justify-end',
  between: 'justify-between'
}

const variantClasses = {
  default: 'gap-3 pt-6',
  compact: 'gap-2 pt-4'
}
</script>

<template>
  <div
    :class="[
      'flex items-center',
      alignClasses[align],
      variantClasses[variant],
      sticky ? 'sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4 -mx-6 -mb-6' : ''
    ]"
  >
    <slot />
  </div>
</template>
