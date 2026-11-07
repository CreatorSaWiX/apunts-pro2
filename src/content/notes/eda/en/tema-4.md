---
title: "Topic 4: Priority Queues"
description: "Priority queue ADT, binary and ternary heaps, array-based representation, in-place Heapsort and Θ(n) linear build, and the selection problem."
readTime: "12 min"
order: 5
draft: false
---

A **priority queue** stores elements with an associated priority and always allows extracting the extreme value (minimum or maximum). It permits **duplicate elements** and **does not allow arbitrary key lookups**.

| Implementation | `push` | `pop_min` | `min` | Aux. memory | Visualization & behavior |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **Unsorted vector** | $\Theta(1)$ | $\Theta(n)$ | $\Theta(n)$ | $\Theta(1)$ | :pqcompareviz{type="unordered"} |
| **Sorted vector** | $\Theta(n)$ | $\Theta(1)$ | $\Theta(1)$ | $\Theta(1)$ | :pqcompareviz{type="sorted"} |
| **AVL Tree / `std::set`** | $\Theta(\log n)$ | $\Theta(\log n)$ | $\Theta(1)$ | $\Theta(n)$ | :pqcompareviz{type="avl"} |
| **Binary Heap** | $\mathbf{\Theta(\log n)}$ | $\mathbf{\Theta(\log n)}$ | $\mathbf{\Theta(1)}$ | $\mathbf{\Theta(1)}$ | :pqcompareviz{type="heap"} |

---

## 4.1. Tree Preliminaries: Topology and Bounds

* **Perfect binary tree:** All levels are completely full.
  $$n = 2^{h+1} - 1 \text{ nodes}$$
* **Complete binary tree:** Levels $0 \dots h-1$ are full, and the last level ($h$) has its leaves pushed **as far left as possible**.

### Node Bounds and Logarithmic Height
In any complete binary tree of height $h$:

$$
2^h \le n \le 2^{h+1} - 1 \implies h = \lfloor \log_2 n \rfloor \in \mathbf{\Theta(\log n)}
$$

* **Leaf node bound:** Exactly $\lceil n/2 \rceil$ nodes are leaves (50% of the tree). Searching among the leaves requires scanning $\Theta(n)$ elements.

:::treetopoviz
:::

---

## 4.2. Binary Heaps

A structure based on a complete binary tree satisfying the **heap property**:
* **Min-Heap:** For every node $i \neq \text{root}$, $\text{key}(\text{parent}(i)) \le \text{key}(i)$. The root holds the global minimum.

* **Max-Heap:** For every node $i \neq \text{root}$, $\text{key}(\text{parent}(i)) \ge \text{key}(i)$. The root holds the global maximum.

:::minmaxheapviz{type="min"}
:::

### Array-based Representation (Pointer-Free)

Nodes are stored level by level from left to right.

| Relationship | 1-indexed (`t[1...n]`, FIB standard) | 0-indexed (`t[0...n-1]`) |
| :--- | :---: | :---: |
| **Parent of $i$** | $\lfloor i / 2 \rfloor$ | $\lfloor (i - 1) / 2 \rfloor$ |
| **Left child of $i$** | $2i$ | $2i + 1$ |
| **Right child of $i$** | $2i + 1$ | $2i + 2$ |
| **Is leaf?** | $2i > n$ | $2i + 1 \ge n$ |

1-based indexing simplifies bit arithmetic (`i >> 1`, `i << 1`) and avoids auxiliary additions.

### 1. Insertion (`sift_up`)
The element is added to the end of the vector (position $n+1$) and bubbled up by swapping with its parent as long as it is smaller:

```cpp
void sift_up(vector<int>& t, int i) {
    while (i > 1 && t[i] < t[i / 2]) {
        swap(t[i], t[i / 2]);
        i /= 2;
    }
}
```
* **Cost:** $\mathcal{O}(h) = \mathbf{\Theta(\log n)}$.

:::surarviz
:::

### 2. Extract Minimum (`sift_down`)
The root (`t[1]`) is saved, the last element (`t[n]`) is moved to the root, $n$ is decremented, and the element descends by swapping **always with the smaller child**:

```cpp
void sift_down(vector<int>& t, int n, int i) {
    int c = 2 * i; // Left child
    while (c <= n) {
        if (c + 1 <= n && t[c + 1] < t[c]) ++c; // c is the smaller of both children
        if (t[i] <= t[c]) break;                // Invariant restored
        swap(t[i], t[c]);
        i = c;
        c = 2 * i;
    }
}
```
* **Cost:** $\mathcal{O}(h) = \mathbf{\Theta(\log n)}$.

If it is not swapped with the *smaller* child, the larger child would become the parent of the smaller one, violating the min-heap property.

:::enfonsarviz
:::

---

## 4.3. Ternary Heaps

A complete ternary tree where each node has at most **3 children** and satisfies the heap property.

### Array Index Arithmetic (0-Indexed)

| Relationship for node $i$ | Mathematical expression |
| :--- | :---: |
| **Parent of $i$** | $\lfloor (i - 1) / 3 \rfloor$ |
| **Children of $i$** | $3i + 1, \quad 3i + 2, \quad 3i + 3$ |

:::ternaryheapviz
:::

### Node Formulas for Height $h$

* **Maximum number of nodes (perfect ternary tree of height $h$):**
  $$
  N_{\max}(h) = \sum_{j=0}^h 3^j = \frac{3^{h+1} - 1}{2}
  $$
  *Proof by induction:* For $h=0$, $\frac{3^1-1}{2} = 1$. Inductive step: $N_{\max}(h) = 1 + 3 \cdot N_{\max}(h-1) = 1 + 3\left(\frac{3^h-1}{2}\right) = \frac{2 + 3^{h+1} - 3}{2} = \frac{3^{h+1}-1}{2}$. $\blacksquare$

