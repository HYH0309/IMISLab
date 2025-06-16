import type { SearchAlgorithm } from '@/types/search'
import { markRaw, defineAsyncComponent } from 'vue'
const createAlgorithmFactory = (): SearchAlgorithm[] => {
  const directions = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ]

  const findStartPoint = (grid: string[][]) => {
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[0].length; j++) {
        if (grid[i][j] === 'start') return [i, j]
      }
    }
    return [0, 0]
  }

  return [
    {
      name: 'BFS',
      doc: markRaw(defineAsyncComponent(() => import('docs/algorithm/BFS.md'))),
      generator: function* (grid, stats) {
        const rows = grid.length
        const cols = grid[0].length
        const visited = Array(rows)
          .fill(0)
          .map(() => Array(cols).fill(false))
        const parent = Array(rows)
          .fill(0)
          .map(() => Array(cols).fill(null))
        const queue = []
        let found = false
        let endX = -1,
          endY = -1

        stats.visitedNodes = 0
        stats.maxNode = 0
        stats.pathLength = 0

        const [startX, startY] = findStartPoint(grid)

        queue.push([startX, startY])
        visited[startX][startY] = true
        parent[startX][startY] = null
        stats.maxNode = 1

        while (queue.length > 0 && !found) {
          const [x, y] = queue.shift()! as number[]

          for (const [dx, dy] of directions) {
            const nx = x + dx
            const ny = y + dy

            if (nx >= 0 && nx < rows && ny >= 0 && ny < cols && !visited[nx][ny]) {
              if (grid[nx][ny] === 'end') {
                parent[nx][ny] = [x, y]
                endX = nx
                endY = ny
                found = true
                break
              }

              if (grid[nx][ny] === 'empty') {
                visited[nx][ny] = true
                parent[nx][ny] = [x, y]
                queue.push([nx, ny])
                grid[nx][ny] = 'visited'
                stats.visitedNodes++
                if (queue.length > stats.maxNode) {
                  stats.maxNode = queue.length
                }
                yield { grid: [...grid], stats, description: `访问节点 (${nx}, ${ny})` }
              }
            }
          }
        }

        if (found) {
          let current = [endX, endY]
          const path = []
          while (true) {
            const [cx, cy] = current
            const p = parent[cx][cy]
            if (p === null) {
              path.pop()
              break
            }
            path.push(p)
            current = p
          }

          for (const [x, y] of path.reverse()) {
            grid[x][y] = 'path'
            yield { grid: [...grid], stats, description: `标记路径 (${x}, ${y})` }
          }

          stats.pathLength = path.length
          yield { grid: [...grid], stats, description: `找到终点! 路径长度: ${path.length}` }
        } else {
          yield { grid, stats, description: '未找到路径' }
        }
      },
    },
    {
      name: 'DFS',
      doc: markRaw(defineAsyncComponent(() => import('docs/algorithm/DFS.md'))),
      generator: function* (grid, stats) {
        const rows = grid.length
        const cols = grid[0].length
        const visited = Array.from({ length: rows }, () => Array(cols).fill(false))
        const parent = Array.from({ length: rows }, () => Array(cols).fill(null))
        const stack = []
        let found = false

        // 初始化统计信息
        stats.visitedNodes = 0
        stats.maxNode = 0
        stats.pathLength = 0

        const [startX, startY] = findStartPoint(grid)

        // 初始化起点
        stack.push([startX, startY])
        visited[startX][startY] = true
        stats.visitedNodes = 1 // 计入起点
        stats.maxNode = 1

        while (stack.length > 0 && !found) {
          const [x, y] = stack.pop() as number[]

          // 优先处理四个方向（可根据需求调整顺序）
          for (const [dx, dy] of directions.reverse()) {
            // 使用反向保证处理顺序
            const nx = x + dx
            const ny = y + dy

            if (nx >= 0 && nx < rows && ny >= 0 && ny < cols) {
              if (grid[nx][ny] === 'end') {
                parent[nx][ny] = [x, y]
                found = true
                break
              }

              if (grid[nx][ny] === 'empty' && !visited[nx][ny]) {
                visited[nx][ny] = true
                parent[nx][ny] = [x, y]
                stack.push([nx, ny])
                stats.visitedNodes++
                stats.maxNode = Math.max(stats.maxNode, stack.length)
                grid[nx][ny] = 'visited'
                yield { grid: [...grid], stats, description: `访问节点 (${nx}, ${ny})` }
              }
            }
          }
        }

        // 路径回溯优化
        if (found) {
          const path = []
          const [endX, endY] = grid.reduce(
            (acc, row, i) => {
              const j = row.indexOf('end')
              return j >= 0 ? [i, j] : acc
            },
            [0, 0],
          )

          let current = [endX, endY]
          const [startX, startY] = findStartPoint(grid)
          while (current && (current[0] !== startX || current[1] !== startY)) {
            path.push(current)
            current = parent[current[0]][current[1]]
          }

          // 反向并标记路径
          for (const [x, y] of path.reverse()) {
            grid[x][y] = 'path'
            yield { grid: [...grid], stats, description: `标记路径 (${x}, ${y})` }
          }

          stats.pathLength = path.length
          yield { grid: [...grid], stats, description: `找到路径! 长度: ${path.length}` }
        } else {
          yield { grid, stats, description: '未找到可行路径' }
        }
      },
    },
    {
      name: '双向BFS',
      doc: markRaw(defineAsyncComponent(() => import('docs/algorithm/DBFS.md'))),
      generator: function* (grid, stats) {
        const rows = grid.length
        const cols = grid[0].length
        const visitedFromStart = Array(rows)
          .fill(0)
          .map(() => Array(cols).fill(false))
        const visitedFromEnd = Array(rows)
          .fill(0)
          .map(() => Array(cols).fill(false))
        const parentFromStart = Array(rows)
          .fill(0)
          .map(() => Array(cols).fill(null))
        const parentFromEnd = Array(rows)
          .fill(0)
          .map(() => Array(cols).fill(null))
        const queueStart = []
        const queueEnd = []
        let found = false
        let meetingX = -1,
          meetingY = -1

        stats.visitedNodes = 0
        stats.maxNode = 0
        stats.pathLength = 0

        // 查找起点和终点
        let startX = 0,
          startY = 0
        let endX = 0,
          endY = 0
        for (let i = 0; i < rows; i++) {
          for (let j = 0; j < cols; j++) {
            if (grid[i][j] === 'start') {
              startX = i
              startY = j
            } else if (grid[i][j] === 'end') {
              endX = i
              endY = j
            }
          }
        }

        // 初始化双向队列
        queueStart.push([startX, startY])
        visitedFromStart[startX][startY] = true
        parentFromStart[startX][startY] = null

        queueEnd.push([endX, endY])
        visitedFromEnd[endX][endY] = true
        parentFromEnd[endX][endY] = null

        stats.maxNode = 2 // 两个队列各有一个节点

        while ((queueStart.length > 0 || queueEnd.length > 0) && !found) {
          // 交替扩展方向
          const directionsToProcess = [
            {
              queue: queueStart,
              visited: visitedFromStart,
              otherVisited: visitedFromEnd,
              isStart: true,
            },
            {
              queue: queueEnd,
              visited: visitedFromEnd,
              otherVisited: visitedFromStart,
              isStart: false,
            },
          ]

          for (const { queue, visited, otherVisited, isStart } of directionsToProcess) {
            if (queue.length === 0) continue

            const [x, y] = queue.shift()! as number[]

            // 相遇检测移动到节点处理前
            if (otherVisited[x][y]) {
              meetingX = x
              meetingY = y
              found = true
              break
            }

            for (const [dx, dy] of directions) {
              const nx = x + dx
              const ny = y + dy

              if (nx >= 0 && nx < rows && ny >= 0 && ny < cols && !visited[nx][ny]) {
                // 放宽可访问条件
                if (grid[nx][ny] !== 'wall') {
                  // 允许访问任何非墙节点
                  visited[nx][ny] = true
                  if (isStart) {
                    parentFromStart[nx][ny] = [x, y]
                  } else {
                    parentFromEnd[nx][ny] = [x, y]
                  }
                  queue.push([nx, ny])

                  // 更新网格状态（仅标记非特殊节点）
                  if (grid[nx][ny] !== 'start' && grid[nx][ny] !== 'end') {
                    grid[nx][ny] = 'visited'
                  }

                  stats.visitedNodes++
                  if (queueStart.length + queueEnd.length > stats.maxNode) {
                    stats.maxNode = queueStart.length + queueEnd.length
                  }
                  yield {
                    grid: [...grid],
                    stats,
                    description: `${isStart ? '起点' : '终点'}方向访问节点 (${nx}, ${ny})`,
                  }

                  // 实时相遇检测
                  if (otherVisited[nx][ny]) {
                    meetingX = nx
                    meetingY = ny
                    found = true
                    break
                  }
                }
              }
            }
            if (found) break
          }
        }

        if (found) {
          // 修正路径合并逻辑
          const buildPath = (current: number[], parentMap: number[][][]) => {
            const path = []
            let [cx, cy] = current
            while (parentMap[cx][cy]) {
              const p = parentMap[cx][cy]
              path.push(p)
              ;[cx, cy] = p
            }
            return path
          }

          const startPath = buildPath([meetingX, meetingY], parentFromStart)
          const endPath = buildPath([meetingX, meetingY], parentFromEnd)

          // 合并路径时排除重复点
          const fullPath = [...startPath.reverse(), [meetingX, meetingY], ...endPath]

          // 绘制路径
          for (const [x, y] of fullPath) {
            if (grid[x][y] !== 'start' && grid[x][y] !== 'end') {
              grid[x][y] = 'path'
              yield {
                grid: [...grid],
                stats,
                description: `标记路径 (${x}, ${y})`,
              }
            }
          }

          // 正确计算路径长度（移动次数）
          stats.pathLength = fullPath.length - 1 // 减去起点
          yield {
            grid: [...grid],
            stats,
            description: `找到路径! 总长度: ${stats.pathLength}`,
          }
        } else {
          yield { grid, stats, description: '未找到路径' }
        }
      },
    },
  ]
}

export const algorithms = createAlgorithmFactory()
