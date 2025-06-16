import { defineStore } from 'pinia'
import { reactive } from 'vue'
import type { Item, Cell, DPStep, DPState } from '../types/dp'
import { algorithms } from '@/composables/useDP'
// 生成随机物品
function generateItems(count: number): Item[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    weight: Math.floor(Math.random() * 10) + 1, //至少为1
    value: Math.floor(Math.random() * 5) + 1, //
    selected: false,
  }))
}
function initializeMatrix(rows: number, cols: number): Cell[][] {
  const matrix: Cell[][] = []
  for (let i = 0; i < rows; i++) {
    matrix.push(
      Array.from({ length: cols }, () => ({
        value: 0,
        state: 'default',
      })),
    )
  }
  return matrix
}
// 辅助函数：找到活动单元格的索引
function findActiveCellIndex(matrix: Cell[][]) {
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      if (matrix[i][j].state === 'active') {
        return [i, j]
      }
    }
  }
  return [-1, -1]
}
export const useDPStore = defineStore('dp', () => {
  // 算法实现

  // 状态管理
  const state = reactive({
    matrix: initializeMatrix(6, 16), //可视化
    isDPing: false as boolean,
    isManualMode: false as boolean,
    show: false as boolean,
    stats: {
      capacity: 15, //背包容量
      items: generateItems(5), //物品
      currentStep: 0,
      maxValue: 0,
      remainingCapacity: 15, // 初始剩余容量
    } as DPState,
    speed: 500,
    description: 'description',
    selectedAlgorithm: algorithms[0],
    algorithms: algorithms,
  })

  // 初始化问题

  // 核心逻辑
  let animationFrameId: number | null = null
  let timeoutId: ReturnType<typeof setTimeout> | null = null
  let DPGenerator: Generator<DPStep, void, DPStep>

  const startDPing = () => {
    if (state.isDPing || !state.selectedAlgorithm) return

    // 清理之前的动画
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId)
      animationFrameId = null
    }
    if (timeoutId) {
      clearTimeout(timeoutId)
      timeoutId = null
    }

    state.isDPing = true
    // 保持初始容量不变
    state.stats.currentStep = 0
    state.stats.maxValue = 0
    DPGenerator = state.selectedAlgorithm.generator(state.matrix, state.stats)
    if (!state.isManualMode) {
      const animate = () => {
        const result = DPGenerator.next()
        state.stats.currentStep++
        if (result.done) {
          state.isDPing = false
          animationFrameId = null
          timeoutId = null
          return
        }
        // 只更新当前活动单元格
        const [i, j] = findActiveCellIndex(result.value.matrix)
        if (i >= 0 && j >= 0) {
          state.matrix[i][j] = reactive({ ...result.value.matrix[i][j] })
        }

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
    if (!state.isDPing || !state.isManualMode) return
    const result = DPGenerator.next()
    if (result.done) {
      state.isDPing = false
      return
    }
    state.matrix = result.value.matrix
    if (result.value.description) {
      state.description = result.value.description
    }
    state.stats.currentStep++
  }

  const resetMatrix = () => {
    // 正确清理动画
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId)
      animationFrameId = null
    }
    if (timeoutId) {
      clearTimeout(timeoutId)
      timeoutId = null
    }
    state.isDPing = false
    state.matrix = initializeMatrix(6, 16)
    state.description = 'description'
    state.stats.items = generateItems(5)
    state.stats.currentStep = 0
    state.stats.maxValue = 0
    state.stats.remainingCapacity = state.stats.capacity
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
    state.isDPing = false
  }

  const setSpeed = (newSpeed: number) => {
    state.speed = newSpeed
  }
  const openShow = () => {
    state.show = true
  }
  const closeShow = () => {
    state.show = false
  }
  return {
    state,
    startDPing,
    nextStep,
    resetMatrix,
    cleanup,
    setSpeed,
    openShow,
    closeShow,
  }
})
