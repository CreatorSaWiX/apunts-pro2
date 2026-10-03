---
title: "Topic 2: Divide and Conquer"
description: "Divide and conquer paradigm: divide-and-conquer and subtractive recurrences, sorting (MergeSort, QuickSort), fast exponentiation, Karatsuba, Strassen, Towers of Hanoi, and linear selection (BFPRT)."
readTime: "45 min"
order: 2
draft: false
---

The **divide and conquer** paradigm decomposes a problem of size $n$ into smaller subproblems of the same nature, solves them recursively, and combines their results to obtain the global solution.

| Phase | Action | Associated cost |
| :--- | :--- | :---: |
| **1. Divide** | Decompose the input into $a \ge 1$ subproblems of size $n/b$ with $b > 1$. | $T_{\text{divide}}(n)$ |
| **2. Conquer** | Recursively solve the $a$ subproblems (direct $\Theta(1)$ resolution in the base case). | $a \cdot T(n/b)$ |
| **3. Combine** | Assemble the partial solutions to construct the global solution. | $T_{\text{combine}}(n)$ |

:::dncviz
:::

### Time cost distribution
The total cost of a divide and conquer algorithm originates exclusively from three sources:

$$
T(n) = \underbrace{T_{\text{divide}}(n)}_{\text{split}} + \underbrace{a \cdot T(n/b)}_{\text{recursive calls}} + \underbrace{T_{\text{combine}}(n)}_{\text{merge/assembly}}
$$

Where the non-recursive work $g(n) = T_{\text{divide}}(n) + T_{\text{combine}}(n)$ typically belongs to $\Theta(n^k)$ for $k \ge 0$, and can be solved using the **Master Theorem for divide-and-conquer recurrences**.

### Introductory example: Binary search
Given a **sorted** array $A[0 \dots n-1]$, we want to determine whether an element $x$ belongs to it. At each step, we compare $x$ with the central element $A[m]$: if they match, we are done; if $x < A[m]$, we search recursively in the left half; if $x > A[m]$, in the right half.

:::binarysearchviz
:::

:::oopviz{simulation="binary_search"}
:::

The recursion parameter is $n = j - i + 1$. At each level, only **one** recursive call is made ($a = 1$) on a subarray of half the size ($b = 2$), and the non-recursive work (midpoint computation and comparisons) is constant ($g(n) \in \Theta(1) \implies k = 0$).

$$ 
T(n) = T(n/2) + \Theta(1) 
$$

By the divide-and-conquer Master Theorem: $\alpha = \log_b a = \log_2 1 = 0$. Since $\alpha = k = 0$, we have:

$$ 
\mathbf{T(n) \in \Theta(n^0 \log n) = \Theta(\log n)} 
$$

---

## 2.1 Merge Sort (*MergeSort*)

The **merge sort** algorithm (*MergeSort*) is a divide and conquer scheme where partitioning the array is trivial and the main computational work lies in the sorted combination of the subarrays.

:::mergerecviz
:::

| Property | Behavior | Justification |
| :--- | :---: | :--- |
| **Time complexity** | $\Theta(n \log n)$ | Optimal in the comparison model; identical in best, average, and worst cases (non-adaptive). |
| **Stability** | Yes | Preserves the original relative order of elements with identical keys. |
| **Auxiliary memory** | $\Theta(n)$ | Requires an auxiliary array for the merge phase (not *in-place*). |

### Stability and multi-criterion sorting

An algorithm is **stable** if for any pair of elements with identical keys ($x = y$), if $x$ precedes $y$ in the input, $x$ also precedes $y$ in the output.

This property enables **multi-criterion sorting**: to sort a dataset according to multiple keys of differing priority, the stable algorithm is applied successively from the least significant criterion to the most significant criterion.

| Step | Applied criterion | Resulting sequence |
| :---: | :--- | :--- |
| **0** | Unsorted input | $\langle 6, 7 \rangle,\; \langle 3, 2 \rangle,\; \langle 1, 4 \rangle,\; \langle 3, 1 \rangle,\; \langle 1, 6 \rangle,\; \langle 4, 7 \rangle$ |
| **1** | Sort by 2nd component | $\langle 3, \mathbf{1} \rangle,\; \langle 3, \mathbf{2} \rangle,\; \langle 1, \mathbf{4} \rangle,\; \langle 1, \mathbf{6} \rangle,\; \langle 6, \mathbf{7} \rangle,\; \langle 4, \mathbf{7} \rangle$ |
| **2** | Stable sort by 1st component | $\langle \mathbf{1}, 4 \rangle,\; \langle \mathbf{1}, 6 \rangle,\; \langle \mathbf{3}, 1 \rangle,\; \langle \mathbf{3}, 2 \rangle,\; \langle \mathbf{4}, 7 \rangle,\; \langle \mathbf{6}, 7 \rangle$ |

---

### Recursive scheme and implementation

The algorithm operates on the same array $T$ bounded by the start index $e$ and end index $d$. It splits the subarray at the midpoint $m = \lfloor(e + d) / 2\rfloor$, recursively sorts both halves, and combines them with `merge`.

Merging combines two contiguous, previously sorted subarrays, $T[e \dots m]$ and $T[m+1 \dots d]$, producing a single sorted subarray at $T[e \dots d]$. It is not possible to perform this operation *in-place* in linear time; therefore, it requires an auxiliary array $B$ of size $d - e + 1$.

:::mergeviz
:::

| Key aspect | Associated code | Justification / Effect |
| :--- | :--- | :--- |
| **Auxiliary size** | `vector<elem> B(d - e + 1)` | Number of elements in the closed interval $[e, d]$. |
| **Stability** | `if (T[i] <= T[j])` | In case of a tie ($T[i] = T[j]$), it prioritizes the left element, preserving the original order. |
| **Residual loops** | `while (i <= m)`, `while (j <= d)` | Copy the remaining elements. They are mutually exclusive (exactly one index reaches the boundary). |
| **Shift back** | `T[e + k] = B[k]` | Relocates the contents of $B[0 \dots n-1]$ back to the original window $T[e \dots d]$. |
| **Merge cost** | $T_{\text{merge}}(n) \in \Theta(n)$ | Performs at most $n - 1$ comparisons and exactly $2n$ assignments ($n$ into $B$ and $n$ back into $T$). |

