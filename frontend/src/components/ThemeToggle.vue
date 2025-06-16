<script setup lang="ts">
import { MoonIcon, SunIcon } from '@heroicons/vue/24/outline'
import { useMotion } from '@vueuse/motion'
import { useThemeStore } from '@/stores/themeStore'
import { computed, ref, watch } from 'vue'
import { Z_INDEX } from '@/config/z-index'

const themeStore = useThemeStore()
const isLight = computed(() => themeStore.theme === 'light')
const iconRef = ref<HTMLElement>()
const buttonRef = ref<HTMLButtonElement>()

// 按钮悬停动画
useMotion(buttonRef, {
  hover: { scale: 1.05 },
  tap: { scale: 0.95 }
})

// 图标切换动画
const iconMotion = useMotion(iconRef, {
  initial: { opacity: 0, rotate: 90, scale: 0.75, y: 10 },
  enter: { opacity: 1, rotate: 0, scale: 1, y: 0, transition: { type: 'spring', stiffness: 500, damping: 15, mass: 0.5 } }
})

watch(isLight, (newVal) => {
  iconMotion.apply({
    opacity: 0,
    rotate: newVal ? 90 : -90,
    scale: 0.75,
    y: newVal ? 10 : -10,
    transition: { duration: 200 }
  })
  setTimeout(() => {
    iconMotion.apply({
      opacity: 1,
      rotate: 0,
      scale: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 500, damping: 15 }
    })
  }, 200)
})

const toggleTheme = () => {
  themeStore.toggleTheme()
}
</script>

<template>
  <button ref="buttonRef" @click="toggleTheme"
    class="fixed top-5 right-5 p-2 rounded-full bg-background/50 border-none shadow-lg flex items-center justify-center w-12 h-12"
    :style="{ zIndex: Z_INDEX.THEME_TOGGLE }"
    aria-label="Toggle theme" :title="isLight ? 'Switch to dark mode' : 'Switch to light mode'">
    <div ref="iconRef" class="flex items-center justify-center">
      <MoonIcon v-if="isLight" class="w-6 h-6 text-foreground" />
      <SunIcon v-else class="w-6 h-6 text-foreground" />
    </div>
  </button>
</template>
