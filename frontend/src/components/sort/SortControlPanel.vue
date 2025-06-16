<script setup lang="ts">
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'
import { useSortingStore } from '@/stores/sortStore'
import { ChevronDownIcon } from '@heroicons/vue/20/solid'
import BaseControlPanel from '@/components/composable/BaseControlPanel.vue'

const store = useSortingStore()
</script>

<template>
  <BaseControlPanel direction="horizontal">
    <!-- 算法选择菜单 -->
    <Menu as="div" class="relative">
      <MenuButton class="btn-lg btn flex items-center gap-2 bg-background text-text" :disabled="store.state.isSorting">
        {{ store.state.selectedAlgorithm?.name || '选择算法' }}
        <ChevronDownIcon class="w-5 h-5 text-text/80" />
      </MenuButton>
      <MenuItems class="absolute mt-1 card-base w-full">
        <MenuItem v-for="algo in store.algorithms" :key="algo.name" v-slot="{ active }">
        <button :class="['dropdown-item', active && 'bg-primary/10 text-primary']"
          @click="store.state.selectedAlgorithm = algo">
          {{ algo.name }}
        </button>
        </MenuItem>
      </MenuItems>
    </Menu>

    <!-- 速度控制 -->
    <div class="speed-control">
      <span class="speed-label">Steps</span>
      <input type="range" v-model="store.state.speed" :min="100" :max="1000" :step="100" class="speed-slider">
      <span class="speed-value">
        {{ (store.state.speed / 1000).toFixed(1) }}s
      </span>
    </div>

    <!-- 操作按钮组 -->
    <template #actions>
      <button class="btn-md btn bg-blue border-none" @click="store.startSorting" :disabled="store.state.isSorting">
        {{ store.state.isSorting ? (store.state.isManualMode ? '手动模式' : '排序中...') : '开始排序' }}
      </button>
      <button class="btn-md btn bg-yellow border-none" @click="store.state.isManualMode = !store.state.isManualMode"
        :class="{ manual: store.state.isManualMode }" :disabled="store.state.isSorting">
        {{ store.state.isManualMode ? '手动模式' : '自动模式' }}
      </button>
      <button class="btn-md btn bg-blue border-none" @click="store.nextStep()"
        :disabled="!store.state.isSorting || !store.state.isManualMode">
        下一步
      </button>
      <button class="btn-md btn bg-red border-none" @click="store.resetArray" :disabled="store.state.isSorting">
        重置
      </button>
      <button class="btn-md btn bg-purple border-none" @click="store.openShow">
        算法介绍
      </button>
    </template>
  </BaseControlPanel>
</template>

<style scoped>
.dropdown-item {
  @apply block w-full px-4 py-2 text-center text-text bg-background theme-transition;
}

/* 速度控制 */
.speed-control {
  @apply panel-base flex items-center gap-3;
}

.speed-label {
  @apply text-sm font-mono text-muted-foreground px-2 py-1 bg-muted rounded-md border-border border;
}

.speed-slider {
  @apply w-full h-2 bg-muted rounded-full accent-primary;
}

.speed-value {
  @apply text-sm font-mono text-muted-foreground px-2 py-1 bg-muted rounded-md border-border border;
}

button:disabled {
  @apply disabled:(opacity-50 cursor-not-allowed);
}
</style>
