---
title: "Topic 5: Priority queues and general trees"
description: "Advanced binary heap structures for queues and general trees."
readTime: "8 min"
order: 5
---

## 5.1 The priority queue

Unlike a normal FIFO queue (where the first to enter is the first to leave), a **priority queue** always serves the element with the **highest priority** (largest or most urgent), regardless of arrival order.

| Implementation | `push(x)` | `top()` | `pop()` |
| :--- | :---: | :---: | :---: |
| **Unsorted vector** | $\mathcal{O}(1)$ | $\mathcal{O}(n)$ | $\mathcal{O}(n)$ |
| **Sorted vector** | $\mathcal{O}(n)$ | $\mathcal{O}(1)$ | $\mathcal{O}(1)$ |
| **Binary Heap** | **$\mathcal{O}(\log n)$** | **$\mathcal{O}(1)$** | **$\mathcal{O}(\log n)$** |

With conventional vectors we must choose between fast insertion or fast extraction. The **binary heap** is the ideal solution because it achieves an excellent balance with logarithmic cost **$\mathcal{O}(\log n)$** for both operations.

---

## 5.2 The binary heap

It is a **complete binary tree** stored directly inside a **vector** (without pointers):
- **Root at `v[1]`:** Always contains the **absolute maximum** value (every parent is $\ge$ its children).
- **Index formulas:** For any node at position $i$:
  - **Parent:** `i / 2`
  - **Left child:** `2 * i`
  - **Right child:** `2 * i + 1`
- **Why is `v[0]` ignored?** Because at index 0 the child would be $2 \cdot 0 = 0$. Starting at 1, the arithmetic is direct and exact.

:::heapviz
:::

---

### `push(x)` — Insert (`flow_up`)
1. Add $x$ at the last position of the vector.
2. If it is greater than its parent, swap (`swap`) and **sift up** to its proper position.

:::algoviz{algorithm="heap_push"}
:::

---

### `pop()` — Extract maximum (`flow_down`)
1. Extract the root (`v[1]`) and move the **last element** of the vector to the root.
2. If it is smaller than any child, swap with the **largest child** and **sift down** to its proper position.

:::algoviz{algorithm="heap_pop"}
:::

> **Complexity:** `top()` is **$\mathcal{O}(1)$** (access to `v[1]`). `push()` and `pop()` are **$\mathcal{O}(\log n)$** (tree height).

---

## 5.3 Custom types (`struct`) and `operator>`

The `pro2::Heap<T>` class orders elements using the `>` operator. To store a `struct`, simply define its comparison function:

```cpp
struct Paquet {
    int prioritat;
    string nom;
};

bool operator>(const Paquet& a, const Paquet& b) {
    return a.prioritat > b.prioritat; // the highest priority stays at the top
}
```

> **Note:** Formal operator overloading in C++ is covered in depth in [Topic 9: Vector implementation](/notes/pro2/en/tema-9).

---

## 5.4 General trees (`Tree<T>`)

Unlike binary trees (`BinTree<T>`), in a **general tree (`Tree<T>`)** each node can have an arbitrary number of children ($0, 1, 2, \dots, k$).

### Main methods of `Tree<T>`
- `t.empty()`: Checks if the tree is empty.
- `t.value()`: Returns the root value.
- `t.num_children()`: Number of direct children of the root.
- `t.child(i)`: Returns the subtree of the $i$-th child ($0 \le i < \text{num\_children()}$).

### Recursive traversal (Searching an element)

To traverse a general tree, we replace the two fixed recursive calls (`left()` and `right()`) with an **iterative loop** over its children:

:::algoviz{algorithm="tree_general_search"}
:::
