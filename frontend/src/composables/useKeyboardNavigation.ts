/**
 * 键盘导航增强组合式函数
 * 为Vue组件提供完整的键盘导航支持，包含无障碍性和性能优化
 */
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'

export interface KeyboardShortcut {
  key: string
  action: () => void | Promise<void>
  description?: string
  category?: string
  preventDefault?: boolean
  stopPropagation?: boolean
  disabled?: () => boolean
}

export interface KeyboardNavigationOptions {
  /** 是否启用Tab键循环导航 */
  enableTabLoop?: boolean
  /** 是否启用方向键导航 */
  enableArrowKeys?: boolean
  /** 是否启用快捷键 */
  enableShortcuts?: boolean
  /** 自定义快捷键映射 */
  shortcuts?: Record<string, () => void>
  /** 焦点陷阱容器选择器 */
  trapSelector?: string
  /** 是否启用屏幕阅读器公告 */
  announcements?: boolean
  /** 是否启用焦点历史 */
  enableFocusHistory?: boolean
}

export function useKeyboardNavigation(options: KeyboardNavigationOptions = {}) {
  const {
    enableTabLoop = true,
    enableArrowKeys = true,
    enableShortcuts = true,
    shortcuts = {},
    trapSelector,
  } = options

  const currentFocusIndex = ref(0)
  const focusableElements = ref<HTMLElement[]>([])
  const trapContainer = ref<HTMLElement | null>(null)

  /**
   * 获取所有可聚焦的元素
   */
  const getFocusableElements = (container?: HTMLElement): HTMLElement[] => {
    const selectors = [
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'a[href]',
      '[tabindex]:not([tabindex="-1"])',
      '[role="button"]:not([disabled])',
      '[role="tab"]:not([disabled])',
      '[role="menuitem"]:not([disabled])',
    ].join(', ')

    const baseContainer = container || trapContainer.value || document
    return Array.from(baseContainer.querySelectorAll(selectors)) as HTMLElement[]
  }

  /**
   * 更新可聚焦元素列表
   */
  const updateFocusableElements = () => {
    focusableElements.value = getFocusableElements()

    // 如果当前焦点索引超出范围，重置为0
    if (currentFocusIndex.value >= focusableElements.value.length) {
      currentFocusIndex.value = 0
    }
  }

  /**
   * 聚焦到指定索引的元素
   */
  const focusElementAtIndex = (index: number) => {
    if (focusableElements.value.length === 0) return

    // 确保索引在有效范围内
    const validIndex = Math.max(0, Math.min(index, focusableElements.value.length - 1))
    const element = focusableElements.value[validIndex]

    if (element) {
      currentFocusIndex.value = validIndex
      element.focus()
    }
  }

  /**
   * 聚焦到下一个元素
   */
  const focusNext = () => {
    if (focusableElements.value.length === 0) return

    const nextIndex = enableTabLoop
      ? (currentFocusIndex.value + 1) % focusableElements.value.length
      : Math.min(currentFocusIndex.value + 1, focusableElements.value.length - 1)

    focusElementAtIndex(nextIndex)
  }

  /**
   * 聚焦到上一个元素
   */
  const focusPrevious = () => {
    if (focusableElements.value.length === 0) return

    const prevIndex = enableTabLoop
      ? (currentFocusIndex.value - 1 + focusableElements.value.length) %
        focusableElements.value.length
      : Math.max(currentFocusIndex.value - 1, 0)

    focusElementAtIndex(prevIndex)
  }

  /**
   * 聚焦到第一个元素
   */
  const focusFirst = () => {
    focusElementAtIndex(0)
  }

  /**
   * 聚焦到最后一个元素
   */
  const focusLast = () => {
    focusElementAtIndex(focusableElements.value.length - 1)
  }

  /**
   * 查找并聚焦到指定元素
   */
  const focusElement = (element: HTMLElement | string) => {
    if (typeof element === 'string') {
      const targetElement = trapContainer.value?.querySelector(element) as HTMLElement
      if (targetElement) {
        targetElement.focus()
        const index = focusableElements.value.indexOf(targetElement)
        if (index !== -1) {
          currentFocusIndex.value = index
        }
      }
    } else {
      element.focus()
      const index = focusableElements.value.indexOf(element)
      if (index !== -1) {
        currentFocusIndex.value = index
      }
    }
  }

  /**
   * 键盘事件处理器
   */
  const handleKeyDown = (event: KeyboardEvent) => {
    // 处理方向键导航
    if (enableArrowKeys) {
      switch (event.key) {
        case 'ArrowDown':
        case 'ArrowRight':
          event.preventDefault()
          focusNext()
          break
        case 'ArrowUp':
        case 'ArrowLeft':
          event.preventDefault()
          focusPrevious()
          break
        case 'Home':
          event.preventDefault()
          focusFirst()
          break
        case 'End':
          event.preventDefault()
          focusLast()
          break
      }
    }

    // 处理Tab键导航
    if (event.key === 'Tab' && enableTabLoop && trapContainer.value) {
      // 如果在焦点陷阱容器内，处理Tab循环
      const isShiftTab = event.shiftKey

      if (isShiftTab) {
        if (currentFocusIndex.value === 0) {
          event.preventDefault()
          focusLast()
        }
      } else {
        if (currentFocusIndex.value === focusableElements.value.length - 1) {
          event.preventDefault()
          focusFirst()
        }
      }
    }

    // 处理快捷键
    if (enableShortcuts) {
      const key = event.key.toLowerCase()
      const modifiers = []

      if (event.ctrlKey) modifiers.push('ctrl')
      if (event.altKey) modifiers.push('alt')
      if (event.shiftKey) modifiers.push('shift')
      if (event.metaKey) modifiers.push('meta')

      const shortcutKey = modifiers.length > 0 ? `${modifiers.join('+')}+${key}` : key

      if (shortcuts[shortcutKey]) {
        event.preventDefault()
        shortcuts[shortcutKey]()
      }
    }
  }

  /**
   * 焦点事件处理器
   */
  const handleFocus = (event: FocusEvent) => {
    const target = event.target as HTMLElement
    const index = focusableElements.value.indexOf(target)
    if (index !== -1) {
      currentFocusIndex.value = index
    }
  }

  /**
   * 设置焦点陷阱容器
   */
  const setTrapContainer = (container: HTMLElement | string) => {
    if (typeof container === 'string') {
      trapContainer.value = document.querySelector(container) as HTMLElement
    } else {
      trapContainer.value = container
    }

    updateFocusableElements()
  }

  /**
   * 启用焦点陷阱
   */
  const enableTrap = () => {
    if (trapContainer.value) {
      trapContainer.value.addEventListener('keydown', handleKeyDown)
      trapContainer.value.addEventListener('focusin', handleFocus)
      updateFocusableElements()
    }
  }

  /**
   * 禁用焦点陷阱
   */
  const disableTrap = () => {
    if (trapContainer.value) {
      trapContainer.value.removeEventListener('keydown', handleKeyDown)
      trapContainer.value.removeEventListener('focusin', handleFocus)
    }
  }

  /**
   * 重置焦点状态
   */
  const reset = () => {
    currentFocusIndex.value = 0
    updateFocusableElements()
  }

  /**
   * 获取当前聚焦的元素
   */
  const getCurrentFocusedElement = () => {
    return focusableElements.value[currentFocusIndex.value] || null
  }

  // 生命周期管理
  onMounted(() => {
    if (trapSelector) {
      setTrapContainer(trapSelector)
      enableTrap()
    } else {
      // 全局键盘事件监听
      document.addEventListener('keydown', handleKeyDown)
      document.addEventListener('focusin', handleFocus)
    }

    // 初始化可聚焦元素
    nextTick(() => {
      updateFocusableElements()
    })
  })

  onUnmounted(() => {
    disableTrap()
    document.removeEventListener('keydown', handleKeyDown)
    document.removeEventListener('focusin', handleFocus)
  })

  return {
    // 状态
    currentFocusIndex,
    focusableElements,
    trapContainer,

    // 方法
    updateFocusableElements,
    focusElementAtIndex,
    focusNext,
    focusPrevious,
    focusFirst,
    focusLast,
    focusElement,
    setTrapContainer,
    enableTrap,
    disableTrap,
    reset,
    getCurrentFocusedElement,

    // 工具方法
    getFocusableElements,
  }
}

