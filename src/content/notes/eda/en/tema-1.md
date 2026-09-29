---
title: "Topic 1: Algorithm Analysis"
description: "Algorithmic efficiency, asymptotic notation (O, Ω, Θ), iterative and recursive analysis, and master theorems."
readTime: "20 min"
order: 1
draft: false
---

The execution time of an algorithm, $T(n)$, is evaluated as a function of the **input size** ($n$):
- **Vectors / Lists:** Number of elements ($n$).
- **Graphs:** Number of vertices ($|V|$) and edges ($|E|$), generally expressed as $|V| + |E|$.
- **Matrices:** Number of cells ($n \times m$) or dimension ($n$).

For a fixed size $n$, the cost can vary depending on the specific instance:

| Case | Notation | Definition | Example (linear search in vector) |
| :--- | :--- | :--- | :--- |
| **Best case** | $T_{\min}(n)$ | Minimum time over all inputs of size $n$. | Finding the element at the first position ($\mathcal{O}(1)$). |
| **Average case** | $T_{\text{avg}}(n)$ | Expected time assuming a uniform distribution of inputs. | Finding the element around the middle ($\mathcal{O}(n)$). |
| **Worst case** | $T_{\max}(n)$ | Maximum time over all inputs of size $n$ (EDA standard: safe upper bound). | Finding the element at the end or not present ($\mathcal{O}(n)$). |

---

## 1.1. Formal definitions of asymptotic notation

Asymptotic notation characterizes the behavior of a cost function $f(n)$ as $n \to \infty$, ignoring multiplicative constants and lower-order terms with respect to a reference function $g(n)$.

### Upper bound: Big $\mathcal{O}$ (omicron)
Indicates that $f(n)$ grows at most as fast as $g(n)$ starting from a certain $n_0$ ($f(n) \le c \cdot g(n)$), guaranteeing an upper bound on the algorithm's cost:

$$
\mathcal{O}(g) = \{ f: \mathbb{N} \to \mathbb{R}^+ \mid \exists c \in \mathbb{R}^+,\; \exists n_0 \in \mathbb{N} \quad \text{such that} \quad \forall n \ge n_0,\; f(n) \le c \cdot g(n) \}
$$

### Lower bound: Big $\Omega$ (omega)
Indicates that $f(n)$ grows at least as fast as $g(n)$ starting from a certain $n_0$ ($f(n) \ge c \cdot g(n)$), guaranteeing a lower bound on the algorithm's cost:

$$
\Omega(g) = \{ f: \mathbb{N} \to \mathbb{R}^+ \mid \exists c \in \mathbb{R}^+,\; \exists n_0 \in \mathbb{N} \quad \text{such that} \quad \forall n \ge n_0,\; f(n) \ge c \cdot g(n) \}
$$

### Tight bound: Big $\Theta$ (theta)
Indicates that $f(n)$ grows at the same rate as $g(n)$ starting from a certain $n_0$ ($c_1 \cdot g(n) \le f(n) \le c_2 \cdot g(n)$), describing the exact asymptotic behavior:

$$
\Theta(g) = \{ f: \mathbb{N} \to \mathbb{R}^+ \mid \exists c_1, c_2 \in \mathbb{R}^+,\; \exists n_0 \in \mathbb{N} \quad \text{such that} \quad \forall n \ge n_0,\; c_1 \cdot g(n) \le f(n) \le c_2 \cdot g(n) \}
$$

| Notation | Bound type | Asymptotic condition ($\forall n \ge n_0$) | Intuitive relationship |
| :--- | :--- | :--- | :--- |
| $\mathcal{O}(g)$ | Upper bound | $f(n) \le c \cdot g(n)$ | $f \le g$ |
| $\Omega(g)$ | Lower bound | $f(n) \ge c \cdot g(n)$ | $f \ge g$ |
| $\Theta(g)$ | Tight bound | $c_1 \cdot g(n) \le f(n) \le c_2 \cdot g(n)$ | $f \approx g$ |

:::asymptoticviz
:::

### Limit quotient test
Allows determining the asymptotic relationship between two positive functions $f(n)$ and $g(n)$ by calculating the limit of their quotient as $n \to \infty$:

$$
L = \lim_{n \to \infty} \frac{f(n)}{g(n)}
$$

