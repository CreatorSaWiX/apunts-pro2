---
title: "Final PRO2"
description: "Resum dels temes 8 a 12 de PRO2 basat en les implementacions reals del Jutge"
readTime: "8 min"
order: 14
draft: false
isUpdated: 1
---

## 1. Tema 8: Punters i memòria dinàmica

### Operadors
*   **`&x`**: Obté l'**adreça de memòria** on està guardada la variable `x`.
*   **`*p`**: Accedir al valor guardat a l'adreça de memòria que apunta. Recordem que `int* p` i `int *p` és el mateix.
*   **`p->membre`**: Equival a `(*p).membre`. Accedir al membre d'un struct apuntat per `p`.

> **`nullptr` o `NULL`**: Valor segur que indica que el punter no apunta a cap adreça (inicialitza sempre amb `nullptr`, mai els deixis apuntant a brossa: `int *p = nullptr;`).

### Errors comuns
1.  **Segmentation Fault (SEGFAULT)**: Intentar accedir a una adreça que no et pertany o desreferenciar `nullptr`.
    ```cpp
    int *p = nullptr; *p = 5; // ERROR: Desreferenciació de punter nul
    ```
2.  **Memory Leak**: Perdre l'únic punter que apuntava a memòria demanada amb `new` sense fer-ne el `delete` corresponent.
    ```cpp
    int *p = new int(5); p = nullptr; // ERROR: La memòria queda orfe al Heap
    ```
3.  **Dangling Pointer (Punter penjant)**: Punter que apunta a una adreça de memòria que ja ha estat alliberada amb `delete`.
    ```cpp
    int *p = new int(5); delete p; cout << *p; // ERROR: Memòria ja no és nostra
    ```
4.  **Double-Delete**: Intentar fer `delete` dues vegades sobre la mateixa adreça de memòria (corromp la memòria del Heap).
    ```cpp
    int *p = new int(5); delete p; delete p; // ERROR: Doble alliberament
    ```

### Pas de Paràmetres
*   **Per valor (`f(int x)`)**: Còpia del valor. Ineficient per a estructures/objectes grans.
*   **Per referència (`f(int& x)`)**: Modificacions afecten al main. Preferim `const T& x` per eficiència si no volem modificar l'objecte.
*   **Per punter (`f(int* px)`)**: Passa l'adreça de memòria. Permet que el paràmetre pugui ser opcional passant-li `nullptr`.

### Tips
- **Has posat `nullptr`?** Comprova sempre si un punter és nul abans de fer `p->next`.
- **Has fet `delete`?** Cada `new` ha de tenir el seu `delete` per evitar Memory Leaks.
- **Casos buits**: Què fa el teu codi si la pila/cua està buida? I si té només 1 element?
- **Auto-assignació**: En l'ús de `operator=`, has comprovat `if (this != &s)`?

### X87185: Eliminació a Pila (`removeFirstOccurrence` - stack.hh)
Per eliminar elements en una estructura simple, usem una **finestra de mida 2** utilitzant dos punters (`pitem` i `prev`). El punter `prev` s'ha d'inicialitzar obligatòriament a `nullptr` en lloc de deixar-lo buit.
```cpp
void removeFirstOccurrence(T value) {
    Item *pitem = ptopitem;
    Item *prev = nullptr; // Inicialització segura
    
    // 1. Cerca de l'element a esborrar
    while (pitem != nullptr && pitem->value != value) {
        prev = pitem;
        pitem = pitem->next;
    }

    // 2. Si s'ha trobat, el desconnectem i alliberem la memòria
    if (pitem != nullptr) {
        Item *paux = pitem;
        pitem = pitem->next;

        if (prev == nullptr) ptopitem = pitem; // Si és el primer element (cim)
        else prev->next = pitem;              // Si està al mig o al final
            
        delete paux; // Alliberem memòria del node destrossat
        _size--;
    } 
}
```

### X17005: Moure elements a Cua (`moveFrontToLast` - queue.hh)
Desplaçament físic de nodes en $\Theta(1)$ sense haver d'esborrar i crear nous nodes amb `new`:
```cpp
void moveFrontToLast() {
    if (first == nullptr || first == last) return; // Menys de 2 elements: res a fer

    Item *oldFirst = first;   // 1. Guardem punter al primer node
    first = oldFirst->next;   // 2. El segon passa a ser el nou primer

    last->next = oldFirst;    // 3. L'antic primer passa a ser el següent de l'últim
    oldFirst->next = nullptr; // 4. Marquem el nou final com a NULL
    last = oldFirst;          // 5. Actualitzem el punter final al mogut
}
```

