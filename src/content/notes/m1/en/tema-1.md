---
title: "Topic 1: Basic concepts of graphs"
description: "Introduction to graph theory: vertices, edges, degrees, and representations."
readTime: "15 Min"
order: 1
---

Welcome to the world of **Graphs**! 🕸️

In FM, we might be used to heavy notations. Here things change. Graph Theory is **visual**, it's **tangible**, and it's the foundation of everything: from how Instagram suggests friends to how Google Maps finds the fastest way home.

## 1. What really is a graph?

A graph is simply a set of **points** connected by **lines**.

*   The points are called **vertices** ($V$).
*   The lines are called **edges** ($A$).

Try moving the vertices below. See how the connections are maintained even if you move them? That's the essence of a graph: it doesn't matter *where* the points are drawn, but *how* they are connected.

:::graph
```json
{
  "nodes": [
    { "id": "A", "label": "You" },
    { "id": "B", "label": "Friend 1" },
    { "id": "C", "label": "Friend 2" },
    { "id": "D", "label": "Acquaintance" }
  ],
  "links": [
    { "source": "A", "target": "B" },
    { "source": "A", "target": "C" },
    { "source": "B", "target": "C" },
    { "source": "C", "target": "D" }
  ]
}
```
:::

A graph $G$ is a pair $(V, A)$ where $V$ is the set of vertices (non-empty) and $A$ is the set of edges.

- **Order ($n$)**: The number of vertices, $n = |V|$.
- **Size ($m$)**: The number of edges, $m = |A|$.

## 2. Relationships: neighbors and incidence

When two vertices are joined by an edge, we say they are **adjacent** (or neighbors). 

*   If $u$ and $v$ are connected, we write: $u \sim v$
*   The edge that joins them is said to be **incident** to them.

:::graph
```json
{
  "nodes": [
    { "id": 1, "label": "u", "color": "#ef4444" },
    { "id": 2, "label": "v", "color": "#3b82f6" },
    { "id": 3, "label": "Not adjacent", "color": "#9ca3af" }
  ],
  "links": [
    { "source": 1, "target": 2, "label": "u ~ v" }
  ]
}
```
:::

In the graph above, $u$ and $v$ are adjacent. The gray vertex is alone and not adjacent to anyone.

## 3. How does the computer see it?

We have two main ways to store a graph in memory:

### A. Adjacency list
For each person, we have a list of their friends. Ideal for graphs with few edges as it saves memory. **Example**: "User u is friends with [v, w, z]".

### B. Adjacency matrix
An ($n \times n$) table of 0s and 1s. If the matrix has a $1$ at position $(i, j)$, vertex $i$ is connected to $j$. 

$$
M_A = \begin{pmatrix}
0 & \mathbf{1} & 0 \\
\mathbf{1} & 0 & 1 \\
0 & 1 & 0
\end{pmatrix}
$$

*   $1$ if there is an edge (connection).
*   $0$ if there is not.

We see that since friendships are mutual, the matrix is **symmetric**. And the diagonal is all zeros, because no one is a friend of themselves (there are no loops).

:::tip{title="Degrees in the Matrix"}
The numerical sum of the values in a row $i$ (or column) is **exactly the degree** of that vertex.
$$ \sum_{j=1}^n (M_A)_{ij} = g(v_i) $$
*If on an exam they tell you: "We have an adjacency matrix where each row sums to 5", they are telling you that we are dealing with a **5-regular** graph.*
:::

## 4. Degrees and the "handshaking lemma"

The **degree** of a vertex $g(v)$ is the number of edges touching it. That is, the number of friends it has.

:::graph
```json
{
  "nodes": [
    { "id": "A", "label": "Degree 3" },
    { "id": "B", "label": "Degree 1" },
    { "id": "C", "label": "Degree 1" },
    { "id": "D", "label": "Degree 1" }
  ],
  "links": [
    { "source": "A", "target": "B" },
    { "source": "A", "target": "C" },
    { "source": "A", "target": "D" }
  ]
}
```
:::

In the graph above, the central vertex has degree 3. The others have degree 1.

**If we sum the degrees of ALL vertices, what do we get?**

Imagine a party. Every time two people shake hands (an edge), there are **two** hands involved. If at the end we count how many hands each person has given and sum it all up, we will be counting **double** the actual handshakes. This is the **handshaking lemma**:

$$
\sum g(v) = 2m
$$

