---
title: "Topic 11: Binary tree implementation"
description: "Implementation of binary trees with pointers"
readTime: "20 minutes"
order: 12
draft: false
isNew: true
---

## 11.1 Internal Structure: Nodes and Pointers

The internal representation of a binary tree in PRO2 uses linked structures where each node stores a value and two pointers to its children:

```cpp
template <typename T>
class Arbre {
private:
    struct node_arbre {
        T info;                 // Data stored in the node
        node_arbre *segE;       // Pointer to left child (nullptr if empty)
        node_arbre *segD;       // Pointer to right child (nullptr if empty)
    };
    node_arbre *primer_node;    // Pointer to root (nullptr if tree is empty)
};
```

### In-Memory Structure Visualization

<div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 my-6 items-start">
<div>

**Physical Node in Memory:**

:::graph
```json
{
  "nodes": [
    { "id": "node_arbre", "label": "node_arbre", "color": "#10b981" },
    { "id": "info", "label": "info", "color": "#3b82f6" },
    { "id": "segE", "label": "*segE", "color": "#8b5cf6" },
    { "id": "segD", "label": "*segD", "color": "#8b5cf6" }
  ],
  "links": [
    { "source": "node_arbre", "target": "info" },
    { "source": "node_arbre", "target": "segE" },
    { "source": "node_arbre", "target": "segD" }
  ]
}
```
:::

</div>
<div>

**Complete Binary Tree:**

:::graph
```json
{
  "nodes": [
    { "id": "7", "label": "7", "color": "#10b981" },
    { "id": "2", "label": "2", "color": "#3b82f6" },
    { "id": "9", "label": "9", "color": "#3b82f6" },
    { "id": "10", "label": "10", "color": "#facc15" },
    { "id": "8", "label": "8", "color": "#facc15" },
    { "id": "12", "label": "12", "color": "#facc15" },
    { "id": "13", "label": "13", "color": "#facc15" }
  ],
  "links": [
    { "source": "7", "target": "2" },
    { "source": "7", "target": "9" },
    { "source": "2", "target": "10" },
    { "source": "2", "target": "8" },
    { "source": "9", "target": "12" },
    { "source": "9", "target": "13" }
  ]
}
```
:::

</div>
</div>

---

## 11.2 Private Recursion Pattern and the Rule of Three

All operations that traverse the tree follow the pattern of a **public method** (without pointer parameters) invoking a **private/static recursive helper** on `node_arbre*`:

### 11.2.1 Deep Copy: `copia_node_arbre(m)`
Recursively duplicates all nodes in pre-order allocating fresh memory:

```cpp
static node_arbre* copia_node_arbre(node_arbre* m) {
    if (m == nullptr) return nullptr;
    node_arbre* n = new node_arbre;
    n->info = m->info;
    n->segE = copia_node_arbre(m->segE);
    n->segD = copia_node_arbre(m->segD);
    return n;
}
```

::algoviz{algorithm="arbre_copia_node"}

---

### 11.2.2 Destruction: `esborra_node_arbre(m)`
Recursively frees memory in **post-order** (first subtrees, then the root):

```cpp
static void esborra_node_arbre(node_arbre* m) {
    if (m != nullptr) {
        esborra_node_arbre(m->segE);
        esborra_node_arbre(m->segD);
        delete m;
    }
}
```

::algoviz{algorithm="arbre_esborra_node"}

---

### 11.2.3 The Rule of Three
```cpp
// 1. Destructor
~Arbre() {
    esborra_node_arbre(primer_node);
}

// 2. Copy Constructor
Arbre(const Arbre& a) {
    primer_node = copia_node_arbre(a.primer_node);
}

// 3. Assignment Operator
Arbre& operator=(const Arbre& a) {
    if (this != &a) {
        esborra_node_arbre(primer_node);
        primer_node = copia_node_arbre(a.primer_node);
    }
    return *this;
}
```

---

## 11.3 $\mathcal{O}(1)$ Pointer Transfer: `plantar` and `fills`

Unlike deep copying, `plantar` and `fills` run in $\mathcal{O}(1)$ constant time because they **transfer ownership of pointers** directly:

### 11.3.1 Plant: `plantar(x, a1, a2)`
Creates a new root node with value `x`, connects the subtrees from `a1` and `a2`, and empties the source trees:

```cpp
void plantar(const T &x, Arbre &a1, Arbre &a2) {
    if (this != &a1 && this != &a2) {
        if (&a1 == &a2) { // Prevents cycles if a1 and a2 are the exact same tree
            a2.primer_node = copia_node_arbre(a1.primer_node);
        }
        node_arbre* aux = new node_arbre;
        aux->info = x;
        aux->segE = a1.primer_node;
        aux->segD = a2.primer_node;
        primer_node = aux;
        a1.primer_node = nullptr;
        a2.primer_node = nullptr;
    }
}
```

::algoviz{algorithm="arbre_plantar"}

---

### 11.3.2 Children: `fills(fe, fd)`
Transfers left and right subtrees to `fe` and `fd`, and deletes the current root node:

```cpp
void fills(Arbre &fe, Arbre &fd) {
    node_arbre* aux = primer_node;
    fe.primer_node = aux->segE;
    fd.primer_node = aux->segD;
    primer_node = nullptr;
    delete aux;
}
```

::algoviz{algorithm="arbre_fills"}

---

## 11.4 Traversal Types

| Order | Visiting Sequence | Typical Application in PRO2 |
| :--- | :--- | :--- |
| **Pre-order** | Root $\rightarrow$ Left $\rightarrow$ Right | Duplicating/cloning the tree (`copia_node_arbre`), serialization. |
| **In-order** | Left $\rightarrow$ Root $\rightarrow$ Right | Listing sorted elements in a Binary Search Tree (BST). |
| **Post-order** | Left $\rightarrow$ Right $\rightarrow$ Root | Destroying the tree (`esborra_node_arbre`), calculating height or size. |
| **Level-order** | Level by level, left to right | BFS algorithms (requires a `queue<node_arbre*>`). |

---

## 11.5 Complexity Summary

| Method | Time Complexity | Explanation |
| :--- | :---: | :--- |
| **`plantar(x, a1, a2)`** | $\mathcal{O}(1)$ | Direct pointer transfer (no deep copy). |
| **`fills(fe, fd)`** | $\mathcal{O}(1)$ | Pointer transfer and `delete` of root node. |
| **`arrel()` / `es_buit()`** | $\mathcal{O}(1)$ | Direct access to root field or `nullptr` check. |
| **Destructor / Copy** | $\Theta(n)$ | Traverses and manages all $n$ nodes in the tree. |