---

## 2. Tema 9: Implementació de Vectors

Un vector és un **array dinàmic** guardat en un bloc de memòria contigu al *Heap*.

### Atributs de Classe
*   `T* data_`: Punter al bloc del Heap on s'emmagatzemen els elements.
*   `int size_`: Elements ocupats actualment.
*   `int capacity_`: Memòria total reservada al Heap.

### La Regla dels Tres
Si una classe gestiona memòria dinàmica directament (fent `new`), ha d'implementar obligatòriament tres mètodes especials per evitar que C++ faci còpies superficials (*shallow copies*) que apuntin a les mateixes adreces:

### A. Constructor de Còpia (Deep Copy)
Crea un objecte nou reservant memòria pròpia al Heap i copiant tots els elements:
```cpp
Vector(const Vector& v) {
    data_ = new T[v.capacity_];
    size_ = v.size_;
    capacity_ = v.capacity_;
    for (int i = 0; i < size_; ++i) data_[i] = v.data_[i];
}
```

### B. Operador d'Assignació (`operator=`)
Neteja l'objecte actual, evita l'auto-assignació i copia de forma profunda:
```cpp
Vector& operator=(const Vector& v) {
    if (this != &v) { // 1. Evita auto-assignació (l1 = l1)
        delete[] data_; // 2. Allibera memòria vella
        data_ = new T[v.capacity_]; // 3. Demana memòria nova
        size_ = v.size_;
        capacity_ = v.capacity_;
        for (int i = 0; i < size_; ++i) data_[i] = v.data_[i]; // 4. Copia dades
    }
    return *this; // Permet assignació encadenada (a = b = c)
}
```

### C. Destructor
L'únic encarregat d'alliberar definitivament la memòria del bloc:
```cpp
~Vector() { delete[] data_; }
```

### Creixement i Cost Amortitzat
*   **`push_back`**: Si el vector s'omple (`size_ == capacity_`), demana un bloc que **dobla** la capacitat ($2 \times \text{capacity}$). Aquest redimensionament costa $\mathcal{O}(n)$, pero en passar només cada $2^k$ vegades, el cost de cada inserció és **cost amortitzat $\mathcal{O}(1)$**.
*   **`pop_back` (Thrashing)**: Per evitar redimensionaments constants en el límit (afegir/esborrar contínuament), no reduïm immediatament. Només es redueix la capacitat a la meitat quan la quantitat d'elements ocupats baixa a **$1/4$** de la capacitat total. Cost amortitzat $\mathcal{O}(1)$.

::vectorviz

---

## 3. Tema 10: Implementació de Llistes

A diferència dels vectors, una llista allotja cada element en un node dispers en memòria que conté enllaços cap endavant i cap enrere.

### Struct del Node
```cpp
struct Item {
    T value;
    Item *next; // Següent node
    Item *prev; // Node anterior
};
```

### Nodes Sentinella (`iteminf` i `itemsup`)
Aquesta implementació utilitza dos nodes reals extrems que **sempre existeixen** (fins i tot si la llista és buida):
*   **`iteminf`** (fictici inicial): `iteminf.next` apunta al primer element de veritat.
*   **`itemsup`** (fictici final): `itemsup.prev` apunta a l'últim element de veritat.
*   **Avantatge**: Elimina completament el tractament de casos especials per punters `nullptr` als extrems en inserir o treure nodes.

::linkedlistviz

### Inserir/Esborrar en $\Theta(1)$
Si disposem de l'iterador o de l'adreça del node, podem "recosir" els enllaços directament en temps constant:
*   **Inserir abans de `p`**: 
    1.  Crear nou node `n`.
    2.  `n->prev = p->prev; n->next = p;`
    3.  `p->prev->next = n; p->prev = n;`
*   **Esborrar node `p`**:
    1.  `p->prev->next = p->next;`
    2.  `p->next->prev = p->prev;`
    3.  `delete p;`

### L'ús dels Helpers Interns (`extractItem` i `insertItem` - list.hh)
A les classes de llistes del Jutge, tens disponibles dos mètodes privats molt potents que s'encarreguen de recosir els enllaços i actualitzar `_size` de forma transparent:
*   `void extractItem(Item *pitem)`: Desconnecta el node sense alliberar-lo de memòria.
*   `void insertItem(Item *pitemprev, Item *pitem)`: Connecta el node directament després del node previ especificat.

