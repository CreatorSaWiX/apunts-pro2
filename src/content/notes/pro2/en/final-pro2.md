---
title: "Final PRO2"
description: "Summary of topics 8 to 12 of PRO2 based on the real implementations of the Jutge"
readTime: "8 min"
order: 14
draft: false
isUpdated: 1
---

## 1. Topic 8: Pointers and dynamic memory

### Operators
*   **`&x`**: Gets the **memory address** where the variable `x` is stored.
*   **`*p`**: Access the value stored at the memory address it points to. Remember that `int* p` and `int *p` are the same.
*   **`p->membre`**: Equivalent to `(*p).membre`. Access the member of a struct pointed to by `p`.

> **`nullptr` or `NULL`**: Safe value indicating that the pointer does not point to any address (always initialize with `nullptr`, never leave them pointing to garbage: `int *p = nullptr;`).

### Common errors
1.  **Segmentation Fault (SEGFAULT)**: Trying to access an address that does not belong to you or dereferencing `nullptr`.
Example
2.  **Memory Leak**: Losing the only pointer that pointed to memory requested with `new` without making the corresponding `delete`.
Example
3.  **Dangling Pointer**: Pointer that points to a memory address that has already been freed with `delete`.
Example
4.  **Double-Delete**: Trying to `delete` twice on the same memory address (corrupts the Heap stack).
Example

### Parameter Passing
*   **By value (`f(int x)`)**: Copy of the value. Inefficient for large structures/objects.
*   **By reference (`f(int& x)`)**: Modifications affect the main. We prefer `const T& x` for efficiency if we do not want to modify the object.
*   **By pointer (`f(int* px)`)**: Passes the memory address. Allows the parameter to be optional by passing `nullptr`.

### Tips
- **Have you put `nullptr`?** Always check if a pointer is null before doing `p->next`.
- **Have you done `delete`?** Each `new` must have its `delete` to avoid Memory Leaks.
- **Empty cases**: What does your code do if the stack/queue is empty? What if it only has 1 element?
- **Self-assignment**: In the use of `operator=`, have you checked `if (this != &s)`?

### X87185: Deletion in Stack (`removeFirstOccurrence` - stack.hh)
To remove elements in a simple structure, we use a **window of size 2** using two pointers (`pitem` and `prev`). The pointer `prev` must necessarily be initialized to `nullptr` instead of leaving it empty.
```cpp
void removeFirstOccurrence(T value) {
    Item *pitem = ptopitem;
    Item *prev = nullptr; // Safe initialization
    
    // 1. Search for the element to delete
    while (pitem != nullptr && pitem->value != value) {
        prev = pitem;
        pitem = pitem->next;
    }

    // 2. If found, disconnect it and free memory
    if (pitem != nullptr) {
        Item *paux = pitem;
        pitem = pitem->next;

        if (prev == nullptr) ptopitem = pitem; // If it is the first element (top)
        else prev->next = pitem;              // If it is in the middle or at the end
            
        delete paux; // Free memory of the destroyed node
        _size--;
    } 
}
```

### X17005: Move elements in Queue (`moveFrontToLast` - queue.hh)
Physical displacement of nodes in $\Theta(1)$ without having to delete and create new nodes with `new`:
```cpp
void moveFrontToLast() {
    if (first == nullptr || first == last) return; // Less than 2 elements: nothing to do

    Item *oldFirst = first;   // 1. Save pointer to the first node
    first = oldFirst->next;   // 2. The second becomes the new first

    last->next = oldFirst;    // 3. The old first becomes the next of the last
    oldFirst->next = nullptr; // 4. Mark the new end as NULL
    last = oldFirst;          // 5. Update the final pointer to the moved one
}
```

---

## 2. Topic 9: Implementation of Vectors

A vector is a **dynamic array** saved in a contiguous block of memory in the *Heap*.

### Class Attributes
*   `T* data_`: Pointer to the Heap block where elements are stored.
*   `int size_`: Currently occupied elements.
*   `int capacity_`: Total memory reserved in the Heap.

### The Rule of Three
If a class manages dynamic memory directly (using `new`), it must necessarily implement three special methods to prevent C++ from making *shallow copies* that point to the same addresses:

### A. Copy Constructor (Deep Copy)
Creates a new object reserving its own memory in the Heap and copying all elements:
```cpp
Vector(const Vector& v) {
    data_ = new T[v.capacity_];
    size_ = v.size_;
    capacity_ = v.capacity_;
    for (int i = 0; i < size_; ++i) data_[i] = v.data_[i];
}
```

