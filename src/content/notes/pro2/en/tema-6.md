---
title: "Topic 6: Search trees and maps"
description: "BSTs for logarithmic searches and the powerful associative container map<K, V>."
readTime: "10 min"
order: 6
---

## 6.1 The search problem

With conventional linear structures we must choose between fast insertion or fast searching:

| Structure | Search | Insertion |
| :--- | :---: | :---: |
| **Unsorted vector** | $\mathcal{O}(n)$ | $\mathcal{O}(1)$ |
| **Sorted vector** | $\mathcal{O}(\log n)$ | $\mathcal{O}(n)$ |
| **Linked list (`list`)** | $\mathcal{O}(n)$ | $\mathcal{O}(1)$ |
| **Binary Search Tree (BST)** | **$\mathcal{O}(\log n)$** | **$\mathcal{O}(\log n)$** |

The **Binary Search Tree (BST)** solves this dilemma by achieving a logarithmic balance in both operations.

---

## 6.2 Binary Search Tree (BST)

A **BST** (*Binary Search Tree*) is a `BinTree<T>` where each node satisfies a strict order rule:

> - All values in the **left subtree** are **smaller** ($< \text{node}$).
> - All values in the **right subtree** are **greater** ($> \text{node}$).

:::bstviz
:::

- **Inorder traversal:** Visiting *left $\rightarrow$ root $\rightarrow$ right* automatically yields the sequence **sorted in ascending order** in linear time $\Theta(n)$.

---

## 6.3 Search in a BST

At each step we compare $x$ with the current node value and **discard half of the tree**:
- If $x < \text{node}$: search only in the **left** subtree.
- If $x > \text{node}$: search only in the **right** subtree.

:::algoviz{algorithm="bst_search"}
:::

> **Complexity:** **$\mathcal{O}(\log n)$** in a balanced tree (proportional to height). In the worst case of a degenerate tree (linked-list shaped), it can degrade to $\mathcal{O}(n)$.

---

### Minimum and maximum
- **Minimum:** Descend always to the left until finding a node without a left child.
- **Maximum:** Descend always to the right until finding a node without a right child.

```cpp
int bst_min(const BinTree<int>& a) {
    if (a.left().empty()) return a.value();
    return bst_min(a.left());
}

int bst_max(const BinTree<int>& a) {
    if (a.right().empty()) return a.value();
    return bst_max(a.right());
}
```

---

## 6.4 Insertion in a BST

Since `BinTree<T>` is **immutable**, insertion does not mutate the original tree: it **reconstructs only the path** to the new node's position and **reuses** all unaffected subtrees:

:::algoviz{algorithm="bst_insert"}
:::

> **Persistent structure:** Unaffected subtrees are directly shared in memory without duplicating data. Time and space complexity: **$\mathcal{O}(\log n)$**.

---

## 6.5 The `map<K, V>` container

The C++ STL offers **`map<K, V>`**, a dictionary that associates **unique keys** (`K`) to **values** (`V`). Internally, each element is stored as a **`pair<const K, V>`** (`it->first` for the key, `it->second` for the value).

### Main Operations — Cost $\mathcal{O}(\log n)$

| Operation | Syntax | Behavior |
| :--- | :--- | :--- |
| **Access / Insertion** | `m[key] = val;` | If the key does not exist, **creates it** with default value (`0`, `""`, etc.). |
| **Search** | `m.find(key)` | Returns an iterator to the `{key, value}` pair or `m.end()` if not found. |
| **Existence** | `m.count(key)` | Returns `1` if key exists, `0` otherwise. |
| **Safe Insertion** | `m.insert({k, v})` | Inserts the pair only if `k` **did not previously exist**. |

```cpp
#include <iostream>
#include <map>
#include <string>
using namespace std;

int main() {
    map<string, int> ages;

    // 1. Insertion and modification with []
    ages["Anna"] = 21;
    ages["Bernat"] = 25;

    // 2. Safe search with find()
    auto it = ages.find("Anna");
    if (it != ages.end()) {
        cout << it->first << " is " << it->second << " years old\n";
    }

    // 3. Fast existence check with count()
    if (ages.count("Carla") == 0) {
        cout << "Carla is not in the map\n";
    }

    // 4. Insertion without overwriting with insert()
    ages.insert({"Anna", 30}); // Does nothing: "Anna" already exists with 21!
}
```

