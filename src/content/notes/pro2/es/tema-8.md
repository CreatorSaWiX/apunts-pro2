---
title: "Tema 8: Pointers y Memoria Dinámica"
description: "Gestión de memoria en C++, operadores, aliasing y gestión del 'heap'."
readTime: "20 min"
order: 9
draft: false
isNew: true
---

## 1. La memoria en C++: Stack vs Heap

Para entender los punteros, primero debemos saber dónde se almacenan los datos. La memoria de un programa se divide principalmente en dos zonas:

| Característica | Stack (Pila) | Heap (Montículo) |
| :--- | :--- | :--- |
| **Gestión** | Automática (por el ordenador). | Manual (por el programador). |
| **Velocidad** | Muy rápida. | Más lenta. |
| **Tamaño** | Limitado y fijo. | Muy grande (memoria RAM disponible). |
| **Ciclo de vida** | Las variables nacen y mueren al salir del bloque `{}`. | Se mantienen vivas hasta que se llama a `delete`. |



## 2. ¿Qué es un pointer?

Un **puntero** es una variable que, en lugar de almacenar un valor (como un `int` o `char`), almacena una **dirección de memoria**.

| Operador | Nombre | Función | Ejemplo |
| :--- | :--- | :--- | :--- |
| **`&`** | Dirección de (address-of) | Obtiene la dirección de memoria de una variable. | `p = &x;` |
| **`*`** | Indirección (dereference) | Accede al contenido de la dirección que guarda el pointer. | `cout << *p;` |
| **`->`** | Flecha (arrow) | Accede a un miembro de una clase/estructura vía puntero. | `p->metodo();` |

> **Nota sobre `nullptr`**: Desde C++11, se utiliza `nullptr` para indicar que un puntero no apunta a ningún lugar. Es mucho más seguro que el viejo `NULL` o `0`.

```cpp
int x = 10;
int* p = &x; // p apunta a x

cout << p;   // Imprime una dirección: 0x7ffe...
cout << *p;  // Imprime el valor de x: 10
```

## 3. Gestión dinámica de memoria

Esta es la utilidad real de los punteros: pedir memoria en tiempo de ejecución.

### `new` y `delete`

1.  **`new T`**: Reserva espacio en el **heap** para un objeto de tipo `T` y devuelve su dirección.
2.  **`delete p`**: Libera la memoria reservada previamente con `new`.

```cpp
// Reserva dinámica
int* p = new int; 
*p = 42;

// Uso
cout << *p;

// Liberación
delete p; 
p = nullptr; // Buena práctica: evitar punteros colgantes
```

> Por cada `new` que hagas, debe haber un `delete`. Si no, tendrás un **memory leak** (fuga de memoria).

## 4. Aliasing y asignación

El **aliasing** ocurre cuando dos o más punteros apuntan a la misma dirección de memoria. Modificar el valor a través de un puntero afecta a todos los otros "alias".
```cpp
int* p1 = new int(10);
int* p2 = p1; // Aliasing: p2 apunta donde apunta p1

*p2 = 20;
cout << *p1; // ¡Imprimirá 20!
```

## 5. El peligro de los punteros: errores comunes

El uso de punteros requiere mucha disciplina. Los errores más habituales en PRO2 son:

1.  **Segmentation Fault**: Intentar acceder a una dirección no válida (ej: puntero `nullptr` o no inicializado).
2.  **Memory Leak**: Perder la dirección de una zona de memoria reservada sin haber hecho `delete`.
3.  **Dangling Pointer (Puntero colgante)**: Tener un puntero que apunta a una dirección que ya ha sido liberada.

## 6. Implementación de estructuras enlazadas

Los punteros nos permiten crear estructuras de tamaño variable llamadas **linked nodes**. Un nodo típico contiene un dato y un puntero al siguiente nodo.

```cpp
struct Node {
    int info;
    Node* seg;
};
```

### Visualización de nodos
Un conjunto de nodos nos permite implementar Pilas, Colas y Listas sin las limitaciones de tamaño de los vectores estáticos.



:::graph
```json
{
  "nodes": [
    { "id": "n1", "label": "Nodo 1 (info: 10)" },
    { "id": "n2", "label": "Nodo 2 (info: 20)" },
    { "id": "n3", "label": "Nodo 3 (info: 30)" },
    { "id": "null", "label": "nullptr", "color": "#ef4444" }
  ],
  "links": [
    { "source": "n1", "target": "n2", "label": "seg" },
    { "source": "n2", "target": "n3", "label": "seg" },
    { "source": "n3", "target": "null", "label": "seg" }
  ]
}
```
:::

---

## 7. Punteros vs Iterators

En PRO2, a menudo utilizamos **iteradores** para recorrer listas, conjuntos o mapas. Aunque parecen similares (ambos usan `*` y `++`), hay diferencias clave:

- **Puntero**: Es una dirección de memoria real. Es de "bajo nivel".
- **Iterador**: Es un objeto que "simula" ser un puntero para recorrer una estructura. Es de "alto nivel".

> Un puntero puede ser visto como un iterador de un vector, pero un iterador de un `std::list` no es necesariamente un punteros (internamente puede ser más complejo).

---

## 8. Paso de parámetros 

| Tipo | Sintaxis | Efecto | Eficiencia |
| :--- | :--- | :--- | :--- |
| **Por valor** | `f(int x)` | Copia del valor. | Baja (si el objeto es grande). |
| **Por referencia** | `f(int& x)` | Alias directo. | Alta. |
| **Por punteros** | `f(int* x)` | Pasa la dirección. | Alta. |

> En PRO2, preferimos **referencias constantes** (`const T& x`) para objetos grandes que no queremos modificar, y **punteros** solo cuando necesitamos que el parámetro pueda ser opcional (`nullptr`) o para estructuras dinámicas.