:::oopviz{simulation="mergesort"}
:::

### Time cost analysis

The time cost $T(n)$ for a subarray of size $n = d - e + 1$ satisfies the recurrence equation:

$$
T(n) = \begin{cases} \Theta(1) & \text{if } n \le 1 \\ 2T(n/2) + \Theta(n) & \text{if } n > 1 \end{cases}
$$

Applying the divide-and-conquer Master Theorem with parameters $a = 2$, $b = 2$, and $g(n) \in \Theta(n^1)$ ($k = 1$):

$$
\alpha = \log_b a = \log_2 2 = 1
$$

Since $\alpha = k = 1$, the asymptotic complexity is:

$$
T(n) \in \Theta(n^k \log n) = \Theta(n \log n)
$$

This cost is independent of the initial arrangement of the data; the number of divisions and comparisons is identical in all cases:

$$
T_{\min}(n) = T_{\text{avg}}(n) = T_{\max}(n) = \Theta(n \log n)
$$

---

### Optimization variants

### Hybridization by critical threshold
For small subarrays ($n < k_0 \approx 50$), insertion sort outperforms merge sort in practice thanks to lower constant factors and the absence of dynamic memory allocation overhead. When the interval falls below the critical threshold, recursion is halted and insertion sort is applied:

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

### Iterative MergeSort with queue (*bottom-up*)
Constructs the solution from the bottom up without recursion: enqueues each element as a unitary array and successively merges pairs dequeued from the front of the queue until only one remains:

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

### Iterative MergeSort on array (*bottom-up*)
Applies the bottom-up principle directly over the array without the overhead of a queue, merging contiguous blocks of doubled size at each stage ($m = 1, 2, 4, 8, \dots$):

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

## 2.2 Quick Sort (*QuickSort*)

**QuickSort** is a divide and conquer algorithm that rearranges elements directly within the array (*in-place*). It has an average-case cost of $\Theta(n \log n)$ and a worst-case cost of $\Theta(n^2)$, with a very small constant coefficient that makes it extremely fast in practice.

### Algorithm phases

| Phase | Action | Associated cost |
| :--- | :--- | :---: |
| **1. Choose pivot** | Select an element $x \in T$ as a reference. | $\Theta(1)$ |
| **2. Partition** | Rearrange $T$ into two sub-blocks: elements $\le x$ on the left and elements $\ge x$ on the right. | $\Theta(n)$ |
| **3. Conquer** | Recursively sort each of the two sub-blocks. | $T(n_1) + T(n_2)$ |
| **4. Combine** | Trivial: the array is already sorted in memory without any additional operation. | $\Theta(1)$ |

:::quicksortviz
:::

### Duality: MergeSort vs QuickSort

MergeSort and QuickSort exhibit an inverse symmetry in the computational effort of their phases:

| Feature | MergeSort | QuickSort |
| :--- | :---: | :---: |
| **Division phase** | Trivial: midpoint ($\Theta(1)$) | Complex: pivot partition ($\Theta(n)$) |
| **Subproblems** | Always balanced ($n/2$) | Variable depending on the pivot ($n_1 + n_2 = n$) |
| **Combination phase** | Complex: sorted merge ($\Theta(n)$) | None: elements already placed *in-place* ($\Theta(1)$) |
| **Auxiliary memory** | $\Theta(n)$ (auxiliary array) | $\Theta(1)$ additional (*in-place*) |
| **Stability** | Stable | Not stable |
| **Worst case** | $\Theta(n \log n)$ | $\Theta(n^2)$ |
| **Average case** | $\Theta(n \log n)$ | $\Theta(n \log n)$ |

---

### Hoare's *in-place* partition
Hoare's classic partition operates without any auxiliary array. It uses two pointers: $i$ (which advances from the left looking for elements $\ge x$) and $j$ (which advances from the right looking for elements $\le x$). When both stop, they are swapped with `swap` and continue moving toward each other until they cross ($i \ge j$).

:::hoarepartviz
:::

:::oopviz{simulation="quicksort"}
:::

| Technical aspect | Formal description |
| :--- | :--- |
| **Pointers and pre-operators** | Initialized to $i = e - 1$ and $j = d + 1$. The pre-increments (`++i`) and pre-decrements (`--j`) guarantee that the first evaluation operates precisely on the boundaries $e$ and $d$. |
| **Postcondition** | Upon returning index $q = j$, it holds that $\forall k \in [e \dots q], T[k] \le x$ and $\forall k \in [q+1 \dots d], T[k] \ge x$. |
| **Computational cost** | Linear time $\mathbf{\Theta(n)}$ (each element is evaluated a constant number of times, with $\le n/2$ swaps) and auxiliary memory $\mathbf{\Theta(1)}$ (*in-place*). |

---

### Pivot selection strategies
Since Hoare's partition uses element $T[e]$ as a reference, any alternative strategy selects an element and initially swaps it with $T[e]$:

| Strategy | Mechanism | Advantage | Disadvantage |
| :--- | :--- | :--- | :--- |
| **First element ($x = T[e]$)** | Direct selection of the first index. | Zero selection overhead ($\Theta(1)$). | Degenerates to $\Theta(n^2)$ if the input is already sorted or reverse-sorted. |
| **Random pivot** | Random choice $p \in [e, d]$ and `swap(T[e], T[p])`. | Eliminates correlation with prior orderings of the data. | Overhead in generating pseudorandom numbers. |
| **Median-of-three** | Median between $T[e]$, $T[\lfloor(e+d)/2\rfloor]$, and $T[d]$. | Guarantees that the pivot is never either of the two extreme absolute values. | Requires 3 comparisons and prior swaps per partition. |
| **Insertion sort hybridization** | Switch to insertion sort when $d - e < 20$. | Reduces recursion overhead on small subarrays. | Requires calibrating the critical size for the architecture. |

