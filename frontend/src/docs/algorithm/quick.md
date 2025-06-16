
# 快速排序

## 🌟 核心特征

- **快速排序**是一种高效的比较排序算法，采用分治策略，通过选取基准元素将数组分为左右两部分，递归排序左右子数组。其核心创新点在于：**通过分区操作（partition），将基准元素放置到最终位置，并行缩小问题规模**。
- 典型应用场景为大规模数据排序且对平均性能要求较高的场景。
- 数学复杂度标识：
  $$ \mathcal{O}(n \log n) $$
  （平均情况）

## 🧮 形式化描述

### 时间复杂度

$$
T(n) = \begin{cases}
    \Theta(n \log n) & \text{平均情况} \\
    \Theta(n^2) & \text{最坏情况（划分极不均衡）}
\end{cases}
$$

### 空间复杂度

$$
S(n) = \begin{cases}
    \Theta(\log n) & \text{平均情况（递归栈深度）} \\
    \Theta(n) & \text{最坏情况}
\end{cases}
$$

## 🛠 实现步骤

1. **预处理阶段**：选择分区策略（如 Hoare 分区、Lomuto 分区）和基准选择策略（如随机选取、三数取中）。
2. **核心逻辑**：

    ```python
    def quick_sort(arr, low, high):
        if low < high:
            # 获取分区索引
            pivot_index = partition(arr, low, high)
            # 递归排序左右子数组
            quick_sort(arr, low, pivot_index - 1)
            quick_sort(arr, pivot_index + 1, high)
    ```

3. **终止条件**：子数组长度为 1 时递归终止。

## 📊 性能对比

| 指标类型   | 最优情况 | 典型情况 | 最差情况 |
|------------|----------|----------|----------|
| 时间效率   | $O(n \log n)$ | $O(n \log n)$ | $O(n²)$ |
| 内存消耗   | $O(\log n)$ | $O(\log n)$ | $O(n)$ |

## 💻 代码实现

### Python 示例

```python
def quick_sort(arr: list[int]) -> list[int]:
    """快速排序算法实现"""
    if not arr:
        raise ValueError("输入数组不能为空")
    _quick_sort_helper(arr, 0, len(arr) - 1)
    return arr

def _quick_sort_helper(arr, low, high):
    if low < high:
        # 使用 Lomuto 分区方案
        pivot_index = _partition(arr, low, high)
        _quick_sort_helper(arr, low, pivot_index - 1)
        _quick_sort_helper(arr, pivot_index + 1, high)

def _partition(arr, low, high):
    pivot = arr[high]  # 选择最后一个元素作为基准
    i = low - 1  # 小于基准元素的指针
    for j in range(low, high):
        if arr[j] <= pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]
    arr[i + 1], arr[high] = arr[high], arr[i + 1]
    return i + 1
```

### Java 示例

```java
public class QuickSort {
    public static int[] sort(int[] arr) {
        if (arr == null) {
            throw new IllegalArgumentException("输入数组不能为空");
        }
        _quickSortHelper(arr, 0, arr.length - 1);
        return arr;
    }

    private static void _quickSortHelper(int[] arr, int low, int high) {
        if (low < high) {
            // 使用 Lomuto 分区方案
            int pivotIndex = _partition(arr, low, high);
            _quickSortHelper(arr, low, pivotIndex - 1);
            _quickSortHelper(arr, pivotIndex + 1, high);
        }
    }

    private static int _partition(int[] arr, int low, int high) {
        int pivot = arr[high];  // 选择最后一个元素作为基准
        int i = low - 1;  // 小于基准元素的指针
        for (int j = low; j < high; j++) {
            if (arr[j] <= pivot) {
                i++;
                // 交换元素
                int temp = arr[i];
                arr[i] = arr[j];
                arr[j] = temp;
            }
        }
        // 交换基准元素到正确位置
        int temp = arr[i + 1];
        arr[i + 1] = arr[high];
        arr[high] = temp;
        return i + 1;
    }
}
```

## 🌍 应用场景

- 大规模数据排序（如大数据平台中的数据预处理）
- 对平均性能要求较高的排序场景
- 系统排序函数的底层实现（如 C 标准库的 `qsort`）
