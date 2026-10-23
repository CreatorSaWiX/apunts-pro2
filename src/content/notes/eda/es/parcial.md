---
title: "Parcial EDA"
description: "Resumen tema 1 - tema 3"
readTime: "20 min"
order: 4
draft: false
---

## 1. Análisis de algoritmos

- **$\mathcal{O}(g)$** (cota superior): $f(n) \le c \cdot g(n)$ *(crece a lo sumo como $g$)*
- **$\Omega(g)$** (cota inferior): $f(n) \ge c \cdot g(n)$ *(crece como mínimo como $g$)*
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

### Propiedades de Potencias, Exponenciales ($a^n, e^n$) y raíces
| Propiedad | Formulación | Ejemplo |
| :--- | :--- | :--- |
| **Suma en el exponente** | $a^{x + y} = a^x \cdot a^y$ | $2^{n + 3} = 2^3 \cdot 2^n = 8 \cdot 2^n \implies \mathbf{\Theta(2^n)}$ |
| **Producto en el exponente** | $a^{k \cdot n} = (a^k)^n$ | $2^{2n} = (2^2)^n = 4^n \implies \mathbf{4^n \gg 2^n}$ |
| **Resta de exponentes (cociente)** | $\frac{a^n}{b^n} = \left(\frac{a}{b}\right)^n$ | $\frac{2^n}{3^n} = (2/3)^n \xrightarrow{n\to\infty} 0 \quad (b > a \implies a^n \ll b^n)$ |
| **Raíces como potencias** | $\sqrt[k]{n^p} = n^{p/k}$ | $\sqrt{n} = n^{1/2}, \quad \sqrt[3]{n^2} = n^{2/3}, \quad \sqrt{n^3 + 1} \in \Theta(n^{3/2})$ |
| **Pasar a base $e$** | $a^x = e^{x \ln a}$ | $2^n = e^{n \ln 2}, \quad n^n = e^{n \ln n}$ |
| **Identidad de intercambio clave** | $\mathbf{a^{\log_b n} = n^{\log_b a}}$ | $4^{\log_2 n} = n^{\log_2 4} = n^2 \quad \vert \quad 3^{\log_2 n} = n^{\log_2 3} \approx n^{1.585}$ |

### Operaciones elementales y paso de parámetros

| Concepto / Operación | Coste | Justificación / Regla |
| :--- | :---: | :--- |
| **Operaciones primitivas e I/O simple** | $\Theta(1)$ | Asignaciones primitivas, operadores aritméticos/lógicos/relacionales y `cin`/`cout` simple. |
| **Acceso indexado `v[i]`** | $\Theta(1)$ | Aritmética de punteros sobre memoria contigua ($\text{dirección} = \text{inicio} + i \cdot \text{tamaño}$). |
| **Paso por referencia (`&`, `const &`)** | $\Theta(1)$ | Se transmite la dirección de memoria (puntero), sin duplicar datos. |
| **Paso por valor (`vector<T>` de tamaño $n$)** | $\Theta(n)$ | Clona los $n$ elementos reservando memoria en la *heap*. |

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
| $C(n) = 2C(n-1) + \Theta(1)$ | $a=2, k=0, c=1$ | $a > 1$ | $\Theta(2^n)$ | Torres de Hanoi |

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

## 2. Divide y vencerás

El coste total de un algoritmo de divide y vencerás proviene exclusivamente de tres fuentes:

$$
T(n) = \underbrace{T_{\text{division}}(n)}_{\text{partir}} + \underbrace{a \cdot T(n/b)}_{\text{llamadas recursivas}} + \underbrace{T_{\text{combinar}}(n)}_{\text{fusion/acoplamiento}}
$$

Donde el trabajo no recursivo $g(n) = T_{\text{division}}(n) + T_{\text{combinar}}(n)$ pertenece típicamente a $\Theta(n^k)$ para $k \ge 0$, pudiendo resolverse mediante el **Teorema Maestro de recurrencias divisoras**.

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
| **Torres de Hanoi** | Traslado de $n$ discos | $T(n) = 2T(n-1) + \Theta(1)$ | $\mathbf{\Theta(2^n)}$ (exacto: $2^n - 1$) |
| **QuickSelect (caso medio)** | Selección del $k$-ésimo elemento | $T(n) = T(n/2) + \Theta(n)$ | $\Theta(n)$ |
| **QuickSelect (caso peor)** | Selección del $k$-ésimo elemento | $T(n) = T(n-1) + \Theta(n)$ | $\Theta(n^2)$ |
| **Mediana de Medianas (BFPRT)** | Selección del $k$-ésimo (caso peor) | $T(n) = T(n/5) + T(3n/4) + \Theta(n)$ | $\mathbf{\Theta(n)}$ |

### Búsqueda binaria $\Theta(\log n)$
:::binarysearchviz
:::

:::oopviz{simulation="binary_search"}
:::

### MergeSort $\Theta(n \log n)$

:::mergerecviz
:::

:::mergeviz
:::

:::oopviz{simulation="mergesort"}
:::

---

### MergeSort híbrido con umbral
:::hybridmergeviz
:::

```cpp
const int talla_critica = 50;
if (d - e < talla_critica) ordena_insercio(T, e, d);
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
    mientras tamano(Q) > 1:
        encola(Q, merge(desencola(Q), desencola(Q)))
    retorna desencola(Q)
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
int centre = (e + d) / 2;
if (T[e] < T[centre]) swap(T[centre], T[e]);
if (T[d] < T[centre]) swap(T[centre], T[d]);
if (T[d] < T[e]) swap(T[e], T[d]);
// La mediana queda situada en T[e]
```

---

### Exponenciación rápida $ \mathbf{T(n) \in \Theta(\log n)} $

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

### Las Torres de Hanoi

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

### La Mediana de Medianas 

:::medianviz
:::

:::bfprtviz
:::

## 3. Diccionarios

Un diccionario almacena pares **(clave, valor)** ($k \in K$, $i \in I$) y permite gestionarlos eficientemente:

:::dictviz
:::

### Tablas de dispersión (*Hash Tables*)

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

### Árboles Binarios de Búsqueda (ABB / BST)

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
