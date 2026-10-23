---
title: "Topic 2: Divide and Conquer"
description: "Divide-and-conquer and subtractive recurrences, sorting (MergeSort, QuickSort), fast exponentiation, Karatsuba, Strassen, Towers of Hanoi, and linear selection (BFPRT)."
readTime: "45 min"
order: 2
draft: false
---

The **divide and conquer** paradigm decomposes a problem of size $n$ into smaller subproblems of the same type, solves them recursively, and combines their solutions to construct the global result.

| Phase | Action | Associated Cost |
| :--- | :--- | :---: |
| **1. Divide** | Partition input into $a \ge 1$ subproblems of size $n/b$ with $b > 1$. | $T_{\text{divide}}(n)$ |
| **2. Conquer** | Recursively solve the $a$ subproblems (direct $\Theta(1)$ solution at base cases). | $a \cdot T(n/b)$ |
| **3. Combine** | Assemble partial solutions to form the global solution. | $T_{\text{combine}}(n)$ |

:::dncviz
:::

### Temporal Cost Decomposition
The total cost of a divide-and-conquer algorithm derives exclusively from three sources:

$$
T(n) = \underbrace{T_{\text{divide}}(n)}_{\text{partition}} + \underbrace{a \cdot T(n/b)}_{\text{recursive calls}} + \underbrace{T_{\text{combine}}(n)}_{\text{merge/synthesis}}
$$

Where non-recursive overhead $g(n) = T_{\text{divide}}(n) + T_{\text{combine}}(n)$ typically belongs to $\Theta(n^k)$ for $k \ge 0$, solvable using the **Master Theorem for divide-and-conquer recurrences**.

### Introductory Example: Binary Search
Given a **sorted** array $A[0 \dots n-1]$, we determine whether an element $x$ is present. At each step we compare $x$ with middle element $A[m]$: if matching, search succeeds; if $x < A[m]$, search recursively in left half; if $x > A[m]$, in right half.

:::binarysearchviz
:::

:::oopviz{simulation="binary_search"}
:::

The recursion parameter is $n = j - i + 1$. Each level performs strictly **one** recursive branch ($a = 1$) on a half-size subproblem ($b = 2$), with constant non-recursive overhead ($g(n) \in \Theta(1) \implies k = 0$).

$$ 
T(n) = T(n/2) + \Theta(1) 
$$

By the Master Theorem: $\alpha = \log_b a = \log_2 1 = 0$. Since $\alpha = k = 0$:

$$ 
\mathbf{T(n) \in \Theta(n^0 \log n) = \Theta(\log n)} 
$$

---

## 2.1 MergeSort

**MergeSort** is a divide-and-conquer algorithm where subproblem partitioning is trivial while the computational bulk lies in merging the sorted subproblems.

:::mergerecviz
:::

| Property | Behavior | Justification |
| :--- | :---: | :--- |
| **Time Complexity** | $\Theta(n \log n)$ | Optimal in comparison model; identical in best, average, and worst cases (non-adaptive). |
| **Stability** | Yes | Preserves original relative order of items with identical keys. |
| **Auxiliary Memory** | $\Theta(n)$ | Requires an auxiliary vector during the merge step (not *in-place*). |

### Stability and Multi-Key Sorting

An algorithm is **stable** if for any pair of elements with equal keys ($x = y$), if $x$ precedes $y$ in the input, $x$ precedes $y$ in the output.

This property enables **multi-key sorting**: to sort records across multiple priority keys, stable sorting is applied successively from the least significant key to the most significant key.

| Step | Applied Criterion | Resulting Sequence |
| :---: | :--- | :--- |
| **0** | Unsorted input | $\langle 6, 7 \rangle,\; \langle 3, 2 \rangle,\; \langle 1, 4 \rangle,\; \langle 3, 1 \rangle,\; \langle 1, 6 \rangle,\; \langle 4, 7 \rangle$ |
| **1** | Sort by 2nd component | $\langle 3, \mathbf{1} \rangle,\; \langle 3, \mathbf{2} \rangle,\; \langle 1, \mathbf{4} \rangle,\; \langle 1, \mathbf{6} \rangle,\; \langle 6, \mathbf{7} \rangle,\; \langle 4, \mathbf{7} \rangle$ |
| **2** | Stable sort by 1st component | $\langle \mathbf{1}, 4 \rangle,\; \langle \mathbf{1}, 6 \rangle,\; \langle \mathbf{3}, 1 \rangle,\; \langle \mathbf{3}, 2 \rangle,\; \langle \mathbf{4}, 7 \rangle,\; \langle \mathbf{6}, 7 \rangle$ |

---

### Recursive Scheme and Implementation

