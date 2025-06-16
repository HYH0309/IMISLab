import { defineStore } from 'pinia'
import { reactive } from 'vue'

interface Song {
  name: string
  artist: string
  path: string
}

export const usePlayerStore = defineStore('player', () => {
  const state = reactive({
    isPlaying: false,
    volume: 70,
    currentSong: null as Song | null,
    currentTime: 0,
    duration: 0,
    buffered: 0,
    coverUrl: '/music/cover.jpg',
  })

  let audioElement: HTMLAudioElement | null = null

  const setAudioElement = (el: HTMLAudioElement) => {
    audioElement = el
    audioElement.volume = state.volume / 100
  }

  const togglePlay = () => {
    if (!audioElement) return
    state.isPlaying = !state.isPlaying
    if (state.isPlaying) {
      audioElement.play()
    } else {
      audioElement.pause()
    }
  }

  const setVolume = (vol: number) => {
    state.volume = vol
    if (audioElement) audioElement.volume = vol / 100
  }

  return {
    state,
    setAudioElement,
    togglePlay,
    setVolume,
  }
})
