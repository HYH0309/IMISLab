

以下是0-1背包问题算法说明文档：

```markdown
<!-- 自动生成目录 -->
[[toc]]

# 0-1 背包问题

## 🌟 核心特征
- **0-1 背包问题**是一个经典的组合优化问题，给定一组物品，每种物品最多选一个，每个物品有重量和价值，目标是在不超过背包容量的情况下使总价值最大。其核心创新点在于：**通过动态规划避免重复计算子问题，高效求解组合爆炸问题**。
- 典型应用场景为资源分配问题、投资组合优化等。
- 数学复杂度标识：$$ \mathcal{O}(n \cdot W) $$（n 为物品数，W 为背包容量）

## 🧮 形式化描述
### 时间复杂度
$$
T(n) = \Theta(n \cdot W)
$$

### 空间复杂度
$$
S(n) = \Theta(n \cdot W) \quad (\text{标准实现}) \\
S(n) = \Theta(W) \quad (\text{空间优化实现})
$$

## 🛠 实现步骤
1. **预处理阶段**：初始化 DP 表，维度为 (n+1) x (W+1)。
2. **核心逻辑**：
    ```python
    for i in range(1, n + 1):
        for w in range(1, W + 1):
            if weights[i - 1] > w:
                dp[i][w] = dp[i - 1][w]
            else:
                dp[i][w] = max(dp[i - 1][w], dp[i - 1][w - weights[i - 1]] + values[i - 1])
```
3. **终止条件**：填完 DP 表后，结果为 dp[n][W]。

## 📊 性能对比
| 指标类型   | 典型情况 | 最差情况 |
|------------|----------|----------|
| 时间效率   | O(n \cdot W) | O(n \cdot W) |
| 内存消耗   | O(n \cdot W) | O(n \cdot W) |

## 💻 代码实现
### Python 示例
```python
def knapsack_01(values: list[int], weights: list[int], capacity: int) -> int:
    """0-1 背包问题动态规划解法"""
    if not values or not weights or capacity <= 0:
        raise ValueError("输入参数无效")
    n = len(values)
    # 空间优化实现
    dp = [0] * (capacity + 1)
    for i in range(n):
        for w in range(capacity, weights[i] - 1, -1):
            dp[w] = max(dp[w], dp[w - weights[i]] + values[i])
    return dp[capacity]
```

### Java 示例
```java
public class Knapsack01 {
    public static int solve(int[] values, int[] weights, int capacity) {
        if (values == null || weights == null || capacity <= 0) {
            throw new IllegalArgumentException("输入参数无效");
        }
        int n = values.length;
        // 空间优化实现
        int[] dp = new int[capacity + 1];
        for (int i = 0; i < n; i++) {
            for (int w = capacity; w >= weights[i]; w--) {
                dp[w] = Math.max(dp[w], dp[w - weights[i]] + values[i]);
            }
        }
        return dp[capacity];
    }
}
```

## 🌍 应用场景
- 资源分配问题（如生产资源分配）
- 投资组合优化（在预算约束下的投资选择）
- 存储优化（在存储容量限制下的文件存储）

## 📚 参考文献
1. Richard Bellman _Dynamic Programming_ (2021)
2. https://arxiv.org/abs/2301.00001 （假设的最新研究论文链接，实际使用时请替换）
```