---
title: "Lab 2: Contenidors Lineals"
description: "Sessió de laboratori resolta. Stacks i Queues (Piles i Cues)."
readTime: "12 min"
order: 2.5
---

## 1. Piles (Stacks) i Cues (Queues) de la STL

El segon laboratori ens posa a prova amb *Data Structures* lineals. Utilitzarem l'equivalent de la Standard Template Library (STL) per als contenidors `Stack` i `Queue`. Si alguna vegada has vist apilar plats (l'últim plat que fiques és el primer a rentar) o posar-te en una fila al supermercat (el primer a arribar és el primer en sortir), acabes d'entendre al 100% que és una Pila i una Cua.

### Interfícies: `Stack` i `Queue`

```cpp [Interface del Jutge (Reduïda)]
// Pila (Stack)              // Cua (Queue)
s.push(x) // Posa dalt.      q.push(x) // Posa a darrere.
s.top()   // Mira el dalt.   q.front() // Mira el davant.
s.pop()   // Treu de dalt.   q.pop()   // Treu de davant.
s.empty() // Està buida?     q.empty() // Està buida?
s.size()  // Elements.       q.size()  // Elements.
```

---

## 2. Piles (Stacks)

Garanteixen el sistema **LIFO: Last In, First Out** (Últim a entrar, primer a sortir). Tot el que hem après de l'Stack en recursivitat és el que simula precisament.

### Exercici 1: Reverse

Consisteix en donar la volta a les seqüències a mesura que entren i després treure-les. Una Pila hi fa la volta automàticament! Introduim seqüencialment nombres en la nostra Pila fins fer EOF. A mesura que cridem `top()` i desapilem amb `pop()`, sortiran en ordre invers màgicament.

<details>
<summary>Codi solució: reverse.cc</summary>

```cpp [p1-reverse/reverse.cc]
#include <iostream>
using namespace std;
#include "stack.hh"
using namespace pro2;

void reverse(istream& in, ostream& out) {
    Stack<int> s;
    int n;
    while (in >> n) {
        s.push(n);
    }
    
    // Anem desapilant i cridant el TOP per extreure en invers
    while (!s.empty()) {
        out << s.top();
        s.pop();
        if (!s.empty()) out << " ";
    }
    out << endl;
}
```
</details>

:::oopviz{simulation="stack_reverse"}
:::

### Exercici 2: Validar Parèntesis

Validar el tancament de parentització i claudàtors és el problema clàssic universitari. Les instruccions dicten: Tota obertura `(` o `[` s'enfila a l'Stack. Quan ens trobem una tancada `)` o `]`, avaluarem i consumirem (amb `pop()`) si coincideix i emparella completament amb el capdamunt pur actual de la nostra Pila (`top()`). Si la pila és buida d'imprevist abans de finalitzar la cadena o el tancament no quadra, considerarem la nostra avaluació `Incorrecte`.

<details>
<summary>Codi solució: parentesis.cc</summary>

```cpp [p2-parentesis/parentesis.cc]
#include <iostream>
using namespace std;
#include "stack.hh"
using namespace pro2;

void parentesis(istream& in, ostream& out) {
    Stack<char> s;
    char c;
    int pos = 1;

    // Llegim ignorant espais (in >> c) fins topar-nos pel caràcter punt delimitador pur
    while (in >> c and c != '.') {
        // Enfilem obertures al front pur
        if (c == '(' or c == '[') {
            s.push(c);
        } 
        else if (c == ')' or c == ']') {
            // Tancament excessiu o previ no quadra
            if (s.empty()) {
                out << "Incorrecte " << pos << endl;
                return;
            }
            char top = s.top();
            // Avaluem matching i el desfem segurament:
            if ((c == ')' and top == '(') or (c == ']' and top == '[')) {
                s.pop();
            } else {
                out << "Incorrecte " << pos << endl;
                return;
            }
        }
        pos++;
    }

    // Finalitzat, si ha restat alguna obertura lliure pendents considerarem error
    if (s.empty()) out << "Correcte\n";
    else out << "Incorrecte " << pos << endl;
}
```
</details>

:::oopviz{simulation="stack_parentesis"}
:::

