---
title: "EDA Final"
description: "Complete guide 100% focused on the EDA final exam: Topics 1–7, real exam patterns, model proofs, C++ code, and P vs NP logic."
readTime: "35 min"
order: 99
draft: false
---

## 1. Algorithm Analysis

- **$\mathcal{O}(g)$** (upper bound): $f(n) \le c \cdot g(n)$  *(grows at most as fast as $g$)*
- **$\Omega(g)$** (lower bound): $f(n) \ge c \cdot g(n)$  *(grows at least as fast as $g$)*
- **$\Theta(g)$** (tight bound): $c_1 \cdot g(n) \le f(n) \le c_2 \cdot g(n) \iff f \in \mathcal{O}(g) \land f \in \Omega(g)$

:::asymptoticviz
:::

Allows determining the asymptotic relationship between two positive functions $f(n)$ and $g(n)$ by computing the limit of their ratio as $n \to \infty$:

$$
L = \lim_{n \to \infty} \frac{f(n)}{g(n)}
$$

| Value of $L$ | Relation | Conclusion |
| :--- | :--- | :--- |
| **$L = 0$** | $f < g$ | $f \in \mathcal{O}(g)$, $f \notin \Omega(g)$, $f \notin \Theta(g)$ |
| **$0 < L < \infty$** | $f \approx g$ | $f \in \Theta(g)$ (and therefore $f \in \mathcal{O}(g)$ and $f \in \Omega(g)$) |
| **$L = \infty$** | $f > g$ | $f \in \Omega(g)$, $f \notin \mathcal{O}(g)$, $f \notin \Theta(g)$ |
| **Does not exist** | Oscillates | Apply the definition with $c$ and $n_0$ directly. |

### Simplification Cheat Sheet for Limits and Comparisons

:::growthviz
:::

### Properties of Logarithms and Natural Logs ($\log_b, \ln$)
| Property | Mathematical Formulation | Example |
| :--- | :--- | :--- |
| **Product to sum** | $\log_b(x \cdot y) = \log_b x + \log_b y$ | $\log(2n) = \log 2 + \log n \implies \Theta(\log n)$|
| **Quotient to difference** | $\log_b(x / y) = \log_b x - \log_b y$ | $\log(n / 2) = \log n - \log 2 \implies \Theta(\log n)$ |
| **Power to product** | $\log_b(x^k) = k \cdot \log_b x$ | $\log(n^3) = 3 \log n \implies \Theta(\log n)$. <br>$\log(n^2) = 2\log n \neq (\log n)^2$ |
| **Natural log ($\ln$) and $e$** | $\ln x = \log_e x \quad (e \approx 2.718)$ | $\ln(e^x) = x, \quad e^{\ln x} = x$ |
| **Change of base** | $\log_b x = \frac{\log_a x}{\log_a b} = \frac{\ln x}{\ln b}$ | $\log_2 n = \frac{\ln n}{\ln 2} \implies \Theta(\log_a n) = \Theta(\log_b n)$ |
| **Nested logarithms** | $\log(\log(n^k)) = \log(k \log n) = \log k + \log(\log n)$ | $\log(\log(n^2)) = \log 2 + \log(\log n) \implies \Theta(\log(\log n))$ |
| **Stirling (Factorial)** | $\log(n!) = \sum_{i=1}^n \log i = \Theta(n \log n)$ | Useful for sorting lower bounds and limits with $n!$ |

> **Watch the base in the exponent:** The logarithm's base **does change the asymptotic order** when it is in the exponent:  
> $2^{\log_2 n} = n$, whereas $2^{\log_3 n} = n^{\log_3 2} \approx n^{0.631} \implies 2^{\log_2 n} \gg 2^{\log_3 n}$.

### Properties of Powers, Exponentials ($a^n, e^n$), and Roots
| Property | Formulation | Example |
| :--- | :--- | :--- |
| **Sum in the exponent** | $a^{x + y} = a^x \cdot a^y$ | $2^{n + 3} = 2^3 \cdot 2^n = 8 \cdot 2^n \implies \mathbf{\Theta(2^n)}$  |
| **Product in the exponent** | $a^{k \cdot n} = (a^k)^n$ | $2^{2n} = (2^2)^n = 4^n \implies \mathbf{4^n \gg 2^n}$ |
| **Difference of exponents (quotient)** | $\frac{a^n}{b^n} = \left(\frac{a}{b}\right)^n$ | $\frac{2^n}{3^n} = (2/3)^n \xrightarrow{n\to\infty} 0 \quad (b > a \implies a^n \ll b^n)$ |
| **Roots as powers** | $\sqrt[k]{n^p} = n^{p/k}$ | $\sqrt{n} = n^{1/2}, \quad \sqrt[3]{n^2} = n^{2/3}, \quad \sqrt{n^3 + 1} \in \Theta(n^{3/2})$ |
| **Convert to base $e$** | $a^x = e^{x \ln a}$ | $2^n = e^{n \ln 2}, \quad n^n = e^{n \ln n}$ |
| **Key swap identity** | $\mathbf{a^{\log_b n} = n^{\log_b a}}$ | $4^{\log_2 n} = n^{\log_2 4} = n^2 \quad \vert \quad 3^{\log_2 n} = n^{\log_2 3} \approx n^{1.585}$ |

### Elementary Operations and Parameter Passing