### B. Assignment Operator (`operator=`)
Cleans the current object, avoids self-assignment and copies deeply:
```cpp
Vector& operator=(const Vector& v) {
    if (this != &v) { // 1. Avoids self-assignment (l1 = l1)
        delete[] data_; // 2. Free old memory
        data_ = new T[v.capacity_]; // 3. Request new memory
        size_ = v.size_;
        capacity_ = v.capacity_;
        for (int i = 0; i < size_; ++i) data_[i] = v.data_[i]; // 4. Copy data
    }
    return *this; // Allows chained assignment (a = b = c)
}
```

### C. Destructor
The only one in charge of permanently freeing the memory of the block:
```cpp
~Vector() { delete[] data_; }
```

### Growth and Amortized Cost
*   **`push_back`**: If the vector gets full (`size_ == capacity_`), it requests a block that **doubles** the capacity ($2 \times \text{capacity}$). This resizing costs $\mathcal{O}(n)$, but happening only every $2^k$ times, the cost of each insertion is **amortized cost $\mathcal{O}(1)$**.
*   **`pop_back` (Thrashing)**: To avoid constant resizing at the limit (adding/deleting continuously), we do not reduce immediately. The capacity is only reduced by half when the number of occupied elements drops to **$1/4$** of the total capacity. Amortized cost $\mathcal{O}(1)$.

::vectorviz

---

## 3. Topic 10: Implementation of Lists

Unlike vectors, a list hosts each element in a scattered node in memory that contains forward and backward links.

### Node Struct
```cpp
struct Item {
    T value;
    Item *next; // Next node
    Item *prev; // Previous node
};
```

### Sentinel Nodes (`iteminf` and `itemsup`)
This implementation uses two real extreme nodes that **always exist** (even if the list is empty):
*   **`iteminf`** (initial dummy): `iteminf.next` points to the first real element.
*   **`itemsup`** (final dummy): `itemsup.prev` points to the last real element.
*   **Advantage**: Completely eliminates the treatment of special cases for `nullptr` pointers at the ends when inserting or removing nodes.

::linkedlistviz

### Insert/Delete in $\Theta(1)$
If we have the iterator or the address of the node, we can "rewire" the links directly in constant time:
*   **Insert before `p`**: 
    1.  Create new node `n`.
    2.  `n->prev = p->prev; n->next = p;`
    3.  `p->prev->next = n; p->prev = n;`
*   **Delete node `p`**:
    1.  `p->prev->next = p->next;`
    2.  `p->next->prev = p->prev;`
    3.  `delete p;`

### The use of Internal Helpers (`extractItem` and `insertItem` - list.hh)
In the Jutge's list classes, you have two very powerful private methods available that handle rewiring the links and updating `_size` transparently:
*   `void extractItem(Item *pitem)`: Disconnects the node without freeing it from memory.
*   `void insertItem(Item *pitemprev, Item *pitem)`: Connects the node directly after the specified previous node.

### X25312: Move List Elements (`moveSecondToLast` - list.hh)
Using these helpers, moving elements without touching the `.value` is very simple and totally avoids having to manually modify the 4 double-link pointers:
```cpp
void moveSecondToLast() {
    if (_size > 2) {
        Item *second = iteminf.next->next; // 1. We find the second element
        extractItem(second);                // 2. We physically disconnect it
        insertItem(itemsup.prev, second);   // 3. We insert it before the upper sentinel
    }
}
```

### Comparative Costs and Complexities Table

| Structure / Operation | Random access `[i]` | Insertion Beginning | Insertion End | Insertion Middle (with position / it) | Memory distribution |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **`std::vector`** | $\Theta(1)$ | $\Theta(N)$ | $\mathcal{O}(1)^*$ | $\Theta(N)$ | Contiguous block (excellent local cache). |
| **`std::list`** | $\Theta(N)$ | $\Theta(1)$ | $\Theta(1)$ | $\Theta(1)$ | Scattered nodes connected by pointers. |

*\*Amortized cost. In the worst case for vector it is $\mathcal{O}(N)$ due to memory reallocation (`reallocate_`).*

---

## 4. Topic 11: Implementation of Binary Trees (`Arbre.hh`)

Dynamic and recursive data structure where each node has exactly two subtrees (left and right).

### Node Structure
```cpp
struct node_arbre {
    T info;
    node_arbre *segE; // Left subtree
    node_arbre *segD; // Right subtree
};
node_arbre *primer_node; // Root (nullptr if empty)
```

### Rule of Three in Trees
1.  **Deep copy**: It is done through a recursive immersion in **pre-order** that duplicates each node in the heap.
2.  **Destruction**: It must be done recursively in **post-order** (first we free the left subtree, then the right and finally we `delete` the current root to avoid losing the addresses).

