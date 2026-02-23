---
title: "Tema 2: Piles i cues"
description: "Estructures de dades lineals d'accés restringit i conceptes de programació en C++."
readTime: "3 min"
order: 2
---

## 2.1 Convencions

Durant el desenvolupament de codi C++, utilitzarem les següents convencions:

*   **Identificació de membres privats (`_`):** Totes les variables i mètodes `private` d'una classe inclouen un guió baix al final (ex: `mida_`, `any_`). Això permet diferenciar els atributs dels paràmetres ràpidament.
*   **Llistes d'inicialitzadors (`:`):** Quan una classe conté objectes d'altres classes, cal inicialitzar-los abans del cos del constructor.
    ```cpp
    Pila::Pila(int mida) : vector_intern_(mida) { /* Bloc de codi */ }
    ```
*   **Les precondicions esdevenen `assert`:** Substituïm els condicionals llargs per `assert`. Si no es compleix la condició, el programa s'atura immediatament indicant l'error.
    ```cpp
    #include "assert.hh"
    assert(posicio >= 0); 
    ```
*   **Mètodes `inline`:** Qualsevol mètode implementat dins mateix de la declaració de la classe esdevé `inline`. El codi s'incrusta directament allà on es crida. Això augmenta el rendiment però només és recomanable per a mètodes molt curts.
*   **Programació genèrica (`template <typename T>`):** L'ús de plantilles permet crear estructures que no depenen d'un tipus de dada concret (com només `int` o només `string`), sinó que el reben dinàmicament quan instancies la variable a través de la lletra genèrica referent `T`.

:::oopviz{simulation="convencions_cpp"}
:::

---

## 2.2 La pila (`Stack`)

La pila és una estructura de dades on només podem manipular l'últim element introduït: tenint un model **LIFO (Last In, First Out)**. 

### Implementació de la classe externa 
La implementació estàndard a C++ normalment encapsula un vector regular. Gràcies a què inserció i extracció es realitzen únicament per la cua del vector, la totalitat dels punts mantenen cost d'acció $\mathcal{O}(1)$.

<details>
<summary>Veure detalls de <code>Stack.hh</code></summary>

```cpp
#ifndef STACK_HH
#define STACK_HH
#include <vector>
#include "assert.hh"

namespace pro2 {
    template <typename T>
    class Stack {
        std::vector<T> elems_; 

    public:
        Stack() {}
        Stack(const std::vector<T>& elems) : elems_(elems) {}
        
        int size() const { return elems_.size(); }
        bool empty() const { return elems_.empty(); }
        
        void push(const T& x) { elems_.push_back(x); }
        
        const T& top() const {
            assert(elems_.size() > 0);
            return elems_.back();
        }
        
        void pop() {
            assert(elems_.size() > 0);
            elems_.pop_back(); 
        }
    };
}
#endif
```

</details>

**Mètodes principals de la llibreria `<stack>` $\mathcal{O}(1)$:**
El codi habitual general utilitzat pels clients s'enfoca ràpidament als mètodes principals de funcionalitats LIFO. 
*   **`push(x)`**: Afegeix un element `x` al cim de la pila.
*   **`top()`**: Consulta visual només de l'element superior referenciat del cim sense esborrar-lo.
*   **`pop()`**: Elimina automàticament l'element principal al cim.

```cpp
#include <stack>

stack<int> S;
S.push(10);      // Estat: [10]
S.push(20);      // Estat: [10, 20] <- Cim
int x = S.top(); // Ens guardem x=20
S.pop();         // S'extreu el 20. Estat: [10] <- Cim
```

#### Exemple clàssic: avaluació d'expressions poloneses
Un ús pràctic típic de les piles és iterar matrius i vectors per anar agafant les dades de manera progressiva i reajustant els valors obtinguts, tal com la Notació Postfixa (operadors darrere de les dades).

<details>
<summary>Consulta de solució a mode aplicació LIFO</summary>

```cpp
Stack<int> S;
string token;

while (cin >> token) {
    if (token == "+") {
        int a = pop(S), b = pop(S); // S'extreuen els valors prèviament afegits
        S.push(a + b);
    } else if (token == "-") {
         int a = pop(S), b = pop(S); 
         S.push(b - a);
    } 
}
// a = S.top() El resultat final queda sol restat a la mateixa pila.
```
</details>

:::oopviz{simulation="pila_cpp"}
:::

---

## 2.3 La cua (`Queue`) 

La cua és una estructura de dades on s'afegeixen elements pel final i s'extreuen pel principi. Això el converteix en un comportament **FIFO (First In, First Out)**: el primer en arribar és el primer en sortir.

### Complexitat i implementació: `vector` vs `deque` (important)

Tot i que piles i cues semblen molt similars a nivell funcional i d'ús, a nivell intern tenen requeriments diferents i no es poden usar els mateixos elements, doncs la complexitat varia directament. 

Mentres que eliminar en una interfície un vector costa només cicles unitaris constants, extreure'n manualment al seu mateix inici mitjançant una utilitat `.erase(vector.begin())` produeix cost directe $\mathcal{O}(n)$, perquè els espais de les cèŀlules buides a la base han de cobrir-se remenant seqüencialment cap amunt.

La solució consisteix a reemplaçar al vector pur amb una abstracció de vector desplaçable a tots dos extrems com és el `std::deque`. Aquets conté el propi mètode encarregat i dóna suport a la independència en `pop_front()` per extreure al principi a escala constant del tipus general constant $\mathcal{O}(1)$.


<details>
<summary>Veure detalls de l'abstracció a variables tipus `Queue.hh` usant Deque</summary>

```cpp
#ifndef QUEUE_HH
#define QUEUE_HH
#include <deque>
#include "assert.hh"

namespace pro2 {
    template <typename T>
    class Queue {
        std::deque<T> elems_; // Implementat amb deques.

    public:
        Queue() {}
        
        int size() const { return elems_.size(); }
        bool empty() const { return elems_.empty(); }
        
        void push(const T& x) { elems_.push_back(x); }
        
        const T& front() const {
            assert(elems_.size() > 0);
            return elems_.front();
        }
        
        void pop() {
            assert(elems_.size() > 0);
            elems_.pop_front();
        }
    };
}
#endif
```
</details>

**Mètodes principals de la llibreria `<queue>` $\mathcal{O}(1)$:**
*   **`push(x)`**: Afegeix l'element `x` al final de la cua.
*   **`front()`**: Consulta visual només de l'element superior referenciat del davant (principi) sense esborrar-lo.
*   **`pop()`**: Elimina completament l'element principal i frontal davanter de l'element.

```cpp
#include <queue>

queue<int> Q;
Q.push(10);        // Estat: [10]
Q.push(20);        // Estat: [10, 20] <- El 20 se situa darrere
int x = Q.front(); // Constatem que al davant hi ha el 10
Q.pop();           // Q = [20] s'extreu el primer element en arribar (10)
```

:::oopviz{simulation="cua_cpp"}
:::