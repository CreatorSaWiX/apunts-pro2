---
title: "Final EDA"
description: "Guía completa 100% enfocada al examen final de EDA: Temas 1–7, patrones reales de examen, demostraciones modelo, código C++ y lógica P vs NP."
readTime: "35 min"
order: 99
draft: false
---

## 1. Análisis de algoritmos

- **$\mathcal{O}(g)$** (cota superior): $f(n) \le c \cdot g(n)$  *(crece como mucho como $g$)*
- **$\Omega(g)$** (cota inferior): $f(n) \ge c \cdot g(n)$  *(crece al menos como $g$)*
- **$\Theta(g)$** (ajustada): $c_1 \cdot g(n) \le f(n) \le c_2 \cdot g(n) \iff f \in \mathcal{O}(g) \land f \in \Omega(g)$

:::asymptoticviz
:::

Permite determinar la relación asintótica entre dos funciones positivas $f(n)$ y $g(n)$ calculando el límite de su cociente cuando $n \to \infty$:

$$
L = \lim_{n \to \infty} \frac{f(n)}{g(n)}
$$

| Valor de $L$ | Relación | Conclusión |
| :--- | :--- | :--- |
| **$L = 0$** | $f < g$ | $f \in \mathcal{O}(g)$, $f \notin \Omega(g)$, $f \notin \Theta(g)$ |
| **$0 < L < \infty$** | $f \approx g$ | $f \in \Theta(g)$ (y por tanto $f \in \mathcal{O}(g)$ y $f \in \Omega(g)$) |
| **$L = \infty$** | $f > g$ | $f \in \Omega(g)$, $f \notin \mathcal{O}(g)$, $f \notin \Theta(g)$ |
| **No existe** | Oscila | Aplicar directamente la definición con $c$ y $n_0$. |

### Formulario de simplificación para límites y comparaciones

:::growthviz
:::

### Propiedades de logaritmos y neperianos ($\log_b, \ln$)
| Propiedad | Formulación matemática | Ejemplo |
| :--- | :--- | :--- |
| **Producto a suma** | $\log_b(x \cdot y) = \log_b x + \log_b y$ | $\log(2n) = \log 2 + \log n \implies \Theta(\log n)$|
| **Cociente a resta** | $\log_b(x / y) = \log_b x - \log_b y$ | $\log(n / 2) = \log n - \log 2 \implies \Theta(\log n)$ |
| **Potencia a producto** | $\log_b(x^k) = k \cdot \log_b x$ | $\log(n^3) = 3 \log n \implies \Theta(\log n)$. <br>$\log(n^2) = 2\log n \neq (\log n)^2$ |
| **Neperiano ($\ln$) y $e$** | $\ln x = \log_e x \quad (e \approx 2.718)$ | $\ln(e^x) = x, \quad e^{\ln x} = x$ |
| **Cambio de base** | $\log_b x = \frac{\log_a x}{\log_a b} = \frac{\ln x}{\ln b}$ | $\log_2 n = \frac{\ln n}{\ln 2} \implies \Theta(\log_a n) = \Theta(\log_b n)$ |
| **Logaritmos anidados** | $\log(\log(n^k)) = \log(k \log n) = \log k + \log(\log n)$ | $\log(\log(n^2)) = \log 2 + \log(\log n) \implies \Theta(\log(\log n))$ |
| **Stirling (Factorial)** | $\log(n!) = \sum_{i=1}^n \log i = \Theta(n \log n)$ | Útil para cotas inferiores de ordenación y límites con $n!$ |

> **Cuidado con la base en el exponente:** La base del logaritmo **sí cambia el orden** si está en el exponente:  
> $2^{\log_2 n} = n$, pero $2^{\log_3 n} = n^{\log_3 2} \approx n^{0.631} \implies 2^{\log_2 n} \gg 2^{\log_3 n}$.

### Propiedades de potencias, exponenciales ($a^n, e^n$) y raíces
| Propiedad | Formulación | Ejemplo |
| :--- | :--- | :--- |
| **Suma en el exponente** | $a^{x + y} = a^x \cdot a^y$ | $2^{n + 3} = 2^3 \cdot 2^n = 8 \cdot 2^n \implies \mathbf{\Theta(2^n)}$  |
| **Producto en el exponente** | $a^{k \cdot n} = (a^k)^n$ | $2^{2n} = (2^2)^n = 4^n \implies \mathbf{4^n \gg 2^n}$ |
| **Resta de exponentes (cociente)** | $\frac{a^n}{b^n} = \left(\frac{a}{b}\right)^n$ | $\frac{2^n}{3^n} = (2/3)^n \xrightarrow{n\to\infty} 0 \quad (b > a \implies a^n \ll b^n)$ |
| **Raíces como potencias** | $\sqrt[k]{n^p} = n^{p/k}$ | $\sqrt{n} = n^{1/2}, \quad \sqrt[3]{n^2} = n^{2/3}, \quad \sqrt{n^3 + 1} \in \Theta(n^{3/2})$ |
| **Pasar a base $e$** | $a^x = e^{x \ln a}$ | $2^n = e^{n \ln 2}, \quad n^n = e^{n \ln n}$ |
| **Identidad de intercambio clave** | $\mathbf{a^{\log_b n} = n^{\log_b a}}$ | $4^{\log_2 n} = n^{\log_2 4} = n^2 \quad \vert \quad 3^{\log_2 n} = n^{\log_2 3} \approx n^{1.585}$ |

### Operaciones elementales y paso de parámetros