| Value of $L$ | Growth relationship | Asymptotic conclusion | Example |
| :--- | :--- | :--- | :--- |
| $L = 0$ | $f$ grows strictly slower than $g$ | $f \in \mathcal{O}(g)$ and $f \notin \Omega(g)$ | $\lim \frac{n}{n^2} = 0 \implies n \in \mathcal{O}(n^2)$ |
| $0 < L < \infty$ | Same order of growth | $f \in \Theta(g) \iff g \in \Theta(f)$ | $\lim \frac{5n^2 + 3}{2n^2} = \frac{5}{2} \implies 5n^2 + 3 \in \Theta(n^2)$ |
| $L = \infty$ | $f$ grows strictly faster than $g$ | $f \in \Omega(g)$ and $f \notin \mathcal{O}(g)$ | $\lim \frac{n^2}{n} = \infty \implies n^2 \in \Omega(n)$ |

> If the limit oscillates or does not exist, the formal definition with constants $c$ and $n_0$ must be applied.

### Fundamental properties of asymptotic classes

| Property | Formulation | Description / Example |
| :--- | :--- | :--- |
| **Reflexivity** | $f \in \mathcal{O}(f), \quad f \in \Omega(f), \quad f \in \Theta(f)$ | Every function grows at its own rate. |
| **Symmetry** | $f \in \Theta(g) \iff g \in \Theta(f)$ | Valid only for $\Theta$ (not applicable to $\mathcal{O}$ or $\Omega$). |
| **Transitivity** | $f \in \mathcal{O}(g) \land g \in \mathcal{O}(h) \implies f \in \mathcal{O}(h)$ | Also valid for $\Omega$ and $\Theta$. |
| **Duality** | $f \in \mathcal{O}(g) \iff g \in \Omega(f)$ | Inverse relationship between upper and lower bounds. |
| **Invariance under constants** | $\mathcal{O}(k \cdot f) = \mathcal{O}(f) \quad (k > 0)$ | Multiplicative constants do not alter the asymptotic class. |
| **Sum rule** | $\Theta(f) + \Theta(g) = \Theta(\max(f, g))$ | The dominant term determines the order ($n^2 + n \in \Theta(n^2)$). |
| **Product rule** | $\Theta(f) \cdot \Theta(g) = \Theta(f \cdot g)$ | Applicable to blocks or nested loops ($n \cdot \log n \implies \Theta(n \log n)$). |

---

## 1.2. Growth hierarchy

### Asymptotic simplification rules

| Family / Relationship | Formulation | Property |
| :--- | :--- | :--- |
| **Polynomials** | $p(n) = \sum_{i=0}^k a_i n^i \in \Theta(n^k)$ | The highest degree term dominates ($a_k > 0$); lower terms and coefficient are discarded. |
| **Logarithms** | $\Theta(\log_a n) = \Theta(\log_b n)$ | The base does not alter the asymptotic class due to the change-of-base formula: $\log_a n = \frac{\log_b n}{\log_b a}$. Written as $\Theta(\log n)$. |
| **Logarithms vs Polynomials** | $\lim_{n \to \infty} \frac{\log^a n}{n^b} = 0 \implies \log^a n \prec n^b$ | Any power of a logarithm grows slower than any power of $n$ ($a, b > 0$). |
| **Polynomials vs Exponentials** | $\lim_{n \to \infty} \frac{n^b}{c^n} = 0 \implies n^b \prec c^n$ | Any polynomial grows slower than any exponential ($b > 0, c > 1$). |

> The base of the logarithm **is relevant** when it is part of the exponent: $2^{\log_2 n} = n \neq 2^{\log_3 n} = n^{\log_3 2} \approx n^{0.631}$.

### Universal asymptotic growth chain

:::growthviz
:::

### The frontier of intractability and the impact of technology
When an algorithm has exponential cost ($2^n$ or $3^n$), the time explodes even for ridiculously small input sizes. Assuming a standard processor executing $10^6$ basic operations per second ($1\,\mu\text{s}$ per operation):

