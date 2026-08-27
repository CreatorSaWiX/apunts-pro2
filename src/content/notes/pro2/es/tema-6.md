---
title: "Tema 6: Árboles de búsqueda y maps"
description: "BSTs para búsquedas logarítmicas y el potente contenedor asociativo map<K, V>."
readTime: "10 min"
order: 6
---

## 6.1 El problema de la búsqueda

Con estructuras lineales convencionales debemos elegir entre insertar rápido o buscar rápido:

| Estructura | Búsqueda | Inserción |
| :--- | :---: | :---: |
| **Vector desordenado** | $\mathcal{O}(n)$ | $\mathcal{O}(1)$ |
| **Vector ordenado** | $\mathcal{O}(\log n)$ | $\mathcal{O}(n)$ |
| **Lista enlazada (`list`)** | $\mathcal{O}(n)$ | $\mathcal{O}(1)$ |
| **Árbol Binario de Búsqueda (BST)** | **$\mathcal{O}(\log n)$** | **$\mathcal{O}(\log n)$** |

El **Árbol Binario de Búsqueda (BST)** resuelve este dilema logrando un equilibrio logarítmico en ambas operaciones.

---

## 6.2 Árbol Binario de Búsqueda (BST)

Un **BST** (*Binary Search Tree*) es un `BinTree<T>` donde cada nodo cumple una regla de orden estricta:

> - Todos los valores del **subárbol izquierdo** son **menores** ($< \text{nodo}$).
> - Todos los valores del **subárbol derecho** son **mayores** ($> \text{nodo}$).

:::bstviz
:::

- **Recorrido inorden:** Visitar *izquierdo $\rightarrow$ raíz $\rightarrow$ derecho* produce automáticamente la secuencia **ordenada de menor a mayor** en tiempo lineal $\Theta(n)$.

---

## 6.3 Búsqueda en un BST

En cada paso comparamos $x$ con el valor del nodo actual y **descartamos la mitad del árbol**:
- Si $x < \text{nodo}$: buscamos solo en el subárbol **izquierdo**.
- Si $x > \text{nodo}$: buscamos solo en el subárbol **derecho**.

:::algoviz{algorithm="bst_search"}
:::

> **Complejidad:** **$\mathcal{O}(\log n)$** en un árbol equilibrado (proporcional a la altura). En el peor caso de un árbol degenerado (en forma de lista), puede llegar a $\mathcal{O}(n)$.

---

### Mínimo y máximo
- **Mínimo:** Descender siempre hacia la izquierda hasta encontrar un nodo sin hijo izquierdo.
- **Máximo:** Descender siempre hacia la derecha hasta encontrar un nodo sin hijo derecho.

```cpp
int bst_min(const BinTree<int>& a) {
    if (a.left().empty()) return a.value();
    return bst_min(a.left());
}

int bst_max(const BinTree<int>& a) {
    if (a.right().empty()) return a.value();
    return bst_max(a.right());
}
```

---

## 6.4 Inserción en un BST

Como `BinTree<T>` es **inmutable**, la inserción no modifica el árbol original: **reconstruye únicamente el camino** hasta la posición del nuevo nodo y **reutiliza** todos los subárboles no afectados:

:::algoviz{algorithm="bst_insert"}
:::

> **Estructura persistente:** Los subárboles no modificados se comparten en memoria directamente sin duplicar datos. Coste en tiempo y espacio: **$\mathcal{O}(\log n)$**.

---

## 6.5 El contenedor `map<K, V>`

La STL de C++ ofrece **`map<K, V>`**, un diccionario que asocia **claves únicas** (`K`) a **valores** (`V`). Internamente, cada elemento se almacena como un **`pair<const K, V>`** (`it->first` para la clave, `it->second` para el valor).

### Operaciones principales — Coste $\mathcal{O}(\log n)$

| Operación | Sintaxis | Comportamiento |
| :--- | :--- | :--- |
| **Acceso / Inserción** | `m[clave] = val;` | Si la clave no existe, **la crea** con el valor por defecto (`0`, `""`, etc.). |
| **Búsqueda** | `m.find(clave)` | Devuelve un iterador al par `{clave, valor}` o `m.end()` si no está. |
| **Existencia** | `m.count(clave)` | Devuelve `1` si la clave existe, `0` si no. |
| **Inserción segura** | `m.insert({k, v})` | Inserta el par solo si `k` **no existía previamente**. |

```cpp
#include <iostream>
#include <map>
#include <string>
using namespace std;

int main() {
    map<string, int> edades;

    // 1. Inserción y modificación con []
    edades["Anna"] = 21;
    edades["Bernat"] = 25;

    // 2. Búsqueda segura con find()
    auto it = edades.find("Anna");
    if (it != edades.end()) {
        cout << it->first << " tiene " << it->second << " años\n";
    }

    // 3. Comprobación rápida de existencia con count()
    if (edades.count("Carla") == 0) {
        cout << "Carla no está en el mapa\n";
    }

    // 4. Inserción sin sobrescribir con insert()
    edades.insert({"Anna", 30}); // ¡No hace nada: "Anna" ya existía con 21!
}
```