| Concept / Operation | Cost | Justification / Rule |
| :--- | :---: | :--- |
| **Primitive ops and simple I/O** | $\Theta(1)$ | Primitive assignments, arithmetic/logical/relational operators, and simple `cin`/`cout`. |
| **Indexed access `v[i]`** | $\Theta(1)$ | Pointer arithmetic over contiguous memory ($\text{address} = \text{start} + i \cdot \text{size}$). |
| **Pass by reference (`&`, `const &`)** | $\Theta(1)$ | Passes the memory address (pointer), without duplicating data. |
| **Pass by value (`vector<T>` of size $n$)** | $\Theta(n)$ | Clones all $n$ elements by allocating memory on the *heap*. |


**Selection Sort**
:::selectionsortviz
:::

**Insertion Sort**
:::insertionsortviz
:::

---

### Master Theorem for Subtractive Recurrences
Applies to recurrences where each call reduces the input size by a constant amount $c \ge 1$:

$$
C(n) = \begin{cases} \Theta(1), & \text{if } n < n_0 \\ a \cdot C(n - c) + g(n), & \text{if } n \ge n_0 \end{cases} \qquad C(n) \in \begin{cases} 
\Theta(n^k), & \text{if } a < 1 \\ 
\Theta(n^{k+1}), & \text{if } a = 1 \\ 
\Theta(a^{n/c}), & \text{if } a > 1 
\end{cases}
$$

| Recurrence | Parameters | Case | Complexity | Algorithm |
| :--- | :--- | :---: | :---: | :--- |
| $C(n) = C(n-1) + \Theta(1)$ | $a=1, k=0, c=1$ | $a = 1$ | $\Theta(n)$ | Recursive linear search |
| $C(n) = C(n-1) + \Theta(n)$ | $a=1, k=1, c=1$ | $a = 1$ | $\Theta(n^2)$ | Recursive Selection / Insertion sort |
| $C(n) = 2C(n-1) + \Theta(1)$ | $a=2, k=0, c=1$ | $a > 1$ | $\Theta(2^n)$ | Towers of Hanoi |

---

### Master Theorem for Dividing Recurrences

$$
C(n) = \begin{cases} \Theta(1), & \text{if } n < n_0 \\ a \cdot C(n/b) + g(n), & \text{if } n \ge n_0 \end{cases} \qquad C(n) \in \begin{cases} 
\Theta(n^k), & \text{if } \alpha < k \iff a < b^k \\ 
\Theta(n^k \log n), & \text{if } \alpha = k \iff a = b^k \\ 
\Theta(n^\alpha) = \Theta(n^{\log_b a}), & \text{if } \alpha > k \iff a > b^k 
\end{cases}
$$

| Algorithm | Recurrence | Parameters | Relation | Complexity |
| :--- | :--- | :--- | :--- | :---: |
| **Binary search** | $C(n) = C(n/2) + \Theta(1)$ | $a=1, b=2, k=0$ | $\alpha = 0 = k$ | $\Theta(\log n)$ |
| **Mergesort** | $C(n) = 2C(n/2) + \Theta(n)$ | $a=2, b=2, k=1$ | $\alpha = 1 = k$ | $\Theta(n \log n)$ |
| **Karatsuba** | $C(n) = 3C(n/2) + \Theta(n)$ | $a=3, b=2, k=1$ | $\alpha = \log_2 3 \approx 1.585 > k$ | $\Theta(n^{1.585})$ |
| **Strassen** | $C(n) = 7C(n/2) + \Theta(n^2)$ | $a=7, b=2, k=2$ | $\alpha = \log_2 7 \approx 2.807 > k$ | $\Theta(n^{2.807})$ |

### Problem 1 Patterns in the Final Exam

| Code / Question Pattern | How to Analyze on the Spot | Cost / Solution | Real Exams |
| :--- | :--- | :---: | :--- |
| **Triangular sum (`s += i; ++i;` until `s > n`)** | After $k$ iterations, $s = \frac{k(k+1)}{2}$ (or $s = k(k+1)$ with `2*u`). | **$\Theta(\sqrt{n})$** | Final 2024 T, Final 2026 P |
| **Accumulated doubling (`x *= 2; y *= x;` until `y > n`)** | After $k$ iterations, $y = 2^{1+2+\dots+k} = 2^{k(k+1)/2} > n \implies k^2 \approx \log n$. | **$\Theta(\sqrt{\log n})$** | 10/06/2024 P1(c) |
| **Recursion on bits (`f(x/2)`)** | If $x$ has $n = \lfloor\log_2 x\rfloor+1$ bits, `x/2` has $n-1$: $C(n) = C(n-1)+\Theta(1)$. | **$\Theta(n)$** (in bits) | Final 2022 T (Jan. 2023) |
| **Substrings (`s.substr(i, k)`)** | `substr` costs $\Theta(k)$, not $\Theta(1)$! Double loop $(i,j)$ sums $\sum_{i=0}^{n-1} (n-i)^2$. | **$\Theta(n^3)$** | Final 2021 T (Jan. 2022) |
| **Comparing $4^n$, $2^{2n}$, and $2^{n^2}$** | $2^{2n} = (2^2)^n = 4^n$; $\lim \frac{2^{n^2}}{2^{2n}} = \lim 2^{n(n-2)} = \infty$. | **$4^n = 2^{2n} \ll 2^{n^2}$** | Final 2026 P P1(c) |

