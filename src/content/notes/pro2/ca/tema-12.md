---
title: "Tema 12: Implementació d'arbres generals"
description: "Implementació d'arbres generals amb punters i vectors de fills"
readTime: "20 minuts"
order: 13
draft: false
isNew: true
---

## 12.1 Estructura interna: Nodes N-aris amb `std::vector`

Un arbre general (o N-ari) no limita el nombre de fills de cada node a dos. L'estructura interna utilitza un vector dinàmic de punters `vector<node_arbreGen*> seg` per guardar les adreces dels fills:

```cpp
template <typename T>
class ArbreGen {
private:
    struct node_arbreGen {
        T info;                         // Dada continguda al node
        vector<node_arbreGen*> seg;     // Vector de punters als fills
    };
    node_arbreGen* primer_node;         // Punter a l'arrel (nullptr si buit)
};
```

### Visualització de l'estructura en memòria

<div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 my-6 items-start">
<div>

**Node amb vector de fills en memòria:**

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

**Arbre general de grau variable:**

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

---

## 12.2 Recursivitat sobre Vectors i la Regla dels Tres

La recursivitat sobre arbres generals substitueix les dues crides fixes (`segE` i `segD`) per un bucle `for` que itera sobre la mida del vector `m->seg.size()`:

### 12.2.1 Còpia profunda: `copia_node_arbreGen(m)`
Duplica tots els nodes recursivament reservant el vector de la mida exacta:

```cpp
static node_arbreGen* copia_node_arbreGen(node_arbreGen* m) {
    if (m == nullptr) return nullptr;
    node_arbreGen* n = new node_arbreGen;
    n->info = m->info;
    int ari = m->seg.size();
    n->seg = vector<node_arbreGen*>(ari);
    for (int i = 0; i < ari; ++i) {
        n->seg[i] = copia_node_arbreGen(m->seg[i]);
    }
    return n;
}
```

::algoviz{algorithm="arbgen_copia"}

---

### 12.2.2 Destrucció: `esborra_node_arbreGen(m)`
Allibera la memòria recursivament en **post-ordre** (primer tots els fills i després el pare):

```cpp
static void esborra_node_arbreGen(node_arbreGen* m) {
    if (m != nullptr) {
        int ari = m->seg.size();
        for (int i = 0; i < ari; ++i) {
            esborra_node_arbreGen(m->seg[i]);
        }
        delete m;
    }
}
```

::algoviz{algorithm="arbgen_esborra"}

---

### 12.2.3 La Regla dels Tres
```cpp
// 1. Destructor
~ArbreGen() {
    esborra_node_arbreGen(primer_node);
}

// 2. Constructor de còpia
ArbreGen(const ArbreGen& a) {
    primer_node = copia_node_arbreGen(a.primer_node);
}

// 3. Operador d'assignació
ArbreGen& operator=(const ArbreGen& a) {
    if (this != &a) {
        esborra_node_arbreGen(primer_node);
        primer_node = copia_node_arbreGen(a.primer_node);
    }
    return *this;
}
```

---

## 12.3 Transferència de Propietat: `plantar`, `fills` i `afegir_fill`

### 12.3.1 Plantar: `plantar(x, v)`
Crea un node arrel amb valor `x` i "roba" els punters `primer_node` de cadascun dels arbres del vector `v`:

```cpp
void plantar(const T &x, vector<ArbreGen> &v) {
    node_arbreGen* aux = new node_arbreGen;
    aux->info = x;
    int ari = v.size();
    aux->seg = vector<node_arbreGen*>(ari);
    for (int i = 0; i < ari; ++i) {
        aux->seg[i] = v[i].primer_node;
        v[i].primer_node = nullptr; // Buida l'arbre original
    }
    primer_node = aux;
}
```

::algoviz{algorithm="arbgen_plantar"}

---

### 12.3.2 Fills: `fills(v)`
Transfereix tots els subarbres de l'arrel al vector `v` i allibera l'arrel amb `delete`:

```cpp
void fills(vector<ArbreGen> &v) {
    node_arbreGen* aux = primer_node;
    int ari = aux->seg.size();
    v = vector<ArbreGen>(ari);
    for (int i = 0; i < ari; ++i) {
        v[i].primer_node = aux->seg[i];
    }
    primer_node = nullptr;
    delete aux;
}
```

::algoviz{algorithm="arbgen_fills"}

---

### 12.3.3 Afegir fill: `afegir_fill(a)`
Permet fer créixer l'aritat de l'arrel afegint un nou subarbre al final del vector `seg`:

```cpp
void afegir_fill(ArbreGen &a) {
    if (primer_node != nullptr) {
        primer_node->seg.push_back(a.primer_node);
        a.primer_node = nullptr; // Transfereix la propietat
    }
}
```

---

## 12.4 Diferències clau respecte a l'Arbre Binari

1. **Sense In-ordre**: En un arbre general no hi ha cap posició "intermèdia" canònica. Només s'utilitzen recorreguts en **Pre-ordre**, **Post-ordre** o **Per nivells** (BFS).
2. **Grau/Aritat dinàmica**: Cada node pot tenir un nombre arbitrari de fills ($0, 1, 2, \dots, k$).
3. **Mètodes amb vectors**: `plantar` i `fills` reben i retornen un `vector<ArbreGen>` en lloc de dos paràmetres separats.

---

## 12.5 Resum de Complexitat

| Mètode | Complexitat temporal | Explicació |
| :--- | :---: | :--- |
| **`plantar(x, v)`** | $\mathcal{O}(k)$ | On $k = v.\text{size}()$ (bucle per transferir punters). |
| **`fills(v)`** | $\mathcal{O}(k)$ | On $k$ és el nombre de fills de l'arrel. |
| **`afegir_fill(a)`** | $\mathcal{O}(1)$ amortitzat | Inserció al final del vector `push_back`. |
| **`arrel()` / `nombre_fills()`** | $\mathcal{O}(1)$ | Accés directe a `info` o a `seg.size()`. |
| **Destructor / Còpia** | $\Theta(n)$ | Recorre i allibera/copia els $n$ nodes de l'arbre. |

