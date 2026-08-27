---
title: "Tema 10: Implementación de listas"
description: "Nodos doblemente enlazados, centinelas e iteradores."
readTime: "20 min"
order: 11
draft: false
isUpdated: 1
---

## 10.1 Estructura interna: Doble enlace y Centinelas

A diferencia del vector, una lista no almacena los elementos de forma contigua en la memoria. Cada elemento reside en un **Nodo** (o `Item`) independiente con dos punteros: uno hacia el elemento anterior (`prev`) y uno hacia el siguiente (`next`).

### Nodos centinela (`iteminf` e `itemsup`)
Para evitar tratar casos especiales cuando la lista está vacía o cuando se opera en los extremos, la lista contiene dos nodos centinela ficticios que **siempre existen** (son miembros directos de la clase, no punteros):

- **`iteminf`**: Centinela inicial. Su `next` apunta al primer elemento real.
- **`itemsup`**: Centinela final. Su `prev` apunta al último elemento real.

```cpp
template <typename T>
class List {
    struct Item {
        T value;
        Item *next, *prev;
    };
    int _size;
    Item iteminf, itemsup; // Centinelas reales en el objeto (no punteros)
    
    // Inicialización en lista vacía:
    void init() {
        _size = 0;
        iteminf.prev = nullptr;
        iteminf.next = &itemsup;
        itemsup.prev = &iteminf;
        itemsup.next = nullptr;
    }
};
```

> **La gran ventaja de los centinelas:** Todo nodo real tiene **siempre** un vecino anterior y uno posterior. ¡No hace falta ningún `if` para comprobar si insertamos o borramos al principio o al final!

---

## 10.2 El motor interno: los 6 métodos privados

Toda la lógica de la lista se construye sobre 6 métodos auxiliares privados que operan directamente sobre punteros `Item*` en tiempo constante $\Theta(1)$:

### 10.2.1 Inserción por puntero de nodo: `insertItem(pitemprev, pitem)`
Inserta el nodo `pitem` justo después de `pitemprev` recosiendo los 4 punteros de enlace:

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

### 10.2.2 Inserción por valor: `insertItem(pitemprev, val)`
Reserva un nuevo nodo con `new`, asigna el valor y delega el reenlace a la función anterior:

```cpp
void insertItem(Item *pitemprev, const T& val) {
    Item *pitem = new Item;
    pitem->value = val;
    insertItem(pitemprev, pitem);
}
```

::algoviz{algorithm="list_insert_value"}

---

### 10.2.3 Extracción de nodo: `extractItem(pitem)`
Desconecta el nodo de la lista ajustando los punteros de sus vecinos. **No libera la memoria.**

```cpp
void extractItem(Item *pitem) {
    pitem->next->prev = pitem->prev;
    pitem->prev->next = pitem->next;
    _size--;
}
```

::algoviz{algorithm="list_extract_item"}

---

### 10.2.4 Eliminación de memoria: `removeItem(pitem)`
Desconecta el nodo de la secuencia y libera su memoria con `delete`:

```cpp
void removeItem(Item *pitem) {
    extractItem(pitem);
    delete pitem;
}
```

::algoviz{algorithm="list_remove_item"}

---

### 10.2.5 Vaciar la lista: `removeItems()`
Libera todos los nodos uno a uno borrando siempre el primer elemento real:

```cpp
void removeItems() {
    while (_size > 0) {
        removeItem(iteminf.next);
    }
}
```

::algoviz{algorithm="list_remove_all"}

---

### 10.2.6 Copia de lista: `copyItems(l)`
Recorre la lista original **desde el final hacia el principio** (`itemsup.prev` hasta `&iteminf`) insertando siempre en `&iteminf` (delante). Como insertar delante invierte el orden, hacerlo del final hacia el principio mantiene el orden original exacto en tiempo $\Theta(n)$:

```cpp
void copyItems(const List& l) {
    for (Item *pitem = l.itemsup.prev; pitem != &l.iteminf; pitem = pitem->prev) {
        insertItem(&iteminf, pitem->value);
    }
}
```

::algoviz{algorithm="list_copy_items"}

---

### Mover nodos físicamente (ejercicios del Juez)
En muchos problemas (como `moveToEnd` o `splice`), se pide mover nodos sin copiar ni modificar `.value`:
```cpp
// Para mover el nodo 'p' justo después de 'dest_prev':
extractItem(p);             // 1. Desconectar
insertItem(dest_prev, p);   // 2. Reconectar en la nueva posición
```

## 10.3 Iteradores: El puente hacia los datos

Como los nodos de una lista están dispersos en el Heap, no es posible hacer acceso aleatorio `[i]`. La clase `iterator` encapsula un puntero al nodo actual (`Item *pitem`) y sobrecarga los operadores para navegar por la secuencia:

```cpp
class iterator {
    Item *pitem;
    friend class List; // Permite a List acceder a pitem
public:
    T& operator*() const { return pitem->value; }
    
    iterator& operator++() { // ++it (avanzar)
        pitem = pitem->next;
        return *this;
    }
    
    iterator& operator--() { // --it (retroceder)
        pitem = pitem->prev;
        return *this;
    }
    
    bool operator==(const iterator& it) const { return pitem == it.pitem; }
    bool operator!=(const iterator& it) const { return pitem != it.pitem; }
};
```

### Extremos de la lista
- **`begin()`**: Devuelve un iterador al primer elemento real (`iterator(iteminf.next)`).
- **`end()`**: Devuelve un iterador al centinela final (`iterator(&itemsup)`).

:::warning
**Nunca desreferenciar `*l.end()`:** `itemsup` es un centinela vacío y no contiene ningún dato válido de tipo `T`.
:::

### Insertar y borrar por iterador
```cpp
// Inserta 'val' ANTES de la posición 'it' en Θ(1):
iterator insert(iterator it, const T& val) {
    insertItem(it.pitem->prev, val);
    return iterator(it.pitem->prev);
}

// Borra el elemento apuntado por 'it' y devuelve un iterador al siguiente en Θ(1):
iterator erase(iterator it) {
    Item *pnext = it.pitem->next;
    removeItem(it.pitem);
    return iterator(pnext);
}
```

:::linkedlistviz
:::

---

## 10.4 Gestión de memoria: La Regla de los Tres

Gracias a los métodos auxiliares `removeItems()` y `copyItems()`, la Regla de los Tres se escribe de forma compacta y robusta:

```cpp
// 1. Destructor: libera todos los nodos
~List() {
    removeItems();
}

// 2. Constructor de copia: crea nueva lista y duplica los nodos
List(const List& l) {
    init();
    copyItems(l);
}

// 3. Operador de asignación: limpia la propia y copia la otra
List& operator=(const List& l) {
    if (this != &l) {
        removeItems();
        copyItems(l);
    }
    return *this;
}
```

---

## 10.5 Comparativa de Rendimiento: Vector vs Lista

| Operación | Vector (`std::vector`) | Lista (`std::list`) |
| :--- | :---: | :---: |
| **Acceso aleatorio (`[i]`)** | $\Theta(1)$ | $\Theta(n)$ |
| **Insertar/Eliminar al final** | $\mathcal{O}(1)^*$ *(amortizado)* | $\Theta(1)$ |
| **Insertar/Eliminar al principio** | $\Theta(n)$ | $\Theta(1)$ |
| **Insertar/Eliminar al medio con iterador** | $\Theta(n)$ | $\Theta(1)$ |
| **Eficiencia de memoria / Caché** | Excelente (bloque continuo) | Regular (overhead de 2 punteros por dato) |
