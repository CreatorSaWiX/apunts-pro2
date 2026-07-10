---
title: "Topic 6: Search trees and maps"
description: "BSTs for logarithmic searches and the powerful associative container map<K, V>."
readTime: "10 min"
order: 6
---

## 6.1 The search problem

So far we have seen two main linear structures to store data:

| Container | Access | Search | Insertion in middle |
|:---|:---:|:---:|:---:|
| `vector<T>` (unsorted) | $\Theta(1)$ | $\mathcal{O}(n)$ | $\mathcal{O}(n)$ |
| `vector<T>` (sorted) | $\Theta(1)$ | $\mathcal{O}(\log n)$ | $\mathcal{O}(n)$ |
| `list<T>` | $\mathcal{O}(n)$ | $\mathcal{O}(n)$ | $\Theta(1)$ |
| `map<K, V>` | — | $\mathcal{O}(\log n)$ | $\mathcal{O}(\log n)$ |
| `set<T>` | — | $\mathcal{O}(\log n)$ | $\mathcal{O}(\log n)$ |

It is clear: if search is the predominant operation, we need a specialized structure. The solution is a **Binary Search Tree (BST)**.

---

## 6.2 Binary Search Tree (BST)

A **BST** (*Binary Search Tree*) is a `BinTree<T>` that meets an additional structural rule at each node:

> **BST Invariant:** All values in the **left subtree** are **strictly less** than the node, and all those in the **right subtree** are **strictly greater**.

:::graph
```json
{
  "nodes": [
    { "id": "50", "label": "50 (root)", "color": "#0ea5e9" },
    { "id": "20", "label": "20", "color": "#8b5cf6" },
    { "id": "80", "label": "80", "color": "#8b5cf6" },
    { "id": "10", "label": "10" },
    { "id": "30", "label": "30" },
    { "id": "70", "label": "70" },
    { "id": "90", "label": "90" }
  ],
  "links": [
    { "source": "50", "target": "20", "label": "< 50" },
    { "source": "50", "target": "80", "label": "> 50" },
    { "source": "20", "target": "10" },
    { "source": "20", "target": "30" },
    { "source": "80", "target": "70" },
    { "source": "80", "target": "90" }
  ]
}
```
:::

Thanks to the invariant, the **inorder** traversal (*left → root → right*) visits all values **in ascending order** in $\Theta(n)$.

---

## 6.3 Search in a BST

Search is the most direct and efficient operation. At each step we **discard half of the tree** without even exploring it:

```cpp
bool bst_search(const BinTree<int>& a, int x) {
    if (a.empty()) return false;
    if (x == a.value()) return true;
    return bst_search(a.value() < x ? a.left() : a.right(), x);
}
```

Observe the power of the BST property: if `x < a.value()`, **we know for sure** that `x` cannot be in the right subtree. We discard it completely without exploring it.

:::algoviz{algorithm="bst_search"}
:::

:::tip
In a **balanced** BST, search costs $\mathcal{O}(\log n)$. In the worst case (degenerate tree/list), it can reach $\mathcal{O}(n)$. The key is to keep the tree balanced.
:::

### Minimum and Maximum

The minimum value is always the leftmost node (we go all the way down to the left until we find an empty child). The maximum, the rightmost.

```cpp
int bst_min(const BinTree<int>& a) {
    assert(!bst.empty());
    if (a.left().empty()) return a.value();
    return bst_min(a.left());
}

int bst_max(const BinTree<int>& a) {
    assert(!bst.empty());
    if (a.right().empty()) return a.value();
    return bst_min(a.right());
}
```

---

## 6.4 Insertion in a BST

Since `BinTree<T>` is **immutable**, we cannot modify the existing tree. Insertion **reconstructs the path** from the root to the insertion point, reusing the subtrees that do not change:

```cpp
BinTree<int> bst_insert(const BinTree<int>& a, int x) {
    if (a.empty())
        return BinTree<int>(x);          // Base case: here goes the new node
    if (x == a.value()) return a;        // Already exists, we don't insert duplicate
    if (x < a.value())
        return BinTree<int>(a.value(),
                            bst_insert(a.left(), x),  // We rebuild left branch
                            a.right());               // We reuse right branch
    return BinTree<int>(a.value(),
                        a.left(),
                        bst_insert(a.right(), x));    // We reuse left branch
}
```