The algorithm operates over an array $T$ bounded by indices $e$ (start) and $d$ (end). It splits at midpoint $m = \lfloor(e + d) / 2\rfloor$, recursively sorts both halves, and merges them via `merge`.

Merging combines two adjacent sorted subvectors, $T[e \dots m]$ and $T[m+1 \dots d]$, writing a single ordered subvector into $T[e \dots d]$. Performing this in linear time requires an auxiliary buffer $B$ of size $d - e + 1$.

:::mergeviz
:::

| Key Aspect | Source Mechanism | Justification / Effect |
| :--- | :--- | :--- |
| **Auxiliary Size** | `vector<elem> B(d - e + 1)` | Total element count in closed range $[e, d]$. |
| **Stability** | `if (T[i] <= T[j])` | On ties ($T[i] = T[j]$), selects left element, preserving relative order. |
| **Residual Loops** | `while (i <= m)`, `while (j <= d)` | Flushes remaining elements. Mutually exclusive (one pointer reaches its boundary). |
| **Shift Back** | `T[e + k] = B[k]` | Copies sorted buffer $B[0 \dots n-1]$ back into window $T[e \dots d]$. |
| **Merge Cost** | $T_{\text{merge}}(n) \in \Theta(n)$ | Incurs at most $n - 1$ comparisons and exactly $2n$ assignments ($n$ to $B$, $n$ back to $T$). |

:::oopviz{simulation="mergesort"}
:::

### Time Complexity Analysis

The runtime $T(n)$ for a subvector of size $n = d - e + 1$ satisfies:

$$
T(n) = \begin{cases} \Theta(1) & \text{if } n \le 1 \\ 2T(n/2) + \Theta(n) & \text{if } n > 1 \end{cases}
$$

Applying the Master Theorem ($a = 2, b = 2, k = 1$):

$$
\alpha = \log_b a = \log_2 2 = 1
$$

Since $\alpha = k = 1$:

$$
T(n) \in \Theta(n^k \log n) = \Theta(n \log n)
$$

This cost is invariant to initial input configuration:

$$
T_{\min}(n) = T_{\text{avg}}(n) = T_{\max}(n) = \Theta(n \log n)
$$

---

### Optimization Variants

### Hybridization via Critical Threshold
For small subproblems ($n < k_0 \approx 50$), insertion sort outperforms MergeSort due to lower constant multipliers and absence of dynamic allocations. Below this cutoff, recursion stops in favor of insertion sort:

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

### Iterative Queue-based MergeSort (*bottom-up*)
Builds sorted sequences bottom-up: enqueues each single element as a singleton vector, then iteratively dequeues and merges pairs until a single vector remains:

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

### In-Place Bottom-Up MergeSort
Applies the bottom-up pattern directly on the array without queue overhead, merging adjacent power-of-two runs ($m = 1, 2, 4, 8, \dots$):

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

## 2.2 QuickSort

**QuickSort** is an *in-place* divide-and-conquer sorting algorithm. It features average complexity $\Theta(n \log n)$ and worst case $\Theta(n^2)$, with very low constant factors making it fast in practice.

### Algorithm Phases

| Phase | Action | Associated Cost |
| :--- | :--- | :---: |
| **1. Choose Pivot** | Select a pivot element $x \in T$. | $\Theta(1)$ |
| **2. Partition** | Rearrange $T$ into two segments: elements $\le x$ on the left and $\ge x$ on the right. | $\Theta(n)$ |
| **3. Conquer** | Recursively sort both partitions. | $T(n_1) + T(n_2)$ |
| **4. Combine** | Trivial: elements are already ordered in memory. | $\Theta(1)$ |

:::quicksortviz
:::

### Duality: MergeSort vs QuickSort

MergeSort and QuickSort present inverse computational symmetries across their execution phases:

| Characteristic | MergeSort | QuickSort |
| :--- | :---: | :---: |
| **Division Phase** | Trivial: midpoint ($\Theta(1)$) | Complex: partition around pivot ($\Theta(n)$) |
| **Subproblems** | Balanced ($n/2$) | Variable by pivot ($n_1 + n_2 = n$) |
| **Combine Phase** | Complex: linear merge ($\Theta(n)$) | None: in-place placement ($\Theta(1)$) |
| **Auxiliary Memory** | $\Theta(n)$ (buffer) | $\Theta(1)$ auxiliary (*in-place*) |
| **Stability** | Stable | Not stable |
| **Worst Case** | $\Theta(n \log n)$ | $\Theta(n^2)$ |
| **Average Case** | $\Theta(n \log n)$ | $\Theta(n \log n)$ |

---

### Hoare's In-Place Partition
Hoare's partition requires no auxiliary buffer. It uses two pointers: $i$ (advancing from the left looking for elements $\ge x$) and $j$ (advancing from the right looking for elements $\le x$). When both halt, they swap entries and continue until meeting ($i \ge j$).