### X25312: Moure Elements de Llista (`moveSecondToLast` - list.hh)
Utilitzant aquests helpers, moure elements sense tocar el `.value` és molt senzill i evita totalment haver de modificar manualment els 4 punters de doble enllaç:
```cpp
void moveSecondToLast() {
    if (_size > 2) {
        Item *second = iteminf.next->next; // 1. Trobem el segon element
        extractItem(second);                // 2. El desconnectem físicament
        insertItem(itemsup.prev, second);   // 3. L'inserim abans del sentinella superior
    }
}
```

### Taula de Costos i Complexitats Comparativa

| Estructura / Operació | Accés aleatori `[i]` | Inserció Principi | Inserció Final | Inserció Mig (amb posició / it) | Distribució en memòria |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **`std::vector`** | $\Theta(1)$ | $\Theta(N)$ | $\mathcal{O}(1)^*$ | $\Theta(N)$ | Bloc contigu (excel·lent cache local). |
| **`std::list`** | $\Theta(N)$ | $\Theta(1)$ | $\Theta(1)$ | $\Theta(1)$ | Nodes dispersos connectats per punters. |

*\*Cost amortitzat. En el pitjor cas per a vector és $\mathcal{O}(N)$ a causa del reallotjament de memòria (`reallocate_`).*

---

## 4. Tema 11: Implementació d'Arbres Binaris (`Arbre.hh`)

Estructura de dades dinàmica i recursiva on cada node té exactament dos subarbres (esquerre i dret).

### Estructura de Node
```cpp
struct node_arbre {
    T info;
    node_arbre *segE; // Subarbre esquerre
    node_arbre *segD; // Subarbre dret
};
node_arbre *primer_node; // Arrel (nullptr si buit)
```

### Regla dels Tres en Arbres
1.  **Còpia profunda**: Es fa a través d'una immersió recursiva en **pre-ordre** que duplica cada node del heap.
2.  **Destrucció**: S'ha de realitzar recursivament en **post-ordre** (primer alliberem el subarbre esquerre, després el dret i finalment fem `delete` de l'arrel actual per evitar perdre les adreces).

### A. Control de cicles a `plantar(x, a1, a2)`
Quan plantem un nou node `x` amb dos subarbres `a1` i `a2`, el mètode **mou els punters** en lloc de duplicar per aconseguir un cost de $\Theta(1)$. No obstant això, té una comprovació crucial per evitar **aliasing inestable** en cas que intentem posar el mateix subarbre a l'esquerra i a la dreta (`plantar(x, a, a)`):
```cpp
void plantar(const T &x, Arbre &a1, Arbre &a2) {
    if (this != &a1 && this != &a2) {
        if (primer_node == nullptr) {
            node_arbre* aux = new node_arbre;
            aux->info = x;
            aux->segE = a1.primer_node; // Mou fill esquerre de forma directa
            
            // Si són el mateix arbre físic, s'ha de fer còpia profunda d'un d'ells per evitar cicles
            if (a1.primer_node == a2.primer_node) {
                aux->segD = copia_node_arbre(a1.primer_node);
            } else {
                aux->segD = a2.primer_node; // Mou fill dret de forma directa
            }
            
            primer_node = aux;
            a1.primer_node = nullptr; // Deixa els paràmetres originals buits
            a2.primer_node = nullptr;
        }
        // ...
    }
}
```

### B. Transferència i destrucció del pare a `fills(fe, fd)`
El mètode `fills` divideix l'arbre en dues branques en $\Theta(1)$ passant directament les referències de memòria, i és molt important destacar que **fa `delete aux` per alliberar únicament la memòria del node pare/arrel** que ja no és necessari, sense afectar els subarbres de sota.
```cpp
void fills (Arbre &fe, Arbre &fd) {
    if (primer_node != nullptr && fe.primer_node == nullptr && fd.primer_node == nullptr) {
        if (&fe != &fd) {       
            node_arbre* aux = primer_node;
            fe.primer_node = aux->segE; // Pas de punters directo
            fd.primer_node = aux->segD;
            primer_node = nullptr;      // Deixa el pare buit
            delete aux;                 // Allibera exclusivament el node arrel antic
        }
        // ...
    }
}
```

---

## 5. Tema 12: Implementació d'Arbres Generals (`ArbreG.hh`)

Un arbre general (n-ari) permet que cada node tingui un nombre il·limitat de descendents.

