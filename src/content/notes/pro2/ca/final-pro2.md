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
Exemple
2.  **Memory Leak**: Perdre l'únic punter que apuntava a memòria demanada amb `new` sense fer-ne el `delete` corresponent.
Exemple
3.  **Dangling Pointer (Punter penjant)**: Punter que apunta a una adreça de memòria que ja ha estat alliberada amb `delete`.
Exemple
4.  **Double-Delete**: Intentar fer `delete` dues vegades sobre la mateixa adreça de memòria (corromp la pila del Heap).
Exemple

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

### B. Còpia profunda forçada a `afegir_fill(a)` i `fill(a, i)`
*   **`afegir_fill(a)`**: **Alerta!** A diferència de `plantar`, aquest mètode **no transfereix punters** directament; en lloc d'això, fa una **còpia profunda de l'arbre `a`** a través de `copia_node_arbreGen(a.primer_node)`.
*   **`fill(a, i)`**: Pren el fill `i`-èssim de l'arbre `a` i en fa una còpia profunda com a nou arbre actual. Recorda que la crida és **1-indexed** (és a dir, el fill 1 de l'arbre equival internament a la posició indexada `0` del vector de fills `seg[i-1]`).

---

## 6. Estratègia per exercicis d'arbres (Salt de fe)

La gran majoria de problemes d'arbres es resolen amb una funció recursiva immersiva. Aquesta estratègia permet escriure codis d'examen ultra-nets sense haver d'intentar simular mentalment la pila de crides del processador:

1.  **El Cas Base (La condició de parada)**: Oblida't de l'arbre sencer i pregunta't: *Què és el més simple que em poden passar?* 
    *   En arbres, gairebé sempre és un arbre buit (`node == nullptr`). Exemple `X75329`: Quina és la freqüència d'un valor en un arbre buit? `0`. Aquest és el teu cas base.
    *   Si el problema requereix calcular una propietat sobre **camins que van des de l'arrel fins a una fulla**, el cas base **no pot ser l'arbre buit**, ja que no sabríem què retornar per a un punter nul sense alterar la semàntica o violar la definició de camí. Per tant, en aquests casos especials, el cas base és el **node fulla** (`m->segE == nullptr && m->segD == nullptr`). A més, caldrà gestionar de manera explícita els casos on el node només té un únic fill actiu per obligar el camí a continuar cap a ell. Exemple: `X67695`.
2.  **La Fe Cega (El Salt de Fe)**: **Escriu les crides recursives** sobre els fills actius (ex: `T res = f(m->segE);`), assumint i confiant cegament que cadascuna d'aquestes crides et retornarà *màgicament* la resposta correcta de tot el seu respectiu subarbre. 
    *   *Regla d'or:* No intentis simular ni imaginar mentalment com la funció anirà baixant pels subarbres; simplement crida-la i desa'n el resultat.
3.  **La Teva Única Feina (El node actual)**: Identifica quina dada local necessites del node actual. Normalment és el valor de l'arrel en la qual et trobes en el present (`m->info`).
4.  **La Combinació Final (El muntatge)**: Com uneixes la dada local del present (Pas 3) amb els resultats que t'han retornat les crides recursives dels teus fills (Pas 2)?
    *   Aquí és on apliques la lògica algebraica del problema (operacions com `+`, `&&`, comparacions `>` o condicionals per triar el millor resultat). 
    *   Exemple: Retornes `m->info + (esquerra > dreta ? esquerra : dreta)`.

### Equivalència de l'Estratègia: Binari vs General (n-ari)

| Fase | Arbre Binari (`Arbre.hh`) | Arbre General (`ArbreG.hh`) |
| :--- | :--- | :--- |
| **1. Cas Base** | `if (m == nullptr) return ...;`<br>*(O cas de node fulla si parlem de camins)* | `if (m == nullptr) return ...;`<br>*(O cas de node fulla si parlem de camins)* |
| **2. Salt de Fe** | Crides recursives directes a fill esquerre (`m->segE`) i dret (`m->segD`). | Bucle `for` que acumula recursivament el resultat de cadascun dels fills al vector `m->seg`. |
| **3. Feina al Node** | Processar la dada del node actual (`m->info`). | Processar la dada del node actual (`m->info`). |
| **4. Combinació** | Combinar la feina local amb la de l'esquerra i la dreta. | Combinar la feina local amb la suma/acumulació obtinguda al bucle de fills. |