> **Degree sequence**:
> It's simply making a list of the degrees of all vertices, usually ordered from largest to smallest.
> Ex: A "triangle with a hanging tail" graph has the degree list $S = (3, 2, 2, 1)$.

Since $2|A|$ is always an EVEN number, the sum of the degrees must be even. This means it's **impossible** for there to be an odd number of people with an odd number of friends.

:::tip{title="Havel-Hakimi: Checking the degree sequence"}
The Handshaking Lemma is necessary (even sum), but not sufficient to guarantee that a graph exists. To know if a sequence is **graphical**, we use the **Havel-Hakimi** algorithm:

1.  **Sort** the sequence from largest to smallest.
2.  **Remove** the first element ($d_1$).
3.  **Subtract 1** from the next $d_1$ elements.
4.  **If a negative appears**, the sequence is NOT graphical.
5.  **Repeat** until only zeros remain ($\exists$) or you fail ($\nexists$).

**Example: S = (3, 3, 2, 2, 1, 1)**
*   Remove the **3**: Subtract 1 from the next 3 $\to$ (3-1, 2-1, 2-1, 1, 1) = **(2, 1, 1, 1, 1)**
*   Remove the **2**: Subtract 1 from the next 2 $\to$ (1-1, 1-1, 1, 1) = **(0, 0, 1, 1)**
*   Sort $\to$ **(1, 1, 0, 0)**
*   Remove the **1**: Subtract 1 from the next $\to$ (1-1, 0, 0) = **(0, 0, 0)** $\to$ **It IS graphical!**
:::

## 5. Isomorphism

Two graphs are **isomorphic** if they have the same internal structure, even if they have different labels or are drawn differently. In these two graphs, the one on the right is a cycle (a pentagon) and the left one is a star.

::::grid{cols=2}
:::graph{height=220}
```json
{
  "nodes": [ { "id": 1 }, { "id": 2 }, { "id": 3 }, { "id": 4 }, { "id": 5 } ],
  "links": [
    { "source": 1, "target": 2 }, { "source": 2, "target": 3 },
    { "source": 3, "target": 4 }, { "source": 4, "target": 5 },
    { "source": 5, "target": 1 }
  ]
}
```
:::

:::graph{height=220}
```json
{
  "nodes": [ { "id": "A" }, { "id": "B" }, { "id": "C" }, { "id": "D" }, { "id": "E" } ],
  "links": [
    { "source": "A", "target": "C" }, { "source": "C", "target": "E" },
    { "source": "E", "target": "B" }, { "source": "B", "target": "D" },
    { "source": "D", "target": "A" }
  ]
}
```
:::
::::

**Are they the same graph?** The answer is **yes**. They are isomorphic. Because we can find a **translation dictionary** (a bijection) that converts one into the other without breaking any connections.

**The dictionary**:
*   $1 \to A$
*   $2 \to C$
*   $3 \to E$
*   $4 \to B$
*   $5 \to D$

Let's check: in the first graph **1** touches **2**. In the second, does the translation of 1 (**A**) touch the translation of 2 (**C**)? Yes. And so on with all of them.

An isomorphism is simply **relabeling** the vertices. If by changing the names of the vertices of a graph I can get exactly the other, they are isomorphic. It doesn't matter how I draw it (the visual shape is deceiving), what matters is who is connected to whom.

## 6. Types of graphs

Below are detailed the fundamental graphs that are used continuously and must be mastered for theoretical problems:

::::::grid{cols=5 class="gap-3 mb-8"}

:::::grid{cols=1 class="border border-slate-700/50 rounded-xl p-2 bg-slate-900/20 text-center"}
#### Null ($N_n$)

:::graph{height=130 transparentBg=true}
```json
{ "nodes": [ { "id": 1, "color":"#525252" }, { "id": 2, "color":"#525252" }, { "id": 3, "color":"#525252" } ], "links": [] }
```
:::
:::::

:::::grid{cols=1 class="border border-slate-700/50 rounded-xl p-2 bg-slate-900/20 text-center"}
#### Path ($T_n$)

:::graph{height=130 transparentBg=true}
```json
{ "nodes": [ { "id": 1, "color":"#3b82f6" }, { "id": 2, "color":"#3b82f6" }, { "id": 3, "color":"#3b82f6" }, { "id": 4, "color":"#3b82f6" } ], "links": [ { "source": 1, "target": 2 }, { "source": 2, "target": 3 }, { "source": 3, "target": 4 } ] }
```
:::
:::::