:::hoarepartviz
:::

:::oopviz{simulation="quicksort"}
:::

| Technical Aspect | Formal Description |
| :--- | :--- |
| **Pointers & Pre-operators** | Initialized to $i = e - 1$ and $j = d + 1$. Pre-increments (`++i`) and pre-decrements (`--j`) ensure initial evaluation targets boundaries $e$ and $d$. |
| **Postcondition** | Returning $q = j$ guarantees $\forall k \in [e \dots q], T[k] \le x$ and $\forall k \in [q+1 \dots d], T[k] \ge x$. |
| **Computational Cost** | Linear time $\mathbf{\Theta(n)}$ (each item tested a constant number of times, $\le n/2$ swaps) and $\mathbf{\Theta(1)}$ auxiliary memory. |

---

### Pivot Selection Strategies
Because Hoare's partition uses $T[e]$ as pivot, alternative strategies choose a candidate and swap it into $T[e]$ initially:

| Strategy | Mechanism | Advantage | Drawback |
| :--- | :--- | :--- | :--- |
| **First Element ($x = T[e]$)** | Direct selection of first slot. | Zero selection cost ($\Theta(1)$). | Degenerates to $\Theta(n^2)$ on sorted or reverse-sorted input. |
| **Random Pivot** | Random index $p \in [e, d]$ and `swap(T[e], T[p])`. | Breaks input ordering correlation. | Overhead generating pseudorandom numbers. |
| **Median-of-Three** | Median of $T[e]$, $T[\lfloor(e+d)/2\rfloor]$, and $T[d]$. | Ensures pivot is never an extreme value. | Requires 3 comparisons and swaps upfront per partition. |
| **Insertion Hybrid** | Fall back to insertion when $d - e < 20$. | Reduces recursion overhead on tiny subvectors. | Requires tuning cutoff threshold per hardware architecture. |

Median-of-three snippet:
```cpp
int centre = (e + d) / 2;
if (T[e] < T[centre]) swap(T[centre], T[e]);
if (T[d] < T[centre]) swap(T[centre], T[d]);
if (T[d] < T[e]) swap(T[e], T[d]);
// Median now situated at T[e]
```

---

### QuickSort Complexity Analysis
Let $i$ denote the size of the left partition ($1 \le i \le n - 1$). The general recurrence is:

$$ T(n) = T(i) + T(n - i) + \Theta(n) $$

| Case | Partition Condition | Recurrence | Asymptotic Complexity |
| :--- | :--- | :--- | :---: |
| **Worst** | Maximal imbalance ($i = 1$ or $i = n - 1$ via extreme pivot) | $T(n) = T(n - 1) + \Theta(n)$ | $\mathbf{\Theta(n^2)}$ |
| **Best** | Exact balance ($i = n/2$, symmetric bisection) | $T(n) = 2T(n/2) + \Theta(n)$ | $\mathbf{\Theta(n \log n)}$ |

---

### Practical Comparison: QuickSort vs MergeSort in Hardware Architecture
Despite both sharing $\Theta(n \log n)$ asymptotic bounds, QuickSort is typically $2\times$ to $3\times$ faster on physical hardware due to memory hierarchy caching:

| Memory Level | Typical Access Latency | Relative Slowdown vs Registers |
| :--- | :--- | :---: |
| **CPU Registers** | $< 0.5 \text{ ns}$ | $1\times$ |
| **L1 Cache** | $\sim 1 \text{ ns}$ | $2\times$ |
| **L2 Cache** | $\sim 7 \text{ ns}$ | $14\times$ |
| **L3 Cache** | $\sim 20 \text{ ns}$ | $40\times$ |
| **Main Memory (RAM)** | $\sim 100 \text{ ns}$ | **$200\times$** |

| Architectural Factor | QuickSort | MergeSort |
| :--- | :--- | :--- |
| **Spatial Locality & Cache** | High (*in-place*). Sequential inward scans maximize L1 and L2 cache hits. | Lower. Alternating between primary buffer and auxiliary array triggers cache misses. |
| **Dynamic Memory Allocation** | None. Operates directly in existing buffer ($\Theta(1)$ extra space). | Significant. Requires allocating and freeing $\Theta(n)$ auxiliary memory for merges. |
| **Inner Loop Constant Factor** | Very small. Tight loop consists only of index shifts and comparisons. | Higher. Involves moving records to auxiliary buffer and copying back. |

---

## 2.3 Exponentiation: Fast Exponentiation

Computing integer powers $x^n$ demonstrates how divide-and-conquer reduces linear running times to logarithmic complexity.

