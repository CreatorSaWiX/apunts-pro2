---
title: "Tema 4: Inmersión y árboles binarios"
description: "Vencer las limitaciones de la recursividad y dominio total y rápido de los árboles binarios."
readTime: "8 min"
order: 4
---

## 4.1 La inmersión

A menudo en el examen nos piden una función con una cabecera fija (como `reverse(string s)`), pero para resolverla recursivamente necesitamos **parámetros adicionales** (como un acumulador o contadores).

<br>

La **inmersión** consiste en:
1. Crear una **función auxiliar** (inmersa) con los parámetros extra necesarios.
2. Hacer que la **función pública** solo llame a la función auxiliar con los valores iniciales.

### Ejemplo 1: Invertir un texto (`reverse`)

Necesitamos un parámetro índice `i` para recorrer el texto sin hacer copias:

:::oopviz{simulation="immersio_reverse"}
:::

### Ejemplo 2: Fibonacci lineal $\mathcal{O}(n)$

El Fibonacci recursivo simple tiene un coste exponencial $\mathcal{O}(2^n)$ porque repite cálculos. Con inmersión pasamos los dos últimos números y reducimos el coste a **$\mathcal{O}(n)$**:

:::oopviz{simulation="immersio_fibonacci"}
:::

---

## 4.2 El árbol binario (`BinTree<T>`)

Un **árbol binario (`BinTree`)** es una estructura de datos recursiva: o bien está **vacío**, o bien tiene un nodo **raíz** (`value()`) y dos subárboles: el **hijo izquierdo** (`left()`) y el **hijo derecho** (`right()`).

:::warning
**Los árboles `BinTree` son inmutables:** una vez creados, no se pueden modificar directamente (no tienen métodos como `set_value()`). Para alterar un árbol es necesario construir uno nuevo combinando las ramas con el constructor `BinTree(x, left, right)`.
:::

:::bintreeviz
:::

---

## 4.3 Funciones básicas: búsqueda y altura

Las funciones sobre `BinTree` se resuelven de forma natural con **recursión**:

### 1. Calcular la altura (`height`)
La altura de un árbol vacío es `0`. Si no está vacío, es `1 + max(altura(izquierdo), altura(derecho))`:

:::algoviz{algorithm="height"}
:::

### 2. Buscar un elemento (`cerca`)
Comprueba si la raíz es el valor buscado `x`. Si no, busca a la izquierda o a la derecha aprovechando el cortocircuito del operador `||`:

:::algoviz{algorithm="cerca_height"}
:::

---

## 4.4 Los recorridos globales

Un **recorrido** visita todos los nodos del árbol exactamente una vez. Según el orden en el que se procesa la raíz respecto a sus hijos:

### Búsqueda en profundidad (DFS)

- **Preorden:** *Raíz → Izquierdo → Derecho* (procesa la raíz antes de bajar a los hijos):
:::algoviz{algorithm="preordre"}
:::

- **Inorden:** *Izquierdo → Raíz → Derecho* (procesa el hijo izquierdo, después la raíz, y finalmente el hijo derecho):
:::algoviz{algorithm="inordre"}
:::

- **Postorden:** *Izquierdo → Derecho → Raíz* (procesa primero ambos hijos y la raíz al final):
:::algoviz{algorithm="postordre"}
:::

### Búsqueda en anchura (BFS)
Visita los nodos nivel por nivel (de izquierda a derecha) utilizando una **cola (`queue`)**:

:::algoviz{algorithm="bfs"}
:::

:::tip
**Consejo de examen (Cálculos en una sola pasada):**
Si tienes que calcular dos propiedades de un árbol a la vez (por ejemplo, la suma y la cantidad de nodos para hacer la media, o la altura y si está equilibrado), **no hagas dos llamadas recursivas separadas**. Haz una sola pasada $\mathcal{O}(n)$ devolviendo un `pair<A, B>` o pasando parámetros por referencia (`&`).
:::

