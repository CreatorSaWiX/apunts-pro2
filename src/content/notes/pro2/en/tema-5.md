---
title: "Topic 5: Priority queues and general trees"
description: "Advanced binary heap structures for queues and general trees."
readTime: "8 min"
order: 5
---

## 5.1 The priority queue

Unlike a normal FIFO queue (the first to enter is the first to leave), a **priority queue** always serves the **largest or most urgent** element of all those waiting, regardless of when it entered. 

If we do this in a simple sorted vector, the `push` is absurdly slow $\mathcal{O}(N)$ moving all the elements. And if we make it unsorted, the `pop` will take $\mathcal{O}(N)$ searching where we hid the maximum. We need to bring the cost of both actions to a short **$\mathcal{O}(\log N)$**. What is the definitive tool? The **binary heap**.

---

## 5.2 The binary heap

It is a **complete binary tree** modeled inside a *simple flat vector*. The root is always the absolute maximum element of the whole structure.

The tree ignores position 0. The dominant root lives crowned at position 1. 
<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; align-items: center;">
<div>

For any node at position $i$:
- **Parent:** `i / 2`
- **Left Child:** `2 * i`
- **Right Child:** `2 * i + 1`

</div>
<div>

:::graph
```json
{
  "nodes": [
    { "id": "0", "label": "Parent (i/2)", "color": "#facc15" },
    { "id": "1", "label": "Node (i)", "color": "#10b981" },
    { "id": "2", "label": "Left Child (2i)", "color": "#3b82f6" },
    { "id": "3", "label": "Right Child (2i+1)", "color": "#3b82f6" },
    { "id": "4", "label": " ", "color": "#facc15" }
  ],
  "links": [
    { "source": "0", "target": "1" },
    { "source": "4", "target": "0" },
    { "source": "1", "target": "2" },
    { "source": "1", "target": "3" }
  ]
}
```
:::

</div>
</div>


No pointers or complex rules are needed, everything is blistering arithmetic in $\mathcal{O}(1)$.

### `push()` - insert and flow up
The element enters through the last position of the vector. Then it is evaluated from bottom to top: *Am I bigger than my boss?* If yes, position swap (`swap`) with him upwards, iterating the rise until finding its hierarchical place. Example:

:::algoviz{algorithm="heap_push"}
:::

### `pop()` - extract and flow down
The king (position 1) has left upon being processed. To replace it, we take the "pawn" (the very last in the vector) and plant it in square 1 of the root. Then it evaluates from top to bottom against the two children: *Which of my two new lower subjects is bigger than me?*. Position swap with the **largest** child, iterating downwards at once dropping into the hole it deserves.

:::algoviz{algorithm="heap_pop"}
:::

> **Heap time summary:** `top()` gets the root in the immediate **$\mathcal{O}(1)$**. Insertions and cleanups modify the altitude of the tree, requiring only jumps of cost **$\mathcal{O}(\log N)$**.

---

## 5.3 Customizing elements: the `>` operator

Often your elements to examine will be tuples or customizations like the `struct Persona` itself. Given that you ask the Heap to *place the maximum on top*, you will have to give game rules (C++) where you literally redefine the GREATER THAN operator (`>`) between two people in the global environment.

```cpp
struct Persona {
    string name;
    int priority;
};

// We overwrite the "greater than" logic of C++
bool operator>(const Persona& a, const Persona& b) {
    return a.priority > b.priority; 
}
```

In `main::` once we do `Heap<Persona> cua;` the internal directive already knows how to quickly classify VIPs by the age or pre-loaded score!

---

## 5.4 General trees (`Tree<T>`)

No more being limited to the closed left/right. In a `Tree<T>`, a Parent node can host an infinite arbitrary number of child nodes. A literal **"vector"** of children.

This changes the entire search matrix. The recursive stage of calling `t.left()` and `t.right()` is completely modified adopting an **iterative loop over the memberships `t.child(i)`**, but the rest of the recursive and immutable artifices remain exact.

The class has the following organization visible to the public:
- `Tree()`: standard absolute empty creator.
- `Tree(const T& val)`: creates the coronation (single base leaf of the value without children).
- `Tree(const T& val, vector<Tree> fills)`: Creates root assigning a value and injecting a multiple branching at once made thanks to a pre-loaded initial vector.

Practical consultants for our recursion:
1. `value()`: to read the heart of the root.
2. `num_children()`: for the top limit condition to the iterative bound ($N$ children).
3. `child(i)`: displacement in the internal vector extracting each parent node to restart the jump call.

### Deep search in a general
The amount of children is iterated from 0 to limit-1. In case of an inner hit we return the boolean to the upper chain stopping any erratic dispersion close to a saving $\mathcal{O}(N)$. We don't wait for everything to end like in the old two-wing resource, upon finding the key we short-circuit the strategy with a resounding True that ruthlessly pops towards the main root guaranteeing robust and impeccable performances to the modern data objectives system.

:::algoviz{algorithm="tree_general_search"}
:::
