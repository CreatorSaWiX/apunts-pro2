---
title: "Topic 5: Graphs"
description: "Definition and properties of graphs, in-memory representations, DFS and BFS traversals, shortest paths (Dijkstra), topological sorting in DAGs, minimum spanning trees (Prim), and implicit graphs."
readTime: "15 min"
order: 6
draft: false
---

## 5.1. Fundamental properties and bounds

A graph $G = (V, E)$ consists of a set of $n = |V|$ **vertices** and $m = |E|$ **edges**.

**Maximum Edge Bounds:**
* Simple undirected: $0 \le m \le \binom{n}{2} = \frac{n(n - 1)}{2} \implies \mathbf{m = \mathcal{O}(n^2)}$.
* Simple directed: $0 \le m \le n(n - 1) \implies \mathbf{m = \mathcal{O}(n^2)}$.
**Handshaking Lemma:** $\sum_{u \in V} \deg(u) = 2m$.
* *Corollary:* The number of odd-degree vertices in an undirected graph is always **even**.

**Connectivity:**
* A connected undirected graph has at least $n - 1$ edges ($m = \Omega(n)$).
* In directed graphs (digraphs): **Weakly connected** (the underlying undirected graph is connected); **Strongly connected (SCC)** (a directed path $u \rightsquigarrow v$ and $v \rightsquigarrow u$ exists for every pair).

**Trees:** A graph is a tree $\iff$ it is connected and has exactly $n - 1$ edges $\iff$ it is acyclic and has $n - 1$ edges.

More details in [M1 Graph Theory Midterm Summary](./m1-G)

---

## 5.2. Memory representations: adjacency matrix vs adjacency lists

| Operation / Parameter | Adjacency Matrix (`vector<vector<bool>>`) | Adjacency Lists (`vector<vector<int>>`) |
| :--- | :---: | :---: |
| **Memory space** | $\mathbf{\Theta(n^2)}$ | $\mathbf{\Theta(n + m)}$ |
| **Check edge existence $\{u, v\}$** | $\mathbf{\Theta(1)}$ | $\mathcal{O}(\deg(u))$ |
| **Iterate over all neighbors of $u$** | $\Theta(n)$ | $\mathbf{\Theta(\deg(u))}$ |
| **Insert / Delete edge** | $\Theta(1)$ | $\mathcal{O}(\deg(u))$ |
| **Best suited for** | **Dense graphs** ($m \approx n^2$) | **Sparse graphs** ($m \ll n^2$, standard in EDA) |

:::graphrepviz
:::

* **Exam Refactoring:** Replacing a loop scanning neighbors over a matrix ($\mathcal{O}(n^2)$) with adjacency lists reduces the runtime to $\mathcal{O}(n + m)$.

---

## 5.3. Depth-first search (DFS) and breadth-first search (BFS)

### DFS (depth-first search)
Explores recursively until reaching a dead end and backtracks.

```cpp
void dfs(const vector<vector<int>>& G, int u, vector<bool>& vis) {
    vis[u] = true;
    for (int v : G[u]) {
        if (!vis[v]) dfs(G, v, vis);
    }
}
```

* **Cost:** $\mathbf{\Theta(n + m)}$. Space: $\Theta(n)$ for call stack and `vis`.
* **Exam Property:** In an **undirected graph**, DFS produces only **tree edges** and **back edges**. An undirected graph contains cycles $\iff$ DFS encounters an edge to an already-visited vertex that is not the direct parent.

:::dfsviz
:::

---

### BFS (breadth-first search)
Explores level-by-level in concentric rings of distance from a source $s$.

```cpp
vector<int> bfs(const vector<vector<int>>& G, int s) {
    int n = G.size();
    vector<int> dist(n, -1);
    queue<int> Q;

    dist[s] = 0;
    Q.push(s);

    while (!Q.empty()) {
        int u = Q.front();
        Q.pop();
        for (int v : G[u]) {
            if (dist[v] == -1) {
                dist[v] = dist[u] + 1; // Mark upon enqueue!
                Q.push(v);
            }
        }
    }
    return dist;
}
```

* **Cost:** $\mathbf{\Theta(n + m)}$. Space: $\Theta(n)$.
* **Core Principle:** BFS guarantees finding the **shortest path in number of edges** (or steps).
* **Golden Rule:** In BFS, nodes must be marked as visited **UPON ENQUEUE**, never upon dequeue (prevents enqueuing duplicates).

