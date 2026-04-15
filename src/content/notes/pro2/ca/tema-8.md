---
title: "Tema 8: Punters i Memòria Dinàmica"
description: "Gestió de memòria en C++, operadors, aliasing i gestió del 'heap'."
readTime: "20 min"
order: 9
draft: false
isNew: true
---

## 1. La memòria en C++: Stack vs Heap

Per entendre els punters, primer hem de saber on s'emmagatzemen les dades. La memòria d'un programa es divideix principalment en dues zones:

| Característica | Stack (Pila) | Heap (Monticle) |
| :--- | :--- | :--- |
| **Gestió** | Automàtica (per l'ordinador). | Manual (pel programador). |
| **Velocitat** | Molt ràpida. | Més lenta. |
| **Mida** | Limitada i fixa. | Molt gran (memòria RAM disponible). |
| **Cicle de vida** | Les variables neixen i moren al sortir del bloc `{}`. | Es mantenen vives fins que es crida `delete`. |

## 2. Què és un punter?

Un **punter** és una variable que, en lloc d'emmagatzemar un valor (com un `int` o `char`), emmagatzema una **adreça de memòria**.

| Operador | Nom | Funció | Exemple |
| :--- | :--- | :--- | :--- |
| **`&`** | Adreça de (address-of) | Obté l'adreça de memòria d'una variable. | `p = &x;` |
| **`*`** | Indirecció (dereference) | Accedeix al contingut de l'adreça que guarda el punter. | `cout << *p;` |
| **`->`** | Fletxa (arrow) | Accedeix a un membre d'una classe/estructura via punter. | `p->metode();` |

> **Nota sobre `nullptr`**: Des de C++11, s'utilitza `nullptr` per indicar que un punter no apunta a cap lloc. És molt més segur que el vell `NULL` o `0`.

```cpp
int x = 10;
int* p = &x; // p apunta a x

cout << p;   // Imprimeix una adreça: 0x7ffe...
cout << *p;  // Imprimeix el valor de x: 10
```

## 3. Gestió dinàmica de memòria

Aquesta és la utilitat real dels punters: demanar memòria en temps d'execució.

### `new` i `delete`

1.  **`new T`**: Reserva espai al **heap** per a un objecte de tipus `T` i retorna la seva adreça.
2.  **`delete p`**: Allibera la memòria reservada prèviament amb `new`.

```cpp
// Reserva dinàmica
int* p = new int; 
*p = 42;

// Ús
cout << *p;

// Alliberament
delete p; 
p = nullptr; // Bona pràctica: evitar punters penjants
```

> Per cada `new` que facis, hi ha d'haver un `delete`. Si no, tindràs un **memory leak** (fuga de memòria).

## 4. Aliasing i assignació

L'**aliasing** passa quan dos o més punters apunten a la mateixa adreça de memòria. Modificar el valor a través d'un punter afecta a tots els altres "àlies".
```cpp
int* p1 = new int(10);
int* p2 = p1; // Aliasing: p2 apunta on apunta p1

*p2 = 20;
cout << *p1; // Imprimirà 20!
```

## 5. El perill dels punters: errors comuns

L'ús de punters requereix molta disciplina. Els errors més habituals a PRO2 són:

1.  **Segmentation Fault**: Intentar accedir a una adreça no vàlida (ex: punter `nullptr` o no inicialitzat).
2.  **Memory Leak**: Perdre l'adreça d'una zona de memòria reservada sense haver fet `delete`.
3.  **Dangling Pointer (Punter penjant)**: Tenir un punter que apunta a una adreça que ja ha estat alliberada.

## 6. Implementació d'estructures enllaçades

Els punters ens permeten crear estructures de mida variable anomenades **nodes enllaçats**. Un node típic conté una dada i un punter al següent node.

```cpp
struct Node {
    int info;
    Node* seg;
};
```

### Visualització de nodes
Un conjunt de nodes ens permet implementar Piles, Cues i Llistes sense les limitacions de mida dels vectors estàtics.

:::graph
```json
{
  "nodes": [
    { "id": "n1", "label": "Node 1 (info: 10)" },
    { "id": "n2", "label": "Node 2 (info: 20)" },
    { "id": "n3", "label": "Node 3 (info: 30)" },
    { "id": "null", "label": "nullptr", "color": "#ef4444" }
  ],
  "links": [
    { "source": "n1", "target": "n2", "label": "seg" },
    { "source": "n2", "target": "n3", "label": "seg" },
    { "source": "n3", "target": "null", "label": "seg" }
  ]
}
```
:::

---

## 7. Punters vs Iteradors

A PRO2, sovint utilitzem **iteradors** per recórrer llistes, conjunts o mapes. Tot i que semblen similars (tots dos usen `*` i `++`), hi ha diferències clau:

- **Punter**: És una adreça de memòria real. És "baix nivell".
- **Iterador**: És un objecte que "simula" ser un punter per recórrer una estructura. És "alt nivell".

> Un punter pot ser vist com un iterador d'un vector, però un iterador d'un `std::list` no és necessàriament un punter (internament pot ser més complex).

---

## 8. Pas de paràmetres 

| Tipus | Sintaxi | Efecte | Eficiència |
| :--- | :--- | :--- | :--- |
| **Per valor** | `f(int x)` | Còpia del valor. | Baixa (si l'objecte és gran). |
| **Per referència** | `f(int& x)` | Àlies directe. | Alta. |
| **Per punter** | `f(int* x)` | Passa l'adreça. | Alta. |

> A PRO2, preferim **referències constants** (`const T& x`) per a objectes grans que no volem modificar, i **punters** només quan necessitem que el paràmetre pugui ser opcional (`nullptr`) o per a estructures dinàmiques.
