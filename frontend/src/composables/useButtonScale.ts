import { ref, watch, onUnmounted } from 'vue'

export default function useButtonScale(trigger: () => boolean) {
  const buttonScale = ref(1)
  let scaleTimeoutId: ReturnType<typeof setTimeout> | null = null

  watch(trigger, () => {
    if (scaleTimeoutId) {
      clearTimeout(scaleTimeoutId)
    }

    buttonScale.value = 1.2
    scaleTimeoutId = setTimeout(() => {
      buttonScale.value = 1
      scaleTimeoutId = null
    }, 200)
  })

  onUnmounted(() => {
    if (scaleTimeoutId) {
      clearTimeout(scaleTimeoutId)
      scaleTimeoutId = null
    }
  })

  return { buttonScale }
}
