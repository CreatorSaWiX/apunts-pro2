---
title: "Topic 3: Eulerian and Hamiltonian Graphs"
description: "Paths and cycles and their associated theorems."
readTime: "15 Min"
order: 3
---

Eulerian and Hamiltonian graphs answer two classic problems: traversing all edges without repeating any (Eulerian) and traversing all vertices without repeating any (Hamiltonian).

## 1. Eulerian graphs: edge traversal

The goal is to traverse a graph passing through **all edges exactly once**.

*   **Eulerian trail**: A non-closed walk that passes through all the edges of a connected graph without repeating any.
*   **Eulerian circuit**: A closed walk (cycle) that passes through all the edges of a connected graph without repeating any.
*   **Eulerian graph**: A graph that contains an Eulerian circuit.

### Euler's Theorem
A connected graph is **Eulerian** if and only if **all its vertices have even degree**.

:::graph{height=200}
```json
{
  "nodes": [
    { "id": "A1", "label": "d=2", "color": "#3b82f6" },
    { "id": "A2", "label": "d=2", "color": "#3b82f6" },
    { "id": "B1", "label": "d=2", "color": "#ef4444" },
    { "id": "B2", "label": "d=2", "color": "#ef4444" }
  ],
  "links": [
    { "source": "A1", "target": "B1" }, { "source": "A1", "target": "B2" },
    { "source": "A2", "target": "B1" }, { "source": "A2", "target": "B2" }
  ]
}
```
:::

If it is a circuit, every time you arrive at a vertex via an edge, you need another edge to leave it. Therefore, the incident edges at each vertex must go in pairs (one in and one out).

### Corollary for Eulerian trails
A connected graph has an **Eulerian trail** (but not circuit) if and only if it has **exactly two vertices of odd degree**. 
In this case, the trail will obligatorily start at one of the odd degree vertices and end at the other.

:::::grid{cols=2 gap=4}

::::grid{cols=1}
:::graph{height=260}
{
  "nodes": [
    { "id": "A", "label": "Degree 2", "color": "#10b981" },
    { "id": "B", "label": "Degree 3", "color": "#ef4444" },
    { "id": "C", "label": "Degree 3", "color": "#ef4444" },
    { "id": "D", "label": "Degree 2", "color": "#10b981" }
  ],
  "links": [
    { "source": "A", "target": "B" }, { "source": "A", "target": "C" },
    { "source": "B", "target": "C" }, { "source": "B", "target": "D" },
    { "source": "C", "target": "D" }
  ]
}
:::
<div class="text-center text-sm mt-1 mb-4"><b class="text-rose-400">NOT Eulerian (has trail)</b><br/>Has exactly 2 nodes of odd degree (B and C).</div>
::::

::::grid{cols=1}
:::graph{height=260}
{
  "nodes": [
    { "id": "1", "label": "Degree 2", "color": "#10b981" }, { "id": "2", "label": "Degree 2", "color": "#10b981" },
    { "id": "3", "label": "Degree 2", "color": "#10b981" }, { "id": "4", "label": "Degree 2", "color": "#10b981" }
  ],
  "links": [
    { "source": "1", "target": "2" }, { "source": "2", "target": "3" },
    { "source": "3", "target": "4" }, { "source": "4", "target": "1" }
  ]
}
:::
<div class="text-center text-sm mt-1 mb-4"><b class="text-emerald-400">Eulerian Graph</b><br/>All nodes have even degree.</div>
::::

:::::

:::tip{title="Exam Trick: The Eulerian algebraic game"}
Typical exam: "For what values of $n$ is the complementary graph $T^c$ Eulerian?" The exam plays where you cannot see graphs, only dead letter equations.
If they ask this, quickly invoke the "Complementary Degree" from Topic 1:
$$g_{T^c}(v) = (n - 1) - g_T(v)$$
And here we apply pure Euler: **For $T^c$ to be Eulerian, the result of that equation EVERY TIME for ALL elements must obligatorily yield an EVEN value.**
:::

You can see how odd degrees are evaluated programmatically to decide if it is Eulerian or not in the following algorithm:

:::algoviz{algorithm="eulerian_check"}
:::

---

## 2. Hamiltonian graphs: vertex traversal

While Euler focused on the edges, Hamilton focuses on the **vertices**. The goal is to visit each vertex exactly once.

*   **Hamiltonian path**: A path that passes through **all the vertices** of the graph without repeating any.
*   **Hamiltonian cycle**: A cycle that passes through **all the vertices** of the graph exactly once (except the origin/destination vertex).
*   **Hamiltonian graph**: A graph that contains a Hamiltonian cycle.

Unfortunately, knowing if a general graph is Hamiltonian is an **NP-Complete** problem. There is no easy and infallible rule (like Euler's even degrees) to affirm or deny it at first glance. We rely on conditions and exploration with *backtracking*.

### 2.1 Necessary conditions (If not met, it CANNOT be Hamiltonian)

1. **Minimum degree $g_{min} \ge 2$**: In a cycle we must enter and leave each vertex by two different edges. If the graph has vertices of degree 1 (leaves), it is impossible for it to be Hamiltonian.
2. **Vertex elimination theorem**: If we eliminate a set of vertices $S$, the number of resulting connected components, $c(G-S)$, cannot exceed the number of eliminated vertices:
   $$c(G-S) \le |S|$$

:::tip{title="How to rule out Hamilton on the exam"}
The Elimination Theorem is your best weapon. If you find a single vertex that, when eliminated, leaves the graph split into 2 or more pieces (cut vertex), the graph **is not Hamiltonian** because $c(G-S) \ge 2$ but $|S|=1$.

**For graph families:**
- **Trees:** They are never Hamiltonian (they have leaves).
- **Complete bipartite ($K_{r,s}$):** They are only Hamiltonian if $r = s$.
- **Wheel ($W_n$):** It is always Hamiltonian (the outer cycle already gives us the path).
:::

### 2.2 Sufficient conditions (If met, it definitely IS)

These conditions guarantee the existence of a cycle if the graph has "many" edges:

- **Dirac's Theorem**: If all vertices have degree $g(v) \ge \frac{n}{2}$, the graph is **Hamiltonian**.
- **Ore's Theorem**: If for each pair of **non-adjacent** vertices $u, v$, the sum of their degrees is $g(u) + g(v) \ge n$, the graph is **Hamiltonian**.

### The exploration algorithm (backtracking)

To find a Hamiltonian path in general we need to thoroughly test routes hoping not to make mistakes and doing _backtracking_ when we reach a dead end:

:::algoviz{algorithm="hamiltonian_backtrack"}
:::