| Concepto / Operación | Coste | Justificación / Regla |
| :--- | :---: | :--- |
| **Operaciones primitivas y E/S simple** | $\Theta(1)$ | Asignaciones primitivas, operadores aritméticos/lógicos/relacionales y `cin`/`cout` simple. |
| **Acceso indexado `v[i]`** | $\Theta(1)$ | Aritmética de punteros sobre memoria contigua ($\text{dirección} = \text{inicio} + i \cdot \text{tamaño}$). |
| **Paso por referencia (`&`, `const &`)** | $\Theta(1)$ | Se transmite la dirección de memoria (puntero), sin duplicar datos. |
| **Paso por valor (`vector<T>` de tamaño $n$)** | $\Theta(n)$ | Clona los $n$ elementos reservando memoria en el *heap*. |


**Ordenación por selección (Selection Sort)**
:::selectionsortviz
:::

**Ordenación por inserción (Insertion Sort)**
:::insertionsortviz
:::

---

### Teorema maestro de recurrencias sustractivas
Aplica a recurrencias donde cada llamada reduce el tamaño de la entrada en una cantidad constante $c \ge 1$:

$$
C(n) = \begin{cases} \Theta(1), & \text{si } n < n_0 \\ a \cdot C(n - c) + g(n), & \text{si } n \ge n_0 \end{cases} \qquad C(n) \in \begin{cases} 
\Theta(n^k), & \text{si } a < 1 \\ 
\Theta(n^{k+1}), & \text{si } a = 1 \\ 
\Theta(a^{n/c}), & \text{si } a > 1 
\end{cases}
$$

| Recurrencia | Parámetros | Caso | Complejidad | Algoritmo |
| :--- | :--- | :---: | :---: | :--- |
| $C(n) = C(n-1) + \Theta(1)$ | $a=1, k=0, c=1$ | $a = 1$ | $\Theta(n)$ | Búsqueda lineal recursiva |
| $C(n) = C(n-1) + \Theta(n)$ | $a=1, k=1, c=1$ | $a = 1$ | $\Theta(n^2)$ | Selection / Insertion sort recursivo |
| $C(n) = 2C(n-1) + \Theta(1)$ | $a=2, k=0, c=1$ | $a > 1$ | $\Theta(2^n)$ | Torres de Hanói |

---

### Teorema maestro de recurrencias divisoras

$$
C(n) = \begin{cases} \Theta(1), & \text{si } n < n_0 \\ a \cdot C(n/b) + g(n), & \text{si } n \ge n_0 \end{cases} \qquad C(n) \in \begin{cases} 
\Theta(n^k), & \text{si } \alpha < k \iff a < b^k \\ 
\Theta(n^k \log n), & \text{si } \alpha = k \iff a = b^k \\ 
\Theta(n^\alpha) = \Theta(n^{\log_b a}), & \text{si } \alpha > k \iff a > b^k 
\end{cases}
$$

| Algoritmo | Recurrencia | Parámetros | Relación | Complejidad |
| :--- | :--- | :--- | :--- | :---: |
| **Búsqueda binaria** | $C(n) = C(n/2) + \Theta(1)$ | $a=1, b=2, k=0$ | $\alpha = 0 = k$ | $\Theta(\log n)$ |
| **Mergesort** | $C(n) = 2C(n/2) + \Theta(n)$ | $a=2, b=2, k=1$ | $\alpha = 1 = k$ | $\Theta(n \log n)$ |
| **Karatsuba** | $C(n) = 3C(n/2) + \Theta(n)$ | $a=3, b=2, k=1$ | $\alpha = \log_2 3 \approx 1.585 > k$ | $\Theta(n^{1.585})$ |
| **Strassen** | $C(n) = 7C(n/2) + \Theta(n^2)$ | $a=7, b=2, k=2$ | $\alpha = \log_2 7 \approx 2.807 > k$ | $\Theta(n^{2.807})$ |

### Patrones de Problema 1 en el Final

| Patrón en el código / pregunta | Cómo se analiza al momento | Coste / Solución | Exámenes reales |
| :--- | :--- | :---: | :--- |
| **Suma triangular (`s += i; ++i;` hasta `s > n`)** | Tras $k$ vueltas, $s = \frac{k(k+1)}{2}$ (o $s = k(k+1)$ con `2*u`). | **$\Theta(\sqrt{n})$** | Final 2024 T, Final 2026 P |
| **Doblemente acumulado (`x *= 2; y *= x;` hasta `y > n`)** | Tras $k$ vueltas, $y = 2^{1+2+\dots+k} = 2^{k(k+1)/2} > n \implies k^2 \approx \log n$. | **$\Theta(\sqrt{\log n})$** | 10/06/2024 P1(c) |
| **Recursión sobre bits (`f(x/2)`)** | Si $x$ tiene $n = \lfloor\log_2 x\rfloor+1$ bits, `x/2` tiene $n-1$: $C(n) = C(n-1)+\Theta(1)$. | **$\Theta(n)$** (en bits) | Final 2022 T (ene. 2023) |
| **Subcadenas (`s.substr(i, k)`)** | `substr` cuesta $\Theta(k)$, ¡no $\Theta(1)$! Bucle doble $(i,j)$ suma $\sum_{i=0}^{n-1} (n-i)^2$. | **$\Theta(n^3)$** | Final 2021 T (ene. 2022) |
| **Comparar $4^n$, $2^{2n}$ y $2^{n^2}$** | $2^{2n} = (2^2)^n = 4^n$; $\lim \frac{2^{n^2}}{2^{2n}} = \lim 2^{n(n-2)} = \infty$. | **$4^n = 2^{2n} \ll 2^{n^2}$** | Final 2026 P P1(c) |

* **Recurrencias con parámetro ($a, b, k$):** compara siempre $\alpha = \log_b a$ con $k$ sin perder los logs:
  * Ej. Final 2023 T (08/01/2024): $T(n) = aT(n/4) + \Theta(n^2) \implies \Theta(n^2)$ si $a < 16$; $\Theta(n^2\log n)$ si $a = 16$; $\Theta(n^{\log_4 a})$ si $a > 16$.
  * Ej. Final 2026 P (09/06/2026): para que $T(n) = 9T(n/b) + \Theta(n)$ iguale a $S(n) = S(n-2) + \Theta(n) \in \Theta(n^2)$, hace falta $\alpha > k=1$ (evitar $\log n$) con $\log_b 9 = 2 \implies \mathbf{b = 3}$.
