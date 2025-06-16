<script setup lang="ts">
import { Menu, MenuItems, MenuItem } from '@headlessui/vue'

defineProps<{
  items: Array<{ id: string; title: string }>
}>()

const scrollTo = (id: string) => {
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}
</script>

<template>
  <Menu as="nav" class="toc-container">
    <div class="toc-title">
      <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" class="inline-block mr-1">
        <path d="M4 6h16M4 12h16M4 18h16" />
      </svg>
      目录
    </div>
    <MenuItems static class="space-y-1">
      <MenuItem v-for="item in items" :key="item.id" v-slot="{ active }">
      <a :href="`#${item.id}`" :class="[
        'toc-link-base',
        active ? 'toc-link-active' : 'toc-link'
      ]" @click.prevent="scrollTo(item.id)">
        {{ item.title }}
      </a>
      </MenuItem>
    </MenuItems>
  </Menu>
</template>

<style scoped>
.toc-container {
  @apply sticky top-20 max-h-[calc(100vh-5rem)] overflow-y-auto overflow-x-hidden p-5 w-80 bg-background/80 rounded-2xl shadow-lg border font-sans;

  scrollbar-width: thin;
  scrollbar-color: #bae6fd #f0f9ff;
  transition: background 0.3s, box-shadow 0.3s;
}

.toc-container::-webkit-scrollbar {
  background: transparent;
}

.toc-container::-webkit-scrollbar-thumb {
  background: #bae6fd;
  border-radius: 6px;
}

.toc-title {
  @apply font-bold text-sky-600 dark:text-sky-300 mb-4 text-lg flex items-center gap-2 tracking-wide;
}

.toc-link-base {
  @apply block px-4 py-2 rounded-xl no-underline w-full transition-all duration-200 font-inherit mx-auto break-words whitespace-normal;
  /* 如果你想单行省略号可加 truncate，但一般目录建议多行显示 */
}

.toc-link {
  @apply text-sky-700 dark:text-sky-200 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/40;
}

.toc-link-active {
  @apply bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 shadow font-semibold;
  transform: translateX(8px) scale(1.04);
  box-shadow: 0 2px 12px 0 rgba(16, 185, 129, 0.08);
}
</style>
