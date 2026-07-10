---
title: "Tema 11: Implementación de árboles binarios"
description: "Implementación de árboles binarios con punteros"
readTime: "20 minutos"
order: 12
draft: false
isNew: true
---

## 1. Estructura de datos

La representación habitual utiliza nodos enlazados donde cada nodo tiene un valor y dos punteros a sus hijos.

```cpp
template <class T> class Arbre {
private:
  struct node_arbre {
    T info;             // Dato contenido en el nodo
    node_arbre *segE;   // Puntero al hijo izquierdo
    node_arbre *segD;   // Puntero al hijo derecho
  };
  node_arbre *primer_node; // Puntero a la raíz (NULL si el árbol está vacío)
};
```

### Visualización de la estructura

<div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 my-6 items-start">
<div>

Un nodo a nivel físico en memoria se ve así:

:::graph
```json
{
  "nodes": [
    { "id": "node_arbre", "label": "node_arbre", "color": "#10b981" },
    { "id": "info", "label": "info", "color": "#3b82f6" },
    { "id": "segE", "label": "*segE", "color": "#8b5cf6" },
    { "id": "segD", "label": "*segD", "color": "#8b5cf6" }
  ],
  "links": [
    { "source": "node_arbre", "target": "info" },
    { "source": "node_arbre", "target": "segE" },
    { "source": "node_arbre", "target": "segD" }
  ]
}
```
:::

</div>
<div>

Un árbol binario completo:

:::graph
```json
{
  "nodes": [
    { "id": "7", "label": "7", "color": "#10b981" },
    { "id": "2", "label": "2", "color": "#3b82f6" },
    { "id": "9", "label": "9", "color": "#3b82f6" },
    { "id": "10", "label": "10", "color": "#facc15" },
    { "id": "8", "label": "8", "color": "#facc15" },
    { "id": "12", "label": "12", "color": "#facc15" },
    { "id": "13", "label": "13", "color": "#facc15" }
  ],
  "links": [
    { "source": "7", "target": "2" },
    { "source": "7", "target": "9" },
    { "source": "2", "target": "10" },
    { "source": "2", "target": "8" },
    { "source": "9", "target": "12" },
    { "source": "9", "target": "13" }
  ]
}
```
:::

</div>
</div>

## 2. Operaciones de gestión de memoria


Como trabajamos con punteros y el operador `new`, debemos implementar la **Regla de los Tres** para evitar fugas de memoria o copias superficiales (*shallow copies*) que podrían corromper la memoria.

### 2.1 Copia profunda (Deep Copy)
Para copiar un árbol, no basta con copiar el puntero raíz; debemos duplicar todos los nodos recursivamente.

::algoviz{algorithm="arbre_copia_node"}

### 2.2 Liberación de memoria (Destrucción)
La destrucción se debe hacer en **post-orden**: primero eliminamos los subárboles y finalmente el nodo actual.

::algoviz{algorithm="arbre_esborra_node"}

## 3. Transferencia de propiedad (Plantar e Hijos)

En la implementación de PRO2, las operaciones `plantar` y `fills` son especialmente eficientes porque **mueven punteros** en lugar de copiar datos, pero esto vacía los parámetros de entrada.

| Operación | Efecto | Complejidad |
| :--- | :--- | :--- |
| `plantar(x, a1, a2)` | Crea una raíz `x` y "roba" las estructuras de `a1` y `a2`. | $O(1)$ |
| `fills(fe, fd)` | "Corta" la raíz actual y pasa los subárboles a `fe` y `fd`. | $O(1)$ |
| `arrel()` | Devuelve el dato del nodo raíz. | $O(1)$ |

::algoviz{algorithm="arbre_plantar"}

::algoviz{algorithm="arbre_fills"}

En la operación `plantar(x, a, a)`, si se intenta usar el mismo árbol como hijo izquierdo y derecho, la implementación debe hacer una copia de uno de ellos para evitar ciclos.

## 4. Tipos de recorridos

Para procesar la información de un árbol, podemos hacerlo en diferentes órdenes:

1.  **Pre-orden**: Raíz $\rightarrow$ Izquierdo $\rightarrow$ Derecho (Útil para copiar).
2.  **In-orden**: Izquierdo $\rightarrow$ Raíz $\rightarrow$ Derecho (Útil para listar elementos ordenados en un BST).
3.  **Post-orden**: Izquierdo $\rightarrow$ Derecho $\rightarrow$ Raíz (Útil para borrar o calcular sumas de subárboles).
4.  **Por niveles**: De arriba a abajo y de izquierda a derecha (Requiere una cola).
