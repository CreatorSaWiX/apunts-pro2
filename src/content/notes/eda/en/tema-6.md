---
title: "Topic 6: Exhaustive Search"
description: "Backtracking, generating subsets and permutations, derangements, n-queens, feasibility and bound pruning (Branch & Bound), and transformation to polynomial time."
readTime: "12 min"
order: 7
draft: false
---

## 6.1. Canonical Backtracking Schema

### Mechanics of the Partial Solution and the `idx` Pointer
When building solutions from left to right:
* `0 ... idx - 1`: **The past** (elements already decided and fixed in the partial solution).
* `idx`: **The present** (the specific slot currently being decided in this recursive call).
* `idx ... n - 1`: **The future** (slots remaining to be filled).
* **Base case (`idx == n`):** The future is empty $\implies$ complete solution found.

### The Choose – Explore – Un-choose Cycle
All backtracking algorithms share this core loop:

```cpp
void backtrack(State& s, int step) {
    if (is_complete_solution(s, step)) {
        process(s); // Base case: valid leaf reached
        return;
    }
    for (int c : valid_candidates(s, step)) {
        apply(s, c);               // 1. Choose
        backtrack(s, step + 1);    // 2. Explore
        undo(s, c);                // 3. Un-choose (BACKTRACK)
    }
}
```

:::backtrackviz
:::

**Why must we undo the state modification (`Un-choose`)?**
Because state structures are passed by reference (`&`) to avoid copying memory at each step ($\mathcal{O}(n)$), failing to revert changes upon returning from recursion leaves subsequent branches with polluted state.

### Signatures Depending on the Problem Objective

| Objective | Return | Base Case | Recursive Call |
| :--- | :---: | :---: | :--- |
| **Enumerate all** | `void` | Print / Store | Direct `backtrack(...)`. |
| **Stop at 1st solution** | `bool` | `return true;` | `if (backtrack(...)) return true;` (immediate propagation). |
| **Count solutions** | `int` | `return 1;` | Accumulator: `total += backtrack(...)`. |
| **Optimization ($\min/\max$)** | `void` | `best = min(best, curr_cost);` | Bound pruning before exploring. |

---

## 6.2. Generating Subsets ($2^n$)

Each element $e_i$ has two choices: **exclude it** ($s[i] = 0$) or **include it** ($s[i] = 1$).

```cpp
void subsets(vector<int>& s, int idx, int n) {
    if (idx == n) {
        process(s); // Size-n binary vector completed
        return;
    }
    s[idx] = 0; subsets(s, idx + 1, n); // Choice 0: discard
    s[idx] = 1; subsets(s, idx + 1, n); // Choice 1: include
}
```

:::subsetsviz
:::

**Canonical bijection (subsets $\longleftrightarrow$ bits):**
If a problem asks for subsets of objects (e.g., words or cities), **never create dynamic auxiliary copy vectors**. Work exclusively with the `0/1` bit vector of size $n$. At the leaf, print the elements where `s[i] == 1`.

### Pruning Subsets: Exactly $k$ Ones
The accumulated count of `ones` is passed down to avoid loops in the base case, pruning invalid branches before descending:

```cpp
void subsets_k(vector<int>& s, int idx, int n, int k, int ones) {
    // Prune 1: Too many ones | Prune 2: Insufficient space left (even taking all remaining won't reach k)
    if (ones > k || ones + (n - idx) < k) return;

    if (idx == n) { process(s); return; }

    s[idx] = 0; subsets_k(s, idx + 1, n, k, ones);
    s[idx] = 1; subsets_k(s, idx + 1, n, k, ones + 1);
}
```

:::subsetskviz
:::

---

## 6.3. Generating Permutations ($n!$) and Derangements

### 1. Canonical Permutations
At each position `idx`, we can choose any element $k \in \{1 \dots n\}$ not used previously. A boolean array `used` of size $n+1$ is maintained to check and mark in $\mathbf{\Theta(1)}$:

```cpp
void permutations(vector<int>& sol, int idx, int n, vector<bool>& used) {
    if (idx == n) { process(sol); return; }

    for (int k = 1; k <= n; ++k) {
        if (!used[k]) {
            sol[idx] = k;
            used[k] = true;                      // Choose
            permutations(sol, idx + 1, n, used); // Explore
            used[k] = false;                     // Un-choose
        }
    }
}
```

:::permutationsviz
:::

### 2. Derangements — 2024 Final Exam
A **derangement** of size $n$ is a permutation of $\{0 \dots n-1\}$ **with no fixed points** ($\pi(i) \neq i$ for all $i$):

**Feasibility filter:** Simply add the condition `k != idx` to the selection loop:

```cpp
for (int k = 0; k < n; ++k) {
    if (!used[k] && k != idx) { // Derangement condition: pi(idx) != idx
        sol[idx] = k;
        used[k] = true;
        derangements(sol, idx + 1, n, used);
        used[k] = false;
    }
}
```

:::derangementsviz
:::

---

## 6.4. Classic Final Exam Problems

### 1. The $n$-Queens Problem ($\Theta(1)$ Pruning)
Place $n$ queens on an $n \times n$ chessboard so that none attack each other (at most 1 per row, column, or diagonal).
* Representation: `t[i] = j` indicates a queen at row `i`, column `j`.
* **Diagonal lookup in $\Theta(1)$:**
  * Ascending diagonal (↗): Index sum is constant: $i + j \in [0, 2n - 2]$ $\implies$ `md1[i + j]`.
  * Descending diagonal (↘): Index difference is constant: $i - j + (n - 1) \in [0, 2n - 2]$ $\implies$ `md2[i - j + n - 1]`.

