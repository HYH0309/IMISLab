<script setup lang="ts">
import { motion } from 'motion-v'
import { useSearchStore } from '@/stores/searchStore'

const store = useSearchStore()

const cellClass = (cell: string) => {
  switch (cell) {
    case 'start': return 'bg-green-500'
    case 'end': return 'bg-red-500'
    case 'wall': return 'bg-gray-500'
    case 'visited': return 'bg-blue-500'
    case 'path': return 'bg-yellow-500'
    default: return 'bg-purple-500'
  }
}

const handleCellClick = (row: number, col: number) => {
  if (store.state.grid[row][col] === 'empty') {
    store.state.grid[row][col] = 'wall'
  } else if (store.state.grid[row][col] === 'wall') {
    store.state.grid[row][col] = 'empty'
  }
}
</script>

<template>
  <div class="flex flex-col gap-1 p-4">
    <div v-for="(row, i) in store.state.grid" :key="i" class="flex gap-1">
      <motion.div v-for="(cell, j) in row" :key="`${i}-${j}-${cell}`" :class="['grid-cell', cellClass(cell)]"
        @click="handleCellClick(i, j)" :animate="{ scale: [1, 2, 1] }" :transition="{ duration: 0.3 }" />
    </div>
  </div>
</template>

<style scoped>
.grid-cell {
  @apply w-10 h-10 border rounded-sm cursor-pointer theme-transition;
}
</style>
