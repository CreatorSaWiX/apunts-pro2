---
title: "EDA Midterm Review"
description: "Summary Topics 1 - 3"
readTime: "20 min"
order: 4
draft: false
---

## 1. Algorithm Analysis

- **$\mathcal{O}(g)$** (upper bound): $f(n) \le c \cdot g(n)$ *(grows at most as fast as $g$)*
- **$\Omega(g)$** (lower bound): $f(n) \ge c \cdot g(n)$ *(grows at least as fast as $g$)*
- **$\Theta(g)$** (tight bound): $c_1 \cdot g(n) \le f(n) \le c_2 \cdot g(n) \iff f \in \mathcal{O}(g) \land f \in \Omega(g)$

:::asymptoticviz
:::

Allows determining the asymptotic relationship between two positive functions $f(n)$ and $g(n)$ by evaluating the limit of their quotient as $n \to \infty$:

$$
L = \lim_{n \to \infty} \frac{f(n)}{g(n)}
$$

| Value of $L$ | Relation | Conclusion |
| :--- | :--- | :--- |
| **$L = 0$** | $f < g$ | $f \in \mathcal{O}(g)$, $f \notin \Omega(g)$, $f \notin \Theta(g)$ |
| **$0 < L < \infty$** | $f \approx g$ | $f \in \Theta(g)$ (and therefore $f \in \mathcal{O}(g)$ and $f \in \Omega(g)$) |
| **$L = \infty$** | $f > g$ | $f \in \Omega(g)$, $f \notin \mathcal{O}(g)$, $f \notin \Theta(g)$ |
| **Does not exist** | Oscillates | Apply formal definition directly using $c$ and $n_0$. |

### Simplification Identities for Limits and Comparisons

:::growthviz
:::

### Properties of Logarithms and Natural Logarithms ($\log_b, \ln$)
| Property | Mathematical Formulation | Example |
| :--- | :--- | :--- |
| **Product to sum** | $\log_b(x \cdot y) = \log_b x + \log_b y$ | $\log(2n) = \log 2 + \log n \implies \Theta(\log n)$|
| **Quotient to subtraction** | $\log_b(x / y) = \log_b x - \log_b y$ | $\log(n / 2) = \log n - \log 2 \implies \Theta(\log n)$ |
| **Power to product** | $\log_b(x^k) = k \cdot \log_b x$ | $\log(n^3) = 3 \log n \implies \Theta(\log n)$. <br>$\log(n^2) = 2\log n \neq (\log n)^2$ |
| **Natural log ($\ln$) and $e$** | $\ln x = \log_e x \quad (e \approx 2.718)$ | $\ln(e^x) = x, \quad e^{\ln x} = x$ |
| **Change of base** | $\log_b x = \frac{\log_a x}{\log_a b} = \frac{\ln x}{\ln b}$ | $\log_2 n = \frac{\ln n}{\ln 2} \implies \Theta(\log_a n) = \Theta(\log_b n)$ |
| **Nested logarithms** | $\log(\log(n^k)) = \log(k \log n) = \log k + \log(\log n)$ | $\log(\log(n^2)) = \log 2 + \log(\log n) \implies \Theta(\log(\log n))$ |
| **Stirling (Factorial)** | $\log(n!) = \sum_{i=1}^n \log i = \Theta(n \log n)$ | Useful for sorting lower bounds and limits involving $n!$ |

> **Caution with base in the exponent:** The base of a logarithm **does alter asymptotic complexity** when positioned in the exponent:  
> $2^{\log_2 n} = n$, but $2^{\log_3 n} = n^{\log_3 2} \approx n^{0.631} \implies 2^{\log_2 n} \gg 2^{\log_3 n}$.

### Properties of Powers, Exponentials ($a^n, e^n$), and Radicals
| Property | Formulation | Example |
| :--- | :--- | :--- |
| **Sum in exponent** | $a^{x + y} = a^x \cdot a^y$ | $2^{n + 3} = 2^3 \cdot 2^n = 8 \cdot 2^n \implies \mathbf{\Theta(2^n)}$ |
| **Product in exponent** | $a^{k \cdot n} = (a^k)^n$ | $2^{2n} = (2^2)^n = 4^n \implies \mathbf{4^n \gg 2^n}$ |
| **Exponent difference (quotient)** | $\frac{a^n}{b^n} = \left(\frac{a}{b}\right)^n$ | $\frac{2^n}{3^n} = (2/3)^n \xrightarrow{n\to\infty} 0 \quad (b > a \implies a^n \ll b^n)$ |
| **Roots as fractional powers** | $\sqrt[k]{n^p} = n^{p/k}$ | $\sqrt{n} = n^{1/2}, \quad \sqrt[3]{n^2} = n^{2/3}, \quad \sqrt{n^3 + 1} \in \Theta(n^{3/2})$ |
| **Conversion to base $e$** | $a^x = e^{x \ln a}$ | $2^n = e^{n \ln 2}, \quad n^n = e^{n \ln n}$ |
| **Key Swap Identity** | $\mathbf{a^{\log_b n} = n^{\log_b a}}$ | $4^{\log_2 n} = n^{\log_2 4} = n^2 \quad \vert \quad 3^{\log_2 n} = n^{\log_2 3} \approx n^{1.585}$ |

