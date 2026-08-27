---
title: "Tema 12: Implementación de árboles generales"
description: "Implementación de árboles generales con punteros y vectores de hijos"
readTime: "20 minutos"
order: 13
draft: false
isNew: true
---

## 12.1 Estructura interna: Nodos N-arios con `std::vector`

Un árbol general (o N-ario) no limita el número de hijos de cada nodo a dos. La estructura interna utiliza un vector dinámico de punteros `vector<node_arbreGen*> seg` para almacenar las direcciones de los hijos:

```cpp
template <typename T>
class ArbreGen {
private:
    struct node_arbreGen {
        T info;                         // Dato contenido en el nodo
        vector<node_arbreGen*> seg;     // Vector de punteros a los hijos
    };
    node_arbreGen* primer_node;         // Puntero a la raíz (nullptr si vacío)
};
```

### Visualización de la estructura en memoria

<div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 my-6 items-start">
<div>

**Nodo con vector de hijos en memoria:**

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

**Árbol general de grado variable:**

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

## 12.2 Recursividad sobre Vectores y la Regla de los Tres

La recursividad sobre árboles generales sustituye las dos llamadas fijas (`segE` y `segD`) por un bucle `for` que itera sobre el tamaño del vector `m->seg.size()`:

### 12.2.1 Copia profunda: `copia_node_arbreGen(m)`
Duplica todos los nodos recursivamente reservando el vector del tamaño exacto:

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

### 12.2.2 Destrucción: `esborra_node_arbreGen(m)`
Libera la memoria recursivamente en **post-orden** (primero todos los hijos y después el padre):

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

### 12.2.3 La Regla de los Tres
```cpp
// 1. Destructor
~ArbreGen() {
    esborra_node_arbreGen(primer_node);
}

// 2. Constructor de copia
ArbreGen(const ArbreGen& a) {
    primer_node = copia_node_arbreGen(a.primer_node);
}

// 3. Operador de asignación
ArbreGen& operator=(const ArbreGen& a) {
    if (this != &a) {
        esborra_node_arbreGen(primer_node);
        primer_node = copia_node_arbreGen(a.primer_node);
    }
    return *this;
}
```

---

## 12.3 Transferencia de Propiedad: `plantar`, `fills` y `afegir_fill`

### 12.3.1 Plantar: `plantar(x, v)`
Crea un nodo raíz con valor `x` y "roba" los punteros `primer_node` de cada uno de los árboles del vector `v`:

```cpp
void plantar(const T &x, vector<ArbreGen> &v) {
    node_arbreGen* aux = new node_arbreGen;
    aux->info = x;
    int ari = v.size();
    aux->seg = vector<node_arbreGen*>(ari);
    for (int i = 0; i < ari; ++i) {
        aux->seg[i] = v[i].primer_node;
        v[i].primer_node = nullptr; // Vacía el árbol original
    }
    primer_node = aux;
}
```

::algoviz{algorithm="arbgen_plantar"}

---

### 12.3.2 Hijos: `fills(v)`
Transfiere todos los subárboles de la raíz al vector `v` y libera la raíz con `delete`:

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

### 12.3.3 Añadir hijo: `afegir_fill(a)`
Permite hacer crecer la aridad de la raíz añadiendo un nuevo subárbol al final del vector `seg`:

```cpp
void afegir_fill(ArbreGen &a) {
    if (primer_node != nullptr) {
        primer_node->seg.push_back(a.primer_node);
        a.primer_node = nullptr; // Transfiere la propiedad
    }
}
```

---

## 12.4 Diferencias clave respecto al Árbol Binario

1. **Sin In-orden**: En un árbol general no hay ninguna posición "intermedia" canónica. Solo se utilizan recorridos en **Pre-orden**, **Post-orden** o **Por niveles** (BFS).
2. **Grado/Aridad dinámica**: Cada nodo puede tener un número arbitrario de hijos ($0, 1, 2, \dots, k$).
3. **Métodos con vectores**: `plantar` y `fills` reciben y devuelven un `vector<ArbreGen>` en lugar de dos parámetros separados.

---

## 12.5 Resumen de Complejidad

| Método | Complejidad temporal | Explicación |
| :--- | :---: | :--- |
| **`plantar(x, v)`** | $\mathcal{O}(k)$ | Donde $k = v.\text{size}()$ (bucle para transferir punteros). |
| **`fills(v)`** | $\mathcal{O}(k)$ | Donde $k$ es el número de hijos de la raíz. |
| **`afegir_fill(a)`** | $\mathcal{O}(1)$ amortizado | Inserción al final del vector `push_back`. |
| **`arrel()` / `nombre_fills()`** | $\mathcal{O}(1)$ | Acceso directo a `info` o a `seg.size()`. |
| **Destructor / Copia** | $\Theta(n)$ | Recorre y libera/copia los $n$ nodos del árbol. |
