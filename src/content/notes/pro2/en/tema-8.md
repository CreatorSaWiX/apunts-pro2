---
title: "Topic 8: Pointers and dynamic memory"
description: "Memory management in C++, operators, aliasing and heap management."
readTime: "20 min"
order: 9
draft: false
isUpdated: 2
---

## 1. Memory in C++: Stack vs Heap

To understand pointers, we first need to know where data is stored. A program's memory is primarily divided into two zones:

| Feature | Stack | Heap |
| :--- | :--- | :--- |
| **Management** | Automatic (by the computer). | Manual (by the programmer). |
| **Speed** | Very fast. | Slower. |
| **Size** | Limited and fixed. | Very large (available RAM). |
| **Lifecycle** | Tied to the curly braces `{}` (stack frames). | We decide when they are born (`new`) and die (`delete`). |

**Scope example (Stack)**:
```cpp
int f(int a, int b) {
    int n = a;
    if (b > n) {
        int m = 2; // Born here
        a = b;
    } // m Dies here automatically
    return a;
} // n and a Die here
```

## 2. What is a pointer?

A **pointer** is a variable that, instead of storing a value (like an `int` or `char`), stores a **memory address**.

| Operator | Name | Function | Example |
| :--- | :--- | :--- | :--- |
| **`&`** | Address of | Gets the memory address of a variable. | `p = &x;` |
| **`*`** | Dereference | Accesses the content of the address the pointer holds. | `cout << *p;` |
| **`->`** | Arrow | Member access via pointer. Equivalent to `(*p).member`. | `pp->first = "b";` |

### Declaration traps and syntax

- **Multiple declaration**: The asterisk `*` must be placed for each variable.
  ```cpp
  int *pb, *pc; // Two pointers pointing to integers
  int* pb, pc;  // pb is a pointer, pc is a normal integer! (Typical error)
  ```
- **Pointer to container elements**:
  ```cpp
  vector<int> v = {1, 2, 3};
  int *p = &v[1]; // Points to '2'
  *p += 1;        // v[1] is now 3
  ```
- **Pointer to `pair` or `struct` members**:
  ```cpp
  pair<string, int> a = {"a", 7};
  int *pi = &a.second;
  *pi = 0; // a.second is now 0
  ```

> **`nullptr` vs Initialization**:
> - `int *p = nullptr;` -> The pointer points to "nothing". Safe.
> - `int *p;` -> The pointer points to a **random address** (garbage). Very dangerous.
> - `int *p = 5;` -> **ERROR**. You are saying that the memory address is number 5. This will cause a **SEGFAULT** for sure.

```cpp
int x = 10;
int* p = &x; // p points to x

cout << p;   // Prints an address: 0x7ffe...
cout << *p;  // Prints the value of x: 10
```

## 3. Dynamic memory management

This is the real utility of pointers: requesting memory at runtime.

### Objects vs dynamic vectors

We can request a single object or an entire block (vector) from the Heap using `new`, and free it with `delete`.

```cpp
// Simple objects
Data *pd = new Data(2025, 4, 2);
pair<int, int> *pp = new pair<int, int>(1, 2);

// Dynamic vectors (Very common in C)
int *pv = new int[100]; 
char *pc = new char[100000];
```

**Memory Leak**: Occurs when you lose the address and can no longer do `delete`.
```cpp
int *p = new int[100];
p = new int[100]; // ERROR: The address of the first vector is lost! Memory leak.
```

## 4. Aliasing and assignment

**Aliasing** occurs when two or more pointers point to the same memory address. Modifying the value through a pointer affects all other "aliases".

```cpp
int x = 10;
int* p1 = &x;
int* p2 = p1; // Aliasing: p2 points to where p1 points

*p2 = 20;
cout << x; // Will print 20!
```

**Advanced example**: A vector of pointers pointing to the same object.
```cpp
int x = 3;
vector<int*> v(10, &x); // 10 pointers pointing ALL to x

for (int i = 0; i < v.size(); ++i) {
    (*v[i])++; // We increment x 10 times!
}
cout << x; // Will print 13
```

