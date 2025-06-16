import { ref, onUnmounted } from 'vue'

export default function useAnimatedStats(initialValues: Record<string, number>) {
  const animatedValues = ref<Record<string, number>>({ ...initialValues })
  const activeAnimations = new Set<number>() // 跟踪所有活动的动画帧ID

  const startAnimation = (newValues: Record<string, number>) => {
    // 清理之前的动画
    cleanup()

    Object.keys(newValues).forEach((key) => {
      const startValue = animatedValues.value[key]
      const endValue = newValues[key]
      const duration = 100
      const startTime = performance.now()

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime
        const progress = Math.min(elapsed / duration, 1)
        animatedValues.value[key] = Math.round(startValue + (endValue - startValue) * progress)

        if (progress < 1) {
          const frameId = requestAnimationFrame(animate)
          activeAnimations.add(frameId)
        }
      }

      const frameId = requestAnimationFrame(animate)
      activeAnimations.add(frameId)
    })
  }

  const cleanup = () => {
    // 取消所有活动的动画帧
    activeAnimations.forEach((frameId) => {
      cancelAnimationFrame(frameId)
    })
    activeAnimations.clear()
  }

  // 自动在组件卸载时清理
  onUnmounted(() => {
    cleanup()
  })

  return {
    animatedValues,
    startAnimation,
    cleanup, // 允许手动清理
  }
}