### Exercici 3: Recursivitat simulada amb Piles
Com bé hem après a la teòrica de la UB i UPC, l'Stack del Frame OS permet aïllar instàncies de funcions recursives. Com el laboratori ens exigia convertir:
```cpp
       if (n > 0) {   
           cout << ' ' << n;
           escriu(n - 1);  // 1a crida recursiva
           escriu(n - 1);  // 2a crida recursiva
       }
```
Atenció: **L'ordre apilat és invers a l'OS per mantenir execució natural del flux.** 

<details>
<summary>Codi solució: recursivitat.cc</summary>

```cpp [p3-recursivitat/recursivitat.cc]
#include <iostream>
using namespace std;
#include "stack.hh"
using namespace pro2;

void escriu(int n, ostream& out) {
    Stack<int> s;
    s.push(n);

    // Iterant contínuament fins haver desapilat per pur tota acció virtual
    while (!s.empty()) {
        int v = s.top();
        s.pop();
        
        if (v > 0) {
            out << ' ' << v;
            // Instanciem instint base C++, cap endarrere ja que el següent pas voldrà 
            // fer 'pop' i consumir el "MÉS NOU"
            s.push(v - 1);
            s.push(v - 1);
        }
    }
}
```
</details>

:::oopviz{simulation="stack_recursivitat"}
:::

---

## 3. Cues (Queues)

Les cues garanteixen l'estàndard **FIFO: First In, First Out**. Usarem `front` per mirar el primer i extraure'l exclusivament a la sortida general. Oblida el `top`.

### Exercici 5: La Patata Calenta

Ens demanen aplicar el clàssic joc mortal de Josefus! Hi ha `N` individus creant un cercle. Es van passant els cops `k` a la següent persona de la *cua*, i qui la tingui passats els cops saltats mor i se l'expulsa directament! 

La simulació amb cua consisteix en un cicle iteratiu on passem endarrere el front de la cua `q.push(q.front())` i finalment desmembrant `pop()`. Això emula girar el rodet en passades infinites completament lineals!

<details>
<summary>Codi solució: patata.cc</summary>

```cpp [p5-patata-calenta/patata.cc]
void patata_calenta(istream& in, ostream& out) {
    int N, k;
    if (in >> N >> k) {
        Queue<int> q;
        for (int i = 1; i <= N; ++i) {
            q.push(i); // Noms i gent dins del joc
        }
        
        bool first = true;
        while (q.size() > 1) { // Fins que sobrevisqui només pur 1 individu
            // Fem K girs o "passos de patates calents" cap a fi del cicle
            for (int i = 0; i < k; ++i) {
                int front = q.front();
                q.pop();
                q.push(front);
            }
            
            if (!first) out << " ";
            // La pobra anima davantera que acaba tocant rep l'expulsió immediata
            out << q.front();
            q.pop(); 
            first = false;
        }
        
        if (!first) out << endl;
        if (q.size() == 1) {
            out << "Supervivent: " << q.front() << endl;
        }
    }
}
```
</details>

:::oopviz{simulation="queue_patata"}
:::

### Exercici 6: Comptador Recents (Sliding Window)

Se't dona una seqüència de peticions estrictament creixents per `t_i` en un marge `T` de segons de retrospectiva actual. És a dir, per cada instant, quants dels passats queden encara respectant-se el rang `[A - T, A]`? Ens caldrà una cua perquè el que va passar fa masses T's, ha sortit abans. Si entrem a avaluar `front` (el més vell actiu emmagatzemat), i la caducitat del mateix supera l'última petició menys els `T`, ja la podrem llençar a les escombraries mitjançant un desempilonat!

<details>
<summary>Codi solució: recents.cc</summary>

```cpp [p6-compta-recents/recents.cc]
void compta_recents(istream& in, ostream& out) {
    int N, T;
    if (in >> N >> T) {
        Queue<int> q;
        bool first = true;
        
        for (int i = 0; i < N; ++i) {
            int t;
            in >> t;
            q.push(t);
            
            // Evaluador extern caducant antics vells emmagatzemats d'espant 
            // que queden enlloc pel rang de temps i de Cua fora:
            while (!q.empty() && q.front() < t - T) {
                q.pop();
            }
            
            if (!first) out << " ";
            out << q.size(); // Mostra base actius vius
            first = false;
        }
        out << endl;
    }
}
```
</details>

:::oopviz{simulation="queue_recents"}
:::