| Approach | Mechanism | Recurrence / Operation Count | Time Complexity | Auxiliary Memory |
| :--- | :--- | :---: | :---: | :---: |
| **Naive Iterative** | Repeated multiplication $\prod_{i=1}^n x$ | $n - 1 \text{ multiplications}$ | $\Theta(n)$ | $\Theta(1)$ |
| **Divide and Conquer** | Recursive computation of $x^{\lfloor n/2 \rfloor}$ followed by squaring | $T(n) = T(n/2) + \Theta(1)$ | $\mathbf{\Theta(\log n)}$ | $\Theta(\log n)$ (call stack) |

Recurrence definition:

$$
x^n = \begin{cases} 
1, & \text{if } n = 0 \quad\text{(base case)} \\ 
\left(x^{n/2}\right)^2, & \text{if } n \text{ is even} \\ 
\left(x^{(n-1)/2}\right)^2 \cdot x, & \text{if } n \text{ is odd} 
\end{cases}
$$

:::fastpowerviz
:::

:::oopviz{simulation="fast_power"}
:::

### Complexity Analysis and Call Branching

Storing the intermediate subpower in a local variable (`y = potencia(x, n/2)`) enforces a single recursive call per step:

| Master Theorem Parameter | Value | Mathematical Rationale |
| :--- | :---: | :--- |
| **Subproblem Count ($a$)** | $1$ | Exactly one recursive call via intermediate variable reuse. |
| **Division Factor ($b$)** | $2$ | Exponent is halved at each step. |
| **Non-recursive Overhead ($g(n)$)** | $\Theta(1)$ | Parity check and at most two scalar multiplications ($k = 0$). |

Recurrence:
$$ T(n) = T(n/2) + \Theta(1) $$

Since $\alpha = \log_b a = \log_2 1 = 0$ and $k = 0$ ($\alpha = k$):
$$ \mathbf{T(n) \in \Theta(\log n)} $$

> **Note on redundant calls:**  
> If written redundantly (`potencia(x, n/2) * potencia(x, n/2)`), the call count becomes $a = 2$, yielding $T(n) = 2T(n/2) + \Theta(1)$, which evaluates to $\Theta(n)$ and completely negates algorithmic efficiency.

### Practical Applications

| Domain | Application | Resulting Complexity |
| :--- | :--- | :---: |
| **Matrix Algebra** | Computing the $n$-th Fibonacci term via matrix power $\begin{pmatrix} 1 & 1 \\ 1 & 0 \end{pmatrix}^n$. | $\Theta(\log n)$ |
| **Cryptography** | Modular exponentiation ($x^n \pmod m$) in public-key cryptosystems (RSA, Diffie-Hellman). | $\Theta(\log n)$ |

---

## 2.4 Large Integer Multiplication: Karatsuba's Algorithm

Multiplying two $n$-digit (or $n$-bit) integers is a foundational primitive in computational arithmetic and cryptography.
In the traditional grade-school method, the first number is multiplied by each of the $n$ digits of the second, shifting each partial row:

$$
\begin{array}{rl}
2014 & \\
\times 1714 & \\
\hline
8056 & \quad (\text{row 1: } 2014 \times 4 \cdot 10^0) \\
2014\phantom{0} & \quad (\text{row 2: } 2014 \times 1 \cdot 10^1) \\
14098\phantom{00} & \quad (\text{row 3: } 2014 \times 7 \cdot 10^2) \\
2014\phantom{000} & \quad (\text{row 4: } 2014 \times 1 \cdot 10^3) \\
\hline
3451996 &
\end{array}
$$

| Grade-School Stage | Elementary Operation | Operation Count | Complexity |
| :--- | :--- | :---: | :---: |
| **Row Generation** | $n$ rows of $n$ digit products and carries | $n \times n$ | $\Theta(n^2)$ |
| **Column Addition** | Vertical additions across $2n$ columns | $\approx 2n \times n$ | $\Theta(n^2)$ |

Total grade-school runtime:
$$ T_{\text{school}}(n) = \Theta(n^2) + \Theta(n^2) = \mathbf{\Theta(n^2)} $$

---

### Naive Recursive Decomposition (4 Subproducts)

In 1952, **Andrei Kolmogorov** conjectured that multiplying two $n$-digit integers possessed an insurmountable asymptotic lower bound of $\Omega(n^2)$ operations.

:::naivemultviz
:::

Representing two $n$-bit integers $x$ and $y$ (with $n$ even) partitioned into upper ($E$) and lower ($D$) halves:

$$ 
x = 2^{n/2} x_E + x_D, \qquad y = 2^{n/2} y_E + y_D 
$$

Where $x_E, x_D, y_E, y_D$ are $n/2$-bit integers. Distributing terms:

$$ 
xy = 2^n (x_E y_E) + 2^{n/2} (x_E y_D + x_D y_E) + (x_D y_D) 
$$