* **Ranking rápido de 10 funciones (Final 2025 T / 14/01/2026 P1(c)):**
  $$2^{\log_2 n} = n \;\ll\; n\log n = n\log(n^2) \;\ll\; n^2\log n \;\ll\; 2^{n/2} \;\ll\; 2^{n-10} = 2^n \;\ll\; 3^n \;\ll\; n! \;\ll\; n^n$$
* **Cotas estructurales obligatorias (Final 2025 T P1(a)):** grafo conexo $\implies \Omega(n)$ aristas; ABB de $n$ nodos $\implies$ altura $\Omega(\log n)$ (y $\mathcal{O}(n)$); *min-heap* de $n$ nodos $\implies \Theta(n)$ hojas.

## 2. Divide y vencerás

El coste total de un algoritmo de divide y vencerás proviene exclusivamente de tres fuentes:

$$
T(n) = \underbrace{T_{\text{división}}(n)}_{\text{partir}} + \underbrace{a \cdot T(n/b)}_{\text{llamadas recursivas}} + \underbrace{T_{\text{combinar}}(n)}_{\text{fusión/ensamblaje}}
$$

Donde el trabajo no recursivo $g(n) = T_{\text{división}}(n) + T_{\text{combinar}}(n)$ pertenece típicamente a $\Theta(n^k)$ para $k \ge 0$, pudiendo resolverse mediante el **Teorema Maestro de recurrencias divisoras**.

:::dncviz
:::

| Algoritmo | Problema computacional | Ecuación de recurrencia $T(n)$ | Complejidad temporal |
| :--- | :--- | :--- | :---: |
| **Búsqueda binaria** | Búsqueda en vector ordenado | $T(n) = T(n/2) + \Theta(1)$ | $\Theta(\log n)$ |
| **Exponenciación rápida** | Cálculo de $x^n$ | $T(n) = T(n/2) + \Theta(1)$ | $\Theta(\log n)$ |
| **MergeSort** | Ordenación estable | $T(n) = 2T(n/2) + \Theta(n)$ | $\Theta(n \log n)$ |
| **QuickSort (caso mejor/medio)** | Ordenación *in-place* | $T(n) = 2T(n/2) + \Theta(n)$ | $\Theta(n \log n)$ |
| **QuickSort (caso peor)** | Ordenación *in-place* | $T(n) = T(n-1) + \Theta(n)$ | $\Theta(n^2)$ |
| **Karatsuba** | Producto de dos enteros de $n$ bits | $T(n) = 3T(n/2) + \Theta(n)$ | $\mathbf{\Theta(n^{\log_2 3}) \approx \Theta(n^{1.585})}$ |
| **Strassen** | Producto de matrices $n \times n$ | $T(n) = 7T(n/2) + \Theta(n^2)$ | $\mathbf{\Theta(n^{\log_2 7}) \approx \Theta(n^{2.807})}$ |
| **Torres de Hanói** | Traslado de $n$ discos | $T(n) = 2T(n-1) + \Theta(1)$ | $\mathbf{\Theta(2^n)}$ (exacto: $2^n - 1$) |
| **QuickSelect (caso medio)** | Selección del $k$-ésimo elemento | $T(n) = T(n/2) + \Theta(n)$ | $\Theta(n)$ |
| **QuickSelect (caso peor)** | Selección del $k$-ésimo elemento | $T(n) = T(n-1) + \Theta(n)$ | $\Theta(n^2)$ |
| **Mediana de Medianas (BFPRT)** | Selección del $k$-ésimo (caso peor) | $T(n) = T(n/5) + T(3n/4) + \Theta(n)$ | $\mathbf{\Theta(n)}$ |

### Búsqueda binaria $\Theta(\log n)$
:::binarysearchviz
:::

:::oopviz{simulation="binary_search"}
:::

<!-- 
El parámetro de recursión es $n = j - i + 1$. En cada nivel se realiza solo **una** llamada recursiva ($a = 1$) sobre un subvector de tamaño mitad ($b = 2$), y el trabajo no recursivo (cálculo del medio y comparaciones) es constante ($g(n) \in \Theta(1) \implies k = 0$).

$$ 
T(n) = T(n/2) + \Theta(1) 
$$

Por el Teorema Maestro divisor: $\alpha = \log_b a = \log_2 1 = 0$. Como $\alpha = k = 0$, tenemos:

$$ 
\mathbf{T(n) \in \Theta(n^0 \log n) = \Theta(\log n)} 
$$ -->

### MergeSort $\Theta(n \log n)$

:::mergerecviz
:::

:::mergeviz
:::

:::oopviz{simulation="mergesort"}
:::

---

### MergeSort híbrido con talla

:::hybridmergeviz
:::

```cpp
const int tamano_critico = 50;
if (d - e < tamano_critico) ordena_insercion(T, e, d);
else {
    int m = (e + d) / 2;
    mergesort(T, e, m);
    mergesort(T, m + 1, d);
    merge(T, e, m, d);
}
```

### MergeSort iterativo con cola

:::mergequeueviz
:::

```text
function mergesort_queue(a[1...n]):
    Q = cola vacía
    para cada elemento x de a:
        encola(Q, [x])
    mientras tamaño(Q) > 1:
        encola(Q, merge(desencola(Q), desencola(Q)))
    devuelve desencola(Q)
```

### MergeSort sobre vector

:::mergebottomupviz
:::

```cpp
template <typename elem>
void mergesort_bottom_up(vector<elem>& T) {
    int n = T.size();
    for (int m = 1; m < n; m *= 2) {
        for (int i = 0; i < n - m; i += 2 * m) {
            merge(T, i, i + m - 1, min(i + 2 * m - 1, n - 1));
        }
    }
}
```

