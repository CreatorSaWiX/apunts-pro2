---
title: "Topic 8: Pointers and dynamic memory"
description: "Memory management in C++, operators, aliasing and heap management."
readTime: "20 min"
order: 9
draft: false
isUpdated: 2
---

## 8.1 Memory in C++: Stack vs Heap

To understand pointers, we first need to know how RAM is organized for a C++ program:

| Feature | Stack | Heap |
| :--- | :--- | :--- |
| **Management** | **Automatic**: compiler allocates and frees space. | **Manual**: programmer decides when to allocate (`new`) and free (`delete`). |
| **Speed** | Very fast (contiguous stack pointer). | Slower (searching for available blocks in OS). |
| **Size** | Limited and fixed (a few MB, risk of *Stack Overflow*). | Very large (all available RAM). |
| **Lifecycle** | Tied to scope within curly braces `{}`. | Persistent until `delete` is executed. |

```cpp
int f(int a, int b) {
    int n = a;      // Allocates space on the stack
    if (b > n) {
        int m = 2;  // 'm' is born on the stack entering the if block
        a = b;
    }               // 'm' is automatically destroyed here
    return a;
}                   // 'n', 'a', and 'b' are automatically destroyed when function ends
```

---

## 8.2 What is a pointer?

A **pointer** is a variable that, instead of storing a direct value (like `int` or `char`), stores the **memory address** of another variable.

### The Three Fundamental Operators

| Operator | Name | Function | Example |
| :--- | :--- | :--- | :--- |
| **`&`** | **Address-of** | Gets the memory address of an existing variable. | `int* p = &x;` |
| **`*`** | **Dereference** | Accesses/modifies the value located at the address held by the pointer. | `*p = 20;` |
| **`->`** | **Member access** | Directly accesses a field of a `struct`/`class`. Equivalent to `(*p).field`. | `p_node->value = 5;` |

### Fundamental Distinction: `p` vs `*p`

```cpp
int x = 10;
int y = 99;
int* p = &x; // 'p' stores the address of 'x' (e.g. 0x7ffd8)

// 1. Read
cout << p;   // Prints the address: 0x7ffd8
cout << *p;  // Prints the value of x: 10

// 2. Modify value (*p)
*p = 25;     // Modifies 'x' to 25!

// 3. Modify target (p)
p = &y;      // Now 'p' points to 'y'. 'x' remains 25 and *p is 99.
```

### Common Declaration Traps

1. **Multiple asterisk declaration:**
   ```cpp
   int *pa, *pb; // Correct: two pointers to int
   int* pa, pb;  // Danger: 'pa' is a pointer, but 'pb' is a plain int!
   ```
2. **Pointers to container or pair elements:**
   ```cpp
   vector<int> v = {10, 20, 30};
   int* pv = &v[1]; // Points to 20
   *pv += 5;        // v[1] is now 25

   pair<string, int> person = {"Anna", 21};
   int* page = &person.second;
   *page = 22;      // person.second is now 22
   ```

:::warning
An uninitialized pointer (`int* p;`) holds **garbage** (points to a random memory address). Attempting to read or write with `*p` will cause a **Segmentation Fault** or data corruption. If a pointer has no immediate target, always initialize it with **`nullptr`**:
```cpp
int* p = nullptr; // Safely points to "nowhere"
```
:::

## 8.3 Dynamic Memory Management: `new` and `delete`

The primary use of pointers is managing memory on the **Heap** at runtime:

### 1. Individual Objects
```cpp
int* p_int = new int(42);       // Allocates space for an int with value 42
delete p_int;                   // Frees the memory
p_int = nullptr;                // Prevents leaving a dangling pointer
```

### 2. Blocks / Dynamic Arrays (`new[]` and `delete[]`)
```cpp
int* arr = new int[100];        // Allocates a contiguous block of 100 ints
delete[] arr;                   // Frees the entire block (always with [])
arr = nullptr;
```

:::warning
- **`delete` vs `delete[]`:** Freeing a block created with `new[]` using just `delete` (without brackets) causes **undefined behavior** and memory corruption.
- **Memory Leak:** Occurs when the last pointer pointing to a Heap block is lost before calling `delete`:
  ```cpp
  int* p = new int(10);
  p = new int(20); // ERROR: The initial int (10) remains orphaned in RAM forever!
  ```
:::

---

## 8.4 Aliasing and Shallow vs Deep Copy

**Aliasing** occurs when two or more pointers hold the **same memory address**. Any modification through one alias alters the data for all others.

