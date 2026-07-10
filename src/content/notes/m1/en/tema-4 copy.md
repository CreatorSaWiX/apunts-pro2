---
title: "Topic 4: Trees and spanning trees"
description: "The star structure. Characterization and the Prüfer sequence."
readTime: "20 Min"
order: 4
---

A tree is computer science's preferred structure for representing hierarchies. Unlike an arbitrary graph where you can get stuck in a cycle (roundabout), trees purely expand without return routes.

## 1. Basic concepts

*   **Tree**: Any connected and acyclic graph.
*   **Forest**: Acyclic graph formed by one or more trees (independent connected components).
*   **Leaf**: Every vertex in a forest that has degree 1.

:::::grid{cols=2 gap=4}

::::grid{cols=1}
:::graph{height=260}
{
  "nodes": [
    { "id": "Root", "color": "#facc15" }, { "id": "A" }, { "id": "B" },
    { "id": "Leaf1", "color": "#10b981", "label": "Leaf" }, { "id": "C" },
    { "id": "Leaf2", "color": "#10b981", "label": "Leaf" },
    { "id": "Leaf3", "color": "#10b981", "label": "Leaf" }
  ],
  "links": [
    { "source": "Root", "target": "A" }, { "source": "Root", "target": "B" },
    { "source": "A", "target": "Leaf1" }, { "source": "A", "target": "C" },
    { "source": "C", "target": "Leaf2" }, { "source": "B", "target": "Leaf3" }
  ]
}
:::
<div class="text-center text-sm mt-1 mb-4"><b class="text-amber-400">Single tree</b><br/>Connected and acyclic. Leaves in green (degree 1).</div>
::::

::::grid{cols=1}
:::graph{height=260}
{
  "nodes": [
    { "id": "1", "group": 1 }, { "id": "2", "group": 1 }, { "id": "3", "group": 1 },
    { "id": "4", "group": 2 }, { "id": "5", "group": 2 }
  ],
  "links": [
    { "source": "1", "target": "2" }, { "source": "2", "target": "3" },
    { "source": "4", "target": "5" }
  ]
}
:::
<div class="text-center text-sm mt-1 mb-4"><b class="text-sky-400">Forest Example</b><br/>There are no cycles, but it has 2 separate connected components.</div>

::::

:::::

### Fundamental properties

If $T$ is a tree:
1.  **Minimum 2 leaves**: If $n \ge 2$, the tree has at least two leaves (vertices of degree 1).
2.  **Bridge edges**: All edges of a tree are bridges. If an edge is removed, the graph is no longer connected and splits into exactly 2 components.
3.  **Cut vertices**: Removing a vertex of degree $k$ divides the tree into exactly $k$ components.

:::note{title="Exam Structure: The Bistar"}
A **Bistar** is a tree that has **exactly two vertices that are not leaves**. 
*   Visually, they are two central vertices connected to each other, and each has a number of leaves hanging off.
*   **Diameter**: The diameter of a bistar is always $3$ (the longest distance is between two leaves on opposite sides).
:::

### Characterization theorems
A graph $G$ of order $n$ and size $m$ is a tree if it meets **two** of these three conditions:
1.  $G$ is connected.
2.  $G$ is acyclic.
3.  $m = n - 1$.

:::tip{title="Ex1-Midterm-2014"}
**Problem:** Prove that a graph of order $n$ and size $m$ is a tree if and only if it is acyclic and $m = n-1$.

<details>
<summary><b>See the proof</b></summary>

1. ($\implies$) If $G$ is a tree, then it is acyclic by definition. Let's prove that $m = n-1$ by induction on $n$:
    
    **Base case ($n=1$):** One node and 0 edges. $m = 0 = 1-1$. Correct.
   
   **Inductive step:** 
    * **I.H.:** Assume the formula $m=n-1$ is true for all trees with $n=k$ vertices.
    * **I.S.:** A tree of $n=k+1$ nodes has at least one leaf (vertex of degree 1). If we remove it along with its edge, we obtain a new tree of $n=k$ nodes. By the induction hypothesis, this has $m = k-1$ edges. Restoring the leaf and the original edge, we have $m = (k-1) + 1 = k = (k+1)-1$.

