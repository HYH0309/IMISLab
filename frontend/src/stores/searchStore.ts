import { defineStore } from 'pinia'
import { reactive } from 'vue'
import { algorithms } from '../composables/useSearch'
import type { SearchAlgorithm, SearchStats, SearchStep } from '../types/search'
import type { CellType } from '../types/search'
function initializeGrid(rows: number, cols: number): CellType[][] {
  const grid = Array(rows)
    .fill(null)
    .map(() => Array(cols).fill('empty') as CellType[])
  grid[0][0] = 'start'
  grid[rows - 1][cols - 1] = 'end'
  return grid
}
export const useSearchStore = defineStore('search', () => {
  const state = reactive({
    grid: initializeGrid(12, 15),
    isSearching: false,
    isManualMode: false,
    show: false,
    currentStep: 0,
    description: 'description',
    stats: {
      visitedNodes: 0,
      pathLength: 0,
      maxNode: 0,
    } as SearchStats,
    speed: 100,
    selectedAlgorithm: algorithms[0] as SearchAlgorithm,
  })

  let animationFrameId: number | null = null
  let timeoutId: ReturnType<typeof setTimeout> | null = null
  let searchGenerator: Generator<SearchStep, void, SearchStep>

  const startSearching = () => {
    // 启动前判断
    if (state.isSearching || !state.selectedAlgorithm) return

    // 清理之前的动画
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId)
      animationFrameId = null
    }
    if (timeoutId) {
      clearTimeout(timeoutId)
      timeoutId = null
    }

    state.isSearching = true
    state.stats = { visitedNodes: 0, pathLength: 0, maxNode: 0 }
    searchGenerator = state.selectedAlgorithm.generator(state.grid, state.stats)

    if (!state.isManualMode) {
      const animate = () => {
        const result = searchGenerator.next()
        if (result.done) {
          state.isSearching = false
          animationFrameId = null
          timeoutId = null
          return
        }

        state.grid = result.value.grid
        if (result.value.description) {
          state.description = result.value.description
        }
        timeoutId = setTimeout(() => {
          animationFrameId = requestAnimationFrame(animate)
        }, state.speed)
      }
      animationFrameId = requestAnimationFrame(animate)
    }
  }
  const nextStep = () => {
    if (!state.isSearching || !state.isManualMode) return

    const result = searchGenerator.next()
    if (result.done) {
      state.isSearching = false
      return
    }
    state.grid = result.value.grid
    state.currentStep++
    if (result.value.description) {
      state.description = result.value.description
    }
  }
  const resetGrid = () => {
    // 正确清理动画
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId)
      animationFrameId = null
    }
    if (timeoutId) {
      clearTimeout(timeoutId)
      timeoutId = null
    }
    state.isSearching = false
    state.currentStep = 0
    state.grid = initializeGrid(12, 15)
    state.description = 'description'
    state.stats = { visitedNodes: 0, pathLength: 0, maxNode: 0 }
  }

  // 添加清理所有动画的方法
  const cleanup = () => {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId)
      animationFrameId = null
    }
    if (timeoutId) {
      clearTimeout(timeoutId)
      timeoutId = null
    }
    state.isSearching = false
  }
  const openShow = () => {
    state.show = true
  }
  const closeShow = () => {
    state.show = false
  }
  return {
    state,
    startSearching,
    nextStep,
    resetGrid,
    cleanup,
    closeShow,
    openShow,
  }
})
