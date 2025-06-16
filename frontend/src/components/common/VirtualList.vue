<template>
  <div
    ref="containerRef"
    class="virtual-list-container"
    :style="{ height: containerHeight + 'px' }"
    @scroll="handleScroll"
    role="listbox"
    :aria-label="ariaLabel"
    tabindex="0"
    @keydown="handleKeyDown"
  >
    <!-- 虚拟滚动容器 -->
    <div
      class="virtual-list-phantom"
      :style="{ height: totalHeight + 'px' }"
    ></div>

    <!-- 可见项目容器 -->
    <div
      class="virtual-list-content"
      :style="{ transform: `translateY(${offsetY}px)` }"
    >
      <div
        v-for="(item, index) in visibleItems"
        :key="getItemKey(item, startIndex + index)"
        class="virtual-list-item"
        :style="{ height: itemHeight + 'px' }"
        :aria-selected="selectedItems.has(getItemKey(item, startIndex + index))"
        :aria-posinset="startIndex + index + 1"
        :aria-setsize="items.length"
        role="option"
        @click="handleItemClick(item, startIndex + index)"
        @keydown="handleItemKeyDown($event, item, startIndex + index)"
        tabindex="0"
      >
        <slot
          :item="item"
          :index="startIndex + index"
          :isSelected="selectedItems.has(getItemKey(item, startIndex + index))"
        >
          <div class="p-4 border-b border-gray-200 dark:border-gray-700">
            {{ item }}
          </div>
        </slot>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="virtual-list-loading">
      <div class="flex items-center justify-center py-8">
        <div class="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full"></div>
        <span class="ml-2 text-gray-600 dark:text-gray-400">加载中...</span>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-if="!loading && items.length === 0" class="virtual-list-empty">
      <slot name="empty">
        <div class="flex flex-col items-center justify-center py-16">
          <div class="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
            <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m0 0V9a2 2 0 012-2h2m0 0V6a2 2 0 012-2h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 01.293.707V9M9 9h0"></path>
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">暂无数据</h3>
          <p class="text-gray-500 dark:text-gray-400 text-center max-w-md">
            当前列表中没有任何项目。请稍后再试或添加新的内容。
          </p>
        </div>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'

// Props 定义
interface Props {
  items: any[]
  itemHeight?: number
  containerHeight?: number
  buffer?: number
  loading?: boolean
  getItemKey?: (item: any, index: number) => string | number
  selectable?: boolean
  multiSelect?: boolean
  ariaLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  itemHeight: 60,
  containerHeight: 400,
  buffer: 5,
  loading: false,
  getItemKey: (item: any, index: number) => index,
  selectable: false,
  multiSelect: false,
  ariaLabel: '虚拟列表'
})

// Emits 定义
const emit = defineEmits<{
  select: [item: any, index: number]
  scroll: [scrollTop: number]
  'load-more': []
}>()

// 响应式状态
const containerRef = ref<HTMLDivElement>()
const scrollTop = ref(0)
const selectedItems = ref(new Set<string | number>())
const focusedIndex = ref(-1)

// 计算属性
const totalHeight = computed(() => props.items.length * props.itemHeight)

const visibleCount = computed(() =>
  Math.ceil(props.containerHeight / props.itemHeight) + props.buffer * 2
)

const startIndex = computed(() =>
  Math.max(0, Math.floor(scrollTop.value / props.itemHeight) - props.buffer)
)

const endIndex = computed(() =>
  Math.min(props.items.length, startIndex.value + visibleCount.value)
)

const visibleItems = computed(() =>
  props.items.slice(startIndex.value, endIndex.value)
)

const offsetY = computed(() => startIndex.value * props.itemHeight)

// 性能优化：防抖滚动处理
let scrollTimer: number | null = null
const handleScroll = (event: Event) => {
  const target = event.target as HTMLElement
  scrollTop.value = target.scrollTop

  emit('scroll', scrollTop.value)

  // 检查是否需要加载更多
  const isNearBottom = scrollTop.value + props.containerHeight >= totalHeight.value - props.itemHeight * 5
  if (isNearBottom && !props.loading) {
    emit('load-more')
  }

  // 防抖处理，优化性能
  if (scrollTimer) {
    cancelAnimationFrame(scrollTimer)
  }
  scrollTimer = requestAnimationFrame(() => {
    // 这里可以添加额外的滚动后处理逻辑
  })
}

// 项目点击处理
const handleItemClick = (item: any, index: number) => {
  if (!props.selectable) return

  const key = props.getItemKey(item, index)

  if (props.multiSelect) {
    if (selectedItems.value.has(key)) {
      selectedItems.value.delete(key)
    } else {
      selectedItems.value.add(key)
    }
  } else {
    selectedItems.value.clear()
    selectedItems.value.add(key)
  }

  focusedIndex.value = index
  emit('select', item, index)
}