:::::grid{cols=1 class="border border-slate-700/50 rounded-xl p-2 bg-slate-900/20 text-center"}
#### Cycle ($C_5$)

:::graph{height=130 transparentBg=true}
```json
{ "nodes": [ { "id": 1, "color":"#3b82f6" }, { "id": 2, "color":"#3b82f6" }, { "id": 3, "color":"#3b82f6" }, { "id": 4, "color":"#3b82f6" }, { "id": 5, "color":"#3b82f6" } ], "links": [ { "source": 1, "target": 2 }, { "source": 2, "target": 3 }, { "source": 3, "target": 4 }, { "source": 4, "target": 5 }, { "source": 5, "target": 1 } ] }
```
:::
:::::

:::::grid{cols=1 class="border border-slate-700/50 rounded-xl p-2 bg-slate-900/20 text-center"}
#### Complete ($K_5$)

:::graph{height=130 transparentBg=true}
```json
{ "nodes": [ { "id": 1, "color":"#a855f7" }, { "id": 2, "color":"#a855f7" }, { "id": 3, "color":"#a855f7" }, { "id": 4, "color":"#a855f7" }, { "id": 5, "color":"#a855f7" } ], "links": [ { "source": 1, "target": 2 }, { "source": 1, "target": 3 }, { "source": 1, "target": 4 }, { "source": 1, "target": 5 }, { "source": 2, "target": 3 }, { "source": 2, "target": 4 }, { "source": 2, "target": 5 }, { "source": 3, "target": 4 }, { "source": 3, "target": 5 }, { "source": 4, "target": 5 } ] }
```
:::
:::::

:::::grid{cols=1 class="border border-slate-700/50 rounded-xl p-2 bg-slate-900/20 text-center"}
#### $r$-Regular

:::graph{height=130 transparentBg=true}
```json
{ "nodes": [ { "id": 1, "color":"#ec4899" }, { "id": 2, "color":"#ec4899" }, { "id": 3, "color":"#ec4899" }, { "id": 4, "color":"#ec4899" } ], "links": [ { "source": 1, "target": 2 }, { "source": 2, "target": 3 }, { "source": 3, "target": 4 }, { "source": 4, "target": 1 }, { "source": 1, "target": 3 }, { "source": 2, "target": 4 } ] }
```
:::
:::::

:::::grid{cols=1 class="border border-slate-700/50 rounded-xl p-2 bg-slate-900/20 text-center"}
#### Bipartite

:::graph{height=130 transparentBg=true}
```json
{ "nodes": [ { "id": "A1", "color": "#ef4444" }, { "id": "A2", "color": "#ef4444" }, { "id": "B1", "color": "#10b981" }, { "id": "B2", "color": "#10b981" } ], "links": [ { "source": "A1", "target": "B1" }, { "source": "A2", "target": "B2" }, { "source": "A1", "target": "B2" } ] }
```
:::
:::::

:::::grid{cols=1 class="border border-slate-700/50 rounded-xl p-2 bg-slate-900/20 text-center"}
#### Bip. comp. ($K_{3,2}$)

:::graph{height=130 transparentBg=true}
```json
{ "nodes": [ { "id": "A1", "color": "#ef4444" }, { "id": "A2", "color": "#ef4444" }, { "id": "B1", "color": "#10b981" }, { "id": "B2", "color": "#10b981" }, { "id": "B3", "color": "#10b981" } ], "links": [ { "source": "A1", "target": "B1" }, { "source": "A1", "target": "B2" }, { "source": "A1", "target": "B3" }, { "source": "A2", "target": "B1" }, { "source": "A2", "target": "B2" }, { "source": "A2", "target": "B3" } ] }
```
:::
:::::

:::::grid{cols=1 class="border border-slate-700/50 rounded-xl p-2 bg-slate-900/20 text-center"}
#### $r$-Partite

:::graph{height=130 transparentBg=true}
```json
{ "nodes": [ { "id": "A1", "color": "#ef4444" }, { "id": "A2", "color": "#ef4444" }, { "id": "B1", "color": "#10b981" }, { "id": "B2", "color": "#10b981" }, { "id": "C1", "color": "#3b82f6" }, { "id": "C2", "color": "#3b82f6" } ], "links": [ { "source": "A1", "target": "B1" }, { "source": "A1", "target": "B2" }, { "source": "A1", "target": "C1" }, { "source": "A1", "target": "C2" }, { "source": "A2", "target": "B1" }, { "source": "A2", "target": "B2" }, { "source": "A2", "target": "C1" }, { "source": "A2", "target": "C2" }, { "source": "B1", "target": "C1" }, { "source": "B1", "target": "C2" }, { "source": "B2", "target": "C1" }, { "source": "B2", "target": "C2" } ] }
```
:::
:::::

