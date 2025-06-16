<script setup lang="ts">
import { useSearchStore } from '@/stores/searchStore'
import { MapPinIcon, ArrowPathIcon, DocumentTextIcon } from '@heroicons/vue/24/outline'
import { computed, watch } from 'vue'
import useAnimatedStats from '@/composables/useAnimatedStats'

const store = useSearchStore()
const { animatedValues, startAnimation } = useAnimatedStats({
  visitedNodes: 0,
  pathLength: 0,
  maxNode: 0
})

const metrics = computed(() => [
  {
    id: 'visited',
    label: '访问节点',
    value: animatedValues.value.visitedNodes,
    icon: MapPinIcon,
    color: 'primary'
  },
  {
    id: 'path',
    label: '路径长度',
    value: animatedValues.value.pathLength,
    icon: ArrowPathIcon,
    color: 'success'
  },
  {
    id: 'max',
    label: '最大存储',
    value: animatedValues.value.maxNode,
    icon: DocumentTextIcon,
    color: 'gray'
  },
] as Array<metric>)

const description = computed(() => store.state.description)

watch(() => store.state.stats, (newVal) => {
  startAnimation({
    visitedNodes: newVal.visitedNodes,
    pathLength: newVal.pathLength,
    maxNode: newVal.maxNode
  })
}, { deep: true, immediate: true })
</script>

<template>
  <section class="space-y-3">
    <div class="metrics-grid">
      <BaseMetricCard v-for="metric in metrics" :key="metric.id" :metric="metric" />
    </div>

    <div class="description-box ">
      {{ description }}
    </div>
  </section>
</template>

<style scoped>
.metrics-grid {
  @apply grid grid-cols-1 md:grid-cols-3 gap-3;
}

.description-box {
  @apply p-4 rounded-lg text-text theme-transition text-center card-base;
}
</style>
