---
title: "Topic 12: General tree implementation"
description: "Implementation of general trees with pointers and vectors of children"
readTime: "20 minutes"
order: 13
draft: false
isNew: true
---

## 1. Data structure

The node structure changes to accommodate a dynamic list of descendants:

```cpp
template <class T> class ArbreGen {
private:
  struct node_arbreGen {
    T info;                         // Node data
    vector<node_arbreGen*> seg;     // Vector of pointers to children
  };
  node_arbreGen* primer_node;       // Pointer to the root
};
```

### General node visualization

<div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 my-6 items-start">
<div>

In memory, a node of a general tree is represented with a vector pointing to each child:

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

The hierarchical structure allows any degree per node:

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

## 2. Recursive memory management

Recursion in general trees is no longer limited to two calls (left and right), but must iterate over the vector of children.

### 2.1 Copying nodes
To copy a general node, we must reserve the vector with the correct size and copy each child:

::algoviz{algorithm="arbgen_copia"}

### 2.2 Deleting nodes
Deletion also requires a loop to traverse all subtrees before performing the `delete` of the parent node:

::algoviz{algorithm="arbgen_esborra"}

## 3. Construction and query operations

The "plant" and "children" operations are adapted to work with vectors of entire trees.

| Operation | Description | Complexity |
| :--- | :--- | :--- |
| `plantar(x, v)` | Creates a root `x` and assigns the vector of trees `v` as children. | $O(N)$ (where $N$ is the number of children) |
| `fills(v)` | Empties the current tree and passes all its children to the vector `v`. | $O(N)$ |
| `nombre_fills()` | Returns the size of the root's `seg` vector. | $O(1)$ |

::algoviz{algorithm="arbgen_plantar"}

::algoviz{algorithm="arbgen_fills"}

> **Ownership transfer**: Just as in binary trees, when we do a `plantar` with a vector of trees, the original trees inside the vector become empty to avoid memory duplications.

## 4. Key differences with Binary Tree

1.  **Representation**: Use `vector<node*>` instead of two fixed pointers.
2.  **Iteration**: All recursive methods change the two fixed calls for a `for` loop that traverses the vector.
3.  **Flexibility**: We can add children retrospectively with `afegir_fill(a)`, an operation that does not exist in the standard theory binary tree.