:::warning
El operador `m[clave]` **modifica el mapa**, si la clave no existe la crea automáticamente. En contextos constantes (`const map<K, V>& m`), usar `[]` produce un **error de compilación**. En estos casos, utiliza siempre `m.find(clave)`.
:::

---

## 6.6 El `map` como acumulador

Uno de los patrones más utilizados de `map` es contar o agrupar elementos. El operador `[]` gestiona ambos casos en una sola línea:

1. Si la clave **no existe** $\rightarrow$ la crea con el valor por defecto (`0`, `vector` vacío, etc.) y realiza la operación.
2. Si la clave **ya existe** $\rightarrow$ recupera la referencia al valor existente y la actualiza.

### Ejemplo 1: Contador de frecuencias

```cpp
map<string, int> word_count;
string word;
while (cin >> word) {
    word_count[word]++;  // Si no está, crea ("gat", 0) y hace ++ -> ("gat", 1)
}
```

### Ejemplo 2: Agrupación por longitud (Clave $\rightarrow$ Vector)

```cpp
map<int, vector<string>> by_length;
string word;
while (cin >> word) {
    by_length[word.size()].push_back(word); // Crea el vector si hace falta y añade la palabra
}
```

---

## 6.7 Iterar sobre un `map`

Los iteradores de un `map` recorren los elementos **en orden ascendente de clave** (recorrido en inorden del BST interno):

```cpp
map<string, int> edades = {{"Anna", 21}, {"Bernat", 25}};

// 1. Con iteradores
for (auto it = edades.begin(); it != edades.end(); ++it) {
    cout << it->first << " tiene " << it->second << " años\n";
    // it->second = 22;      // VÁLIDO: el valor se puede modificar
    // it->first = "Maria";  // ERROR: la clave es constante para proteger el BST
}

// 2. Con Structured Binding (C++17)
for (const auto& [nombre, edad] : edades) {
    cout << nombre << " -> " << edad << "\n";
}
```

---

## 6.8 El contenedor `set<T>`

Un **`set<T>`** es una colección de **claves únicas y ordenadas** sin valor asociado. Internamente se implementa como un BST equilibrado donde cada elemento es su propia clave.

### Operaciones principales — Coste $\mathcal{O}(\log n)$

| Operación | Sintaxis | Comportamiento |
| :--- | :--- | :--- |
| **Inserción** | `s.insert(elem)` | Añade el elemento si no estaba. Devuelve `pair<iterator, bool>`. |
| **Búsqueda** | `s.find(elem)` | Devuelve un iterador al elemento o `s.end()` si no está. |
| **Pertenencia** | `s.count(elem)` | Devuelve `1` si el elemento existe, `0` si no. |
| **Borrado** | `s.erase(elem)` | Elimina el elemento del conjunto (si existe). |

```cpp
#include <iostream>
#include <set>
#include <string>
using namespace std;

int main() {
    set<string> vocabulario;

    // 1. Inserción (ignora duplicados automáticamente)
    vocabulario.insert("hola");
    vocabulario.insert("mundo");
    vocabulario.insert("hola"); // ¡No hace nada: "hola" ya existía!

    // 2. Comprobación de pertenencia
    if (vocabulario.count("mundo") == 1) {
        cout << "'mundo' está en el conjunto\n";
    }

    // 3. Iteración ordenada (los elementos son const T)
    for (auto it = vocabulario.begin(); it != vocabulario.end(); ++it) {
        cout << *it << " "; // Imprime en orden alfabético: "hola mundo"
    }
    cout << "\n";

    // 4. Borrado
    vocabulario.erase("hola");
}
```

:::tip
Si necesitas elementos repetidos, la STL ofrece **`multiset<T>`** y **`multimap<K, V>`**. En un `set` o `map` estándar, las claves son estrictamente únicas.
:::

---

## 6.9 Cuándo usar cada contenedor

| Situación | Contenedor recomendado | Coste búsqueda |
| :--- | :--- | :--- |
| **Búsqueda frecuente en datos ordenados** | `map<K, V>` o `set<T>` | $\mathcal{O}(\log n)$ |
| **Sin orden, máxima velocidad de búsqueda** | `unordered_map<K, V>` o `unordered_set<T>` | $\mathcal{O}(1)$ amortizado |
| **Acceso directo por índice numérico ($0..n-1$)** | `vector<T>` | $\mathcal{O}(1)$ |
| **Inserción / borrado frecuente en medio** | `list<T>` | $\mathcal{O}(1)$ |
| **Colección de elementos únicos** | `set<T>` | $\mathcal{O}(\log n)$ |
| **Acumulador / agrupador clave $\rightarrow$ lista** | `map<K, vector<T>>` | $\mathcal{O}(\log n)$ |
