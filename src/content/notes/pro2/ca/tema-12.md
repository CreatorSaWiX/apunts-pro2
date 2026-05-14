---
title: "Tema 12: Implementació d'arbres generals"
description: "Implementació d'arbres generals amb punters i vectors de fills"
readTime: "20 minuts"
order: 13
draft: false
isNew: true
---

## 1. Estructura de dades

L'estructura del node canvia per encabir una llista dinàmica de descendents:

```cpp
template <class T> class ArbreGen {
private:
  struct node_arbreGen {
    T info;                         // Dada del node
    vector<node_arbreGen*> seg;     // Vector de punters als fills
  };
  node_arbreGen* primer_node;       // Punter a l'arrel
};
```

### Visualització del node general

<div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 my-6 items-start">
<div>

En memòria, un node d'un arbre general es representa amb un vector que apunta a cada fill:

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

L'estructura jeràrquica permet qualsevol grau per node:

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

## 2. Gestió de memòria recursiva

La recursivitat en arbres generals ja no es limita a dues crides (esquerra i dreta), sinó que s'ha d'iterar sobre el vector de fills.

### 2.1 Còpia de nodes
Per copiar un node general, hem de reservar el vector amb la mida correcta i copiar cada fill:

::algoviz{algorithm="arbgen_copia"}

### 2.2 Esborrat de nodes
L'esborrat també requereix un bucle per recórrer tots els subarbres abans de fer el `delete` del node pare:

::algoviz{algorithm="arbgen_esborra"}

## 3. Operacions de construcció i consulta

Les operacions de "plantar" i "fills" s'adapten per treballar amb vectors d'arbres sencers.

| Operació | Descripció | Complexitat |
| :--- | :--- | :--- |
| `plantar(x, v)` | Crea una arrel `x` i li assigna el vector d'arbres `v` com a fills. | $O(N)$ (on $N$ és el nombre de fills) |
| `fills(v)` | Bua l'arbre actual i passa tots els seus fills al vector `v`. | $O(N)$ |
| `nombre_fills()` | Retorna la mida del vector `seg` de l'arrel. | $O(1)$ |

::algoviz{algorithm="arbgen_plantar"}

::algoviz{algorithm="arbgen_fills"}

> **Transferència de propietat**: Igual que en els arbres binaris, quan fem un `plantar` amb un vector d'arbres, els arbres originals dins del vector es queden buits per evitar duplicitats de memòria.

## 4. Diferències clau amb Arbre Binari

1.  **Representació**: Useu `vector<node*>` en lloc de dos punters fixos.
2.  **Iteració**: Tots els mètodes recursius canvien les dues crides fixes per un bucle `for` que recorre el vector.
3.  **Flexibilitat**: Podem afegir fills a posteriori amb `afegir_fill(a)`, operació que no existeix en l'arbre binari estàndard de teoria.