### Estructura del Node
```cpp
struct node_arbreGen {
    T info;
    vector<node_arbreGen*> seg; // Vector dinàmic de punters als fills
};
node_arbreGen* primer_node; // Punter a l'arrel
```

### Recursivitat amb Bucles
Com que el grau dels nodes és dinàmic, les operacions recursives ja no es poden escriure amb dues crides fixes (esquerra i dreta). S'ha d'iterar utilitzant un **bucle `for`** al llarg del vector `seg`:
*   **Còpia recursiva**: Allotja un nou node, reserva el seu vector de fills amb la mateixa mida que l'original i, amb un bucle, copia recursivament cada fill.
*   **Esborrat**: Recorre recursivament tots els fills del vector `seg` en bucle per esborrar-los abans d'alliberar el node pare actual.

### Particularitats de les Operacions del Jutge (`ArbreG.hh`)

### A. Transferència de propietat a `plantar(x, v)` i `fills(v)`
*   **`plantar(x, v)`**: Transfereix de forma eficient els punters de tots els subarbres continguts en el vector `v` com a fills de la nova arrel `x` en temps $\mathcal{O}(N)$ (essent $N$ el nombre de fills), i immediatament **estableix els arbres de `v` com a buits** (`v[i].primer_node = nullptr`) per evitar aliasing.
*   **`fills(v)`**: Allibera memòria del node arrel actual amb `delete aux` i col·loca tots els fills exactament com a nous arbres dins del vector `v` en $\mathcal{O}(N)$.

### B. Mètodes `afegir_fill(a)` i `fill(a, i)`
*   **`afegir_fill(a)`**: Afegeix el subarbre `a` al final del vector de fills `seg` (`push_back`) i en transfereix la propietat (`a.primer_node = nullptr`) en temps $\mathcal{O}(1)$ amortitzat.
*   **`fill(a, i)`**: Retorna el fill $i$-èssim de l'arbre `a` (indexació 1-based, corresponent a la posició interna `seg[i-1]`).

---

## 6. Patrons de Recursió en Arbres (Exàmens PRO2)

Tots els problemes d'arbres es resolen seguint 4 passos sistemàtics:

1. **Cas base**:
   - Problemes globals (mida, cerca, sumes): `if (m == nullptr) return ...;`
   - Problemes de **camins arrel-fulla**: El cas base és la **fulla** (`if (m->segE == nullptr && m->segD == nullptr) return m->info;`) i cal bifurcar si només té un fill.
2. **Crida recursiva als fills**: Invocar la funció sobre els fills existents.
3. **Dada local**: Obtenir la informació del node actual (`m->info`).
4. **Combinació**: Operar la dada local amb els resultats retornats pels fills (`+`, `max`, `&&`, etc.).

---

### Patró 1: Càlcul sobre Camins (Binari)
```cpp
// Suma del camí màxim d'arrel a fulla (Cas base = Fulla)
T max_suma_cami(node_arbre* m) {
    if (m->segE == nullptr && m->segD == nullptr) return m->info; // 1. Fulla
    if (m->segE == nullptr) return m->info + max_suma_cami(m->segD); // 2. Un sol fill
    if (m->segD == nullptr) return m->info + max_suma_cami(m->segE);
    return m->info + max(max_suma_cami(m->segE), max_suma_cami(m->segD)); // 3. Dos fills
}
```

---

### Patró 2: Cerca / Booleà (Arbre General)
```cpp
// Cerca d'un element en arbre n-ari
bool buscar(node_arbreGen* m, const T& x) {
    if (m == nullptr) return false;          // 1. Cas base
    if (m->info == x) return true;           // 2. Dada local
    for (node_arbreGen* fill : m->seg) {     // 3. Iteració recursiva sobre fills
        if (buscar(fill, x)) return true;
    }
    return false;
}
```

---

### Patró 3: Construcció / Clonació d'Arbre amb Punter per Referència
```cpp
// Genera un nou arbre on cada node guarda la suma del seu subarbre
static int arb_sumes(node_arbre* m, node_arbre*& res) {
    if (m == nullptr) { res = nullptr; return 0; } // 1. Cas base
    
    res = new node_arbre; // 2. Creació del nou node
    int sumE = arb_sumes(m->segE, res->segE); // 3. Recursió a fills
    int sumD = arb_sumes(m->segD, res->segD);
    
    res->info = m->info + sumE + sumD; // 4. Combinació
    return res->info;
}
```