:::bfsviz
:::

---

## 5.4. Dijkstra's algorithm (shortest paths with non-negative weights $\ge 0$)

Computes minimum distances from a source $s$ in graphs with **non-negative** edge weights ($\omega(e) \ge 0$).

:::dijkstraviz
:::

```cpp
typedef pair<double, int> PII; // {accumulated_distance, node}
typedef vector<vector<pair<int, double>>> GraphW;

void dijkstra(const GraphW& G, int s, vector<double>& dist) {
    int n = G.size();
    dist.assign(n, 1e18);
    vector<bool> S(n, false); // S[u] = true once distance is settled
    priority_queue<PII, vector<PII>, greater<PII>> pq; // Min-Heap

    dist[s] = 0;
    pq.push({0, s});

    while (!pq.empty()) {
        int u = pq.top().second;
        double d = pq.top().first;
        pq.pop();

        if (S[u]) continue; // Discard outdated duplicate copies from heap
        S[u] = true;

        for (auto& arc : G[u]) {
            int v = arc.first;
            double w = arc.second;
            if (dist[v] > dist[u] + w) {
                dist[v] = dist[u] + w;
                pq.push({dist[v], v});
            }
        }
    }
}
```

* **Time Complexity with `std::priority_queue`:** $\mathbf{\mathcal{O}((n + m) \log n)}$.

### Key exam questions on Dijkstra

1. **Why is the `S` array (or `if (d > dist[u]) continue;`) necessary?**
   Because `std::priority_queue` lacks a `decrease_key` operation, duplicate entries are inserted into the queue. Without the `S` array, a node could be reprocessed multiple times, causing runtime to blow up to **$\mathbf{\Omega(n^2)}$** on graphs with many alternative paths.
2. **Why does it fail with negative-weight edges?**
   Dijkstra is greedy: it assumes that once $u$ is popped from the heap, its distance cannot improve further. A negative edge encountered later could provide a shortcut that reduces the cost to an already-settled node. *(Negative weights require the Bellman-Ford algorithm in $\mathcal{O}(n \cdot m)$)*.
3. **Counting the number of shortest paths (January 2025):**
   Maintain an array `ways(n, 0)` with `ways[s] = 1`:
   * If `dist[u] + w < dist[v]`: strictly better shortest path found $\implies$ `dist[v] = dist[u] + w; ways[v] = ways[u]; pq.push(...)`.
   * If `dist[u] + w == dist[v]`: alternative path with identical minimal cost $\implies$ `ways[v] += ways[u]`.

---

## 5.5. Topological sort in directed acyclic graphs (DAGs)

A topological sort is a linear ordering of vertices $(v_1, \dots, v_n)$ such that for every directed edge $(u, v) \in E$, $u$ appears before $v$.

* **Theorem:** A directed graph admits a topological sort $\iff$ it is a **DAG** (has no directed cycles).
* Every finite DAG has at least one source ($\deg^- = 0$) and one sink ($\deg^+ = 0$).

### Kahn's algorithm (sources and in-degrees)

```cpp
vector<int> toposort(const vector<vector<int>>& G) {
    int n = G.size();
    vector<int> in_deg(n, 0);
    for (int u = 0; u < n; ++u)
        for (int v : G[u]) ++in_deg[v];

    queue<int> Q;
    for (int u = 0; u < n; ++u)
        if (in_deg[u] == 0) Q.push(u);

    vector<int> order;
    while (!Q.empty()) {
        int u = Q.front();
        Q.pop();
        order.push_back(u);
        for (int v : G[u]) {
            if (--in_deg[v] == 0) Q.push(v);
        }
    }

    if (order.size() != n) return {}; // If size < n, THE GRAPH CONTAINS CYCLES!
    return order;
}
```

* **Cost:** $\mathbf{\Theta(n + m)}$. Space: $\Theta(n)$.
* **Cycle Detection:** If `order.size() < n`, the graph is not a DAG.

:::toposortviz
:::

---

## 5.6. Minimum spanning trees (MST): Prim vs Kruskal

A **spanning tree** connects all vertices of a connected undirected graph using exactly **$n - 1$ edges**. An **MST** is one that minimizes the total sum of edge weights.

* **Uniqueness:** If all edge weights are **strictly distinct**, the MST is **UNIQUE**.