---

### Ordenación rápida $\Theta(n \log n)$ con peor caso $\Theta(n^2)$

:::quicksortviz
:::

### Partición de Hoare
:::hoarepartviz
:::

:::oopviz{simulation="quicksort"}
:::

### Estrategias de elección del pivote

Código para la estrategia de la mediana de tres:
```cpp
int centro = (e + d) / 2;
if (T[e] < T[centro]) swap(T[centro], T[e]);
if (T[d] < T[centro]) swap(T[centro], T[d]);
if (T[d] < T[e]) swap(T[e], T[d]);
// La mediana queda situada en T[e]
```

---

### Exponenciación rápida $\mathbf{T(n) \in \Theta(\log n)}$

:::fastpowerviz
:::

:::oopviz{simulation="fast_power"}
:::

### Algoritmo de Karatsuba $\Theta(n^{1.585})$

:::karatsubaviz
:::

### Algoritmo de Strassen $\Theta(n^{2.807})$

:::strassenmatmultviz
:::

### Las torres de Hanói

:::hanoiviz
:::

```cpp
void hanoi(int n, char a, char b, char c) {
    if (n > 0) {
        hanoi(n - 1, a, c, b); // Mover n-1 discos de origen (a) a auxiliar (b) usando destino (c)
        cout << a << " -> " << c << "\n"; // Movimiento elemental del disco más grande
        hanoi(n - 1, b, a, c); // Mover n-1 discos de auxiliar (b) a destino (c) usando origen (a)
    }
}
```

### La mediana de medianas

:::medianviz
:::

:::bfprtviz
:::

### Trucos de D&C y Selección en el Final
* **Llamada degenerada en uno de los extremos (Final 2023 P / 12/06/2023 P1(a)):** `f(v, e, e) + f(v, e, (e+d)/2)` solo hace **1** llamada recursiva real de tamaño $n/2$ (la otra es $\Theta(1)$) $\implies T(n) = T(n/2) + \Theta(1) \implies \Theta(\log n)$. Si parte en dos mitades reales $\implies 2T(n/2)+\Theta(1) \implies \Theta(n)$.
* **Reducción de un vector a la mitad + búsqueda lineal (`majority_pairs`, Final 2020 T P1(b) / 2022 T P1(b)):** si cada nivel reduce el vector a tamaño $\le n/2$ y después recorre el vector actual ($n$), la recurrencia es $T(n) = T(n/2) + \Theta(n) \implies \mathbf{\Theta(n)}$ (porque $\alpha = 0 < k = 1$).
* **Encontrar los $m = n/2$ elementos menores en $\Theta(n)$ garantizado (Final 2025 P / 04/06/2025 P2):** usa **Mediana de Medianas (BFPRT)** para hallar la mediana $x$ en $\Theta(n)$ caso peor, y filtra en una pasada los elementos $\le x$ en $\Theta(n)$ (supera a `sort` $\Theta(n\log n)$ y selección repetida $\Omega(n^2)$).

## 3. Diccionarios

Un diccionario almacena parejas **(clave, valor)** ($k \in K$, $i \in I$) y permite gestionarlas eficientemente:

:::dictviz
:::


### Tablas de dispersión (*hash tables*)

Las **tablas de dispersión** logran búsqueda, inserción y borrado en **tiempo constante esperado $\Theta(1)$**, a cambio de un caso peor $\Theta(n)$ (cuando todo colisiona).

**La función de dispersión (*Hash function*)**

$$
\text{posición} = h(\text{clave}) \quad (\text{entre } 0 \text{ y } m-1)
$$

El elemento se guarda en la casilla `T[h(clave)]`.

:::hashviz
:::

**Colisiones**

Como tenemos infinitas claves posibles pero la tabla tiene un número limitado de casillas, es inevitable que tarde o temprano **dos claves distintas acaben dando el mismo índice** ($h(k_1) = h(k_2)$).

:::collisionviz
:::

Para solucionar colisiones, cada casilla $T[j]$ es una **lista enlazada** de todos los elementos con $h(k) = j$.

:::chainingviz
:::

---

### Árboles binarios de búsqueda (ABB / BST)

Un **ABB** implementa el diccionario aprovechando un **orden total** sobre las claves.

:::abcviz
:::

:::oopviz{simulation="diccionari_abc"}
:::

**Árboles AVL:**

Un **árbol AVL** es un ABB donde, **para cada nodo**, la diferencia de alturas entre sus dos subárboles es como máximo 1:

$$
|\text{altura}(\text{hizq}) - \text{altura}(\text{hder})| \le 1
$$

:::oopviz{simulation="diccionari_avl"}
:::

Cuando una inserción o un borrado provoca un desequilibrio ($\text{diferencia} = \pm 2$), se aplica una **rotación local en tiempo constante $\Theta(1)$** para restaurar el equilibrio sin romper el orden del ABB:

:::avlrotviz
:::

**Ejemplo inserción (Parcial primavera 2021 - Ejercicio 1(d)):** Escribid el árbol AVL resultante de añadir el elemento con clave **11** al árbol AVL siguiente:

:::avlinsertviz
:::

**Ejemplo eliminación:** Escribid el árbol AVL resultante de eliminar el elemento con clave **15** del árbol AVL siguiente:

:::avldeleteviz
:::

### Resumen rápido de Hash y AVL para el Final
* **`map` (AVL) vs `unordered_map` (Hash) vs vector contador (Finales 2020 T P1(a), 2023 T P2):**
  * $n$ consultas/inserciones en `map`: $\sum_{i=1}^{n-1}\log i = \Theta(n \log n)$ en caso peor.
  * En `unordered_map` ($\alpha = n/m$): coste medio $\Theta(1+\alpha)$, por tanto $\Theta(n)$ en caso medio si $m = \Theta(n)$ (peor caso $\Theta(n^2)$).
  * Si las claves son naturales acotados ($< 100$): vector de frecuencias da **$\Theta(n)$ garantizado en caso peor**.