Code for the median-of-three strategy:
```cpp
int center = (e + d) / 2;
if (T[e] < T[center]) swap(T[center], T[e]);
if (T[d] < T[center]) swap(T[center], T[d]);
if (T[d] < T[e]) swap(T[e], T[d]);
// The median is now placed at T[e]
```

---

### QuickSort complexity analysis
Let $i$ be the number of elements in the first subarray ($1 \le i \le n - 1$). The general recurrence is:

$$ T(n) = T(i) + T(n - i) + \Theta(n) $$

| Case | Partition condition | Recurrence | Asymptotic complexity |
| :--- | :--- | :--- | :---: |
| **Worst** | Maximum imbalance ($i = 1$ or $i = n - 1$ due to extreme elements) | $T(n) = T(n - 1) + \Theta(n)$ | $\mathbf{\Theta(n^2)}$ |
| **Best** | Exact balance ($i = n/2$, symmetric bisection) | $T(n) = 2T(n/2) + \Theta(n)$ | $\mathbf{\Theta(n \log n)}$ |

---

### Practical comparison: QuickSort vs MergeSort at the architecture level
Despite sharing an asymptotic cost of $\Theta(n \log n)$, QuickSort is typically $2$ to $3$ times faster on real hardware due to the performance of the memory hierarchy:

| Memory level | Typical access time | Slowdown factor relative to registers |
| :--- | :--- | :---: |
| **CPU Registers** | $< 0.5 \text{ ns}$ | $1\times$ |
| **L1 Cache** | $\sim 1 \text{ ns}$ | $2\times$ |
| **L2 Cache** | $\sim 7 \text{ ns}$ | $14\times$ |
| **L3 Cache** | $\sim 20 \text{ ns}$ | $40\times$ |
| **Main Memory (RAM)** | $\sim 100 \text{ ns}$ | **$200\times$** |

| Architectural factor | QuickSort | MergeSort |
| :--- | :--- | :--- |
| **Spatial locality and cache** | High (*in-place*). Sequential traversal from the extremes maximizes cache hits in L1 and L2. | Low. Alternating access between the base array and the auxiliary array causes cache misses. |
| **Dynamic memory management** | None. Operates directly on the existing space ($\Theta(1)$ additional memory). | High. Requires allocating and deallocating auxiliary space of size $\Theta(n)$ for merging. |
| **Internal constant factor** | Very low. The inner loop contains only comparisons and index increments/decrements. | Higher. Includes transferring elements into the auxiliary array and copying them back. |

---

## 2.3 Products and Powers: Fast Exponentiation

Calculating integer powers $x^n$ exemplifies how the divide and conquer strategy can reduce computational complexity from a linear cost to a logarithmic cost.

| Approach | Computation mechanism | Recurrence / Number of operations | Time complexity | Auxiliary memory |
| :--- | :--- | :---: | :---: | :---: |
| **Naive iterative** | Successive multiplications $\prod_{i=1}^n x$ in a loop | $n - 1 \text{ multiplications}$ | $\Theta(n)$ | $\Theta(1)$ |
| **Divide and conquer** | Recursive calculation of $x^{\lfloor n/2 \rfloor}$ followed by squaring | $T(n) = T(n/2) + \Theta(1)$ | $\mathbf{\Theta(\log n)}$ | $\Theta(\log n)$ (stack) |

The formal recurrence relation is defined as:

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

### Complexity analysis and number of recursive calls

By storing the intermediate result of the subpower in a local variable (`y = power(x, n/2)`), only a single recursive call is executed per level:

| Master Theorem parameter | Value | Mathematical justification |
| :--- | :---: | :--- |
| **Number of subproblems ($a$)** | $1$ | A single recursive call thanks to storing the intermediate term. |
| **Division factor ($b$)** | $2$ | The exponent is halved at each step. |
| **Non-recursive work ($g(n)$)** | $\Theta(1)$ | Parity check of the exponent and at most two scalar multiplications ($k = 0$). |

Recurrence:
$$ T(n) = T(n/2) + \Theta(1) $$

Since $\alpha = \log_b a = \log_2 1 = 0$ and $k = 0$ ($\alpha = k$):
$$ \mathbf{T(n) \in \Theta(\log n)} $$

> **Note on duplicating calls:**  
> If computed by duplicating the expression (`power(x, n/2) * power(x, n/2)`), the number of calls becomes $a = 2$. The recurrence turns into $T(n) = 2T(n/2) + \Theta(1)$, where $\alpha = \log_2 2 = 1 > k = 0 \implies T(n) \in \Theta(n)$, completely forfeiting the efficiency of the algorithm.

### Practical applications

| Field | Application | Resulting complexity |
| :--- | :--- | :---: |
| **Matrix algebra** | Calculating the $n$-th Fibonacci term by computing matrix power $\begin{pmatrix} 1 & 1 \\ 1 & 0 \end{pmatrix}^n$. | $\Theta(\log n)$ |
| **Cryptography** | Modular exponentiation arithmetic ($x^n \pmod m$) in public-key schemes such as RSA or Diffie-Hellman. | $\Theta(\log n)$ |

---

## 2.4 Large Integer Multiplication: Karatsuba's Algorithm

Multiplying two $n$-digit (or $n$-bit) integers is a fundamental operation in computational arithmetic and cryptography. 
In the traditional grade-school method, the first number is multiplied by each of the $n$ digits of the second, shifting each partial row one position to the left:

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

| Grade-school stage | Elementary operation | Number of operations | Complexity |
| :--- | :--- | :---: | :---: |
| **Row generation** | $n$ rows with $n$ digit products and carries | $n \times n$ | $\Theta(n^2)$ |
| **Column summation** | Vertical addition across the $2n$ resulting columns | $\approx 2n \times n$ | $\Theta(n^2)$ |