```cpp
int x = 10;
int* p1 = &x;
int* p2 = p1; // Aliasing: p2 points to the exact same cell as p1

*p2 = 99;
cout << *p1;  // Prints 99!
```

### Shallow vs Deep Copy
- **Shallow Copy:** Copies pointer addresses. Both objects share the same memory.
- **Deep Copy:** Allocates new memory on the Heap and duplicates the content.

---

## 8.5 Critical Pointer Errors

| Error | Cause | Consequence | Solution |
| :--- | :--- | :--- | :--- |
| **Segmentation Fault** | Dereferencing `nullptr` or garbage/out-of-bounds addresses. | Program terminates immediately (*crash*). | Always check `if (p != nullptr)` before using `*p` or `p->`. |
| **Memory Leak** | Losing the reference to a Heap block without `delete`. | Continuous and wasteful RAM consumption. | Ensure a matching `delete` for every `new`. |
| **Dangling Pointer** | Pointer that still stores an address after it was freed. | Corrupted data or SEGFAULT on access. | Assign `p = nullptr;` immediately after `delete`. |
| **Double Delete** | Calling `delete` twice on the same memory block. | Heap manager corruption (*crash*). | Set `p = nullptr;` (in C++, `delete nullptr;` is a no-op and safe). |

> **PRO2 Exam/Judge Tip:** Use the `-D_GLIBCXX_DEBUG` compiler flag so that STL containers report out-of-bounds accesses instead of causing silent errors.

---

## 8.6 Function Parameter Passing

| Passing Type | Syntax | When to Use in PRO2 |
| :--- | :--- | :--- |
| **By value** | `void f(int x)` | Small primitive types (`int`, `char`, `bool`, `double`). |
| **By constant reference** | `void f(const string& s)` | **The PRO2 standard** for large structures (`vector`, `list`, `BinTree`, `string`) to read without copy overhead. |
| **By reference** | `void f(int& x)` | When the function needs to **mutate the original object directly**. |
| **By pointer** | `void f(Node* p)` | When the parameter is **optional** (can be `nullptr`) or in linked structures. |

---

## 8.7 Application: Linked Structures (Nodes)

The primary purpose of pointers in PRO2 is building dynamic data structures that grow and shrink node by node in memory. Each element is stored in a **Node** (or `Item`):

```cpp
template <typename T>
struct Node {
    T value;        // Stored data
    Node* next;     // Pointer to next node (or nullptr if last)
};
```

### 8.7.1 Linked Stack (LIFO)
In a dynamic stack, we only need to keep a pointer to the top node (`top` or `p_top`):
- **`push(x)`**: Allocate a new node pointing to the previous top, and update the top pointer.
- **`pop()`**: Save the top node pointer, advance the top pointer (`top = top->next`), and `delete` the old top.

:::stackviz
:::

> **Relinking (`swap2Topmost`):** To swap the first two nodes without copying their values:
> 1. `Node* p2 = top->next;` (save second node)
> 2. `top->next = p2->next;` (first node now points to third)
> 3. `p2->next = top;` (second node now points to old first)
> 4. `top = p2;` (new top is p2)

---

### 8.7.2 Linked Queue (FIFO)
In a dynamic queue, two pointers are maintained: **`first`** (to pop from front) and **`last`** (to append at back):

:::queueviz
:::

> **Special Cases:**
> - Enqueueing into an empty queue: both `first` and `last` point to the new node.
> - Dequeueing the last element: if after `pop` the queue becomes empty (`first == nullptr`), make sure to also set `last = nullptr;`.

---

### 8.7.3 Deleting Nodes from the Middle
To remove a node from inside a singly linked sequence:

1. Locate the **previous** node (`ant`) before the one to be removed.
2. Store the target node: `Node* p_del = ant->next;`
3. Skip the node: `ant->next = p_del->next;`
4. Free memory: `delete p_del;`

:::pointerviz
:::

---

## 8.8 Judge Problem Checklist for Pointers

- **`nullptr` check:** Never access `p->next` or `p->value` if `p == nullptr`.
- **Proper deallocation with `delete`:** Every `new` must have a matching `delete` (or inside the class destructor).
- **Edge case handling:**
  - Completely empty structure (`top == nullptr` or `first == nullptr`).
  - Single-element structure (removal must reset both `first` and `last` to `nullptr`).
  - Deleting head node vs interior node.
- **Self-assignment guard:** When overloading `operator=`, always check `if (this != &other)` before deallocating own dynamic memory.
