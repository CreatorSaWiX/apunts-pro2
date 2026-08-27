---
title: "Tema 10: Implementació de llistes"
description: "Nodes doblement enllaçats, sentinelles i iteradors."
readTime: "20 min"
order: 11
draft: false
isUpdated: 1
---

## 10.1 Estructura interna: Doble enllaç i Sentinelles

A diferència del vector, una llista no emmagatzema els elements de forma contigua a la memòria. Cada element resideix en un **Node** (o `Item`) independent amb dos punters: un cap a l'element anterior (`prev`) i un cap al següent (`next`).

### Nodes sentinella (`iteminf` i `itemsup`)
Per evitar tractar casos especials quan la llista és buida o quan s'opera als extrems, la llista conté dos nodes sentinella ficticis que **sempre existeixen** (són membres directes de la classe, no punters):

- **`iteminf`**: Sentinella inicial. El seu `next` apunta al primer element real.
- **`itemsup`**: Sentinella final. El seu `prev` apunta a l'últim element real.

```cpp
template <typename T>
class List {
    struct Item {
        T value;
        Item *next, *prev;
    };
    int _size;
    Item iteminf, itemsup; // Sentinelles reals a l'objecte (no punters)
    
    // Inicialització en llista buida:
    void init() {
        _size = 0;
        iteminf.prev = nullptr;
        iteminf.next = &itemsup;
        itemsup.prev = &iteminf;
        itemsup.next = nullptr;
    }
};
```

> **El gran avantatge dels sentinelles:** Tot node real té **sempre** un veí anterior i un de posterior. No cal cap `if` per comprovar si inserim o esborrem al principi o al final!

---

## 10.2 El motor intern: els 6 mètodes privats

Tota la lògica de la llista es construeix sobre 6 mètodes auxiliars privats que operen directament sobre punters `Item*` en temps constant $\Theta(1)$:

### 10.2.1 Inserció per punter de node: `insertItem(pitemprev, pitem)`
Insereix el node `pitem` just després de `pitemprev` recosint els 4 punters d'enllaç:

```cpp
void insertItem(Item *pitemprev, Item *pitem) {
    pitem->next = pitemprev->next;
    pitem->next->prev = pitem;
    pitem->prev = pitemprev;
    pitemprev->next = pitem;
    _size++;
}
```

::algoviz{algorithm="list_insert_node"}

---

### 10.2.2 Inserció per valor: `insertItem(pitemprev, val)`
Reserva un nou node amb `new`, assigna el valor i delega el reenllaçament a la funció anterior:

```cpp
void insertItem(Item *pitemprev, const T& val) {
    Item *pitem = new Item;
    pitem->value = val;
    insertItem(pitemprev, pitem);
}
```

::algoviz{algorithm="list_insert_value"}

---

### 10.2.3 Extracció de node: `extractItem(pitem)`
Desconnecta el node de la llista ajustant els punters dels seus veïns. **No allibera la memòria.**

```cpp
void extractItem(Item *pitem) {
    pitem->next->prev = pitem->prev;
    pitem->prev->next = pitem->next;
    _size--;
}
```

::algoviz{algorithm="list_extract_item"}

---

### 10.2.4 Eliminació de memòria: `removeItem(pitem)`
Desconnecta el node de la seqüència i n'allibera la memòria amb `delete`:

```cpp
void removeItem(Item *pitem) {
    extractItem(pitem);
    delete pitem;
}
```

::algoviz{algorithm="list_remove_item"}

---

### 10.2.5 Buidar la llista: `removeItems()`
Allibera tots els nodes un per un esborrant sempre el primer element real:

```cpp
void removeItems() {
    while (_size > 0) {
        removeItem(iteminf.next);
    }
}
```

::algoviz{algorithm="list_remove_all"}

---

### 10.2.6 Còpia de llista: `copyItems(l)`
Recorre la llista original **des del final cap a l'inici** (`itemsup.prev` fins a `&iteminf`) inserint sempre a `&iteminf` (al davant). Com que inserir al davant inverteix l'ordre, fer-ho del final cap a l'inici manté l'ordre original exacte en temps $\Theta(n)$:

