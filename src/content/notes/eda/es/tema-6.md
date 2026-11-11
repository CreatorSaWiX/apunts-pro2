---
title: "Tema 6: Búsqueda exhaustiva"
description: "Backtracking (vuelta atrás), generación de subconjuntos y permutaciones, desarreglos, n-reinas, poda por viabilidad y cotas (Branch & Bound), y transformación a tiempo polinómico."
readTime: "12 min"
order: 7
draft: false
---

## 6.1. Esquema canónico de backtracking

### La mecánica de la solución parcial y el puntero `idx`
Al construir soluciones de izquierda a derecha:
* `0 ... idx - 1`: **El pasado** (elementos ya decididos y fijados en la solución parcial).
* `idx`: **El presente** (la casilla concreta que estamos decidiendo en esta llamada recursiva).
* `idx ... n - 1`: **El futuro** (casillas pendientes de rellenar).
* **Caso base (`idx == n`):** El futuro está vacío $\implies$ solución completa encontrada.

### El ciclo choose – explore – un-choose
Todos los algoritmos de vuelta atrás comparten este ciclo:

```cpp
void backtrack(Estado& e, int paso) {
    if (es_solucion_completa(e, paso)) {
        procesar(e); // Caso base: hoja válida alcanzada
        return;
    }
    for (int c : candidatos_validos(e, paso)) {
        aplicar(e, c);            // 1. Choose
        backtrack(e, paso + 1);   // 2. Explore
        deshacer(e, c);           // 3. Un-choose (BACKTRACK)
    }
}
```

:::backtrackviz
:::

**¿Por qué es necesario deshacer el marcado (`Un-choose`)?**
Como las estructuras de estado se pasan por referencia (`&`) para evitar copiar memoria en cada paso ($\mathcal{O}(n)$), si no se deshace el cambio al volver de la recursión, las ramas posteriores encontrarán el estado contaminado.

### Firmas según el objetivo del problema

| Objetivo | Retorno | Caso base | Llamada recursiva |
| :--- | :---: | :---: | :--- |
| **Enumerar todas** | `void` | Imprimir / Guardar | `backtrack(...)` directo. |
| **Parada en la 1.ª solución** | `bool` | `return true;` | `if (backtrack(...)) return true;` (propagación inmediata). |
| **Contar soluciones** | `int` | `return 1;` | Acumulador: `total += backtrack(...)`. |
| **Optimización ($\min/\max$)** | `void` | `mejor = min(mejor, coste_act);` | Poda por cota antes de explorar. |

---

## 6.2. Generación de subconjuntos ($2^n$)

Cada elemento $e_i$ tiene dos opciones: **no cogerlo** ($s[i] = 0$) o **cogerlo** ($s[i] = 1$).

```cpp
void subconjuntos(vector<int>& s, int idx, int n) {
    if (idx == n) {
        procesar(s); // Vector binario de tamaño n completado
        return;
    }
    s[idx] = 0; subconjuntos(s, idx + 1, n); // Opción 0: descartar
    s[idx] = 1; subconjuntos(s, idx + 1, n); // Opción 1: incluir
}
```

:::subsetsviz
:::

**Biyección canónica (subconjuntos $\longleftrightarrow$ bits):**
Si un problema pide subconjuntos de objetos (ej: palabras o ciudades), **nunca creéis vectores auxiliares dinámicos de copia**. Trabajad exclusivamente con el vector de bits `0/1` de tamaño $n$. En la hoja, imprimid los elementos donde `s[i] == 1`.

### Poda sobre subconjuntos: exactamente $k$ unos
Se transmite la cantidad de `unos` acumulada para evitar bucles en el caso base, cortando las ramas inválidas antes de descender:

```cpp
void subconjuntos_k(vector<int>& s, int idx, int n, int k, int unos) {
    // Poda 1: Demasiados unos | Poda 2: Falta espacio (ni cogiendo todo lo que queda llegamos a k)
    if (unos > k || unos + (n - idx) < k) return;

    if (idx == n) { procesar(s); return; }

    s[idx] = 0; subconjuntos_k(s, idx + 1, n, k, unos);
    s[idx] = 1; subconjuntos_k(s, idx + 1, n, k, unos + 1);
}
```

:::subsetskviz
:::

---

## 6.3. Generación de permutaciones ($n!$) y desarreglos

