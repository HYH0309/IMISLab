<script setup lang="ts">
export interface FormGroupProps {
  title?: string
  subtitle?: string
  collapsible?: boolean
  collapsed?: boolean
}

const props = withDefaults(defineProps<FormGroupProps>(), {
  collapsible: false,
  collapsed: false
})

const emit = defineEmits<{
  toggleCollapse: []
}>()

const handleToggle = () => {
  if (props.collapsible) {
    emit('toggleCollapse')
  }
}
</script>

<template>
  <div class="space-y-4">
    <!-- 分组标题 -->
    <div v-if="title || subtitle" class="border-b border-gray-200 dark:border-gray-700 pb-2">
      <div
        :class="[
          'flex items-center justify-between',
          collapsible ? 'cursor-pointer' : ''
        ]"
        @click="handleToggle"
      >
        <div>
          <h3 v-if="title" class="text-lg font-medium text-gray-900 dark:text-white">
            {{ title }}
          </h3>
          <p v-if="subtitle" class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {{ subtitle }}
          </p>
        </div>

        <!-- 折叠图标 -->
        <button
          v-if="collapsible"
          type="button"
          class="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          :aria-expanded="!collapsed"
          :aria-label="collapsed ? '展开分组' : '折叠分组'"
        >
          <svg
            class="w-5 h-5 text-gray-500 transition-transform duration-200"
            :class="{ 'rotate-180': !collapsed }"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
    </div>

    <!-- 分组内容 -->
    <div
      v-show="!collapsed"
      :class="[
        'space-y-4 transition-all duration-200',
        collapsed ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100'
      ]"
    >
      <slot />
    </div>
  </div>
</template>