* **Rotaciones AVL de un vistazo:** **LL** $\to$ simple derecha; **RR** $\to$ simple izquierda; **LR** $\to$ izquierda al hijo + derecha a la raíz; **RL** $\to$ derecha al hijo + izquierda a la raíz.

### Patrones de ABB / BST en el Final (Problema 2)

| Técnica sobre ABB | Idea / Invariante | Complejidad | Examen |
| :--- | :--- | :---: | :--- |
| **Inorden / Inorden inverso** | `izq-raíz-der` da creciente; `der-raíz-izq` da decreciente. | $\Theta(n)$ | Final 2023 P P2, 2026 P P2(a) |
| **Poda de intervalos (`escribe_menores`)** | Si `root->data >= x`, ¡podar todo el subárbol derecho! | $\mathcal{O}(h + k)$ | 10/06/2024 P2(a) |
| **Sucesor (`upper_bound`)** | Si `root->data > x`, buscar candidato en `left`; si es `nullptr`, el resultado es `root`. | $\mathcal{O}(h)$ | Final 2024 T P2(c) |
| **ABB $\to$ Max-Heap** | Rellenar un vector (pos. `1..n`) haciendo **inorden inverso** (`der, raíz, izq`); cualquier vector decreciente es *max-heap*. | $\Theta(n)$ | Final 2023 P P2 |
| **Vector ordenado $\to$ ABB equilibrado** | Poner `v[m]` con `m = (e+d)/2` de raíz y construir `[e..m-1]` y `[m+1..d]` recursivamente. | $\Theta(n)$ | Final 2026 P P2(b) |
| **Fusionar dos ABBs** | Inorden de A y B $\to$ `merge` lineal (quitar repetidos) $\to$ reconstruir ABB equilibrado. | $\Theta(n)$ | Final 2026 P P2(c) |

**Recorrido acotado (10/06/2024 P2a) y Sucesor recursivo (07/01/2025 P2c):**

```cpp
void escribe_menores(Node* root, int x) {
    if (root == nullptr) return;
    if (root->data >= x) escribe_menores(root->left, x); // Poda derecha
    else {
        escribe_menores(root->left, x);
        cout << root->data << '\n';
        escribe_menores(root->right, x);
    }
}

Node* upper_bound_abb(Node* root, int x) {
    if (root == nullptr) return nullptr;
    if (root->data > x) {
        Node* tmp = upper_bound_abb(root->left, x);
        return (tmp == nullptr) ? root : tmp;
    }
    return upper_bound_abb(root->right, x);
}
```

> **¿ABB y Min-Heap a la vez? (Final 2022 P / 02/06/2022 P1(b)):** Con $n \ge 3$ nodos es **imposible**: si la raíz $a$ tiene ambos hijos, $hi < a < hd$ contradice $a \le hi$; si le falta algún hijo en el nivel $1$, habría un nodo en nivel $2$ con el nivel $1$ incompleto (no sería árbol completo).

---

## 4. Colas con prioridad y montículos (*Heaps*)

### Fórmulas de indexación (clave para no fallar en el código)

| Variante | Rango en el vector | Hijos de $i$ | Padre de $i$ | Condición de hoja |
| :--- | :---: | :---: | :---: | :---: |
| **Binario indexado en 1** | `1 .. n` | `2*i`, `2*i + 1` | `i / 2` | `2*i > n` |
| **Binario indexado en 0** | `0 .. n-1` | `2*i + 1`, `2*i + 2` | `(i - 1) / 2` | `2*i + 1 >= n` |
| **Ternario indexado en 1** | `1 .. n` | `3*i - 1`, `3*i`, `3*i + 1` | `(i + 1) / 3` | `3*i - 1 > n` |
| **Ternario indexado en 0** | `0 .. n-1` | `3*i + 1`, `3*i + 2`, `3*i + 3` | `(i - 1) / 3` | `3*i + 1 >= n` |

### Demostraciones modelo de examen

1. **Hojas de un heap ($\lceil n/2 \rceil$ hojas $\in \Theta(n)$ — Finales 07/01/2025 P2(b), 14/01/2026 P1(b)):**
   En un *heap* indexado en $1$ ($1 \dots n$), un nodo $i$ es hoja $\iff$ no tiene hijo izquierdo $\iff 2i > n \iff i > n/2$. Para $n$ par, son exactamente las posiciones $\frac{n}{2} + 1, \dots, n$, es decir, exactamente **$n/2$ hojas** (en general $\lceil n/2 \rceil \in \Theta(n)$).
2. **Altura de un montículo ternario ($h \in \mathcal{O}(\log n)$ — Final 14/01/2026 P2(a)-(b)):**
   * Suma geométrica (por inducción sobre $h$): $1 + 3 + \dots + 3^h = \frac{3^{h+1}-1}{2}$.
   * Mínimo número de nodos con altura $h$: todos los primeros $h$ niveles llenos más $1$ nodo en el nivel $h+1$:
     $$n \ge \left(1 + 3 + \dots + 3^{h-1}\right) + 1 = \frac{3^h - 1}{2} + 1 = \frac{3^h + 1}{2} \implies h \le \log_3(2n - 1) \in \mathcal{O}(\log n)$$

**`sink()` en Min-Heap ternario indexado en 1 (Final 14/01/2026 P2d):**