### 1. Permutaciones canónicas
En cada posición `idx` podemos elegir cualquier elemento $k \in \{1 \dots n\}$ no usado previamente. Se mantiene un vector booleano `usado` de tamaño $n+1$ para consultar y marcar en $\mathbf{\Theta(1)}$:

```cpp
void permutaciones(vector<int>& sol, int idx, int n, vector<bool>& usado) {
    if (idx == n) { procesar(sol); return; }

    for (int k = 1; k <= n; ++k) {
        if (!usado[k]) {
            sol[idx] = k;
            usado[k] = true;                      // Choose
            permutaciones(sol, idx + 1, n, usado);// Explore
            usado[k] = false;                     // Un-choose
        }
    }
}
```

:::permutationsviz
:::

### 2. Desarreglos (*derangements*) — examen final 2024
Un **desarreglo** de tamaño $n$ es una permutación de $\{0 \dots n-1\}$ **sin puntos fijos** ($\pi(i) \neq i$ para todo $i$):

**Filtro de viabilidad:** Basta con añadir la condición `k != idx` al bucle de selección:

```cpp
for (int k = 0; k < n; ++k) {
    if (!usado[k] && k != idx) { // Condición de desarreglo: pi(idx) != idx
        sol[idx] = k;
        usado[k] = true;
        desarreglos(sol, idx + 1, n, usado);
        usado[k] = false;
    }
}
```

:::derangementsviz
:::

---

## 6.4. Problemas clásicos de examen final

### 1. El problema de las $n$-reinas (poda en $\Theta(1)$)
Colocar $n$ reinas en un tablero $n \times n$ sin que se amenacen (máximo 1 por fila, columna o diagonal).
* Representación: `t[i] = j` indica reina en la fila `i`, columna `j`.
* **Identificación de diagonales en $\Theta(1)$:**
  * Diagonal ascendente (↗): La suma de índices es constante: $i + j \in [0, 2n - 2]$ $\implies$ `md1[i + j]`.
  * Diagonal descendente (↘): La diferencia es constante: $i - j + (n - 1) \in [0, 2n - 2]$ $\implies$ `md2[i - j + n - 1]`.

```cpp
int reinas(int i, int n, vector<bool>& mc, vector<bool>& md1, vector<bool>& md2) {
    if (i == n) return 1; // n reinas colocadas con éxito
    int total = 0;
    for (int j = 0; j < n; ++j) {
        int d1 = i + j, d2 = i - j + n - 1;
        if (!mc[j] && !md1[d1] && !md2[d2]) {
            mc[j] = md1[d1] = md2[d2] = true;
            total += reinas(i + 1, n, mc, md1, md2);
            mc[j] = md1[d1] = md2[d2] = false;
        }
    }
    return total;
}
```

:::nqueensviz
:::

### 2. Navegación en cuadrículas 2D (sudoku y tableros)
Para recorrer matrices casilla a casilla con backtracking, se avanza horizontalmente y se cambia de fila al llegar al límite:

```cpp
void backtrack_2d(vector<vector<int>>& M, int i, int j, int n) {
    if (i == n) { procesar(M); return; }                   // Caso base: matriz llena
    if (j == n) { backtrack_2d(M, i + 1, 0, n); return; }   // Salto al inicio de la fila siguiente

    for (int v : candidatos_validos(M, i, j)) {
        M[i][j] = v;
        backtrack_2d(M, i, j + 1, n);
        M[i][j] = 0; // Deshacer casilla
    }
}
```

:::backtrack2dviz
:::

### 3. Ciclo hamiltoniano sobre grafo
Encontrar un ciclo que visite cada vértice exactamente una vez y regrese al origen:

```cpp
bool hamilton(const vector<vector<int>>& G, int u, int visitados, int n, vector<bool>& vis) {
    if (visitados == n) {
        for (int v : G[u]) if (v == 0) return true; // ¿Hay arista de vuelta al origen?
        return false;
    }
    for (int v : G[u]) {
        if (!vis[v]) {
            vis[v] = true;
            if (hamilton(G, v, visitados + 1, n, vis)) return true;
            vis[v] = false;
        }
    }
    return false;
}
```

:::hamiltonviz
:::