The total cost of the grade-school algorithm is:
$$ T_{\text{school}}(n) = \Theta(n^2) + \Theta(n^2) = \mathbf{\Theta(n^2)} $$

---

### Naive recursive decomposition (4 subproducts)

In 1952, **Andrei Kolmogorov** conjectured that any algorithm to multiply two $n$-digit numbers required an insurmountable asymptotic lower bound of $\Omega(n^2)$ operations.

:::naivemultviz
:::

Representing two $n$-bit natural numbers $x$ and $y$ (assuming $n$ is even) divided into their higher/left ($E$) and lower/right ($D$) halves:

$$ 
x = 2^{n/2} x_E + x_D, \qquad y = 2^{n/2} y_E + y_D 
$$

Where $x_E, x_D, y_E, y_D$ are $n/2$-bit integers. Expanding using the distributive property yields:

$$ 
xy = 2^n (x_E y_E) + 2^{n/2} (x_E y_D + x_D y_E) + (x_D y_D) 
$$

This calculation requires **4 multiplications** of size $n/2$: $x_E y_E$, $x_E y_D$, $x_D y_E$, and $x_D y_D$. Multiplying by $2^n$ and $2^{n/2}$ corresponds to binary bit shifts of cost $\Theta(n)$, and additions of terms of length $\mathcal{O}(n)$ have linear cost $\Theta(n)$.

| Recurrence parameter | Value | Computational meaning |
| :--- | :---: | :--- |
| **Number of subproblems ($a$)** | $4$ | The 4 cross products ($x_E y_E, x_E y_D, x_D y_E, x_D y_D$). |
| **Reduction factor ($b$)** | $2$ | Operands halved in size ($n/2$ bits). |
| **Non-recursive work ($g(n)$)** | $\Theta(n)$ | Bit shifts and additions of bit strings ($k = 1$). |

Recurrence:
$$ 
T(n) = 4T(n/2) + \Theta(n) 
$$

Since $\alpha = \log_b a = \log_2 4 = 2 > k = 1$:
$$ 
\mathbf{T(n) \in \Theta(n^{\log_2 4}) = \Theta(n^2)} 
$$

Direct decomposition does not reduce the asymptotic complexity compared to the grade-school algorithm and introduces temporal overhead from recursion stack management.

---

### Karatsuba's reduction (1960) and Gauss's identity

:::karatsubaviz
:::

In 1960, **Anatolii Karatsuba** disproved Kolmogorov's conjecture, inspired by Gauss's identity for the product of complex numbers:

$$ 
(a + bi)(c + di) = (ac - bd) + (bc + ad)i 
$$

where the cross term $bc + ad$ is calculated with a single additional multiplication:

$$ 
bc + ad = (a + b)(c + d) - ac - bd 
$$

Applying this principle to binary integers, Karatsuba defines three subproducts:

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

From which the sum of the cross terms is obtained by subtraction:
$$ 
x_E y_D + x_D y_E = c - a - b 
$$

Final expression of the product:
$$ 
\mathbf{xy = 2^n a + 2^{n/2} (c - a - b) + b} 
$$

---

### Formal analysis of Karatsuba's recurrence

The algorithm requires only **3 recursive calls** on numbers of size $n/2$ ($a$, $b$, and $c$). Additions, subtractions, and bit shifts on operands of size $\mathcal{O}(n)$ have a non-recursive cost $g(n) \in \Theta(n)$.

$$ 
T(n) = 3T(n/2) + \Theta(n) 
$$

| Master Theorem parameter | Value | Computational meaning |
| :--- | :---: | :--- |
| **Number of recursive calls ($a$)** | $3$ | The subproducts $a = x_E y_E$, $b = x_D y_D$, and $c = (x_E + x_D)(y_E + y_D)$. |
| **Size reduction factor ($b$)** | $2$ | Bit length is halved. |
| **Additional work ($k$)** | $1$ | Additions, subtractions, and shifts of bit strings ($\Theta(n^1)$). |

Critical exponent:
$$ 
\alpha = \log_b a = \log_2 3 \approx 1.58496 
$$

Since $\alpha = \log_2 3 > k = 1$, the cost is dominated by the leaves of the recursion tree:
$$ 
\mathbf{T(n) \in \Theta(n^{\log_2 3}) \approx \Theta(n^{1.585})} 
$$

Since $n^{1.585} \in o(n^2)$, this result formally proves that **integer multiplication has strictly subquadratic complexity**.

| Algorithm | Number of subproducts | Recurrence | Asymptotic complexity |
| :--- | :---: | :--- | :---: |
| **Traditional grade-school** | — | — | $\Theta(n^2)$ |
| **Naive divide and conquer** | 4 of size $n/2$ | $T(n) = 4T(n/2) + \Theta(n)$ | $\Theta(n^2)$ |
| **Karatsuba** | 3 of size $n/2$ | $T(n) = 3T(n/2) + \Theta(n)$ | $\mathbf{\Theta(n^{\log_2 3}) \approx \Theta(n^{1.585})}$ |

<!-- ### Practical implementation considerations

| Implementation aspect | Technical description |
| :--- | :--- |
| **Arbitrary precision (`BigInt`)** | The CPU multiplies native-size numbers (32 or 64 bits) in hardware in constant time $\Theta(1)$. Karatsuba's algorithm is applied to arbitrary-length data types represented by digit vectors (`vector<uint32_t>`). |
| **Critical threshold** | Due to the multiplicative constant of recursive calls and dynamic memory management, the grade-school algorithm is more efficient for numbers smaller than 1000-2000 bits. High-performance libraries (such as GNU MP) use a hybrid approach that switches to the classical algorithm below this threshold. | -->

---

## 2.5 Matrix Multiplication: Strassen's Algorithm

