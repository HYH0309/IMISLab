import type { Component } from 'vue'

interface SortingStep {
  arr: number[]
  activeIndices: number[]
  description?: string
}
interface SortingStats {
  comparisons: number
  swaps: number
  pivotIndex?: number //哨兵牌
  recursionDepth?: number //递归
  currentGap?: number //间隔
}
interface SortingAlgorithm {
  name: string
  doc: Component
  generator: (arr: number[], stats: SortingStats) => Generator<SortingStep>
}

export { SortingAlgorithm, SortingStep, SortingStats }
