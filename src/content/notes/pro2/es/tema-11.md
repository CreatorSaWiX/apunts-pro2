---
title: "Tema 11: Implementación de árboles binarios"
description: "Implementación de árboles binarios con punteros"
readTime: "20 minutos"
order: 12
draft: false
isNew: true
---

## 11.1 Estructura interna: Nodos y Punteros

La representación interna de un árbol binario en PRO2 utiliza estructuras enlazadas donde cada nodo almacena un dato y dos punteros a sus hijos:

```cpp
template <typename T>
class Arbre {
private:
    struct node_arbre {
        T info;                 // Dato contenido en el nodo
        node_arbre *segE;       // Puntero al hijo izquierdo (nullptr si vacío)
        node_arbre *segD;       // Puntero al hijo derecho (nullptr si vacío)
    };
    node_arbre *primer_node;    // Puntero a la raíz (nullptr si el árbol está vacío)
};
```

### Visualización de la estructura en memoria

<div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 my-6 items-start">
<div>

**Nodo físico en memoria:**

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

**Árbol binario completo:**

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

## 11.2 El patrón de Recursividad Privada y la Regla de los Tres

Todas las operaciones que recorren el árbol se diseñan siguiendo el patrón de **método público** (sin parámetros de puntero) que llama a una **función privada/estática recursiva** sobre `node_arbre*`:

### 11.2.1 Copia profunda: `copia_node_arbre(m)`
Duplica todos los nodos recursivamente en pre-orden reservando nueva memoria:

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

### 11.2.2 Destrucción: `esborra_node_arbre(m)`
Libera la memoria recursivamente en **post-orden** (primero los subárboles y al final la raíz):

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

### 11.2.3 La Regla de los Tres
```cpp
// 1. Destructor
~Arbre() {
    esborra_node_arbre(primer_node);
}

// 2. Constructor de copia
Arbre(const Arbre& a) {
    primer_node = copia_node_arbre(a.primer_node);
}

// 3. Operador de asignación
Arbre& operator=(const Arbre& a) {
    if (this != &a) {
        esborra_node_arbre(primer_node);
        primer_node = copia_node_arbre(a.primer_node);
    }
    return *this;
}
```

---

## 11.3 Transferencia de punteros en $\mathcal{O}(1)$: `plantar` y `fills`

A diferencia de realizar copias profundas, `plantar` y `fills` funcionan en tiempo constante $\mathcal{O}(1)$ porque **transfieren la propiedad de los punteros** directamente:

### 11.3.1 Plantar: `plantar(x, a1, a2)`
Crea una nueva raíz con valor `x`, enlaza los subárboles de `a1` y `a2` y vacía los árboles originales:

```cpp
void plantar(const T &x, Arbre &a1, Arbre &a2) {
    if (this != &a1 && this != &a2) {
        if (&a1 == &a2) { // Evita ciclos si a1 y a2 son el mismo árbol
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

### 11.3.2 Hijos: `fills(fe, fd)`
Transfiere los subárboles izquierdo y derecho a `fe` y `fd`, y destruye el nodo raíz actual:

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

## 11.4 Tipos de recorridos

| Orden | Secuencia de visita | Aplicación típica en PRO2 |
| :--- | :--- | :--- |
| **Pre-orden** | Raíz $\rightarrow$ Izquierdo $\rightarrow$ Derecho | Duplicar/clonar el árbol (`copia_node_arbre`), serialización. |
| **In-orden** | Izquierdo $\rightarrow$ Raíz $\rightarrow$ Derecho | Listar elementos ordenados en un Árbol Binario de Búsqueda (BST). |
| **Post-orden** | Izquierdo $\rightarrow$ Derecho $\rightarrow$ Raíz | Destruir el árbol (`esborra_node_arbre`), calcular altura o tamaño. |
| **Por niveles** | Nivel a nivel de izquierda a derecha | Algoritmos BFS (requiere una `queue<node_arbre*>`). |

---

## 11.5 Resumen de Complejidad

| Método | Complejidad temporal | Explicación |
| :--- | :---: | :--- |
| **`plantar(x, a1, a2)`** | $\mathcal{O}(1)$ | Transferencia directa de punteros (sin copiar). |
| **`fills(fe, fd)`** | $\mathcal{O}(1)$ | Transferencia de punteros y `delete` de la raíz. |
| **`arrel()` / `es_buit()`** | $\mathcal{O}(1)$ | Acceso directo al campo de la raíz o comparación `nullptr`. |
| **Destructor / Copia** | $\Theta(n)$ | Visita y gestiona cada uno de los $n$ nodos del árbol. |
