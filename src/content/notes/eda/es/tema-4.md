---
title: "Tema 4: Colas con prioridad"
description: "TAD cola con prioridad, montículos binarios y ternarios, representación sobre vector, Heapsort in-place y construcción lineal Θ(n), y el problema de selección."
readTime: "12 min"
order: 5
draft: false
---

Una **cola con prioridad** almacena elementos con una prioridad asociada y permite extraer siempre el valor extremo (mínimo o máximo). Admite **elementos duplicados** y **no permite búsqueda por clave arbitraria**.

| Implementación | `añadir` | `quitar_min` | `minimo` | Memoria aux. | Visualización y comportamiento |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **Vector no ordenado** | $\Theta(1)$ | $\Theta(n)$ | $\Theta(n)$ | $\Theta(1)$ | :pqcompareviz{type="unordered"} |
| **Vector ordenado** | $\Theta(n)$ | $\Theta(1)$ | $\Theta(1)$ | $\Theta(1)$ | :pqcompareviz{type="sorted"} |
| **Árbol AVL / `std::set`** | $\Theta(\log n)$ | $\Theta(\log n)$ | $\Theta(1)$ | $\Theta(n)$ | :pqcompareviz{type="avl"} |
| **Montículo binario (*Heap*)** | $\mathbf{\Theta(\log n)}$ | $\mathbf{\Theta(\log n)}$ | $\mathbf{\Theta(1)}$ | $\mathbf{\Theta(1)}$ | :pqcompareviz{type="heap"} |

---

## 4.1. Preliminares de árboles: Topología y Cotas

* **Árbol binario perfecto:** Todos los niveles están completamente llenos.
  $$n = 2^{h+1} - 1 \text{ nodos}$$
* **Árbol binario completo:** Los niveles $0 \dots h-1$ están llenos y el último nivel ($h$) tiene las hojas agrupadas **lo más a la izquierda posible**.

### Cotas de nodos y altura logarítmica
En todo árbol binario completo de altura $h$:

$$
2^h \le n \le 2^{h+1} - 1 \implies h = \lfloor \log_2 n \rfloor \in \mathbf{\Theta(\log n)}
$$

* **Cota de hojas:** Exactamente $\lceil n/2 \rceil$ nodos son hojas (el 50% del árbol). Buscar en las hojas requiere escanear $\Theta(n)$ elementos.

:::treetopoviz
:::

---

## 4.2. Montículos Binarios (*Heaps*)

Estructura basada en un árbol binario completo que cumple la **propiedad de heap**:
* **Min-Heap:** Para todo nodo $i \neq \text{raíz}$, $\text{clave}(\text{padre}(i)) \le \text{clave}(i)$. La raíz contiene el mínimo global.

* **Max-Heap:** Para todo nodo $i \neq \text{raíz}$, $\text{clave}(\text{padre}(i)) \ge \text{clave}(i)$. La raíz contiene el máximo global.

:::minmaxheapviz{type="min"}
:::

### Representación sobre vector (Sin Punteros)

Los nodos se alojan por niveles de izquierda a derecha.

| Relación | Indexado a 1 (`t[1...n]`, estándar FIB) | Indexado a 0 (`t[0...n-1]`) |
| :--- | :---: | :---: |
| **Padre de $i$** | $\lfloor i / 2 \rfloor$ | $\lfloor (i - 1) / 2 \rfloor$ |
| **Hijo izquierdo de $i$** | $2i$ | $2i + 1$ |
| **Hijo derecho de $i$** | $2i + 1$ | $2i + 2$ |
| **¿Es hoja?** | $2i > n$ | $2i + 1 \ge n$ |

Indexar a 1 simplifica la aritmética de bits (`i >> 1`, `i << 1`) y evita sumas auxiliares.

### 1. Inserción (`flotar`)
Se añade el elemento al final del vector (posición $n+1$) y se hace subir intercambiándolo con su padre mientras sea menor:

```cpp
void flotar(vector<int>& t, int i) {
    while (i > 1 && t[i] < t[i / 2]) {
        swap(t[i], t[i / 2]);
        i /= 2;
    }
}
```
* **Coste:** $\mathcal{O}(h) = \mathbf{\Theta(\log n)}$.

