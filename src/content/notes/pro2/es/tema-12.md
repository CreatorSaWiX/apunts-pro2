---
title: "Tema 12: Implementación de árboles generales"
description: "Implementación de árboles generales con punteros y vectores de hijos"
readTime: "20 minutos"
order: 13
draft: false
isNew: true
---

## 1. Estructura de datos

La estructura del nodo cambia para dar cabida a una lista dinámica de descendientes:

```cpp
template <class T> class ArbreGen {
private:
  struct node_arbreGen {
    T info;                         // Dato del nodo
    vector<node_arbreGen*> seg;     // Vector de punteros a los hijos
  };
  node_arbreGen* primer_node;       // Puntero a la raíz
};
```

### Visualización del nodo general

<div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 my-6 items-start">
<div>

En memoria, un nodo de un árbol general se representa con un vector que apunta a cada hijo:

:::graph
```json
{
  "nodes": [
    { "id": "node_arbreGen", "label": "node_arbreGen", "color": "#10b981" },
    { "id": "info", "label": "info", "color": "#3b82f6" },
    { "id": "vector", "label": "vector<*seg>", "color": "#8b5cf6" },
    { "id": "fill0", "label": "*fill 0", "color": "#facc15" },
    { "id": "fill1", "label": "*fill 1", "color": "#facc15" },
    { "id": "filln", "label": "*fill n", "color": "#facc15" }
  ],
  "links": [
    { "source": "node_arbreGen", "target": "info" },
    { "source": "node_arbreGen", "target": "vector" },
    { "source": "vector", "target": "fill0" },
    { "source": "vector", "target": "fill1" },
    { "source": "vector", "target": "filln" }
  ]
}
```
:::

</div>
<div>

La estructura jerárquica permite cualquier grado por nodo:

:::graph
```json
{
  "nodes": [
    { "id": "A", "label": "A", "color": "#10b981" },
    { "id": "B", "label": "B", "color": "#3b82f6" },
    { "id": "C", "label": "C", "color": "#3b82f6" },
    { "id": "D", "label": "D", "color": "#3b82f6" },
    { "id": "E", "label": "E", "color": "#facc15" },
    { "id": "F", "label": "F", "color": "#facc15" },
    { "id": "G", "label": "G", "color": "#facc15" }
  ],
  "links": [
    { "source": "A", "target": "B" },
    { "source": "A", "target": "C" },
    { "source": "A", "target": "D" },
    { "source": "B", "target": "E" },
    { "source": "B", "target": "F" },
    { "source": "D", "target": "G" }
  ]
}
```
:::

</div>
</div>

## 2. Gestión de memoria recursiva

La recursividad en árboles generales ya no se limita a dos llamadas (izquierda y derecha), sino que se debe iterar sobre el vector de hijos.

### 2.1 Copia de nodos
Para copiar un nodo general, debemos reservar el vector con el tamaño correcto y copiar cada hijo:

::algoviz{algorithm="arbgen_copia"}

### 2.2 Borrado de nodos
El borrado también requiere un bucle para recorrer todos los subárboles antes de hacer el `delete` del nodo padre:

::algoviz{algorithm="arbgen_esborra"}

## 3. Operaciones de construcción y consulta

Las operaciones de "plantar" e "hijos" se adaptan para trabajar con vectores de árboles enteros.

| Operación | Descripción | Complejidad |
| :--- | :--- | :--- |
| `plantar(x, v)` | Crea una raíz `x` y le asigna el vector de árboles `v` como hijos. | $O(N)$ (donde $N$ es el número de hijos) |
| `fills(v)` | Vacía el árbol actual y pasa todos sus hijos al vector `v`. | $O(N)$ |
| `nombre_fills()` | Devuelve el tamaño del vector `seg` de la raíz. | $O(1)$ |

::algoviz{algorithm="arbgen_plantar"}

::algoviz{algorithm="arbgen_fills"}

> **Transferencia de propiedad**: Igual que en los árboles binarios, cuando hacemos un `plantar` con un vector de árboles, los árboles originales dentro del vector se quedan vacíos para evitar duplicidades de memoria.

## 4. Diferencias clave con Árbol Binario

1.  **Representación**: Usad `vector<node*>` en lugar de dos punteros fijos.
2.  **Iteración**: Todos los métodos recursivos cambian las dos llamadas fijas por un bucle `for` que recorre el vector.
3.  **Flexibilidad**: Podemos añadir hijos a posteriori con `afegir_fill(a)`, operación que no existe en el árbol binario estándar de teoría.
