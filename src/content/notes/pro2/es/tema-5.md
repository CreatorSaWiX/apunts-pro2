---
title: "Tema 5: Colas de prioridad y árboles generales"
description: "Estructuras avanzadas de binary heaps para colas y árboles generales."
readTime: "8 min"
order: 5
---

## 5.1 La cola de prioridad

A diferencia de una cola normal FIFO (donde el primero en entrar es el primero en salir), una **cola de prioridad** atiende siempre al elemento con **mayor prioridad** (más grande o urgente), independientemente del orden de llegada.

| Implementación | `push(x)` | `top()` | `pop()` |
| :--- | :---: | :---: | :---: |
| **Vector desordenado** | $\mathcal{O}(1)$ | $\mathcal{O}(n)$ | $\mathcal{O}(n)$ |
| **Vector ordenado** | $\mathcal{O}(n)$ | $\mathcal{O}(1)$ | $\mathcal{O}(1)$ |
| **Binary Heap** | **$\mathcal{O}(\log n)$** | **$\mathcal{O}(1)$** | **$\mathcal{O}(\log n)$** |

Con vectores convencionales debemos elegir entre insertar rápido o extraer rápido. El **binary heap** es la herramienta idónea porque logra un equilibrio excelente con coste logarítmico **$\mathcal{O}(\log n)$** en ambas operaciones.

---

## 5.2 El binary heap

Es un **árbol binario completo** almacenado directamente dentro de un **vector** (sin punteros):
- **Raíz en `v[1]`:** Contiene siempre el valor **máximo absoluto** (cada padre es $\ge$ que sus hijos).
- **Fórmulas de índices:** Para cualquier nodo en la posición $i$:
  - **Padre:** `i / 2`
  - **Hijo izquierdo:** `2 * i`
  - **Hijo derecho:** `2 * i + 1`
- **¿Por qué se ignora `v[0]`?** Porque en el índice 0 el hijo sería $2 \cdot 0 = 0$. Empezando en 1, la aritmética es directa y exacta.

:::heapviz
:::

---

### `push(x)` — Insertar (`flow_up`)
1. Se añade $x$ en la última posición del vector.
2. Si es mayor que su padre, hace `swap` y **sube** hasta su posición.

:::algoviz{algorithm="heap_push"}
:::

---

### `pop()` — Extraer el máximo (`flow_down`)
1. Se extrae la raíz (`v[1]`) y se coloca el **último elemento** del vector en la raíz.
2. Si es menor que algún hijo, hace `swap` con el **hijo mayor** y **baja** hasta su posición.

:::algoviz{algorithm="heap_pop"}
:::

> **Complejidad:** `top()` es **$\mathcal{O}(1)$** (acceso a `v[1]`). `push()` y `pop()` son **$\mathcal{O}(\log n)$** (altura del árbol).

---

## 5.3 Tipos personalizados (`struct`) y `operator>`

La clase `pro2::Heap<T>` ordena los elementos con el operador `>`. Para guardar un `struct`, solo hay que definir su función de comparación:

```cpp
struct Paquet {
    int prioritat;
    string nom;
};

bool operator>(const Paquet& a, const Paquet& b) {
    return a.prioritat > b.prioritat; // el de mayor prioridad queda en la cima
}
```

> **Nota:** La sobrecarga formal de operadores se estudia en profundidad en el [Tema 9: Implementación de vectores](/notes/pro2/es/tema-9).

---

## 5.4 Árboles generales (`Tree<T>`)

A diferencia de los árboles binarios (`BinTree<T>`), en un **árbol general (`Tree<T>`)** cada nodo puede tener un número arbitrario de hijos ($0, 1, 2, \dots, k$).

### Métodos principales de `Tree<T>`
- `t.empty()`: Comprueba si el árbol está vacío.
- `t.value()`: Devuelve el valor de la raíz.
- `t.num_children()`: Número de hijos directos de la raíz.
- `t.child(i)`: Devuelve el subárbol del hijo $i$-ésimo ($0 \le i < \text{num\_children()}$).

### Recorrido recursivo (Búsqueda de un elemento)

Para recorrer un árbol general sustituimos las dos llamadas fijas (`left()` y `right()`) por un **bucle iterativo** sobre sus hijos:

:::algoviz{algorithm="tree_general_search"}
:::