:::::grid{cols=1 class="border border-slate-700/50 rounded-xl p-2 bg-slate-900/20 text-center"}
#### Star ($S_n$)

:::graph{height=130 transparentBg=true}
```json
{ "nodes": [ { "id": "C", "color": "#facc15" }, { "id": "1", "color": "#3b82f6" }, { "id": "2", "color": "#3b82f6" }, { "id": "3", "color": "#3b82f6" } ], "links": [ { "source": "C", "target": "1" }, { "source": "C", "target": "2" }, { "source": "C", "target": "3" } ] }
```
:::
:::::

:::::grid{cols=1 class="border border-slate-700/50 rounded-xl p-2 bg-slate-900/20 text-center"}
#### Wheel ($W_n$)

:::graph{height=130 transparentBg=true}
```json
{ "nodes": [ { "id": "C", "color": "#facc15" }, { "id": 1, "color":"#a8a29e" }, { "id": 2, "color":"#a8a29e" }, { "id": 3, "color":"#a8a29e" }, { "id": 4, "color":"#a8a29e" } ], "links": [ { "source": 1, "target": 2 }, { "source": 2, "target": 3 }, { "source": 3, "target": 4 }, { "source": 4, "target": 1 }, { "source": "C", "target": 1 }, { "source": "C", "target": 2 }, { "source": "C", "target": 3 }, { "source": "C", "target": 4 } ] }
```
:::
:::::

::::::

| Graph Type | Notation | Properties and definitions | Size | Degree |
| --- | :---: | --- | --- | --- |
| **Null** | $N_n$ | The set of edges is empty. The vertices are totally isolated in space. | $0$ | $0$ |
| **Trivial** | $N_1$ | Graph containing 1 vertex and 0 edges. | $0$ | $0$ |
| **Path** | $T_n$ | Simple sequence where the adjacency list is open. Does not close any relation cycle. | $n-1$ | Extremes: 1<br/>Int: 2 |
| **Cycle** | $C_n$ | Closed subgraph without diagonal intersections where cardinal order and size are identical. | $n$ | $2$ |
| **Complete** | $K_n$ | The set of edges $A$ contains absolutely all possible pairs. | $\frac{n(n-1)}{2}$ | $n-1$ |
| **$r$-Regular** | - | All members force an identical parametric degree. | $\frac{rn}{2}$ | $r$ |
| **Bipartite** | - | $V = V_1 \cup V_2$ with $V_1 \cap V_2 = \emptyset$. Requires absence of internal odd-length cycles. | $\le \frac{n^2}{4}$ | Limited |
| **Bip. Complete** | $K_{r,s}$ | Maximum theoretical existence of unconditional cross-links between both formal factions. | $r \cdot s$ | $r$ and $s$ |
| **Star** | $K_{1,s}$ | The classic particular case of the previous asymmetric complete bipartite where one end of the partition is one. | $s$ | $1$ and $s$ |
| **Wheel** | $W_n$ | Pure formative composition by subgraph $C_{n-1}$ joined with an exterior nexus type vertex. | $2(n-1)$ | $3$ and $n-1$ |
| **$r$-Partite** | $G(V_1 \dots V_r)$ | Partition of $V$ into $r$ stable sets $V_i$ such that there are no edges between vertices of the same group. | - | Limited |

## 7. Subgraphs

Before getting into details, let's understand the difference between being "whole" and missing pieces.

:::::grid{cols=2 class="gap-4"}



:::graph{height=120}
```json
{ "nodes": [ { "id": 1 }, { "id": 2 }, { "id": 3 }, { "id": 4 } ], "links": [ { "source": 1, "target": 2 }, { "source": 1, "target": 3 }, { "source": 1, "target": 4 }, { "source": 2, "target": 3 }, { "source": 2, "target": 4 }, { "source": 3, "target": 4 } ] }
```
:::


:::graph{height=120}
```json
{ "nodes": [ { "id": 1 }, { "id": 2 }, { "id": 3 }, { "id": 4 } ], "links": [ { "source": 1, "target": 2 }, { "source": 3, "target": 4 } ] }
```
:::