```cpp
void copyItems(const List& l) {
    for (Item *pitem = l.itemsup.prev; pitem != &l.iteminf; pitem = pitem->prev) {
        insertItem(&iteminf, pitem->value);
    }
}
```

::algoviz{algorithm="list_copy_items"}

---

### Moure nodes físicament (exercicis del Jutge)
En molts problemes (com `moveToEnd` o `splice`), es demana moure nodes sense copiar ni modificar `.value`:
```cpp
// Per moure el node 'p' just després de 'dest_prev':
extractItem(p);             // 1. Desconnectar
insertItem(dest_prev, p);   // 2. Reconnectar a la nova posició
```

## 10.3 Iteradors: El pont cap a les dades

Com que els nodes d'una llista estan dispersos al Heap, no és possible fer accés aleatori `[i]`. La classe `iterator` encapsula un punter al node actual (`Item *pitem`) i sobrecarrega els operadors per navegar per la seqüència:

```cpp
class iterator {
    Item *pitem;
    friend class List; // Permet a List accedir a pitem
public:
    T& operator*() const { return pitem->value; }
    
    iterator& operator++() { // ++it (avançar)
        pitem = pitem->next;
        return *this;
    }
    
    iterator& operator--() { // --it (retrocedir)
        pitem = pitem->prev;
        return *this;
    }
    
    bool operator==(const iterator& it) const { return pitem == it.pitem; }
    bool operator!=(const iterator& it) const { return pitem != it.pitem; }
};
```

### Extrems de la llista
- **`begin()`**: Retorna un iterador al primer element real (`iterator(iteminf.next)`).
- **`end()`**: Retorna un iterador al sentinella final (`iterator(&itemsup)`).

:::warning
**Mai desreferenciar `*l.end()`:** `itemsup` és un sentinella buit i no conté cap dada vàlida de tipus `T`.
:::

### Inserir i esborrar per iterador
```cpp
// Insereix 'val' ABANS de la posició 'it' en Θ(1):
iterator insert(iterator it, const T& val) {
    insertItem(it.pitem->prev, val);
    return iterator(it.pitem->prev);
}

// Esborra l'element apuntat per 'it' i retorna un iterador al següent en Θ(1):
iterator erase(iterator it) {
    Item *pnext = it.pitem->next;
    removeItem(it.pitem);
    return iterator(pnext);
}
```

:::linkedlistviz
:::

---

## 10.4 Gestió de memòria: La Regla dels Tres

Gràcies als mètodes auxiliars `removeItems()` i `copyItems()`, la Regla dels Tres s'escriu de forma compacta i robusta:

```cpp
// 1. Destructor: allibera tots els nodes
~List() {
    removeItems();
}

// 2. Constructor de còpia: crea nova llista i duplica els nodes
List(const List& l) {
    init();
    copyItems(l);
}

// 3. Operador d'assignació: neteja la pròpia i copia l'altra
List& operator=(const List& l) {
    if (this != &l) {
        removeItems();
        copyItems(l);
    }
    return *this;
}
```

---

## 10.5 Comparativa de Rendiment: Vector vs Llista

| Operació | Vector (`std::vector`) | Llista (`std::list`) |
| :--- | :---: | :---: |
| **Accés aleatori (`[i]`)** | $\Theta(1)$ | $\Theta(n)$ |
| **Inserir/Eliminar al final** | $\mathcal{O}(1)^*$ *(amortitzat)* | $\Theta(1)$ |
| **Inserir/Eliminar al principi** | $\Theta(n)$ | $\Theta(1)$ |
| **Inserir/Eliminar al mig amb iterador** | $\Theta(n)$ | $\Theta(1)$ |
| **Eficiència de memòria / Caché** | Excel·lent (bloc continu) | Regular (overhead de 2 punters per dada) |
