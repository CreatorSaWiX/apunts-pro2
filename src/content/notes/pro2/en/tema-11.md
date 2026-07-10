---
title: "Topic 11: Binary tree implementation"
description: "Implementation of binary trees with pointers"
readTime: "20 minutes"
order: 12
draft: false
isNew: true
---

## 1. Data structure

The usual representation uses linked nodes where each node has a value and two pointers to its children.

```cpp
template <class T> class Arbre {
private:
  struct node_arbre {
    T info;             // Data contained in the node
    node_arbre *segE;   // Pointer to left child
    node_arbre *segD;   // Pointer to right child
  };
  node_arbre *primer_node; // Pointer to the root (NULL if the tree is empty)
};
```

### Structure visualization

<div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 my-6 items-start">
<div>

A physical level node in memory looks like this:

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

A complete binary tree:

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

## 2. Memory management operations


Since we work with pointers and the `new` operator, we must implement the **Rule of Three** to avoid memory leaks or *shallow copies* that could corrupt memory.

### 2.1 Deep Copy
To copy a tree, it is not enough to copy the root pointer; we must duplicate all nodes recursively.

::algoviz{algorithm="arbre_copia_node"}

### 2.2 Memory freeing (Destruction)
Destruction must be done in **post-order**: first we delete the subtrees and finally the current node.

::algoviz{algorithm="arbre_esborra_node"}

## 3. Ownership transfer (Plant and Children)

In the PRO2 implementation, the `plantar` and `fills` operations are especially efficient because they **move pointers** instead of copying data, but this empties the input parameters.

| Operation | Effect | Complexity |
| :--- | :--- | :--- |
| `plantar(x, a1, a2)` | Creates a root `x` and "steals" the structures of `a1` and `a2`. | $O(1)$ |
| `fills(fe, fd)` | "Cuts" the current root and passes the subtrees to `fe` and `fd`. | $O(1)$ |
| `arrel()` | Returns the data of the root node. | $O(1)$ |

::algoviz{algorithm="arbre_plantar"}

::algoviz{algorithm="arbre_fills"}

In the `plantar(x, a, a)` operation, if an attempt is made to use the same tree as left and right child, the implementation must make a copy of one of them to avoid cycles.

## 4. Types of traversals

To process the information of a tree, we can do it in different orders:

1.  **Pre-order**: Root $\rightarrow$ Left $\rightarrow$ Right (Useful for copying).
2.  **In-order**: Left $\rightarrow$ Root $\rightarrow$ Right (Useful to list sorted elements in a BST).
3.  **Post-order**: Left $\rightarrow$ Right $\rightarrow$ Root (Useful for deleting or calculating subtree sums).
4.  **Level-order**: Top to bottom and left to right (Requires a queue).