```cpp
int queens(int i, int n, vector<bool>& mc, vector<bool>& md1, vector<bool>& md2) {
    if (i == n) return 1; // n queens placed successfully
    int total = 0;
    for (int j = 0; j < n; ++j) {
        int d1 = i + j, d2 = i - j + n - 1;
        if (!mc[j] && !md1[d1] && !md2[d2]) {
            mc[j] = md1[d1] = md2[d2] = true;
            total += queens(i + 1, n, mc, md1, md2);
            mc[j] = md1[d1] = md2[d2] = false;
        }
    }
    return total;
}
```

:::nqueensviz
:::

### 2. 2D Grid Navigation (Sudoku and Boards)
To traverse matrices cell by cell using backtracking, move horizontally and wrap to the next row upon reaching the boundary:

```cpp
void backtrack_2d(vector<vector<int>>& M, int i, int j, int n) {
    if (i == n) { process(M); return; }                   // Base case: matrix filled
    if (j == n) { backtrack_2d(M, i + 1, 0, n); return; }   // Jump to start of next row

    for (int v : valid_candidates(M, i, j)) {
        M[i][j] = v;
        backtrack_2d(M, i, j + 1, n);
        M[i][j] = 0; // Reset cell
    }
}
```

:::backtrack2dviz
:::

### 3. Hamiltonian Cycle on a Graph
Find a cycle that visits every vertex exactly once and returns to the origin:

```cpp
bool hamilton(const vector<vector<int>>& G, int u, int visited_count, int n, vector<bool>& vis) {
    if (visited_count == n) {
        for (int v : G[u]) if (v == 0) return true; // Is there an edge back to origin?
        return false;
    }
    for (int v : G[u]) {
        if (!vis[v]) {
            vis[v] = true;
            if (hamilton(G, v, visited_count + 1, n, vis)) return true;
            vis[v] = false;
        }
    }
    return false;
}
```

:::hamiltonviz
:::

### 4. 0/1 Knapsack and Branch & Bound (Bound Pruning)
* **Prune 1 (Feasibility):** If `curr_weight + w[k] > C`, do not take item $k$.
* **Prune 2 (Optimistic bound):** Let `rem_val` be the sum of values of the remaining items ($k \dots n-1$). If `curr_val + rem_val <= best_val`, discard the entire branch:

```cpp
void knapsack(int k, int n, int C, int curr_weight, int curr_val, int rem_val, int& best_val) {
    if (curr_weight > C || curr_val + rem_val <= best_val) return; // Prune 1 and Prune 2
    if (k == n) { best_val = max(best_val, curr_val); return; }

    knapsack(k + 1, n, C, curr_weight, curr_val, rem_val - v[k], best_val);                 // Exclude k
    knapsack(k + 1, n, C, curr_weight + w[k], curr_val + v[k], rem_val - v[k], best_val);   // Include k
}
```

:::knapsackviz
:::

---

## 6.5. Backtracking vs Polynomial Solution

**2022 and 2026 Exams:**
Often a constrained ordering problem is presented (e.g., results of 3-player matches where $p_1$ comes before $p_2$ and $p_2$ before $p_3$) alongside code that tests all permutations in $\mathbf{\mathcal{O}(n! \cdot m)}$.

**Question:** *"Can it be solved in polynomial time?"*  **YES.**
* Build a **directed graph** where each constraint "$u$ must precede $v$" is a directed edge $u \to v$.
* The problem of finding a consistent ordering reduces to computing a **topological sort in linear time $\mathbf{\Theta(n + m)}$** using Kahn's algorithm.
* If the graph contains cycles, no compatible ordering exists.

### Summary

**Exhaustive search** systematically explores a problem's state space when no direct polynomial-time algorithm exists (common for **NP-complete** or constraint satisfaction problems). **Backtracking** constructs solutions step by step and **prunes** branches as soon as constraints are violated or the current optimum cannot be improved.

| Problem | Raw Space | Pruning / Filtering Condition | Worst-Case Time Cost |
| :--- | :---: | :--- | :---: |
| **Subsets / Bitstrings** | $2^n$ | Excess weight or insufficient remaining elements | $\Theta(2^n)$ |
| **Permutations of $\{1 \dots n\}$** | $n!$ | Already used elements (`used[k]` in $\Theta(1)$) | $\Theta(n! \cdot n)$ |
| **Derangements ($\pi(i) \neq i$)** | $n!$ | Used elements AND fixed-point checks ($k \neq i$) | $\Theta(n! / e)$ |
| **$N$-Queens ($n \times n$)** | $n^n$ | Column and diagonal marking in $\Theta(1)$ | $\mathcal{O}(c^n)$ ($c < n$) |
| **0/1 Knapsack / Inheritance** | $2^n$ | Capacity pruning + Optimistic upper bound | $\mathcal{O}(2^n)$ |
| **Hamiltonian Cycle / TSP** | $n!$ | Visited vertices + Cost bound $\ge \text{best}$ | $\mathcal{O}(n!)$ |


1. **Feasibility pruning vs bound pruning:** Feasibility pruning detects illegal solutions (e.g., weight $> C$ or queen conflicts). Bound pruning discards legal partial solutions that can never match or beat the best solution already recorded.
2. **Guaranteed lexicographical order:** Iterating over candidates in ascending order (`for (int k = 1; k <= n; ++k)`) guarantees that solutions are printed in lexicographical order automatically due to DFS depth-first traversal.
3. **Pure backtracking complexity:** Without effective pruning, generating subsets always costs $\Theta(n \cdot 2^n)$ and permutations $\Theta(n \cdot n!)$ due to the cost of copying or printing the solution at the leaves.
4. **When NOT to prune:** If the problem asks to generate *all* unconstrained permutations, every branch leads to a valid solution; any extra check only adds pointless overhead.
