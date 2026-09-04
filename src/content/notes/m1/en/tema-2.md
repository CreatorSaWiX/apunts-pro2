---
title: "Topic 2: Traversals, connectivity and DFS"
description: "Paths, cut vertices, distances and the Depth-First Search algorithm."
readTime: "12 Min"
order: 2
---

## 1. Concepts

*   **Walk**: Traveling from one vertex to another via edges (you can repeat places as you wish).
*   **Path**: A walk where we **do not repeat any vertex** (nor any edge).
*   **Cycle**: A closed path (start = end) of length $\ge 3$. A graph without cycles is called an **acyclic graph**.
*   **Length**: It is exactly the number of edges we cross, not the vertices. The trip from a vertex to itself (without moving) has length 0.

## 2. Cuts and bridges

A graph is **connected** if there is always some path between any pair of vertices. If some cannot be reached, it fragments into separate **connected components**. Any real-sized connected graph demands at a minimum the strict use of $n - 1$ edges (if we have a connected graph of 5 vertices, then it has exactly 4 edges).

*   **Cut vertex**: If we delete this single vertex, we cut so many connections that the graph instantly divides into MORE connected components.
*   **Bridge edge**: If we delete this edge alone, we break the graph into **exactly 2** connected components.

:::graph
```json
{
  "nodes": [
    { "id": "1" }, { "id": "2" }, { "id": "Cut", "color": "#ef4444" },
    { "id": "4", "color": "#3b82f6" }, { "id": "5" }
  ],
  "links": [
    { "source": "1", "target": "2" }, { "source": "2", "target": "Cut" }, { "source": "1", "target": "Cut" },
    { "source": "Cut", "target": "4", "color": "#facc15", "width": 3, "label": "Bridge" },
    { "source": "4", "target": "5" }
  ]
}
```
:::
<div class="text-xs text-center text-slate-400 mt-2 mb-4">The <b>Cut</b> vertex (red) is vital. The yellow edge is exclusively a <b>Bridge</b>.</div>

:::tip{title="The fallacy of edges and vertices"}
"Does a connected graph with cut vertices always have a bridge edge"? **FALSE**. Counterexample: the **butterfly graph** (two triangles joined by a single vertex). The central vertex is a cut vertex, but no edge is a bridge because they are all part of a cycle. However, the **converse is true**: if an edge is a bridge, its endpoints are cut vertices (except if any endpoint has degree 1, i.e., it is a leaf).
:::

## 3. Distance metrics
Let there be two vertices living in the same connected component $u$ and $v$:
*   **Distance $d(u,v)$**: The *minimum* value referring to the length of all the variety of paths to go from $u$ to $v$. If there is no possible path, it is considered $\infty$.

At the global graph level we have 4 key definitions to evaluate depending on this $d$:
1.  **Eccentricity $e(u)$**: Put yourself in $u$. What is the distance of the one who is furthest away? ("the worst case scenario"). 
2.  **Diameter $D(G)$**: The largest distance you can find in the **whole** graph. The maximum value of all the eccentricities together.
3.  **Radius $r(G)$**: If we are looking for the most efficient point on the map... The lowest available eccentricity obtained by some vertex is called the radius.
4.  **Graph Center**: Any and all vertices where they have miraculously calculated to have precisely the eccentricity exactly equal to said **radius**.

**Example:** Let's consider the path $a - b - c - d$:

| | $d(\cdot, a)$ | $d(\cdot, b)$ | $d(\cdot, c)$ | $d(\cdot, d)$ | **Eccentricity** |
|:-:|:-:|:-:|:-:|:-:|:-:|
| **a** | 0 | 1 | 2 | 3 | **3** |
| **b** | 1 | 0 | 1 | 2 | **2** |
| **c** | 2 | 1 | 0 | 1 | **2** |
| **d** | 3 | 2 | 1 | 0 | **3** |

*   **Diameter** $D(G) = \max(3,2,2,3) = 3$
*   **Radius** $r(G) = \min(3,2,2,3) = 2$
*   **Center** = $\{b, c\}$ (the vertices with eccentricity $= r$)

---

