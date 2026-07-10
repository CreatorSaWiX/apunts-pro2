---
title: "Topic 3: Lists and iterators"
description: "Study of linked lists and iterators for traversing sequences in C++."
readTime: "9 min"
order: 3
---

## 3.1 Lists vs vectors

**Lists (`list`)** solve the high insertion cost in the middle of vectors $\mathcal{O}(n)$. They are formed by independent linked nodes. Adding or deleting an intermediate element costs only $\mathcal{O}(1)$.

> In algorithmics, $\mathcal{O}(n)$ (pronounced "O of n") means that **execution time or cost grows linearly** as more data comes in. For example: `cout << "Hello World" << endl;` is $\mathcal{O}(1)$, a constant element. A worse one: $\mathcal{O}(n^2)$ `for (int i = 0; i < n; i++) { for (int j = 0; j < n; j++) { ... } }`.

**Algorithmic disadvantages:**
- **No direct positions:** Using `L[i]` generates a compilation error.
- **Traversal cost:** To reach $n$, all previous nodes must be sequentially traversed.

**List Methods ($\mathcal{O}(1)$ guaranteed):** `push_back()`, `push_front()`, `pop_back()`, `pop_front()`, `front()` and `back()`.

:::listviz
:::

:::info
Although lists have a constant cost in the middle of the sequence, in general efficiency terms the use of `std::vector` is usually prioritized since it stores memory in contiguous blocks ready to read. We will only use lists if the problem demands constant intermediate insertions and deletions.
:::

---

## 3.2 Iterators

Faced with the lack of numerical indices (like `[i]`), lists must be traversed using **Iterators**. The iterator formally works as a tactical pointer of that active element:

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

## 3.3 The danger of altering the advanced itinerary: Insertions

Deleting or adding an element where we currently have the pointer anchored in the middle of a sequence will practically generate the loss of internal orientation throwing a *Segmentation Fault*: the previous active address has been completely alienated and `it++` no longer knows which "next" object to link to.

That is why in engineering use, C++ returns **a new iterator already focused on the valid next location** when you use:

- `it = L.insert(it, value)`: Inserts **before** the position and fixes it at the original point.
- `it = L.erase(it)`: Deletes the element and fixes it on the element to the right that will currently occupy this gap.

<!-- Animació interactiva -->

The protocol to manage it correctly requires avoiding for loops based on `while` pattern declarations:

```cpp
void netejar_llista(list<int>& L) {
    auto it = L.begin();
    
    while (it != L.end()) {
        if (*it == 10) {
            it = L.erase(it);   // Save the unlink from oblivion! Returns the next
        } 
        else if (*it == -1) {
            it = L.insert(it, 0); 
            advance(it, 2);     // Advance the focused out of the memory reading radius 
        } 
        else {
            it++;               // Natural ordinary iteration step
        }
    }
}
```

:::warning
This phenomenon is not unique. Using and traversing with `std::vector` is subject to the same destructive effects by the system if you remove values using vector.erase(it) and try to blindly run `it++` next in C++.
:::

Visualize step by step in first person in the project the technical assurance of the iterator observing which roles they return to hook up to the century!  

:::oopviz{simulation="llista_iteradors"}
:::
