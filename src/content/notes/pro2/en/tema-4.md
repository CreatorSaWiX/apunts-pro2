---
title: "Topic 4: Immersion and binary trees"
description: "Overcome the limitations of recursion and achieve total and fast mastery of binary trees."
readTime: "8 min"
order: 4
---

## 4.1 Immersion

When a function calls itself recursively, memory requests a new block (*frame*) to execute its particular instance. In the exam we cannot alter the "public signature" (if they tell you do `reverse(string s)`, you cannot add arguments on your own). The **Immersion** strategy responds in this way:
1. Create a second auxiliary function.
2. Make the public function pre-load this hidden immersion function.

### Reverse String (`reverse`)
We need an accumulator to store the rotated *string*. Passing a simple second parameter by immersion we manage to carry the calculation between instances:

```cpp
// 1. Immersed function (auxiliary)
string reverse__(string s, string reversed) {
    if (s.empty()) return reversed;
    return reverse__(s.substr(1), s[0] + reversed);
}

// 2. Public function (Original interface)
string reverse(string s) {
    return reverse__(s, ""); 
}
```

### Fibonacci in $\mathcal{O}(n)$

Conventional exponential recursion when calculating Fibonacci repeated calls upon calls pitifully causing mathematical paralysis of $\mathcal{O}(2^n)$. With a single Immersion we lower and solve the cost to linear $\mathcal{O}(n)$ passing through the journey directly the evolution of the last two numbers obtained.

```cpp
int fibonacci__(int n, int a, int b) {
    if (n == 0) return a;
    return fibonacci__(n - 1, b, a + b); 
}

int fibonacci(int n) {
    return fibonacci__(n, 0, 1);
}
```

---

## 4.2 The binary tree (`BinTree<T>`)

It is a strictly recursive data structure: either it is an *absolute void*, or it has a central node (*root*) associated with a maximum of two exact descendants (`left` and `right`) which in turn, are considered respective `BinTree` subtrees in themselves.

:::graph
```json
{
  "nodes": [
    { "id": "1", "label": "Root", "color": "#10b981" },
    { "id": "2", "label": "Left", "color": "#3b82f6" },
    { "id": "3", "label": "Right", "color": "#3b82f6" },
    { "id": "4", "label": "Left child" },
    { "id": "5", "label": "Left child", "color": "#ef4444" },
    { "id": "6", "label": "Right child" },
    { "id": "7", "label": "Right child", "color": "#ef4444" }
  ],
  "links": [
    { "source": "1", "target": "2", "label": "left()" },
    { "source": "1", "target": "3", "label": "right()" },
    { "source": "2", "target": "4" },
    { "source": "2", "target": "5" },
    { "source": "3", "target": "6" },
    { "source": "3", "target": "7" }
  ]
}
```
:::

> A BinTree tree **CANNOT be modified**. Once you make the constructor and close it, you will never be able to access licenses like *"take its native right branch and delete it with a delete or set"*. To alter data, one operates **completely re-constructing the same tree as a New Instance** thanks to taking advantage of all the old parts along with the change. (See below, section 4.3).

:::bintreeviz
:::

---

## 4.3 Basic and mutation functions

Let's transform the two most common problems in the `BinTree` class (Knowing the total height `height` or searching if a leaf exists `cerca`):

:::algoviz{algorithm="cerca_height"}
:::

Since the tree does not have free pointers or assignment licenses of native variables like positive Vectors, **any operation that "modifies" a tree** in theory, in practice C++, what it does is rebuild it entirely creating new nodes for the area or branch that has undergone the change! Immutable revisions.

---

## 4.4 Global traversals

### Depth-First Search (DFS)
Go down the tunnel to the end before scanning laterally. 

- **Preorder:** *Root → Left → Right.*
:::algoviz{algorithm="preordre"}
:::

- **Inorder:** *Left → Root → Right.*
:::algoviz{algorithm="inordre"}
:::

- **Postorder:** *Left → Right → Root.*
:::algoviz{algorithm="postordre"}
:::

### Breadth-First Search (BFS)

:::algoviz{algorithm="bfs"}
:::

---

## 4.5 Multitasking efficiency (`pair<A, B>`)

If we are asked to solve two things at once (e.g.: *Is it sub-balanced? And what height is it?*), launching two separate search functions will cause an efficiency disaster at $\Theta(N^2)$.
**The solution:** Search in a single pass, returning the two pieces of data at the same time inside a `std::pair` tuple ($\Theta(N)$).

Below we see how to extract both the sum of all values *and* the quantity of nodes with a single `std::pair` to find out the global average:

:::algoviz{algorithm="eficiencia_multitasca"}
:::

---

## 4.6 Reading and Reconstructing Trees

In the laboratory Judges you will receive the trees represented in a plain text line (e.g.: `10 5 # # 14 # #`), where a **`#`** indicates "Empty Sub-tree".
Here you have a quick auxiliary conversion utility:

```cpp
template <typename T>
T read_value(string text) {
    istringstream iss(text);
    T elem;
    iss >> elem;
    return elem;
}
```

### 1. Reading in Preorder format (The usual)
Very direct: The root is always the first to enter through `cin`. Then come those on the left, and finally those on the right.

:::algoviz{algorithm="reconstruccio_preordre"}
:::

### 2. Reading in Postorder format (With Stack `stack`)
If there is no other choice and they give it to you in Postorder, normal reading fails because "the root information arrives at the last second to your keyboard". We will have to read everything backwards directly pushing onto a `stack` until solving the entire path upwards:

<!-- ```cpp
template<typename T>
pro2::BinTree<T> bintree_from_postorder(istream& in) {
    stack<pro2::BinTree<T>> S;
    string token;
    
    while (in >> token) {
        if (token == "#" || !in) {
            S.push(pro2::BinTree<T>()); 
        } else {
            T value = read_value<T>(token);
            
            // Strong classic exam binding in case the input breaks the assert index.
            assert(S.size() >= 2);
            
            // Watch out for flipping! The Right dominates the top of space and will receive pop first
            auto right = S.top(); S.pop();  
            auto left = S.top(); S.pop();
            
            // Entire tree reconstructed upwards!
            S.push(pro2::BinTree<T>(value, left, right));
        }
    }
    assert(S.size() == 1);
    return S.top();
}
``` -->

<!-- ---

## 4.7 Interactive Tree Simulator

See how the code recursively advances through the sub-trees until reaching the leaf and drags upwards thanks to the frame architecture in the pairwise immersion.

:::oopviz{simulation="arbre_bintree_immersio"}
::: -->