:::warning
The `m[key]` operator **modifies the map**, creating the key automatically if it does not exist. In constant contexts (`const map<K, V>& m`), using `[]` causes a **compilation error**. In these cases, always use `m.find(key)`.
:::

---

## 6.6 The `map` as an accumulator

One of the most common `map` patterns is counting or grouping elements. The `[]` operator handles both cases in a single line:

1. If the key **does not exist** $\rightarrow$ creates it with default value (`0`, empty `vector`, etc.) and performs the operation.
2. If the key **already exists** $\rightarrow$ retrieves the reference to the existing value and updates it.

### Example 1: Frequency Counter

```cpp
map<string, int> word_count;
string word;
while (cin >> word) {
    word_count[word]++;  // If absent, creates ("cat", 0) and increments -> ("cat", 1)
}
```

### Example 2: Grouping by Length (Key $\rightarrow$ Vector)

```cpp
map<int, vector<string>> by_length;
string word;
while (cin >> word) {
    by_length[word.size()].push_back(word); // Creates vector if needed and appends word
}
```

---

## 6.7 Iterating over a `map`

Iterators of a `map` traverse elements **in ascending order by key** (in-order traversal of the underlying BST):

```cpp
map<string, int> ages = {{"Anna", 21}, {"Bernat", 25}};

// 1. With iterators
for (auto it = ages.begin(); it != ages.end(); ++it) {
    cout << it->first << " is " << it->second << " years old\n";
    // it->second = 22;      // VALID: the value can be modified
    // it->first = "Maria";  // ERROR: key is const to protect BST ordering invariant
}

// 2. With Structured Binding (C++17)
for (const auto& [name, age] : ages) {
    cout << name << " -> " << age << "\n";
}
```

---

## 6.8 The `set<T>` container

A **`set<T>`** is a collection of **unique and sorted keys** without associated values. Internally it is implemented as a balanced BST where each element is its own key.

### Main Operations — Cost $\mathcal{O}(\log n)$

| Operation | Syntax | Behavior |
| :--- | :--- | :--- |
| **Insertion** | `s.insert(elem)` | Adds the element if not already present. Returns `pair<iterator, bool>`. |
| **Search** | `s.find(elem)` | Returns an iterator to the element or `s.end()` if not found. |
| **Membership** | `s.count(elem)` | Returns `1` if element exists, `0` otherwise. |
| **Erasure** | `s.erase(elem)` | Removes the element from the set (if present). |

```cpp
#include <iostream>
#include <set>
#include <string>
using namespace std;

int main() {
    set<string> vocabulary;

    // 1. Insertion (automatically ignores duplicates)
    vocabulary.insert("hello");
    vocabulary.insert("world");
    vocabulary.insert("hello"); // Does nothing: "hello" already exists

    // 2. Membership check
    if (vocabulary.count("world") == 1) {
        cout << "'world' is in the set\n";
    }

    // 3. Sorted iteration (elements are const T)
    for (auto it = vocabulary.begin(); it != vocabulary.end(); ++it) {
        cout << *it << " "; // Prints in alphabetical order: "hello world"
    }
    cout << "\n";

    // 4. Erasure
    vocabulary.erase("hello");
}
```

:::tip
If you need repeated elements, the STL offers **`multiset<T>`** and **`multimap<K, V>`**. In a standard `set` or `map`, keys are strictly unique.
:::

---

## 6.9 When to use each container

| Situation | Recommended Container | Search Cost |
| :--- | :--- | :--- |
| **Frequent search in sorted data** | `map<K, V>` or `set<T>` | $\mathcal{O}(\log n)$ |
| **Unordered, maximum search speed** | `unordered_map<K, V>` or `unordered_set<T>` | $\mathcal{O}(1)$ amortized |
| **Direct access by numerical index ($0..n-1$)** | `vector<T>` | $\mathcal{O}(1)$ |
| **Frequent insertion / deletion in the middle** | `list<T>` | $\mathcal{O}(1)$ |
| **Collection of unique elements** | `set<T>` | $\mathcal{O}(\log n)$ |
| **Accumulator / grouper key $\rightarrow$ list** | `map<K, vector<T>>` | $\mathcal{O}(\log n)$ |
