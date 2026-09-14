---
title: "Topic 1: Algorithm Analysis"
description: "Algorithmic efficiency, asymptotic notation (O, Ω, Θ), iterative and recursive analysis, Master Theorems, logarithmic Fibonacci, and sorting lower bounds."
readTime: "25 min"
order: 1
draft: false
---

## 1. Efficiency and Cost Models

### 1.1. Objectives of Algorithm Analysis
- **Compare alternatives:** Formally select the optimal algorithm to solve a given computational problem among different approaches (e.g., alternative sorting strategies).
- **Optimize:** Identify structural bottlenecks to reduce execution cost.
- **Predict resource demands:** Estimate execution time and memory consumption prior to implementation.
- In EDA, analysis focuses almost exclusively on **execution time** (time complexity).

### 1.2. Why Not Measure Wall-Clock Time?
Using a physical stopwatch is not scientifically invariant:
- Heavily depends on specific hardware (CPU frequency, cache hierarchy, architecture).
- Depends on the compiler and optimization levels (`-O2`, `-O3`).
- Depends on the programming language runtime (compiled C++ vs. interpreted Python).

All these factors only contribute a **multiplicative constant ($c$)**: a processor twice as fast halves execution time, but will never make an exponential algorithm tractable. Therefore, we use a technology-independent **mathematical abstraction**.

### 1.3. Input Size ($n = |x|$)
Cost is parameterized as a function $T(n)$:
- **Arrays / Lists:** Number of elements ($n$).
- **Graphs:** Number of vertices plus number of edges ($|V| + |E|$).
- **Integers ($x \in \mathbb{N}$):**
  - *Standard binary encoding:* Number of bits required:
    $$n = |x| = \lfloor \log_2 x \rfloor + 1$$
  - *Unary encoding:* The numerical value itself ($n = x$). Only applicable in specialized contexts.

### 1.4. Performance Measures
Given the set $E$ of all inputs of size $n$:
- **Worst Case ($T_{\text{worst}}(n) = \max_{|x|=n} T(x)$):** Maximum possible execution time. Provides an **absolute guarantee**: no input of size $n$ will ever exceed this upper bound. Standard metric in EDA.
- **Best Case ($T_{\text{best}}(n) = \min_{|x|=n} T(x)$):** Minimum execution time. Rarely useful in practice because it offers no operational performance guarantee.
- **Average Case ($T_{\text{avg}}(n) = \sum_{|x|=n} \Pr(x) \cdot T(x)$):**
  - Mathematical expectation of the cost.
  - *Lecture intuition:* It is simply a weighted average (analogous to finding the average weight of students in a classroom weighted by the probability of selecting each individual).
  - *Practical limitation:* Requires knowing the exact probability distribution of inputs (frequently unknown or non-uniform).

---

## 2. Introductory Examples

### 2.1. The Selection Problem ($k$-th largest element out of $n$)
1. **Solution 1 (Full sorting):** Sort the entire array in descending order and return the element at index $k$. Cost: $\Theta(n \log n)$ using an optimal sorting algorithm like mergesort. Incurs wasted work when $k \ll n$.
2. **Solution 2 (Auxiliary array of size $k$ with Loop Invariant):**
   - **Loop Invariant:** At each step, the auxiliary array contains exactly the $k$ largest elements seen so far, maintained in descending sorted order.
   - For each subsequent element $x$:
     - If $x \le$ current minimum in the auxiliary array (last element), **discard it** in $\Theta(1)$.
     - If $x >$ minimum, evict the minimum and insert $x$ into its sorted position by shifting elements in $\mathcal{O}(k)$.
   - Upon completion, by the invariant, the element at index $k$ is the answer.
   - Worst-case cost: $\Theta(k \log k + (n-k) \cdot k) = \Theta(n \cdot k)$.
   - **Comparison:** When $k$ is constant or small ($k \ll \log n$), Solution 2 runs in linear time $\Theta(n)$, outperforming Solution 1. If $k = n/2$ (median), it degenerates to $\Theta(n^2)$, performing substantially worse than Solution 1.

### 2.2. The Infinite Wall Problem
Locate an exit door situated at an unknown distance $d$ (left or right) along an infinite wall with zero visibility until reaching it:
- **Arithmetic Strategy (Linear):** Walk 1 step right and return; 2 steps left and return; 3 steps right...
  $$\text{Total distance} = \sum_{i=1}^d 2i = 2 \frac{d(d+1)}{2} = \Theta(d^2)$$