## 4. DFS: Depth-First Search

The official demonstration algorithm **DFS** allows finding absolutely all the connected component to which a given start $v$ belongs. It discovers the depths before looking through adjacent sides and is natively based on using a kind of **stack (LIFO)**. 

In each visit it attempts to add a single fresh adjacent to keep sinking from (push). Only if we are cornered (all neighbors checked), it backtracks undoing from the stack itself to explore where we came from (pop).

:::algoviz{algorithm="dfs"}
:::

## 5. BFS: Breadth-First Search

While the DFS dives steeply, the **BFS** propagates radially in layers. In the computer it purely needs to structure temporary memory around a **queue (FIFO)**.

If we have an array `D` that saves how many steps we have taken:
1. Put the origin node ($v$) at distance `0` inside `D`. `D[v] = 0`.
2. Enqueue and add $v$ to the Visited list ($W$).
3. When you extract the first from the queue (called $x$), all the new unexplored adjacents ($y$) will strictly take as official distance the value **$D[y] = D[x] + 1$**. And you advance to another neighborhood!

> Let the simple graph be $G = (V,A)$ and its vertex $v \in V$. The resulting vector $D$ obtained manually during **the pure routines of the BFS algorithm** is guaranteed to become the actual storage of the **minimum path distance from the original vertex $v$ to any other** located in the entire root of connected nodes.

:::algoviz{algorithm="bfs2"}
:::

:::tip{title="Exam Trick: Executing Traversals on Paper"}
They will often ask to list explicitly and from memory about "the order of addition of vertices to the BFS/DFS spanning tree strictly prioritizing with a small boundary numerical order". It is key not to fail or get confused:
*   **Spanning Edges:** The master pipe or *discovery edge* only comes from which previous vertex you conquered the other unknown one first! And never between adjacents discovered from the same depths.
*   **Paper BFS Order:** List those of distance 1 (sorted from lowest id to highest), put the small branches, make them the origin one by one and add those of distance 2. Do not skip branches!
*   **Paper DFS Order:** Follow the unclosed line to the last possible smallest corner. Once the path without a route is cut (all current neighbors visited), go back behind and look for discarded parallel virgin routes as a fallback.
:::

---

## 6. How to know if a graph is Bipartite?

A graph is **bipartite** if we can paint its vertices with **2 colors** (e.g. Red and Blue) so that no pair of vertices of the same color are connected to each other.

:::tip{title="Golden exam rule"}
A graph is **Bipartite** $\iff$ **It does NOT have any ODD length cycle** (like a $C_3$ triangle or a $C_5$ pentagon).
:::

### Visualization: the "painting" method
Imagine you try to paint the graph by alternating colors. If at any point you are forced to connect two nodes of the same color, there is an odd cycle and it is **not** bipartite.

:::::grid{cols=2 class="gap-4"}

::::grid{cols=1 class="bg-slate-900/40 p-4 rounded-xl border border-emerald-500/20"}
**Bipartite**
All closed paths are even ($C_4$). We can separate them into two groups.

:::graph{height=150}
```json
{
  "nodes": [
    { "id": 1, "color": "#ef4444" }, { "id": 2, "color": "#3b82f6" },
    { "id": 3, "color": "#ef4444" }, { "id": 4, "color": "#3b82f6" }
  ],
  "links": [
    { "source": 1, "target": 2 }, { "source": 2, "target": 3 },
    { "source": 3, "target": 4 }, { "source": 4, "target": 1 }
  ]
}
```
:::
::::

::::grid{cols=1 class="bg-slate-900/40 p-4 rounded-xl border border-red-500/20"}
**Not bipartite (Cycle $C_3$)**
It has a triangle. It is impossible to paint it with 2 colors without repeating on an edge.

:::graph{height=150}
```json
{
  "nodes": [
    { "id": 1, "color": "#ef4444" }, { "id": 2, "color": "#3b82f6" },
    { "id": 3, "color": "#facc15" }
  ],
  "links": [
    { "source": 1, "target": 2 }, { "source": 2, "target": 3 },
    { "source": 3, "target": 1 }
  ]
}
```
:::
::::

:::::
