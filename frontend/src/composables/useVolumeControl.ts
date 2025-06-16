import { ref, watch, onUnmounted } from 'vue'

export default function useVolumeControl(audioElement?: HTMLAudioElement) {
  const volume = ref(1)
  const showVolumeControl = ref(false)
  let volumeHideTimeout: ReturnType<typeof setTimeout> | null = null

  const toggleVolumeControl = () => {
    showVolumeControl.value = !showVolumeControl.value
    if (volumeHideTimeout) {
      clearTimeout(volumeHideTimeout)
      volumeHideTimeout = null
    }
    if (showVolumeControl.value) {
      volumeHideTimeout = setTimeout(() => {
        showVolumeControl.value = false
        volumeHideTimeout = null
      }, 3000)
    }
  }

  const updateVolume = (newVolume: number) => {
    volume.value = Math.max(0, Math.min(1, newVolume))
    if (audioElement) {
      audioElement.volume = volume.value
    }
  }

  const setAudioElement = (element: HTMLAudioElement) => {
    element.volume = volume.value
  }

  // 监听音量变化并同步到音频元素
  watch(volume, (newVolume) => {
    if (audioElement) {
      audioElement.volume = newVolume
    }
  })

  // 清理定时器
  onUnmounted(() => {
    if (volumeHideTimeout) {
      clearTimeout(volumeHideTimeout)
      volumeHideTimeout = null
    }
  })

  return {
    volume,
    showVolumeControl,
    toggleVolumeControl,
    updateVolume,
    setAudioElement,
  }
}