- **Geometric Strategy (Exponential Doubling):** Walk $1$ step right and return; $2^1$ left and return; $2^2$ right...
  $$\text{Total distance} \le 2 \sum_{i=0}^k 2^i + d = 2(2^{k+1} - 1) + d$$
  Since the final turnaround satisfies $2^{k-1} < d \le 2^k$, we have $2^k < 2d$. The total distance traversed is bounded by $4(2d) + d = \Theta(d)$.
- **Conclusion:** Exponential doubling reduces overall complexity from quadratic $\Theta(d^2)$ to linear $\Theta(d)$.

---

## 3. Formal Asymptotic Notation

Asymptotic notation characterizes the limiting behavior of runtime as $n \to \infty$ ("in the long run"). We evaluate non-negative functions $f, g: \mathbb{N} \to \mathbb{R}^+$.

### 3.1. Formal Definitions
- **Asymptotic Upper Bound (Big-$O$ / Omicron):**
  $$\mathcal{O}(g) = \{ f \mid \exists c \in \mathbb{R}^+, \exists n_0 \in \mathbb{N} \text{ such that } \forall n \ge n_0,\; f(n) \le c \cdot g(n) \}$$
  *Intuition:* $f \le g$ in the long run (up to constant $c$).
- **Asymptotic Lower Bound (Big-$\Omega$ / Omega):**
  $$\Omega(g) = \{ f \mid \exists c \in \mathbb{R}^+, \exists n_0 \in \mathbb{N} \text{ such that } \forall n \ge n_0,\; f(n) \ge c \cdot g(n) \}$$
  *Intuition:* $f \ge g$ in the long run (up to constant $c$).
- **Asymptotically Tight Bound (Big-$\Theta$ / Theta):**
  $$\Theta(g) = \mathcal{O}(g) \cap \Omega(g)$$
  $$\Theta(g) = \{ f \mid \exists c_1, c_2 \in \mathbb{R}^+, \exists n_0 \in \mathbb{N} \text{ such that } \forall n \ge n_0,\; c_1 \cdot g(n) \le f(n) \le c_2 \cdot g(n) \}$$
  *Intuition:* $f \approx g$ in the long run. (Note: does not imply point-by-point equality of functions, but identical rate of asymptotic growth).

### 3.2. Formal Proof Method (Determining $c$ and $n_0$)
To prove $f(n) \in \mathcal{O}(g(n))$ directly from definition:
1. Drop negative terms from above: $-an \le 0$ for all $n \ge 0$.
2. Bound positive lower-degree terms using $n^a \le n^b$ for all $b \ge a$ when $n \ge 1$.
3. Pick a constant $c$ strictly greater than the resulting leading coefficient.
4. Solve the inequality to establish the minimal integer threshold $n_0$.

> **Lecture Example:** Prove $f(n) = 3n^3 + 5n^2 - 7n + 41 \in \mathcal{O}(n^3)$:
> 1. Bound negative term: $3n^3 + 5n^2 - 7n + 41 \le 3n^3 + 5n^2 + 41$.
> 2. Because $n^2 \le n^3$ for $n \ge 1$: $3n^3 + 5n^2 + 41 \le 8n^3 + 41$.
> 3. We require $8n^3 + 41 \le c \cdot n^3$. Choose $c = 9$: $41 \le n^3 \iff n \ge \lceil \sqrt[3]{41} \rceil = 4$.
> 4. Setting **$c = 9$** and **$n_0 = 4$** satisfies $\forall n \ge 4,\; f(n) \le 9n^3$, completing the formal proof.

### 3.3. The Limit Rule
For $f(n), g(n) > 0$, compute $L = \lim_{n \to \infty} \frac{f(n)}{g(n)}$:
- **$L = 0$:** $f$ grows strictly slower than $g$ ($f \in \mathcal{O}(g)$ and $f \notin \Omega(g)$; strict notation $f \prec g$).
- **$L = \infty$:** $f$ grows strictly faster than $g$ ($f \in \Omega(g)$ and $f \notin \mathcal{O}(g)$; strict notation $f \succ g$).
- **$0 < L < \infty$:** $f$ and $g$ share identical asymptotic growth rate ($f \in \Theta(g) \iff g \in \Theta(f)$).
- **If the limit does not exist (oscillation):** One must use the formal quantifier definition.

