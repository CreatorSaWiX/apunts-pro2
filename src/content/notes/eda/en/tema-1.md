---
title: "Topic 1: Algorithm Analysis"
description: "Algorithmic efficiency, asymptotic notation (O, Ω, Θ), iterative and recursive analysis, and master theorems."
readTime: "20 min"
order: 1
draft: false
---

The running time of an algorithm, $T(n)$, is evaluated in terms of **input size** ($n$):
- **Arrays / Lists:** Number of elements ($n$).
- **Graphs:** Number of vertices ($|V|$) and edges ($|E|$), commonly expressed as $|V| + |E|$.
- **Matrices:** Number of cells ($n \times m$) or dimension ($n$).

For a fixed input size $n$, runtime may vary depending on the particular instance structure:

| Case | Notation | Formal Definition | Vector Search Example |
| :--- | :--- | :--- | :--- |
| **Best case** | $T_{\min}(n)$ | Minimum execution time across all inputs of size $n$. | Finding element at index 0 ($\mathcal{O}(1)$). |
| **Average case** | $T_{\text{avg}}(n)$ | Expected runtime assuming uniform input distribution. | Finding element near the middle ($\mathcal{O}(n)$). |
| **Worst case** | $T_{\max}(n)$ | Maximum execution time across all inputs of size $n$ (EDA standard: safe upper bound). | Element located at the end or absent ($\mathcal{O}(n)$). |

---

## 1.1. Formal Definitions of Asymptotic Notation

Asymptotic notation characterizes the growth rate of a cost function $f(n)$ as $n \to \infty$, ignoring constant factors and lower-order terms relative to a reference function $g(n)$.

### Upper bound: Big $\mathcal{O}$ (omicron)
Specifies that $f(n)$ grows at most as fast as $g(n)$ for sufficiently large $n$ ($f(n) \le c \cdot g(n)$), guaranteeing an asymptotic upper bound:

$$
\mathcal{O}(g) = \{ f: \mathbb{N} \to \mathbb{R}^+ \mid \exists c \in \mathbb{R}^+,\; \exists n_0 \in \mathbb{N} \quad \text{such that} \quad \forall n \ge n_0,\; f(n) \le c \cdot g(n) \}
$$

### Lower bound: Big $\Omega$ (omega)
Specifies that $f(n)$ grows at least as fast as $g(n)$ for sufficiently large $n$ ($f(n) \ge c \cdot g(n)$), guaranteeing an asymptotic lower bound:

$$
\Omega(g) = \{ f: \mathbb{N} \to \mathbb{R}^+ \mid \exists c \in \mathbb{R}^+,\; \exists n_0 \in \mathbb{N} \quad \text{such that} \quad \forall n \ge n_0,\; f(n) \ge c \cdot g(n) \}
$$

### Tight bound: Big $\Theta$ (theta)
Specifies that $f(n)$ grows at the identical rate as $g(n)$ for sufficiently large $n$ ($c_1 \cdot g(n) \le f(n) \le c_2 \cdot g(n)$), providing exact asymptotic order:

$$
\Theta(g) = \{ f: \mathbb{N} \to \mathbb{R}^+ \mid \exists c_1, c_2 \in \mathbb{R}^+,\; \exists n_0 \in \mathbb{N} \quad \text{such that} \quad \forall n \ge n_0,\; c_1 \cdot g(n) \le f(n) \le c_2 \cdot g(n) \}
$$

| Notation | Bound Type | Asymptotic Condition ($\forall n \ge n_0$) | Intuitive Order |
| :--- | :--- | :--- | :--- |
| $\mathcal{O}(g)$ | Upper bound | $f(n) \le c \cdot g(n)$ | $f \le g$ |
| $\Omega(g)$ | Lower bound | $f(n) \ge c \cdot g(n)$ | $f \ge g$ |
| $\Theta(g)$ | Tight bound | $c_1 \cdot g(n) \le f(n) \le c_2 \cdot g(n)$ | $f \approx g$ |

