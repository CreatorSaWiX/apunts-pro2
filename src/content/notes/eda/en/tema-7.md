---
title: "Topic 7: Complexity"
description: "Decision problems and input size, complexity classes P, NP, and EXP, polynomial reductions, NP-completeness theory (Cook-Levin), and classic NP-complete problems."
readTime: "12 min"
order: 8
draft: false
---

Complexity theory classifies **problems** (not specific algorithms) according to whether they admit an efficient solution or whether, as far as we know, they require exhaustive search.

---

## 7.1. Decision Problems and Input Size

A **decision problem** only has two possible answers: **YES (`1`)** or **NO (`0`)**. Formally, over a set of valid inputs $E$, it is identified with the set of **positive inputs**:

$$
A = \{ x \in E \mid x \text{ satisfies the property} \} \qquad (\text{negatives: } E \setminus A)
$$

Optimization or search problems are converted into decision problems by adding a **bound**:

| Original Problem | Decision Version |
| :--- | :--- |
| **Shortest path** | Does a path from $u$ to $v$ of length $\le k$ exist? |
| **0/1 Knapsack** | Does a selection of items with weight $\le C$ and value $\ge V$ exist? |
| **Traveling Salesperson** | Does a cycle visiting all $n$ cities with total cost $\le k$ exist? |

> **Why is the decision version enough?** If we can quickly decide existence under partial constraints (such as in *$n$-queens* by fixing the first $k$ rows $r_1, \dots, r_k$), we can reconstruct a solution using a polynomial number of queries.

### Size Function $|x|$
Complexity is always measured with respect to $|x|$: the **number of bits or symbols** required to encode the input $x$. For a natural integer $x \ge 1$ in binary:

$$
|x| = \lfloor \log_2 x \rfloor + 1
$$

> **Watch out for pseudopolynomial algorithms:** Checking all divisors of $x$ from $2$ to $x - 1$ performs $\Theta(x)$ operations, but since $|x| \approx \log_2 x$, the actual cost as a function of the input size is $\Theta(2^{|x|})$ (**exponential**).

---

## 7.2. Complexity Classes: $\text{P}$, $\text{NP}$, and $\text{EXP}$

A problem $A$ belongs to $\text{TIME}(t)$ if there exists a deterministic algorithm that decides it in $\mathcal{O}(t(|x|))$ worst-case time.

| Class | Formal Definition | Intuition | Examples |
| :--- | :--- | :--- | :--- |
| **$\text{P}$** | $\bigcup_{k > 0} \text{TIME}(n^k)$ | **Find** the solution in polynomial time (**tractable**). | `CONNECTIVITY`, `SHORTEST PATH`, `PRIMALITY`, `2-COLOR`. |
| **$\text{NP}$** | **Nondeterministic** polynomial time | **Verify** a witness in polynomial time. | `COMPOSITES`, `3-COLOR`, `CNF-SAT`, `TSP`. |
| **$\text{EXP}$** | $\bigcup_{k > 0} \text{TIME}(2^{n^k})$ | Solvable in exponential time (**intractable** if $\notin \text{P}$). | `BOUNDED HALT` ($\in \text{EXP} \setminus \text{P}$). |

### Two Equivalent Definitions of $\text{NP}$

1. **Via nondeterminism (`CHOOSE(x)`):** a polynomial-time algorithm that can branch by choosing a value in parallel; it returns `1` if **any** branch returns `1`.
2. **Via witness and verifier:** there exists a polynomial $p(n)$ and a deterministic polynomial-time **verifier** algorithm $V(x, y)$ such that, for every input $x \in E$:

$$
x \in A \iff \exists y \quad \bigl(|y| \le p(|x|) \land V(x, y) = 1\bigr)
$$

* **Example (`COMPOSITES`):** for $x = 27$, the witness is $y = 3$ ($|y| \le |x|$); the verifier simply checks $1 < y < x$ and $x \bmod y = 0$ in polynomial time.
* **Example (`3-COLOR`):** given a graph $G$, the witness is a color vector $(c_1, \dots, c_n) \in \{0, 1, 2\}^n$; the verifier checks all edges in polynomial time.

### Known Hierarchy and the $\text{P} \stackrel{?}{=} \text{NP}$ Problem

$$
\text{P} \subseteq \text{NP} \subseteq \text{EXP} \qquad\text{and it is known that}\qquad \text{P} \subsetneq \text{EXP}
$$

* **$\text{P} \subseteq \text{NP}$:** if we already know how to decide $x \in A$ in polynomial time, the verifier simply runs that algorithm while ignoring the witness $y$.
* **$\text{NP} \subseteq \text{EXP}$:** for any problem in $\text{NP}$, we can try all possible witnesses $y$ with $|y| \le p(|x|)$ ($2^{\mathcal{O}(p(|x|))}$ candidates) and evaluate $V(x, y)$.

Since $\text{P} \neq \text{EXP}$, there are three possible scenarios ($\text{P} \neq \text{NP} \neq \text{EXP}$, $\text{P} \neq \text{NP} = \text{EXP}$, or $\text{P} = \text{NP} \neq \text{EXP}$). **It is not known whether $\text{P} = \text{NP}$**, but the standard working hypothesis is that **$\text{P} \neq \text{NP}$**.

