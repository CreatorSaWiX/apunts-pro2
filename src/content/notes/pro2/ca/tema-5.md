---
title: "Tema 5: Cues de prioritat i arbres generals"
description: "Estructures avançades de binary heaps per cues i arbres generals."
readTime: "8 min"
order: 5
---

## 5.1 La cua de prioritat

A diferència d'una cua normal FIFO (on el primer a entrar és el primer a sortir), una **cua de prioritat** atén sempre l'element amb **més prioritat** (més gran o urgent), independentment de l'ordre d'arribada.

| Implementació | `push(x)` | `top()` | `pop()` |
| :--- | :---: | :---: | :---: |
| **Vector desordenat** | $\mathcal{O}(1)$ | $\mathcal{O}(n)$ | $\mathcal{O}(n)$ |
| **Vector ordenat** | $\mathcal{O}(n)$ | $\mathcal{O}(1)$ | $\mathcal{O}(1)$ |
| **Binary Heap** | **$\mathcal{O}(\log n)$** | **$\mathcal{O}(1)$** | **$\mathcal{O}(\log n)$** |

Amb vectors convencionals hem de triar entre inserir ràpid o extreure ràpid. El **binary heap** és l'eina definitiva perquè aconsegueix un equilibri excel·lent amb cost logarítmic **$\mathcal{O}(\log n)$** en ambdues operacions.

---

## 5.2 El binary heap

És un **arbre binari complet** emmagatzemat directament dins d'un **vector** (sense punters):
- **Arrel a `v[1]`:** Conté sempre el valor **màxim absolut** (cada pare és $\ge$ que els seus fills).
- **Fórmules d'índexs:** Per a qualsevol node a la posició $i$:
  - **Pare:** `i / 2`
  - **Fill esquerre:** `2 * i`
  - **Fill dret:** `2 * i + 1`
- **Per què s'ignora `v[0]`?** Perquè a l'índex 0 el fill seria $2 \cdot 0 = 0$. Començant a 1, l'aritmètica és directa i exacta.

:::heapviz
:::

---

### `push(x)` — Inserir (`flow_up`)
1. S'afegeix $x$ a l'última posició del vector.
2. Si és més gran que el seu pare, fa `swap` i **puja** fins a la seva posició.

:::algoviz{algorithm="heap_push"}
:::

---

### `pop()` — Extreure el màxim (`flow_down`)
1. S'extreu l'arrel (`v[1]`) i s'hi col·loca l'**últim element** del vector.
2. Si és menor que algun fill, fa `swap` amb el **fill més gran** i **baixa** fins a la seva posició.

:::algoviz{algorithm="heap_pop"}
:::

> **Complexitat:** `top()` és **$\mathcal{O}(1)$** (accés a `v[1]`). `push()` i `pop()` són **$\mathcal{O}(\log n)$** (alçada de l'arbre).

---

## 5.3 Tipus personalitzats (`struct`) i `operator>`

La classe `pro2::Heap<T>` ordena els elements amb l'operador `>`. Per guardar-hi un `struct`, només cal definir la seva funció de comparació:

```cpp
struct Paquet {
    int prioritat;
    string nom;
};

bool operator>(const Paquet& a, const Paquet& b) {
    return a.prioritat > b.prioritat; // el de més prioritat queda al cim
}
```

> **Nota:** La sobrecàrrega formal d'operadors s'estudia en profunditat al [Tema 9: Implementació de vectors](/notes/pro2/ca/tema-9).

---

## 5.4 Arbres generals (`Tree<T>`)

A diferència dels arbres binaris (`BinTree<T>`), a un **arbre general (`Tree<T>`)** cada node pot tenir un nombre arbitrari de fills ($0, 1, 2, \dots, k$).

### Mètodes principals de `Tree<T>`
- `t.empty()`: Comprova si l'arbre és buit.
- `t.value()`: Retorna el valor de l'arrel.
- `t.num_children()`: Nombre de fills directes de l'arrel.
- `t.child(i)`: Retorna el subarbre del fill $i$-èssim ($0 \le i < \text{num\_children()}$).

### Recorregut recursiu (Cerca d'un element)

Per recórrer un arbre general substituïm les dues crides fixes (`left()` i `right()`) per un **bucle iteratiu** sobre els seus fills:

:::algoviz{algorithm="tree_general_search"}
:::