// 键盘导航支持
const handleKeyDown = (event: KeyboardEvent) => {
  if (!props.selectable) return

  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      navigateToIndex(Math.min(props.items.length - 1, focusedIndex.value + 1))
      break
    case 'ArrowUp':
      event.preventDefault()
      navigateToIndex(Math.max(0, focusedIndex.value - 1))
      break
    case 'Home':
      event.preventDefault()
      navigateToIndex(0)
      break
    case 'End':
      event.preventDefault()
      navigateToIndex(props.items.length - 1)
      break
    case 'Enter':
    case ' ':
      event.preventDefault()
      if (focusedIndex.value >= 0) {
        const item = props.items[focusedIndex.value]
        handleItemClick(item, focusedIndex.value)
      }
      break
    case 'Escape':
      selectedItems.value.clear()
      break
  }
}

const handleItemKeyDown = (event: KeyboardEvent, item: any, index: number) => {
  handleKeyDown(event)
}

// 导航到指定索引
const navigateToIndex = async (index: number) => {
  focusedIndex.value = index

  // 滚动到可见区域
  const targetScrollTop = index * props.itemHeight
  const minScrollTop = targetScrollTop - props.containerHeight + props.itemHeight
  const maxScrollTop = targetScrollTop

  if (scrollTop.value < minScrollTop) {
    containerRef.value!.scrollTop = minScrollTop
  } else if (scrollTop.value > maxScrollTop) {
    containerRef.value!.scrollTop = maxScrollTop
  }

  // 等待DOM更新后聚焦元素
  await nextTick()
  const itemElement = containerRef.value?.querySelector(
    `.virtual-list-item[aria-posinset="${index + 1}"]`
  ) as HTMLElement
  itemElement?.focus()
}

// 公开方法
const scrollToIndex = (index: number) => {
  navigateToIndex(index)
}

const scrollToTop = () => {
  containerRef.value!.scrollTop = 0
}

const clearSelection = () => {
  selectedItems.value.clear()
}

const getSelectedItems = () => {
  return Array.from(selectedItems.value).map(key => {
    const index = props.items.findIndex((item, idx) => props.getItemKey(item, idx) === key)
    return { item: props.items[index], index, key }
  })
}

// 监听props变化
watch(() => props.items, () => {
  // 数据变化时重置状态
  scrollTop.value = 0
  focusedIndex.value = -1
  if (containerRef.value) {
    containerRef.value.scrollTop = 0
  }
})

// 生命周期
onMounted(() => {
  // 初始化时聚焦容器
  if (props.selectable && containerRef.value) {
    containerRef.value.focus()
  }
})

onUnmounted(() => {
  if (scrollTimer) {
    cancelAnimationFrame(scrollTimer)
  }
})

// 暴露公开API
defineExpose({
  scrollToIndex,
  scrollToTop,
  clearSelection,
  getSelectedItems,
  selectedItems: computed(() => selectedItems.value)
})
</script>

<style scoped>
.virtual-list-container {
  @apply relative overflow-auto border border-gray-200 dark:border-gray-700 rounded-lg;
  @apply focus:outline-none focus:ring-2 focus:ring-primary/50;
}

.virtual-list-phantom {
  @apply absolute top-0 left-0 right-0 z-0;
}

.virtual-list-content {
  @apply absolute top-0 left-0 right-0 z-10;
}

.virtual-list-item {
  @apply cursor-pointer transition-colors duration-150;
  @apply hover:bg-gray-50 dark:hover:bg-gray-800;
  @apply focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-700;
  @apply border-l-4 border-transparent;
}

.virtual-list-item[aria-selected="true"] {
  @apply bg-primary/10 border-l-primary dark:bg-primary/20;
}

.virtual-list-loading,
.virtual-list-empty {
  @apply absolute inset-0 z-20 bg-white dark:bg-gray-900;
}

/* 滚动条样式 */
.virtual-list-container::-webkit-scrollbar {
  @apply w-2;
}

.virtual-list-container::-webkit-scrollbar-track {
  @apply bg-gray-100 dark:bg-gray-800;
}

.virtual-list-container::-webkit-scrollbar-thumb {
  @apply bg-gray-300 dark:bg-gray-600 rounded-full;
}

.virtual-list-container::-webkit-scrollbar-thumb:hover {
  @apply bg-gray-400 dark:bg-gray-500;
}

/* 无障碍优化 */
@media (prefers-reduced-motion: reduce) {
  .virtual-list-item {
    @apply transition-none;
  }
}

/* 高对比度模式 */
@media (prefers-contrast: high) {
  .virtual-list-item[aria-selected="true"] {
    @apply bg-black dark:bg-white text-white dark:text-black;
  }
}
</style>
