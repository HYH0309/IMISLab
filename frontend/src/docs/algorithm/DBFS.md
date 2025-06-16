
# 双向广度优先搜索（Double BFS）

## 🌟 核心特征

- **双向广度优先搜索（Double BFS）**是一种优化的广度优先搜索算法，同时从起点和终点双向进行 BFS，当两个搜索前沿相遇时结束。其核心创新点在于：**通过双向扩展搜索路径，减少搜索空间，加速搜索过程**。
- 典型应用场景为大规模图中的最短路径搜索、社交网络中的关系查找等。
- 数学复杂度标识：
  $$ \mathcal{O}(b^{d/2}) $$
  （b 为分支因子，d 为路径深度）

## 🧮 形式化描述

### 时间复杂度

$$
T(n) = \Theta(b^{d/2})
$$

### 空间复杂度

$$
S(n) = \Theta(b^{d/2})
$$

## 🛠 实现步骤

1. **预处理阶段**：构建图的邻接表表示。
2. **核心逻辑**：

    ```python
    from collections import deque
    
    def double_bfs(graph, start, end):
        if start == end:
            return [start]
        visited_forward = {start}
        visited_backward = {end}
        queue_forward = deque([start])
        queue_backward = deque([end])
        result_forward = {}
        result_backward = {}
    
        while queue_forward and queue_backward:
            # 正向扩展
            node = queue_forward.popleft()
            for neighbor in graph[node]:
                if neighbor not in visited_forward:
                    visited_forward.add(neighbor)
                    result_forward[neighbor] = node
                    queue_forward.append(neighbor)
                    if neighbor in visited_backward:
                        return _construct_path(start, end, result_forward, result_backward, neighbor)
            # 反向扩展
            node = queue_backward.popleft()
            for neighbor in graph[node]:
                if neighbor not in visited_backward:
                    visited_backward.add(neighbor)
                    result_backward[neighbor] = node
                    queue_backward.append(neighbor)
                    if neighbor in visited_forward:
                        return _construct_path(start, end, result_forward, result_backward, neighbor)
        return []

    ```

3. **终止条件**：两个搜索前沿相遇或任一队列为空（无路径可达）。

## 📊 性能对比

| 指标类型   | 典型情况 | 最差情况 |
|------------|----------|----------|
| 时间效率   | $O(b^{d/2})$ | $O(b^{n})$ |
| 内存消耗   | $O(b^{d/2})$ | $O(b^{n})$ |

## 💻 代码实现

### Python 示例

```python
from collections import deque

def double_bfs(graph: dict[int, list[int]], start: int, end: int) -> list[int]:
    """双向广度优先搜索算法实现"""
    if not graph or start not in graph or end not in graph:
        raise ValueError("图结构无效或节点不存在")
    if start == end:
        return [start]

    visited_forward = {start}
    visited_backward = {end}
    queue_forward = deque([start])
    queue_backward = deque([end])
    result_forward = {}
    result_backward = {}

    while queue_forward and queue_backward:
        # 正向扩展
        node = queue_forward.popleft()
        for neighbor in graph[node]:
            if neighbor not in visited_forward:
                visited_forward.add(neighbor)
                result_forward[neighbor] = node
                queue_forward.append(neighbor)
                if neighbor in visited_backward:
                    return _construct_path(start, end, result_forward, result_backward, neighbor)
        # 反向扩展
        node = queue_backward.popleft()
        for neighbor in graph[node]:
            if neighbor not in visited_backward:
                visited_backward.add(neighbor)
                result_backward[neighbor] = node
                queue_backward.append(neighbor)
                if neighbor in visited_forward:
                    return _construct_path(start, end, result_forward, result_backward, neighbor)
    return []

def _construct_path(start, end, forward, backward, meeting_point):
    # 构建完整路径
    path = []
    current = meeting_point
    while current != start:
        path.append(current)
        current = forward[current]
    path.reverse()
    path.append(meeting_point)
    current = backward.get(meeting_point)
    while current != end:
        path.append(current)
        current = backward[current]
    path.append(end)
    return path
```

### Java 示例

```java
import java.util.*;

public class DoubleBFS {
    public static List<Integer> search(Map<Integer, List<Integer>> graph, int start, int end) {
        if (graph == null || !graph.containsKey(start) || !graph.containsKey(end)) {
            throw new IllegalArgumentException("图结构无效或节点不存在");
        }
        if (start == end) {
            return Collections.singletonList(start);
        }

        Set<Integer> visitedForward = new HashSet<>();
        Set<Integer> visitedBackward = new HashMap<>();
        Queue<Integer> queueForward = new LinkedList<>();
        Queue<Integer> queueBackward = new LinkedList<>();
        Map<Integer, Integer> resultForward = new HashMap<>();
        Map<Integer, Integer> resultBackward = new HashMap<>();

        visitedForward.add(start);
        visitedBackward.add(end);
        queueForward.add(start);
        queueBackward.add(end);

        while (!queueForward.isEmpty() && !queueBackward.isEmpty()) {
            // 正向扩展
            int node = queueForward.poll();
            for (int neighbor : graph.get(node)) {
                if (!visitedForward.contains(neighbor)) {
                    visitedForward.add(neighbor);
                    resultForward.put(neighbor, node);
                    queueForward.add(neighbor);
                    if (visitedBackward.contains(neighbor)) {
                        return constructPath(start, end, resultForward, resultBackward, neighbor);
                    }
                }
            }
            // 反向扩展
            int nodeBack = queueBackward.poll();
            for (int neighbor : graph.get(nodeBack)) {
                if (!visitedBackward.contains(neighbor)) {
                    visitedBackward.add(neighbor);
                    resultBackward.put(neighbor, nodeBack);
                    queueBackward.add(neighbor);
                    if (visitedForward.contains(neighbor)) {
                        return constructPath(start, end, resultForward, resultBackward, neighbor);
                    }
                }
            }
        }
        return Collections.emptyList();
    }

    private static List<Integer> constructPath(int start, int end, Map<Integer, Integer> forward, Map<Integer, Integer> backward, int meetingPoint) {
        List<Integer> path = new ArrayList<>();
        // 构建正向路径
        int current = meetingPoint;
        while (current != start) {
            path.add(current);
            current = forward.get(current);
        }
        Collections.reverse(path);
        path.add(meetingPoint);
        // 构建反向路径
        current = backward.get(meetingPoint);
        while (current != end) {
            path.add(current);
            current = backward.get(current);
        }
        path.add(end);
        return path;
    }
}
```

## 🌍 应用场景

- 大规模图中的最短路径搜索（如社交网络中的六度分隔问题）
- 双向路径规划（如导航系统中的路径规划）
- 高效的图连通性检测
