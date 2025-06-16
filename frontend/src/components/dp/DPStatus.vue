<script setup lang="ts">
import { useDPStore } from '@/stores/dpStore'
import { computed, watch } from 'vue'
import useAnimatedStats from '@/composables/useAnimatedStats'
import BaseMetricCard from '@/components/composable/BaseMetricCard.vue'
import {
  ChartBarIcon,
  CurrencyDollarIcon,
  CubeIcon
} from '@heroicons/vue/20/solid'

const store = useDPStore()
const { animatedValues, startAnimation } = useAnimatedStats({
  currentStep: 0,
  maxValue: 0,
  remainingCapacity: 0
})

const description = computed(() => store.state.description)
const metrics = computed(() => [
  {
    id: 'step',
    label: '步骤',
    value: animatedValues.value.currentStep,
    icon: ChartBarIcon,
    color: 'primary'
  },
  {
    id: 'value',
    label: '最大价值',
    value: animatedValues.value.maxValue,
    icon: CurrencyDollarIcon,
    color: 'success'
  },
  {
    id: 'capacity',
    label: '剩余容量',
    value: animatedValues.value.remainingCapacity,
    icon: CubeIcon,
    color: 'warning'
  },
] as Array<metric>)

watch(() => store.state.stats, (newStats) => {
  startAnimation({
    currentStep: newStats.currentStep,
    maxValue: newStats.maxValue,
    remainingCapacity: newStats.remainingCapacity
  })
}, { immediate: true, deep: true })
</script>

<template>
  <section class="space-y-3">
    <div class="metrics-grid">
      <BaseMetricCard v-for="metric in metrics" :key="metric.id" :metric="metric" />
    </div>

    <div v-if="description" class="description-box">
      {{ description }}
    </div>

    <div class="p-2 rounded-lg bg-panel border-border border theme-transition">
      <div class="items-grid">
        <div v-for="item in store.state.stats.items" :key="item.id" class="item-card theme-transition">
          <span class="item-id text-primary-500">{{ item.id + 1 }}</span>
          <div class="item-properties text-text-muted">
            <span>重:{{ item.weight }}</span>
            <span>值:{{ item.value }}</span>
          </div>
        </div>
      </div>
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

.items-grid {
  @apply grid grid-cols-3 sm:grid-cols-5 gap-1;
}

.item-card {
  @apply p-1 text-center text-sm rounded cursor-pointer card-base;
}

.item-id {
  @apply font-medium truncate block;
}

.item-properties {
  @apply truncate space-x-1 text-xs;
}
</style>