This requires **4 products** of size $n/2$: $x_E y_E$, $x_E y_D$, $x_D y_E$, and $x_D y_D$. Multiplying by $2^n$ and $2^{n/2}$ amounts to bit shifts costing $\Theta(n)$, while adding $\mathcal{O}(n)$-bit terms takes linear time $\Theta(n)$.

| Recurrence Parameter | Value | Computational Meaning |
| :--- | :---: | :--- |
| **Subproblem Count ($a$)** | $4$ | The 4 cross-products ($x_E y_E, x_E y_D, x_D y_E, x_D y_D$). |
| **Reduction Factor ($b$)** | $2$ | Splitting operands into halves ($n/2$ bits). |
| **Non-recursive Work ($g(n)$)** | $\Theta(n)$ | Bit shifts and additions on bit arrays ($k = 1$). |

Recurrence:
$$ 
T(n) = 4T(n/2) + \Theta(n) 
$$

Since $\alpha = \log_b a = \log_2 4 = 2 > k = 1$:
$$ 
\mathbf{T(n) \in \Theta(n^{\log_2 4}) = \Theta(n^2)} 
$$

Direct decomposition fails to lower the asymptotic bound and incurs call-stack overhead.

---

### Karatsuba's Reduction (1960) and Gauss's Identity

:::karatsubaviz
:::

In 1960, **Anatolii Karatsuba** disproved Kolmogorov's conjecture, inspired by Gauss's trick for complex numbers:

$$ 
(a + bi)(c + di) = (ac - bd) + (bc + ad)i 
$$

where cross-term $bc + ad$ requires only one extra product:

$$ 
bc + ad = (a + b)(c + d) - ac - bd 
$$

Applying this to binary integers, Karatsuba defines three products:

$$
\begin{aligned}
a &= x_E \cdot y_E \\
b &= x_D \cdot y_D \\
c &= (x_E + x_D)(y_E + y_D)
\end{aligned}
$$

Expanding $c$:
$$ 
c = x_E y_E + x_E y_D + x_D y_E + x_D y_D = a + (x_E y_D + x_D y_E) + b 
$$

From which cross-terms are derived via subtraction:
$$ 
x_E y_D + x_D y_E = c - a - b 
$$

Final product formulation:
$$ 
\mathbf{xy = 2^n a + 2^{n/2} (c - a - b) + b} 
$$

---

### Complexity Analysis of Karatsuba

The algorithm requires only **3 recursive calls** on $n/2$-bit operands ($a$, $b$, and $c$). Linear additions, subtractions, and bit shifts over $\mathcal{O}(n)$ bit vectors yield $g(n) \in \Theta(n)$.

$$ 
T(n) = 3T(n/2) + \Theta(n) 
$$

| Master Theorem Parameter | Value | Meaning |
| :--- | :---: | :--- |
| **Call Count ($a$)** | $3$ | Subproducts $a = x_E y_E$, $b = x_D y_D$, and $c = (x_E + x_D)(y_E + y_D)$. |
| **Reduction Factor ($b$)** | $2$ | Bit length is halved. |
| **Overhead ($k$)** | $1$ | Linear shifts and additions ($\Theta(n^1)$). |

Critical exponent:
$$ 
\alpha = \log_b a = \log_2 3 \approx 1.58496 
$$

Since $\alpha = \log_2 3 > k = 1$:
$$ 
\mathbf{T(n) \in \Theta(n^{\log_2 3}) \approx \Theta(n^{1.585})} 
$$

Because $n^{1.585} \in o(n^2)$, this formally proves that **integer multiplication has strictly subquadratic complexity**.

| Algorithm | Subproducts | Recurrence | Asymptotic Complexity |
| :--- | :---: | :--- | :---: |
| **Grade-School** | — | — | $\Theta(n^2)$ |
| **Naive Divide & Conquer** | 4 of size $n/2$ | $T(n) = 4T(n/2) + \Theta(n)$ | $\Theta(n^2)$ |
| **Karatsuba** | 3 of size $n/2$ | $T(n) = 3T(n/2) + \Theta(n)$ | $\mathbf{\Theta(n^{\log_2 3}) \approx \Theta(n^{1.585})}$ |

---

## 2.5 Matrix Multiplication: Strassen's Algorithm

Given square matrices $X, Y \in \mathbb{R}^{n \times n}$, their product $Z = X \cdot Y$ is an $n \times n$ matrix where:

$$
Z_{ij} = \sum_{k=1}^n X_{ik} Y_{kj} \qquad (1 \le i, j \le n)
$$

### Standard Cubic Algorithm $\Theta(n^3)$

Direct implementation uses 3 nested loops:

