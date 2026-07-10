---
title: "PRO2 Midterm"
description: "Summary topic 1 - topic 6"
readTime: "4 min"
order: 7
draft: false
---

## 1. Classes and object orientation (Optional)
- **Classes:** Convert `structs` into ADTs with privacy (`public:` and `private:`) to ensure data consistency.
- **Constructor:** Starting points with the same name as the `class`. **Overload**: `Class()`, `Class(const Class& other)`.
- **Initializer List:** `: v1(0), v2(b) {}` For references and initializing member objects at once.
- **`const` methods:** `void get() const;` - Method that does not modify its own attributes.
- **`static` methods:** Methods applicable globally from the class. `Classe::metode();`.
- **Immersions:** `inc_()`. **Private attributes:** `int a_`.
- **File Control (.hh/.cc) and Make:**
  - **`.hh`**: 1st) `#ifndef XXXX_HH`, 2nd) `#define XXXX_HH`, 3rd) `class XXXX { ... };` 4th) `#endif`.
  - **`.cc`**: `#include "XXXX.hh"`. Applies  `XXXX::XXXX(...) { a_ = a; }`.
  - **Makefile**: `XXXX.o: XXXX.hh XXXX.cc` below `g++ -c XXXX.cc`.
- **`inline`:** Eliminates function call cost by inserting it at compile time where it belongs.
- **`assert`:** `#include "assert.hh"`. Automatically stops the program if it does not meet preconditions.

## 2. Stacks and queues
- **Stack / Queue / PQ:** `#include <stack>` / `#include <queue>`. **`pop()` always returns `void`**. To get the value you must do `top()` or `front()` **before** `pop()`.
- **Stack (LIFO):** `push(x)`, `pop()`, `top()`, `empty()`, `size()`.
- **Queue (FIFO):** `push(x)`, `pop()`, `front()`, `empty()`, `size()`.

## 3. Lists, Vectors and Deques
- **`list<T>` / `deque<T>`:** `#include <list>` / `#include <deque>`.
  - **Common methods:** `push_back(x)`, `push_front(x)`, `pop_back()`, `pop_front()`, `insert(it, x)`, `erase(it)`, `back()`, `front()`.
  - *Difference:* `deque` has `operator[]` ($O(1)$), `list` DOES NOT.
- **`vector<T>`:** `#include <vector>`.
  - **Methods:** `push_back(x)`, `pop_back()`, `insert(it, x)`, `erase(it)`, `back()`, `front()`, `operator[]`.
- **Iterators:** 
  - `iterator`: Read and write. `list<T>::iterator it`
  - `const_iterator`: Read only. `list<T>::const_iterator`
  - `reverse_iterator`: Reverse, read and write. `list<T>::reverse_iterator`
  - `const_reverse_iterator`: Reverse, read only. `list<T>::const_reverse_iterator`
  - **Positions:** `begin()`, `end()`, `rbegin()`, `rend()`.
  - **Use:** `*it` (access), `it++`, `it--`. Returns `it = L.erase(it);`.

## 4. Binary trees (`BinTree<T>`)
- **`BinTree<T>`:** `#include "BinTree.hh"`. Immutable recursive structure.
  - **Methods:** `value()`, `left()`, `right()`, `empty()`.
- **Traversals:** DFS (Pre/In/Postorder) and BFS (levels).
- **Resolution Strategies:**
  1. **Base cases:** Check `t.empty()` and, if necessary, **leaf** case (`left` and `right` empty).
  2. **Immersion:** In case trees talk to each other (Ex: if all nodes equal, if all leaves equal, if sum of child nodes = current node, etc). Use auxiliary function (`name__()`) with parameter by **reference** (ex: `int& x`) to save states.
  3. **Leap of faith:** Solves the current node and assumes recursion already works for the children.

## 5. Priority queues and general trees
- **`Heap<T>`:** `#include "heap.hh"`.
  - **Methods:** `push(x)`, `pop()`, `top()`, `empty()`, `size()`.
- **`Tree<T>`:** General (n-ary) tree.
  - **Methods:** `value()`, `num_children()`, `child(i)`, `empty()`.

## 6. Dictionaries: map and set
- **`set<T>`:** `#include <set>`. **Ordered set** that does not allow duplicates. To use `set` with a `struct`, you must define the **`operator<`** (establish the order).
  - **Methods:** `insert(x)`, `erase(x)`, `find(x)`, `empty()`, `size()`.
  - **Iterators:** `begin()`, `end()`. Access the value with `*it`.
- **`multiset<T>`:** Same as `set`, but allows duplicates (useful for rankings where two elements can tie in everything).
- **`map<K, V>`:** `#include <map>`. Automatically sorts by the **key** (`K`). Internal elements: `pair<key, value>`.
  - **Methods:** `m[key] = val`, `insert({key, val})`, `erase(x)`, `find(key)`, `empty()`, `size()`.
  - **Iterators:** `begin()`, `end()`. Accessed as `it->first` (key) and `it->second` (value).

## 7. Performance and Complexity (Summary)
| Method | Stack/Queue | Heap (PQ) | Vector | Deque | List | Map/Set |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **push / insert** | $O(1)$ | $O(\log N)$ | $O(1)$* / $O(N)$ | $O(1)$* / $O(N)$ | $O(1)$ | $O(\log N)$ |
| **pop / erase** | $O(1)$ | $O(\log N)$ | $O(1)$ / $O(N)$ | $O(1)$ / $O(N)$ | $O(1)$ | $O(\log N)$ |
| **top / front / back** | $O(1)$ | $O(1)$ | $O(1)$ | $O(1)$ | $O(1)$ | - |
| **operator[]** | - | - | $O(1)$ | $O(1)$ | - | $O(\log N)$ |
| **find** | - | - | - | - | - | $O(\log N)$ |

*\*Amortized cost.* `insert(pos, x)` and `erase(pos)` in `list` are $O(1)$ if we already have the iterator.