:::asymptoticviz
:::

### Limit Quotient Criterion
Determines the asymptotic dominance between two positive functions $f(n)$ and $g(n)$ via the limit of their ratio as $n \to \infty$:

$$
L = \lim_{n \to \infty} \frac{f(n)}{g(n)}
$$

| Value of $L$ | Growth Relationship | Asymptotic Implication | Example |
| :--- | :--- | :--- | :--- |
| $L = 0$ | $f$ grows strictly slower than $g$ | $f \in \mathcal{O}(g)$ and $f \notin \Omega(g)$ | $\lim \frac{n}{n^2} = 0 \implies n \in \mathcal{O}(n^2)$ |
| $0 < L < \infty$ | Identical asymptotic growth rate | $f \in \Theta(g) \iff g \in \Theta(f)$ | $\lim \frac{5n^2 + 3}{2n^2} = \frac{5}{2} \implies 5n^2 + 3 \in \Theta(n^2)$ |
| $L = \infty$ | $f$ grows strictly faster than $g$ | $f \in \Omega(g)$ and $f \notin \mathcal{O}(g)$ | $\lim \frac{n^2}{n} = \infty \implies n^2 \in \Omega(n)$ |

> If the limit oscillates or fails to exist, apply the formal inequality definition using constants $c$ and $n_0$.

### Core Algebraic Properties of Asymptotic Sets

| Property | Formulation | Description / Example |
| :--- | :--- | :--- |
| **Reflexivity** | $f \in \mathcal{O}(f), \quad f \in \Omega(f), \quad f \in \Theta(f)$ | Every function grows at its own rate. |
| **Symmetry** | $f \in \Theta(g) \iff g \in \Theta(f)$ | Holds strictly for $\Theta$ (does not apply to $\mathcal{O}$ or $\Omega$). |
| **Transitivity** | $f \in \mathcal{O}(g) \land g \in \mathcal{O}(h) \implies f \in \mathcal{O}(h)$ | Holds identically for $\Omega$ and $\Theta$. |
| **Duality** | $f \in \mathcal{O}(g) \iff g \in \Omega(f)$ | Reciprocal duality between upper and lower bounds. |
| **Constant Invariance** | $\mathcal{O}(k \cdot f) = \mathcal{O}(f) \quad (k > 0)$ | Constant multipliers do not alter asymptotic complexity classes. |
| **Sum Rule** | $\Theta(f) + \Theta(g) = \Theta(\max(f, g))$ | The asymptotically dominant term dictates the bound ($n^2 + n \in \Theta(n^2)$). |
| **Product Rule** | $\Theta(f) \cdot \Theta(g) = \Theta(f \cdot g)$ | Applies to nested loops and compositions ($n \cdot \log n \implies \Theta(n \log n)$). |

---

## 1.2. Growth Hierarchy

### Asymptotic Simplification Rules

| Family / Relation | Formulation | Invariant Property |
| :--- | :--- | :--- |
| **Polynomials** | $p(n) = \sum_{i=0}^k a_i n^i \in \Theta(n^k)$ | The highest-degree term dominates ($a_k > 0$); lower terms and coefficients drop. |
| **Logarithms** | $\Theta(\log_a n) = \Theta(\log_b n)$ | Base differences collapse due to the change-of-base rule: $\log_a n = \frac{\log_b n}{\log_b a}$. Expressed as $\Theta(\log n)$. |
| **Logarithms vs Polynomials** | $\lim_{n \to \infty} \frac{\log^a n}{n^b} = 0 \implies \log^a n \prec n^b$ | Any power of a logarithm grows slower than any polynomial degree ($a, b > 0$). |
| **Polynomials vs Exponentials** | $\lim_{n \to \infty} \frac{n^b}{c^n} = 0 \implies n^b \prec c^n$ | Any polynomial grows strictly slower than any exponential ($b > 0, c > 1$). |

> The base of a logarithm **is critical** when positioned in the exponent: $2^{\log_2 n} = n \neq 2^{\log_3 n} = n^{\log_3 2} \approx n^{0.631}$.