### Elementary Operations and Parameter Passing

| Concept / Operation | Cost | Rationale / Rule |
| :--- | :---: | :--- |
| **Primitive operations & simple I/O** | $\Theta(1)$ | Scalar assignments, arithmetic/logic/relational operators, and scalar `cin`/`cout`. |
| **Indexed access `v[i]`** | $\Theta(1)$ | Pointer arithmetic over contiguous buffer ($\text{address} = \text{base} + i \cdot \text{size}$). |
| **Pass by reference (`&`, `const &`)** | $\Theta(1)$ | Memory address pointer is copied without duplicating backing elements. |
| **Pass by value (`vector<T>` of size $n$)** | $\Theta(n)$ | Deep copies all $n$ items, allocating heap memory buffers. |

**Selection Sort**
:::selectionsortviz
:::

**Insertion Sort**
:::insertionsortviz
:::

---

### Master Theorem for Subtractive Recurrences
Applies to recurrence relations where subproblem sizes decrease by a constant $c \ge 1$:

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

### Master Theorem for Divide-and-Conquer Recurrences

$$
C(n) = \begin{cases} \Theta(1), & \text{if } n < n_0 \\ a \cdot C(n/b) + g(n), & \text{if } n \ge n_0 \end{cases} \qquad C(n) \in \begin{cases} 
\Theta(n^k), & \text{if } \alpha < k \iff a < b^k \\ 
\Theta(n^k \log n), & \text{if } \alpha = k \iff a = b^k \\ 
\Theta(n^\alpha) = \Theta(n^{\log_b a}), & \text{if } \alpha > k \iff a > b^k 
\end{cases}
$$

| Algorithm | Recurrence | Parameters | Relation | Complexity |
| :--- | :--- | :--- | :--- | :---: |
| **Binary Search** | $C(n) = C(n/2) + \Theta(1)$ | $a=1, b=2, k=0$ | $\alpha = 0 = k$ | $\Theta(\log n)$ |
| **Mergesort** | $C(n) = 2C(n/2) + \Theta(n)$ | $a=2, b=2, k=1$ | $\alpha = 1 = k$ | $\Theta(n \log n)$ |
| **Karatsuba** | $C(n) = 3C(n/2) + \Theta(n)$ | $a=3, b=2, k=1$ | $\alpha = \log_2 3 \approx 1.585 > k$ | $\Theta(n^{1.585})$ |
| **Strassen** | $C(n) = 7C(n/2) + \Theta(n^2)$ | $a=7, b=2, k=2$ | $\alpha = \log_2 7 \approx 2.807 > k$ | $\Theta(n^{2.807})$ |

## 2. Divide and Conquer

The total running time of a divide-and-conquer algorithm originates from three distinct components:

$$
T(n) = \underbrace{T_{\text{divide}}(n)}_{\text{partition}} + \underbrace{a \cdot T(n/b)}_{\text{recursive subproblems}} + \underbrace{T_{\text{combine}}(n)}_{\text{merge/synthesis}}
$$

Where the non-recursive overhead $g(n) = T_{\text{divide}}(n) + T_{\text{combine}}(n)$ typically belongs to $\Theta(n^k)$ for $k \ge 0$, solved via the **Master Theorem for divide-and-conquer recurrences**.

:::dncviz
:::

| Algorithm | Computational Problem | Recurrence Equation $T(n)$ | Time Complexity |
| :--- | :--- | :--- | :---: |
| **Binary Search** | Search in sorted array | $T(n) = T(n/2) + \Theta(1)$ | $\Theta(\log n)$ |
| **Fast Exponentiation** | Compute $x^n$ | $T(n) = T(n/2) + \Theta(1)$ | $\Theta(\log n)$ |
| **MergeSort** | Stable sorting | $T(n) = 2T(n/2) + \Theta(n)$ | $\Theta(n \log n)$ |
| **QuickSort (best/average)** | In-place sorting | $T(n) = 2T(n/2) + \Theta(n)$ | $\Theta(n \log n)$ |
| **QuickSort (worst case)** | In-place sorting | $T(n) = T(n-1) + \Theta(n)$ | $\Theta(n^2)$ |
| **Karatsuba** | Product of two $n$-bit integers | $T(n) = 3T(n/2) + \Theta(n)$ | $\mathbf{\Theta(n^{\log_2 3}) \approx \Theta(n^{1.585})}$ |
| **Strassen** | Matrix multiplication $n \times n$ | $T(n) = 7T(n/2) + \Theta(n^2)$ | $\mathbf{\Theta(n^{\log_2 7}) \approx \Theta(n^{2.807})}$ |
| **Towers of Hanoi** | Transfer $n$ disks | $T(n) = 2T(n-1) + \Theta(1)$ | $\mathbf{\Theta(2^n)}$ (exact: $2^n - 1$) |
| **QuickSelect (average case)** | Select $k$-th order statistic | $T(n) = T(n/2) + \Theta(n)$ | $\Theta(n)$ |
| **QuickSelect (worst case)** | Select $k$-th order statistic | $T(n) = T(n-1) + \Theta(n)$ | $\Theta(n^2)$ |
| **Median of Medians (BFPRT)** | Select $k$-th statistic (worst case) | $T(n) = T(n/5) + T(3n/4) + \Theta(n)$ | $\mathbf{\Theta(n)}$ |

