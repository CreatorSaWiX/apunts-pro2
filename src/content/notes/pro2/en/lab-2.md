---
title: "Lab 2: Linear Data Structures"
description: "Solved laboratory session. Stacks and queues."
readTime: "12 min"
order: 2.5
---

## 1. Stacks and queues from the STL

The second laboratory tests us with linear *Data Structures*. We will use the equivalent of the Standard Template Library (STL) for the `Stack` and `Queue` containers. If you've ever seen plates being stacked (the last plate you put in is the first one to wash) or standing in a line at the supermarket (the first to arrive is the first to leave), you have just understood 100% what a stack and a queue are.

### Interfaces: `Stack` and `Queue`

<div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 my-6">
<div>

```cpp [Stack Interface]
s.push(x) // Puts on top.
s.top()   // Looks at the top.
s.pop()   // Removes from the top.
s.empty() // Is it empty?
s.size()  // Elements.
```
</div>
<div>

```cpp [Queue Interface]
q.push(x) // Puts at the back.
q.front() // Looks at the front.
q.pop()   // Removes from the front.
q.empty() // Is it empty?
q.size()  // Elements.
```
</div>
</div>

---

<!-- 2. Doctest -->

## 2. Automated tests with Doctest

The judge runs multiple tests feeding data into your code to figure out if it has any errors. These automated tests are backed in C++ under the **Doctest** framework. Once you have programmed your solution (e.g. `reverse.cc`), the `Doctest` and the `Makefile` are included in the laboratory for you. You will only need to run the command:

```bash
make test
```


---

## 3. Stacks

They guarantee the **LIFO: Last In, First Out** system.

### Exercise 1: Reverse

It consists of reading constant numbers and printing them in reverse. Stacking does this automatically! We will insert the numbers one after another asymmetrically onto the top of the Stack until there is no data to read from the input stream (`while (cin >> n)`). Once full, we just print the top of the current resource (`top()`) and pop (`pop()`) until the bottom.

<details>
<summary>Solution code: reverse.cc</summary>

```cpp [p1-reverse/reverse.cc]
#include <iostream>
using namespace std;
#include "stack.hh"
using namespace pro2;

void reverse(istream& in, ostream& out) {
    Stack<int> s;
    int n;
    while (in >> n) {
        s.push(n);
    }
    
    // We keep popping and calling TOP to extract in reverse
    while (!s.empty()) {
        out << s.top();
        s.pop();
        if (!s.empty()) out << " ";
    }
    out << endl;
}
```
</details>

:::oopviz{simulation="stack_reverse"}
:::

### Exercise 2: Validate Parentheses

We only stack the opening ones (`(` or `[`). When a closing one arrives (`)` or `]`), we check if it matches the last open one stored at the top of the stack (`top()`). If they match, we remove it with `.pop()`. Any discrepancy or parenthesis left hanging means the sequence is incorrect.

<details>
<summary>Solution code: parentesis.cc</summary>

```cpp [p2-parentesis/parentesis.cc]
#include <iostream>
using namespace std;
#include "stack.hh"
using namespace pro2;

void parentesis(istream& in, ostream& out) {
    Stack<char> s;
    char c;
    int pos = 1;

    // We read ignoring spaces (in >> c) until we hit the pure dot delimiter character
    while (in >> c and c != '.') {
        // We stack openings at the pure front
        if (c == '(' or c == '[') {
            s.push(c);
        } 
        else if (c == ')' or c == ']') {
            // Excessive closure or previous does not match
            if (s.empty()) {
                out << "Incorrecte " << pos << endl;
                return;
            }
            char top = s.top();
            // We evaluate matching and safely undo it:
            if ((c == ')' and top == '(') or (c == ']' and top == '[')) {
                s.pop();
            } else {
                out << "Incorrecte " << pos << endl;
                return;
            }
        }
        pos++;
    }

    // Finished, if any free opening remains pending we will consider it an error
    if (s.empty()) out << "Correcte\n";
    else out << "Incorrecte " << pos << endl;
}
```
</details>

