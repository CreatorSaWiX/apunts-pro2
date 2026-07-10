---
title: "Lab 7: pro2::Vector<T> Implementation"
description: "Solved laboratory session. Implementation of a dynamic array from scratch."
readTime: "12 min"
order: 10.5
---

<details>
<summary>Solution Explanation</summary>

## 1. The dynamic memory strategy

To implement a `Vector`, we need to manage memory manually on the **heap**. The key is to separate the concept of **size** (`size_`, how many elements there are) and **capacity** (`capacity_`, how much space we have reserved).

### The `reallocate_` method
It is the heart of the class. It is responsible for requesting a new memory block, copying the old elements and freeing the old block.

```cpp
void reallocate_(int new_capacity) {
    T* new_data = new T[new_capacity];
    int to_copy = (new_capacity < size_) ? new_capacity : size_;
    for (int i = 0; i < to_copy; ++i) {
        new_data[i] = data_[i];
    }
    delete[] data_; // We free the old block
    data_ = new_data;
    capacity_ = new_capacity;
    size_ = to_copy;
}
```

## 2. The Rule of Three

Since our class manages resources (dynamic memory), we have to define:
1. **Destructor**: To prevent memory leaks (`delete[] data_`).
2. **Copy constructor**: To make deep copies. If we didn't do it, two vectors would point to the same memory.
3. **Assignment operator**: Similar to the copy, but it must clear previous memory and watch out for self-assignment (`this != &other`).

## 3. Capacity Management

### `push_back`: Amortized Cost $\mathcal{O}(1)$
When the vector fills up, we **double** the capacity. This makes copying operations (expensive) increasingly sporadic.

### `pop_back`: Avoiding Thrashing
If we reduced memory right when the vector is half full, a sequence of alternating `push/pop` would be very slow. That's why we wait until it's at **1/4** capacity to reduce it to **half**.

</details>

## Complete Solution: vector.hh

Here is the complete implementation that passes all laboratory tests:

```cpp [vector.hh]
#ifndef VECTOR_HH
#define VECTOR_HH
#include "assert.hh"

namespace pro2 {

template <typename T>
class Vector {
    T* data_;
    int size_;
    int capacity_;

    // static: Does not belong to any concrete object (Vector v1, v2...), but to the whole class. There is only a single copy of the value 4.
    // constexpr: when the compiler sees "initial_capacity_" it directly puts a 4
    static constexpr int initial_capacity_ = 4;

    //Moving
    void reallocate_(int new_capacity) {
        T* new_data = new T[new_capacity];
        int to_copy = (new_capacity < size_) ? new_capacity : size_;
        for(int i = 0; i < to_copy; ++i){
            new_data[i] = data_[i];
        }
        delete[] data_;
        data_ = new_data;
        capacity_ = new_capacity;
        size_ = to_copy;
    }

 public:
    //Constructor
    Vector() : data_(nullptr), size_(0), capacity_(0) {}

    //Overload
    Vector(int n){
        assert(n >= 0, "Vector::Vector(int): negative size!");
        data_ = new T[n];
        size_ = n;
        capacity_ = n;
    }

    //Overload
    Vector(int n, const T& x){
        assert(n >= 0, "Vector::Vector(int, const T& x): negative size!");
        data_ = new T[n];
        size_ = n;
        capacity_ = n;
        for(int i = 0; i < n; ++i) data_[i] = x;
    }

    //New vector
    Vector(const Vector& other) : data_(new T[other.capacity_]), size_(other.size_), capacity_(other.capacity_){
        for(int i = 0; i < size_; ++i) data_[i] = other.data_[i];
    }

    //Destructor
    ~Vector() {
        delete[] data_;
    }

    Vector& operator=(const Vector& other){
        //this: pointer. If we do v1=v2, this points to v1.
        //"@mem where I am (this) is it different from the address of the object I want to copy (&other)?"
        //Avoid v1 = v1;
        if(this != &other){
            delete[] data_;
            size_ = other.size_;
            capacity_ = other.capacity_;
            data_ = new T[capacity_];
            for(int i = 0; i < size_; ++i) data_[i] = other.data_[i];
        }
        return *this;
    }

    // Write ex: v[0] = 5;
    T& operator[](int i){
        assert(i >= 0 && i < size_, "Vector::operator[]: index out of bounds!");
        return data_[i];
    }

    // Read  ex: cout << v[1] << endl; 
    const T& operator[](int i) const {
        assert(i >= 0 && i < size_, "Vector::operator[]: index out of bounds!");
        return data_[i];
    }

    // getters
    int size() const { return size_; }
    int capacity() const { return capacity_; }
    bool empty() const { return size_ == 0; }

    void clear(){
        delete[] data_;
        data_ = nullptr;
        size_ = 0;
        capacity_ = 0;
    }

    void reserve(int n){
        assert(n >= 0, "Vector::reserve: negative capacity!");
        if(n > capacity_) reallocate_(n);
    }

    void resize(int n){
        assert(n >= 0, "Vector::resize: negative size!");
        reallocate_(n);
        size_ = n;
    }

    void push_back(const T& x) {
        if(size_ == capacity_){
            reallocate_(capacity_ == 0 ? initial_capacity_ : 2 * capacity_);
        }
        data_[size_] = x;
        ++size_;
    }

    void pop_back(){
        assert(size_ > 0, "Vector::pop_back: empty vector!");
        --size_;
        if(size_ < capacity_ / 4){
            reallocate_(capacity_ / 2);
        }
    }

    // using: create a type alias (it's like a typedef)
    using iterator = T*;
    using const_iterator = const T*;

    // Iterators
    iterator begin() { return data_; }
    const_iterator begin() const { return data_; }
    iterator end() { return data_ + size_; }
    const_iterator end() const { return data_ + size_; }
};

} // namespace pro2

#endif
```