```cpp
// v[0] es centinela; elementos válidos en 1..n con n = (int)v.size() - 1
void THeap::sink(int i) {
    if (3*i - 1 < (int)v.size()) {
        int pos_min = 3*i - 1;
        if (3*i < (int)v.size() and v[3*i] < v[pos_min]) pos_min = 3*i;
        if (3*i + 1 < (int)v.size() and v[3*i + 1] < v[pos_min]) pos_min = 3*i + 1;
        if (v[pos_min] < v[i]) {
            swap(v[i], v[pos_min]);
            sink(pos_min);
        }
    }
}
```

### Comprobaciones y reconstrucciones sobre vectores *Heap*
* **Detectar si un vector es *heap* (Final 07/01/2025 P2(a)):** comprobar todos los padres $i$ con sus hijos (¡cuidado con el índice inicial `0` vs `1`!).
* **¿Qué elemento podía haber sido el último en insertarse? (Final 08/01/2024 P1(b)):** una inserción entra en la última posición y hace **`flotar`** hacia la raíz. Si probamos que $x$ acabe en un nodo $u$, todos los nodos del camino desde la última posición hasta $u$ tendrían que haber bajado un nivel, y hay que comprobar si violarían la propiedad de *heap* con el otro hijo. (Ej.: en el *max-heap* con raíz `38` e hijos `32` (izq.) y `33` (der.), `38` no puede ser el último insertado porque implicaría que `32` era la anterior raíz, imposible siendo $32 < 33$).
* **Reconstruir elementos perdidos (10/06/2024 P2(b)):** imponer $v[\text{padre}] \le v[i] \le v[\text{hijo}]$ para cada hueco; si hay hojas que comparten cotas superiores en su padre, permiten múltiples permutaciones válidas.

### Operaciones, construcción y `decrease_key`
* **Floyd *bottom-up*:** `hundir` desde $\lfloor n/2 \rfloor$ hasta $1$ cuesta **$\Theta(n)$** (frente a $\Theta(n\log n)$ insertando uno a uno con `flotar`).
* **Extracción de los $m$ menores (Final 2025 P / 04/06/2025 P2):** Floyd + $m$ `pop` cuesta $\Theta(n + m\log n)$; mantener un *max-heap* de tamaño $m$ cuesta $\Theta(n\log m)$; `QuickSelect` (BFPRT) $\Theta(n)$.
* **Cola con prioridad con `decrease_key` (Final 09/06/2020 P3A):** si `find(x)` es lineal, $m$ llamadas cuestan $\mathcal{O}(m\cdot n)$; añadiendo un `unordered_map<Elem, int> pos` actualizado en cada `swap` de `flotar`/`hundir`, `find` pasa a $\mathcal{O}(1)$ y `decrease_key` a $\mathcal{O}(\log n)$.

---

## 5. Grafos

### Resumen operativo de algoritmos y costes

| Algoritmo | Tipo de grafo | Estructura clave | Coste (listas ady.) | Detalle crítico de examen |
| :--- | :--- | :--- | :---: | :--- |
| **DFS** | Dirigido / No dirigido | Pila / Recursión | $\Theta(n + m)$ | En no dirigidos: ciclo si `vis[v]` y `v != padre`. En dirigidos: hace falta estado *en proceso*. |
| **BFS** | Dirigido / No dirigido | Cola (`queue`) | $\Theta(n + m)$ | Camino mínimo en **pasos** (no ponderado). ¡Marcar **al encolar**! |
| **Kahn (Toposort)** | DAG | Cola / Min-Heap | $\Theta(n + m)$ | `priority_queue` mínima (`greater<int>`) da el orden **lexicográfico**. |
| **Dijkstra** | Pesos $\ge 0$ | Min-Heap + `S[]` | $\mathcal{O}((n + m)\log n)$ | Sin heap en grafos densos ($m \approx n^2$): $\Theta(n^2)$. Falla con pesos $< 0$. |
| **Prim (MST)** | No dirigido conexo | Min-Heap / `vis[]` | $\mathcal{O}(m\log n)$ | Versión naíf buscando la arista mínima que sale de `vis`: $\Theta(n(n+m))$. |
| **Kruskal (MST)** | No dirigido conexo | Lista de aristas sort + DSU | $\mathcal{O}(m\log n)$ | Mejor si ya tenemos las aristas o el grafo es disperso. |

### 5 patrones clave de Grafos en el Final

1. **Kahn naíf vs eficiente (Final 14/01/2026 P3(a)-(c)):** volver a contar grados de entrada en cada paso para elegir un vértice de grado $0$ hace $n$ llamadas de coste $\Theta(n + m) \implies \mathbf{\Theta(n(n + m))}$. Como solo funciona para grafos dirigidos acíclicos (**DAG**), en cualquier ciclo devolverá menos de $n$ vértices.
2. **Dijkstra contando el número de caminos mínimos (`ways` — Final 07/01/2025 P3):**
   ```cpp
   if (d[v] > d[u] + c) {
       d[v] = d[u] + c;
       p[v] = p[u];          // Mejor distancia: reiniciar caminos
       Q.push({d[v], v});
   }
   else if (d[v] == d[u] + c) {
       p[v] += p[u];         // Empate exacto: acumular caminos
   }
   ```
3. **El árbol de caminos mínimos de Dijkstra NO es un MST (Final 02/06/2022 P2(c)):**
   Triángulo $\{0, 1, 2\}$ con pesos $w(0,1) = 5$, $w(0,2) = 5$, $w(1,2) = 3$: desde `0`, Dijkstra escoge $\{0,1\}$ y $\{0,2\}$ (coste total $10$), mientras que el MST es $\{0,1\}$ y $\{1,2\}$ (coste total $8$).
4. **Prim naíf paso a paso (Final 14/01/2026 P3(d)):** encontrar la arista de peso mínimo $(u, v)$ con `vis[u] == true` y `vis[v] == false`:
   ```cpp
   // G[u] almacena pares {peso, vecino}
   pair<int,int> aux(const vector<vector<pair<int,int>>>& G, const vector<bool>& vis) {
       int coste_min = numeric_limits<int>::max(), vertice_min = -1;
       for (int u = 0; u < (int)G.size(); ++u)
           if (vis[u])
               for (auto [w, v] : G[u])
                   if (not vis[v] and w < coste_min) { coste_min = w; vertice_min = v; }
       return {coste_min, vertice_min};
   }
   ```