* **Recurrences with a parameter ($a, b, k$):** always compare $\alpha = \log_b a$ against $k$ without dropping the logs:
  * Ex. Final 2023 T (08/01/2024): $T(n) = aT(n/4) + \Theta(n^2) \implies \Theta(n^2)$ if $a < 16$; $\Theta(n^2\log n)$ if $a = 16$; $\Theta(n^{\log_4 a})$ if $a > 16$.
  * Ex. Final 2026 P (09/06/2026): for $T(n) = 9T(n/b) + \Theta(n)$ to match $S(n) = S(n-2) + \Theta(n) \in \Theta(n^2)$, we need $\alpha > k=1$ (to avoid $\log n$) with $\log_b 9 = 2 \implies \mathbf{b = 3}$.
* **Quick ranking of 10 functions (Final 2025 T / 14/01/2026 P1(c)):**
  $$2^{\log_2 n} = n \;\ll\; n\log n = n\log(n^2) \;\ll\; n^2\log n \;\ll\; 2^{n/2} \;\ll\; 2^{n-10} = 2^n \;\ll\; 3^n \;\ll\; n! \;\ll\; n^n$$
* **Mandatory structural bounds (Final 2025 T P1(a)):** connected graph $\implies \Omega(n)$ edges; BST of $n$ nodes $\implies$ height $\Omega(\log n)$ (and $\mathcal{O}(n)$); *min-heap* of $n$ nodes $\implies \Theta(n)$ leaves.

## 2. Divide and Conquer

The total cost of a divide-and-conquer algorithm comes exclusively from three sources:

$$
T(n) = \underbrace{T_{\text{divide}}(n)}_{\text{split}} + \underbrace{a \cdot T(n/b)}_{\text{recursive calls}} + \underbrace{T_{\text{combine}}(n)}_{\text{merge/assembly}}
$$

Where the non-recursive work $g(n) = T_{\text{divide}}(n) + T_{\text{combine}}(n)$ typically belongs to $\Theta(n^k)$ for $k \ge 0$, which can be solved using the **Master Theorem for dividing recurrences**.

:::dncviz
:::

| Algorithm | Computational Problem | Recurrence Equation $T(n)$ | Time Complexity |
| :--- | :--- | :--- | :---: |
| **Binary Search** | Search in a sorted array | $T(n) = T(n/2) + \Theta(1)$ | $\Theta(\log n)$ |
| **Fast Exponentiation** | Computing $x^n$ | $T(n) = T(n/2) + \Theta(1)$ | $\Theta(\log n)$ |
| **MergeSort** | Stable sorting | $T(n) = 2T(n/2) + \Theta(n)$ | $\Theta(n \log n)$ |
| **QuickSort (best/average case)** | *In-place* sorting | $T(n) = 2T(n/2) + \Theta(n)$ | $\Theta(n \log n)$ |
| **QuickSort (worst case)** | *In-place* sorting | $T(n) = T(n-1) + \Theta(n)$ | $\Theta(n^2)$ |
| **Karatsuba** | Product of two $n$-bit integers | $T(n) = 3T(n/2) + \Theta(n)$ | $\mathbf{\Theta(n^{\log_2 3}) \approx \Theta(n^{1.585})}$ |
| **Strassen** | Product of $n \times n$ matrices | $T(n) = 7T(n/2) + \Theta(n^2)$ | $\mathbf{\Theta(n^{\log_2 7}) \approx \Theta(n^{2.807})}$ |
| **Towers of Hanoi** | Moving $n$ disks | $T(n) = 2T(n-1) + \Theta(1)$ | $\mathbf{\Theta(2^n)}$ (exact: $2^n - 1$) |
| **QuickSelect (average case)** | $k$-th element selection | $T(n) = T(n/2) + \Theta(n)$ | $\Theta(n)$ |
| **QuickSelect (worst case)** | $k$-th element selection | $T(n) = T(n-1) + \Theta(n)$ | $\Theta(n^2)$ |
| **Median of Medians (BFPRT)** | $k$-th selection (worst case) | $T(n) = T(n/5) + T(3n/4) + \Theta(n)$ | $\mathbf{\Theta(n)}$ |

### Binary Search $\Theta(\log n)$
:::binarysearchviz
:::

:::oopviz{simulation="binary_search"}
:::

<!-- 
The recursion parameter is $n = j - i + 1$. At each level only **one** recursive call ($a = 1$) is made on a subarray of half the size ($b = 2$), and the non-recursive work (midpoint calculation and comparisons) is constant ($g(n) \in \Theta(1) \implies k = 0$).

$$ 
T(n) = T(n/2) + \Theta(1) 
$$

By the dividing Master Theorem: $\alpha = \log_b a = \log_2 1 = 0$. Since $\alpha = k = 0$, we have:

$$ 
\mathbf{T(n) \in \Theta(n^0 \log n) = \Theta(\log n)} 
$$ -->

### MergeSort $\Theta(n \log n)$

:::mergerecviz
:::

:::mergeviz
:::

:::oopviz{simulation="mergesort"}
:::

---

### Hybrid MergeSort with Cutoff Size

:::hybridmergeviz
:::

```cpp
const int critical_size = 50;
if (d - e < critical_size) insertion_sort(T, e, d);
else {
    int m = (e + d) / 2;
    mergesort(T, e, m);
    mergesort(T, m + 1, d);
    merge(T, e, m, d);
}
```

### Iterative MergeSort with Queue

:::mergequeueviz
:::