Given two square matrices $X, Y \in \mathbb{R}^{n \times n}$, their product $Z = X \cdot Y$ is an $n \times n$ matrix where each element $(i, j)$ is defined as:

$$
Z_{ij} = \sum_{k=1}^n X_{ik} Y_{kj} \qquad (1 \le i, j \le n)
$$

### The standard cubic algorithm $\Theta(n^3)$

Direct implementation of this definition requires 3 nested loops:

```cpp
matrix<int> standard_multiplication(const matrix<int>& A, const matrix<int>& B) {
    int n = A.numrows();
    matrix<int> C(n, n, 0);
    for (int i = 0; i < n; ++i)
        for (int j = 0; j < n; ++j)
            for (int k = 0; k < n; ++k)
                C[i][j] += A[i][k] * B[k][j];
    return C;
}
```

Each cell $Z_{ij}$ requires $n$ multiplications and $n - 1$ scalar additions ($\Theta(n)$ operations). Filling all $n \times n = n^2$ cells costs:

$$
T(n) = n^2 \cdot \Theta(n) = \mathbf{\Theta(n^3)}
$$

---

### Block decomposition ($2 \times 2$)

:::naivematmultviz
:::

Dividing matrices $X$ and $Y$ into four quadrants or submatrices of size $(n/2) \times (n/2)$:

$$
X = \begin{bmatrix} A & B \\ C & D \end{bmatrix}, \qquad Y = \begin{bmatrix} E & F \\ G & H \end{bmatrix}
$$

Block multiplication reproduces the standard formula:

$$
XY = \begin{bmatrix} A & B \\ C & D \end{bmatrix} \begin{bmatrix} E & F \\ G & H \end{bmatrix} = \begin{bmatrix} AE + BG & AF + BH \\ CE + DG & CF + DH \end{bmatrix}
$$

| Block operation | Quantity and dimension | Computational cost |
| :--- | :--- | :---: |
| **Submatrix products** | 8 multiplications of size $(n/2) \times (n/2)$ | $8T(n/2)$ |
| **Submatrix additions** | 4 additions of matrices $(n/2) \times (n/2)$ | $\Theta(n^2)$ |

Recurrence:

$$
T(n) = 8T(n/2) + \Theta(n^2)
$$

By the divide-and-conquer Master Theorem ($a = 8, b = 2, k = 2$):

$$
\alpha = \log_2 8 = 3 > k = 2 \implies \mathbf{T(n) \in \Theta(n^3)}
$$

Direct block division maintains the same cubic asymptotic class.

---

### Volker Strassen's Algorithm (1969)

:::strassenmatmultviz
:::

In 1969, **Volker Strassen** proved that block multiplication can be computed using only **7 submatrix multiplications** instead of 8, at the cost of increasing the number of linear additions and subtractions:

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

Reconstructing the four quadrants of the product matrix:

$$
XY = \begin{bmatrix} P_5 + P_4 - P_2 + P_6 & P_1 + P_2 \\ P_3 + P_4 & P_1 + P_5 - P_3 - P_7 \end{bmatrix}
$$

Algebraic verification of the top-left quadrant:

$$
P_5 + P_4 - P_2 + P_6 = (AE + AH + DE + DH) + (DG - DE) - (AH + BH) + (BG + BH - DG - DH) = AE + BG
$$

---

### Strassen's complexity analysis

The algorithm performs 7 recursive calls on submatrices of size $n/2$ and matrix additions/subtractions costing $\Theta(n^2)$:

$$
T(n) = 7T(n/2) + \Theta(n^2)
$$

| Master Theorem parameter | Value | Computational meaning |
| :--- | :---: | :--- |
| **Number of recursive calls ($a$)** | $7$ | The 7 matrix products $P_1 \dots P_7$. |
| **Size division factor ($b$)** | $2$ | The dimension of the submatrices is halved to $n/2$. |
| **Non-recursive additional work ($k$)** | $2$ | Additions and subtractions of quadrants of size $(n/2) \times (n/2)$ ($\Theta(n^2)$). |

Critical exponent:

$$
\alpha = \log_b a = \log_2 7 \approx 2.80735
$$

Since $\alpha = \log_2 7 > k = 2$:

$$
\mathbf{T(n) \in \Theta(n^{\log_2 7}) \approx \Theta(n^{2.807})}
$$

| Algorithm | Number of subproducts | Recurrence | Asymptotic complexity |
| :--- | :---: | :--- | :---: |
| **Standard iterative** | — | — | $\Theta(n^3)$ |
| **Naive block ($2 \times 2$)** | 8 of size $n/2$ | $T(n) = 8T(n/2) + \Theta(n^2)$ | $\Theta(n^3)$ |
| **Strassen** | 7 of size $n/2$ | $T(n) = 7T(n/2) + \Theta(n^2)$ | $\mathbf{\Theta(n^{\log_2 7}) \approx \Theta(n^{2.807})}$ |

<!-- ---

### Reduction of Boolean matrix multiplication

The **Boolean product** of two matrices $A, B \in \{0, 1\}^{n \times n}$ is defined as:

$$
P_{ij} = \bigvee_{k=1}^n (A_{ik} \wedge B_{kj})
$$

It can be reduced to standard matrix multiplication:

| Reduction phase | Operation | Complexity |
| :--- | :--- | :---: |
| **1. Conversion to integers** | Interpret Boolean matrices $A, B$ as matrices over $\mathbb{Z}$ | $\Theta(n^2)$ |
| **2. Strassen multiplication** | Compute the integer product $M = A \cdot B$ | $\Theta(n^{2.807})$ |
| **3. Boolean threshold** | Evaluate $P_{ij} = (M_{ij} > 0)$ | $\Theta(n^2)$ |