/**
 * 简化的键盘导航钩子，用于基本的Tab循环
 */
export function useSimpleKeyboardNavigation(containerSelector?: string) {
  return useKeyboardNavigation({
    enableTabLoop: true,
    enableArrowKeys: false,
    enableShortcuts: false,
    trapSelector: containerSelector,
  })
}

/**
 * 菜单/列表专用的键盘导航钩子
 */
export function useMenuKeyboardNavigation(
  containerSelector?: string,
  shortcuts?: Record<string, () => void>,
) {
  return useKeyboardNavigation({
    enableTabLoop: true,
    enableArrowKeys: true,
    enableShortcuts: true,
    shortcuts: {
      enter: () => {
        const current = document.activeElement as HTMLElement
        if (current) current.click()
      },
      space: () => {
        const current = document.activeElement as HTMLElement
        if (current) current.click()
      },
      escape: () => {
        const current = document.activeElement as HTMLElement
        if (current) current.blur()
      },
      ...shortcuts,
    },
    trapSelector: containerSelector,
  })
}

/**
 * 对话框专用的键盘导航钩子
 */
export function useDialogKeyboardNavigation(containerSelector: string, onClose?: () => void) {
  return useKeyboardNavigation({
    enableTabLoop: true,
    enableArrowKeys: false,
    enableShortcuts: true,
    shortcuts: {
      escape: () => {
        if (onClose) onClose()
      },
    },
    trapSelector: containerSelector,
  })
}
