<script setup lang="ts">
import { motion } from 'motion-v'
import { usePlayerStore } from '@/stores/playerStore'
import useAudioPlayer from '@/composables/useAudioPlayer'
import useRotationAnimation from '@/composables/useRotationAnimation'
import useDragProgress from '@/composables/useDragProgress'
import useKeyboardControls from '@/composables/useKeyboardControls'
import useButtonScale from '@/composables/useButtonScale'
import { PlayIcon, PauseIcon } from '@heroicons/vue/24/outline'
import { computed, onUnmounted } from 'vue'
import { Z_INDEX } from '@/config/z-index'

const { state: playerState, togglePlay } = usePlayerStore()
const { audioRef, progress, handleSeek } = useAudioPlayer()
const { currentRotation } = useRotationAnimation()

// 进度条拖拽处理 - 使用composable
const handleProgressChange = (value: number) => {
  const mockEvent = {
    target: { value: value.toString() }
  } as Event & { target: HTMLInputElement }
  handleSeek(mockEvent)
}

const { isDragging, startDrag } = useDragProgress(handleProgressChange)

// 键盘控制 - 使用composable
useKeyboardControls({
  onPlay: togglePlay,
  onSeekBackward: (amount = 5) => {
    const newProgress = Math.max(0, progress.value - amount)
    handleProgressChange(newProgress)
  },
  onSeekForward: (amount = 5) => {
    const newProgress = Math.min(100, progress.value + amount)
    handleProgressChange(newProgress)
  }
})

const circleLength = computed(() => 2 * Math.PI * 45)
const strokeDashoffset = computed(() => circleLength.value * (1 - progress.value / 100))

// 按钮缩放动画 - 使用composable
const { buttonScale } = useButtonScale(() => playerState.isPlaying)

// 组件卸载时清理资源
onUnmounted(() => {
  isDragging.value = false
})
</script>

<template>
  <!-- 桌面端音乐播放器 -->
  <div class="music-player-wrapper desktop-player fixed bottom-4 left-4" :style="{ zIndex: Z_INDEX.MUSIC_PLAYER }">
    <audio ref="audioRef" hidden controls></audio>

    <motion.div class="player-container" :animate="currentRotation" :class="{ 'dragging': isDragging }">
      <!-- 唱片图像 -->
      <div class="player-disc">
        <img :src="playerState.coverUrl" class="album-cover" :class="{
          'paused': !playerState.isPlaying,
          'dragging': isDragging
        }" alt="Album cover" />

        <!-- 播放按钮（中心区域） -->
        <motion.button class="play-button" @click.stop="togglePlay" aria-label="Play/Pause"
          :animate="{ scale: buttonScale }" :transition="{ type: 'spring' }">
          <transition name="fade-zoom" mode="out-in">
            <component :is="playerState.isPlaying ? PauseIcon : PlayIcon" class="play-icon"
              :key="playerState.isPlaying ? 'playing' : 'paused'" />
          </transition>
        </motion.button>

        <!-- 进度环背景轨道 -->
        <svg class="progress-ring" viewBox="0 0 100 100">
          <circle class="progress-bg" cx="50" cy="50" r="45" stroke-width="8" fill="transparent" />
          <circle class="progress-track" cx="50" cy="50" r="45" stroke-width="4" fill="transparent" />
          <circle class="progress-bar" cx="50" cy="50" r="45" stroke-width="4" stroke-linecap="round"
            :stroke-dasharray="circleLength" :stroke-dashoffset="strokeDashoffset" />
          <defs>
            <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#3B82F6" />
              <stop offset="100%" stop-color="#60A5FA" />
            </linearGradient>
          </defs>
        </svg>

        <!-- 进度条控件（外环区域） -->
        <input type="range" class="progress-input" min="0" max="100" v-model="progress" @pointerdown="startDrag" />
      </div>
    </motion.div>
  </div>

  <!-- 移动端简化音乐播放器（左上角） -->
  <div class="mobile-player fixed top-4 left-4 md:hidden" :style="{ zIndex: Z_INDEX.MUSIC_PLAYER }">
    <motion.button class="mobile-play-button" @click.stop="togglePlay" aria-label="Play/Pause"
      :animate="{ scale: buttonScale }" :transition="{ type: 'spring' }">
      <div class="mobile-button-bg"></div>
      <transition name="fade-zoom" mode="out-in">
        <component :is="playerState.isPlaying ? PauseIcon : PlayIcon" class="mobile-play-icon"
          :key="playerState.isPlaying ? 'playing' : 'paused'" />
      </transition>
    </motion.button>
  </div>
</template>

<style scoped>
/* 桌面端音乐播放器 */
.desktop-player {
  /* 确保在导航栏下方 */
  z-index: var(--z-music-player, 35);
}

/* 在移动端隐藏桌面播放器 */
@media (max-width: 768px) {
  .desktop-player {
    display: none;
  }
}

/* 移动端简化播放器 */
.mobile-player {
  z-index: var(--z-music-player, 35);
}

/* 在桌面端隐藏移动播放器 */
@media (min-width: 769px) {
  .mobile-player {
    display: none;
  }
}

