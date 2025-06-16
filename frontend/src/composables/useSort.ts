import type { SortingAlgorithm, SortingStats, SortingStep } from '../types/sort'

import { defineAsyncComponent, markRaw } from 'vue'
const createAlgorithmFactory = (): SortingAlgorithm[] => {
  // 公共工具函数
  const swap = (arr: number[], i: number, j: number, stats: SortingStats) => {
    stats.swaps++
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }

  return [
    {
      name: '冒泡排序',
      doc: markRaw(defineAsyncComponent(() => import('docs/algorithm/bubble.md'))),
      generator: function* (arr: number[], stats: SortingStats) {
        const array = [...arr]
        stats.recursionDepth = 0
        let swapped = true

        for (let i = 0; i < array.length && swapped; i++) {
          swapped = false
          for (let j = 0; j < array.length - i - 1; j++) {
            stats.comparisons++
            yield {
              arr: [...array],
              activeIndices: [j, j + 1],
              description: `比较 ${array[j]} 和 ${array[j + 1]}`,
            }

            if (array[j] > array[j + 1]) {
              swap(array, j, j + 1, stats)
              swapped = true
              yield {
                arr: [...array],
                activeIndices: [j, j + 1],
                description: `交换 ${array[j + 1]} 和 ${array[j]}`,
              }
            }
          }
        }
        return { arr: array, activeIndices: [] }
      },
    },
    {
      name: '快速排序',
      doc: markRaw(defineAsyncComponent(() => import('docs/algorithm/quick.md'))),
      generator: function* (arr: number[], stats: SortingStats) {
        const array = [...arr]

        function* quickSort(low: number, high: number): Generator<SortingStep, void, void> {
          stats.recursionDepth = (stats.recursionDepth || 0) + 1
          if (low < high) {
            const mid = Math.floor((low + high) / 2)
            stats.pivotIndex = mid
            yield { arr: [...array], activeIndices: [mid] }

            const partitionIndex = yield* partition(low, high)
            stats.pivotIndex = partitionIndex
            yield* quickSort(low, partitionIndex - 1)
            yield* quickSort(partitionIndex + 1, high)
          }
        }

        function* partition(low: number, high: number) {
          const mid = Math.floor((low + high) / 2)
          const pivot = array[mid]
          stats.pivotIndex = mid

          if (mid !== high) {
            swap(array, mid, high, stats)
            yield { arr: [...array], activeIndices: [mid, high] }
          }

          let i = low - 1
          let j = high

          while (true) {
            while (array[++i] < pivot) {
              stats.comparisons++
              yield {
                arr: [...array],
                activeIndices: [i, high],
                description: `比较 ${array[i]} 和 pivot ${pivot}`,
              }
            }
            while (j > low && array[--j] > pivot) {
              stats.comparisons++
              yield {
                arr: [...array],
                activeIndices: [j, high],
                description: `比较 ${array[j]} 和 pivot ${pivot}`,
              }
            }
            if (i >= j) break

            swap(array, i, j, stats)
            yield {
              arr: [...array],
              activeIndices: [i, j, high],
              description: `交换 ${array[i]} 和 ${array[j]}`,
            }
          }

          if (i !== high) {
            swap(array, i, high, stats)
            yield {
              arr: [...array],
              activeIndices: [i, high],
              description: `将pivot ${array[high]} 放回正确位置 ${i}`,
            }
          }
          return i
        }

        yield* quickSort(0, arr.length - 1)
        return { arr, activeIndices: [] }
      },
    },
    {
      name: '希尔排序',
      doc: markRaw(defineAsyncComponent(() => import('docs/algorithm/shell.md'))),
      generator: function* (arr: number[], stats: SortingStats) {
        const array = [...arr]
        let gap = 1
        // 生成初始间隔序列（Knuth序列）
        while (gap < array.length / 3) gap = gap * 3 + 1

        while (gap > 0) {
          stats.currentGap = gap
          // 使用交换的插入排序逻辑
          for (let i = gap; i < array.length; i++) {
            let j = i

            yield {
              arr: [...array],
              activeIndices: [i],
              description: `处理间隔为${gap}的子序列元素 ${array[i]}`,
            }

            // 使用交换代替元素移动
            while (j >= gap) {
              const compareIndex = j - gap
              stats.comparisons++
              yield {
                arr: [...array],
                activeIndices: [j, compareIndex],
                description: `比较 ${array[compareIndex]} 和 ${array[j]}`,
              }

              if (array[compareIndex] <= array[j]) break

              swap(array, j, compareIndex, stats)
              yield {
                arr: [...array],
                activeIndices: [compareIndex, j],
                description: `交换 ${array[j]} 和 ${array[compareIndex]}`,
              }

              j -= gap
            }
          }
          gap = Math.floor(gap / 3)
        }
        return { arr: array, activeIndices: [] }
      },
    },
    {
      name: '插入排序',
      doc: markRaw(defineAsyncComponent(() => import('docs/algorithm/insert.md'))),
      generator: function* (arr: number[], stats: SortingStats) {
        const array = [...arr]

        for (let i = 1; i < array.length; i++) {
          let j = i

          yield {
            arr: [...array],
            activeIndices: [i],
            description: `开始处理元素 ${array[i]}`,
          }

          while (j > 0) {
            stats.comparisons++
            yield {
              arr: [...array],
              activeIndices: [j, j - 1],
              description: `比较 ${array[j - 1]} 和 ${array[j]}`,
            }

            if (array[j - 1] <= array[j]) break

            swap(array, j, j - 1, stats)
            yield {
              arr: [...array],
              activeIndices: [j - 1],
              description: `交换 ${array[j - 1]} 和 ${array[j]}`,
            }

            j--
          }
        }

        return { arr: array, activeIndices: [] }
      },
    },
  ]
}

export const algorithms = createAlgorithmFactory()
