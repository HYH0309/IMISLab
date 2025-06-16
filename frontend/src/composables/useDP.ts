import type { Cell, DPAlgorithm, DPState } from '@/types/dp'
import { defineAsyncComponent, markRaw } from 'vue'

const createAlgorithmFactory = (): DPAlgorithm[] => {
  return [
    {
      name: '0-1背包问题',
      doc: markRaw(defineAsyncComponent(() => import('docs/algorithm/DP01.md'))),
      generator: function* (matrix: Cell[][], state: DPState) {
        // 初始化阶段
        for (let i = 0; i <= state.items.length; i++) {
          for (let j = 0; j <= state.capacity; j++) {
            if (i === 0 || j === 0) {
              matrix[i][j] = { value: 0, state: 'default' }
            }
          }
        }
        // 动态规划计算
        for (let i = 1; i <= state.items.length; i++) {
          for (let j = 1; j <= state.capacity; j++) {
            // 标记当前单元格为活动状态
            matrix[i][j].state = 'active'
            yield { matrix: cloneMatrix(matrix), description: `处理物品 ${i}, 容量 ${j}` }
            matrix[i][j].state = 'default'
            // 计算最优解
            const currentWeight = state.items[i - 1].weight
            const currentValue = state.items[i - 1].value

            // 确保remaining不小于0
            const remaining = Math.max(j - currentWeight, 0)

            // 显示前导单元格状态
            matrix[i - 1][j].state = 'visited'
            if (remaining > 0) {
              matrix[i - 1][remaining].state = 'visited'
            }

            // 精确计算最优解
            const noTakeValue = matrix[i - 1][j].value
            if (currentWeight > j) {
              matrix[i][j].value = matrix[i - 1][j].value
              continue
            }

            const takeValue = matrix[i - 1][remaining].value + currentValue
            state.items[i - 1].selected = takeValue > noTakeValue
            matrix[i][j].value = Math.max(noTakeValue, takeValue)

            // 更新全局最大值
            const newMaxValue = matrix[i][j].value
            if (newMaxValue > (state.maxValue || 0)) {
              state.maxValue = newMaxValue
              state.remainingCapacity = state.capacity - j
              yield {
                matrix: cloneMatrix(matrix),
                description: `发现新最大值: ${newMaxValue}, 剩余容量: ${state.remainingCapacity}`,
              }
            }

            // 重置前导单元格状态
            matrix[i - 1][j].state = 'default'
            if (remaining > 0) {
              matrix[i - 1][remaining].state = 'default'
            }

            // 显示计算结果

            yield {
              matrix: cloneMatrix(matrix),
              description: `最优解: ${matrix[i][j].value}`,
            }

            // 重置状态
            matrix[i][j].state = 'default'
          }
        }

        // 辅助函数：深拷贝矩阵
        function cloneMatrix(matrix: Cell[][]): Cell[][] {
          return matrix.map((row) => row.map((cell) => ({ ...cell })))
        }
      },
    },
  ] as DPAlgorithm[]
}
export const algorithms = createAlgorithmFactory()
