
# 深度优先搜索（DFS）

## 🌟 核心特征

- **深度优先搜索（DFS）**是一种用于遍历或搜索树或图的算法，沿着树的深度方向搜索节点，尽可能深地探索分支，直到目标节点或不可扩展节点，再回溯。其核心创新点在于：**通过递归或栈实现深度优先的系统性搜索路径扩展**。
- 典型应用场景为图结构的遍历、路径搜索、连通性检测等。
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
S(n) = \Theta(V) \quad (\text{显式栈或递归栈空间})
$$

## 🛠 实现步骤

1. **预处理阶段**：构建图的邻接表或邻接矩阵表示。
2. **核心逻辑**：

    ```python
    def dfs(node):
        mark node as visited
        visit(node)
        for each neighbor in node's neighbors:
            if neighbor not visited:
                dfs(neighbor)

    ```

3. **终止条件**：所有可达节点均被访问。

## 📊 性能对比

| 指标类型   | 典型情况 | 最差情况 |
|------------|----------|----------|
| 时间效率   | O(V + E) | O(V + E) |
| 内存消耗   | O(V)     | O(V)     |

## 💻 代码实现

### Python 示例

```python
def dfs(graph: dict[int, list[int]], start: int) -> list[int]:
    """深度优先搜索算法实现"""
    if not graph or start not in graph:
        raise ValueError("图结构无效或起始节点不存在")
    visited = set()
    result = []

    def _dfs(node):
        visited.add(node)
        result.append(node)
        for neighbor in graph[node]:
            if neighbor not in visited:
                _dfs(neighbor)

    _dfs(start)
    return result
```

### Java 示例

```java
import java.util.*;

public class DFS {
    public static List<Integer> search(Map<Integer, List<Integer>> graph, int start) {
        if (graph == null || !graph.containsKey(start)) {
            throw new IllegalArgumentException("图结构无效或起始节点不存在");
        }
        Set<Integer> visited = new HashSet<>();
        List<Integer> result = new ArrayList<>();

        _dfs(graph, start, visited, result);
        return result;
    }

    private static void _dfs(Map<Integer, List<Integer>> graph, int node, Set<Integer> visited, List<Integer> result) {
        visited.add(node);
        result.add(node);
        for (int neighbor : graph.get(node)) {
            if (!visited.contains(neighbor)) {
                _dfs(graph, neighbor, visited, result);
            }
        }
    }
}
```

## 🌍 应用场景

- 图的遍历和连通性检测
- 路径搜索和最短路径问题（结合其他算法）
- 拓扑排序的实现基础