:::surarviz
:::

### 2. Extracción del mínimo (`hundir`)
Se guarda la raíz (`t[1]`), se mueve el último elemento (`t[n]`) a la raíz, se decrementa $n$ y se hace descender intercambiándolo **siempre con el hijo menor**:

```cpp
void hundir(vector<int>& t, int n, int i) {
    int c = 2 * i; // Hijo izquierdo
    while (c <= n) {
        if (c + 1 <= n && t[c + 1] < t[c]) ++c; // c es el menor de los dos hijos
        if (t[i] <= t[c]) break;                // Invariante restablecido
        swap(t[i], t[c]);
        i = c;
        c = 2 * i;
    }
}
```
* **Coste:** $\mathcal{O}(h) = \mathbf{\Theta(\log n)}$.

Si no se intercambia con el hijo *menor*, el hijo mayor pasaría a ser padre del pequeño, violando la propiedad de min-heap.

:::enfonsarviz
:::

---

## 4.3. Montículos Ternarios (*Ternary Heaps*)

Árbol ternario completo donde cada nodo tiene como máximo **3 hijos** y cumple la propiedad de heap.

### Aritmética de índices sobre vector (Indexado a 0)

| Relación para el nodo $i$ | Expresión matemática |
| :--- | :---: |
| **Padre de $i$** | $\lfloor (i - 1) / 3 \rfloor$ |
| **Hijos de $i$** | $3i + 1, \quad 3i + 2, \quad 3i + 3$ |

:::ternaryheapviz
:::

### Fórmulas de nodos por altura $h$

* **Número máximo de nodos (árbol ternario perfecto de altura $h$):**
  $$
  N_{\max}(h) = \sum_{j=0}^h 3^j = \frac{3^{h+1} - 1}{2}
  $$
  *Demostración por inducción:* Para $h=0$, $\frac{3^1-1}{2} = 1$. Paso inductivo: $N_{\max}(h) = 1 + 3 \cdot N_{\max}(h-1) = 1 + 3\left(\frac{3^h-1}{2}\right) = \frac{2 + 3^{h+1} - 3}{2} = \frac{3^{h+1}-1}{2}$. $\blacksquare$

* **Número mínimo de nodos de altura $h$:**
  $$
  N_{\min}(h) = N_{\max}(h - 1) + 1 = \frac{3^h - 1}{2} + 1
  $$

* **Altura asintótica:** $h \in \mathbf{\Theta(\log_3 n)}$. Tiene menor altura que el binario, pero realiza hasta 3 comparaciones por nivel al `hundir`.

### Implementación de `hundir` para Min-Heap Ternario

```cpp
void hundir_ternario(vector<int>& t, int n, int i) {
    int c = 3 * i + 1; // Primer hijo
    while (c < n) {
        int menor = c;
        if (c + 1 < n && t[c + 1] < t[menor]) menor = c + 1;
        if (c + 2 < n && t[c + 2] < t[menor]) menor = c + 2;
        if (t[i] <= t[menor]) break;
        swap(t[i], t[menor]);
        i = menor;
        c = 3 * i + 1;
    }
}
```

---

## 4.4. Algoritmo de ordenación Heapsort

### 1. Construcción del Heap: Básica vs Método de Floyd

* **Construcción básica (Top-Down):** Insertar $n$ elementos sucesivos con `flotar`.
  $$T(n) = \sum_{i=1}^n \log i = \log(n!) = \mathbf{\Theta(n \log n)}$$
* **Construcción lineal de Floyd (Bottom-Up / *Heapify*):** Se disponen los elementos en el vector y se aplica `hundir` desde el último padre ($i = \lfloor n/2 \rfloor$) hasta la raíz ($i = 1$).
  $$T(n) = \mathbf{\Theta(n)}$$
  *Justificación:* La mayoría de los nodos están en los niveles inferiores (donde la altura para bajar es 0 o 1). Solo la raíz puede descender $h$ niveles.

:::heapbuildviz
:::