Since $M_{ij} = \sum_{k=1}^n A_{ik} B_{kj}$ exactly counts the number of indices $k$ such that $A_{ik} = 1$ and $B_{kj} = 1$, the condition $M_{ij} > 0$ is equivalent to the disjunction $\bigvee_{k=1}^n (A_{ik} \wedge B_{kj})$. The dominant cost is multiplication:

$$
T(n) = \Theta(n^{2.807}) + \Theta(n^2) = \mathbf{\Theta(n^{2.807})}
$$ -->

<!-- ---

### Galactic algorithms

Following Strassen, a series of theoretical advances progressively lowered the exponent:
* **Coppersmith and Winograd (1990):** $\mathcal{O}(n^{2.376})$.
* **Recent advances (Vassilevska Williams et al., 2023):** $\mathcal{O}(n^{2.371})$.

These modern methods belong to the category known as **galactic algorithms**: algorithms that possess a provably superior asymptotic order, but whose hidden constant factors within the big-$\mathcal{O}$ notation are so colossal that they would only outperform practical algorithms (such as Strassen or cache-optimized block multiplication) for matrices with dimensions exceeding the total number of atoms in the observable universe. For this reason, Strassen and its cache-aware variants remain the practical reference for large matrices. -->

---

## 2.6 The Towers of Hanoi

The **Towers of Hanoi** puzzle illustrates the application of divide and conquer to **subtractive** recurrences, where the problem size decreases by a constant rather than a division factor.

:::hanoiviz
:::

### Problem description and rules

Three vertical pegs are provided: $A$ (source), $B$ (auxiliary), and $C$ (destination). Initially, $A$ holds a stack of $n$ disks of strictly decreasing radii (the largest diameter disk at the base). The goal is to transfer the entire tower to $C$ while adhering to two invariant restrictions: at each step, only the topmost disk of a peg can be moved, and no disk may ever be placed on top of a disk of smaller diameter.

::videoviz{url="/eda/hanoi_transparent.webm?v=2" delay="2000" transparent="true"}

To transfer $n$ disks from the source peg $A$ to the destination peg $C$ using $B$ as an auxiliary peg:

```cpp
void hanoi(int n, char a, char b, char c) {
    if (n > 0) {
        hanoi(n - 1, a, c, b); // Move n-1 disks from source (a) to auxiliary (b) using destination (c)
        cout << a << " -> " << c << "\n"; // Elemental move of the largest disk
        hanoi(n - 1, b, a, c); // Move n-1 disks from auxiliary (b) to destination (c) using source (a)
    }
}
```

---

### Exact number of moves calculation

We define $M(n)$ as the number of elemental moves required to transfer a tower of $n$ disks:

$$
M(n) = \begin{cases} 
0, & \text{if } n = 0 \\ 
2M(n - 1) + 1, & \text{if } n > 0 
\end{cases}
$$

The term $2M(n - 1)$ represents the two transfers of the upper subtower, and $+1$ corresponds to moving the base disk.

| $n$ | $M(n) = 2M(n-1) + 1$ | Expression associated with powers of 2 |
| :---: | :---: | :--- |
| **0** | $0$ | $2^0 - 1 = 0$ |
| **1** | $2(0) + 1 = 1$ | $2^1 - 1 = 1$ |
| **2** | $2(1) + 1 = 3$ | $2^2 - 1 = 3$ |
| **3** | $2(3) + 1 = 7$ | $2^3 - 1 = 7$ |
| **4** | $2(7) + 1 = 15$ | $2^4 - 1 = 15$ |
| **5** | $2(15) + 1 = 31$ | $2^5 - 1 = 31$ |
| **6** | $2(31) + 1 = 63$ | $2^6 - 1 = 63$ |

The sequence yields the exact closed-form solution:

$$
\mathbf{M(n) = 2^n - 1}
$$

### Formal proof by change of variable:

Defining the auxiliary sequence $S(n) = M(n) + 1$:

$$
S(n) = 2M(n-1) + 1 + 1 = 2(S(n-1) - 1) + 2 = 2S(n-1)
$$

With base case $S(0) = M(0) + 1 = 1$, the homogeneous recurrence $S(n) = 2S(n-1)$ is a geometric progression of ratio 2:

$$
S(n) = 2^n \implies \mathbf{M(n) = S(n) - 1 = 2^n - 1} \qquad (\forall n \ge 0)
$$

---

### Asymptotic analysis via the subtractive Master Theorem

The recurrence for the Towers of Hanoi fits the general subtractive form:

$$
T(n) = a T(n - b) + g(n)
$$

| Parameter | Value | Justification |
| :--- | :---: | :--- |
| **Number of subproblems ($a$)** | $2$ | Two independent recursive calls per level. |
| **Decrement step ($b$)** | $1$ | Size decreases by one unit ($n \to n - 1$). |
| **Non-recursive cost ($g(n)$)** | $\Theta(1)$ | A single elementary move or print operation ($k = 0$). |

By the Master Theorem for subtractive recurrences, since $a = 2 > 1$, the solution is exponential:

$$
\mathbf{T(n) \in \Theta(a^{n/b}) = \Theta(2^n)}
$$

This exponential cost is **strictly minimal**. To move the base disk, the remaining $n-1$ disks must necessarily be placed on the auxiliary peg. Therefore, it is impossible to solve the problem in fewer than $2^n - 1$ moves.

---

## 2.7 Median Computation and Selection Algorithms

### The median and its statistical robustness

The **median** of a set of numbers is the central element that splits the sorted sample into two halves of equal size: there are as many elements less than or equal to it as there are greater than or equal to it.
* If the length $n$ is odd: the median is the exact central element.
* If $n$ is even: there are two central candidates; by formal convention, the smaller (or the larger) is chosen.

:::medianviz
:::

Unlike the arithmetic mean ($\bar{x} = \frac{1}{n}\sum x_i$), the median has two prominent properties:
1. **Guaranteed membership:** The median is always one of the actual values present in the original dataset.
2. **Robustness against outliers:** If we measure the execution times of a process and obtain the sequence $[1, 1, 1, 1, 1, 1, 1, 1, 1, 100]$, the mean is $10.9$ (a misleading value that does not reflect typical behavior), whereas the median is $1$, completely immune to the isolated anomaly.