### 3.4. Core Algebraic Properties
- **Reflexivity:** $f \in \Theta(f)$, $f \in \mathcal{O}(f)$, $f \in \Omega(f)$.
- **Symmetry of $\Theta$:** $f \in \Theta(g) \iff g \in \Theta(f)$.
- **Transitivity:** If $f \in \mathcal{O}(g)$ and $g \in \mathcal{O}(h) \implies f \in \mathcal{O}(h)$ (also holds for $\Omega$ and $\Theta$).
- **Duality:** $f \in \mathcal{O}(g) \iff g \in \Omega(f)$.
- **Invariance under Positive Constants:** $\forall k > 0$, $\Theta(k \cdot f) = \Theta(f)$.
- **Sum Rule (Dominant Term):**
  $$\Theta(f) + \Theta(g) = \Theta(f + g) = \Theta(\max(f, g))$$
  *Example:* $n^3 + n^2 \in \Theta(n^3)$.
- **Product Rule:**
  $$\mathcal{O}(f) \cdot \mathcal{O}(g) = \mathcal{O}(f \cdot g), \quad \Theta(f) \cdot \Theta(g) = \Theta(f \cdot g)$$

---

## 4. Growth Hierarchy and Intractability

### 4.1. Standard Asymptotic Families
1. **Polynomials:** For any polynomial $p(n) = a_k n^k + \dots + a_0$ with $a_k > 0$:
   $$p(n) \in \Theta(n^k)$$
   (Only the highest-degree term matters; coefficients and lower-order terms are discarded).
2. **Logarithms (Base Invariance):** For any two bases $a, b > 1$:
   $$\log_a n = \frac{\log_b n}{\log_b a} \implies \Theta(\log_a n) = \Theta(\log_b n)$$
   *Exam note:* The base only matters when the logarithm appears in the exponent ($2^{\log_2 n} = n \neq 2^{\log_3 n} = n^{\log_3 2}$).
3. **Logarithms vs. Polynomials vs. Exponentials:**
   For any constants $a, b > 0$ and $c > 1$:
   $$\lim_{n \to \infty} \frac{\log^a n}{n^b} = 0 \implies \log^a n \prec n^b$$
   $$\lim_{n \to \infty} \frac{n^b}{c^n} = 0 \implies n^b \prec c^n$$
   *Extreme lecture examples:*
   - $(\ln n)^{1,000,000} \prec n^{0.00000001}$ (any positive polynomial power eventually crushes any logarithmic power).
   - $n^{1,000,000} \prec (1.00000001)^n$ (any exponential with base $> 1$ eventually crushes any polynomial).
   - If the exponential base were $< 1$ (e.g., $0.9^n$), it decays to 0 and cannot represent algorithmic cost.

### 4.2. Universal Scale of Asymptotic Dominance
$$\Theta(1) \prec \Theta(\log \log n) \prec \Theta(\log n) \prec \Theta(\sqrt{n}) \prec \Theta(n) \prec \Theta(n \log n) \prec \Theta(n^2) \prec \Theta(n^k) \prec \Theta(c^n) \prec \Theta(n!) \prec \Theta(n^n)$$

### 4.3. The Intractability Frontier (Garey & Johnson)

#### Execution times assuming $1\,\mu\text{s}$ per elementary operation:

| Complexity | $n = 10$ | $n = 20$ | $n = 30$ | $n = 50$ |
| :--- | :--- | :--- | :--- | :--- |
| $n$ | $0.00001\text{ s}$ | $0.00002\text{ s}$ | $0.00003\text{ s}$ | $0.00005\text{ s}$ |
| $n^2$ | $0.0001\text{ s}$ | $0.0004\text{ s}$ | $0.0009\text{ s}$ | $0.0025\text{ s}$ |
| $n^3$ | $0.001\text{ s}$ | $0.008\text{ s}$ | $0.027\text{ s}$ | $0.125\text{ s}$ |
| $2^n$ | $0.001\text{ s}$ | $1.05\text{ s}$ | $17.9\text{ min}$ | **$35.7\text{ years}$** |
| $3^n$ | $0.059\text{ s}$ | $58\text{ min}$ | $6.5\text{ years}$ | **$2 \times 10^8\text{ centuries}$** |