### A. Cycle control in `plantar(x, a1, a2)`
When we plant a new node `x` with two subtrees `a1` and `a2`, the method **moves the pointers** instead of duplicating to achieve a cost of $\Theta(1)$. However, it has a crucial check to avoid **unstable aliasing** in case we try to put the same subtree on the left and on the right (`plantar(x, a, a)`):
```cpp
void plantar(const T &x, Arbre &a1, Arbre &a2) {
    if (this != &a1 && this != &a2) {
        if (primer_node == nullptr) {
            node_arbre* aux = new node_arbre;
            aux->info = x;
            aux->segE = a1.primer_node; // Moves left child directly
            
            // If they are the same physical tree, a deep copy of one of them must be made to avoid cycles
            if (a1.primer_node == a2.primer_node) {
                aux->segD = copia_node_arbre(a1.primer_node);
            } else {
                aux->segD = a2.primer_node; // Moves right child directly
            }
            
            primer_node = aux;
            a1.primer_node = nullptr; // Leaves original parameters empty
            a2.primer_node = nullptr;
        }
        // ...
    }
}
```

### B. Transfer and destruction of the parent in `fills(fe, fd)`
The `fills` method divides the tree into two branches in $\Theta(1)$ by passing memory references directly, and it is very important to note that it **does `delete aux` to free only the memory of the parent/root node** that is no longer needed, without affecting the subtrees below.
```cpp
void fills (Arbre &fe, Arbre &fd) {
    if (primer_node != nullptr && fe.primer_node == nullptr && fd.primer_node == nullptr) {
        if (&fe != &fd) {       
            node_arbre* aux = primer_node;
            fe.primer_node = aux->segE; // Direct pointer passing
            fd.primer_node = aux->segD;
            primer_node = nullptr;      // Leaves the parent empty
            delete aux;                 // Exclusively frees the old root node
        }
        // ...
    }
}
```

---

## 5. Topic 12: Implementation of General Trees (`ArbreG.hh`)

A general (n-ary) tree allows each node to have an unlimited number of descendants.

### Node Structure
```cpp
struct node_arbreGen {
    T info;
    vector<node_arbreGen*> seg; // Dynamic vector of pointers to children
};
node_arbreGen* primer_node; // Pointer to the root
```

### Recursion with Loops
Since the degree of the nodes is dynamic, recursive operations can no longer be written with two fixed calls (left and right). We must iterate using a **`for` loop** over the `seg` vector:
*   **Recursive copy**: Allocates a new node, reserves its vector of children with the same size as the original and, with a loop, recursively copies each child.
*   **Deletion**: Recursively traverses all the children of the `seg` vector in a loop to delete them before freeing the current parent node.

### Particularities of the Jutge Operations (`ArbreG.hh`)

### A. Ownership transfer in `plantar(x, v)` and `fills(v)`
*   **`plantar(x, v)`**: Efficiently transfers the pointers of all the subtrees contained in the vector `v` as children of the new root `x` in time $\mathcal{O}(N)$ (where $N$ is the number of children), and immediately **sets the trees in `v` as empty** (`v[i].primer_node = nullptr`) to prevent aliasing.
*   **`fills(v)`**: Frees memory of the current root node with `delete aux` and places all the children exactly as new trees inside the vector `v` in $\mathcal{O}(N)$.

### B. Forced deep copy in `afegir_fill(a)` and `fill(a, i)`
*   **`afegir_fill(a)`**: **Warning!** Unlike `plantar`, this method **does not transfer pointers** directly; instead, it makes a **deep copy of tree `a`** through `copia_node_arbreGen(a.primer_node)`.
*   **`fill(a, i)`**: Takes the `i`-th child of tree `a` and makes a deep copy as the new current tree. Remember that the call is **1-indexed** (i.e., child 1 of the tree is internally equivalent to the indexed position `0` of the children vector `seg[i-1]`).

---

## 6. Strategy for tree exercises (Leap of faith)

The vast majority of tree problems are solved with an immersive recursive function. This strategy allows writing ultra-clean exam codes without having to try to mentally simulate the processor's call stack:

1.  **The Base Case (The stopping condition)**: Forget about the whole tree and ask yourself: *What is the simplest thing they can pass me?* 
    *   In trees, it is almost always an empty tree (`node == nullptr`). Example `X75329`: What is the frequency of a value in an empty tree? `0`. This is your base case.
    *   If the problem requires calculating a property on **paths from the root to a leaf**, the base case **cannot be the empty tree**, since we wouldn't know what to return for a null pointer without altering the semantics or violating the definition of a path. Therefore, in these special cases, the base case is the **leaf node** (`m->segE == nullptr && m->segD == nullptr`). In addition, cases where the node only has a single active child will have to be explicitly handled to force the path to continue towards it. Example: `X67695`.
