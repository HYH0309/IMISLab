import type { Component } from 'vue'

type CellType = 'empty' | 'wall' | 'visited' | 'path' | 'start' | 'end'

interface SearchStats {
  visitedNodes: number
  pathLength: number
  maxNode: number
}

interface SearchStep {
  grid: CellType[][]
  description?: string
}

interface SearchAlgorithm {
  name: string
  doc: Component
  generator: (grid: CellType[][], stats: SearchStats) => Generator<SearchStep, void, SearchStep>
}

export { SearchAlgorithm, SearchStats, SearchStep, CellType }
