import type { Component } from 'vue'

// 背包问题类型定义
interface Item {
  id: number
  weight: number
  value: number
  selected: boolean
}

interface Cell {
  value: number
  state: 'default' | 'active' | 'visited'
}

// 状态类型
interface DPState {
  capacity: number
  items: Item[]
  currentStep: number
  maxValue: number
  remainingCapacity: number
}

interface DPStep {
  matrix: Cell[][]
  description?: string
}

interface DPAlgorithm {
  name: string
  doc: Component
  generator: (matrix: Cell[][], state: DPState) => Generator<DPStep, void, DPStep>
}
// 事件类型
export { Item, Cell, DPState, DPStep, DPAlgorithm }