* **Minimum number of nodes of height $h$:**
  $$
  N_{\min}(h) = N_{\max}(h - 1) + 1 = \frac{3^h - 1}{2} + 1
  $$

* **Asymptotic height:** $h \in \mathbf{\Theta(\log_3 n)}$. It has lower height than binary heaps, but requires up to 3 comparisons per level during `sift_down`.

### `sift_down` Implementation for Ternary Min-Heap

```cpp
void sift_down_ternary(vector<int>& t, int n, int i) {
    int c = 3 * i + 1; // First child
    while (c < n) {
        int menor = c;
        if (c + 1 < n && t[c + 1] < t[menor]) menor = c + 1;
        if (c + 2 < n && t[c + 2] < t[menor]) menor = c + 2;
        if (t[i] <= t[menor]) break;
        swap(t[i], t[menor]);
        i = menor;
        c = 3 * i + 1;
    }
}
```

---

## 4.4. Heapsort Sorting Algorithm

### 1. Heap Construction: Naive vs Floyd's Method

* **Naive construction (Top-Down):** Insert $n$ successive elements using `sift_up`.
  $$T(n) = \sum_{i=1}^n \log i = \log(n!) = \mathbf{\Theta(n \log n)}$$
* **Floyd's linear construction (Bottom-Up / *Heapify*):** Place elements into the array and apply `sift_down` backwards from the last parent ($i = \lfloor n/2 \rfloor$) down to the root ($i = 1$).
  $$T(n) = \mathbf{\Theta(n)}$$
  *Justification:* Most nodes reside at the bottom levels (where descent height is 0 or 1). Only the root can descend $h$ levels.

:::heapbuildviz
:::

### 2. In-Place Heapsort ($\Theta(1)$ Auxiliary Memory)

To sort an array in ascending order without extra memory:
1. Build a linear **Max-Heap** in $\Theta(n)$ directly on the array.
2. Repeat for $i$ from $n$ down to 2:
   - Swap the root (current maximum at `t[1]`) with `t[i]`.
   - Shrink the active heap size to $i - 1$.
   - Apply `sift_down_max(t, i - 1, 1)`.

```cpp
void heapsort(vector<int>& t) {
    int n = t.size() - 1; // Assuming 1-based indexing
    // 1. Heapify in O(n)
    for (int i = n / 2; i >= 1; --i) sift_down_max(t, n, i);
    // 2. Successive extractions
    for (int i = n; i >= 2; --i) {
        swap(t[1], t[i]);
        sift_down_max(t, i - 1, 1);
    }
}
```

:::heapsortviz
:::

| Property | Value |
| :--- | :---: |
| **Time complexity (best, average, worst)** | $\mathbf{\Theta(n \log n)}$ |
| **Auxiliary memory** | $\mathbf{\Theta(1)}$ (*in-place*) |
| **Stability** | **NOT stable** (swap operations disrupt identical keys) |

---

## 4.5. Application (Finding the $m$ Smallest of $n$ Elements)

| Method | Time Cost | Auxiliary Memory | When to use? |
| :--- | :---: | :---: | :--- |
| **Full MergeSort** | $\Theta(n \log n)$ | $\Theta(n)$ | Only if the entire array must be sorted. |
| **Min-Heap of size $n$** | $\mathbf{\Theta(n + m \log n)}$ | $\Theta(1)$ / $\Theta(n)$ | Excellent when $m \ll n$ (linear build + $m$ pops). |
| **Max-Heap of size $m$** | $\mathbf{\Theta(n \log m)}$ | $\mathbf{\Theta(m)}$ | **Optimal for Streams / Online Data:** does not require loading all $n$ elements into RAM. |
| **QuickSelect (median)** | $\mathbf{\Theta(n)}$ (worst case) | $\Theta(1)$ | Theoretical asymptotic optimum for arrays in memory. |

1. **Is an array sorted in ascending order a min-heap?** **YES.** For all $i$, $t[i] \le t[2i]$ and $t[i] \le t[2i+1]$.
2. **Where can the maximum be located in a min-heap?** In **any of the leaves** (indices $\lfloor n/2 \rfloor + 1 \dots n$). Finding it costs $\Theta(n)$.
3. **Ternary vs binary heaps:** A ternary heap has height $\approx \log_3 n$ (fewer levels), but requires 3 comparisons per step instead of 2 during `sift_down`. The asymptotic cost remains $\Theta(\log n)$.
4. **Floyd's construction:** Applies `sift_down` from $n/2$ down to 1. Doing it with `sift_up` from 1 to $n$ would cost $\Theta(n \log n)$.

### C++ STL: `std::priority_queue`

```cpp
#include <queue>
#include <vector>

// 1. Default Max-Heap
priority_queue<int> max_pq;

// 2. Min-Heap
priority_queue<int, vector<int>, greater<int>> min_pq;

// 3. Linear Theta(n) construction from a vector
vector<int> v = {5, 2, 8, 1, 9};
priority_queue<int> pq_linear(v.begin(), v.end());
```

* Operations: `.push(x)` ($\mathcal{O}(\log n)$), `.pop()` ($\mathcal{O}(\log n)$), `.top()` ($\Theta(1)$), `.empty()` ($\Theta(1)$), `.size()` ($\Theta(1)$).
* **Pitfall:** The STL **does not support `decrease_key`**. To update priorities (e.g. in Dijkstra), insert duplicate pairs.

