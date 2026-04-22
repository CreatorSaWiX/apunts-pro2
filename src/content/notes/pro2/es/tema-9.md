---
title: "Tema 9: Implementación de vectores"
description: "Gestión de memoria, capacidad y costo amortizado."
readTime: "15 min"
order: 10
draft: false
isNew: true
---

## 1. Atributos y estructura interna

Un vector no es más que un **array dinámico** que gestiona su propia memoria en el *heap*. Para hacerlo, necesita tres atributos básicos:

- **`T* data_`**: Puntero al bloque de memoria donde guardamos los elementos.
- **`int size_`**: Cuántas casillas estamos usando realmente.
- **`int capacity_`**: Cuántas casillas hemos reservado en total (tamaño del bloque en el heap).

```cpp
template <typename T>
class Vector {
    T* data_;
    int size_;
    int capacity_;
    
    void reallocate_(int new_cap); // El "motor" del vector
public:
    // ... métodos públicos ...
};
```

## 2. El motor: `reallocate_`

Este método privado es el único que pide memoria nueva. Sigue siempre estos 4 pasos:

1. Pide un nuevo bloque de tamaño `new_cap`.
2. Copia los elementos del bloque viejo al nuevo.
3. Libera la memoria vieja (`delete[] data_`).
4. Actualiza el puntero `data_` y la `capacity_`.

```cpp
void reallocate_(int new_cap) {
    T* new_data = new T[new_cap];
    for (int i = 0; i < size_; ++i) {
        new_data[i] = data_[i];
    }
    delete[] data_;
    data_ = new_data;
    capacity_ = new_cap;
}
```

## 3. Inserción: `push_back` y Crecimiento Exponencial

Cuando queremos añadir un elemento y el vector está lleno (`size_ == capacity_`), el vector **dobla su capacidad**.

```cpp
void push_back(const T& x) {
    if (size_ == capacity_) {
        int new_cap = (capacity_ == 0) ? 1 : 2 * capacity_;
        reallocate_(new_cap);
    }
    data_[size_] = x;
    ++size_;
}
```

### El Costo Amortizado $\mathcal{O}(1)$
Aunque hacer un `reallocate_` cuesta $\mathcal{O}(n)$, solo se hace de vez en cuando. Si analizamos 1000 inserciones, el promedio de costo por inserción acaba siendo **constante**. Esto se conoce como **Costo Amortizado**.

## 4. Extracción: `pop_back` y el "Thrashing"

Para no desperdiciar memoria, si el vector se está vaciando, deberíamos reducir su capacidad. Pero, si la redujéramos justo cuando `size_ == capacity_ / 2`, podríamos caer en el **Thrashing**:
- Haces `push_back` -> Doblas (caro).
- Haces `pop_back` -> Reduces (caro).
- Haces `push_back` -> Vuelves a doblar (caro).

**La solución**: Esperar a que el vector esté muy vacío (**1/4 de la capacidad**) para reducirlo a la **mitad**.

```cpp
void pop_back() {
    --size_;
    if (size_ > 0 && size_ == capacity_ / 4) {
        reallocate_(capacity_ / 2);
    }
}
```

## 5. `reserve` vs `resize`

Son métodos que a menudo se confunden pero hacen cosas muy diferentes:

- **`reserve(n)`**: Cambia la **capacidad**. No toca los elementos. Útil si sabes que tendrás que hacer muchos `push_back` y quieres evitar redimensionamientos.
- **`resize(n)`**: Cambia el **tamaño** real (`size_`). Si `n` es mayor que `size_`, "crea" elementos nuevos con el valor por defecto.

---

## Resumen de complejidad

| Operación | Complejidad | Nota |
| :--- | :--- | :--- |
| **Acceso `[i]`** | $\Theta(1)$ | Directo por puntero. |
| **`push_back`** | $\mathcal{O}(1)$ amortizado | $\mathcal{O}(n)$ en el peor caso (redimensionamiento). |
| **`pop_back`** | $\mathcal{O}(1)$ amortizado | $\mathcal{O}(n)$ si se reduce la memoria. |
| **`size() / empty()`** | $\Theta(1)$ | No cambian según el tamaño. |
