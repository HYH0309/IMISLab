import { ref, onUnmounted } from 'vue'

export default function useDragProgress(onProgressChange: (value: number) => void) {
  const isDragging = ref(false)
  const dragElement = ref<HTMLElement | null>(null)

  const startDrag = (e: PointerEvent) => {
    isDragging.value = true
    dragElement.value = e.currentTarget as HTMLElement
    const rect = dragElement.value.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    const handleMove = (moveEvent: PointerEvent) => {
      if (!isDragging.value || !dragElement.value) return

      const angle = Math.atan2(moveEvent.clientY - centerY, moveEvent.clientX - centerX)

      // 改进角度计算，从顶部开始（-90度）
      const normalizedAngle = (angle + Math.PI / 2 + 2 * Math.PI) % (2 * Math.PI)
      const progressValue = Math.max(0, Math.min(100, (normalizedAngle / (2 * Math.PI)) * 100))

      onProgressChange(progressValue)
    }

    const handleEnd = () => {
      isDragging.value = false
      dragElement.value = null
      document.removeEventListener('pointermove', handleMove)
      document.removeEventListener('pointerup', handleEnd)
      document.removeEventListener('pointercancel', handleEnd)
    }

    document.addEventListener('pointermove', handleMove, { passive: true })
    document.addEventListener('pointerup', handleEnd)
    document.addEventListener('pointercancel', handleEnd)
  }

  // 线性拖拽（用于滑块控件）
  const startLinearDrag = (
    e: PointerEvent,
    direction: 'horizontal' | 'vertical' = 'horizontal',
  ) => {
    isDragging.value = true
    dragElement.value = e.currentTarget as HTMLElement
    const rect = dragElement.value.getBoundingClientRect()

    const handleMove = (moveEvent: PointerEvent) => {
      if (!isDragging.value || !dragElement.value) return

      let progressValue: number
      if (direction === 'horizontal') {
        const x = moveEvent.clientX - rect.left
        progressValue = Math.max(0, Math.min(100, (x / rect.width) * 100))
      } else {
        const y = moveEvent.clientY - rect.top
        progressValue = Math.max(0, Math.min(100, (1 - y / rect.height) * 100))
      }

      onProgressChange(progressValue)
    }

    const handleEnd = () => {
      isDragging.value = false
      dragElement.value = null
      document.removeEventListener('pointermove', handleMove)
      document.removeEventListener('pointerup', handleEnd)
      document.removeEventListener('pointercancel', handleEnd)
    }

    document.addEventListener('pointermove', handleMove, { passive: true })
    document.addEventListener('pointerup', handleEnd)
    document.addEventListener('pointercancel', handleEnd)
  }

  onUnmounted(() => {
    isDragging.value = false
    dragElement.value = null
  })

  return {
    isDragging,
    startDrag,
    startLinearDrag,
  }
}
