import { ref, onMounted } from 'vue'
import { usePlayerStore } from '@/stores/playerStore'

export default function useAudioPlayer() {
  const { state: playerState, setAudioElement } = usePlayerStore()
  const audioRef = ref<HTMLAudioElement | null>(null)
  const progress = ref(0)

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`
  }

  const handleSeek = (e: Event) => {
    if (!audioRef.value) return
    const target = e.target as HTMLInputElement
    const seekTime = (Number(target.value) / 100) * audioRef.value.duration
    audioRef.value.currentTime = seekTime
  }

  onMounted(() => {
    if (audioRef.value) {
      audioRef.value.src = '/music/song1.mp3'
      setAudioElement(audioRef.value)

      audioRef.value.addEventListener('timeupdate', () => {
        if (audioRef.value) {
          playerState.currentTime = audioRef.value.currentTime
          playerState.duration = audioRef.value.duration
          progress.value = (playerState.currentTime / playerState.duration) * 100
        }
      })
    }
  })

  return {
    audioRef,
    progress,
    formatTime,
    handleSeek,
  }
}
