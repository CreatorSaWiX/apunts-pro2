---
title: "Topic 2: Stacks and queues"
description: "Restricted access linear data structures and conventions in C++."
readTime: "8 min"
order: 2
---

## 2.1 C++ Conventions

During the course we will use some good practices to write safe and readable code. These conventions add to the concepts previously seen (`inline`, `static` or `template`).

- **Private attribute names (`_`)**: Private attributes end with an underscore to distinguish them intuitively from parameters outside the class. Ex: `value_`.
- **Initializer list (`:`)**: Used in the `cpp` to directly construct the class attributes before entering the constructor brackets, improving performance compared to assigning it later.
- **Preconditions (`assert`)**: Stops the program execution immediately if a condition is false, avoiding propagating silent errors and alerting the programmer of usage irregularities. Requires `#include <cassert>`.

```cpp [Box.cpp]
#include "Box.hh"
#include <cassert>

// Use of the initializer list (:) and assert
Box::Box(int initial_value) : value_(initial_value) {
    assert(initial_value >= 0); // Stops the program if the value is negative
}
```

:::oopviz{simulation="convencions_cpp"}
:::

---

## 2.2 The stack (`stack`)

Linear data structure with **LIFO (Last In, First Out)** policy: the last element to enter is the first to leave.

### Internal implementation
Internally it encapsulates a `std::vector` and restricts operations exclusively to its final end (the *top*), maintaining a fixed time cost of $\mathcal{O}(1)$.

<details>
<summary>Simplified example of own <code>Stack.hh</code> interface</summary>

```cpp
#ifndef STACK_HH
#define STACK_HH
#include <vector>
#include <cassert>

template <typename T>
class Stack {
    std::vector<T> elems_; 

public:
    void push(const T& x) { elems_.push_back(x); }
    void pop() {
        assert(elems_.size() > 0);
        elems_.pop_back(); 
    }
    const T& top() const {
        assert(elems_.size() > 0);
        return elems_.back();
    }
    bool empty() const { return elems_.empty(); }
    int size() const { return elems_.size(); }
};
#endif
```
</details>

### Using C++ `<stack>`
The C++ library provides the pre-built `std::stack` class. All these operations have constant cost $\mathcal{O}(1)$:

:::stackviz
:::

- **`push(x)`**: Adds the value `x` on top (at the top).
- **`top()`**: Consults (returns) the top element without deleting it.
- **`pop()`**: Deletes the top element. **Only deletes it, does not return it**.

```cpp
#include <stack>
using namespace std;

stack<int> S;
S.push(10);      // S: [10]
S.push(20);      // S: [10, 20] <- Top
int x = S.top(); // We save x=20
S.pop();         // Extracts the 20. S: [10] <- Top
```

:::oopviz{simulation="pila_cpp"}
:::

---

## 2.3 The queue (`queue`) 

Linear data structure with **FIFO (First In, First Out)** policy: the first to enter is the first to leave. It is a conventional queue (arrives at the back, extracted from the front).

### Internal implementation: Efficiency
Unlike the stack, methodically deleting at the beginning of a `std::vector` has a high cost $\mathcal{O}(n)$, because the rest of the elements must necessarily be shifted to fill the memory hole. 
For this reason, the queue does not use a base vector but generally a **`std::deque`** (Double Ended Queue), an optimized support that allows both right insertions and left extractions constantly in $\mathcal{O}(1)$.

<details>
<summary>Simplified example of own <code>Queue.hh</code> interface using <code>deque</code></summary>

```cpp
#ifndef QUEUE_HH
#define QUEUE_HH
#include <deque>
#include <cassert>

template <typename T>
class Queue {
    std::deque<T> elems_;

public:
    void push(const T& x) { elems_.push_back(x); }
    void pop() {
        assert(elems_.size() > 0);
        elems_.pop_front();
    }
    const T& front() const {
        assert(elems_.size() > 0);
        return elems_.front();
    }
    bool empty() const { return elems_.empty(); }
    int size() const { return elems_.size(); }
};
#endif
```
</details>

### Using C++ `<queue>`
Provided via `std::queue`. $\mathcal{O}(1)$ methods:

:::queueviz
:::

- **`push(x)`**: Adds `x` to the end (entering the line).
- **`front()`**: Consults the front element (the first ready to leave).
- **`pop()`**: Deletes and frees the front element (without returning it).

```cpp
#include <queue>
using namespace std;

queue<int> Q;
Q.push(10);        // Q: front[10]back
Q.push(20);        // Q: front[10, 20]back.
int x = Q.front(); // x=10, who was first in line.
Q.pop();           // Extracts front element. Q: front[20]back.
```
