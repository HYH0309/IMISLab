import { onMounted, onUnmounted } from 'vue'

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
    disabled = false,
  } = options

  const handleKeyboard = (e: KeyboardEvent) => {
    // 如果禁用或者输入框处于焦点状态，则跳过
    if (
      disabled ||
      document.activeElement?.tagName === 'INPUT' ||
      document.activeElement?.tagName === 'TEXTAREA'
    ) {
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

  return {
    // 可以返回一些控制方法，如动态启用/禁用
  }
}
