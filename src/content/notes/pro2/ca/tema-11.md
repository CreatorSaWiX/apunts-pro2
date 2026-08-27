---
title: "Tema 11: Implementació d'arbres binaris"
description: "Implementació d'arbres binaris amb punters"
readTime: "20 minuts"
order: 12
draft: false
isNew: true
---

## 11.1 Estructura interna: Nodes i Punters

La representació interna d'un arbre binari a PRO2 utilitza estructures enllaçades on cada node emmagatzema una dada i dos punters als seus fills:

```cpp
template <typename T>
class Arbre {
private:
    struct node_arbre {
        T info;                 // Dada continguda al node
        node_arbre *segE;       // Punter al fill esquerre (nullptr si buit)
        node_arbre *segD;       // Punter al fill dret (nullptr si buit)
    };
    node_arbre *primer_node;    // Punter a l'arrel (nullptr si l'arbre és buit)
};
```

### Visualització de l'estructura en memòria

<div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 my-6 items-start">
<div>

**Node físic en memòria:**

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

**Arbre binari complet:**

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

---

## 11.2 El patró de Recursivitat Privada i la Regla dels Tres

Totes les operacions que recorren l'arbre es dissenyen seguint el patró de **mètode públic** (sense paràmetres de punter) que crida a una **funció privada/estàtica recursiva** sobre `node_arbre*`:

### 11.2.1 Còpia profunda: `copia_node_arbre(m)`
Duplica tots els nodes recursivament en pre-ordre reservant nova memòria:

```cpp
static node_arbre* copia_node_arbre(node_arbre* m) {
    if (m == nullptr) return nullptr;
    node_arbre* n = new node_arbre;
    n->info = m->info;
    n->segE = copia_node_arbre(m->segE);
    n->segD = copia_node_arbre(m->segD);
    return n;
}
```

::algoviz{algorithm="arbre_copia_node"}

---

### 11.2.2 Destrucció: `esborra_node_arbre(m)`
Allibera la memòria recursivament en **post-ordre** (primer els subarbres i al final l'arrel):

```cpp
static void esborra_node_arbre(node_arbre* m) {
    if (m != nullptr) {
        esborra_node_arbre(m->segE);
        esborra_node_arbre(m->segD);
        delete m;
    }
}
```

::algoviz{algorithm="arbre_esborra_node"}

---

### 11.2.3 La Regla dels Tres
```cpp
// 1. Destructor
~Arbre() {
    esborra_node_arbre(primer_node);
}

// 2. Constructor de còpia
Arbre(const Arbre& a) {
    primer_node = copia_node_arbre(a.primer_node);
}

// 3. Operador d'assignació
Arbre& operator=(const Arbre& a) {
    if (this != &a) {
        esborra_node_arbre(primer_node);
        primer_node = copia_node_arbre(a.primer_node);
    }
    return *this;
}
```

---

## 11.3 Transferència de punters en $\mathcal{O}(1)$: `plantar` i `fills`

A diferència de fer còpies profundes, `plantar` i `fills` funcionen en temps constant $\mathcal{O}(1)$ perquè **transfereixen la propietat dels punters** directament:

### 11.3.1 Plantar: `plantar(x, a1, a2)`
Crea una nova arrel amb valor `x`, enllaça els subarbres d'`a1` i `a2` i buida els arbres originals:

```cpp
void plantar(const T &x, Arbre &a1, Arbre &a2) {
    if (this != &a1 && this != &a2) {
        if (&a1 == &a2) { // Evita cicles si a1 i a2 són el mateix arbre
            a2.primer_node = copia_node_arbre(a1.primer_node);
        }
        node_arbre* aux = new node_arbre;
        aux->info = x;
        aux->segE = a1.primer_node;
        aux->segD = a2.primer_node;
        primer_node = aux;
        a1.primer_node = nullptr;
        a2.primer_node = nullptr;
    }
}
```

::algoviz{algorithm="arbre_plantar"}

---

### 11.3.2 Fills: `fills(fe, fd)`
Transfereix els subarbres esquerre i dret a `fe` i `fd`, i destrueix el node arrel actual:

```cpp
void fills(Arbre &fe, Arbre &fd) {
    node_arbre* aux = primer_node;
    fe.primer_node = aux->segE;
    fd.primer_node = aux->segD;
    primer_node = nullptr;
    delete aux;
}
```

::algoviz{algorithm="arbre_fills"}

---

## 11.4 Tipus de recorreguts

| Ordre | Seqüència de visita | Aplicació típica a PRO2 |
| :--- | :--- | :--- |
| **Pre-ordre** | Arrel $\rightarrow$ Esquerre $\rightarrow$ Dret | Duplicar/clonar l'arbre (`copia_node_arbre`), serialització. |
| **In-ordre** | Esquerre $\rightarrow$ Arrel $\rightarrow$ Dret | Llistar elements ordenats en un Arbre Binari de Cerca (BST). |
| **Post-ordre** | Esquerre $\rightarrow$ Dret $\rightarrow$ Arrel | Destruir l'arbre (`esborra_node_arbre`), calcular alçada o mida. |
| **Per nivells** | Nivell a nivell d'esquerra a dreta | Algorismes BFS (requereix una `queue<node_arbre*>`). |

---

## 11.5 Resum de Complexitat

| Mètode | Complexitat temporal | Explicació |
| :--- | :---: | :--- |
| **`plantar(x, a1, a2)`** | $\mathcal{O}(1)$ | Transferència directa de punters (sense copiar). |
| **`fills(fe, fd)`** | $\mathcal{O}(1)$ | Transferència de punters i `delete` de l'arrel. |
| **`arrel()` / `es_buit()`** | $\mathcal{O}(1)$ | Accés directe al camp de l'arrel o comparació `nullptr`. |
| **Destructor / Còpia** | $\Theta(n)$ | Visita i gestiona cadascun dels $n$ nodes de l'arbre. |
