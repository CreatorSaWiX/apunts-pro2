---
title: "Topic 3: Lists and iterators"
description: "Study of linked lists and iterators for traversing sequences in C++."
readTime: "9 min"
order: 3
---

## 3.1 Lists vs vectors

**Lists (`list`)** solve the high insertion cost in the middle of vectors $\mathcal{O}(n)$. They are formed by independent linked nodes. Adding or deleting an intermediate element costs only $\mathcal{O}(1)$.

<br>

**Disadvantages:**

- **No direct positions:** Using `L[i]` generates a compilation error.
- **Traversal cost:** To reach $n$, all previous nodes must be sequentially traversed.

**Methods $\mathcal{O}(1)$:** `push_back()`, `push_front()`, `pop_back()`, `pop_front()`, `front()` and `back()`.

:::listviz
:::

:::info
Although lists have a constant cost in the middle of the sequence, in general efficiency terms the use of `std::vector` is usually prioritized since it stores memory in contiguous blocks ready to read. We will only use lists if the problem demands constant intermediate insertions and deletions.
:::

---

## 3.2 Iterators

Lists must be traversed using **iterators**:

- `L.begin()`: Returns the iterator pointing to the **first** element.
- `L.end()`: Returns the iterator that points to the virtual cell **after the last** element (out of bounds).
- Its value is accessed using the asterisk as dereferencing: `*it = 50`.
- It moves to the next element by evaluating the plus symbol: `it++`.

```cpp
list<int> L = {10, 20, 30};

// 'auto' is used to simplify extremely long types like 'list<int>::iterator'
for (auto it = L.begin(); it != L.end(); it++) {
    *it += 5; 
}
```

**Main iterator variants:**
- **`const_iterator` (`cbegin`, `cend`)**: If the list is passed as constant `const`, it does not allow mutating the data through `*it = x;`.
- **`reverse_iterator` (`rbegin`, `rend`)**: Allows traversing the list from end to beginning maintaining technical comfort basically by applying `it++`.

Manually reversing from `L.end()` with iterators brings technical index problems since the evaluation starts "at the limit where there is nothing left". Note how the simulator advances regarding the reverse trace:

:::oopviz{simulation="iteradors_reversos"}
:::

---

## 3.3 Modifying lists while traversing: `insert` and `erase`

When deleting or inserting elements in a list while traversing with an iterator, the old iterator becomes invalidated. To fix this, C++ returns **a new valid iterator**:

- `it = L.insert(it, x)`: Inserts `x` **before** the current position and returns an iterator to the newly inserted element.
- `it = L.erase(it)`: Deletes the current element and returns an iterator to the **next element**.

### How to traverse and delete with `while`

If we delete an element, **we must not do `it++`**, because `erase` already moves to the next one:

```cpp
void netejar_llista(list<int>& L) {
    auto it = L.begin();
    
    while (it != L.end()) {
        if (*it == 10) {
            it = L.erase(it);   // Already advances to next (no it++)
        } 
        else if (*it == -1) {
            L.insert(it, 0);    // Inserts 0 before -1 (it stays on -1)
            it++;               // Advance to pass -1
        } 
        else {
            it++;               // Only advance if nothing was deleted
        }
    }
}
```

:::oopviz{simulation="llista_iteradors"}
:::
