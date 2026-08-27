---
title: "Tema 6: Arbres de cerca i maps"
description: "BSTs per a cerques logarítmiques i el potent contenidor associatiu map<K, V>."
readTime: "10 min"
order: 6
---

## 6.1 El problema de la cerca

Amb estructures lineals convencionals hem de triar entre inserir ràpid o cercar ràpid:

| Estructura | Cerca | Inserció |
| :--- | :---: | :---: |
| **Vector desordenat** | $\mathcal{O}(n)$ | $\mathcal{O}(1)$ |
| **Vector ordenat** | $\mathcal{O}(\log n)$ | $\mathcal{O}(n)$ |
| **Llista enllaçada (`list`)** | $\mathcal{O}(n)$ | $\mathcal{O}(1)$ |
| **Arbre Binari de Cerca (BST)** | **$\mathcal{O}(\log n)$** | **$\mathcal{O}(\log n)$** |

L'**Arbre Binari de Cerca (BST)** resol aquest dilema aconseguint un equilibri logarítmic en ambdues operacions.

---

## 6.2 Arbre Binari de Cerca (BST)

Un **BST** (*Binary Search Tree*) és un `BinTree<T>` on cada node compleix una regla d'ordre estricta:

> - Tots els valors del **subarbre esquerre** són **menors** ($< \text{node}$).
> - Tots els valors del **subarbre dret** són **majors** ($> \text{node}$).

:::bstviz
:::

- **Recorregut inordre:** Visitar *esquerre $\rightarrow$ arrel $\rightarrow$ dret* produeix automàticament la seqüència **ordenada de menor a major** en temps lineal $\Theta(n)$.

---

## 6.3 Cerca en un BST

A cada pas comparem $x$ amb el valor del node actual i **descartem la meitat de l'arbre**:
- Si $x < \text{node}$: cerquem només al subarbre **esquerre**.
- Si $x > \text{node}$: cerquem només al subarbre **dret**.

:::algoviz{algorithm="bst_search"}
:::