```cpp
matrix<int> producte_estandard(const matrix<int>& A, const matrix<int>& B) {
    int n = A.numrows();
    matrix<int> C(n, n, 0);
    for (int i = 0; i < n; ++i)
        for (int j = 0; j < n; ++j)
            for (int k = 0; k < n; ++k)
                C[i][j] += A[i][k] * B[k][j];
    return C;
}
```

Computing each entry $Z_{ij}$ involves $n$ multiplications and $n - 1$ additions ($\Theta(n)$ operations). Computing all $n^2$ entries costs:

$$
T(n) = n^2 \cdot \Theta(n) = \mathbf{\Theta(n^3)}
$$

---

### $2 \times 2$ Block Decomposition

:::naivematmultviz
:::

Partitioning $X$ and $Y$ into four $(n/2) \times (n/2)$ submatrices:

$$
X = \begin{bmatrix} A & B \\ C & D \end{bmatrix}, \qquad Y = \begin{bmatrix} E & F \\ G & H \end{bmatrix}
$$

Block product formulation:

$$
XY = \begin{bmatrix} A & B \\ C & D \end{bmatrix} \begin{bmatrix} E & F \\ G & H \end{bmatrix} = \begin{bmatrix} AE + BG & AF + BH \\ CE + DG & CF + DH \end{bmatrix}
$$

| Block Operation | Quantity and Dimension | Cost |
| :--- | :--- | :---: |
| **Submatrix Multiplications** | 8 multiplications of size $(n/2) \times (n/2)$ | $8T(n/2)$ |
| **Submatrix Additions** | 4 additions of matrices $(n/2) \times (n/2)$ | $\Theta(n^2)$ |

Recurrence:

$$
T(n) = 8T(n/2) + \Theta(n^2)
$$

Via Master Theorem ($a = 8, b = 2, k = 2$):

$$
\alpha = \log_2 8 = 3 > k = 2 \implies \mathbf{T(n) \in \Theta(n^3)}
$$

---

### Volker Strassen's Algorithm (1969)

:::strassenmatmultviz
:::

In 1969, **Volker Strassen** showed that matrix products can be evaluated using only **7 submatrix multiplications** instead of 8:

$$
\begin{aligned}
P_1 &= A(F - H) \\
P_2 &= (A + B)H \\
P_3 &= (C + D)E \\
P_4 &= D(G - E) \\
P_5 &= (A + D)(E + H) \\
P_6 &= (B - D)(G + H) \\
P_7 &= (A - C)(E + F)
\end{aligned}
$$

Reconstructing the 4 quadrants of the product matrix:

$$
XY = \begin{bmatrix} P_5 + P_4 - P_2 + P_6 & P_1 + P_2 \\ P_3 + P_4 & P_1 + P_5 - P_3 - P_7 \end{bmatrix}
$$

Verification for upper-left quadrant:

$$
P_5 + P_4 - P_2 + P_6 = (AE + AH + DE + DH) + (DG - DE) - (AH + BH) + (BG + BH - DG - DH) = AE + BG
$$

---

### Strassen Complexity Analysis

The algorithm performs 7 recursive calls on $(n/2) \times (n/2)$ submatrices with $\Theta(n^2)$ additions/subtractions:

$$
T(n) = 7T(n/2) + \Theta(n^2)
$$

| Parameter | Value | Meaning |
| :--- | :---: | :--- |
| **Recursive Call Count ($a$)** | $7$ | The 7 matrix products $P_1 \dots P_7$. |
| **Dimension Reduction ($b$)** | $2$ | Submatrix dimension reduced to $n/2$. |
| **Non-recursive Work ($k$)** | $2$ | Block additions/subtractions ($\Theta(n^2)$). |

Critical exponent:

$$
\alpha = \log_b a = \log_2 7 \approx 2.80735
$$

Since $\alpha = \log_2 7 > k = 2$:

$$
\mathbf{T(n) \in \Theta(n^{\log_2 7}) \approx \Theta(n^{2.807})}
$$

| Algorithm | Subproducts | Recurrence | Asymptotic Complexity |
| :--- | :---: | :--- | :---: |
| **Standard Iterative** | — | — | $\Theta(n^3)$ |
| **Naive Block ($2 \times 2$)** | 8 of size $n/2$ | $T(n) = 8T(n/2) + \Theta(n^2)$ | $\Theta(n^3)$ |
| **Strassen** | 7 of size $n/2$ | $T(n) = 7T(n/2) + \Theta(n^2)$ | $\mathbf{\Theta(n^{\log_2 7}) \approx \Theta(n^{2.807})}$ |

---

## 2.6 The Towers of Hanoi

The **Towers of Hanoi** illustrates divide-and-conquer on **subtractive** recurrences, where problem size decrements additively.

:::hanoiviz
:::

### Problem Rules

