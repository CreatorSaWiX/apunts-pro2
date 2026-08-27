---
title: "Topic 10: List Implementation"
description: "Doubly linked nodes, sentinels and iterators."
readTime: "20 min"
order: 11
draft: false
isUpdated: 1
---

## 10.1 Internal Structure: Double Link and Sentinels

Unlike vectors, a list does not store elements contiguously in memory. Each element resides in an independent **Node** (or `Item`) with two pointers: one to the previous element (`prev`) and one to the next (`next`).

### Sentinel Nodes (`iteminf` and `itemsup`)
To avoid handling edge cases for empty lists or operations at endpoints, the list contains two dummy sentinel nodes that **always exist** (they are direct class members, not pointers):

- **`iteminf`**: Initial sentinel. Its `next` points to the first real element.
- **`itemsup`**: Final sentinel. Its `prev` points to the last real element.

```cpp
template <typename T>
class List {
    struct Item {
        T value;
        Item *next, *prev;
    };
    int _size;
    Item iteminf, itemsup; // Real sentinel objects (not pointers)
    
    // Initialization for an empty list:
    void init() {
        _size = 0;
        iteminf.prev = nullptr;
        iteminf.next = &itemsup;
        itemsup.prev = &iteminf;
        itemsup.next = nullptr;
    }
};
```

> **The key advantage of sentinels:** Every real node **always** has a previous and a next neighbor. No `if` conditions are required when inserting or deleting at endpoints!

---

## 10.2 The Internal Engine: The 6 Private Methods

All list logic is built on 6 private helper methods operating directly on `Item*` pointers in $\Theta(1)$ constant time:

### 10.2.1 Insertion by node pointer: `insertItem(pitemprev, pitem)`
Inserts node `pitem` immediately after `pitemprev` by relinking 4 pointers:

```cpp
void insertItem(Item *pitemprev, Item *pitem) {
    pitem->next = pitemprev->next;
    pitem->next->prev = pitem;
    pitem->prev = pitemprev;
    pitemprev->next = pitem;
    _size++;
}
```

::algoviz{algorithm="list_insert_node"}

---

### 10.2.2 Insertion by value: `insertItem(pitemprev, val)`
Allocates a new node with `new`, assigns the value, and delegates relinking to the previous method:

```cpp
void insertItem(Item *pitemprev, const T& val) {
    Item *pitem = new Item;
    pitem->value = val;
    insertItem(pitemprev, pitem);
}
```

::algoviz{algorithm="list_insert_value"}

---

### 10.2.3 Node Extraction: `extractItem(pitem)`
Disconnects the node from the list by adjusting its neighbors' pointers. **Does not free memory.**

```cpp
void extractItem(Item *pitem) {
    pitem->next->prev = pitem->prev;
    pitem->prev->next = pitem->next;
    _size--;
}
```

::algoviz{algorithm="list_extract_item"}

---

### 10.2.4 Node Deletion: `removeItem(pitem)`
Disconnects the node and frees its memory with `delete`:

```cpp
void removeItem(Item *pitem) {
    extractItem(pitem);
    delete pitem;
}
```

::algoviz{algorithm="list_remove_item"}

---

### 10.2.5 Emptying the List: `removeItems()`
Frees every node one by one by always deleting the first real element:

```cpp
void removeItems() {
    while (_size > 0) {
        removeItem(iteminf.next);
    }
}
```

::algoviz{algorithm="list_remove_all"}

---

### 10.2.6 Copying a List: `copyItems(l)`
Traverses the source list **backwards** (`itemsup.prev` down to `&iteminf`), inserting at `&iteminf` (front). Inserting at the front reverses order, so going backwards preserves original order in $\Theta(n)$ time:

```cpp
void copyItems(const List& l) {
    for (Item *pitem = l.itemsup.prev; pitem != &l.iteminf; pitem = pitem->prev) {
        insertItem(&iteminf, pitem->value);
    }
}
```

::algoviz{algorithm="list_copy_items"}

---

### Moving Nodes Physically (Judge Exercises)
In many problems (like `moveToEnd` or `splice`), nodes must be moved without copying `.value`:
```cpp
// To move node 'p' right after 'dest_prev':
extractItem(p);             // 1. Disconnect
insertItem(dest_prev, p);   // 2. Reconnect at new position
```

## 10.3 Iterators: The Bridge to Data

Since list nodes are scattered across the Heap, random access `[i]` is not possible. The `iterator` class encapsulates a pointer to the current node (`Item *pitem`) and overloads operators to navigate the sequence:

```cpp
class iterator {
    Item *pitem;
    friend class List; // Grants List access to pitem
public:
    T& operator*() const { return pitem->value; }
    
    iterator& operator++() { // ++it (advance)
        pitem = pitem->next;
        return *this;
    }
    
    iterator& operator--() { // --it (retreat)
        pitem = pitem->prev;
        return *this;
    }
    
    bool operator==(const iterator& it) const { return pitem == it.pitem; }
    bool operator!=(const iterator& it) const { return pitem != it.pitem; }
};
```

### List Endpoints
- **`begin()`**: Returns an iterator to the first real element (`iterator(iteminf.next)`).
- **`end()`**: Returns an iterator to the final sentinel (`iterator(&itemsup)`).

:::warning
**Never dereference `*l.end()`:** `itemsup` is an empty dummy sentinel and contains no valid `T` value.
:::

### Inserting and Erasing via Iterators
```cpp
// Inserts 'val' BEFORE position 'it' in Θ(1):
iterator insert(iterator it, const T& val) {
    insertItem(it.pitem->prev, val);
    return iterator(it.pitem->prev);
}

// Erases element pointed by 'it' and returns iterator to the next in Θ(1):
iterator erase(iterator it) {
    Item *pnext = it.pitem->next;
    removeItem(it.pitem);
    return iterator(pnext);
}
```

:::linkedlistviz
:::

---

## 10.4 Memory Management: The Rule of Three

Thanks to private helper methods `removeItems()` and `copyItems()`, the Rule of Three is concise and robust:

```cpp
// 1. Destructor: frees all nodes
~List() {
    removeItems();
}

// 2. Copy Constructor: creates new list and duplicates nodes
List(const List& l) {
    init();
    copyItems(l);
}

// 3. Assignment Operator: cleans own and copies the other
List& operator=(const List& l) {
    if (this != &l) {
        removeItems();
        copyItems(l);
    }
    return *this;
}
```

---

## 10.5 Performance Comparison: Vector vs List

| Operation | Vector (`std::vector`) | List (`std::list`) |
| :--- | :---: | :---: |
| **Random Access (`[i]`)** | $\Theta(1)$ | $\Theta(n)$ |
| **Insert/Delete at end** | $\mathcal{O}(1)^*$ *(amortized)* | $\Theta(1)$ |
| **Insert/Delete at front** | $\Theta(n)$ | $\Theta(1)$ |
| **Insert/Delete in middle with iterator** | $\Theta(n)$ | $\Theta(1)$ |
| **Memory efficiency / Cache** | Excellent (contiguous block) | Fair (overhead of 2 pointers per element) |
