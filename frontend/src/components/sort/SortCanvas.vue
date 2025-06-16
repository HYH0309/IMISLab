<script setup lang="ts">
import { useSortingStore } from '@/stores/sortStore'
import { motion } from 'motion-v'
const store = useSortingStore()
const spring = {
  type: 'spring',
  damping: 20,
  stiffness: 300,
  during: 0.1,
  bounce: 0.5
}
const cellClass = (index: number) => {
  return {
    'bg-red ': store.state.stats.pivotIndex === index,  // 添加缩放效果
    'bg-yellow': store.state.activeIndices.includes(index),
    'bg-blue': !store.state.activeIndices.includes(index) &&
      store.state.stats.pivotIndex !== index
  }
}
</script>

<template>
  <div class="sort-visualization-container">
    <ul class="sort-list">
      <motion.li v-for="(num, index) in store.state.order" :key="num" layout :layout-id="'item-' + num"
        :transition="spring" class="sort-item " :class="cellClass(index)" :style="{
          height: `${num * 0.5}rem`
        }">
        {{ num }}
      </motion.li>
    </ul>
  </div>
</template>

<style scoped>
.sort-visualization-container {
  @apply flex flex-col items-center gap-4 h-50vh pb-4;
}

.sort-list {
  @apply list-none p-0 m-0 flex gap-4 items-end h-full w-full px-4;
}

.sort-item {
  @apply w-25 min-w-1.5rem rounded-md flex items-center justify-center font-bold shadow-sm;
}
</style>