<!-- ### The general selection problem

In algorithmics, computing the median is a special case of the **selection problem**:
$$\text{select}(S, k)$$
Given an array $S$ of $n$ elements and an integer $1 \le k \le n$, find the $k$-th smallest element of $S$.
* For the median: $k = \lfloor(n + 1) / 2\rfloor$.
* For the first quartile: $k = \lfloor(n + 1) / 4\rfloor$.
* For the absolute minimum: $k = 1$.
* For the absolute maximum: $k = n$.

#### The inefficiency of prior sorting:
The trivial approach consists of sorting the whole array with MergeSort or HeapSort in $\Theta(n \log n)$ time and accessing position $k - 1$. However, full sorting performs redundant work: we do not need elements to the left or right of the result to be sorted among themselves; we only need to place the correct element at the boundary.

---

### QuickSelect Algorithm (Hoare, 1962)

Tony Hoare adapted the partitioning mechanism of QuickSort to solve selection without sorting the whole array:

```cpp
int quickselect(vector<int>& A, int l, int r, int k) {
    if (l == r) return A[l];
    int q = partition(A, l, r); // Hoare or Lomuto partition
    int len_left = q - l + 1;    // Size of left subarray (elements <= pivot)
    
    if (k <= len_left) {
        return quickselect(A, l, q, k);
    } else {
        return quickselect(A, q + 1, r, k - len_left);
    }
}
```

Unlike QuickSort, which makes recursive calls on **both** sides of the partition ($2$ calls), QuickSelect immediately discards the half where the target element is guaranteed not to reside, making **only one recursive call**.

#### QuickSelect cost analysis:
* **Average case:** If the pivot produces a reasonably balanced partition, the size is roughly halved at each step:
  $$ T(n) = T(n/2) + \Theta(n) $$
  By the divide-and-conquer Master Theorem ($a = 1, b = 2, k = 1 \implies \alpha = \log_2 1 = 0 < k = 1$):
  $$ T_{\text{avg}}(n) \in \mathbf{\Theta(n)} $$
* **Worst case:** If the chosen pivot is always the minimum or maximum element and search proceeds into the larger part, the subarray is only reduced by 1 element:
  $$ T(n) = T(n - 1) + \Theta(n) $$
  By the subtractive Master Theorem ($a = 1, b = 1, k = 1 \implies \Theta(n^{k+1})$):
  $$ T_{\max}(n) \in \mathbf{\Theta(n^2)} $$ -->

---

### Median of Medians Algorithm (BFPRT, 1973)

In 1973, Manuel Blum, Robert Floyd, Vaughan Pratt, Ronald Rivest, and Robert Tarjan designed a deterministic method to choose a guaranteed pivot that ensures QuickSelect runs in **linear time $\Theta(n)$ in the worst case**.

:::bfprtviz
:::

### Description of the algorithm for blocks of size $q = 5$:
1. **Division into blocks:** The array $A$ of size $n$ is divided into $\lceil n/5 \rceil$ blocks of 5 elements (except possibly the last block, which may contain fewer).
2. **Median of each block:** The median of each block is computed. Since each block has a constant size ($q = 5$), finding the median of a block takes $\Theta(1)$ operations. For all $n/5$ blocks:
   $$ \text{Cost(block medians)} = \frac{n}{5} \cdot \Theta(1) = \Theta(n) $$
3. **Recursive pivot computation:** The selection algorithm itself is applied recursively to find the **median of the $n/5$ block medians** obtained in the previous step. This central value is called the **pseudomedian** or guaranteed pivot $p$.
   $$ \text{Cost(find pivot)} = T(n/5) $$
4. **Partition of original array:** Pivot $p$ is used to partition the original array of size $n$ into two halves using standard partitioning, with linear cost $\Theta(n)$.
5. **Final recursive call:** It determines which of the two subarrays contains the $k$-th element and makes a single recursive call into it.

---
<!-- 
### Formal proof of the pivot balancing bound

Let us determine how many elements are guaranteed to be smaller than (or larger than) pivot $p$:

1. Since $p$ is the median of the set of block medians, $p$ is strictly greater than or equal to at least half of the block medians:
   $$ \text{Number of medians } \le p \quad \ge \quad \frac{1}{2} \left(\frac{n}{q}\right) = \frac{n}{2q} $$
2. Each of these block medians is, by the definition of median within its block of size $q$, greater than or equal to half of the elements in that block:
   $$ \text{Elements per block } \le \text{block median} \quad \ge \quad \frac{q}{2} $$
3. Multiplying both bounds:
   $$ \text{Guaranteed elements } \le p \quad \ge \quad \left(\frac{1}{2} \cdot \frac{n}{q}\right) \times \left(\frac{q}{2}\right) = \mathbf{\frac{n}{4}} $$

> **Fundamental result:** The factor $q$ cancels out algebraically. Pivot $p$ carries the mathematical guarantee that **at least one quarter ($\frac{1}{4}n$) of the elements are $\le p$** and, by symmetry, **at least one quarter ($\frac{1}{4}n$) of the elements are $\ge p$**.

Consequently, in the worst possible scenario, the remaining subarray for the final recursive call will have at most:
$$ 
\text{Maximum size of remaining subarray} \le n - \frac{n}{4} = \mathbf{\frac{3n}{4}} 
$$

The algorithm completely eliminates the possibility of an extreme imbalance of size $n - 1$.

--- -->

### Global recurrence and the linearity condition

The worst-case time cost $C(n)$ encompasses three contributions:
1. Non-recursive work (computing medians of 5-element blocks and partitioning the full array): $\Theta(n)$.
2. Recursive call to determine the pivot among the $n/5$ medians: $C(n/5)$.
3. Final recursive call on the remaining subarray (maximum size $3n/4$): $C(3n/4)$.