```text
function mergesort_queue(a[1...n]):
    Q = empty queue
    for each element x of a:
        enqueue(Q, [x])
    while size(Q) > 1:
        enqueue(Q, merge(dequeue(Q), dequeue(Q)))
    return dequeue(Q)
```

### Bottom-Up MergeSort on Array

:::mergebottomupviz
:::

```cpp
template <typename elem>
void mergesort_bottom_up(vector<elem>& T) {
    int n = T.size();
    for (int m = 1; m < n; m *= 2) {
        for (int i = 0; i < n - m; i += 2 * m) {
            merge(T, i, i + m - 1, min(i + 2 * m - 1, n - 1));
        }
    }
}
```

---

### QuickSort $\Theta(n \log n)$ with $\Theta(n^2)$ Worst Case

:::quicksortviz
:::

### Hoare Partition
:::hoarepartviz
:::

:::oopviz{simulation="quicksort"}
:::

### Pivot Selection Strategies

Code for the median-of-three strategy:
```cpp
int center = (e + d) / 2;
if (T[e] < T[center]) swap(T[center], T[e]);
if (T[d] < T[center]) swap(T[center], T[d]);
if (T[d] < T[e]) swap(T[e], T[d]);
// The median ends up at T[e]
```

---

### Fast Exponentiation $\mathbf{T(n) \in \Theta(\log n)}$

:::fastpowerviz
:::

:::oopviz{simulation="fast_power"}
:::

### Karatsuba's Algorithm $\Theta(n^{1.585})$

:::karatsubaviz
:::

### Strassen's Algorithm $\Theta(n^{2.807})$

:::strassenmatmultviz
:::

### The Towers of Hanoi

:::hanoiviz
:::

```cpp
void hanoi(int n, char a, char b, char c) {
    if (n > 0) {
        hanoi(n - 1, a, c, b); // Move n-1 disks from origin (a) to auxiliary (b) using dest (c)
        cout << a << " -> " << c << "\n"; // Elementary move of the largest disk
        hanoi(n - 1, b, a, c); // Move n-1 disks from auxiliary (b) to dest (c) using origin (a)
    }
}
```

### Median of Medians

:::medianviz
:::

:::bfprtviz
:::

### D&C and Selection Tricks in the Final Exam
* **Degenerate call at one endpoint (Final 2023 P / 12/06/2023 P1(a)):** `f(v, e, e) + f(v, e, (e+d)/2)` only makes **1** real recursive call of size $n/2$ (the other is $\Theta(1)$) $\implies T(n) = T(n/2) + \Theta(1) \implies \Theta(\log n)$. If it splits into two real halves $\implies 2T(n/2)+\Theta(1) \implies \Theta(n)$.
* **Halving a vector + linear scan (`majority_pairs`, Final 2020 T P1(b) / 2022 T P1(b)):** if each level reduces the vector to size $\le n/2$ and then scans the current vector ($n$), the recurrence is $T(n) = T(n/2) + \Theta(n) \implies \mathbf{\Theta(n)}$ (because $\alpha = 0 < k = 1$).
* **Finding the $m = n/2$ smallest elements in guaranteed $\Theta(n)$ (Final 2025 P / 04/06/2025 P2):** use **Median of Medians (BFPRT)** to find the median $x$ in $\Theta(n)$ worst case, and filter elements $\le x$ in a single pass in $\Theta(n)$ (beats `sort` $\Theta(n\log n)$ and repeated selection $\Omega(n^2)$).

## 3. Dictionaries

A dictionary stores **(key, value)** pairs ($k \in K$, $i \in I$) and lets us manage them efficiently:

:::dictviz
:::


### Hash Tables

**Hash tables** achieve search, insertion, and deletion in **expected constant time $\Theta(1)$**, at the cost of a $\Theta(n)$ worst case (when everything collides).

**The Hash Function**

$$
\text{position} = h(\text{key}) \quad (\text{between } 0 \text{ and } m-1)
$$

The element is stored in slot `T[h(key)]`.

:::hashviz
:::

**Collisions**

Since there are infinitely many possible keys while the table has a limited number of slots, it is inevitable that sooner or later **two different keys will produce the same index** ($h(k_1) = h(k_2)$).

:::collisionviz
:::

To resolve collisions, each slot $T[j]$ is a **linked list** of all elements with $h(k) = j$.

:::chainingviz
:::

---

### Binary Search Trees (BST / ABC)

A **BST** implements the dictionary by leveraging a **total order** on the keys.

:::abcviz
:::

:::oopviz{simulation="diccionari_abc"}
:::

**AVL Trees:**

An **AVL tree** is a BST where, **for every node**, the height difference between its two subtrees is at most 1:

$$
|\text{height}(\text{left}) - \text{height}(\text{right})| \le 1
$$

:::oopviz{simulation="diccionari_avl"}
:::

When an insertion or deletion causes an imbalance ($\text{difference} = \pm 2$), a **local rotation in constant time $\Theta(1)$** is applied to restore balance without breaking the BST ordering:

:::avlrotviz
:::

**Insertion example (Spring Midterm 2021 - Exercise 1(d)):** Draw the resulting AVL tree after inserting the element with key **11** into the following AVL tree:

:::avlinsertviz
:::

**Deletion example:** Draw the resulting AVL tree after deleting the element with key **15** from the following AVL tree:

:::avldeleteviz
:::

