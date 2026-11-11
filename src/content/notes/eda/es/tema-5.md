---
title: "Tema 5: Grafos"
description: "Definición y propiedades de grafos, representaciones en memoria, recorridos DFS y BFS, caminos mínimos (Dijkstra), ordenación topológica en DAGs, árboles de recubrimiento mínimo (Prim) y grafos implícitos."
readTime: "15 min"
order: 6
draft: false
---

## 5.1. Propiedades fundamentales y cotas

Un grafo $G = (V, E)$ está formado por un conjunto de $n = |V|$ **vértices** y $m = |E|$ **aristas**.

**Cota máxima de aristas:**
* No dirigido simple: $0 \le m \le \binom{n}{2} = \frac{n(n - 1)}{2} \implies \mathbf{m = \mathcal{O}(n^2)}$.
* Dirigido simple: $0 \le m \le n(n - 1) \implies \mathbf{m = \mathcal{O}(n^2)}$.
**Lema del apretón de manos:** $\sum_{u \in V} \deg(u) = 2m$.
* *Corolario:* El número de vértices de grado impar en un grafo no dirigido es siempre **par**.

**Conectividad:**
* Un grafo no dirigido conexo tiene como mínimo $n - 1$ aristas ($m = \Omega(n)$).
* En dígrafos: **Débilmente conexo** (el grafo no dirigido subyacente es conexo); **Fuertemente conexo (SCC)** (existe camino dirigido $u \rightsquigarrow v$ y $v \rightsquigarrow u$ para todo par).

**Árboles:** Un grafo es un árbol $\iff$ es conexo y tiene exactamente $n - 1$ aristas $\iff$ es acíclico y tiene $n - 1$ aristas.

Más detalles en [Resumen parcial teoría de grafos M1](./m1-G)

---

## 5.2. Representaciones en memoria: matriz vs listas de adyacencia

| Operación / Parámetro | Matriz de adyacencia (`vector<vector<bool>>`) | Listas de adyacencia (`vector<vector<int>>`) |
| :--- | :---: | :---: |
| **Espacio en memoria** | $\mathbf{\Theta(n^2)}$ | $\mathbf{\Theta(n + m)}$ |
| **Consultar si existe $\{u, v\}$** | $\mathbf{\Theta(1)}$ | $\mathcal{O}(\deg(u))$ |
| **Iterar sobre todos los vecinos de $u$** | $\Theta(n)$ | $\mathbf{\Theta(\deg(u))}$ |
| **Insertar / Borrar arista** | $\Theta(1)$ | $\mathcal{O}(\deg(u))$ |
| **Uso idóneo** | **Grafos muy densos** ($m \approx n^2$) | **Grafos dispersos** ($m \ll n^2$, estándar en EDA) |

:::graphrepviz
:::

* **Refactorización de examen:** Cambiar un bucle que busca vecinos sobre matriz ($\mathcal{O}(n^2)$) por listas de adyacencia reduce el coste a $\mathcal{O}(n + m)$.

---

## 5.3. Búsqueda en profundidad (DFS) y búsqueda en anchura (BFS)

### DFS (búsqueda en profundidad)
Explora recursivamente hasta llegar a un callejón sin salida y retrocede.

```cpp
void dfs(const vector<vector<int>>& G, int u, vector<bool>& vis) {
    vis[u] = true;
    for (int v : G[u]) {
        if (!vis[v]) dfs(G, v, vis);
    }
}
```

* **Coste:** $\mathbf{\Theta(n + m)}$. Espacio: $\Theta(n)$ por la pila de llamadas y `vis`.
* **Propiedad de examen:** En un **grafo no dirigido**, el DFS solo produce **aristas de árbol** y **aristas de retroceso** (*back edges*). Un grafo no dirigido contiene ciclos $\iff$ DFS encuentra una arista hacia un vértice ya visitado que no sea el padre directo.

:::dfsviz
:::

---

### BFS (búsqueda en anchura)
Explora por niveles concéntricos de distancia desde un origen $s$.

```cpp
vector<int> bfs(const vector<vector<int>>& G, int s) {
    int n = G.size();
    vector<int> dist(n, -1);
    queue<int> Q;

    dist[s] = 0;
    Q.push(s);

    while (!Q.empty()) {
        int u = Q.front();
        Q.pop();
        for (int v : G[u]) {
            if (dist[v] == -1) {
                dist[v] = dist[u] + 1; // ¡Marcado al encolar!
                Q.push(v);
            }
        }
    }
    return dist;
}
```

* **Coste:** $\mathbf{\Theta(n + m)}$. Espacio: $\Theta(n)$.
* **Principio fundamental:** BFS garantiza encontrar el **camino mínimo en número de aristas** (o pasos).
* **Regla de oro:** En BFS los nodos se marcan como visitados **al ENCOLAR**, nunca al desencolar (evita encolar duplicados).

