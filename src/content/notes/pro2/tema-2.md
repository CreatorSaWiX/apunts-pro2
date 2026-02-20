---
title: "Tema 2: Piles i Cues"
description: "Tècniques addicionals de C++ i ús dels TADs Pila i Cua."
readTime: "3 min"
order: 2
---

## 2.1 Més conceptes de C++

* **Convenció en membres privats:** Per tal de distingir fàcilment els atributs privats, s'afegeix un guió baix com a sufix. Exemples: `mida_`, `any_`.
* **Llista d'inicialitzadors (`:`):** Quan una classe conté un objecte (ex. classe `Gran` conté objecte `petit_`), cal cridar el seu constructor just abans del cos del constructor de la classe principal:
  ```cpp
  Gran::Gran(int a, char c) : petit_(a) { /* ... */ }
  ```
* **Precondicions amb `assert`:** Ens permet aturar l'execució del programa immediatament si una precondició no es compleix. Utilitzem `#include "assert.hh"`.
  ```cpp
  assert(desde >= 0);
  ```

---

## 2.2 Piles (`stack`)

Una **pila** és un contenidor on només podem afegir i treure elements per un únic extrem (la part superior). Funciona de manera idèntica a una pila d'objectes reals (com una pila de plats o de cartes): si en vols afegir un, el poses a dalt de tot, i si en tens de treure un, obligatòriament has d'agafar l'últim que s'ha posat.

D'això en diem una estructura **LIFO (Last In, First Out)**: l'últim en entrar és el primer en sortir.

*Usos freqüents:* Avaluació d'expressions poloneses, recordar tasques per desfer-les més endavant, o en l'execució de crides a funcions (la pila del sistema).

### Operacions
* **Afegir:** `push(x)` (afegeix a dalt)
* **Treure:** `pop()` (elimina el de dalt de tot, sense retornar cap valor)
* **Consultar:** `top()` (retorna l'element de dalt de tot)
* **Mida i estat:** `size()`, `empty()`

```cpp
#include <stack>
using namespace std;

stack<int> S;
S.push(10);      // Pila: [10]
S.push(20);      // Pila: [10, 20] <- dalt
int x = S.top(); // x = 20
S.pop();         // Pila: [10] <- dalt
```

:::oopviz{simulation="pila_cpp"}
:::

---

## 2.3 Cues (`queue`)

Una **cua** és un contenidor on s'afegeixen elements per l'última posició i se'n treuen per la primera. Funciona exactament igual que una cua de persones esperant per ser ateses: qui arriba es posa al final, i sempre s'atén a la persona que va arribar la primera i ja és al capdavant.

D'això en diem una estructura **FIFO (First In, First Out)**: el primer en entrar és el primer en sortir.

*Usos freqüents:* Processament de tasques o simulació d'esdeveniments per ordre d'arribada, o cerca en amplada (BFS) en grafs.

### Operacions
* **Afegir:** `push(x)` (afegeix al final de la cua)
* **Treure:** `pop()` (elimina el del davant)
* **Consultar:** `front()` (retorna l'element del davant)
* **Mida i estat:** `size()`, `empty()`

```cpp
#include <queue>
using namespace std;

queue<int> Q;
Q.push(10);        // Cua: [10]
Q.push(20);        // Cua: [10, 20] <- darrere
int x = Q.front(); // x = 10 (el primer que va entrar)
Q.pop();           // Cua: [20]
```

:::oopviz{simulation="cua_cpp"}
:::

---

## 2.4 Vector vs Deque

Implementar una pila amb un internal `std::vector` funciona eficientment perquè afegir/esborrar pel final del vector consta en temps $\mathcal{O}(1)$ amortitzat.

En canvi, **esborrar el primer element** d'una cua en un `vector` costa **$\mathcal{O}(n)$**, ja que cal desplaçar tot la resta. La solució per les cues en C++ és utilitzar la col·lecció **`std::deque`**, que organitza la memòria en blocs i garanteix un cost estable de $\mathcal{O}(1)$ per afegir o extreure dades tant per l'inici com pel final.