## 5. The danger of pointers: common errors

Using pointers requires a lot of discipline. The most common errors in PRO2 are:

1.  **Segmentation Fault (SEGFAULT)**: Trying to access an address that does not belong to you.
    - Dereferencing `nullptr`: `int *p = nullptr; *p = 5;`.
    - Out-of-bounds access in vectors: `vector<int> v; v[13] = 0;`
2.  **Memory Leak**: Destroying the only reference to dynamic memory without freeing it.
3.  **Dangling Pointer**: Pointer pointing to an address that has already been freed with `delete`.
4.  **Double-Delete**: Doing `delete` twice on the same address (corrupts the heap).

> In the `Makefile`, use the `-D_GLIBCXX_DEBUG` flag. This activates security checks in the STL containers and will warn you of out-of-bounds accesses instead of giving you a silent SEGFAULT or garbage data.

| Operation | Iterator (STL) | Pointer (Low Level) |
| :--- | :--- | :--- |
| **Start** | `auto it = v.begin();` | `int *px = &x;` |
| **Access** | `*it = 5;` | `*px = 5;` |
| **Advance** | `it++;` | `px++;` (Advances one address) |
| **Reassign** | `it = v.erase(it);` | `px = &y;` |

> A pointer can be seen as a vector iterator, but a `std::list` iterator is not necessarily a pointer (internally it can be more complex).

---

## 6. Parameter passing

| Type | Syntax | Effect | Efficiency |
| :--- | :--- | :--- | :--- |
| **By value** | `f(int x)` | Value copy. | Low (if the object is large). |
| **By reference** | `f(int& x)` | Direct alias. | High. |
| **By pointer** | `f(int* pi)` | Passes the address. Faster than by value. |

**Increment example**:
```cpp
void inc(int *pi) {
    (*pi)++; // means *pi += 1;
}

int i = 5;
inc(&i); // i is now 6
```

In PRO2, we prefer **constant references** (`const T& x`) for large objects we don't want to modify, and **pointers** only when we need the parameter to be optional (`nullptr`) or for dynamic structures.

---

## 7. Application: Linked Structures (Nodes)

The real utility of pointers in PRO2 is to create data collections that grow and shrink node by node. Each element is stored in a **Node** (or `Item`).

### The Basic Node
```cpp
struct Item {
    T value;    // The data
    Item* next; // The "cable" to the next node
};
```

### 7.1 The Stack - LIFO Model
In a linked stack, we only have one pointer to the top (`ptopitem`). Every time we do `push`, the new node points to the old top.

::stackviz

> **`swap2Topmost()` Exercise**: To swap the first two nodes without touching the `.value`s, you have to:
> 1. Save the second node in an auxiliary pointer: `Item *p2 = ptopitem->next;`
> 2. Relink: `ptopitem->next = p2->next;`
> 3. Make the new first the one that was second: `p2->next = ptopitem;`
> 4. Update the top: `ptopitem = p2;`

### 7.2 The Queue - FIFO Model
In a queue, we need two pointers: `first` (to pop) and `last` (to add).

::queueviz

> **`operator[]` Exercise**: Since a linked queue is not a vector, to find element `i` you have to do a `for` loop that advances the pointer `p = p->next` exactly `i` times starting from `first`.

### 7.3 How to delete nodes in the middle
To delete a node (like in `removeFirstOccurrence` - Judge: X87185), you need to "skip" it:
1. Find the node **before** the one you want to delete (`ant`).
2. Make the jump: `ant->next = ant->next->next;`
3. Free the memory: `delete p_to_delete;`

::pointerviz

---

## Checklist for the Judge (Pointers)
- **Did you put `nullptr`?** Always check if a pointer is null before doing `p->next`.
- **Did you do `delete`?** Every `new` must have its `delete` to avoid Memory Leaks.
- **Empty cases**: What does your code do if the stack/queue is empty? What if it has only 1 element?
- **Self-assignment**: In the use of `operator=`, did you check `if (this != &s)`?
