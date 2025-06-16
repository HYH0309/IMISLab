<script setup lang="ts">

defineProps<{
  metric: metric
}>()
</script>

<template>
  <div class="metric-card ">
    <component :is="metric.icon" class="metric-icon" :class="`text-${metric.color}-500`" />
    <div class="metric-content">
      <span class="metric-label text-text-muted">{{ metric.label }}:</span>
      <span class="metric-value" :class="`text-${metric.color}-600`">
        {{ metric.value }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.metric-card {
  @apply card-base flex items-center p-3 rounded-xl theme-transition hover:bg-muted;
}

.metric-icon {
  @apply w-6 h-6 shrink-0 mr-3;
}

.metric-content {
  @apply min-w-0 space-y-1;
}

.metric-label {
  @apply text-sm truncate font-medium;
}

.metric-value {
  @apply font-semibold truncate text-lg;
}
</style>