:::::

If we have a graph $G$, a **subgraph** is any result of removing vertices or edges. We can never add anything new!

There are two special types of "cutouts":

:::::grid{cols=2 class="gap-4"}

::::grid{cols=1 class="h-full border border-slate-700/50 rounded-xl p-3 bg-slate-900/20 hover:bg-slate-900/40 transition-all !my-0"}
#### **Spanning subgraph**
We keep **ALL the vertices**, but we delete some edges.

:::graph{height=120}
```json
{
  "nodes": [ { "id": 1 }, { "id": 2 }, { "id": 3, "color": "#ef4444" } ],
  "links": [ { "source": 1, "target": 2 } ]
}
```
:::
<div class="text-xs text-center text-slate-400 mt-2">Original was a triangle. Vertex 3 (red) is still there, alone.</div>
::::

::::grid{cols=1 class="h-full border border-slate-700/50 rounded-xl p-3 bg-slate-900/20 hover:bg-slate-900/40 transition-all !my-0"}
#### **Induced subgraph ($G[S]$)**
We choose a "team" of vertices $S$ and keep **ALL** their internal edges.

:::graph{height=120}
```json
{
  "nodes": [ { "id": 1 }, { "id": 2 }, { "id": 3 }, { "id": 4 } ],
  "links": [ { "source": 1, "target": 2 }, { "source": 2, "target": 3 }, { "source": 3, "target": 4 } ]
}
```
:::
<div class="text-xs text-center text-slate-400 mt-2">We cut out a piece of the network, keeping local connections.</div>
::::

:::::

## 8. The complementary graph ($G^c$)

Imagine the parallel universe of the graph. It's the **negative** of the photo. There are graphs that are **self-complementary**: they are identical to their "negative" ($G \cong G^c$). The pentagon ($C_5$) is one.

:::::grid{cols=2 class="gap-4"}

::::grid{cols=1 class="h-full border border-slate-700/50 rounded-xl p-3 bg-slate-900/20 hover:bg-slate-900/40 transition-all !my-0"}
#### **Original graph ($G$)**
Two connected vertices (Friends).

:::graph{height=120}
```json
{
  "nodes": [ { "id": 1 }, { "id": 2 }, { "id": 3 }, { "id": 4 } ],
  "links": [ { "source": 1, "target": 2 }, { "source": 3, "target": 4 } ]
}
```
:::
::::

::::grid{cols=1 class="h-full border border-slate-700/50 rounded-xl p-3 bg-slate-900/20 hover:bg-slate-900/40 transition-all !my-0"}
#### **Complementary graph ($G^c$)**
Now the friends fight, and the strangers become friends.

:::graph{height=120}
```json
{
  "nodes": [ { "id": 1 }, { "id": 2 }, { "id": 3 }, { "id": 4 } ],
  "links": [
    { "source": 1, "target": 3 }, { "source": 1, "target": 4 },
    { "source": 2, "target": 3 }, { "source": 2, "target": 4 },
    { "source": 1, "target": 4 }, { "source": 2, "target": 3 }
  ]
}
```
:::

::::

:::::

:::tip{title="Complementary algebra"}
Do not try to draw the complementary if they ask for numbers on the exam. The computer of your mind must use these 3 golden rules:
1.  **Equal order:** $n_{G^c} = n$
2.  **Inverted size:** $m_{G^c} = \frac{n(n-1)}{2} - m$  (They are the total possible edges minus the ones you already have in $G$).
3.  **Inverted degree (Essential):** The new degree of a vertex is everything with which it was not connected in your original network. This formula is used continuously:
    $$ g_{G^c}(v) = (n - 1) - g_G(v) $$
:::


- **Independent set**: Subset of vertices $S \subseteq V$ where **no pair** of vertices is adjacent (0 internal edges). In $G$ it is a complete subgraph (piece that forms a complete graph) in the complementary graph $G^c$.
- **Independence number $\alpha(G)$**: Size of the largest independent set of the graph.


## 9. Operations with graphs

### Union graph ($G \cup G'$)
It is the disjoint union of two graphs. We simply draw them next to each other.
- **Vertex and Edges**: $V_{total} = V \cup V'$ and $A_{total} = A \cup A'$.
- If $V \cap V' = \emptyset$ (they do not share nodes), the total order is exactly $n + n'$.

