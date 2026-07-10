---
title: "Lab 7: Implementación pro2::Vector<T>"
description: "Sesión de laboratorio resuelta. Implementación de un array dinámico desde cero."
readTime: "12 min"
order: 10.5
---

<details>
<summary>Explicación de la solución</summary>

## 1. La estrategia de memoria dinámica

Para implementar un `Vector`, necesitamos gestionar la memoria manualmente en el **heap**. La clave es separar el concepto de **tamaño** (`size_`, cuántos elementos hay) y **capacidad** (`capacity_`, cuánto espacio hemos reservado).

### El método `reallocate_`
Es el corazón de la clase. Se encarga de pedir un nuevo bloque de memoria, copiar los elementos antiguos y liberar el bloque viejo.

```cpp
void reallocate_(int new_capacity) {
    T* new_data = new T[new_capacity];
    int to_copy = (new_capacity < size_) ? new_capacity : size_;
    for (int i = 0; i < to_copy; ++i) {
        new_data[i] = data_[i];
    }
    delete[] data_; // Liberamos el bloque viejo
    data_ = new_data;
    capacity_ = new_capacity;
    size_ = to_copy;
}
```

## 2. La Regla de los Tres

Como nuestra clase gestiona recursos (memoria dinámica), tenemos que definir:
1. **Destructor**: Para evitar fugas de memoria (`delete[] data_`).
2. **Constructor de copia**: Para hacer copias profundas. Si no lo hiciéramos, dos vectores apuntarían a la misma memoria.
3. **Operador de asignación**: Similar a la copia, pero debe limpiar la memoria previa y vigilar con la auto-asignación (`this != &other`).

## 3. Gestión de la Capacidad

### `push_back`: Coste Amortizado $\mathcal{O}(1)$
Cuando el vector se llena, **doblamos** la capacidad. Esto hace que las operaciones de copia (costosas) sean cada vez más esporádicas.

### `pop_back`: Evitando el Thrashing
Si redujéramos la memoria justo cuando el vector está a la mitad, una secuencia de `push/pop` alternados sería muy lenta. Por eso esperamos que esté a **1/4** de la capacidad para reducirlo a la **mitad**.

</details>

## Solución Completa: vector.hh

Aquí tienes la implementación completa que pasa todos los tests del laboratorio:

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

    // static: No pertenece a ningún objeto concreto (Vector v1, v2...), sino a la clase entera. Solo hay una única copia del valor 4.
    // constexpr: el compilador cuando ve "initial_capacity_" directamente pone un 4
    static constexpr int initial_capacity_ = 4;

    //Mudanza
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

    //Sobrecarga
    Vector(int n){
        assert(n >= 0, "Vector::Vector(int): ¡tamaño negativo!");
        data_ = new T[n];
        size_ = n;
        capacity_ = n;
    }

    //Sobrecarga
    Vector(int n, const T& x){
        assert(n >= 0, "Vector::Vector(int, const T& x): ¡tamaño negativo!");
        data_ = new T[n];
        size_ = n;
        capacity_ = n;
        for(int i = 0; i < n; ++i) data_[i] = x;
    }

    //Vector nuevo
    Vector(const Vector& other) : data_(new T[other.capacity_]), size_(other.size_), capacity_(other.capacity_){
        for(int i = 0; i < size_; ++i) data_[i] = other.data_[i];
    }

    //Destructor
    ~Vector() {
        delete[] data_;
    }

    Vector& operator=(const Vector& other){
        //this: puntero. Si hacemos v1=v2, this apunta v1.
        //"@mem donde estoy (this) ¿es diferente a la dirección del objeto que quiero copiar (&other)?"
        //Evitar el v1 = v1;
        if(this != &other){
            delete[] data_;
            size_ = other.size_;
            capacity_ = other.capacity_;
            data_ = new T[capacity_];
            for(int i = 0; i < size_; ++i) data_[i] = other.data_[i];
        }
        return *this;
    }

    // Escritura ej: v[0] = 5;
    T& operator[](int i){
        assert(i >= 0 && i < size_, "Vector::operator[]: ¡índice fuera de rango!");
        return data_[i];
    }

    // Lectura  ej: cout << v[1] << endl; 
    const T& operator[](int i) const {
        assert(i >= 0 && i < size_, "Vector::operator[]: ¡índice fuera de rango!");
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
        assert(n >= 0, "Vector::reserve: ¡capacidad negativa!");
        if(n > capacity_) reallocate_(n);
    }

    void resize(int n){
        assert(n >= 0, "Vector::resize: ¡tamaño negativo!");
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
        assert(size_ > 0, "Vector::pop_back: ¡vector vacío!");
        --size_;
        if(size_ < capacity_ / 4){
            reallocate_(capacity_ / 2);
        }
    }

    // using: crear un alias de tipo (es como un typedef)
    using iterator = T*;
    using const_iterator = const T*;

    // Iteradores
    iterator begin() { return data_; }
    const_iterator begin() const { return data_; }
    iterator end() { return data_ + size_; }
    const_iterator end() const { return data_ + size_; }
};

} // namespace pro2

#endif
```