Three vertical pegs are provided: $A$ (source), $B$ (auxiliary), and $C$ (target). Initially, $A$ holds $n$ graduated disks sorted by decreasing radius with the largest disk at the base. Move the tower to $C$ adhering to two invariants: move only one top disk per step, and never place a larger disk onto a smaller disk.

::videoviz{url="/eda/hanoi_transparent.webm?v=2" delay="2000" transparent="true"}

To move $n$ disks from peg $A$ to peg $C$ using $B$ as auxiliary:

```cpp
void hanoi(int n, char a, char b, char c) {
    if (n > 0) {
        hanoi(n - 1, a, c, b); // Move n-1 disks from source (a) to auxiliary (b) via destination (c)
        cout << a << " -> " << c << "\n"; // Elementary move of largest disk
        hanoi(n - 1, b, a, c); // Move n-1 disks from auxiliary (b) to destination (c) via source (a)
    }
}
```

---

### Exact Move Count Derivation

Let $M(n)$ be the minimal elementary moves for $n$ disks:

$$
M(n) = \begin{cases} 
0, & \text{if } n = 0 \\ 
2M(n - 1) + 1, & \text{if } n > 0 
\end{cases}
$$

| $n$ | $M(n) = 2M(n-1) + 1$ | Powers of 2 Expression |
| :---: | :---: | :--- |
| **0** | $0$ | $2^0 - 1 = 0$ |
| **1** | $2(0) + 1 = 1$ | $2^1 - 1 = 1$ |
| **2** | $2(1) + 1 = 3$ | $2^2 - 1 = 3$ |
| **3** | $2(3) + 1 = 7$ | $2^3 - 1 = 7$ |
| **4** | $2(7) + 1 = 15$ | $2^4 - 1 = 15$ |
| **5** | $2(15) + 1 = 31$ | $2^5 - 1 = 31$ |
| **6** | $2(31) + 1 = 63$ | $2^6 - 1 = 63$ |

Exact closed form:

$$
\mathbf{M(n) = 2^n - 1}
$$

---

### Asymptotic Analysis via Subtractive Master Theorem

The recurrence fits the subtractive template $T(n) = a T(n - b) + g(n)$ with $a = 2, b = 1, g(n) = \Theta(1)$. Since $a = 2 > 1$:

$$
\mathbf{T(n) \in \Theta(a^{n/b}) = \Theta(2^n)}
$$

This exponential cost is strictly minimal, as moving the base disk requires all other $n-1$ disks to be stacked on the auxiliary peg.

---

## 2.7 Median Finding and Selection Algorithms

### The Median and Statistical Robustness

The **median** of an array partitions sorted elements into equal-sized halves.
* Odd length $n$: exact center element.
* Even length $n$: two candidates; by convention the smaller (or larger) is taken.

:::medianviz
:::

Unlike the arithmetic mean, the median offers two key properties:
1. **Guaranteed membership:** Always matches an actual observed datum in the sample.
2. **Outlier robustness:** In sample $[1, 1, 1, 1, 1, 1, 1, 1, 1, 100]$, the mean is $10.9$, while the median is $1$, remaining immune to single extreme outliers.

---

### Median of Medians Algorithm (BFPRT, 1973)

Blum, Floyd, Pratt, Rivest, and Tarjan designed a deterministic pivot selection strategy guaranteeing **linear worst-case time $\Theta(n)$** for QuickSelect.

:::bfprtviz
:::

### Block Size $q = 5$ Algorithm:
1. **Partition into blocks:** Divide array of size $n$ into $\lceil n/5 \rceil$ blocks of 5 elements.
2. **Block medians:** Compute the median of each block ($\Theta(1)$ per 5-element block, $\Theta(n)$ overall).
3. **Recursive pivot search:** Recursively find the **median of the $n/5$ block medians** (pseudomedian pivot $p$ costing $T(n/5)$).
4. **Partition array:** Partition original array of size $n$ around pivot $p$ in linear time $\Theta(n)$.
5. **Final recursive selection:** Recurse into the subvector containing the $k$-th statistic.

---

### Global Recurrence and Linearity Condition

Worst-case running time $C(n)$ combines:
1. Non-recursive partitioning and block medians: $\Theta(n)$.
2. Recursive pivot search: $C(n/5)$.
3. Final recursive selection on remaining segment (size $\le 3n/4$): $C(3n/4)$.

$$ 
\mathbf{C(n) = C\left(\frac{n}{5}\right) + C\left(\frac{3n}{4}\right) + \Theta(n)} 
$$

A recurrence $T(n) = T(\alpha n) + T(\beta n) + \Theta(n)$ yields linear bounds $\Theta(n)$ **if and only if contraction factors sum strictly below 1**:

$$ 
\alpha + \beta < 1 \iff \frac{1}{q} + \frac{3}{4} < 1 
$$

Why choose $q = 5$?

