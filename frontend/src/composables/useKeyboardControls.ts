import { onMounted, onUnmounted, readonly, ref } from 'vue'

interface KeyboardControlsOptions {
  onPlay?: () => void
  onSeekBackward?: (amount?: number) => void
  onSeekForward?: (amount?: number) => void
  onVolumeUp?: () => void
  onVolumeDown?: () => void
  onMute?: () => void
  seekAmount?: number
  disabled?: boolean
}

export default function useKeyboardControls(options: KeyboardControlsOptions = {}) {
  const {
    onPlay,
    onSeekBackward,
    onSeekForward,
    onVolumeUp,
    onVolumeDown,
    onMute,
    seekAmount = 5,
    disabled: initialDisabled = false,
  } = options

  // 使用 ref 来控制启用/禁用状态
  const isEnabled = ref(!initialDisabled)

  const handleKeyboard = (e: KeyboardEvent) => {
    if (!isEnabled.value) {
      return
    }

    const activeElement = document.activeElement as HTMLElement

    // 检测是否在可编辑元素中
    const isInEditableElement =
      activeElement?.tagName === 'INPUT' ||
      activeElement?.tagName === 'TEXTAREA' ||
      activeElement?.contentEditable === 'true' ||
      // CodeMirror 6 (vue-codemirror)
      activeElement?.closest('.cm-editor') ||
      activeElement?.closest('.cm-content') ||
      activeElement?.closest('.cm-focused') ||
      // 其他代码编辑器
      activeElement?.closest('.codemirror') ||
      activeElement?.closest('.monaco-editor') ||
      activeElement?.closest('.ace_editor') ||
      // 通用可编辑区域
      activeElement?.getAttribute('role') === 'textbox' ||
      activeElement?.closest('[role="textbox"]') ||
      // 如果你知道OJ编辑器的具体类名，可以添加
      activeElement?.closest('.oj-code-editor') ||
      activeElement?.closest('#code-editor')

    if (isInEditableElement) {
      return
    }

    // 防止页面滚动等默认行为
    const preventKeys = ['Space', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown']
    if (preventKeys.includes(e.code)) {
      e.preventDefault()
    }

    switch (e.code) {
      case 'Space':
        onPlay?.()
        break
      case 'ArrowLeft':
        onSeekBackward?.(seekAmount)
        break
      case 'ArrowRight':
        onSeekForward?.(seekAmount)
        break
      case 'ArrowUp':
        onVolumeUp?.()
        break
      case 'ArrowDown':
        onVolumeDown?.()
        break
      case 'KeyM':
        onMute?.()
        break
    }
  }

  onMounted(() => {
    document.addEventListener('keydown', handleKeyboard)
  })

  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeyboard)
  })

  // 返回控制方法
  return {
    isEnabled: readonly(isEnabled),
    enable: () => {
      isEnabled.value = true
    },
    disable: () => {
      isEnabled.value = false
    },
    toggle: () => {
      isEnabled.value = !isEnabled.value
    },
    setEnabled: (enabled: boolean) => {
      isEnabled.value = enabled
    },
  }
}
