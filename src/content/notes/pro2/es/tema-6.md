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

La STL de C++ ofrece el contenedor **`map<K, V>`**, un diccionario implementado internamente como un **BST equilibrado** (árbol Rojo-Negro). Asocia **claves únicas** (`K`) a **valores** (`V`).

```cpp
#include <map>
using namespace std;

map<string, int> m;
m["un"]  = 1;
m["deu"] = 10;
```

Internamente, cada elemento es un **`pair<K, V>`** con los campos `first` (clave) y `second` (valor).

### El operador `[]`: la puerta de entrada

El operador `[]` es la forma más natural de usar un `map`. Si la clave **no existe**, la crea automáticamente con el valor por defecto del tipo (`0` para `int`, `""` para `string`).

:::warning
Usar `m["clave"]` en un `map` `const` es **error de compilación** porque no puede crear elementos. Utiliza `m.find("clave")` o `m.at("clave")` en contextos `const`.
:::

### `find`: la búsqueda segura

```cpp
map<string, int> m = {{"un", 1}, {"deu", 10}};

auto it = m.find("deu");
if (it != m.end()) {
    cout << "Valor asociado: " << it->second << endl; // 10
}
```

`find` devuelve un **iterador** apuntando al par `{clave, valor}` si lo encuentra, o a `m.end()` si no está. Coste: $\mathcal{O}(\log n)$.

### `insert`: añadir sin sobreescribir

```cpp
m.insert({20, "twenty"});
m.insert({20, "minus twenty"}); // ¡NO sustituye si ya existe!
```

El tipo de retorno de `insert` es `pair<iterator, bool>`: el iterador al elemento y `true` si se ha insertado (`false` si ya existía).

---

## 6.6 El `map` como acumulador

Uno de los usos estrella del `map` es acumular y contar. El operador `[]` hace todo el trabajo:

1. Si la clave **no existe** → la crea con valor `0`, luego hace `++`.
2. Si la clave **existe** → recupera el valor actual y hace `++`.

### Ejemplo 1: Frecuencia de palabras

```cpp
#include <map>
#include <iostream>
using namespace std;

int main() {
    map<string, int> word_count;
    string word;
    while (cin >> word) {
        word_count[word]++;  // <-- ¡magia pura!
    }
    for (auto it = word_count.begin(); it != word_count.end(); ++it) {
        cout << it->first << ": " << it->second << endl;
    }
}
```

### Ejemplo 2: Agrupa palabras por longitud

```cpp
map<int, vector<string>> by_length;
string word;
while (cin >> word) {
    by_length[word.size()].push_back(word);
}
```

:::oopviz{simulation="racional_class"}
:::

---

## 6.7 Iterar sobre un `map`

Los iteradores de `map` recorren los elementos **en orden ascendente por clave** (porque internamente es un BST ordenado). El operador `->` accede a los campos `first` y `second` del par:

```cpp
map<string, int> m;
// ... (llenar el map)

for (auto it = m.begin(); it != m.end(); ++it) {
    cout << "clave: " << it->first
         << ", valor: " << it->second << endl;
}
```

O con el bucle `for-each` moderno (C++11):

```cpp
for (const auto& [clave, valor] : m) {
    cout << clave << " → " << valor << endl;
}
```

---

## 6.8 El contenedor `set<T>`

Un **`set<T>`** es un `map` donde solo existe la clave, sin valor asociado. Se utiliza para:
- **Eliminar duplicados** de una secuencia.
- **Contar el vocabulario** (palabras únicas).
- **Comprobar pertenencia** en $\mathcal{O}(\log n)$.

```cpp
#include <set>
using namespace std;

set<string> vocabulari;
string paraula;
while (cin >> paraula) {
    vocabulari.insert(paraula);
}
cout << "Palabras únicas: " << vocabulari.size() << endl;
```

:::tip
Si necesitas claves **repetidas** (multiset o multimap), C++ ofrece `multiset<T>` y `multimap<K, V>`. En un `map` normal, dos inserciones con la misma clave **no** añaden un segundo elemento.
:::

---

## 6.9 Cuándo usar cada contenedor

| Situación | Contenedor recomendado |
|:---|:---|
| Búsqueda frecuente en datos ordenados | `map<K,V>` o `set<T>` |
| Sin orden, búsqueda máxima velocidad | `unordered_map<K,V>` ($\mathcal{O}(1)$ amortizado) |
| Acceso por índice numérico | `vector<T>` |
| Inserción/borrado frecuente en medio | `list<T>` |
| Colección de elementos únicos | `set<T>` |
| Acumulador clave→contador/lista | `map<K, vector<T>>` |
