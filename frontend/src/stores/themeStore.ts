import { defineStore } from 'pinia'
import { ref, watchEffect } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  const theme = ref<'light' | 'dark'>('light')

  // 初始化主题
  async function initTheme() {
    return new Promise<void>((resolve) => {
      if (typeof localStorage !== 'undefined') {
        const savedTheme = localStorage.getItem('theme')
        if (savedTheme === 'light' || savedTheme === 'dark') {
          theme.value = savedTheme
        } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
          theme.value = 'dark'
        }
      }

      // 确保DOM更新完成
      setTimeout(resolve, 10)
    })
  }

  // 监听系统主题变化
  watchEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', theme.value === 'dark')
    }
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('theme', theme.value)
    }
  })

  function toggleTheme() {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
  }

  return { theme, toggleTheme, initTheme }
})