---

## 7.3. Polynomial Reductions ($\le_p$)

Let $A$ and $B$ be two decision problems over domains $E$ and $E'$. We say that **$A$ is polynomially reducible to $B$** ($A \le_p B$) if there exists a deterministic polynomial-time algorithm $\mathcal{F} : E \to E'$ (where $|\mathcal{F}(x)|$ is polynomial in $|x|$) such that:

$$
x \in A \iff \mathcal{F}(x) \in B
$$

> **Intuition:** If $A \le_p B$, any algorithm for $B$ can be used to solve $A$ (by first transforming $x$ into $\mathcal{F}(x)$). Therefore, **$B$ is at least as hard as $A$**.

### Fundamental Properties

| Property | Statement | Usefulness |
| :--- | :--- | :--- |
| **Reflexivity** | $A \le_p A$ | Identity function $\mathcal{F}(x) = x$. |
| **Transitivity** | $A \le_p B \land B \le_p C \implies A \le_p C$ | Allows chaining reductions ($\mathcal{G} \circ \mathcal{F}$). |
| **Closure of $\text{P}$** | $A \le_p B \land B \in \text{P} \implies A \in \text{P}$ | If we solve $B$ fast, we also solve $A$ fast. (Contrapositive: if $A \notin \text{P}$, then $B \notin \text{P}$). |

### Example: `KNAPSACK` $\le_p$ `0-1 LINEAR INEQUALITIES`
Given an instance of `KNAPSACK` ($C$, $V$, weights $p_1 \dots p_n$, values $v_1 \dots v_n$), we want to translate it into the problem of deciding whether there exists $x \in \{0, 1\}^n$ such that $Ax \ge b$.

Taking $x_i = 1$ as *"I take item $i$"*, we generate in linear time the two inequalities:

$$
\sum_{i=1}^n (-p_i)x_i \ge -C \qquad \land \qquad \sum_{i=1}^n v_i x_i \ge V
$$

A valid selection of items for the knapsack exists $\iff$ the generated system has a binary solution $x \in \{0, 1\}^n$.

---

## 7.4. $\text{NP}$-Completeness Theory

* **$\text{NP}$-hard:** a problem $A$ is $\text{NP}$-hard if $\forall B \in \text{NP},\ B \le_p A$ (at least as hard as *any* problem in $\text{NP}$; $A$ does not need to be in $\text{NP}$).
* **$\text{NP}$-complete ($\text{NP-C}$):** a problem $A$ is $\text{NP}$-complete if **$A \in \text{NP}$** and **$A$ is $\text{NP}$-hard** (the hardest problems in $\text{NP}$).

**Key Proposition:** If $A$ is $\text{NP}$-complete, then:

$$
\text{P} = \text{NP} \iff A \in \text{P}
$$

That is, if a polynomial-time algorithm were found for **a single** $\text{NP}$-complete problem, every problem in $\text{NP}$ would automatically be in $\text{P}$.

### Recipe to Prove That $B$ is $\text{NP}$-Complete
1. **$B \in \text{NP}$:** state what the witness $y$ is, verify that $|y|$ is polynomial in $|x|$, and describe a polynomial-time verifier $V(x, y)$.
2. **$B$ is $\text{NP}$-hard:** choose a known problem $A \in \text{NP-C}$ and give a polynomial reduction **$A \le_p B$** (verifying that $\mathcal{F}$ runs in polynomial time and that $x \in A \iff \mathcal{F}(x) \in B$).

> **Watch the direction:** To prove that $B$ is $\text{NP}$-complete, you must reduce **from a known $\text{NP-C}$ problem to $B$** ($A_{\text{NP-C}} \le_p B$). Reducing $B \le_p A_{\text{NP-C}}$ only proves that $B$ is no harder than $A$, not that it is $\text{NP}$-hard.

### Cook-Levin Theorem (1971)
A Boolean formula is in **Conjunctive Normal Form (CNF)** if it is a conjunction ($\land$) of clauses, and each clause is a disjunction ($\lor$) of literals ($x$ or $\neg x$). Example: $(x \lor \neg y \lor z) \land (\neg x \lor \neg z)$.

* **`SAT`** (general Boolean satisfiability) and **`CNF-SAT`** (in CNF form) are **$\text{NP}$-complete**.
* **Proof idea:** it belongs to $\text{NP}$ because the witness is the Boolean assignment $\alpha$ of $n \le |F|$ bits, verifiable by evaluating the connectives in polynomial time; it is $\text{NP}$-hard because any polynomial verifier $V(x, y)$ can be simulated with a logic circuit (and translated into a polynomial-size CNF formula) that is satisfiable $\iff \exists y\ V(x,y)=1$.

---

## 7.5. Canonical Problems and the $\text{P}$ vs $\text{NP-C}$ Boundary