:::algoviz{algorithm="bst_insert"}
:::

:::info
Notice that the subtrees we are **not traversing** are reused directly without copying them. Thanks to the functional immutability of `BinTree`, the compiler is in charge of optimizing memory sharing (persistent structure).
:::

---

## 6.5 The `map<K, V>` container

The C++ STL offers the **`map<K, V>`** container, a dictionary internally implemented as a **balanced BST** (Red-Black tree). It associates **unique keys** (`K`) to **values** (`V`).

```cpp
#include <map>
using namespace std;

map<string, int> m;
m["un"]  = 1;
m["deu"] = 10;
```

Internally, each element is a **`pair<K, V>`** with the fields `first` (key) and `second` (value).

### The `[]` operator: the gateway

The `[]` operator is the most natural way to use a `map`. If the key **does not exist**, it creates it automatically with the default value of the type (`0` for `int`, `""` for `string`).

:::warning
Using `m["key"]` in a `const` `map` is a **compilation error** because it cannot create elements. Use `m.find("key")` or `m.at("key")` in `const` contexts.
:::

### `find`: the safe search

```cpp
map<string, int> m = {{"un", 1}, {"deu", 10}};

auto it = m.find("deu");
if (it != m.end()) {
    cout << "Associated value: " << it->second << endl; // 10
}
```

`find` returns an **iterator** pointing to the `{key, value}` pair if it finds it, or to `m.end()` if it's not there. Cost: $\mathcal{O}(\log n)$.

### `insert`: adding without overwriting

```cpp
m.insert({20, "twenty"});
m.insert({20, "minus twenty"}); // DOES NOT substitute if it already exists!
```

The return type of `insert` is `pair<iterator, bool>`: the iterator to the element and `true` if it was inserted (`false` if it already existed).

---

## 6.6 The `map` as an accumulator

One of the star uses of the `map` is accumulating and counting. The `[]` operator does all the work:

1. If the key **does not exist** → creates it with value `0`, then does `++`.
2. If the key **exists** → retrieves the current value and does `++`.

### Example 1: Word frequency

```cpp
#include <map>
#include <iostream>
using namespace std;

int main() {
    map<string, int> word_count;
    string word;
    while (cin >> word) {
        word_count[word]++;  // <-- pure magic!
    }
    for (auto it = word_count.begin(); it != word_count.end(); ++it) {
        cout << it->first << ": " << it->second << endl;
    }
}
```

### Example 2: Group words by length

```cpp
map<int, vector<string>> by_length;
string word;
while (cin >> word) {
    by_length[word.size()].push_back(word);
}
```

:::oopviz{simulation="racional_class"}
:::

---

## 6.7 Iterating over a `map`

`map` iterators traverse the elements **in ascending order by key** (because internally it is a sorted BST). The `->` operator accesses the `first` and `second` fields of the pair:

```cpp
map<string, int> m;
// ... (fill the map)

for (auto it = m.begin(); it != m.end(); ++it) {
    cout << "key: " << it->first
         << ", value: " << it->second << endl;
}
```

Or with the modern `for-each` loop (C++11):

```cpp
for (const auto& [key, value] : m) {
    cout << key << " → " << value << endl;
}
```

---

## 6.8 The `set<T>` container

A **`set<T>`** is a `map` where only the key exists, with no associated value. It is used to:
- **Remove duplicates** from a sequence.
- **Count the vocabulary** (unique words).
- **Check membership** in $\mathcal{O}(\log n)$.

```cpp
#include <set>
using namespace std;

set<string> vocabulari;
string paraula;
while (cin >> paraula) {
    vocabulari.insert(paraula);
}
cout << "Unique words: " << vocabulari.size() << endl;
```

:::tip
If you need **repeated** keys (multiset or multimap), C++ offers `multiset<T>` and `multimap<K, V>`. In a normal `map`, two insertions with the same key **do not** add a second element.
:::

---

## 6.9 When to use each container

| Situation | Recommended container |
|:---|:---|
| Frequent search in sorted data | `map<K,V>` or `set<T>` |
| No order, maximum speed search | `unordered_map<K,V>` (amortized $\mathcal{O}(1)$) |
| Access by numerical index | `vector<T>` |
| Frequent insertion/deletion in the middle | `list<T>` |
| Collection of unique elements | `set<T>` |
| Accumulator key→counter/list | `map<K, vector<T>>` |
