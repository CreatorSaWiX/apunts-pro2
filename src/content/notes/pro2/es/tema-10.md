---
title: "Tema 10: Implementación de listas"
description: "Nodos doblemente enlazados, centinelas e iteradores."
readTime: "20 min"
order: 11
draft: false
isUpdated: 1
---

## 1. Estructura interna: doble enlace y centinelas

A diferencia del vector, una lista no guarda los elementos juntos en memoria. Cada elemento está en un **Nodo** (o `Item`) independiente que sabe quién tiene delante y quién tiene detrás.

### Nodos centinela (`iteminf` e `itemsup`)
Esta implementación utiliza dos nodos especiales que **siempre existen**, aunque la lista esté vacía:
- **`iteminf`**: El nodo "ficticio" inicial. Su `next` apunta al primer elemento real.
- **`itemsup`**: El nodo "ficticio" final. Su `prev` apunta al último elemento real.

```cpp
template <typename T>
class List {
    struct Item {
        T value;
        Item *next, *prev;
    };
    int _size;
    Item iteminf, itemsup; // Nodos reales (no punteros)
public:
    // ...
};
```

## 2. El motor: insertar y borrar en $\Theta(1)$

La lista es la estructura ideal para insertar/borrar en cualquier punto si ya tenemos la posición. Solo hace falta "recoser" los punteros.

### Insertar un elemento por puntero de nodo (`insertItem(punteroPrevio, punteroNodo)`)

1. Conectamos el nuevo nodo con su siguiente y anterior respectivos.
2. Actualizamos los punteros de los vecinos (`pitemprev` y `pitemprev->next`) para que recosan el enlace con el nodo introducido.

::algoviz{algorithm="list_insert_node"}

### Insertar un elemento por valor (`insertItem(punteroPrevio, valor)`)

1. Creamos el nuevo nodo `Item` con `new`.
2. Rellenamos el valor del dato del nodo.
3. Llamamos a la función anterior `insertItem` para recoser el nodo instanciado.

::algoviz{algorithm="list_insert_value"}

### Extraer un elemento (`extractItem(punteroNodo)`)

1. El nodo siguiente pasa a apuntar directamente al anterior.
2. El nodo anterior pasa a apuntar directamente al siguiente.
3. Restamos 1 al tamaño de la lista.

::algoviz{algorithm="list_extract_item"}

### Eliminar un elemento de memoria (`removeItem(punteroNodo)`)

1. Llamamos a `extractItem` para desconectar de forma segura el nodo.
2. Liberamos la memoria del nodo utilizando `delete`.

::algoviz{algorithm="list_remove_item"}

### Vaciar toda la lista (`removeItem()`)

1. Mientras el tamaño sea mayor que 0.
2. Vamos extrayendo y borrando siempre el primer elemento de la lista (`iteminf.next`).

::algoviz{algorithm="list_remove_all"}

### Copiar nodos de otra lista (`copyItems(lista_original)`)

1. Iteramos la lista original al revés (desde el último nodo hacia el primero).
2. Por cada nodo original, llamamos a `insertItem` delante de todo (`&iteminf`, haciendo un efecto _push_front_). Al añadir los elementos al revés siempre por delante, el orden final de la copia es el original.

::algoviz{algorithm="list_copy_items"}
### Cómo mover nodos (la regla de los 4 punteros)
En muchos ejercicios (como `moveToEnd` o `moveSecondToLast`), el Juez prohíbe intercambiar los `.value`. Tienes que mover el nodo físicamente:
1. **Desconectar**: Une el vecino anterior con el siguiente (`p->prev->next = p->next` y `p->next->prev = p->prev`).
2. **Reconectar**: Inserta el nodo en la nueva posición ajustando sus nuevos `next` y `prev` y los de sus nuevos vecinos.

> Si mover un nodo implica que este sea vecino de sí mismo (casos de 2 elementos), ¡ten cuidado de no perder el puntero antes de tiempo! Se recomienda el uso de punteros temporales.

## 3. Iteradores: El puente hacia los datos

Como los nodos están dispersos, no podemos usar `[i]`. Usamos **iteradores**, que actúan como un puntero inteligente que sabe cómo moverse por la lista.

- **`begin()`**: Apunta al primer elemento real (`iteminf.next`).
- **`end()`**: Apunta al nodo centinela final (`itemsup`). **¡Nunca se debe desreferenciar!**

```cpp
class iterator {
    List *plist;
    Item *pitem;
public:
    T& operator*() { return pitem->value; }
    iterator operator++() { // Preincremento (++it)
        pitem = pitem->next;
        return *this;
    }
};
```

::linkedlistviz

## 4. Gestión de memoria: La Regla de los Tres

Como gestionamos nodos con `new`, tenemos que ser muy cuidadosos:
1. **Destructor**: Debe borrar TODOS los nodos (usando `removeItem` en bucle).
2. **Constructor de copia**: Debe crear nodos nuevos y copiar los valores.
3. **Operador de asignación**: Limpiar la lista actual y copiar la nueva.

> En la asignación `l1 = l2`, siempre debemos comprobar la **auto-asignación** (`this != &l`) para no borrar los datos que queremos copiar.

---

## Vector vs Lista: ¿Cuándo usar cuál?

| Característica | Vector (`std::vector`) | Lista (`std::list`) |
| :--- | :--- | :--- |
| **Acceso aleatorio `[i]`** | $\Theta(1)$ | $\Theta(n)$ (hay que recorrer) |
| **Insertar al final** | $\mathcal{O}(1)$ amortizado | $\Theta(1)$ |
| **Insertar al principio** | $\Theta(n)$ | $\Theta(1)$ |
| **Insertar al medio (con it)** | $\Theta(n)$ | $\Theta(1)$ |
| **Memoria** | Bloque contiguo (más rápido para la CPU) | Nodos dispersos (más overhead) |

## Operaciones con Iteradores

| Operación | Código | Explicación |
| :--- | :--- | :--- |
| **Insertar** | `it = l.insert(it, val)` | Inserta **antes** de `it`. |
| **Borrar** | `it = l.erase(it)` | Borra `it` y devuelve el **siguiente**. |
| **Recorrer** | `for(auto it=l.begin(); it!=l.end(); ++it)` | El patrón estándar. |