### Quick Summary of Hash and AVL for the Final
* **`map` (AVL) vs `unordered_map` (Hash) vs frequency array (Finals 2020 T P1(a), 2023 T P2):**
  * $n$ queries/insertions in `map`: $\sum_{i=1}^{n-1}\log i = \Theta(n \log n)$ in the worst case.
  * In `unordered_map` ($\alpha = n/m$): average cost $\Theta(1+\alpha)$, thus $\Theta(n)$ on average if $m = \Theta(n)$ (worst case $\Theta(n^2)$).
  * If keys are bounded natural numbers ($< 100$): a frequency array gives **guaranteed $\Theta(n)$ in the worst case**.
* **AVL rotations at a glance:** **LL** $\to$ single right; **RR** $\to$ single left; **LR** $\to$ left on child + right on root; **RL** $\to$ right on child + left on root.

### BST Patterns in the Final Exam (Problem 2)

| Technique on BST | Idea / Invariant | Complexity | Exam |
| :--- | :--- | :---: | :--- |
| **Inorder / Reverse inorder** | `left-root-right` yields increasing; `right-root-left` yields decreasing. | $\Theta(n)$ | Final 2023 P P2, 2026 P P2(a) |
| **Range pruning (`print_less_than`)** | If `root->data >= x`, prune the entire right subtree! | $\mathcal{O}(h + k)$ | 10/06/2024 P2(a) |
| **Successor (`upper_bound`)** | If `root->data > x`, search candidate in `left`; if `nullptr`, result is `root`. | $\mathcal{O}(h)$ | Final 2024 T P2(c) |
| **BST $\to$ Max-Heap** | Fill an array (pos. `1..n`) using **reverse inorder** (`right, root, left`); any decreasing array is a *max-heap*. | $\Theta(n)$ | Final 2023 P P2 |
| **Sorted array $\to$ Balanced BST** | Put `v[m]` with `m = (e+d)/2` as root and recursively build `[e..m-1]` and `[m+1..d]`. | $\Theta(n)$ | Final 2026 P P2(b) |
| **Merge two BSTs** | Inorder of A and B $\to$ linear `merge` (remove duplicates) $\to$ rebuild balanced BST. | $\Theta(n)$ | Final 2026 P P2(c) |

**Bounded traversal (10/06/2024 P2a) and recursive Successor (07/01/2025 P2c):**

```cpp
void print_less_than(Node* root, int x) {
    if (root == nullptr) return;
    if (root->data >= x) print_less_than(root->left, x); // Prune right subtree
    else {
        print_less_than(root->left, x);
        cout << root->data << '\n';
        print_less_than(root->right, x);
    }
}

Node* upper_bound_bst(Node* root, int x) {
    if (root == nullptr) return nullptr;
    if (root->data > x) {
        Node* tmp = upper_bound_bst(root->left, x);
        return (tmp == nullptr) ? root : tmp;
    }
    return upper_bound_bst(root->right, x);
}
```

> **BST and Min-Heap at the same time? (Final 2022 P / 02/06/2022 P1(b)):** With $n \ge 3$ nodes it is **impossible**: if root $a$ has both children, $left < a < right$ contradicts $a \le left$; if it is missing a child at level $1$, there would be a node at level $2$ while level $1$ is incomplete (not a complete tree).

---

## 4. Priority Queues and Heaps

### Indexing Formulas (Key to Avoiding Bugs in Code)

| Variant | Array Range | Children of $i$ | Parent of $i$ | Leaf Condition |
| :--- | :---: | :---: | :---: | :---: |
| **1-indexed Binary** | `1 .. n` | `2*i`, `2*i + 1` | `i / 2` | `2*i > n` |
| **0-indexed Binary** | `0 .. n-1` | `2*i + 1`, `2*i + 2` | `(i - 1) / 2` | `2*i + 1 >= n` |
| **1-indexed Ternary** | `1 .. n` | `3*i - 1`, `3*i`, `3*i + 1` | `(i + 1) / 3` | `3*i - 1 > n` |
| **0-indexed Ternary** | `0 .. n-1` | `3*i + 1`, `3*i + 2`, `3*i + 3` | `(i - 1) / 3` | `3*i + 1 >= n` |

### Model Exam Proofs

1. **Leaves of a heap ($\lceil n/2 \rceil$ leaves $\in \Theta(n)$ — Finals 07/01/2025 P2(b), 14/01/2026 P1(b)):**
   In a $1$-indexed *heap* ($1 \dots n$), a node $i$ is a leaf $\iff$ it has no left child $\iff 2i > n \iff i > n/2$. For even $n$, these are exact positions $\frac{n}{2} + 1, \dots, n$, i.e., exactly **$n/2$ leaves** (in general $\lceil n/2 \rceil \in \Theta(n)$).
2. **Height of a ternary heap ($h \in \mathcal{O}(\log n)$ — Final 14/01/2026 P2(a)-(b)):**
   * Geometric sum (by induction on $h$): $1 + 3 + \dots + 3^h = \frac{3^{h+1}-1}{2}$.
   * Minimum number of nodes with height $h$: all first $h$ levels full plus $1$ node at level $h+1$:
     $$n \ge \left(1 + 3 + \dots + 3^{h-1}\right) + 1 = \frac{3^h - 1}{2} + 1 = \frac{3^h + 1}{2} \implies h \le \log_3(2n - 1) \in \mathcal{O}(\log n)$$

**`sink()` in a 1-indexed Ternary Min-Heap (Final 14/01/2026 P2d):**