### Universal Asymptotic Growth Chain

:::growthviz
:::

### The Intractability Frontier and Hardware Scaling
When an algorithm exhibits exponential cost ($2^n$ or $3^n$), runtimes escalate precipitously even for modest input sizes. Assuming a benchmark CPU executing $10^6$ elementary ops/sec ($1\,\mu\text{s}$ per operation):

| Complexity | $n = 10$ | $n = 20$ | $n = 30$ | $n = 50$ | Effect of buying a $\times 1000$ faster CPU |
| :--- | :--- | :--- | :--- | :--- | :--- |
| $n$ (linear) | $0.00001\text{ s}$ | $0.00002\text{ s}$ | $0.00003\text{ s}$ | $0.00005\text{ s}$ | Input size $1000 \cdot N$ (full linear scaling) |
| $n^2$ (quadratic) | $0.0001\text{ s}$ | $0.0004\text{ s}$ | $0.0009\text{ s}$ | $0.0025\text{ s}$ | Input size $\sqrt{1000} \cdot N \approx 31.6 \cdot N$ (damped by square root) |
| $n^3$ (cubic) | $0.001\text{ s}$ | $0.008\text{ s}$ | $0.027\text{ s}$ | $0.125\text{ s}$ | Input size $\sqrt[3]{1000} \cdot N = 10 \cdot N$ |
| $2^n$ (exponential) | $0.001\text{ s}$ | $1.05\text{ s}$ | $17.9\text{ min}$ | **$35.7\text{ years}$** | Only $N + \log_2(1000) \approx \mathbf{N + 10}$ additional items! |
| $3^n$ (exponential) | $0.059\text{ s}$ | $58\text{ min}$ | $6.5\text{ years}$ | **$2 \times 10^8\text{ centuries}$** | Only $N + \log_3(1000) \approx \mathbf{N + 6.3}$ additional items! |

Purchasing hardware that is $m = 1000$ times faster yields only an additive constant improvement. The only viable path is **algorithmic redesign**.

---

## 1.3. Iterative (Non-Recursive) Algorithms

### Elementary Operations and Parameter Conventions

| Operation / Concept | Cost | Justification / Rule |
| :--- | :---: | :--- |
| **Primitives & basic I/O** | $\Theta(1)$ | Scalar assignments, arithmetic/logic/relational operators, and scalar `cin`/`cout`. |
| **Indexed access `v[i]`** | $\Theta(1)$ | Direct pointer arithmetic across contiguous memory buffer ($\text{address} = \text{base} + i \cdot \text{stride}$). |
| **Pass by reference (`&`, `const &`)** | $\Theta(1)$ | Passes pointer address without copying array contents. |
| **Pass by value (`vector<T>` size $n$)** | $\Theta(n)$ | Deep copies all $n$ elements into newly allocated heap memory. |

### Control Flow Structures

| Structure | Syntax Pattern | Cost Derivation | Behavior |
| :--- | :--- | :--- | :--- |
| **Sequence** | $F_1; \; F_2; \; \dots; \; F_k$ | $\Theta(\max(C_1, \dots, C_k))$ | Additive steps; dominant term determines asymptotic class. |
| **Branching** | `if (B) F1 else F2` | **Worst:** $D + \max(C_1, C_2)$<br>**Best:** $D + \min(C_1, C_2)$ | $D$ represents condition cost ($\Theta(1)$ typically). Without `else`, best case is just $D$. |
| **Iteration** | `for` / `while` ($N$ cycles) | $\sum_{k=1}^N C_k + (N+1)\Theta(1)$ | Condition is tested $N+1$ times, body runs $N$ times. If $C_k = \Theta(1)$, total cost is $\Theta(N)$. |

---

### Selection Sort
In each iteration $i$ (counting down from $n-1$ to $1$), locates the maximum element in subvector $v[0 \dots i]$ and swaps it into $v[i]$:

:::oopviz{simulation="selection_sort"}
:::

