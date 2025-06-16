import { computed, watch } from 'vue'
import { usePlayerStore } from '@/stores/playerStore'

export default function useRotationAnimation() {
  const { state: playerState } = usePlayerStore()
  const ROTATION_SPEED = 1.5 // 度数/秒

  const accumulatedRotation = computed(() => playerState.currentTime * ROTATION_SPEED)

  const currentRotation = computed(() => ({
    rotate: accumulatedRotation.value % 360,
    transition: {
      duration: 0.2,
      ease: 'linear',
    },
  }))

  watch(
    () => playerState.isPlaying,
    (isPlaying) => {
      if (!isPlaying) {
        playerState.currentTime = playerState.currentTime
      }
    },
  )

  return {
    currentRotation,
  }
}