```cpp
// v[0] is a sentinel; valid elements at 1..n with n = (int)v.size() - 1
void THeap::sink(int i) {
    if (3*i - 1 < (int)v.size()) {
        int pos_min = 3*i - 1;
        if (3*i < (int)v.size() and v[3*i] < v[pos_min]) pos_min = 3*i;
        if (3*i + 1 < (int)v.size() and v[3*i + 1] < v[pos_min]) pos_min = 3*i + 1;
        if (v[pos_min] < v[i]) {
            swap(v[i], v[pos_min]);
            sink(pos_min);
        }
    }
}
```

### Checks and Reconstructions on Heap Arrays
* **Check if an array is a *heap* (Final 07/01/2025 P2(a)):** check every parent $i$ against its children (watch out for `0`- vs `1`-based indexing!).
* **Which element could have been inserted last? (Final 08/01/2024 P1(b)):** an insertion enters at the last position and **`swim`s** toward the root. If we test whether $x$ ends up at node $u$, every node on the path from the last position to $u$ must have moved down one level, and we must check whether that violates the *heap* property with the other child! (Ex.: in a *max-heap* with root `38` and children `32` (left) and `33` (right), `38` cannot be the last inserted element because it would imply `32` was the previous root, impossible since $32 < 33$).
* **Reconstruct missing elements (10/06/2024 P2(b)):** enforce $v[\text{parent}] \le v[i] \le v[\text{child}]$ for each gap; if there are leaves sharing upper bounds at their parent, multiple valid permutations exist.

### Operations, Construction, and `decrease_key`
* **Floyd *bottom-up*:** `sink` from $\lfloor n/2 \rfloor$ down to $1$ costs **$\Theta(n)$** (compared to $\Theta(n\log n)$ when inserting one by one with `swim`).
* **Extracting the $m$ smallest (Final 2025 P / 04/06/2025 P2):** Floyd + $m$ `pop`s costs $\Theta(n + m\log n)$; maintaining a *max-heap* of size $m$ costs $\Theta(n\log m)$; `QuickSelect` (BFPRT) $\Theta(n)$.
* **Priority queue with `decrease_key` (Final 09/06/2020 P3A):** if `find(x)` is linear, $m$ calls cost $\mathcal{O}(m\cdot n)$; adding an `unordered_map<Elem, int> pos` updated on every `swap` in `swim`/`sink` makes `find` $\mathcal{O}(1)$ and `decrease_key` $\mathcal{O}(\log n)$.

---

## 5. Graphs

### Operational Summary of Algorithms and Costs

| Algorithm | Graph Type | Key Structure | Cost (adj. lists) | Critical Exam Detail |
| :--- | :--- | :--- | :---: | :--- |
| **DFS** | Directed / Undirected | Stack / Recursion | $\Theta(n + m)$ | In undirected: cycle if `vis[v]` and `v != parent`. In directed: need *in progress* state. |
| **BFS** | Directed / Undirected | Queue (`queue`) | $\Theta(n + m)$ | Shortest path in **steps** (unweighted). Mark **upon enqueueing**! |
| **Kahn (Toposort)** | DAG | Queue / Min-Heap | $\Theta(n + m)$ | Min `priority_queue` (`greater<int>`) gives the **lexicographical** order. |
| **Dijkstra** | Weights $\ge 0$ | Min-Heap + `S[]` | $\mathcal{O}((n + m)\log n)$ | Without heap on dense graphs ($m \approx n^2$): $\Theta(n^2)$. Fails with weights $< 0$. |
| **Prim (MST)** | Connected undirected | Min-Heap / `vis[]` | $\mathcal{O}(m\log n)$ | Naive version searching min edge leaving `vis`: $\Theta(n(n+m))$. |
| **Kruskal (MST)** | Connected undirected | Sorted edge list + DSU | $\mathcal{O}(m\log n)$ | Better if edges are already available or graph is sparse. |

### 5 Key Graph Patterns in the Final Exam

1. **Naive vs. efficient Kahn (Final 14/01/2026 P3(a)-(c)):** recomputing in-degrees at every step to pick a vertex of degree $0$ makes $n$ calls of cost $\Theta(n + m) \implies \mathbf{\Theta(n(n + m))}$. Since it only works for directed acyclic graphs (**DAG**), on any cycle it will return fewer than $n$ vertices.
2. **Dijkstra counting the number of shortest paths (`ways` — Final 07/01/2025 P3):**
   ```cpp
   if (d[v] > d[u] + c) {
       d[v] = d[u] + c;
       p[v] = p[u];          // Better distance: reset path count
       Q.push({d[v], v});
   }
   else if (d[v] == d[u] + c) {
       p[v] += p[u];         // Exact tie: accumulate paths
   }
   ```
3. **Dijkstra's shortest-path tree is NOT an MST (Final 02/06/2022 P2(c)):**
   Triangle $\{0, 1, 2\}$ with weights $w(0,1) = 5$, $w(0,2) = 5$, $w(1,2) = 3$: from `0`, Dijkstra picks $\{0,1\}$ and $\{0,2\}$ (total cost $10$), whereas the MST is $\{0,1\}$ and $\{1,2\}$ (total cost $8$).
4. **Naive Prim step by step (Final 14/01/2026 P3(d)):** find the minimum-weight edge $(u, v)$ with `vis[u] == true` and `vis[v] == false`:
   ```cpp
   // G[u] stores pairs {weight, neighbor}
   pair<int,int> aux(const vector<vector<pair<int,int>>>& G, const vector<bool>& vis) {
       int min_cost = numeric_limits<int>::max(), min_vertex = -1;
       for (int u = 0; u < (int)G.size(); ++u)
           if (vis[u])
               for (auto [w, v] : G[u])
                   if (not vis[v] and w < min_cost) { min_cost = w; min_vertex = v; }
       return {min_cost, min_vertex};
   }
   ```
