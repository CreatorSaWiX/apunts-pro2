---
title: "Parcial PRO2"
description: "Resumen tema 1 - tema 6"
readTime: "4 min"
order: 7
draft: false
---

## 1. Clases y orientación a objetos (Opcional)
- **Clases:** Convierten `structs` en TADs con privacidad (`public:` y `private:`) para asegurar consistencia de datos.
- **Constructor:** Puntos de inicio con igual nombre que la `class`. **Sobrecarga**: `Class()`, `Class(const Class& other)`.
- **Lista Inicializadores:** `: v1(0), v2(b) {}` Para referencias e inicializar objetos miembro de golpe.
- **`const` methods:** `void get() const;` - Método que no modifica los atributos propios.
- **`static` methods:** Métodos aplicables a nivel global desde la clase. `Classe::metode();`.
- **Inmersiones:** `inc_()`. **Atributos privados:** `int a_`.
- **Control de Ficheros (.hh/.cc) y Make:**
  - **`.hh`**: 1º) `#ifndef XXXX_HH`, 2º) `#define XXXX_HH`, 3º) `class XXXX { ... };` 4º) `#endif`.
  - **`.cc`**: `#include "XXXX.hh"`. Se aplica  `XXXX::XXXX(...) { a_ = a; }`.
  - **Makefile**: `XXXX.o: XXXX.hh XXXX.cc` debajo `g++ -c XXXX.cc`.
- **`inline`:** Elimina coste de llamada a función insertándolo en tiempo de compilación donde toque.
- **`assert`:** `#include "assert.hh"`. Detiene el programa automáticamente si no cumple precondiciones.

## 2. Pilas y colas
- **Stack / Queue / PQ:** `#include <stack>` / `#include <queue>`. **`pop()` siempre devuelve `void`**. Para obtener el valor hay que hacer `top()` o `front()` **antes** del `pop()`.
- **Stack (LIFO):** `push(x)`, `pop()`, `top()`, `empty()`, `size()`.
- **Queue (FIFO):** `push(x)`, `pop()`, `front()`, `empty()`, `size()`.

## 3. Listas y Vectores
- **`list<T>`:** `#include <list>`. Lista doblemente encadenada.
  - **Métodos:** `push_back(x)`, `push_front(x)`, `pop_back()`, `pop_front()`, `insert(it, x)`, `erase(it)`, `back()`, `front()`. No tiene `operator[]`.
- **`vector<T>`:** `#include <vector>`.
  - **Métodos:** `push_back(x)`, `pop_back()`, `insert(it, x)`, `erase(it)`, `back()`, `front()`, `operator[]`.
- **Iteradores:** 
  - `iterator`: Lectura y escritura. `list<T>::iterator it`
  - `const_iterator`: Solo lectura. `list<T>::const_iterator`
  - `reverse_iterator`: Inverso, lectura y escritura. `list<T>::reverse_iterator`
  - `const_reverse_iterator`: Inverso, solo lectura. `list<T>::const_reverse_iterator`
  - **Posiciones:** `begin()`, `end()`, `rbegin()`, `rend()`.
  - **Uso:** `*it` (acceso), `it++`, `it--`. Retornos `it = L.erase(it);`.

## 4. Árboles binarios (`BinTree<T>`)
- **`BinTree<T>`:** `#include "BinTree.hh"`. Estructura recursiva inmutable.
  - **Métodos:** `value()`, `left()`, `right()`, `empty()`.
- **Recorridos:** DFS (Pre/In/Postorden) y BFS (niveles).
- **Estrategias de Resolución:**
  1. **Casos base:** Comprobar `t.empty()` y, si es necesario, caso **hoja** (`left` y `right` vacíos).
  2. **Inmersión:** Por si los árboles hablan entre ellos (Ej: si todos nodos iguales, si todas hojas iguales, si suma de nodos hijos = nodo actual, etc). Usar función auxiliar (`nombre__()`) con parámetro por **referencia** (ej: `int& x`) para guardar estados.
  3. **Salto de fe:** Resuelve el nodo actual y asume que la recursividad ya funciona para los hijos.

