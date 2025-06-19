<script setup lang="ts">
import { ref, markRaw, defineAsyncComponent } from 'vue'
import {
  Square3Stack3DIcon as Square3Stack3DOutlineIcon,
  MagnifyingGlassIcon as MagnifyingGlassOutlineIcon,
  ArrowsUpDownIcon as ArrowsUpDownOutlineIcon
} from '@heroicons/vue/24/outline'

import {
  Square3Stack3DIcon as Square3Stack3DSolidIcon,
  MagnifyingGlassIcon as MagnifyingGlassSolidIcon,
  ArrowsUpDownIcon as ArrowsUpDownSolidIcon
} from '@heroicons/vue/24/solid'
import { motion, AnimatePresence } from 'motion-v'


const tabs = [
  {
    id: 'dp',
    label: '动态规划',
    icon: Square3Stack3DOutlineIcon,      // 使用线框图标
    activeIcon: Square3Stack3DSolidIcon,  // 使用实心图标
    component: markRaw(defineAsyncComponent(() => import('@/views/visualizer/DPView.vue')))
  },
  {
    id: 'search',
    label: '搜索算法',
    icon: MagnifyingGlassOutlineIcon,     // 使用线框图标
    activeIcon: MagnifyingGlassSolidIcon, // 使用实心图标
    component: markRaw(defineAsyncComponent(() => import('@/views/visualizer/SearchView.vue')))
  },
  {
    id: 'sort',
    label: '排序算法',
    icon: ArrowsUpDownOutlineIcon,        // 使用线框图标
    activeIcon: ArrowsUpDownSolidIcon,    // 使用实心图标
    component: markRaw(defineAsyncComponent(() => import('@/views/visualizer/SortView.vue')))
  }
]
const selectedTab = ref(tabs[0])
</script>

<template>
  <div class="container">
    <nav class="nav">

      <ul class="tabs-container">
        <motion.li v-for="tab in tabs" :key="tab.id" class="tab" :class="{ 'active': selectedTab.id === tab.id }"
          @click="selectedTab = tab">
          <component :is="selectedTab.id === tab.id ? tab.activeIcon : tab.icon" class="icon" />
          <span class="label">{{ tab.label }}</span>
          <motion.div v-if="selectedTab.id === tab.id" class="underline" layout-id="underline" />
        </motion.li>
      </ul>

    </nav>

    <main>
      <AnimatePresence mode="wait">
        <motion.div :key="selectedTab.id" :initial="{ opacity: 0, y: 10 }" :animate="{ opacity: 1, y: 0 }"
          :exit="{ opacity: 0, y: -5 }" :transition="{ duration: 0.2 }">
          <component :is="selectedTab.component" />
        </motion.div>
      </AnimatePresence>
    </main>
  </div>
</template>

<style scoped>
.container {
  @apply mx-auto max-w-7xl px-4 flex flex-col gap-4;
}

.nav {
  @apply rounded-xl p-4 flex-center;
}

.tabs-container {
  @apply flex gap-1;
}

.tab {
  @apply relative flex items-center gap-2 px-4 py-2.5 rounded-lg theme-transition text-sm font-medium cursor-pointer text-text-muted hover:bg-background-muted;

  &.active {
    @apply text-primary;
  }
}

.icon {
  @apply w-5 h-5;
}

.underline {
  @apply absolute -bottom-3 left-0 w-full h-1 bg-primary;
}

.label {
  @apply hidden sm:inline;
}

.action-btn {
  @apply px-4 py-2 ml-2 text-sm font-medium rounded-lg theme-transition bg-primary/10 text-primary hover:bg-primary/20;
}

.action-text {
  @apply hidden sm:inline;
}

.action-icon {
  @apply sm:hidden;
}
</style>