### 2. Heapsort *In-Place* (Memoria Auxiliar $\Theta(1)$)

Para ordenar un vector de menor a mayor (creciente) sin memoria adicional:
1. Se construye un **Max-Heap** lineal en $\Theta(n)$ sobre el propio vector.
2. Se repite para $i$ desde $n$ hasta 2:
   - Se intercambia la raíz (el máximo actual en `t[1]`) con `t[i]`.
   - Se reduce el tamaño del heap activo a $i - 1$.
   - Se aplica `hundir_max(t, i - 1, 1)`.

```cpp
void heapsort(vector<int>& t) {
    int n = t.size() - 1; // Asumiendo indexado a 1
    // 1. Heapify en O(n)
    for (int i = n / 2; i >= 1; --i) hundir_max(t, n, i);
    // 2. Extracciones sucesivas
    for (int i = n; i >= 2; --i) {
        swap(t[1], t[i]);
        hundir_max(t, i - 1, 1);
    }
}
```

:::heapsortviz
:::

| Propiedad | Valor |
| :--- | :---: |
| **Complejidad temporal (mejor, medio, peor)** | $\mathbf{\Theta(n \log n)}$ |
| **Memoria auxiliar** | $\mathbf{\Theta(1)}$ (*in-place*) |
| **Estabilidad** | **NO es estable** (los saltos de swap desordenan claves idénticas) |

---

## 4.5. Aplicación (Encontrar los $m$ menores de $n$ elementos)

| Método | Coste Temporal | Memoria Auxiliar | ¿Cuándo aplicarlo? |
| :--- | :---: | :---: | :--- |
| **MergeSort completo** | $\Theta(n \log n)$ | $\Theta(n)$ | Solo si es necesario ordenar todo el vector completo. |
| **Min-Heap de tamaño $n$** | $\mathbf{\Theta(n + m \log n)}$ | $\Theta(1)$ / $\Theta(n)$ | Excelente cuando $m \ll n$ (construcción lineal + $m$ pops). |
| **Max-Heap de tamaño $m$** | $\mathbf{\Theta(n \log m)}$ | $\mathbf{\Theta(m)}$ | **Óptimo para Streams / Datos Online:** no requiere cargar los $n$ elementos en RAM. |
| **QuickSelect (mediana)** | $\mathbf{\Theta(n)}$ (peor caso) | $\Theta(1)$ | Óptimo asintótico teórico para vectores en memoria. |

1. **¿Un vector ordenado creciente es un min-heap?** **SÍ.** Para todo $i$, $t[i] \le t[2i]$ y $t[i] \le t[2i+1]$.
2. **¿Dónde puede estar el máximo en un min-heap?** En **cualquiera de las hojas** (índices $\lfloor n/2 \rfloor + 1 \dots n$). Encontrarlo cuesta $\Theta(n)$.
3. **Montículos ternarios vs binarios:** El ternario tiene altura $\approx \log_3 n$ (menos niveles), pero en cada paso de `hundir` hace 3 comparaciones en lugar de 2. El coste asintótico sigue siendo $\Theta(\log n)$.
4. **Construcción de Floyd:** Aplica `hundir` desde $n/2$ hacia abajo. Hacerlo con `flotar` de 1 a $n$ costaría $\Theta(n \log n)$.

### C++ STL: `std::priority_queue`

```cpp
#include <queue>
#include <vector>

// 1. Max-Heap por defecto
priority_queue<int> max_pq;

// 2. Min-Heap
priority_queue<int, vector<int>, greater<int>> min_pq;

// 3. Construcción lineal en Theta(n) a partir de un vector
vector<int> v = {5, 2, 8, 1, 9};
priority_queue<int> pq_lineal(v.begin(), v.end());
```

* Operaciones: `.push(x)` ($\mathcal{O}(\log n)$), `.pop()` ($\mathcal{O}(\log n)$), `.top()` ($\Theta(1)$), `.empty()` ($\Theta(1)$), `.size()` ($\Theta(1)$).
* **Trampa habitual:** La STL **no soporta `decrease_key`**. Para actualizar prioridades (como en Dijkstra) es necesario reinsertar el par duplicado.