2.  **Blind Faith (The Leap of Faith)**: **Write the recursive calls** on the active children (e.g.: `T res = f(m->segE);`), blindly assuming and trusting that each of these calls will *magically* return the correct answer for its entire respective subtree. 
    *   *Golden rule:* Do not try to mentally simulate or imagine how the function will go down through the subtrees; simply call it and save the result.
3.  **Your Only Job (The current node)**: Identify what local data you need from the current node. It is usually the value of the root you are currently at (`m->info`).
4.  **The Final Combination (The assembly)**: How do you join the current local data (Step 3) with the results returned by the recursive calls of your children (Step 2)?
    *   This is where you apply the algebraic logic of the problem (operations like `+`, `&&`, comparisons `>` or conditionals to choose the best result). 
    *   Example: You return `m->info + (left > right ? left : right)`.

### Strategy Equivalence: Binary vs General (n-ary)

| Phase | Binary Tree (`Arbre.hh`) | General Tree (`ArbreG.hh`) |
| :--- | :--- | :--- |
| **1. Base Case** | `if (m == nullptr) return ...;`<br>*(Or leaf node case if talking about paths)* | `if (m == nullptr) return ...;`<br>*(Or leaf node case if talking about paths)* |
| **2. Leap of Faith** | Direct recursive calls to left child (`m->segE`) and right (`m->segD`). | `for` loop that recursively accumulates the result of each of the children into the vector `m->seg`. |
| **3. Job at the Node** | Process data from the current node (`m->info`). | Process data from the current node (`m->info`). |
| **4. Combination** | Combine local job with left and right. | Combine local job with the sum/accumulation obtained in the children's loop. |

### Example 1: Sum of the maximum path (`max_suma_cami` - Binary)
*Statement: Calculate the sum of the maximum sum path from the root to a leaf of a non-empty binary tree.*

*   **Base Case**: If a node is a leaf (null children), the maximum path is simply its own value.
*   **Leap of Faith**: We assume that the left child gives me its maximum path `maxE`, and the right one `maxD`.
*   **Combination**: My maximum path will be my value (`m->info`) plus the maximum of the paths of the two subtrees.

```cpp
T max_suma_cami_aux(node_arbre* m) {
    // Base Case: Leaf Node
    if (m->segE == nullptr && m->segD == nullptr) return m->info;

    // Leap of Faith: We assume that below it already works
    T maxE = max_suma_cami_aux(m->segE);
    T maxD = max_suma_cami_aux(m->segD);

    // Combination
    if (m->segE == nullptr) return m->info + maxD;
    if (m->segD == nullptr) return m->info + maxE;
    return m->info + max(maxE, maxD);
}
```

### Example 2: Search for a value (`buscar` - General Tree)
*Statement: Indicate whether a value `x` is found or not in a general n-ary tree.*

*   **Base Case**: If the tree is empty, it is impossible for it to be there (`return false`).
*   **My job**: Am I the node we are looking for? `if (m->info == x) return true;`.
*   **Leap of Faith in n-aries**: If I am not it, I ask each of my children in a loop if they have it. If any child tells me `true`, I propagate the `true` upwards. If no child has it, I return `false`.

```cpp
bool buscar_aux(node_arbreGen* m, const T& x) {
    if (m == nullptr) return false; // Base Case
    
    if (m->info == x) return true; // My job

    // Leap of Faith in n-aries: loop over the vector of children
    int n = m->seg.size();
    for (int i = 0; i < n; ++i) {
        if (buscar_aux(m->seg[i], x)) return true; // If a child finds it, we return true
    }
    return false; // No child has found it
}
```

### Example 3: The Sum Tree (`arb_sumes` - Binary)
*Statement: Return a new identical tree in shape where each node contains the sum of its entire corresponding subtree.*

*   **Base Case**: If the tree is empty, the sum subtree is null and the sum is `0`.
*   **Leap of Faith**: We assume that the left child correctly calculates its sum tree `asumE` and returns its accumulated sum `sumE`. The same for the right with `asumD` and `sumD`.
*   **My job + Combination**: My sum is `m->info + sumE + sumD`. I create a new node with this value and connect it with the two resulting subtrees.

```cpp
// Auxiliary that receives the current node, builds the sum subtree in 'res' and returns the sum
static int arb_sumes_aux(node_arbre* m, node_arbre*& res) {
    if (m == nullptr) {
        res = nullptr;
        return 0; // Base case
    }

    res = new node_arbre;
    
    // Leap of Faith: We assume that left and right build themselves and give us the sums
    int sumE = arb_sumes_aux(m->segE, res->segE);
    int sumD = arb_sumes_aux(m->segD, res->segD);

    // My job + Combination
    res->info = m->info + sumE + sumD;
    return res->info;
}
```