#### Effect of Technological Upgrades (Multiplying hardware speed by $m$):
If we can solve maximum size $N$ within a fixed time budget:
- For $T(n) = n$: We can solve $m \cdot N$ (full linear improvement).
- For $T(n) = n^2$: We can solve $\sqrt{m} \cdot N$ (dampened by square root).
- For $T(n) = 2^n$: The new size $N'$ satisfies $2^{N'} = m \cdot 2^N \implies N' = N + \log_2 m$.
  - If $m = 100$: We can only process $N + 6.64$ additional items.
  - If $m = 1,000$: We can only process $N + 9.97 \approx 10$ additional items.
- **Theoretical Takeaway:** Hardware scaling cannot overcome exponential complexity; tractable execution requires efficient algorithmic design.

---

## 5. Analysis of Non-Recursive (Iterative) Algorithms

### 5.1. Cost Calculation Rules
1. **Elementary Operations:** Scalar assignments, primitive arithmetic, boolean comparisons, array indexing, and pass-by-reference cost $\Theta(1)$.
2. **Sequential Composition:** If $F_1$ costs $C_1$ and $F_2$ costs $C_2$:
   $$\text{Cost}(F_1; F_2) = C_1 + C_2 = \Theta(\max(C_1, C_2))$$
3. **Conditional Statements (`if (B) F1 else F2`):**
   $$\text{Cost} = \text{Cost}(B) + \max(\text{Cost}(F_1), \text{Cost}(F_2))$$
4. **Loops (`for`, `while`):** Formulated as summations: $\sum_{i=1}^{\text{iterations}} \text{Cost}(\text{body})$.
   - Uniform independent loops: $\sum_{i=1}^n \Theta(1) = \Theta(n)$.
   - Triangular nested loops: $\sum_{i=1}^n \sum_{j=1}^i \Theta(1) = \sum_{i=1}^n i = \frac{n(n+1)}{2} = \Theta(n^2)$.
   - Multiplicative stride loops (`i *= 2` or `i /= 2`): Total steps satisfy $2^k \le n \implies k = \lfloor \log_2 n \rfloor \implies \Theta(\log n)$.
   - Quadratic condition loops (`i * i <= n` or accumulators $\sum_{j=1}^k j \ge n$): Perform $\Theta(\sqrt{n})$ iterations.

### 5.2. Comparative Study: Elementary Sorting

#### Selection Sort
Finds the maximum in $v[0..i]$ and swaps it with $v[i]$, decrementing $i$ from $n-1$ down to 1.
- Number of comparisons: $\sum_{i=1}^{n-1} i = \frac{n(n-1)}{2}$.
- Best-case cost: $\Theta(n^2)$.
- Worst-case cost: $\Theta(n^2)$.
- *Property:* Data-insensitive; unconditionally performs $\Theta(n^2)$ comparisons regardless of input permutation.

#### Insertion Sort
At step $i$ (from 1 to $n-1$), places $v[i]$ into its correct sorted position within $v[0..i-1]$ by shifting larger elements rightward.
- **Best Case (already sorted ascendingly):** 1 comparison per step, 0 shifts. Cost: $\Theta(n)$.
- **Worst Case (reverse sorted descendingly):** Element shifts all the way to index 0 ($i$ comparisons and swaps). Cost: $\sum_{i=1}^{n-1} i = \Theta(n^2)$.
- **Adaptive Case (partially sorted inputs):** Total cost is $\Theta(n + I)$, where $I$ is the number of inversions. When each element is displaced by at most a constant distance $B$ from its final position, cost is strictly linear $\Theta(n)$.

---

## 6. Analysis of Recursive Algorithms & Master Theorems

### 6.1. Recurrence Relations
The cost of a recursive function is formulated as:
$$T(n) = \begin{cases} \text{base cost}, & \text{if } n \le n_0 \\ a \cdot T(\text{subproblem size}) + g(n), & \text{if } n > n_0 \end{cases}$$
where $a$ is the branching factor (recursive calls) and $g(n)$ is non-recursive overhead (partition and merge).

- **Recursive Linear Search:** $T(n) = T(n-1) + \Theta(1) \implies \Theta(n)$.
- **Recursive Binary Search:** $T(n) = T(n/2) + \Theta(1) \implies \Theta(\log n)$.

---

### 6.2. Master Theorem for Subtractive Recurrences (FIB)

Applies to recurrences of the form:
$$T(n) = \begin{cases} f(n), & \text{if } 0 \le n < n_0 \\ a \cdot T(n-c) + g(n), & \text{if } n \ge n_0 \end{cases}$$
with $n_0 \in \mathbb{N}$, $c \ge 1$, $a > 0$, and $g(n) \in \Theta(n^k)$ for $k \ge 0$.