**Example**: $C_3 \cup C_3$
:::graph{height=150}
```json
{
  "nodes": [
    { "id": 1, "color": "#3b82f6" }, { "id": 2, "color": "#3b82f6" }, { "id": 3, "color": "#3b82f6" },
    { "id": 4, "color": "#ef4444" }, { "id": 5, "color": "#ef4444" }, { "id": 6, "color": "#ef4444" }
  ],
  "links": [
    { "source": 1, "target": 2 }, { "source": 2, "target": 3 }, { "source": 3, "target": 1 },
    { "source": 4, "target": 5 }, { "source": 5, "target": 6 }, { "source": 6, "target": 4 }
  ]
}
```
:::

### Graph power ($G^k$)
- **Definition ($G^2$):** Keeps the nodes of $G$. Two nodes are adjacent if their original distance in $G$ is **$\le 2$**.
- **General rule ($G^k$):** $u \sim v$ if $dist_G(u, v) \le k$.
- **Exam:** If $G$ is connected (topic 2), $G^2$ is also connected and its diameter is reduced (more "shortcuts").

**Example**: $P_4^2$ (Nodes distance $\le 2$ connected)
:::graph{height=150}
```json
{
  "nodes": [ { "id": 1 }, { "id": 2 }, { "id": 3 }, { "id": 4 } ],
  "links": [
    { "source": 1, "target": 2, "color": "#94a3b8" }, { "source": 2, "target": 3, "color": "#94a3b8" }, { "source": 3, "target": 4, "color": "#94a3b8" },
    { "source": 1, "target": 3, "color": "#f43f5e", "name": "Dist 2" }, { "source": 2, "target": 4, "color": "#f43f5e", "name": "Dist 2" }
  ]
}
```
:::

### Product graph ($G \times H$)
The **Cartesian product** generates "grid" type structures. We replace each vertex of $G$ with a copy of $H$ and connect them following the structure of $G$.

**Example**: $P_3 \times P_2$ (a ladder)

:::graph
```json
{
  "nodes": [
    { "id": "1A", "label": "1A", "group": 1 }, { "id": "1B", "label": "1B", "group": 1 },
    { "id": "2A", "label": "2A", "group": 2 }, { "id": "2B", "label": "2B", "group": 2 },
    { "id": "3A", "label": "3A", "group": 3 }, { "id": "3B", "label": "3B", "group": 3 }
  ],
  "links": [
    { "source": "1A", "target": "1B" }, { "source": "2A", "target": "2B" }, { "source": "3A", "target": "3B" },
    { "source": "1A", "target": "2A" }, { "source": "2A", "target": "3A" },
    { "source": "1B", "target": "2B" }, { "source": "2B", "target": "3B" }
  ]
}
```
:::

- **Order**: $n_{G \times H} = n_G \cdot n_H$
- **Size**: $m_{G \times H} = n_G \cdot m_H + n_H \cdot m_G$

:::tip{title="Distances in the Product"}
The distance in the product is the sum of the distances:
$$ d_{G \times H}((u_1, v_1), (u_2, v_2)) = d_G(u_1, u_2) + d_H(v_1, v_2) $$
$$ \text{Diameter}(G \times H) = \text{Diameter}(G) + \text{Diameter}(H) $$
:::

### Corona product ($G \circ H$)
It is built by taking a copy of $G$ and $n_G$ copies of $H$, and connecting each vertex $i$ of $G$ with **all** the vertices of its corresponding copy of $H$.
- **Order**: $n_{G \circ H} = n_G(1 + n_H)$
- **Degree of a vertex $v \in G$**: $g_{original}(v) + n_H$
- **Size**: $m_{G \circ H} = m_G + n_G(m_H + n_H)$

**Example**: $K_2 \circ N_2$ (Each node of $K_2$ connects to a pair of new nodes)
:::graph{height=200}
```json
{
  "nodes": [
    { "id": "G1", "color": "#facc15" }, { "id": "G2", "color": "#facc15" },
    { "id": "H1_1", "color": "#3b82f6" }, { "id": "H1_2", "color": "#3b82f6" },
    { "id": "H2_1", "color": "#ef4444" }, { "id": "H2_2", "color": "#ef4444" }
  ],
  "links": [
    { "source": "G1", "target": "G2" },
    { "source": "G1", "target": "H1_1" }, { "source": "G1", "target": "H1_2" },
    { "source": "G2", "target": "H2_1" }, { "source": "G2", "target": "H2_2" }
  ]
}
```
:::
