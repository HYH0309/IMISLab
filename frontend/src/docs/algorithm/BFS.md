
# 广度优先搜索（BFS）

## 🌟 核心特征

- **广度优先搜索（BFS）** 是一种用于遍历或搜索树或图的算法，按照层次顺序访问节点，每次访问完当前层的所有节点后，再访问下一层。其核心创新点在于：**通过队列实现层次优先的系统性搜索路径扩展**。
- 典型应用场景为图结构的遍历、最短路径问题、层次结构分析等。
- 数学复杂度标识：  
  $$ \mathcal{O}(V + E) $$  
  （V 为顶点数，E 为边数）

## 🧮 形式化描述

### 时间复杂度

$$
T(n) = \Theta(V + E)
$$

### 空间复杂度

$$
S(n) = \Theta(V) \quad (\text{队列空间})
$$

## 🛠 实现步骤

1. **预处理阶段**：构建图的邻接表或邻接矩阵表示。
2. **核心逻辑**：

    ```python
    from collections import deque
    
    def bfs(graph, start):
        visited = set()
        queue = deque([start])
        visited.add(start)
        result = []
        while queue:
            node = queue.popleft()
            result.append(node)
            for neighbor in graph[node]:
                if neighbor not in visited:
                    visited.add(neighbor)
                    queue.append(neighbor)
        return result

    ```

3. **终止条件**：队列为空（所有可达节点均被访问）。

## 📊 性能对比

| 指标类型   | 典型情况 | 最差情况 |
|------------|----------|----------|
| 时间效率   | O(V + E) | O(V + E) |
| 内存消耗   | O(V)     | O(V)     |

## 💻 代码实现

### Python 示例

```python
from collections import deque

def bfs(graph: dict[int, list[int]], start: int) -> list[int]:
    """广度优先搜索算法实现"""
    if not graph or start not in graph:
        raise ValueError("图结构无效或起始节点不存在")
    visited = set()
    queue = deque([start])
    visited.add(start)
    result = []

    while queue:
        node = queue.popleft()
        result.append(node)
        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)
    return result
```

### Java 示例

```java
import java.util.*;

public class BFS {
    public static List<Integer> search(Map<Integer, List<Integer>> graph, int start) {
        if (graph == null || !graph.containsKey(start)) {
            throw new IllegalArgumentException("图结构无效或起始节点不存在");
        }
        Set<Integer> visited = new HashSet<>();
        Queue<Integer> queue = new LinkedList<>();
        List<Integer> result = new ArrayList<>();

        visited.add(start);
        queue.add(start);

        while (!queue.isEmpty()) {
            int node = queue.poll();
            result.add(node);
            for (int neighbor : graph.get(node)) {
                if (!visited.contains(neighbor)) {
                    visited.add(neighbor);
                    queue.add(neighbor);
                }
            }
        }
        return result;
    }
}
```

## 🌍 应用场景

- 图的层次遍历和最短路径问题（无权图）
- 社交网络中的关系分析
- 网页爬取中的页面访问策略