| Problem | Decision Question | Witness ($\in \text{NP}$) | Class |
| :--- | :--- | :--- | :---: |
| **`1-SAT`** | CNF formula with $1$ literal per clause: is it satisfiable? | Boolean assignment | **$\text{P}$** |
| **`2-SAT`** | CNF formula with $\le 2$ literals per clause: is it satisfiable? | Boolean assignment | **$\text{P}$** |
| **`3-SAT`** | CNF formula with $\le 3$ literals per clause: is it satisfiable? | Boolean assignment | **$\text{NP-C}$** |
| **`CLIQUE`** | Does graph $G$ have a complete subgraph of $k$ vertices? | Set of $k$ vertices ($C \subseteq V$) | **$\text{NP-C}$** |
| **`IS`** | Does graph $G$ have $k$ pairwise non-adjacent vertices (independent set)? | Set of $k$ vertices ($H \subseteq V$) | **$\text{NP-C}$** |
| **`VC`** | Does graph $G$ have $k$ vertices touching all edges (vertex cover)? | Set of $k$ vertices ($R \subseteq V$) | **$\text{NP-C}$** |
| **`k-COLOR`** ($k \le 2$) | Can $G$ be colored with $\le k$ colors with no adjacent equal colors? | Color assignment | **$\text{P}$** |
| **`k-COLOR`** ($k \ge 3$) | Can $G$ be colored with $\le k$ colors with no adjacent equal colors? | Color assignment | **$\text{NP-C}$** |

### Why `1-SAT` and `2-SAT` are in $\text{P}$, while `3-SAT` is $\text{NP-C}$
* **`1-SAT` $\in \text{P}$:** it suffices to check in linear time that no literal $x$ and its negation $\neg x$ appear simultaneously.
* **`2-SAT` $\in \text{P}$:** we rewrite each clause as implications using $(a \lor b) \equiv (\neg a \implies b) \land (\neg b \implies a)$ and $(a) \equiv (\neg a \implies a)$, forming a directed graph over the literals. The formula is unsatisfiable $\iff$ there exists some variable $x$ with a path from $x$ to $\neg x$ **and** from $\neg x$ to $x$ (checkable in polynomial time).
* **`CNF-SAT` $\le_p$ `3-SAT`:** for every clause $(a_1 \lor a_2 \lor \dots \lor a_k)$ with $k > 3$, we introduce new variables $z_2, \dots, z_{k-2}$ to split it into an equisatisfiable chain of size-$3$ clauses:

$$
(a_1 \lor a_2 \lor z_2) \land (\neg z_2 \lor a_3 \lor z_3) \land \dots \land (\neg z_{k-2} \lor a_{k-1} \lor a_k)
$$

### Graph Reductions: `CLIQUE`, `IS`, and `VC`
* **`CNF-SAT` $\le_p$ `CLIQUE`:** for a formula with $m$ clauses $C_1, \dots, C_m$, we create a vertex $(l_i, j)$ for each occurrence of a literal $l_i$ inside $C_j$, and add an edge between $(l_i, j)$ and $(l_k, j')$ if and only if they belong to different clauses ($j \neq j'$) and are compatible ($\neg l_i \neq l_k$). Then $F \in \text{CNF-SAT} \iff (G, m) \in \text{CLIQUE}$.
* **`CLIQUE` $\le_p$ `IS`:** given $(G, k)$, we build the complement graph $\overline{G}$ (same vertices, inverted edges). A complete subgraph of size $k$ in $G$ is an independent subset of size $k$ in $\overline{G}$.
* **`IS` $\le_p$ `VC`:** given $(G, k)$ with $n = |V|$, we return $(G, n - k)$. A set $H \subseteq V$ of size $k$ has no internal edges $\iff$ its complement $V \setminus H$ of size $n - k$ contains at least one endpoint of every edge in $G$.

### Coloring Reductions: `k-COLOR`
* **`k-COLOR` ($k \le 2$) $\in \text{P}$:** `1-COLOR` only accepts edgeless graphs; `2-COLOR` checks whether $G$ is bipartite via BFS/DFS in $\Theta(n + m)$.
* **`CNF-SAT` $\le_p$ `3-COLOR`:** we construct a base triangle with 3 vertices $(V, G, B)$ that fix 3 roles (*false*, *true*, *base*). Each variable $x$ and $\neg x$ are connected to each other and to $B$ (forcing one to *true* and the other to *false*), and for each clause we attach a subgraph that is 3-colorable only if at least one of its literals has color *true*.
* **`3-COLOR` $\le_p$ `k-COLOR` ($k > 3$):** given $G$, we add a complete subgraph $K_{k-3}$ and connect all its vertices to every vertex of $G$. The $k-3$ new vertices consume $k-3$ distinct colors and leave exactly $3$ colors free for $G$.

### Summary Tree of Reductions

```text
CNF-SAT
 ├──► 3-SAT
 ├──► CLIQUE ──► IS ──► VC
 └──► 3-COLOR ──► k-COLOR (k > 3)
```

> **Special cases in $\text{P}$:** The fact that a general problem is $\text{NP}$-complete does not prevent restricted versions from being polynomial (such as going from `3-SAT` to `2-SAT`, or from `3-COLOR` to `2-COLOR`).