### 4. Mochila 0/1 y Branch & Bound (poda por cotas)
* **Poda 1 (Viabilidad):** Si `peso_act + p[k] > C`, no coger el objeto $k$.
* **Poda 2 (Cota optimista):** Sea `svr` la suma de valores de los objetos restantes ($k \dots n-1$). Si `val_act + svr <= mejor_valor`, descartar la rama entera:

```cpp
void mochila(int k, int n, int C, int peso_act, int val_act, int svr, int& mejor_val) {
    if (peso_act > C || val_act + svr <= mejor_val) return; // Poda 1 y Poda 2
    if (k == n) { mejor_val = max(mejor_val, val_act); return; }

    mochila(k + 1, n, C, peso_act, val_act, svr - v[k], mejor_val);                  // No coger k
    mochila(k + 1, n, C, peso_act + p[k], val_act + v[k], svr - v[k], mejor_val);  // Coger k
}
```

:::knapsackviz
:::

---

## 6.5. Backtracking vs solución polinómica

**Exámenes 2022 y 2026:**
A menudo se presenta un problema de ordenación con restricciones (ej: resultados de partidas de 3 jugadores donde $j_1$ va antes que $j_2$ y $j_2$ antes que $j_3$) y un código que prueba todas las permutaciones en $\mathbf{\mathcal{O}(n! \cdot m)}$.

**Pregunta:** *"¿Se puede resolver en tiempo polinómico?"*  **SÍ.**
* Se construye un **grafo dirigido** donde cada restricción "$u$ debe ir antes que $v$" es un arco $u \to v$.
* El problema de encontrar un orden consistente se reduce a encontrar una **ordenación topológica en tiempo lineal $\mathbf{\Theta(n + m)}$** mediante el algoritmo de Kahn.
* Si el grafo contiene ciclos, no existe ningún orden compatible.

### Resumen

La **búsqueda exhaustiva** explora sistemáticamente el espacio de estados de un problema cuando no existen algoritmos polinómicos directos (común en problemas **NP-completos** o de satisfacción de restricciones). La **vuelta atrás (*backtracking*)** construye soluciones paso a paso y **poda** (*prunes*) las ramas tan pronto incumplen las restricciones o no pueden mejorar el óptimo.

| Problema | Espacio bruto | Condición de poda / filtro | Coste temporal peor caso |
| :--- | :---: | :--- | :---: |
| **Subconjuntos / Cadenas de bits** | $2^n$ | Exceso de peso o falta de elementos restantes | $\Theta(2^n)$ |
| **Permutaciones de $\{1 \dots n\}$** | $n!$ | Elementos ya usados (`usado[k]` en $\Theta(1)$) | $\Theta(n! \cdot n)$ |
| **Desarreglos ($\pi(i) \neq i$)** | $n!$ | Elementos usados Y elementos en posición fija ($k \neq i$) | $\Theta(n! / e)$ |
| **$N$-Reinas ($n \times n$)** | $n^n$ | Marcado de columnas y diagonales en $\Theta(1)$ | $\mathcal{O}(c^n)$ ($c < n$) |
| **Mochila 0/1 / Herencia** | $2^n$ | Poda de capacidad + Cota optimista superior | $\mathcal{O}(2^n)$ |
| **Ciclo hamiltoniano / TSP** | $n!$ | Vértices visitados + Cota de coste $\ge \text{mejor}$ | $\mathcal{O}(n!)$ |


1. **Poda de viabilidad vs poda de cota (*bound*):** La de viabilidad detecta soluciones ilegales (ej: peso $> C$ o choque de reinas). La de cota descarta soluciones legales que nunca podrán igualar o superar la mejor solución ya guardada.
2. **Orden lexicográfico garantizado:** Explorar los candidatos del bucle en orden creciente (`for (int k = 1; k <= n; ++k)`) garantiza que las soluciones se imprimen en orden lexicográfico automáticamente por el funcionamiento en profundidad del DFS.
3. **Complejidad del backtracking puro:** Sin podas efectivas, generar subconjuntos cuesta siempre $\Theta(n \cdot 2^n)$ y permutaciones $\Theta(n \cdot n!)$ por el coste de copiar o imprimir la solución en las hojas.
4. **Cuándo NO vale la pena podar:** Si el enunciado pide generar *todas* las permutaciones sin restricciones, toda rama lleva a una solución válida; cualquier comprobación extra añade sobrecoste inútil.