### Exemple 1: Suma del camí màxim (`max_suma_cami` - Binari)
*Enunciat: Calcula la suma del camí de suma màxima des de l'arrel a una fulla d'un arbre binari no buit.*

*   **Cas Base**: Si un node és una fulla (fills nuls), el camí màxim és simplement el seu propi valor.
*   **Salt de Fe**: Assumim que el fill esquerre em dona el seu camí màxim `maxE`, i el dret `maxD`.
*   **Combinació**: El meu camí màxim serà el meu valor (`m->info`) més el màxim dels camins dels dos subarbres.

```cpp
T max_suma_cami_aux(node_arbre* m) {
    // Cas Base: Node Fulla
    if (m->segE == nullptr && m->segD == nullptr) return m->info;

    // Salt de Fe: Assumim que per sota ja funciona
    T maxE = max_suma_cami_aux(m->segE);
    T maxD = max_suma_cami_aux(m->segD);

    // Combinació
    if (m->segE == nullptr) return m->info + maxD;
    if (m->segD == nullptr) return m->info + maxE;
    return m->info + max(maxE, maxD);
}
```

### Exemple 2: Cerca d'un valor (`buscar` - Arbre General)
*Enunciat: Indica si un valor `x` es troba o no en un arbre general n-ari.*

*   **Cas Base**: Si l'arbre és buit, és impossible que hi sigui (`return false`).
*   **La meva feina**: Sóc jo el node que busquem? `if (m->info == x) return true;`.
*   **Salt de Fe en n-aris**: Si no sóc jo, demano en bucle a cadascun dels meus fills si el tenen. Si qualsevol fill em diu `true`, propago el `true` cap a dalt. Si cap fill el té, retorno `false`.

```cpp
bool buscar_aux(node_arbreGen* m, const T& x) {
    if (m == nullptr) return false; // Cas Base
    
    if (m->info == x) return true; // La meva feina

    // Salt de Fe en n-aris: bucle sobre el vector de fills
    int n = m->seg.size();
    for (int i = 0; i < n; ++i) {
        if (buscar_aux(m->seg[i], x)) return true; // Si un fill el troba, tornem true
    }
    return false; // Cap fill l'ha trobat
}
```

### Exemple 3: L'Arbre de Sumes (`arb_sumes` - Binari)
*Enunciat: Retorna un nou arbre idèntic en forma on cada node conté la suma de tot el seu subarbre corresponent.*

*   **Cas Base**: Si l'arbre és buit, el subarbre suma és nul i la suma és `0`.
*   **Salt de Fe**: Assumim que el fill esquerre calcula correctament el seu arbre de sumes `asumE` i em retorna la seva suma acumulada `sumE`. El mateix per a la dreta amb `asumD` i `sumD`.
*   **La meva feina + Combinació**: La meva suma és `m->info + sumE + sumD`. Creo un nou node amb aquest valor i el connecto amb els dos subarbres resultants.

```cpp
// Auxiliar que rep el node actual, construeix el subarbre de sumes en 'res' i en retorna la suma
static int arb_sumes_aux(node_arbre* m, node_arbre*& res) {
    if (m == nullptr) {
        res = nullptr;
        return 0; // Cas base
    }

    res = new node_arbre;
    
    // Salt de Fe: Assumim que esquerra i dreta es construeixen soles i ens donen les sumes
    int sumE = arb_sumes_aux(m->segE, res->segE);
    int sumD = arb_sumes_aux(m->segD, res->segD);

    // La meva feina + Combinació
    res->info = m->info + sumE + sumD;
    return res->info;
}
```

