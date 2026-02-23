---
title: "Tema 2: Piles i Cues"
description: "Estructures lineals d'accés restringit i trucs vitals per sobreviure al C++ de PRO2."
readTime: "3 min"
order: 2
---

## 2.1 Supervivència en C++ (El llenguatge de la UPC)

A les pràctiques de PRO2, el codi C++ agafa un estàndard molt estricte. Aquí tens les regles del joc:

*   **Identificar els secrets (`_`):** Totes les variables i mètodes `private` d'una classe sempre porten un guió baix al final (ex: `mida_`, `any_`). Així saps a l'instant, sense mirar el `.hh`, que allò és intocable des de fora.
*   **Les llistes d'Inicialitzadors (`:`):** Quan construeixes una `Pila`, si a dins hi ha un `Vector`, aquest vector ha d'existir *abans* que la Pila. S'invoca just arran del constructor separant-ho amb dos punts:
    ```cpp
    Pila::Pila(int mida) : vector_intern_(mida) { /* Ja existeix! */ }
    ```
*   **Parar el cop (`assert`):** Oblida't dels `if (malament) return;`. Ara comprovem precondicions al vol. Si falla, el programa "peta" expressament on toca amb `assert`.
    ```cpp
    #include "assert.hh"
    assert(posicio >= 0); // Peta a l'instant si intentes trencar el vector
    ```
*   **Mètodes Inscrustats (`inline`):** Si implementes el codi d'una funció just allà on la declares (dins de les claus `{}` de la classe al mateix `.hh`), el compilador ho marca com a `inline`, cridant el codi directament en comptes de saltar a memòria. Guanyes gran rendiment si són funcions curtes!
*   **Les Plantilles Universals (`template <typename T>`):** Per no haver de programar una classe Pila per a cada tipus (`int`, `string`, `char`...), es posa un "forat" `T`. Quan tu declares la variable `Stack<int>`, C++ omple tots els forats fent que la teva estructura adquireixi exclusivament aquest tipatge de valors genèric.

---

## 2.2 La Pila (`stack`) - L'efecte LIFO

Funciona idènticament a una **pila de plats nets**. No pots treure el plat de sota sense trencar-los tots. Només manipules el cim de la muntanya. 

És el regne del **LIFO (Last In, First Out)**: L'últim en entrar és el condemnat a ser el primer a sortir. *S'utilitza profundament per desfer accions (Ctrl+Z), l'historial d'una web o avaluacions d'equacions matemàtiques!*

### Les úniques 3 regles de manipulació $\mathcal{O}(1)$
- **`push(10)`**: Apila el número `10` al cim.
- **`top()`**: T'ensenya quin element hi ha a dalt de tot. (Alerta: No l'esborra!).
- **`pop()`**: Destrueix el plat de dalt de tot. (Alerta: No et retorna el valor, només el trenca!).

```cpp
#include <stack>

stack<int> S;
S.push(10);      // S = [10]
S.push(20);      // S = [10, 20] <- Cim
int x = S.top(); // Ens guardem x=20
S.pop();         // Es destrueix el 20.  S = [10] <- Cim
```

:::oopviz{simulation="pila_cpp"}
:::

---

## 2.3 La Cua (`queue`) - L'efecte FIFO

Ja la coneixes. És la **cua de la peixateria**. El primer senyor avorrit que arriba a posar-se a la cua, tindrà el privilegi de ser el primer a sortir atès per la porta.

És l'entorn **FIFO (First In, First Out)**. *S'utilitza absolutament per tot allò que requereixi processar en línia justa per ordre d'arribada (Servidors escoltant peticions web, i les cerques curtes de BFS que hem vist al Tema 4!).*

### Les úniques 3 regles de manipulació $\mathcal{O}(1)$
- **`push(10)`**: Afegeix un nou dependent al final fosc de la cua.
- **`front()`**: T'ensenya qui és exactament el primer de la llista preparat a la caixa registradora.
- **`pop()`**: El primer de la caixa ja ha pagat, i és eliminat feliçment de la cua!

```cpp
#include <queue>

queue<int> Q;
Q.push(10);        // Q = [10]
Q.push(20);        // Q = [10, 20] <- 20 va al darrere fosc
int x = Q.front(); // Ens fixem en x=10, fa massa que espera
Q.pop();           // Adèu al 10! Q = [20]
```

:::oopviz{simulation="cua_cpp"}
:::

---

## 2.4 El secret de rendiment: `vector` vs `deque` (OBLIGATORI)

Dins d'aquestes llistes empaquetades per la UPC, el cost ocult ens pot fer suspendre per temps el Jutge si no entenem per què triem les peces:

A una **Pila**, afegir i eliminar pel darrer calaix costa directament només **$\mathcal{O}(1)$**. La teva memòria d'escriptori respira tranquil·la, pot emprar un `vector` pur intern.

### ⚠️ El parany de la Cua
Saps quant li costa a la màquina eliminar el primer element d'un pur vector llarg perquè desaparegui i el següent avanci la tanda? Tot el bloc del darrere s'ha d'aixecar físicament i canviar d'escó. Costa un catastròfic **$\mathcal{O}(n)$**! Per a solucionar aquest drama mundial, la llibreria oculta **que s'encarrega de fer el teu objecte `std::queue` en memòria real utiliza el calaix màgic `std::deque`**, un vector multi bloc que permet esborrar pel nas i per la cua de manera asíncrona igualant finalment tot en temps $\mathcal{O}(1)$!