$$ 
\mathbf{C(n) = C\left(\frac{n}{5}\right) + C\left(\frac{3n}{4}\right) + \Theta(n)} 
$$

This equation cannot be solved directly by the Master Theorem because the subproblem sizes are asymmetric ($n/5$ and $3n/4$). However, a recurrence of the family $T(n) = T(\alpha n) + T(\beta n) + \Theta(n)$ converges to a linear solution $\Theta(n)$ **if and only if the sum of the contraction coefficients is strictly less than 1**:

$$ 
\alpha + \beta < 1 \iff \frac{1}{q} + \frac{3}{4} < 1 
$$

Why choose blocks of size $q = 5$?

| Value of $q$ | Sum of fractions $\frac{1}{q} + \frac{3}{4}$ | Condition $< 1$ | Resulting asymptotic behavior |
| :---: | :---: | :---: | :--- |
| **$q = 3$** | $\frac{1}{3} + \frac{3}{4} = \frac{4 + 9}{12} = \mathbf{\frac{13}{12} \approx 1.083}$ | False ($> 1$) | **Non-linear.** Accumulated work grows at each level, resulting in superlinear cost $\omega(n)$. |
| **$q = 5$** | $\frac{1}{5} + \frac{3}{4} = 0.20 + 0.75 = \mathbf{0.95}$ | **True ($< 1$)** | **Strictly linear $\mathbf{\Theta(n)}$.** |
| **$q = 7$** | $\frac{1}{7} + \frac{3}{4} \approx 0.143 + 0.75 = \mathbf{0.893}$ | **True ($< 1$)** | Linear $\Theta(n)$, but increases the constant cost of sorting each 7-element block. |

For $q = 5$, at each recursive level the total number of elements to process shrinks by a factor of $0.95$ relative to the previous level ($n, 0.95n, (0.95)^2n, \dots$). The total work is a convergent geometric series:

$$ 
C(n) \le c \cdot n \sum_{i=0}^\infty (0.95)^i = c \cdot n \left(\frac{1}{1 - 0.95}\right) = 20 c \cdot n \in \mathbf{\Theta(n)} 
$$

Thanks to the median of medians strategy, **worst-case selection and median finding are solved in strictly linear time $\Theta(n)$**.

---

## 2.8 Topic 2 Complexity Synthesis

The complete spectrum of divide and conquer algorithms analyzed throughout this topic is summarized below:

| Algorithm | Computational problem | Recurrence equation $T(n)$ | Recurrence type and method | Time complexity | Additional space |
| :--- | :--- | :--- | :--- | :---: | :---: |
| **Binary search** | Search in sorted array | $T(n) = T(n/2) + \Theta(1)$ | Divide ($a=1, b=2, k=0 \implies \alpha = k$) | $\Theta(\log n)$ | $\Theta(1)$ |
| **Fast exponentiation** | Compute $x^n$ | $T(n) = T(n/2) + \Theta(1)$ | Divide ($a=1, b=2, k=0 \implies \alpha = k$) | $\Theta(\log n)$ | $\Theta(\log n)$ |
| **MergeSort** | Stable sorting | $T(n) = 2T(n/2) + \Theta(n)$ | Divide ($a=2, b=2, k=1 \implies \alpha = k$) | $\Theta(n \log n)$ | $\Theta(n)$ |
| **QuickSort (best/average case)** | *In-place* sorting | $T(n) = 2T(n/2) + \Theta(n)$ | Divide ($a=2, b=2, k=1 \implies \alpha = k$) | $\Theta(n \log n)$ | $\Theta(\log n)$ |
| **QuickSort (worst case)** | *In-place* sorting | $T(n) = T(n-1) + \Theta(n)$ | Subtractive ($a=1, b=1, k=1$) | $\Theta(n^2)$ | $\Theta(n)$ |
| **Grade-school multiplication** | Product of two $n$-bit integers | — | Iterative digit grid analysis | $\Theta(n^2)$ | $\Theta(n)$ |
| **Karatsuba** | Product of two $n$-bit integers | $T(n) = 3T(n/2) + \Theta(n)$ | Divide ($a=3, b=2, k=1 \implies \alpha > k$) | $\mathbf{\Theta(n^{\log_2 3}) \approx \Theta(n^{1.585})}$ | $\Theta(n)$ |
| **Standard matrices** | Product of $n \times n$ matrices | — | 3 nested loops | $\Theta(n^3)$ | $\Theta(n^2)$ |
| **Strassen** | Product of $n \times n$ matrices | $T(n) = 7T(n/2) + \Theta(n^2)$ | Divide ($a=7, b=2, k=2 \implies \alpha > k$) | $\mathbf{\Theta(n^{\log_2 7}) \approx \Theta(n^{2.807})}$ | $\Theta(n^2)$ |
| **Towers of Hanoi** | Transfer $n$ disks | $T(n) = 2T(n-1) + \Theta(1)$ | Subtractive ($a=2, b=1, k=0 \implies a > 1$) | $\mathbf{\Theta(2^n)}$ (exact: $2^n - 1$) | $\Theta(n)$ |
| **QuickSelect (average case)** | Select $k$-th element | $T(n) = T(n/2) + \Theta(n)$ | Divide ($a=1, b=2, k=1 \implies \alpha < k$) | $\Theta(n)$ | $\Theta(\log n)$ |
| **QuickSelect (worst case)** | Select $k$-th element | $T(n) = T(n-1) + \Theta(n)$ | Subtractive ($a=1, b=1, k=1$) | $\Theta(n^2)$ | $\Theta(n)$ |
| **Median of Medians (BFPRT)** | Select $k$-th (worst case) | $T(n) = T(n/5) + T(3n/4) + \Theta(n)$ | Asymmetric contraction ($1/5 + 3/4 = 0.95 < 1$) | $\mathbf{\Theta(n)}$ | $\Theta(\log n)$ |