:::bfsviz
:::

---

## 5.4. Algoritmo de Dijkstra (caminos mínimos con pesos $\ge 0$)

Calcula las distancias mínimas desde un origen $s$ en grafos con aristas ponderadas **no negativas** ($\omega(e) \ge 0$).

:::dijkstraviz
:::

```cpp
typedef pair<double, int> PII; // {distancia_acumulada, nodo}
typedef vector<vector<pair<int, double>>> GrafP;

void dijkstra(const GrafP& G, int s, vector<double>& dist) {
    int n = G.size();
    dist.assign(n, 1e18);
    vector<bool> S(n, false); // S[u] = true cuando la distancia es definitiva
    priority_queue<PII, vector<PII>, greater<PII>> pq; // Min-Heap

    dist[s] = 0;
    pq.push({0, s});

    while (!pq.empty()) {
        int u = pq.top().second;
        double d = pq.top().first;
        pq.pop();

        if (S[u]) continue; // Descarta copias obsoletas del heap
        S[u] = true;

        for (auto& arc : G[u]) {
            int v = arc.first;
            double w = arc.second;
            if (dist[v] > dist[u] + w) {
                dist[v] = dist[u] + w;
                pq.push({dist[v], v});
            }
        }
    }
}
```

* **Coste temporal con `std::priority_queue`:** $\mathbf{\mathcal{O}((n + m) \log n)}$.

### Preguntas clave de examen sobre Dijkstra

1. **¿Por qué es necesario el vector `S` (o `if (d > dist[u]) continue;`)?**
   Como `std::priority_queue` no tiene operación `decrease_key`, se permiten entradas duplicadas en la cola. Sin el vector `S`, un nodo se podría reprocesar múltiples veces, disparando el coste a **$\mathbf{\Omega(n^2)}$** en grafos con muchos caminos alternativos.
2. **¿Por qué falla si hay aristas con peso negativo?**
   Dijkstra es un algoritmo voraz: asume que al extraer $u$ del heap, su distancia ya no podrá mejorar jamás. Una arista negativa posterior podría ofrecer un atajo que redujese el coste de un nodo ya cerrado. *(Con pesos negativos es necesario utilizar Bellman-Ford en $\mathcal{O}(n \cdot m)$)*.
3. **Contar el número de caminos mínimos (Enero 2025):**
   Se mantiene un vector `ways(n, 0)` con `ways[s] = 1`:
   * Si `dist[u] + w < dist[v]`: nuevo mínimo estrictamente mejor $\implies$ `dist[v] = dist[u] + w; ways[v] = ways[u]; pq.push(...)`.
   * Si `dist[u] + w == dist[v]`: camino alternativo de idéntico coste mínimo $\implies$ `ways[v] += ways[u]`.

---

## 5.5. Ordenación topológica en dígrafos acíclicos (DAGs)

Una ordenación topológica es una permutación lineal de los vértices $(v_1, \dots, v_n)$ tal que para todo arco $(u, v) \in E$, $u$ aparece antes que $v$.

* **Teorema:** Un dígrafo admite ordenación topológica $\iff$ es un **DAG** (no tiene ciclos dirigidos).
* Todo DAG finito tiene al menos una fuente ($\deg^- = 0$) y un sumidero ($\deg^+ = 0$).

### Algoritmo de Kahn (fuentes y grados de entrada)

```cpp
vector<int> toposort(const vector<vector<int>>& G) {
    int n = G.size();
    vector<int> ge(n, 0);
    for (int u = 0; u < n; ++u)
        for (int v : G[u]) ++ge[v];

    queue<int> Q;
    for (int u = 0; u < n; ++u)
        if (ge[u] == 0) Q.push(u);

    vector<int> orden;
    while (!Q.empty()) {
        int u = Q.front();
        Q.pop();
        orden.push_back(u);
        for (int v : G[u]) {
            if (--ge[v] == 0) Q.push(v);
        }
    }

    if (orden.size() != n) return {}; // Si no contiene n nodos, ¡EL GRAFO TIENE CICLOS!
    return orden;
}
```

* **Coste:** $\mathbf{\Theta(n + m)}$. Espacio: $\Theta(n)$.
* **Detección de ciclos:** Si `orden.size() < n`, el grafo no es un DAG.

:::toposortviz
:::

---

## 5.6. Árboles de recubrimiento mínimo (MST): Prim vs Kruskal

Un **árbol de recubrimiento** conecta todos los vértices de un grafo no dirigido conexo utilizando exactamente **$n - 1$ aristas**. El **MST** es aquel que minimiza la suma de pesos de las aristas.

* **Unicidad:** Si todos los pesos de las aristas son **estrictamente distintos**, el MST es **ÚNICO**.