| Criterion | Prim's Algorithm | Kruskal's Algorithm |
| :--- | :--- | :--- |
| **Strategy** | Grows a **single continuous local tree** starting from an initial vertex. | Merges a **global forest** of independent trees. |
| **Key structure** | `priority_queue` of edges crossing the current cut. | Edge sorting + **Union-Find / DSU** (cycle avoidance). |
| **Time complexity** | $\mathbf{\mathcal{O}(m \log n)}$ | $\mathbf{\mathcal{O}(m \log m) = \mathcal{O}(m \log n)}$ |
| **Best suited for** | **Dense graphs** ($m \approx n^2$). | **Sparse graphs** ($m \ll n^2$). |

:::mstviz
:::

---

## 5.7. Implicit graphs: grids and state spaces

In many final exam problems, adjacency lists are not given directly; the graph is implicit:

### 1. 2D grids ($R \times C$)
Traversable cells are nodes and valid moves are edges:

```cpp
const int di[] = {-1, 1, 0, 0};
const int dj[] = {0, 0, -1, 1};

// Inside BFS loop over grid:
for (int k = 0; k < 4; ++k) {
    int ni = r + di[k], nj = c + dj[k];
    if (ni >= 0 && ni < R && nj >= 0 && nj < C && grid[ni][nj] != '#' && dist[ni][nj] == -1) {
        dist[ni][nj] = dist[r][c] + 1;
        Q.push({ni, nj});
    }
}
```

:::gridbfsviz
:::

### 2. Abstract state spaces (e.g. water jugs problem, January 2024)
* **Vertices:** State pairs $(a, b)$ representing current water volumes in each jug ($0 \le a \le A$, $0 \le b \le B$).
* **Edges:** Permissible operations (fill $A$, empty $B$, pour $A \to B$, etc.).
* **Resolution:** Since each operation counts as 1 step, the minimum number of steps is **always solved with BFS**, never with Dijkstra or DFS. Cost: $\mathcal{O}(\text{number of states}) = \mathcal{O}(A \cdot B)$.

:::jugsviz
:::

---

## 5.8. Summary

1. **Why is Dijkstra on an unweighted graph a poor choice?**
   Because it costs $\mathcal{O}((n + m) \log n)$ due to heap operations, whereas simple BFS finds shortest paths in $\Theta(n + m)$.
2. **What detects cycles fastest in a DAG?**
   Kahn's algorithm in $\Theta(n + m)$ (if unprocessed vertices remain with `in_deg > 0`) or DFS checking for back edges to vertices currently active on the recursion stack.
3. **Dijkstra with an adjacency matrix:** In extremely dense graphs ($m = \Theta(n^2)$), using a simple array rather than a heap achieves $\Theta(n^2)$, which is faster than $\mathcal{O}(n^2 \log n)$.
4. **Eulerian vs Hamiltonian Paths:**
   - Eulerian (visits every **edge** once): solvable in polynomial time $\Theta(m) \in \mathbf{P}$.
   - Hamiltonian (visits every **vertex** once): **NP-complete** problem.

| Algorithm | Graph Type | Weights | Problem Solved | Key Structure | Time Cost | Aux. Memory |
| :--- | :--- | :--- | :--- | :--- | :---: | :---: |
| **DFS** | Directed / Undirected | Irrelevant | Connectivity, cycles, components | Stack / Recursion | $\mathbf{\Theta(n + m)}$ | $\Theta(n)$ |
| **BFS** | Directed / Undirected | Unweighted / constant | Shortest path in edges / steps | FIFO queue (`queue`) | $\mathbf{\Theta(n + m)}$ | $\Theta(n)$ |
| **Dijkstra** | Directed / Undirected | **Non-negative** ($\omega \ge 0$) | Single-source shortest path | Min-Heap (`priority_queue`) | $\mathbf{\mathcal{O}((n + m) \log n)}$ | $\Theta(n + m)$ |
| **Kahn (TopoSort)**| Directed Acyclic (**DAG**)| Irrelevant | Topological ordering & dependencies | In-degree array + Queue/Stack | $\mathbf{\Theta(n + m)}$ | $\Theta(n)$ |
| **Prim (MST)** | Connected Undirected | Weighted | Minimum weight spanning tree | Min-Heap of crossing cut edges | $\mathbf{\mathcal{O}(m \log n)}$ | $\Theta(n + m)$ |