5. **Implicit Graph + Monotonic Stack + BFS (Final 08/01/2024 P3 and 04/06/2025 P3):**
   * In state spaces (e.g., two jugs $0 \dots \text{cap}_A \times 0 \dots \text{cap}_B$), initialize `dist` with `-1`/`INF`, mark upon **enqueueing**, and stop when the target is reached.
   * To find the *first strictly greater element to the right* in $\Theta(n)$ (to generate implicit transitions without linear search), use a **decreasing monotonic stack**:
   ```cpp
   vector<int> right_greater(const vector<int>& v) {
       int n = v.size();
       vector<int> sol(n, -1);
       stack<int> S;
       for (int i = 0; i < n; ++i) {
           while (not S.empty() and v[S.top()] < v[i]) {
               sol[S.top()] = i;
               S.pop();
           }
           S.push(i);
       }
       return sol;
   }
   ```

---

## 6. Exhaustive Search, Backtracking, and Branch & Bound

### Schema and Return Types
* **All solutions:** `void rec(...)` (prints or stores in the base case).
* **One solution:** `bool rec(...)` with `if (rec(...)) return true;` to cut off search on the first success.
* **Count solutions:** `int rec(...)` summing the subproblems (`total += rec(...)`).
* **Optimization (Branch & Bound):** `void rec(..., current_cost)` updating `best_cost` and pruning if the optimistic bound cannot improve `best_cost`.

### Base-Case Call Bound Analysis (Fixed Final Exam Question)

| Code Structure | Base-Case Calls (best) | Base-Case Calls (worst) | Total Cost | Exam |
| :--- | :---: | :---: | :---: | :--- |
| **`b1 = SAT(...); b2 = SAT(...); return b1 \|\| b2;`** (no short-circuit) | **$2^n$** | **$2^n$** | $\Theta(2^n \cdot \text{eval})$ | Final 2022 T P3(b) |
| **Permutations with `if (find_ranking(...)) return true;`** | **$1$** (cost $\Omega(n + m)$) | **$n!$** | $\Omega(m \cdot n!)$ (worst) | Finals 10/01/2022 P2(b), 09/06/2026 P3(b) |

> **How to justify the worst-case cost:** Multiply the number of complete configurations that reach the base case (when there is no solution or all must be explored, e.g., $n!$ permutations) by the cost of the checking function (e.g., $\Theta(m)$ of `good_ranking`) $\implies \mathbf{\Theta(m \cdot n!)}$.

### The 4 Key Prunings and the DAG Reduction Trap

1. **Target sum with remaining sum (*Inheritance*, Final 08/01/2021 P2):** prune if `partial_sum > money` (overshoot) **or** if `partial_sum + remaining_sum[idx] < money` (cannot reach target even taking everything left).
2. **Pending elements (*Tutis*, Final 02/06/2022 P3):** if `n - sol.size()` slots remain and we still need `pending` mandatory letters: `if ((int)(n - sol.size()) < pending) return;`.
3. **Optimistic bound in B&B (Knapsack / TSP, Final 09/06/2020 P2B):**
   * Maximize (Knapsack): prune if `cv + rv <= best_value` (`rv` = sum of values of remaining items).
   * Minimize (TSP): prune if `current_cost + M[u][v] >= best_cost` (assuming positive weights).
4. **Permutation with order constraints $\neq$ Backtracking! (Finals 10/01/2022 P2(c), 09/06/2026 P3(c)):** if each constraint only requires $j_1$ to appear before $j_2$ (e.g., $(j_1, j_2, j_3) \implies j_1 \to j_2 \to j_3$), **you don't need $n!$**: it is solved with a **Topological Sort in $\mathcal{O}(n + m)$**.

---

## 7. P vs NP, Reductions, and Multiple-Choice (Problem 4 of the Final)

### Strict Template for Problem 4 Proofs

1. **Prove $X \in \text{NP}$ (3 mandatory steps — e.g., `3-COL-EQUIL`, Final 08/01/2024 P4(b)):**
   * **Witness:** define what $y$ is (e.g., a color function/vector $c: V \to \{1,2,3\}$).
   * **Polynomial size:** justify that $|y| \le p(|x|)$ (e.g., a graph with $n$ vertices and $m$ edges takes $\Theta(n+m)$, and $c$ needs $\le 2n$ bits).
   * **Polynomial verifier:** describe $V(x, y)$ and sum the cost of each check (e.g., scan the $m$ edges in $\Theta(n+m)$ to verify $c(u)\neq c(v)$ and count $|C_i| = n$ in $\Theta(n)$) + conclude $\iff$.

