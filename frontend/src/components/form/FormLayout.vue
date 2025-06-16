<script setup lang="ts">
export interface FormLayoutProps {
  columns?: 1 | 2 | 3 | 4
  gap?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'compact' | 'card'
}

withDefaults(defineProps<FormLayoutProps>(), {
  columns: 1,
  gap: 'md',
  variant: 'default'
})

const gapClasses = {
  sm: 'gap-3',
  md: 'gap-4',
  lg: 'gap-6'
}

const variantClasses = {
  default: '',
  compact: 'space-y-3',
  card: 'p-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700'
}
</script>

<template>
  <div
    :class="[
      'form-layout',
      columns > 1 ? `grid grid-cols-1 md:grid-cols-${columns}` : 'space-y-6',
      columns > 1 ? gapClasses[gap] : '',
      variantClasses[variant]
    ]"
  >
    <slot />
  </div>
</template>

<style scoped>
/* 确保栅格类生成 */
.form-layout.grid {
  @apply grid;
}

.form-layout.grid.grid-cols-1 {
  @apply grid-cols-1;
}

@media (min-width: 768px) {
  .form-layout.md\:grid-cols-2 {
    @apply md:grid-cols-2;
  }

  .form-layout.md\:grid-cols-3 {
    @apply md:grid-cols-3;
  }

  .form-layout.md\:grid-cols-4 {
    @apply md:grid-cols-4;
  }
}
</style>
