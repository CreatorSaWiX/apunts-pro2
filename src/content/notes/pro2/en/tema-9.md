---
title: "Topic 9: Vector implementation"
description: "Memory management, the Rule of Three and amortized cost."
readTime: "15 min"
order: 10
draft: false
isUpdated: 1
---

## 1. Internal structure and Attributes

A vector is a **dynamic array** on the *heap*. To manage it, we use our own `namespace` and three attributes:

- **`T* data_`**: Pointer to the memory block where we store the elements.
- **`int size_`**: Currently occupied elements.
- **`int capacity_`**: Total reserved memory.

```cpp
namespace pro2 {
    template <typename T>
    class Vector {
        T* data_;
        int size_, capacity_;
        void reallocate_(int new_cap); // The "move"
    public:
        using iterator = T*; // Simple iterator = Pointer
        // ... methods ...
    };
}
```

## 2. Rule of three (Memory Management)

If a class manages dynamic memory, it needs these 3 methods to avoid **segfaults** or **leaks**:

### A. Copy constructor
Creates a real copy in a new memory block, not just copies the pointer.
```cpp
Vector(const Vector& v) {
    data_ = new T[v.capacity_];
    size_ = v.size_;
    capacity_ = v.capacity_;
    for (int i = 0; i < size_; ++i) data_[i] = v.data_[i];
}
```

### B. Assignment operator
Frees old memory before copying the new one.
```cpp
Vector& operator=(const Vector& v) {
    if (this != &v) {
        delete[] data_; // 1. Clean
        data_ = new T[v.capacity_]; // 2. Reserve
        size_ = v.size_;
        capacity_ = v.capacity_;
        for (int i = 0; i < size_; ++i) data_[i] = v.data_[i]; // 3. Copy
    }
    return *this;
}
```

### C. Destructor
The only one that definitely frees the memory.
```cpp
~Vector() { delete[] data_; }
```

## 3. Operators

When you write `s += s2` in main, the C++ compiler checks if the class has defined a function literally called `operator+=`. If it finds it and accepts the arguments you pass to it (in this case an object of type Stack), it makes the direct call.

```cpp
Stack<int> s1, s2;
s1 += s2;           // Natural syntax (in main)
s1.operator+=(s2);  // Equivalent to s1 += s2;
```

| Category | Function definition (c+pp) | Call from main |
| :--- | :--- | :--- |
| **Access** | `T& operator[](int i)` | `v[i] = x;` |
| **Comparison** | `bool operator<(const V& v)` | `if (a < b)` |
| **Assignment** | `void operator+=(const V& v)` | `a += b;` |
| **Arithmetic** | `V operator+(const V& v)` | `c = a + b;` |
| **Stream** | `ostream& operator<<(ostream& o, const V& v)` | `cout << v;` |

## 4. Access and iterators

Access is direct $\Theta(1)$ by pointer arithmetic.
- **The `[]` operator**: It is duplicated to allow reading in `const` objects.
- **Iterators**: In a vector, an `iterator` is simply a `T*`.

```cpp
T& operator[](int i) { return data_[i]; }
const T& operator[](int i) const { return data_[i]; }

iterator begin() { return data_; }
iterator end() { return data_ + size_; }
```

## 5. The engine: `reallocate_` (The move)
Private method that changes the capacity of the vector. Expensive operation $\mathcal{O}(n)$.
1. Request new block.
2. Copy old elements.
3. **`delete[]`** old block.
4. Update pointer and capacity.

```cpp
void reallocate_(int new_cap) {
    T* new_data = new T[new_cap];      // 1. New block
    for (int i = 0; i < size_; ++i) {
        new_data[i] = data_[i];       // 2. Copy
    }
    delete[] data_;                   // 3. Clean old
    data_ = new_data;                 // 4. Update
    capacity_ = new_cap;
}
```

## 6. Insertion and growth
- **`push_back`**: If it's full, it **doubles** the capacity.
- **Amortized Cost**: Although resizing is $\mathcal{O}(n)$, it only happens every $2^k$ times. The average is **$\mathcal{O}(1)$**.

```cpp
void push_back(const T& x) {
    if (size_ == capacity_) {
        reallocate_(capacity_ == 0 ? 1 : 2 * capacity_);
    }
    data_[size_++] = x;
}
```

::vectorviz

## 7. Extraction and Thrashing
To avoid expensive oscillations (constantly doubling/halving):
- **Strategy**: Wait until it's at **1/4** capacity to reduce it to a **half**.

```cpp
void pop_back() {
    --size_;
    if (size_ > 0 && size_ == capacity_ / 4) {
        reallocate_(capacity_ / 2);
    }
}
```

---

## Complexity Summary

| Operation | Complexity | Note |
| :--- | :--- | :--- |
| **Access `[i]`** | $\Theta(1)$ | Direct. |
| **`push_back`** | $\mathcal{O}(1)^*$ | *Amortized. Worst case $\mathcal{O}(n)$. |
| **`pop_back`** | $\mathcal{O}(1)^*$ | *Amortized. We avoid Thrashing. |
| **`insert/erase`** | $\mathcal{O}(n)$ | All subsequent elements must be shifted. |
| **`size/empty`** | $\Theta(1)$ | Attribute query. |

## Extra: Output operator
Very useful for debugging the implementation:
```cpp
template <typename T>
ostream& operator<<(ostream& os, const Vector<T>& v) {
    os << "[";
    for (int i = 0; i < v.size(); ++i) {
        os << v[i] << (i == v.size() - 1 ? "" : ",");
    }
    return os << "]";
}
```