> **Complexitat:** **$\mathcal{O}(\log n)$** en un arbre equilibrat (proporcional a l'alçada). En el pitjor cas d'un arbre degenerat (en forma de llista), pot arribar a $\mathcal{O}(n)$.

---

### Mínim i màxim
- **Mínim:** Descendir sempre cap a l'esquerra fins a trobar un node sense fill esquerre.
- **Màxim:** Descendir sempre cap a la dreta fins a trobar un node sense fill dret.

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

## 6.4 Inserció en un BST

Com que `BinTree<T>` és **immutable**, la inserció no modifica l'arbre original: **reconstrueix únicament el camí** fins a la posició del nou node i **reutilitza** tots els subarbres no afectats:

:::algoviz{algorithm="bst_insert"}
:::

> **Estructura persistent:** Els subarbres no modificats es comparteixen en memòria directament sense duplicar dades. Cost en temps i espai: **$\mathcal{O}(\log n)$**.

---

## 6.5 El contenidor `map<K, V>`

La STL de C++ ofereix **`map<K, V>`**, un diccionari que associa **claus úniques** (`K`) a **valors** (`V`). Internament, cada element s'emmagatzema com un **`pair<const K, V>`** (`it->first` per a la clau, `it->second` per al valor).

### Operacions principals — Cost $\mathcal{O}(\log n)$

| Operació | Sintaxi | Comportament |
| :--- | :--- | :--- |
| **Accés / Inserció** | `m[clau] = val;` | Si la clau no existeix, **la crea** amb el valor per defecte (`0`, `""`, etc.). |
| **Cerca** | `m.find(clau)` | Retorna un iterador al parell `{clau, valor}` o `m.end()` si no hi és. |
| **Existència** | `m.count(clau)` | Retorna `1` si la clau existeix, `0` si no. |
| **Inserció segura** | `m.insert({k, v})` | Insereix el parell només si `k` **no existia prèviament**. |

```cpp
#include <iostream>
#include <map>
#include <string>
using namespace std;

int main() {
    map<string, int> edats;

    // 1. Inserció i modificació amb []
    edats["Anna"] = 21;
    edats["Bernat"] = 25;

    // 2. Cerca segura amb find()
    auto it = edats.find("Anna");
    if (it != edats.end()) {
        cout << it->first << " té " << it->second << " anys\n";
    }

    // 3. Comprovació d'existència ràpida amb count()
    if (edats.count("Carla") == 0) {
        cout << "La Carla no és al mapa\n";
    }

    // 4. Inserció sense sobreescriure amb insert()
    edats.insert({"Anna", 30}); // No fa res: "Anna" ja existia amb 21!
}
```

:::warning
L'operador `m[clau]` **modifica el mapa**, si la clau no existeix la crea automàticament. En contextos constants (`const map<K, V>& m`), usar `[]` produeix un **error de compilació**. En aquests casos, utilitza sempre `m.find(clau)`.
:::

---

## 6.6 El `map` com a acumulador

Un dels patrons més utilitzats de `map` és comptar o agrupar elements. L'operador `[]` gestiona tots dos casos en una sola línia:

1. Si la clau **no existeix** $\rightarrow$ la crea amb valor per defecte (`0`, `vector` buit, etc.) i fa l'operació.
2. Si la clau **ja existeix** $\rightarrow$ recupera la referència al valor existent i l'actualitza.

### Exemple 1: Comptador de freqüències

```cpp
map<string, int> word_count;
string word;
while (cin >> word) {
    word_count[word]++;  // Si no hi és, crea ("gat", 0) i fa ++ -> ("gat", 1)
}
```

### Exemple 2: Agrupació per longitud (Clau $\rightarrow$ Vector)

```cpp
map<int, vector<string>> by_length;
string word;
while (cin >> word) {
    by_length[word.size()].push_back(word); // Crea el vector si cal i hi afegeix la paraula
}
```

---

## 6.7 Iterar sobre un `map`

Els iteradors d'un `map` recorren els elements **en ordre ascendent de clau** (recorregut en inordre del BST intern):

```cpp
map<string, int> edats = {{"Anna", 21}, {"Bernat", 25}};

// 1. Amb iteradors 
for (auto it = edats.begin(); it != edats.end(); ++it) {
    cout << it->first << " té " << it->second << " anys\n";
    // it->second = 22;      // VÀLID: el valor es pot modificar
    // it->first = "Maria";  // ERROR: la clau és constant per protegir el BST
}

// 2. Amb Structured Binding
for (const auto& [nom, edat] : edats) {
    cout << nom << " -> " << edat << "\n";
}
```

---

## 6.8 El contenidor `set<T>`

Un **`set<T>`** és una col·lecció de **claus úniques i ordenades** sense valor associat. Internament s'implementa com un BST equilibrat on cada element és la seva pròpia clau.

### Operacions principals — Cost $\mathcal{O}(\log n)$

| Operació | Sintaxi | Comportament |
| :--- | :--- | :--- |
| **Inserció** | `s.insert(elem)` | Afegeix l'element si no hi era. Retorna `pair<iterator, bool>`. |
| **Cerca** | `s.find(elem)` | Retorna un iterador a l'element o `s.end()` si no hi és. |
| **Pertinença** | `s.count(elem)` | Retorna `1` si l'element existeix, `0` si no. |
| **Esborrat** | `s.erase(elem)` | Elimina l'element del conjunt (si existeix). |

```cpp
#include <iostream>
#include <set>
#include <string>
using namespace std;

int main() {
    set<string> vocabulari;

    // 1. Inserció (ignora duplicats automàticament)
    vocabulari.insert("hola");
    vocabulari.insert("món");
    vocabulari.insert("hola"); // No fa res: "hola" ja existeix

    // 2. Comprovació de pertinença
    if (vocabulari.count("món") == 1) {
        cout << "'món' és al conjunt\n";
    }

    // 3. Iteració ordenada (els elements són const T)
    for (auto it = vocabulari.begin(); it != vocabulari.end(); ++it) {
        cout << *it << " "; // Imprimeix en ordre alfabètic: "hola món"
    }
    cout << "\n";

    // 4. Esborrat
    vocabulari.erase("hola");
}
```

:::tip
Si necessites elements repetits, la STL ofereix **`multiset<T>`** i **`multimap<K, V>`**. En un `set` o `map` estàndard, les claus són estrictament úniques.
:::

---

## 6.9 Quan usar cada contenidor

| Situació | Contenidor recomanat | Cost cerca |
| :--- | :--- | :--- |
| **Cerca freqüent en dades ordenades** | `map<K, V>` o `set<T>` | $\mathcal{O}(\log n)$ |
| **Sense ordre, màxima velocitat de cerca** | `unordered_map<K, V>` o `unordered_set<T>` | $\mathcal{O}(1)$ amortitzat |
| **Accés directe per índex numèric ($0..n-1$)** | `vector<T>` | $\mathcal{O}(1)$ |
| **Inserció / esborrat freqüent al mig** | `list<T>` | $\mathcal{O}(1)$ |
| **Col·lecció d'elements únics** | `set<T>` | $\mathcal{O}(\log n)$ |
| **Acumulador / agrupador clau $\rightarrow$ llista** | `map<K, vector<T>>` | $\mathcal{O}(\log n)$ |