| Complexity | $n = 10$ | $n = 20$ | $n = 30$ | $n = 50$ | Effect of buying a $\times 1000$ faster machine |
| :--- | :--- | :--- | :--- | :--- | :--- |
| $n$ (linear) | $0.00001\text{ s}$ | $0.00002\text{ s}$ | $0.00003\text{ s}$ | $0.00005\text{ s}$ | Size $1000 \cdot N$ (full proportional gain) |
| $n^2$ (quadratic) | $0.0001\text{ s}$ | $0.0004\text{ s}$ | $0.0009\text{ s}$ | $0.0025\text{ s}$ | Size $\sqrt{1000} \cdot N \approx 31.6 \cdot N$ (amortized square root gain) |
| $n^3$ (cubic) | $0.001\text{ s}$ | $0.008\text{ s}$ | $0.027\text{ s}$ | $0.125\text{ s}$ | Size $\sqrt[3]{1000} \cdot N = 10 \cdot N$ |
| $2^n$ (exponential) | $0.001\text{ s}$ | $1.05\text{ s}$ | $17.9\text{ min}$ | **$35.7\text{ years}$** | Only $N + \log_2(1000) \approx \mathbf{N + 10}$ more elements! |
| $3^n$ (exponential) | $0.059\text{ s}$ | $58\text{ min}$ | $6.5\text{ years}$ | **$2 \times 10^8\text{ centuries}$** | Only $N + \log_3(1000) \approx \mathbf{N + 6.3}$ more elements! |

If we buy a machine that is $m = 1000$ times faster, only a small constant is added. The only feasible solution is **algorithmic redesign**.

---

## 1.3. Non-recursive algorithms

### Elementary operations and parameter passing

| Concept / Operation | Cost | Justification / Rule |
| :--- | :---: | :--- |
| **Primitive operations and simple I/O** | $\Theta(1)$ | Primitive assignments, arithmetic/logical/relational operators and simple `cin`/`cout`. |
| **Indexed access `v[i]`** | $\Theta(1)$ | Pointer arithmetic over contiguous memory ($\text{address} = \text{start} + i \cdot \text{size}$). |
| **Pass by reference (`&`, `const &`)** | $\Theta(1)$ | The memory address (pointer) is passed, without copying data. |
| **Pass by value (`vector<T>` of size $n$)** | $\Theta(n)$ | Clones all $n$ elements by allocating memory on the heap. |

### Control structures

| Structure | Syntactic schema | Cost calculation | Behavior |
| :--- | :--- | :--- | :--- |
| **Sequence** | $F_1; \; F_2; \; \dots; \; F_k$ | $\Theta(\max(C_1, \dots, C_k))$ | Sum of consecutive steps; the highest cost term determines complexity. |
| **Conditional** | `if (B) F1 else F2` | **Worst:** $D + \max(C_1, C_2)$<br>**Best:** $D + \min(C_1, C_2)$ | $D$ is the cost of evaluating $B$ ($\Theta(1)$ generally). Without `else`, the best case is simply $D$. |
| **Iteration** | `for` / `while` ($N$ iterations) | $\sum_{k=1}^N C_k + (N+1)\Theta(1)$ | The condition is evaluated $N+1$ times and the body $N$ times. If $C_k = \Theta(1)$, total cost is $\Theta(N)$. |

---

### Selection Sort
At each iteration $i$ (from $n-1$ down to $1$), it searches for the maximum of the remaining part $v[0 \dots i]$ and swaps it with $v[i]$, leaving it fixed at the end:

:::oopviz{simulation="selection_sort"}
:::


:::selectionsortviz
:::



Searching for the maximum in the subarray $v[0 \dots i]$ requires comparing all its elements, taking $i$ comparisons. Since the index $i$ decreases from $n - 1$ down to $1$, the total number of comparisons is given by Gauss's arithmetic progression sum:

$$
\sum_{i=1}^{n-1} i = (n - 1) + (n - 2) + \dots + 1 = \frac{n(n - 1)}{2} \in \Theta(n^2)
$$

At each iteration, exactly one swap (`swap`) is performed, yielding $n - 1$ moves ($\Theta(n)$). The total cost of the algorithm is the sum of both:

$$
T_{\text{sel}}(n) = \Theta(n^2) + \Theta(n) = \Theta(n^2)
$$

The algorithm has no early exit; it performs the exact same comparisons regardless of the initial ordering of the input. Therefore:

$$
T_{\min}(n) = T_{\text{avg}}(n) = T_{\max}(n) = \Theta(n^2)
$$

### Insertion Sort

:::oopviz{simulation="insertion_sort"}
:::

The bar $\mid$ separates the already sorted part $v[0 \dots k-1]$ (left) from the pending part to be explored (right):

