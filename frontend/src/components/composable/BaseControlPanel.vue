<template>
  <div class="card-container" :class="[
    direction === 'horizontal' ? 'md:flex-row' : 'flex-col',
    disabled ? 'card-disabled' : '',
    'flex gap-4'
  ]">
    <div class="content-area">
      <slot></slot>
    </div>
    <div class="action-area">
      <slot name="actions"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  direction?: 'horizontal' | 'vertical'
  disabled?: boolean
}>()
</script>

<style scoped>
.card-container {
  @apply card-base flex-layout;
}

.content-area {
  @apply flex-1 flex flex-wrap gap-2;
}

.action-area {
  @apply flex gap-2 items-center text-muted;
}

.card-disabled {
  @apply card-disabled;
}
</style>