2. ($\impliedby$) If $G$ is acyclic and $m = n-1$, we must prove that it is connected (and thus a tree):
    * Suppose that $G$ has $k$ connected components $C_1, C_2, \dots, C_k$. Since the graph is acyclic, each component is also acyclic and, being connected, each $C_i$ is a tree.
    * For each component $C_i$, we know that $m_i = n_i - 1$.
    * Summing all edges: $m = \sum_{i=1}^k m_i = \sum_{i=1}^k (n_i - 1) = \sum n_i - \sum 1 = n - k$.
    * Since we are told that $m = n - 1$, then $n - k = n - 1 \implies \mathbf{k = 1}$.
    * Since there is only one component, the graph is connected and it is proved to be a tree.
</details>
:::

Other characterizations:
*   There exists a **unique path** between any pair of vertices.
*   It is acyclic, but if we add any new edge, exactly one cycle is created.

### Exam tip:
Most numerical problems are solved by combining the handshaking lemma with the property $m = n - 1$: $$ \sum_{v \in V} g(v) = 2n - 2 $$

:::tip{title="Leaf calculation example"}
**Problem:** A tree has 3 vertices of degrees 4, 3 and 2. The rest are leaves. How many leaves does it have?
**Solution:**
1.  Let $f$ be the number of leaves.
2.  Total order: $n = f + 3$ (the leaves + the 3 known vertices).
3.  Sum of degrees: $4 + 3 + 2 + (f \cdot 1) = 9 + f$.
4.  Apply the equation: $9 + f = 2(f + 3) - 2 \implies 9 + f = 2f + 4 \implies f = 5$.
:::

---

## 2. Spanning trees

A **spanning tree** of a graph $G$ is a subgraph that contains all the vertices of $G$ and is a tree.
*   **Existence**: A graph has a spanning tree if, and only if, it is **connected**.

### Construction algorithms
We can obtain spanning trees by traversing the graph in two main ways. Notice how the same graph (a wheel $W_4$) produces totally different results:

:::::grid{cols=2 gap=4}

::::grid{cols=1}
:::graph{height=200}
{
  "nodes": [
    { "id": "A", "label": "Root", "color": "#facc15" }, { "id": "B" }, { "id": "C" }, { "id": "D" }, { "id": "E" }
  ],
  "links": [
    { "source": "A", "target": "B", "color": "#f87171", "width": 3 }, 
    { "source": "B", "target": "C", "color": "#f87171", "width": 3 }, 
    { "source": "C", "target": "D", "color": "#f87171", "width": 3 }, 
    { "source": "D", "target": "E", "color": "#f87171", "width": 3 }
  ]
}
:::
<div class="text-center text-sm"><strong>DFS (Depth)</strong><br/>Generates long and deep paths.</div>
::::

::::grid{cols=1}
:::graph{height=200}
{
  "nodes": [
    { "id": "A", "label": "Root", "color": "#facc15" }, { "id": "B" }, { "id": "C" }, { "id": "D" }, { "id": "E" }
  ],
  "links": [
    { "source": "A", "target": "B", "color": "#60a5fa", "width": 3 }, 
    { "source": "A", "target": "C", "color": "#60a5fa", "width": 3 }, 
    { "source": "A", "target": "D", "color": "#60a5fa", "width": 3 }, 
    { "source": "A", "target": "E", "color": "#60a5fa", "width": 3 }
  ]
}
:::
<div class="text-center text-sm"><strong>BFS (Breadth)</strong><br/>Generates "chubby" structures (stars).</div>
::::

:::::

:::tip{title="Note on Isomorphisms"}
As we see in the drawing above, the same graph can generate **non-isomorphic** spanning trees. In the wheel $W_4$, the BFS from the center generates a star ($K_{1,4}$), while the DFS generates a path ($P_5$).
:::

---

## 3. Enumeration and Prüfer sequence

**How many different trees can we form with $n$ labeled vertices?**
*   **Cayley's Theorem**: There are exactly $n^{n-2}$ different trees.

### Prüfer sequence
It is a bijection that allows encoding a labeled tree of $n$ vertices into a sequence of length $n-2$.

**Encoding algorithm:**
1.  Find the leaf with the smallest label.
2.  Write down its neighbor in the sequence.
3.  Remove the leaf.
4.  Repeat until only 2 vertices remain.

::videoviz{url="/m1/prufer_build.webm" delay="2000"}

:::tip{title="Degree-Sequence Relationship"}
This is the key for exams:
$$ \text{Degree of } v = (\text{times } v \text{ appears in the sequence}) + 1 $$
*   The **leaves** are the vertices that **never appear** in the sequence.
*   If a vertex appears $k$ times, its degree is $k+1$.
:::

**Decoding algorithm:** Allows recovering the tree from the sequence.

::videoviz{url="/m1/prufer_rebuild.webm" delay="2000"}
