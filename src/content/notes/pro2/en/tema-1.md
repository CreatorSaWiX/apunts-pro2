---
title: "Topic 1: Classes and object orientation"
description: "Classes and modular design"
readTime: "10 min"
order: 1
---

## 1.1 Review: structs and parameter passing

A **struct** groups several related data.

```cpp [main.cpp]
struct Clock {
    int h, m, s;
};  // Must put the ';'
```

### Parameter passing to functions
- **By value**: A copy is made. Slow and does not modify the original.
- **By reference (`&`)**:
    - **Read (`const` + `&`)**: Fast and safe. There is no copy. `void show(const Clock& r);`
    - **Write (`&`)**: Modifies the original directly. `void advance(Clock& r);`

## 1.2 Abstract data types (ADT) and classes

An **ADT** groups data (attributes) and the operations (methods) to manipulate them. In C++, it is implemented with **classes** to guarantee data consistency.

### Encapsulation
Shields data to prevent external uncontrolled modifications:
- **`private`**: Attributes hidden from external code. Only accessible by methods of the same class.
- **`public`**: Methods accessible from outside. They are the interface or only valid way to interact with the object.

---

### File Organization

We separate "what it does" from "how it does it".

### 1. Specification (`.hpp` or `.hh`)
Defines the structure of the class. Includes guards (`#ifndef`) to prevent multiple inclusions and compilation loops.

```cpp [Point.hpp]
#ifndef POINT_HPP
#define POINT_HPP

class Point {
    double x, y; // Private by default

public:
    Point();                           // Default constructor
    Point(double a, double b);         // Constructor with parameters
    Point(const Point& other);         // Copy constructor

    void move(double dx, double dy);   // Modifier
    double get_x() const;              // Consultor (const = does not modify)
};
#endif
```

### 2. Implementation (`.cpp` or `.cc`)
Contains the real code of the declared functions.
- **`#include "Point.hpp"`**: Loads the previous data definitions.
- **Operator `::`** (Scope resolution): Indicates to which class the function belongs (ex: `Point::move`).

```cpp [Point.cpp]
#include "Point.hpp"

Point::Point() { x = 0; y = 0; }
Point::Point(double a, double b) { x = a; y = b; }
Point::Point(const Point& other) { x = other.x; y = other.y; }

void Point::move(double dx, double dy) {
    x += dx; y += dy; // Access to attributes of the current object
}

double Point::get_x() const { return x; }
```

### 3. Usage (`main.cc`)
Object creation and usage.

```cpp [main.cpp]
#include <iostream>
#include "Point.hpp"

int main() {
    Point p(1, 2);      // Call to constructor with parameters
    p.move(3, 3);       // 'p' acts as an implicit parameter
    
    // std::cout << p.x;   // ERROR! 'x' is private
    std::cout << p.get_x(); // Correct
}
```

:::oopviz{simulation="punt_basic"}
:::

---

## 1.3 Additional class concepts

- **Implicit parameter (`this`)**: It is a hidden internal pointer that references the object on which we call a method. Example: in `p.move()`, `this` points to `p`.
- **`inline` methods**: Written directly inside the `.hpp`. The compiler substitutes the call of this function with its instructions to avoid jumps and gain speed.
- **`static` members**: 
  - *Attributes*: Shared globally among all objects of the same class (e.g., a counter of total Points).
  - *Methods*: Do not require instantiating any object to execute. They are called via absolute reference `Point::how_many_points()` and, therefore, **do not have `this`**.

### Genericity (`template`)
They allow creating intelligent structures and functions indifferent to the type of data they store (like `vector<int>` or `vector<string>`), saving having to program the same class a thousand times.

```cpp
template <class T>
class Box {
    T content;
public:
    Box(T x) { content = x; } 
};
// Usage: Box<int> integer(5); Box<string> text("Hello");
```

---

## 1.4 Compilation with Makefile
To efficiently manage projects with many files (`main.cc`, `Point.hpp`, `Point.cpp`), we delegate the work to a command file `Makefile`. Once programmed, simply executing `make` will unify the `.o` codes only if they have suffered recent changes.

```makefile [Makefile]
CXX = g++
CXXFLAGS = -Wall -std=c++17

program: main.o Point.o
	$(CXX) -o program main.o Point.o

main.o: main.cc Point.hpp
	$(CXX) $(CXXFLAGS) -c main.cc
```

---

## 1.5 In case you don't like reading theory

This simulator contains a whole project with classes, methods, `this`, `inline`, `static` and a `Makefile`.

:::oopviz{simulation="projecte_sencer_oop"}
:::