$$T(n) \in \begin{cases} \Theta(n^k), & \text{if } a < 1 \\ \Theta(n^{k+1}), & \text{if } a = 1 \\ \Theta(a^{n/c}), & \text{if } a > 1 \end{cases}$$

- **Case $a = 1$:** $T(n) = T(n-1) + \Theta(n) \implies a=1, c=1, k=1 \implies T(n) \in \Theta(n^{1+1}) = \Theta(n^2)$.
- **Case $a > 1$:** $T(n) = 2T(n-1) + \Theta(1) \implies a=2, c=1, k=0 \implies T(n) \in \Theta(2^n)$.

---

### 6.3. Master Theorem for Divisive Recurrences (FIB)

Applies to recurrences of the form:
$$T(n) = \begin{cases} f(n), & \text{if } 0 \le n < n_0 \\ a \cdot T(n/b) + g(n), & \text{if } n \ge n_0 \end{cases}$$
with $n_0 \in \mathbb{N}$, $a \ge 1$, $b > 1$, and $g(n) \in \Theta(n^k)$ for $k \ge 0$.

Define the critical leaf exponent: **$\alpha = \log_b(a)$**.

$$T(n) \in \begin{cases} \Theta(n^k), & \text{if } \alpha < k \iff a < b^k \quad (\text{overhead dominates}) \\ \Theta(n^k \log n), & \text{if } \alpha = k \iff a = b^k \quad (\text{balanced work across all levels}) \\ \Theta(n^\alpha) = \Theta(n^{\log_b a}), & \text{if } \alpha > k \iff a > b^k \quad (\text{leaf work dominates}) \end{cases}$$

#### Polylogarithmic extension:
If $g(n) \in \Theta(n^\alpha \log^p n)$ with $p \ge 0$:
$$T(n) \in \Theta(n^\alpha \log^{p+1} n)$$

#### Standard Examples:
- **Mergesort:**
  $$T(n) = 2T(n/2) + \Theta(n) \implies a=2, b=2, k=1 \implies \alpha = \log_2 2 = 1 = k \implies T(n) \in \Theta(n \log n)$$
- **Karatsuba Multiplication:**
  $$T(n) = 3T(n/2) + \Theta(n) \implies a=3, b=2, k=1 \implies \alpha = \log_2 3 \approx 1.585 > 1 \implies T(n) \in \Theta(n^{\log_2 3})$$
- **Strassen Matrix Multiplication:**
  $$T(n) = 7T(n/2) + \Theta(n^2) \implies a=7, b=2, k=2 \implies \alpha = \log_2 7 \approx 2.807 > 2 \implies T(n) \in \Theta(n^{\log_2 7})$$

---

## 7. Case Study: Fibonacci Numbers

Definition: $f(0) = 1$, $f(1) = 1$, $f(k) = f(k-1) + f(k-2)$ for $k \ge 2$.

### 7.1. Solution 1: Naive Recursive
```cpp
int fib(int k) {
    if (k <= 1) return 1;
    return fib(k - 1) + fib(k - 2);
}
```
- Recurrence: $T(k) = T(k-1) + T(k-2) + \Theta(1)$.
- Upper bound: $T(k) \le 2T(k-1) + \Theta(1) \implies T(k) \in \mathcal{O}(2^k)$.
- Lower bound: $T(k) \ge 2T(k-2) + \Theta(1) \implies T(k) \in \Omega((\sqrt{2})^k) \approx \Omega(1.414^k)$.
- **Exact cost:** Solving characteristic equation $r^2 - r - 1 = 0$, the roots are $r = \frac{1 \pm \sqrt{5}}{2}$. The solution is dominated by the golden ratio $\phi = \frac{1+\sqrt{5}}{2} \approx 1.618$:
  $$T(k) \in \Theta(\phi^k)$$
  Intractable for even moderate values of $k$.

### 7.2. Solution 2: Iterative (Dynamic Programming)
```cpp
int fib(int k) {
    if (k <= 1) return 1;
    int cur = 1, pre = 1;
    for (int i = 1; i < k; ++i) {
        int tmp = pre;
        pre = cur;
        cur = cur + tmp;
    }
    return cur;
}
```
- Executes $k-1$ iterations with $\Theta(1)$ work per loop.
- **Time Complexity:** $\Theta(k)$ (linear).
- **Space Complexity:** $\Theta(1)$.