:::selectionsortviz
:::

Finding the maximum over $v[0 \dots i]$ requires comparing all its components, yielding $i$ comparisons. Summing across iterations gives Gauss's arithmetic series:

$$
\sum_{i=1}^{n-1} i = (n - 1) + (n - 2) + \dots + 1 = \frac{n(n - 1)}{2} \in \Theta(n^2)
$$

Each cycle performs exactly one `swap`, totaling $n - 1$ moves ($\Theta(n)$). Total sorting runtime:

$$
T_{\text{sel}}(n) = \Theta(n^2) + \Theta(n) = \Theta(n^2)
$$

Selection sort lacks early-exit branches; it executes identical comparison counts regardless of input order:

$$
T_{\min}(n) = T_{\text{avg}}(n) = T_{\max}(n) = \Theta(n^2)
$$

### Insertion Sort

:::oopviz{simulation="insertion_sort"}
:::

The marker $\mid$ partitions the sorted prefix $v[0 \dots k-1]$ (left) from unexplored elements (right):

:::insertionsortviz
:::

Unlike selection sort, insertion sort is an **adaptive** algorithm: inner loop scanning terminates as soon as an element $\le$ the key is encountered.

**Best case (already sorted array):** Every element satisfies $v[k] \ge v[k-1]$. Inner while loop test fails on the first comparison with zero shifts:

$$
T_{\min}(n) = \sum_{k=1}^{n-1} 1 = n - 1 \in \Theta(n)
$$

**Worst case (reverse-sorted array):** Each item $v[k]$ is strictly smaller than all preceding entries, shifting all the way to position 0 ($k$ comparisons and $k$ swaps):

$$
T_{\max}(n) = \sum_{k=1}^{n-1} k = \frac{n(n - 1)}{2} \in \Theta(n^2)
$$

**Average case (random permutation):** Assuming uniform distribution, each element shifts on average halfway through the sorted prefix ($k/2$ steps), yielding $T_{\text{avg}}(n) \approx \sum_{k=1}^{n-1} \frac{k}{2} \approx \frac{n^2}{4} \in \Theta(n^2)$. For **almost-sorted arrays** (where elements are at most $c \in \mathcal{O}(1)$ slots away from their target), total runtime is $\mathcal{O}(c \cdot n) = \Theta(n)$.

Each adjacent swap cancels exactly one inversion (pair $(i, j)$ with $i < j$ such that $v[i] > v[j]$). Overall runtime is parameterized directly by initial inversion count $I$:

$$
T(n) = \Theta(n + I) \quad \text{with} \quad 0 \le I \le \frac{n(n-1)}{2}
$$

---

## 1.4. Recursive Algorithms and Master Theorems

The runtime of a recursive function is expressed via a recurrence relation:

$$ 
C(n) = a \cdot C(\text{subproblem size}) + g(n) 
$$

where $a \ge 1$ is the branch factor and $g(n)$ is non-recursive overhead (split and merge phases).

### Master Theorem for Subtractive Recurrences
Applies when subproblem sizes decrement by a constant $c \ge 1$:

$$
C(n) = \begin{cases} \Theta(1), & \text{if } n < n_0 \\ a \cdot C(n - c) + g(n), & \text{if } n \ge n_0 \end{cases} \qquad\text{with } g(n) \in \Theta(n^k), \; k \ge 0
$$

The asymptotic bound is governed by branch factor $a$:

$$
C(n) \in \begin{cases} 
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
Applies when subproblem sizes are divided by a constant factor $b > 1$:

$$
C(n) = \begin{cases} \Theta(1), & \text{if } n < n_0 \\ a \cdot C(n/b) + g(n), & \text{if } n \ge n_0 \end{cases} \qquad\text{with } g(n) \in \Theta(n^k), \; k \ge 0
$$

Define the critical exponent $\alpha = \log_b a$. Asymptotic complexity is determined by comparing $\alpha$ against degree $k$:

$$
C(n) \in \begin{cases} 
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