:::oopviz{simulation="stack_parentesis"}
:::

### Exercise 3: Simulated Recursion with Stacks

The computer uses a hidden stack (the Call-Stack) to process recursive functions. This exercise shows us how any recursive function of the type $f(n-1)$ can be translated into iterative code. In the iterative loop we take the `.top()`, and if it meets the viability condition ($v > 0$), we simulate the theoretical creation of activities by manually adding two smaller operations to the stack.

<details>
<summary>Solution code: recursivitat.cc</summary>

```cpp [p3-recursivitat/recursivitat.cc]
#include <iostream>
using namespace std;
#include "stack.hh"
using namespace pro2;

void escriu(int n, ostream& out) {
    Stack<int> s;
    s.push(n);

    // Iterating continuously until having pure popped all virtual action
    while (!s.empty()) {
        int v = s.top();
        s.pop();
        
        if (v > 0) {
            out << ' ' << v;
            // We instantiate base C++ instinct, backwards since the next step will want 
            // to 'pop' and consume the "NEWEST"
            s.push(v - 1);
            s.push(v - 1);
        }
    }
}
```
</details>

:::oopviz{simulation="stack_recursivitat"}
:::

---

## 4. Queues

Queues guarantee the **FIFO: First In, First Out** standard. We will use `front` in reverse to exclusively glimpse present linear outputs!

### Exercise 5: The Hot Potato

Solves the cyclic Josephus problem of $N$ participants using only one Queue. To simulate 1-by-1 rotary passes of the expiring potato at step $K$, we repeatedly take the player from `front()`, purge them `.pop()` from the head of the line, and immediately send them safe and sound to where it's not their turn `.push()`. After $K$ turns, whoever remains at the head is deleted from the game forever until only 1 is left.

<details>
<summary>Solution code: patata.cc</summary>

```cpp [p5-patata-calenta/patata.cc]
void patata_calenta(istream& in, ostream& out) {
    int N, k;
    if (in >> N >> k) {
        Queue<int> q;
        for (int i = 1; i <= N; ++i) {
            q.push(i); // Names and people in the game
        }
        
        bool first = true;
        while (q.size() > 1) { // Until only pure 1 individual survives
            // We make K turns or "hot potato steps" towards the end of the cycle
            for (int i = 0; i < k; ++i) {
                int front = q.front();
                q.pop();
                q.push(front);
            }
            
            if (!first) out << " ";
            // The poor soul in front who ends up touching receives immediate expulsion
            out << q.front();
            q.pop(); 
            first = false;
        }
        
        if (!first) out << endl;
        if (q.size() == 1) {
            out << "Supervivent: " << q.front() << endl;
        }
    }
}
```
</details>

:::oopviz{simulation="queue_patata"}
:::

### Exercise 6: Recent Counter (Sliding Window)

Given a base time tolerance threshold $T$, how many previous ones are still "alive" past the time? This pattern is known as a Sliding Window and is the main useful vital property of a queue. Upon reading a new instant ($current$), we expire the oldest used ones by looking at the `front()`: If it is less than $current - T$, we can consider it prescribed. After the sequential purge, we simply ask what active `size()` we have!

<details>
<summary>Solution code: recents.cc</summary>

```cpp [p6-compta-recents/recents.cc]
void compta_recents(istream& in, ostream& out) {
    int N, T;
    if (in >> N >> T) {
        Queue<int> q;
        bool first = true;
        
        for (int i = 0; i < N; ++i) {
            int t;
            in >> t;
            q.push(t);
            
            // External evaluator expiring scary old stored ones 
            // that are left nowhere by the time range and of Queue out:
            while (!q.empty() && q.front() < t - T) {
                q.pop();
            }
            
            if (!first) out << " ";
            out << q.size(); // Shows base active alive
            first = false;
        }
        out << endl;
    }
}
```
</details>

:::oopviz{simulation="queue_recents"}
:::