:::insertionsortviz
:::



Unlike selection sort, insertion sort is an **adaptive** algorithm: the inner loop stops as soon as it encounters a smaller or equal element, so the number of operations depends on the data layout.

**Best case (already sorted vector):** Each new element satisfies $v[k] \ge v[k-1]$. The inner loop condition fails on the first check and performs $0$ swaps:

$$
T_{\min}(n) = \sum_{k=1}^{n-1} 1 = n - 1 \in \Theta(n)
$$

**Worst case (vector in reverse order):** Each element $v[k]$ is smaller than all preceding ones and must move all the way back to the initial position ($k$ comparisons and $k$ swaps):

$$
T_{\max}(n) = \sum_{k=1}^{n-1} k = \frac{n(n - 1)}{2} \in \Theta(n^2)
$$

**Average case (random order):** Assuming a uniform distribution, each element moves back on average to the middle of the sorted prefix ($k/2$ steps), yielding $T_{\text{avg}}(n) \approx \sum_{k=1}^{n-1} \frac{k}{2} \approx \frac{n^2}{4} \in \Theta(n^2)$. In **nearly-sorted** vectors (where no element is farther than a bounded distance $c \in \mathcal{O}(1)$ from its final position), the total cost is $\mathcal{O}(c \cdot n) = \Theta(n)$.

Each swap of adjacent components eliminates exactly one inversion (pair $(i, j)$ with $i < j$ such that $v[i] > v[j]$). The total cost is directly determined by the initial number of inversions $I$:

$$
T(n) = \Theta(n + I) \quad \text{with} \quad 0 \le I \le \frac{n(n-1)}{2}
$$

---

## 1.4. Recursive algorithms and master theorems

The cost of a recursive function is expressed through a recurrence relation:

$$ 
C(n) = a \cdot C(\text{subproblem size}) + g(n) 
$$

where $a \ge 1$ is the number of recursive calls and $g(n)$ is the cost of the non-recursive work (preparation and combination).

### Master theorem for subtractive recurrences
Applies to recurrences where each call reduces the input size by a constant amount $c \ge 1$:

$$
C(n) = \begin{cases} \Theta(1), & \text{if } n < n_0 \\ a \cdot C(n - c) + g(n), & \text{if } n \ge n_0 \end{cases} \qquad\text{with } g(n) \in \Theta(n^k), \; k \ge 0
$$

The asymptotic complexity is resolved depending on the value of the branching factor $a$:

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

### Master theorem for divide-and-conquer recurrences
Applies to divide-and-conquer algorithms, where the input size is divided by a constant factor $b > 1$:

$$
C(n) = \begin{cases} \Theta(1), & \text{if } n < n_0 \\ a \cdot C(n/b) + g(n), & \text{if } n \ge n_0 \end{cases} \qquad\text{with } g(n) \in \Theta(n^k), \; k \ge 0
$$

We define the critical exponent $\alpha = \log_b a$. The solution depends on the relationship between $\alpha$ and the non-recursive degree $k$:

$$
C(n) \in \begin{cases} 
\Theta(n^k), & \text{if } \alpha < k \iff a < b^k \\ 
\Theta(n^k \log n), & \text{if } \alpha = k \iff a = b^k \\ 
\Theta(n^\alpha) = \Theta(n^{\log_b a}), & \text{if } \alpha > k \iff a > b^k 
\end{cases}
$$

| Algorithm | Recurrence | Parameters | Relationship | Complexity |
| :--- | :--- | :--- | :--- | :---: |
| **Binary search** | $C(n) = C(n/2) + \Theta(1)$ | $a=1, b=2, k=0$ | $\alpha = 0 = k$ | $\Theta(\log n)$ |
| **Mergesort** | $C(n) = 2C(n/2) + \Theta(n)$ | $a=2, b=2, k=1$ | $\alpha = 1 = k$ | $\Theta(n \log n)$ |
| **Karatsuba** | $C(n) = 3C(n/2) + \Theta(n)$ | $a=3, b=2, k=1$ | $\alpha = \log_2 3 \approx 1.585 > k$ | $\Theta(n^{1.585})$ |
| **Strassen** | $C(n) = 7C(n/2) + \Theta(n^2)$ | $a=7, b=2, k=2$ | $\alpha = \log_2 7 \approx 2.807 > k$ | $\Theta(n^{2.807})$ |