.mobile-play-button {
  @apply relative w-12 h-12 flex items-center justify-center;
  @apply transition-all duration-200 ease-out;
  @apply active:scale-95;
  border: none;
  background: transparent;
  cursor: pointer;
  touch-action: manipulation;
}

.mobile-button-bg {
  @apply absolute inset-0 rounded-full;
  @apply bg-gradient-to-br from-blue-500 to-blue-600;
  @apply shadow-lg border border-white/20;
  @apply backdrop-blur-sm;
  background: rgba(59, 130, 246, 0.9);
  box-shadow:
    0 4px 12px rgba(59, 130, 246, 0.3),
    0 2px 6px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.mobile-play-icon {
  @apply relative z-10 text-white transition-all duration-200;
  @apply w-5 h-5;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2));
}

/* 移动端播放器悬停效果（仅触摸设备） */
@media (hover: hover) {
  .mobile-play-button:hover .mobile-button-bg {
    background: rgba(59, 130, 246, 1);
    box-shadow:
      0 6px 16px rgba(59, 130, 246, 0.4),
      0 4px 8px rgba(0, 0, 0, 0.15),
      inset 0 1px 0 rgba(255, 255, 255, 0.25);
  }
}

/* 原有的桌面端播放器样式 */


.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease-out;
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.slide-up-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.player-container {
  @apply relative transition-transform;
  @apply w-26 h-26 md:w-26 md:h-26 sm:w-20 sm:h-20;
}

.player-container.dragging {
  @apply scale-105 sm:scale-110;
}

.player-disc {
  @apply relative w-full h-full;
}

.album-cover {
  @apply w-full h-full rounded-full object-cover border-2 border-border shadow-lg transition-all duration-300;
  will-change: transform;
  backface-visibility: hidden;
  box-shadow: 0 4px 24px 0 rgba(59, 130, 246, 0.10);
  transition: box-shadow 0.3s, filter 0.3s;
}

/* 移动端边框调整 */
@media (max-width: 640px) {
  .album-cover {
    @apply border;
    box-shadow: 0 2px 12px 0 rgba(59, 130, 246, 0.08);
  }
}

.album-cover.paused {
  filter: grayscale(30%);
  box-shadow: 0 2px 8px 0 rgba(59, 130, 246, 0.06);
}

.album-cover.dragging {
  box-shadow: 0 8px 32px 0 rgba(16, 185, 129, 0.18);
  filter: brightness(1.08);
}

/* 移动端拖拽效果调整 */
@media (max-width: 640px) {
  .album-cover.dragging {
    box-shadow: 0 4px 16px 0 rgba(16, 185, 129, 0.15);
  }
}

.play-button {
  @apply absolute inset-0 flex items-center justify-center z-10 bg-background/10 rounded-full hover:bg-background/20 transition-colors;
  clip-path: circle(30% at 50% 50%);
  transition: background 0.2s;
}

/* 移动端播放按钮调整 */
@media (max-width: 640px) {
  .play-button {
    clip-path: circle(35% at 50% 50%);
  }
}

.play-icon {
  @apply text-text transition-all duration-300 ease-DEFAULT;
  @apply w-10 h-10 md:w-10 md:h-10 sm:w-6 sm:h-6;
}

.fade-zoom-enter-active,
.fade-zoom-leave-active {
  transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.fade-zoom-enter-from,
.fade-zoom-leave-to {
  opacity: 0;
  transform: scale(0.7);
}

.play-icon.playing {
  @apply scale-110 text-primary/80;
}

/* 移动端播放图标调整 */
@media (max-width: 640px) {
  .play-icon.playing {
    @apply scale-125;
  }
}

.progress-ring {
  @apply absolute inset-0 transform -rotate-90;
}

.progress-bg {
  stroke: #e0e7ef;
  opacity: 0.5;
}

.dark .progress-bg {
  stroke: #334155;
  opacity: 0.6;
}

.progress-track {
  @apply stroke-background/10 fill-transparent;
}

.progress-bar {
  @apply fill-transparent;
  stroke: url(#progress-gradient);
  transition: stroke-dashoffset 0.2s linear;
}

.progress-input {
  @apply absolute inset-0 opacity-0 cursor-pointer;
  clip-path: circle(70% at 50% 50%);
}

/* 移动端进度输入区域调整 */
@media (max-width: 640px) {
  .progress-input {
    clip-path: circle(75% at 50% 50%);
  }
}

/* 移动端横屏适配 */
@media (max-width: 896px) and (orientation: landscape) {
  .player-container {
    @apply w-16 h-16;
  }

  .song-info {
    @apply max-w-32 text-xs;
  }

  .play-icon {
    @apply w-4 h-4;
  }
}

/* 触摸设备优化 */
@media (hover: none) and (pointer: coarse) {
  .play-button {
    @apply bg-background/15;
  }

  .album-cover {
    transition: filter 0.2s, transform 0.2s;
  }

  .player-container.dragging {
    @apply scale-110;
    transition: transform 0.1s ease-out;
  }
}
</style>
