---
title: "Tema 6: Arbres de cerca i maps"
description: "BSTs per a cerques logarítmiques i el potent contenidor associatiu map<K, V>."
readTime: "10 min"
order: 6
---

## 6.1 El problema de la cerca

Fins ara hem vist dues estructures lineals principals per guardar dades:

| Contenidor | Accés | Cerca | Inserció al mig |
|:---|:---:|:---:|:---:|
| `vector<T>` (desordenat) | $\Theta(1)$ | $\mathcal{O}(n)$ | $\mathcal{O}(n)$ |
| `vector<T>` (ordenat) | $\Theta(1)$ | $\mathcal{O}(\log n)$ | $\mathcal{O}(n)$ |
| `list<T>` | $\mathcal{O}(n)$ | $\mathcal{O}(n)$ | $\Theta(1)$ |
| `map<K, V>` | — | $\mathcal{O}(\log n)$ | $\mathcal{O}(\log n)$ |
| `set<T>` | — | $\mathcal{O}(\log n)$ | $\mathcal{O}(\log n)$ |

Queda clar: si la cerca és l'operació predominant, necessitem una estructura especialitzada. La solució és un **Arbre Binari de Cerca (BST)**.

---

## 6.2 Arbre Binari de Cerca (BST)

Un **BST** (*Binary Search Tree*) és un `BinTree<T>` que compleix una regla estructural addicional en cada node:

> **Invariant BST:** Tots els valors del **subarbre esquerre** són **estrictament menors** que el node, i tots els del **subarbre dret** són **estrictament majors**.

:::graph
```json
{
  "nodes": [
    { "id": "50", "label": "50 (arrel)", "color": "#0ea5e9" },
    { "id": "20", "label": "20", "color": "#8b5cf6" },
    { "id": "80", "label": "80", "color": "#8b5cf6" },
    { "id": "10", "label": "10" },
    { "id": "30", "label": "30" },
    { "id": "70", "label": "70" },
    { "id": "90", "label": "90" }
  ],
  "links": [
    { "source": "50", "target": "20", "label": "< 50" },
    { "source": "50", "target": "80", "label": "> 50" },
    { "source": "20", "target": "10" },
    { "source": "20", "target": "30" },
    { "source": "80", "target": "70" },
    { "source": "80", "target": "90" }
  ]
}
```
:::

Gràcies a l'invariant, el recorregut **inordre** (*esquerre → arrel → dret*) visita tots els valors **en ordre ascendent** en $\Theta(n)$.

---

## 6.3 Cerca en un BST

La cerca és l'operació més directa i eficient. A cada pas **descartem la meitat de l'arbre** sense ni explorar-la:

```cpp
bool bst_search(const BinTree<int>& a, int x) {
    if (a.empty()) return false;
    if (x == a.value()) return true;
    return bst_search(a.value() < x ? a.left() : a.right(), x);
}
```

Observa el poder de la propietat BST: si `x < a.value()`, **sabem amb certesa** que `x` no pot estar al subarbre dret. El descartem completament sense explorer-lo.

:::algoviz{algorithm="bst_search"}
:::

:::tip
En un BST **equilibrat**, la cerca costa $\mathcal{O}(\log n)$. En el pitjor cas (arbre degenerat/llista), pot arribar a $\mathcal{O}(n)$. La clau és mantenir l'arbre balancejat.
:::

### Mínim i Màxim

El valor mínim és sempre el node més a l'esquerra (baixem tot el camí cap a l'esquerra fins trobar un fill buit). El màxim, el més a la dreta.

```cpp
int bst_min(const BinTree<int>& a) {
    assert(!bst.empty());
    if (a.left().empty()) return a.value();
    return bst_min(a.left());
}

int bst_max(const BinTree<int>& a) {
    assert(!bst.empty());
    if (a.right().empty()) return a.value();
    return bst_min(a.right());
}
```

---

## 6.4 Inserció en un BST

Com que `BinTree<T>` és **immutable**, no podem modificar l'arbre existent. La inserció **reconstrueix el camí** des de l'arrel fins al punt d'inserció, reutilitzant els subarbres que no canvien:

```cpp
BinTree<int> bst_insert(const BinTree<int>& a, int x) {
    if (a.empty())
        return BinTree<int>(x);          // Cas base: aquí va el nou node
    if (x == a.value()) return a;        // Ja existeix, no inserim duplicat
    if (x < a.value())
        return BinTree<int>(a.value(),
                            bst_insert(a.left(), x),  // Reconstruïm branca esq
                            a.right());               // Reutilitzem branca dreta
    return BinTree<int>(a.value(),
                        a.left(),
                        bst_insert(a.right(), x));    // Reutilitzem branca esq
}
```

