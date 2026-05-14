---
title: "Tema 11: Implementació d'arbres binaris"
description: "Implementació d'arbres binaris amb punters"
readTime: "20 minuts"
order: 12
draft: false
isNew: true
---

## 1. Estructura de dades

La representació habitual utilitza nodes enllaçats on cada node té un valor i dos punters als seus fills.

```cpp
template <class T> class Arbre {
private:
  struct node_arbre {
    T info;             // Dada continguda al node
    node_arbre *segE;   // Punter al fill esquerre
    node_arbre *segD;   // Punter al fill dret
  };
  node_arbre *primer_node; // Punter a l'arrel (NULL si l'arbre és buit)
};
```

### Visualització de l'estructura

<div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 my-6 items-start">
<div>

Un node a nivell físic en memòria es veu així:

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

Un arbre binari complet:

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

## 2. Operacions de gestió de memòria


Com que treballem amb punters i l'operador `new`, hem d'implementar la **Regla dels Tres** per evitar fuites de memòria o còpies superficials (*shallow copies*) que podrien corrompre la memòria.

### 2.1 Còpia profunda (Deep Copy)
Per copiar un arbre, no n'hi ha prou amb copiar el punter arrel; hem de duplicar tots els nodes recursivament.

::algoviz{algorithm="arbre_copia_node"}

### 2.2 Alliberament de memòria (Destrucció)
La destrucció s'ha de fer en **post-ordre**: primer eliminem els subarbres i finalment el node actual.

::algoviz{algorithm="arbre_esborra_node"}

## 3. Transferència de propietat (Plantar i Fills)

En la implementació de PRO2, les operacions `plantar` i `fills` són especialment eficients perquè **mouen punters** en lloc de copiar dades, però això buida els paràmetres d'entrada.

| Operació | Efecte | Complexitat |
| :--- | :--- | :--- |
| `plantar(x, a1, a2)` | Crea una arrel `x` i "roba" les estructures d' `a1` i `a2`. | $O(1)$ |
| `fills(fe, fd)` | "Talla" l'arrel actual i passa els subarbres a `fe` i `fd`. | $O(1)$ |
| `arrel()` | Retorna la dada del node arrel. | $O(1)$ |

::algoviz{algorithm="arbre_plantar"}

::algoviz{algorithm="arbre_fills"}

En l'operació `plantar(x, a, a)`, si s'intenta usar el mateix arbre com a fill esquerre i dret, la implementació ha de fer una còpia d'un d'ells per evitar cicles.

## 4. Tipus de recorreguts

Per processar la informació d'un arbre, podem fer-ho en diferents ordres:

1.  **Pre-ordre**: Arrel $\rightarrow$ Esquerre $\rightarrow$ Dret (Útil per copiar).
2.  **In-ordre**: Esquerre $\rightarrow$ Arrel $\rightarrow$ Dret (Útil per llistar elements ordenats en un BST).
3.  **Post-ordre**: Esquerre $\rightarrow$ Dret $\rightarrow$ Arrel (Útil per esborrar o calcular sumes de subarbres).
4.  **Per nivells**: De dalt a baix i d'esquerra a dreta (Requereix una cua).
