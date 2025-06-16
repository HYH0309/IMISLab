<script setup lang="ts">
import { motion } from 'motion-v'
import { useDPStore } from '@/stores/dpStore'
import { CalendarIcon } from '@heroicons/vue/20/solid'

const store = useDPStore()


// 使用主题变量定义状态类
const cellClasses = {
  active: 'bg-primary border-primary-active  ',
  visited: 'bg-success border-success',
  default: 'bg-background border-border hover:bg-muted'
}
</script>

<template>
  <div class="axis-container bg-primary">
    <!-- 表头行 -->
    <div class="flex gap-3 items-center">
      <CalendarIcon class="axis-label " />
      <div class="flex gap-2">
        <div v-for="j in store.state.matrix[0]?.length" :key="j" class="grid-cell">
          {{ j - 1 }}
        </div>
      </div>
    </div>

    <!-- 数据行 -->
    <div v-for="(row, i) in store.state.matrix" :key="i" class="flex gap-3 items-center theme-transition">
      <div class="axis-label ">
        {{ i === 0 ? '空' : `物品${i}` }}
      </div>

      <div class="flex gap-2">
        <motion.div v-for="(cell, j) in row" :key="j" :class="['grid-cell', cellClasses[cell.state]]" :animate="{
          scale: cell.state === 'active' ? [1, 2, 1] : 1,
          transition: { duration: 0.1 }
        }">
          <div class="cell-content">
            <span class="value text-text">{{ cell.value }}</span>
            <span v-if="cell.state === 'active'" class="  text-xs">
              ({{ i }},{{ j }})
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.axis-container {
  @apply flex flex-col p-8 bg-muted rounded-lg gap-2;
}

.axis-label {
  @apply w-14 h-14 flex items-center justify-center bg-muted rounded-md border-2 border-border shadow-sm theme-transition;
}

.grid-cell {
  @apply w-14 h-14 border-2 flex items-center justify-center font-mono cursor-pointer theme-transition rounded-md;
}

.cell-content {
  @apply flex flex-col items-center justify-center gap-0.5 rounded-lg;
}
</style>