## 5. Colas de prioridad y árboles generales
- **`Heap<T>`:** `#include "heap.hh"`.
  - **Métodos:** `push(x)`, `pop()`, `top()`, `empty()`, `size()`.
- **`Tree<T>`:** Árbol general (n-ario).
  - **Métodos:** `value()`, `num_children()`, `child(i)`, `empty()`.

## 6. Diccionarios: map y set
- **`set<T>`:** `#include <set>`. **Conjunto ordenado** que no admite duplicados. Para usar `set` com un `struct`, hay que definir el **`operator<`** (establecer el orden).
  - **Métodos:** `insert(x)`, `erase(x)`, `find(x)`, `empty()`, `size()`.
  - **Iteradores:** `begin()`, `end()`. Se accede al valor con `*it`.
- **`multiset<T>`:** Igual que el `set`, pero permite duplicados (útil para rankings donde dos elementos pueden empatar en todo).
- **`map<K, V>`:** `#include <map>`. Ordena automáticamente por la **clave** (`K`). Elementos internos: `pair<clave, valor>`.
  - **Métodos:** `m[clave] = val`, `insert({clave, val})`, `erase(x)`, `find(clave)`, `empty()`, `size()`.
  - **Iteradores:** `begin()`, `end()`. Se accede como `it->first` (clave) y `it->second` (valor).

## 7. Resumen oficial PRO2 2026-primavera

| Método | `Stack` | `Queue` | `Heap` | `vector` | `list` | `map` | `set` |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **`push(x)`** | $\mathcal{O}(1)$ | $\mathcal{O}(1)$ | $\mathcal{O}(\log n)$ | — | — | — | — |
| **`pop()`** | $\mathcal{O}(1)$ | $\mathcal{O}(1)$ | $\mathcal{O}(\log n)$ | — | — | — | — |
| **`top()`** | $\mathcal{O}(1)$ | — | $\mathcal{O}(1)$ | — | — | — | — |
| **`front()`** | — | $\mathcal{O}(1)$ | — | $\mathcal{O}(1)$ | $\mathcal{O}(1)$ | — | — |
| **`back()`** | — | — | — | $\mathcal{O}(1)$ | $\mathcal{O}(1)$ | — | — |
| **`push_back(x)`** | — | — | — | $\mathcal{O}(1)^*$ | $\mathcal{O}(1)$ | — | — |
| **`push_front(x)`** | — | — | — | — | $\mathcal{O}(1)$ | — | — |
| **`pop_back()`** | — | — | — | $\mathcal{O}(1)$ | $\mathcal{O}(1)$ | — | — |
| **`pop_front()`** | — | — | — | — | $\mathcal{O}(1)$ | — | — |
| **`operator[](·)`** | — | — | — | $\mathcal{O}(1)$ | — | $\mathcal{O}(\log n)$ | — |
| **`find(·)`** | — | — | — | — | — | $\mathcal{O}(\log n)$ | $\mathcal{O}(\log n)$ |
| **`insert(x)`** | — | — | — | — | — | $\mathcal{O}(\log n)$ | $\mathcal{O}(\log n)$ |
| **`insert(pos, x)`** | — | — | — | $\mathcal{O}(n)$ | $\mathcal{O}(1)^\dagger$ | — | — |
| **`erase(x)`** | — | — | — | — | — | $\mathcal{O}(\log n)$ | $\mathcal{O}(\log n)$ |
| **`erase(pos)`** | — | — | — | $\mathcal{O}(n)$ | $\mathcal{O}(1)^\dagger$ | — | — |

> **Notas y Leyenda:**
> - `*` **Coste amortizado:** de vez en cuando hay que redimensionar el vector interno ($\mathcal{O}(n)$), pero de media cada operación es $\mathcal{O}(1)$.
> - `†` **Con iterador:** si ya tenemos el iterador en la posición, insertar/eliminar es $\mathcal{O}(1)$. Encontrar la posición es $\mathcal{O}(n)$.
> - Todos los contenedores tienen **`size()`** y **`empty()`** en **$\mathcal{O}(1)$**.
> - Para `vector` y `list`, `insert(pos, x)` y `erase(pos)` utilizan un iterador como posición.
> - Para `map` y `set`, `insert(x)` y `erase(x)` operan por clave/valor.