5. **Grafo implícito + Pila monótona + BFS (Final 08/01/2024 P3 y 04/06/2025 P3):**
   * En espacios de estados (ej. dos jarras $0 \dots \text{cap}_A \times 0 \dots \text{cap}_B$), inicializar `dist` con `-1`/`INF`, marcar al **encolar** y detenerse al llegar al objetivo.
   * Para hallar el *primer elemento estrictamente mayor a la derecha* en $\Theta(n)$ (para generar transiciones implícitas sin buscar linealmente), usar una **pila monótona decreciente**:
   ```cpp
   vector<int> right_greater(const vector<int>& v) {
       int n = v.size();
       vector<int> sol(n, -1);
       stack<int> S;
       for (int i = 0; i < n; ++i) {
           while (not S.empty() and v[S.top()] < v[i]) {
               sol[S.top()] = i;
               S.pop();
           }
           S.push(i);
       }
       return sol;
   }
   ```

---

## 6. Búsqueda exhaustiva, Backtracking y Branch & Bound

### Esquema y tipos de retorno
* **Todas las soluciones:** `void rec(...)` (escribe o guarda en el caso base).
* **Una solución:** `bool rec(...)` con `if (rec(...)) return true;` para cortar la búsqueda al primer éxito.
* **Contar soluciones:** `int rec(...)` sumando los subproblemas (`total += rec(...)`).
* **Optimización (Branch & Bound):** `void rec(..., coste_actual)` actualizando `best_cost` y podando si la cota optimista no puede mejorar `best_cost`.

### Análisis de cotas de llamadas al caso base (pregunta fija de final)

| Estructura del código | Llamadas al caso base (mejor) | Llamadas al caso base (peor) | Coste total | Examen |
| :--- | :---: | :---: | :---: | :--- |
| **`b1 = SAT(...); b2 = SAT(...); return b1 \|\| b2;`** (sin cortocircuito) | **$2^n$** | **$2^n$** | $\Theta(2^n \cdot \text{eval})$ | Final 2022 T P3(b) |
| **Permutaciones con `if (find_ranking(...)) return true;`** | **$1$** (coste $\Omega(n + m)$) | **$n!$** | $\Omega(m \cdot n!)$ (peor) | Finales 10/01/2022 P2(b), 09/06/2026 P3(b) |

> **Cómo justificar el coste en peor caso:** Multiplicar el número de configuraciones completas que llegan al caso base (cuando no hay solución o hay que explorarlas todas, ej. $n!$ permutaciones) por el coste de la función de comprobación (ej. $\Theta(m)$ de `good_ranking`) $\implies \mathbf{\Theta(m \cdot n!)}$.

### Las 4 podas clave y la trampa de la reducción a DAG

1. **Suma objetivo con suma restante (*Herencia*, Final 08/01/2021 P2):** podar si `partial_sum > money` (exceso) **o** si `partial_sum + suma_restante[idx] < money` (no llegaríamos ni cogiendo todo lo que queda).
2. **Elementos pendientes (*Tutis*, Final 02/06/2022 P3):** si quedan `n - sol.size()` casillas y nos faltan `pendientes` letras obligatorias: `if ((int)(n - sol.size()) < pendientes) return;`.
3. **Cota optimista en B&B (Mochila / TSP, Final 09/06/2020 P2B):**
   * Maximizar (Mochila): podar si `svp + svr <= mejor_valor` (`svr` = suma de valores de los objetos restantes).
   * Minimizar (TSP): podar si `coste_actual + M[u][v] >= best_cost` (asumiendo pesos positivos).
4. **Permutación con restricciones de orden $\neq$ Backtracking! (Finales 10/01/2022 P2(c), 09/06/2026 P3(c)):** si cada restricción solo exige que $j_1$ aparezca antes que $j_2$ (ej. $(j_1, j_2, j_3) \implies j_1 \to j_2 \to j_3$), **no hace falta $n!$**: se resuelve con una **Ordenación Topológica en $\mathcal{O}(n + m)$**.

---

## 7. P vs NP, Reducciones y Test (Problema 4 del Final)

### Plantilla estricta para las demostraciones de Problema 4

1. **Probar $X \in \text{NP}$ (3 pasos obligatorios — ej. `3-COL-EQUIL`, Final 08/01/2024 P4(b)):**
   * **Testigo:** definir qué es $y$ (ej. una función/vector de colores $c: V \to \{1,2,3\}$).
   * **Tamaño polinómico:** justificar que $|y| \le p(|x|)$ (ej. un grafo con $n$ vértices y $m$ aristas ocupa $\Theta(n+m)$, y $c$ necesita $\le 2n$ bits).
   * **Verificador polinómico:** describir $V(x, y)$ y sumar el coste de cada comprobación (ej. recorrer las $m$ aristas en $\Theta(n+m)$ para verificar $c(u)\neq c(v)$ y contar $|C_i| = n$ en $\Theta(n)$) + concluir $\iff$.

