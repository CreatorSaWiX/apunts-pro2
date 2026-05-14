---
title: "Tema 10: Implementació de llistes"
description: "Nodes doblement enllaçats, sentinelles i iteradors."
readTime: "20 min"
order: 11
draft: false
isUpdated: 1
---

## 1. Estructura interna: doble enllaç i sentinelles

A diferència del vector, una llista no guarda els elements junts en memòria. Cada element està en un **Node** (o `Item`) independent que sap qui té davant i qui té darrere.

### Nodes sentinella (`iteminf` i `itemsup`)
Aquesta implementació utilitza dos nodes especials que **sempre existeixen**, encara que la llista estigui buida:
- **`iteminf`**: El node "fictici" inicial. El seu `next` apunta al primer element real.
- **`itemsup`**: El node "fictici" final. El seu `prev` apunta a l'últim element real.

```cpp
template <typename T>
class List {
    struct Item {
        T value;
        Item *next, *prev;
    };
    int _size;
    Item iteminf, itemsup; // Nodes reals (no punters)
public:
    // ...
};
```

## 2. El motor: inserir i esborrar en $\Theta(1)$

La llista és l'estructura ideal per inserir/esborrar en qualsevol punt si ja tenim la posició. Només cal "recosir" els punters.

### Inserir un element per punter de node (`insertItem(punterPrevi, punterNode)`)

1. Connectem el nou node amb el seu següent i anterior respectius.
2. Actualitzem els punters dels veïns (`pitemprev` i `pitemprev->next`) perquè recosin l'enllaç amb el node introduït.

::algoviz{algorithm="list_insert_node"}

### Inserir un element per valor (`insertItem(punterPrevi, valor)`)

1. Creem el nou node `Item` amb `new`.
2. Emplenem el valor de la dada del node.
3. Cridem a la funció anterior `insertItem` per recosir el node instanciat.

::algoviz{algorithm="list_insert_value"}

### Extreure un element (`extractItem(punterNode)`)

1. El node següent passa a apuntar directament a l'anterior.
2. El node anterior passa a apuntar directament al següent.
3. Restem 1 a la mida de la llista.

::algoviz{algorithm="list_extract_item"}

### Eliminar un element de memòria (`removeItem(punterNode)`)

1. Cridem a `extractItem` per desconnectar de forma segura el node.
2. Alliberem la memòria del node utilitzant `delete`.

::algoviz{algorithm="list_remove_item"}

### Buidar tota la llista (`removeItem()`)

1. Mentre la mida sigui més gran que 0.
2. Anem extraient i esborrant sempre el primer element de la llista (`iteminf.next`).

::algoviz{algorithm="list_remove_all"}

### Copiar nodes d'una altra llista (`copyItems(llista_original)`)

1. Iterem la llista original al revés (des de l'últim node cap al primer).
2. Per cada node original, cridem a `insertItem` al davant de tot (`&iteminf`, fent un efecte _push_front_). En afegir els elements al revés sempre per davant, l'ordre final de la còpia és l'original.

::algoviz{algorithm="list_copy_items"}
### Com moure nodes (la regla dels 4 punters)
En molts exercicis (com `moveToEnd` o `moveSecondToLast`), el Jutge prohibeix intercanviar els `.value`. Has de moure el node físicament:
1. **Desconnectar**: Uneix el veí anterior amb el següent (`p->prev->next = p->next` i `p->next->prev = p->prev`).
2. **Reconnectar**: Insereix el node a la nova posició ajustant els seus nous `next` i `prev` i els dels seus nous veïns.

> Si moure un node implica que aquest sigui veí d'ell mateix (casos de 2 elements), ves amb compte de no perdre el punter abans d'hora! Ús de punters temporals és recomanat.

## 3. Iteradors: El pont cap a les dades

Com que els nodes estan dispersos, no podem usar `[i]`. Usem **iteradors**, que actuen com un punter intel·ligent que sap com moure's per la llista.

- **`begin()`**: Apunta al primer element real (`iteminf.next`).
- **`end()`**: Apunta al node sentinella final (`itemsup`). **Mai s'ha de desreferenciar!**

```cpp
class iterator {
    List *plist;
    Item *pitem;
public:
    T& operator*() { return pitem->value; }
    iterator operator++() { // Preincrement (++it)
        pitem = pitem->next;
        return *this;
    }
};
```

::linkedlistviz

## 4. Gestió de memòria: La Regla dels Tres

Com que gestionem nodes amb `new`, hem de ser molt curosos:
1. **Destructor**: Ha d'esborrar TOTS els nodes (usant `removeItem` en bucle).
2. **Constructor de còpia**: Ha de crear nodes nous i copiar els valors.
3. **Operador d'assignació**: Netejar la llista actual i copiar la nova.

> A l'assignació `l1 = l2`, sempre hem de comprovar l'**auto-assignació** (`this != &l`) per no esborrar les dades que volem copiar.

---

## Vector vs Llista: Quan usar quina?

| Característica | Vector (`std::vector`) | Llista (`std::list`) |
| :--- | :--- | :--- |
| **Accés aleatori `[i]`** | $\Theta(1)$ | $\Theta(n)$ (cal recórrer) |
| **Inserir al final** | $\mathcal{O}(1)$ amortitzat | $\Theta(1)$ |
| **Inserir al principi** | $\Theta(n)$ | $\Theta(1)$ |
| **Inserir al mig (amb it)** | $\Theta(n)$ | $\Theta(1)$ |
| **Memòria** | Bloc contigu (més ràpid per la CPU) | Nodes dispersos (més overhead) |

## Operacions amb Iteradors

| Operació | Codi | Explicació |
| :--- | :--- | :--- |
| **Inserir** | `it = l.insert(it, val)` | Insereix **abans** de `it`. |
| **Esborrar** | `it = l.erase(it)` | Esborra `it` i retorna el **següent**. |
| **Recórrer** | `for(auto it=l.begin(); it!=l.end(); ++it)` | El patró estàndard. |