| Value of $q$ | Sum $\frac{1}{q} + \frac{3}{4}$ | Condition $< 1$ | Resulting Asymptotic Behavior |
| :---: | :---: | :---: | :--- |
| **$q = 3$** | $\frac{1}{3} + \frac{3}{4} = \mathbf{\frac{13}{12} \approx 1.083}$ | False ($> 1$) | **Superlinear.** Aggregate work grows at each level ($\omega(n)$). |
| **$q = 5$** | $\frac{1}{5} + \frac{3}{4} = \mathbf{0.95}$ | **True ($< 1$)** | **Strictly linear $\mathbf{\Theta(n)}$.** |
| **$q = 7$** | $\frac{1}{7} + \frac{3}{4} \approx \mathbf{0.893}$ | **True ($< 1$)** | Linear $\Theta(n)$, but larger constant factor sorting 7-element blocks. |

For $q = 5$, workload reduces geometrically by factor $0.95$ per recursion level, converging to:

$$ 
C(n) \le c \cdot n \sum_{i=0}^\infty (0.95)^i = c \cdot n \left(\frac{1}{1 - 0.95}\right) = 20 c \cdot n \in \mathbf{\Theta(n)} 
$$

---

## 2.8 Topic 2 Complexity Summary

| Algorithm | Problem | Recurrence $T(n)$ | Method & Branch | Time Complexity | Extra Space |
| :--- | :--- | :--- | :--- | :---: | :---: |
| **Binary Search** | Search in sorted array | $T(n) = T(n/2) + \Theta(1)$ | Divide ($a=1, b=2, k=0 \implies \alpha = k$) | $\Theta(\log n)$ | $\Theta(1)$ |
| **Fast Exponentiation** | Compute $x^n$ | $T(n) = T(n/2) + \Theta(1)$ | Divide ($a=1, b=2, k=0 \implies \alpha = k$) | $\Theta(\log n)$ | $\Theta(\log n)$ |
| **MergeSort** | Stable sorting | $T(n) = 2T(n/2) + \Theta(n)$ | Divide ($a=2, b=2, k=1 \implies \alpha = k$) | $\Theta(n \log n)$ | $\Theta(n)$ |
| **QuickSort (best/avg)** | In-place sorting | $T(n) = 2T(n/2) + \Theta(n)$ | Divide ($a=2, b=2, k=1 \implies \alpha = k$) | $\Theta(n \log n)$ | $\Theta(\log n)$ |
| **QuickSort (worst)** | In-place sorting | $T(n) = T(n-1) + \Theta(n)$ | Subtractive ($a=1, b=1, k=1$) | $\Theta(n^2)$ | $\Theta(n)$ |
| **Grade-School Mult** | Multiply two $n$-bit integers | — | Iterative digit grid analysis | $\Theta(n^2)$ | $\Theta(n)$ |
| **Karatsuba** | Multiply two $n$-bit integers | $T(n) = 3T(n/2) + \Theta(n)$ | Divide ($a=3, b=2, k=1 \implies \alpha > k$) | $\mathbf{\Theta(n^{\log_2 3}) \approx \Theta(n^{1.585})}$ | $\Theta(n)$ |
| **Standard Matrix Mult** | Multiply $n \times n$ matrices | — | 3 nested loops | $\Theta(n^3)$ | $\Theta(n^2)$ |
| **Strassen** | Multiply $n \times n$ matrices | $T(n) = 7T(n/2) + \Theta(n^2)$ | Divide ($a=7, b=2, k=2 \implies \alpha > k$) | $\mathbf{\Theta(n^{\log_2 7}) \approx \Theta(n^{2.807})}$ | $\Theta(n^2)$ |
| **Towers of Hanoi** | Move $n$ disks | $T(n) = 2T(n-1) + \Theta(1)$ | Subtractive ($a=2, b=1, k=0 \implies a > 1$) | $\mathbf{\Theta(2^n)}$ (exact: $2^n - 1$) | $\Theta(n)$ |
| **QuickSelect (avg)** | Select $k$-th statistic | $T(n) = T(n/2) + \Theta(n)$ | Divide ($a=1, b=2, k=1 \implies \alpha < k$) | $\Theta(n)$ | $\Theta(\log n)$ |
| **QuickSelect (worst)** | Select $k$-th statistic | $T(n) = T(n-1) + \Theta(n)$ | Subtractive ($a=1, b=1, k=1$) | $\Theta(n^2)$ | $\Theta(n)$ |
| **Median of Medians** | Select $k$-th (worst case) | $T(n) = T(n/5) + T(3n/4) + \Theta(n)$ | Asymmetric contraction ($1/5 + 3/4 = 0.95 < 1$) | $\mathbf{\Theta(n)}$ | $\Theta(\log n)$ |