2. **Probar una reducción polinómica $A \le_p B$ (3 pasos obligatorios — ej. `3-COL` $\le_p$ `3-COL-EQUIL`, Final 08/01/2024 P4(c)):**
   * **Construcción y coste polinómico:** definir $\mathcal{F}(x)$ (ej. 3 copias disjuntas de $G$: $3n$ vértices y $3m$ aristas) y justificar que se construye en tiempo y tamaño polinómicos.
   * **($\implies$) $x \in A \implies \mathcal{F}(x) \in B$:** dar explícitamente la solución construida para $\mathcal{F}(x)$ (ej. usar permutaciones cíclicas $(1,2,3), (2,3,1), (3,1,2)$ en las 3 copias para que cada color salga exactamente $n$ veces).
   * **($\Longleftarrow$) $\mathcal{F}(x) \in B \implies x \in A$:** explicar cómo una solución de $\mathcal{F}(x)$ da una solución válida para $x$ (ej. la primera copia dentro de $G'$ ya es una 3-coloración válida de $G$).

### Errores clásicos de reducciones (preguntas de diagnóstico)
* **`k-COL` $\le_p$ `CNF-SAT` sin cláusulas de existencia (Final 16/01/2023 P4(a)-(b)):** si la fórmula solo tiene $(\neg x_{u,c} \lor \neg x_{v,c})$ por cada arista $\{u,v\}$, poner todas las variables a `false` siempre la satisface (aceptaría un $K_3$ en `2-COL`). Hay que añadir $(x_{u,1} \lor \dots \lor x_{u,k})$ para todo $u \in V$.
* **`SUBSET-SUM` $\le_p$ `PARTITION` con $f(S, \text{obj}) = S \cup \{\text{obj}\}$ (Final 04/06/2025 P4(b)):** **¡es falsa!** Contraejemplo: $S = \{1, 3, 3\}$, $\text{obj} = 3$ es positiva de `SUBSET-SUM`, pero $f(S, 3) = \{1, 3, 3, 3\}$ suma $10$ y no admite partición $5 + 5$. *(La reducción correcta añade $\text{sum}(S) - 2\cdot\text{obj}$, ajustando la mitad total a $\text{sum}(S)-\text{obj}$)*.

### Casos especiales polinómicos y problemas NP-C frecuentes en los finales
* **NP-C habituales en los finales (aparte de `SAT`, `3-SAT`, `CLICA`, `CI`, `RV`, `k-COLOR`):** `SUBSET-SUM`, `PARTITION`, `HAMILTONIAN-CYCLE`, `VIAJANTE` (`TSP`), `3-COL-EQUIL`, `5-COL`.
* **Variantes que SÍ están en $\text{P}$:**
  * Cualquier problema reducible a `2-COL` (bipartito con BFS/DFS, ej. Final 10/01/2022 P3(b)).
  * `RESTRICTED-3-COL` con componentes conexas de tamaño $\le 10$ (Final 09/06/2026 P4(b)): fuerza bruta en cada componente cuesta $\mathcal{O}(3^{10}) = \Theta(1) \implies \mathcal{O}(n)$ total.
  * `(n-1)-COL` (Final 04/06/2025 P4(c)): pintamos todos los vértices distintos excepto dos no adyacentes $\iff$ **$G$ no es completo ($K_n$)**, comprobable en $\mathcal{O}(n^2)$.

### Guía maestra para el Test (C / F / N)

| Afirmación típica de examen | Veredicto | Razonamiento rápido |
| :--- | :---: | :--- |
| "$A \in \text{NP-C}$, $A \le_p B$ y $B \le_p A$ $\implies B \in \text{NP-C}$" | **C** | $B \le_p A \in \text{NP} \implies B \in \text{NP}$; y $A \le_p B \implies B \in \text{NP-difícil}$. |
| "$A \in \text{P}$ y $B \le_p A \implies B \in \text{P}$" | **C** | Cierre de $\text{P}$ por reducciones polinómicas. |
| "$B \in \text{P}$ y $B \le_p A \implies A \in \text{P}$" | **F** | Reducir de un problema fácil hacia $A$ no limita la dificultad de $A$. |
| "$A, B \in \text{P}$ (con instancias SÍ/NO) $\implies A \le_p B$" | **C** | Resuelve $x \in A$ en polinómico y devuelve una instancia fija SÍ o NO de $B$. |
| "$\text{NP} \cap \text{P} \neq \emptyset$" | **C** | $\text{P} \subseteq \text{NP}$ (cualquier problema de $\text{P}$ está en la intersección). |
| "Si $X \in \text{NP}$, no se conoce algoritmo polinómico para $X$" | **F** | Falsa: todos los problemas de $\text{P}$ pertenecen a $\text{NP}$. |
| "Si $A \in \text{NP-C}$ y $A \in \text{P} \implies \text{P} = \text{NP}$" | **C** | Cualquier $B \in \text{NP}$ cumple $B \le_p A \in \text{P} \implies B \in \text{P}$. |
| "Si encontramos $X \in \text{NP} \cap \text{P}$, todo $\text{NP}$ está en $\text{P}$" | **F** | Solo vale si $X$ es **$\text{NP-completo}$**, no cualquier problema de $\text{NP}$. |
| "$\exists A \in \text{P},\ B \in \text{NP-difícil}$ con $B \le_p A$" | **N** | Equivaldría a $\text{P} = \text{NP}$ (problema abierto). |
| "**Existe** reducción polinómica de `3-COL` a `2-SAT`" | **N** | Equivaldría a $\text{P} = \text{NP}$ (Final 14/01/2026 P4(4)). |
| "**Se conoce** reducción polinómica de `3-COL` a `2-SAT`" | **F** | Pregunta por el conocimiento actual: **no** se conoce ninguna (10/06/2024 P4(2)). |
| "Hay algoritmo polinómico para `HAMILTONIANO` pero no para `3-COL`" | **F** | Ambos son $\text{NP-C}$: uno tiene algoritmo polinómico $\iff$ el otro también (09/06/2026 P4(c)). |

> **Regla de oro en los tests C / F / N (0.5 / -0.25 o -0.5):** Distingue **"Se conoce / No se conoce"** (estado actual del conocimiento: suele ser **C** o **F**) de **"Existe / Hay / Pertenece"** cuando implica $\text{P} = \text{NP}$ (suele ser **N**). Si dudas entre dos opciones y resta puntos, déjala en blanco.