| Criterio | Algoritmo de Prim | Algoritmo de Kruskal |
| :--- | :--- | :--- |
| **Estrategia** | Crecimiento de un **único árbol local continuo** desde un vértice inicial. | Fusión de un **bosque global** de árboles independientes. |
| **Estructura clave** | `priority_queue` de aristas que cruzan el corte actual. | Ordenación de aristas + **Union-Find / DSU** (evitar ciclos). |
| **Coste temporal** | $\mathbf{\mathcal{O}(m \log n)}$ | $\mathbf{\mathcal{O}(m \log m) = \mathcal{O}(m \log n)}$ |
| **Idóneo para** | **Grafos densos** ($m \approx n^2$). | **Grafos dispersos** ($m \ll n^2$). |

:::mstviz
:::

---

## 5.7. Grafos implícitos: cuadrículas y espacios de estados

En muchos problemas de examen final no proporcionan listas de adyacencia; el grafo es implícito:

### 1. Cuadrículas 2D ($R \times C$)
Las casillas transitables son nodos y los movimientos permitidos son aristas:

```cpp
const int di[] = {-1, 1, 0, 0};
const int dj[] = {0, 0, -1, 1};

// Dentro del bucle de BFS sobre cuadrícula:
for (int k = 0; k < 4; ++k) {
    int ni = r + di[k], nj = c + dj[k];
    if (ni >= 0 && ni < R && nj >= 0 && nj < C && mapa[ni][nj] != '#' && dist[ni][nj] == -1) {
        dist[ni][nj] = dist[r][c] + 1;
        Q.push({ni, nj});
    }
}
```

:::gridbfsviz
:::

### 2. Espacios de estados abstractos (ej: problema de las jarras, enero 2024)
* **Vértices:** Pares de estados $(a, b)$ con el agua actual en cada jarra ($0 \le a \le A$, $0 \le b \le B$).
* **Aristas:** Operaciones posibles (llenar $A$, vaciar $B$, trasvasar $A \to B$, etc.).
* **Resolución:** Como cada operación cuenta como 1 paso, el número mínimo de pasos se resuelve **siempre con BFS**, nunca con Dijkstra ni DFS. Coste: $\mathcal{O}(\text{número de estados}) = \mathcal{O}(A \cdot B)$.

:::jugsviz
:::

---

## 5.8. Resumen

1. **¿Por qué Dijkstra en un grafo no ponderado es una mala opción?**
   Porque cuesta $\mathcal{O}((n + m) \log n)$ debido al heap, mientras que un simple BFS resuelve caminos mínimos en $\Theta(n + m)$.
2. **¿Qué detecta ciclos más rápido en un DAG?**
   El algoritmo de Kahn en $\Theta(n + m)$ (si quedan nodos por procesar con `ge > 0`) o un DFS con comprobación de aristas de retroceso hacia nodos activos en la pila.
3. **Dijkstra con matriz de adyacencia:** En grafos extremadamente densos ($m = \Theta(n^2)$), usar un vector simple en lugar de un heap alcanza $\Theta(n^2)$, lo cual es mejor que $\mathcal{O}(n^2 \log n)$.
4. **Caminos Eulerianos vs Hamiltonianos:**
   - Euleriano (visita cada **arista** 1 vez): computable en tiempo polinómico $\Theta(m) \in \mathbf{P}$.
   - Hamiltoniano (visita cada **vértice** 1 vez): problema **NP-completo**.

| Algoritmo | Tipo de grafo | Pesos | Problema que resuelve | Estructura clave | Coste temporal | Memoria aux. |
| :--- | :--- | :--- | :--- | :--- | :---: | :---: |
| **DFS** | Dirigido / No dirigido | Irrelevante | Conectividad, ciclos, componentes | Pila / Recursión | $\mathbf{\Theta(n + m)}$ | $\Theta(n)$ |
| **BFS** | Dirigido / No dirigido | Sin pesos / constantes | Camino mínimo en aristas / pasos | Cola FIFO (`queue`) | $\mathbf{\Theta(n + m)}$ | $\Theta(n)$ |
| **Dijkstra** | Dirigido / No dirigido | **No negativos** ($\omega \ge 0$) | Camino mínimo ponderado desde un origen | Min-Heap (`priority_queue`) | $\mathbf{\mathcal{O}((n + m) \log n)}$ | $\Theta(n + m)$ |
| **Kahn (TopoSort)**| Dígrafo acíclico (**DAG**)| Irrelevante | Ordenación topológica y dependencias | Vector grados entrada + Cola/Pila | $\mathbf{\Theta(n + m)}$ | $\Theta(n)$ |
| **Prim (MST)** | No dirigido conexo | Ponderado | Árbol de recubrimiento de coste mínimo | Min-Heap de aristas del corte | $\mathbf{\mathcal{O}(m \log n)}$ | $\Theta(n + m)$ |