### Binary Search $\Theta(\log n)$
:::binarysearchviz
:::

:::oopviz{simulation="binary_search"}
:::

### MergeSort $\Theta(n \log n)$

:::mergerecviz
:::

:::mergeviz
:::

:::oopviz{simulation="mergesort"}
:::

---

### Hybrid MergeSort with Threshold
:::hybridmergeviz
:::

```cpp
const int talla_critica = 50;
if (d - e < talla_critica) ordena_insercio(T, e, d);
else {
    int m = (e + d) / 2;
    mergesort(T, e, m);
    mergesort(T, m + 1, d);
    merge(T, e, m, d);
}
```

### Iterative Queue-based MergeSort
:::mergequeueviz
:::

```text
function mergesort_queue(a[1...n]):
    Q = empty queue
    for each element x in a:
        enqueue(Q, [x])
    while size(Q) > 1:
        enqueue(Q, merge(dequeue(Q), dequeue(Q)))
    return dequeue(Q)
```

### In-place Bottom-up MergeSort

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

### QuickSort $\Theta(n \log n)$ with Worst Case $\Theta(n^2)$

:::quicksortviz
:::

### Hoare's Partition
:::hoarepartviz
:::

:::oopviz{simulation="quicksort"}
:::

### Pivot Selection Strategies

Median-of-three pivot code:
```cpp
int centre = (e + d) / 2;
if (T[e] < T[centre]) swap(T[centre], T[e]);
if (T[d] < T[centre]) swap(T[centre], T[d]);
if (T[d] < T[e]) swap(T[e], T[d]);
// Median element is now located at T[e]
```

---

### Fast Exponentiation $ \mathbf{T(n) \in \Theta(\log n)} $

:::fastpowerviz
:::

:::oopviz{simulation="fast_power"}
:::

### Karatsuba Algorithm $\Theta(n^{1.585})$

:::karatsubaviz
:::

### Strassen Algorithm $\Theta(n^{2.807})$

:::strassenmatmultviz
:::

### The Towers of Hanoi

:::hanoiviz
:::

```cpp
void hanoi(int n, char a, char b, char c) {
    if (n > 0) {
        hanoi(n - 1, a, c, b); // Move n-1 disks from source (a) to auxiliary (b) via destination (c)
        cout << a << " -> " << c << "\n"; // Move largest base disk
        hanoi(n - 1, b, a, c); // Move n-1 disks from auxiliary (b) to destination (c) via source (a)
    }
}
```

### Median of Medians

:::medianviz
:::

:::bfprtviz
:::

## 3. Dictionaries

A dictionary ADT maintains pairs of **(key, value)** ($k \in K$, $i \in I$), enabling efficient query and updates:

:::dictviz
:::

### Hash Tables

**Hash tables** provide search, insertion, and deletion in **expected constant time $\Theta(1)$**, at the expense of a $\Theta(n)$ worst case under pathological collisions.

**Hash Function**

$$
\text{index} = h(\text{key}) \quad (\text{range } [0, m-1])
$$

The entry is stored in slot `T[h(key)]`.

:::hashviz
:::

**Collisions**

Because the universe of keys is vast while table capacity $m$ is finite, collisions where distinct keys yield the identical index ($h(k_1) = h(k_2)$) are mathematically inevitable.

:::collisionviz
:::

In collision resolution via separate chaining, each bucket $T[j]$ maintains a **linked list** of colliding keys.

:::chainingviz
:::

---

### Binary Search Trees (BST)

A **BST** implements the dictionary ADT relying on a **total order** over keys.

:::abcviz
:::

:::oopviz{simulation="diccionari_abc"}
:::

**AVL Trees:**

An **AVL tree** is a self-balancing BST where, **for every node**, subtrees differ in height by at most 1:

$$
|\text{height}(\text{left}) - \text{height}(\text{right})| \le 1
$$

:::oopviz{simulation="diccionari_avl"}
:::

When insertions or deletions violate height invariants ($\text{balance} = \pm 2$), a **local rotation in constant time $\Theta(1)$** restores balance without violating in-order keys:

:::avlrotviz
:::

**Insertion Example (Spring 2021 Midterm - Exercise 1(d)):** Draw the resulting AVL tree after inserting key **11** into the following AVL tree:

:::avlinsertviz
:::

**Deletion Example:** Draw the resulting AVL tree after deleting key **15** from the following AVL tree:

:::avldeleteviz
:::
