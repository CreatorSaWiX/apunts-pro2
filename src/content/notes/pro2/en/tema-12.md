---
title: "Topic 12: General tree implementation"
description: "Implementation of general trees with pointers and vectors of children"
readTime: "20 minutes"
order: 13
draft: false
isNew: true
---

## 12.1 Internal Structure: N-ary Nodes with `std::vector`

A general tree (or N-ary tree) does not limit the number of children per node to two. The internal structure uses a dynamic pointer vector `vector<node_arbreGen*> seg` to store addresses of children:

```cpp
template <typename T>
class ArbreGen {
private:
    struct node_arbreGen {
        T info;                         // Data stored in node
        vector<node_arbreGen*> seg;     // Vector of pointers to children
    };
    node_arbreGen* primer_node;         // Pointer to root (nullptr if empty)
};
```

### In-Memory Structure Visualization

<div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 my-6 items-start">
<div>

**Node with child vector in memory:**

:::graph
```json
{
  "nodes": [
    { "id": "node_arbreGen", "label": "node_arbreGen", "color": "#10b981" },
    { "id": "info", "label": "info", "color": "#3b82f6" },
    { "id": "vector", "label": "vector<*seg>", "color": "#8b5cf6" },
    { "id": "fill0", "label": "*fill 0", "color": "#facc15" },
    { "id": "fill1", "label": "*fill 1", "color": "#facc15" },
    { "id": "filln", "label": "*fill n", "color": "#facc15" }
  ],
  "links": [
    { "source": "node_arbreGen", "target": "info" },
    { "source": "node_arbreGen", "target": "vector" },
    { "source": "vector", "target": "fill0" },
    { "source": "vector", "target": "fill1" },
    { "source": "vector", "target": "filln" }
  ]
}
```
:::

</div>
<div>

**Variable degree general tree:**

:::graph
```json
{
  "nodes": [
    { "id": "A", "label": "A", "color": "#10b981" },
    { "id": "B", "label": "B", "color": "#3b82f6" },
    { "id": "C", "label": "C", "color": "#3b82f6" },
    { "id": "D", "label": "D", "color": "#3b82f6" },
    { "id": "E", "label": "E", "color": "#facc15" },
    { "id": "F", "label": "F", "color": "#facc15" },
    { "id": "G", "label": "G", "color": "#facc15" }
  ],
  "links": [
    { "source": "A", "target": "B" },
    { "source": "A", "target": "C" },
    { "source": "A", "target": "D" },
    { "source": "B", "target": "E" },
    { "source": "B", "target": "F" },
    { "source": "D", "target": "G" }
  ]
}
```
:::

</div>
</div>

---

## 12.2 Recursion over Vectors and the Rule of Three

Recursion on general trees replaces fixed two-way calls (`segE` and `segD`) with a `for` loop that iterates over vector size `m->seg.size()`:

### 12.2.1 Deep Copy: `copia_node_arbreGen(m)`
Recursively duplicates all nodes allocating the exact vector size:

```cpp
static node_arbreGen* copia_node_arbreGen(node_arbreGen* m) {
    if (m == nullptr) return nullptr;
    node_arbreGen* n = new node_arbreGen;
    n->info = m->info;
    int ari = m->seg.size();
    n->seg = vector<node_arbreGen*>(ari);
    for (int i = 0; i < ari; ++i) {
        n->seg[i] = copia_node_arbreGen(m->seg[i]);
    }
    return n;
}
```

::algoviz{algorithm="arbgen_copia"}

---

### 12.2.2 Destruction: `esborra_node_arbreGen(m)`
Recursively frees memory in **post-order** (first all children, then the parent):

```cpp
static void esborra_node_arbreGen(node_arbreGen* m) {
    if (m != nullptr) {
        int ari = m->seg.size();
        for (int i = 0; i < ari; ++i) {
            esborra_node_arbreGen(m->seg[i]);
        }
        delete m;
    }
}
```

::algoviz{algorithm="arbgen_esborra"}

---

### 12.2.3 The Rule of Three
```cpp
// 1. Destructor
~ArbreGen() {
    esborra_node_arbreGen(primer_node);
}

// 2. Copy Constructor
ArbreGen(const ArbreGen& a) {
    primer_node = copia_node_arbreGen(a.primer_node);
}

// 3. Assignment Operator
ArbreGen& operator=(const ArbreGen& a) {
    if (this != &a) {
        esborra_node_arbreGen(primer_node);
        primer_node = copia_node_arbreGen(a.primer_node);
    }
    return *this;
}
```

---

## 12.3 Ownership Transfer: `plantar`, `fills`, and `afegir_fill`

### 12.3.1 Plant: `plantar(x, v)`
Creates a root node with value `x` and steals `primer_node` pointers from each tree in vector `v`:

```cpp
void plantar(const T &x, vector<ArbreGen> &v) {
    node_arbreGen* aux = new node_arbreGen;
    aux->info = x;
    int ari = v.size();
    aux->seg = vector<node_arbreGen*>(ari);
    for (int i = 0; i < ari; ++i) {
        aux->seg[i] = v[i].primer_node;
        v[i].primer_node = nullptr; // Empties original tree
    }
    primer_node = aux;
}
```

::algoviz{algorithm="arbgen_plantar"}

---

### 12.3.2 Children: `fills(v)`
Transfers all subtrees from root to vector `v` and deletes root with `delete`:

```cpp
void fills(vector<ArbreGen> &v) {
    node_arbreGen* aux = primer_node;
    int ari = aux->seg.size();
    v = vector<ArbreGen>(ari);
    for (int i = 0; i < ari; ++i) {
        v[i].primer_node = aux->seg[i];
    }
    primer_node = nullptr;
    delete aux;
}
```

::algoviz{algorithm="arbgen_fills"}

---

### 12.3.3 Append Child: `afegir_fill(a)`
Expands the arity of the root by appending a new subtree to the end of vector `seg`:

```cpp
void afegir_fill(ArbreGen &a) {
    if (primer_node != nullptr) {
        primer_node->seg.push_back(a.primer_node);
        a.primer_node = nullptr; // Transfers ownership
    }
}
```

---

## 12.4 Key Differences with Binary Tree

1. **No In-order**: In a general tree there is no canonical "middle" position. Only **Pre-order**, **Post-order**, or **Level-order** (BFS) traversals are meaningful.
2. **Dynamic Degree/Arity**: Each node can have an arbitrary number of children ($0, 1, 2, \dots, k$).
3. **Methods with Vectors**: `plantar` and `fills` take and return a `vector<ArbreGen>` instead of two discrete parameters.

---

## 12.5 Complexity Summary

| Method | Time Complexity | Explanation |
| :--- | :---: | :--- |
| **`plantar(x, v)`** | $\mathcal{O}(k)$ | Where $k = v.\text{size}()$ (loop transferring pointers). |
| **`fills(v)`** | $\mathcal{O}(k)$ | Where $k$ is the number of children of root. |
| **`afegir_fill(a)`** | $\mathcal{O}(1)$ amortized | Insertion at end of vector via `push_back`. |
| **`arrel()` / `nombre_fills()`** | $\mathcal{O}(1)$ | Direct access to `info` or `seg.size()`. |
| **Destructor / Copy** | $\Theta(n)$ | Traverses and frees/copies all $n$ nodes in the tree. |