2. **Prove a polynomial reduction $A \le_p B$ (3 mandatory steps — e.g., `3-COL` $\le_p$ `3-COL-EQUIL`, Final 08/01/2024 P4(c)):**
   * **Construction and polynomial cost:** define $\mathcal{F}(x)$ (e.g., 3 disjoint copies of $G$: $3n$ vertices and $3m$ edges) and justify that it is built in polynomial time and size.
   * **($\implies$) $x \in A \implies \mathcal{F}(x) \in B$:** explicitly construct the solution for $\mathcal{F}(x)$ (e.g., use cyclic permutations $(1,2,3), (2,3,1), (3,1,2)$ on the 3 copies so each color appears exactly $n$ times).
   * **($\Longleftarrow$) $\mathcal{F}(x) \in B \implies x \in A$:** explain how a solution for $\mathcal{F}(x)$ yields a valid solution for $x$ (e.g., the first copy inside $G'$ is already a valid 3-coloring of $G$).

### Classic Reduction Mistakes (Diagnostic Questions)
* **`k-COL` $\le_p$ `CNF-SAT` without existence clauses (Final 16/01/2023 P4(a)-(b)):** if the formula only has $(\neg x_{u,c} \lor \neg x_{v,c})$ for each edge $\{u,v\}$, setting all variables to `false` always satisfies it (it would accept $K_3$ in `2-COL`). You must add $(x_{u,1} \lor \dots \lor x_{u,k})$ for all $u \in V$.
* **`SUBSET-SUM` $\le_p$ `PARTITION` with $f(S, \text{obj}) = S \cup \{\text{obj}\}$ (Final 04/06/2025 P4(b)):** **is false**! Counterexample: $S = \{1, 3, 3\}$, $\text{obj} = 3$ is a positive instance of `SUBSET-SUM`, but $f(S, 3) = \{1, 3, 3, 3\}$ sums to $10$ and admits no $5 + 5$ partition. *(The correct reduction adds $\text{sum}(S) - 2\cdot\text{obj}$, adjusting the half-sum to $\text{sum}(S)-\text{obj}$)*.

### Polynomial Special Cases and Frequent NP-C Problems in Finals
* **Common NP-C in finals (besides `SAT`, `3-SAT`, `CLIQUE`, `IS`, `VC`, `k-COLOR`):** `SUBSET-SUM`, `PARTITION`, `HAMILTONIAN-CYCLE`, `TSP`, `3-COL-EQUIL`, `5-COL`.
* **Variants that ARE in $\text{P}$:**
  * Any problem reducible to `2-COL` (bipartite via BFS/DFS, e.g., Final 10/01/2022 P3(b)).
  * `RESTRICTED-3-COL` with connected components of size $\le 10$ (Final 09/06/2026 P4(b)): brute force on each component costs $\mathcal{O}(3^{10}) = \Theta(1) \implies \mathcal{O}(n)$ total.
  * `(n-1)-COL` (Final 04/06/2025 P4(c)): color all vertices differently except two non-adjacent ones $\iff$ **$G$ is not complete ($K_n$)**, checkable in $\mathcal{O}(n^2)$.

### Master Guide for True / False / Unknown (T / F / U)

| Typical Exam Statement | Verdict | Quick Reasoning |
| :--- | :---: | :--- |
| "$A \in \text{NP-C}$, $A \le_p B$ and $B \le_p A$ $\implies B \in \text{NP-C}$" | **T** | $B \le_p A \in \text{NP} \implies B \in \text{NP}$; and $A \le_p B \implies B \in \text{NP-hard}$. |
| "$A \in \text{P}$ and $B \le_p A \implies B \in \text{P}$" | **T** | Closure of $\text{P}$ under polynomial reductions. |
| "$B \in \text{P}$ and $B \le_p A \implies A \in \text{P}$" | **F** | Reducing from an easy problem to $A$ does not bound the difficulty of $A$. |
| "$A, B \in \text{P}$ (with YES/NO instances) $\implies A \le_p B$" | **T** | Decide $x \in A$ in polynomial time and return a fixed YES or NO instance of $B$. |
| "$\text{NP} \cap \text{P} \neq \emptyset$" | **T** | $\text{P} \subseteq \text{NP}$ (any problem in $\text{P}$ is in the intersection). |
| "If $X \in \text{NP}$, no polynomial algorithm is known for $X$" | **F** | False: all problems in $\text{P}$ belong to $\text{NP}$. |
| "If $A \in \text{NP-C}$ and $A \in \text{P} \implies \text{P} = \text{NP}$" | **T** | Any $B \in \text{NP}$ satisfies $B \le_p A \in \text{P} \implies B \in \text{P}$. |
| "If we find $X \in \text{NP} \cap \text{P}$, all of $\text{NP}$ is in $\text{P}$" | **F** | Only holds if $X$ is **$\text{NP-complete}$**, not just any problem in $\text{NP}$. |
| "$\exists A \in \text{P},\ B \in \text{NP-hard}$ with $B \le_p A$" | **U** | Would imply $\text{P} = \text{NP}$ (open problem). |
| "There **exists** a polynomial reduction from `3-COL` to `2-SAT`" | **U** | Would imply $\text{P} = \text{NP}$ (Final 14/01/2026 P4(4)). |
| "A polynomial reduction from `3-COL` to `2-SAT` **is known**" | **F** | Asks about current knowledge: **none** is known (10/06/2024 P4(2)). |
| "There is a polynomial algorithm for `HAMILTONIAN` but not for `3-COL`" | **F** | Both are $\text{NP-C}$: one has a polynomial algorithm $\iff$ the other does too (09/06/2026 P4(c)). |

> **Golden rule for T / F / U tests (+0.5 / -0.25 or -0.5):** Distinguish **"Is known / Is not known"** (current state of knowledge: usually **T** or **F**) from **"Exists / There is / Belongs"** when it implies $\text{P} = \text{NP}$ (usually **U**). If you hesitate between two options and wrong answers deduct points, leave it blank.