### 7.3. Solution 3: Logarithmic Fast Matrix Exponentiation
Matrix relation (provable by induction for all $k \ge 0$):
$$\begin{pmatrix} f(k+1) \\ f(k) \end{pmatrix} = \begin{pmatrix} 1 & 1 \\ 1 & 0 \end{pmatrix} \begin{pmatrix} f(k) \\ f(k-1) \end{pmatrix} \implies \begin{pmatrix} f(k+1) & f(k) \\ f(k) & f(k-1) \end{pmatrix} = \begin{pmatrix} 1 & 1 \\ 1 & 0 \end{pmatrix}^k$$

#### Fast Exponentiation Algorithm (`pow`):
To compute $M^k$, split by powers of 2:
$$M^k = \begin{cases} I, & \text{if } k = 0 \\ (M^{k/2})^2, & \text{if } k \text{ is even} \\ M \cdot (M^{\lfloor k/2 \rfloor})^2, & \text{if } k \text{ is odd} \end{cases}$$

```cpp
typedef vector<vector<int>> matrix;

matrix multiply(const matrix& A, const matrix& B) {
    matrix C(2, vector<int>(2, 0));
    for (int i = 0; i < 2; ++i)
        for (int j = 0; j < 2; ++j)
            for (int p = 0; p < 2; ++p)
                C[i][j] += A[i][p] * B[p][j];
    return C;
}

matrix pow(const matrix& A, int k) {
    if (k == 0) return {{1, 0}, {0, 1}};
    matrix B = pow(A, k / 2);
    matrix B2 = multiply(B, B);
    if (k % 2 == 0) return B2;
    else return multiply(A, B2);
}

int fib(int k) {
    matrix F = {{1, 1}, {1, 0}};
    matrix P = pow(F, k);
    return P[1][0] + P[1][1]; // Yields f(k)
}
```
- Multiplying $2 \times 2$ fixed-size matrices takes $\Theta(1)$ time.
- Recurrence: $T(k) = T(k/2) + \Theta(1)$.
- Applying the Divisive Master Theorem: $a=1, b=2, k=0 \implies \alpha = \log_2 1 = 0 = k \implies T(k) \in \Theta(\log k)$.

---

## 8. Lower Bounds for Comparison-Based Sorting

### 8.1. Decision Tree Model
- Any sorting algorithm that operates strictly by comparing elements ($a_i < a_j$) can be modeled as a **binary decision tree**:
  - Each **internal node** represents an inquiry comparison $a_i \le a_j$.
  - Each branch corresponds to a boolean outcome (`true` left, `false` right).
  - Each **leaf** represents the final sorted permutation of the input elements.
- **Worst-case execution cost:** Length of the longest path from root to leaf, which is the **tree height ($d$)**.

### 8.2. Proof of the $\Omega(n \log n)$ Bound
1. **Total number of permutations:** Given $n$ distinct elements, there are $n!$ possible input orderings.
2. Every possible permutation must appear in at least one leaf node of the decision tree (otherwise the algorithm would fail on that input permutation).
   Therefore, if $L$ is the number of leaves:
   $$L \ge n!$$
3. **Binary tree property:** A binary tree of height $d$ has at most $2^d$ leaves:
   $$L \le 2^d$$
4. Chaining both inequalities:
   $$n! \le L \le 2^d \implies 2^d \ge n! \implies d \ge \log_2(n!)$$
5. **Bounding $\log_2(n!)$:**
   Discarding the lower half of terms:
   $$n! = n \cdot (n-1) \cdots 1 \ge n \cdot (n-1) \cdots \lceil n/2 \rceil \ge \left(\frac{n}{2}\right)^{n/2}$$
   Taking base-2 logarithms:
   $$\log_2(n!) \ge \log_2\left(\left(\frac{n}{2}\right)^{n/2}\right) = \frac{n}{2} \log_2\left(\frac{n}{2}\right) = \frac{n}{2} (\log_2 n - 1) \in \Omega(n \log n)$$

> **Theorem:** Any comparison-based sorting algorithm requires at least $\Omega(n \log n)$ comparisons in the worst case.
> 
> **Corollary:** Since Mergesort runs in $\Theta(n \log n)$ in the worst case, it is asymptotically **optimal**. No comparison sort can achieve a superior asymptotic upper bound.
