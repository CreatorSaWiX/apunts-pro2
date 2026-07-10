---
title: "Topic 10: List Implementation"
description: "Doubly linked nodes, sentinels and iterators."
readTime: "20 min"
order: 11
draft: false
isUpdated: 1
---

## 1. Internal structure: double link and sentinels

Unlike the vector, a list does not keep the elements together in memory. Each element is in an independent **Node** (or `Item`) that knows who is in front of it and who is behind it.

### Sentinel nodes (`iteminf` and `itemsup`)
This implementation uses two special nodes that **always exist**, even if the list is empty:
- **`iteminf`**: The initial "dummy" node. Its `next` points to the first real element.
- **`itemsup`**: The final "dummy" node. Its `prev` points to the last real element.

```cpp
template <typename T>
class List {
    struct Item {
        T value;
        Item *next, *prev;
    };
    int _size;
    Item iteminf, itemsup; // Real nodes (not pointers)
public:
    // ...
};
```

## 2. The engine: inserting and deleting in $\Theta(1)$

The list is the ideal structure to insert/delete at any point if we already have the position. We just need to "rewire" the pointers.

### Insert an element by node pointer (`insertItem(previousPointer, nodePointer)`)

1. We connect the new node with its respective next and previous.
2. We update the pointers of the neighbors (`pitemprev` and `pitemprev->next`) so that they rewire the link with the introduced node.

::algoviz{algorithm="list_insert_node"}

### Insert an element by value (`insertItem(previousPointer, value)`)

1. We create the new `Item` node with `new`.
2. We fill in the value of the node's data.
3. We call the previous `insertItem` function to rewire the instantiated node.

::algoviz{algorithm="list_insert_value"}

### Extract an element (`extractItem(nodePointer)`)

1. The next node points directly to the previous one.
2. The previous node points directly to the next one.
3. We subtract 1 from the size of the list.

::algoviz{algorithm="list_extract_item"}

### Remove an element from memory (`removeItem(nodePointer)`)

1. We call `extractItem` to safely disconnect the node.
2. We free the memory of the node using `delete`.

::algoviz{algorithm="list_remove_item"}

### Empty the whole list (`removeItem()`)

1. While the size is greater than 0.
2. We keep extracting and deleting always the first element of the list (`iteminf.next`).

::algoviz{algorithm="list_remove_all"}

### Copy nodes from another list (`copyItems(original_list)`)

1. We iterate the original list backwards (from the last node to the first).
2. For each original node, we call `insertItem` at the very front (`&iteminf`, doing a _push_front_ effect). By adding the elements backwards always from the front, the final order of the copy is the original.

::algoviz{algorithm="list_copy_items"}
### How to move nodes (the 4-pointer rule)
In many exercises (like `moveToEnd` or `moveSecondToLast`), the Judge prohibits exchanging the `.value`. You must move the node physically:
1. **Disconnect**: Join the previous neighbor with the next (`p->prev->next = p->next` and `p->next->prev = p->prev`).
2. **Reconnect**: Insert the node in the new position adjusting its new `next` and `prev` and those of its new neighbors.

> If moving a node implies that it is a neighbor of itself (cases of 2 elements), be careful not to lose the pointer prematurely! The use of temporary pointers is recommended.

## 3. Iterators: The bridge to data

Since nodes are scattered, we cannot use `[i]`. We use **iterators**, which act as a smart pointer that knows how to move through the list.

- **`begin()`**: Points to the first real element (`iteminf.next`).
- **`end()`**: Points to the final sentinel node (`itemsup`). **It must never be dereferenced!**

```cpp
class iterator {
    List *plist;
    Item *pitem;
public:
    T& operator*() { return pitem->value; }
    iterator operator++() { // Preincrement (++it)
        pitem = pitem->next;
        return *this;
    }
};
```

::linkedlistviz

## 4. Memory management: The Rule of Three

Since we manage nodes with `new`, we have to be very careful:
1. **Destructor**: Must delete ALL nodes (using `removeItem` in a loop).
2. **Copy constructor**: Must create new nodes and copy the values.
3. **Assignment operator**: Clean the current list and copy the new one.

> In the assignment `l1 = l2`, we must always check for **self-assignment** (`this != &l`) so as not to delete the data we want to copy.

---

## Vector vs List: When to use which?

| Feature | Vector (`std::vector`) | List (`std::list`) |
| :--- | :--- | :--- |
| **Random access `[i]`** | $\Theta(1)$ | $\Theta(n)$ (must traverse) |
| **Insert at the end** | $\mathcal{O}(1)$ amortized | $\Theta(1)$ |
| **Insert at the beginning** | $\Theta(n)$ | $\Theta(1)$ |
| **Insert in the middle (with it)** | $\Theta(n)$ | $\Theta(1)$ |
| **Memory** | Contiguous block (faster for CPU) | Scattered nodes (more overhead) |

## Operations with Iterators

| Operation | Code | Explanation |
| :--- | :--- | :--- |
| **Insert** | `it = l.insert(it, val)` | Inserts **before** `it`. |
| **Delete** | `it = l.erase(it)` | Deletes `it` and returns the **next**. |
| **Traverse** | `for(auto it=l.begin(); it!=l.end(); ++it)` | The standard pattern. |