:::algoviz{algorithm="bst_insert"}
:::

:::info
Fixeu-vos que els subarbres que **no estem travessant** es reutilitzen directament sense copiar-los. Gràcies a la immutabilitat funcional de `BinTree`, el compilador s'encarrega d'optimitzar la compartició de memòria (estructura persistent).
:::

---

## 6.5 El contenidor `map<K, V>`

La STL de C++ ofereix el contenidor **`map<K, V>`**, un diccionari implementat internament com un **BST equilibrat** (arbre Vermell-Negre). Associa **claus úniques** (`K`) a **valors** (`V`).

```cpp
#include <map>
using namespace std;

map<string, int> m;
m["un"]  = 1;
m["deu"] = 10;
```

Internament, cada element és un **`pair<K, V>`** amb els camps `first` (clau) i `second` (valor).

### L'operador `[]`: la porta d'entrada

L'operador `[]` és la forma més natural d'usar un `map`. Si la clau **no existeix**, la crea automàticament amb el valor per defecte del tipus (`0` per a `int`, `""` per a `string`).

:::warning
Usar `m["clau"]` en un `map` `const` és **error de compilació** perquè no pot crear elements. Utilitza `m.find("clau")` o `m.at("clau")` en contextos `const`.
:::

### `find`: la cerca segura

```cpp
map<string, int> m = {{"un", 1}, {"deu", 10}};

auto it = m.find("deu");
if (it != m.end()) {
    cout << "Valor associat: " << it->second << endl; // 10
}
```

`find` retorna un **iterador** apuntant al parell `{clau, valor}` si el troba, o a `m.end()` si no hi és. Cost: $\mathcal{O}(\log n)$.

### `insert`: afegir sense sobreescriure

```cpp
m.insert({20, "twenty"});
m.insert({20, "minus twenty"}); // NO substitueix si ja existeix!
```

El tipus de retorn d'`insert` és `pair<iterator, bool>`: l'iterador a l'element i `true` si s'ha inserit (`false` si ja existia).

---

## 6.6 El `map` com a acumulador

Un dels usos estrella del `map` és acumular i comptar. L'operador `[]` fa tota la feina:

1. Si la clau **no existeix** → la crea amb valor `0`, llavors fa `++`.
2. Si la clau **existeix** → recupera el valor actual i fa `++`.

### Exemple 1: Freqüència de paraules

```cpp
#include <map>
#include <iostream>
using namespace std;

int main() {
    map<string, int> word_count;
    string word;
    while (cin >> word) {
        word_count[word]++;  // <-- màgia pura!
    }
    for (auto it = word_count.begin(); it != word_count.end(); ++it) {
        cout << it->first << ": " << it->second << endl;
    }
}
```

### Exemple 2: Agrupa paraules per longitud

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

Els iteradors de `map` recorren els elements **en ordre ascendent per clau** (perquè internament és un BST ordenat). L'operador `->` accedeix als camps `first` i `second` del parell:

```cpp
map<string, int> m;
// ... (omplir el map)

for (auto it = m.begin(); it != m.end(); ++it) {
    cout << "clau: " << it->first
         << ", valor: " << it->second << endl;
}
```

O amb el bucle `for-each` modern (C++11):

```cpp
for (const auto& [clau, valor] : m) {
    cout << clau << " → " << valor << endl;
}
```

---

## 6.8 El contenidor `set<T>`

Un **`set<T>`** és un `map` on només existeix la clau, sense valor associat. S'utilitza per:
- **Eliminar duplicats** d'una seqüència.
- **Comptar el vocabulari** (paraules úniques).
- **Comprovar pertinença** en $\mathcal{O}(\log n)$.

```cpp
#include <set>
using namespace std;

set<string> vocabulari;
string paraula;
while (cin >> paraula) {
    vocabulari.insert(paraula);
}
cout << "Paraules úniques: " << vocabulari.size() << endl;
```

:::tip
Si necessites claus **repetides** (multiset o multimap), C++ ofereix `multiset<T>` i `multimap<K, V>`. En un `map` normal, dues insercions amb la mateixa clau **no** afegeixen un segon element.
:::

---

## 6.9 Quan usar cada contenidor

| Situació | Contenidor recomanat |
|:---|:---|
| Cerca freqüent en dades ordenades | `map<K,V>` o `set<T>` |
| Sense ordre, cerca màxima velocitat | `unordered_map<K,V>` ($\mathcal{O}(1)$ amortitzat) |
| Accés per índex numèric | `vector<T>` |
| Inserció/esborrat freqüent al mig | `list<T>` |
| Col·lecció d'elements únics | `set<T>` |
| Acumulador clau→comptador/llista | `map<K, vector<T>>` |
