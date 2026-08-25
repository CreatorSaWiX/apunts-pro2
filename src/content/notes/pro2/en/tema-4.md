---
title: "Topic 4: Immersion and binary trees"
description: "Overcome the limitations of recursion and achieve total and fast mastery of binary trees."
readTime: "8 min"
order: 4
---

## 4.1 Immersion

Often in exams we are asked for a function with a fixed signature (such as `reverse(string s)`), but to solve it recursively we need **additional parameters** (such as an accumulator or counters).

<br>

**Immersion** consists of:
1. Creating an **auxiliary function** (immersed) with the necessary extra parameters.
2. Making the **public function** only call the auxiliary function with the initial values.

### Example 1: Reversing text (`reverse`)

We need an index parameter `i` to traverse the text without making copies:

:::oopviz{simulation="immersio_reverse"}
:::

### Example 2: Linear Fibonacci $\mathcal{O}(n)$

Simple recursive Fibonacci has an exponential cost of $\mathcal{O}(2^n)$ because it repeats computations. With immersion we pass the last two numbers and reduce the cost to **$\mathcal{O}(n)$**:

:::oopviz{simulation="immersio_fibonacci"}
:::

---

## 4.2 The binary tree (`BinTree<T>`)

A **binary tree (`BinTree`)** is a recursive data structure: either it is **empty**, or it has a **root** node (`value()`) and two subtrees: the **left child** (`left()`) and the **right child** (`right()`).

:::warning
**`BinTree` trees are immutable:** once created, they cannot be modified directly (they have no methods like `set_value()`). To alter a tree, you must construct a new one by combining the branches with the constructor `BinTree(x, left, right)`.
:::

:::bintreeviz
:::

---

## 4.3 Basic functions: search and height

Functions on `BinTree` are solved naturally with **recursion**:

### 1. Calculate height (`height`)
The height of an empty tree is `0`. If not empty, it is `1 + max(height(left), height(right))`:

:::algoviz{algorithm="height"}
:::

### 2. Search for an element (`cerca`)
Checks if the root is the sought value `x`. If not, searches left or right leveraging the short-circuit evaluation of `||`:

:::algoviz{algorithm="cerca_height"}
:::

---

## 4.4 Global traversals

A **traversal** visits every node in the tree exactly once. Depending on the order in which the root is processed relative to its children:

### Depth-First Search (DFS)

- **Preorder:** *Root → Left → Right* (processes the root before descending to children):
:::algoviz{algorithm="preordre"}
:::

- **Inorder:** *Left → Root → Right* (processes the left child, then the root, and finally the right child):
:::algoviz{algorithm="inordre"}
:::

- **Postorder:** *Left → Right → Root* (processes both children first and the root at the end):
:::algoviz{algorithm="postordre"}
:::

### Breadth-First Search (BFS)
Visits nodes level by level (left to right) using a **queue (`queue`)**:

:::algoviz{algorithm="bfs"}
:::

:::tip
**Exam Tip (Calculations in a single pass):**
If you need to calculate two tree properties simultaneously (for instance, the sum and the number of nodes to calculate the average, or the height and whether the tree is balanced), **do not make two separate recursive calls**. Perform a single pass in $\mathcal{O}(n)$ by returning a `pair<A, B>` or passing parameters by reference (`&`).
:::

