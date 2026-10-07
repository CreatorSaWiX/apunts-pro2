---
title: "Tema 2: Divide y Vencerás"
description: "Paradigma de divide y vencerás: recurrencias divisorias y subtractivas, ordenación (MergeSort, QuickSort), exponenciación rápida, Karatsuba, Strassen, Torres de Hanói y selección lineal (BFPRT)."
readTime: "45 min"
order: 2
draft: false
---

El paradigma de **divide y vencerás** descompone un problema de tamaño $n$ en subproblemas menores de la misma naturaleza, los resuelve de forma recursiva y combina sus resultados para obtener la solución global.

| Fase | Acción | Coste asociado |
| :--- | :--- | :---: |
| **1. Dividir** | Descomponer la entrada en $a \ge 1$ subproblemas de tamaño $n/b$ con $b > 1$. | $T_{\text{division}}(n)$ |
| **2. Vencer** | Resolver recursivamente los $a$ subproblemas (resolución directa $\Theta(1)$ en caso base). | $a \cdot T(n/b)$ |
| **3. Combinar** | Ensamblar las soluciones parciales para construir la solución global. | $T_{\text{combinar}}(n)$ |

:::dncviz
:::

### Distribución del coste temporal
El coste total de un algoritmo de divide y vencerás proviene exclusivamente de tres fuentes:

$$
T(n) = \underbrace{T_{\text{division}}(n)}_{\text{partir}} + \underbrace{a \cdot T(n/b)}_{\text{llamadas recursivas}} + \underbrace{T_{\text{combinar}}(n)}_{\text{fusión/ensamblaje}}
$$

Donde el trabajo no recursivo $g(n) = T_{\text{division}}(n) + T_{\text{combinar}}(n)$ pertenece típicamente a $\Theta(n^k)$ para $k \ge 0$, pudiendo resolverse mediante el **Teorema Maestro de recurrencias divisorias**.

### Ejemplo introductorio: Búsqueda binaria (dicotómica)
Dado un vector $A[0 \dots n-1]$ **ordenado**, queremos determinar si un elemento $x$ pertenece a él. En cada paso comparamos $x$ con el elemento central $A[m]$: si coinciden hemos terminado; si $x < A[m]$, buscamos recursivamente en la mitad izquierda; si $x > A[m]$, en la mitad derecha.

:::binarysearchviz
:::

:::oopviz{simulation="binary_search"}
:::

El parámetro de recursión es $n = j - i + 1$. En cada nivel se realiza solo **una** llamada recursiva ($a = 1$) sobre un subvector de tamaño mitad ($b = 2$), y el trabajo no recursivo (cálculo del punto medio y comparaciones) es constante ($g(n) \in \Theta(1) \implies k = 0$).

$$ 
T(n) = T(n/2) + \Theta(1) 
$$

Por el Teorema Maestro divisor: $\alpha = \log_b a = \log_2 1 = 0$. Como $\alpha = k = 0$, tenemos:

$$ 
\mathbf{T(n) \in \Theta(n^0 \log n) = \Theta(\log n)} 
$$

---

## 2.1 Ordenación por fusión (*MergeSort*)

El algoritmo de **ordenación por fusión** (*MergeSort*) es un esquema de divide y vencerás donde la partición del vector es trivial y el trabajo computacional principal recae en la combinación ordenada de los subvectores.

:::mergerecviz
:::

| Propiedad | Comportamiento | Justificación |
| :--- | :---: | :--- |
| **Complejidad temporal** | $\Theta(n \log n)$ | Óptima en el modelo de comparaciones; idéntica en caso mejor, medio y peor (no adaptativo). |
| **Estabilidad** | Sí | Preserva el orden relativo original de los elementos con claves idénticas. |
| **Memoria auxiliar** | $\Theta(n)$ | Requiere un vector auxiliar para la fase de fusión (no es *in-place*). |

### Estabilidad y ordenación multicriterio

Un algoritmo es **estable** si para cualquier par de elementos con claves idénticas ($x = y$), si $x$ precede a $y$ en la entrada, $x$ también precede a $y$ en la salida.

Esta propiedad permite la **ordenación multicriterio**: para ordenar un conjunto de datos según múltiples claves de distinta prioridad, se aplica el algoritmo estable de manera sucesiva desde el criterio menos prioritario hasta el más prioritario.

| Paso | Criterio aplicado | Secuencia resultante |
| :---: | :--- | :--- |
| **0** | Entrada desordenada | $\langle 6, 7 \rangle,\; \langle 3, 2 \rangle,\; \langle 1, 4 \rangle,\; \langle 3, 1 \rangle,\; \langle 1, 6 \rangle,\; \langle 4, 7 \rangle$ |
| **1** | Ordenar por la 2.ª componente | $\langle 3, \mathbf{1} \rangle,\; \langle 3, \mathbf{2} \rangle,\; \langle 1, \mathbf{4} \rangle,\; \langle 1, \mathbf{6} \rangle,\; \langle 6, \mathbf{7} \rangle,\; \langle 4, \mathbf{7} \rangle$ |
| **2** | Ordenación estable por la 1.ª componente | $\langle \mathbf{1}, 4 \rangle,\; \langle \mathbf{1}, 6 \rangle,\; \langle \mathbf{3}, 1 \rangle,\; \langle \mathbf{3}, 2 \rangle,\; \langle \mathbf{4}, 7 \rangle,\; \langle \mathbf{6}, 7 \rangle$ |

---

### Esquema recursivo e implementación

El algoritmo opera sobre el mismo vector $T$ delimitado por los índices de inicio $e$ y final $d$. Divide el subvector por el punto medio $m = \lfloor(e + d) / 2\rfloor$, ordena recursivamente ambas mitades y las combina con `merge`.

La fusión combina dos subvectores contiguos previamente ordenados, $T[e \dots m]$ y $T[m+1 \dots d]$, produciendo un único subvector ordenado en $T[e \dots d]$. No es posible realizar esta operación *in-place* en tiempo lineal; por tanto, requiere un vector auxiliar $B$ de tamaño $d - e + 1$.

:::mergeviz
:::

| Aspecto clave | Código asociado | Justificación / Efecto |
| :--- | :--- | :--- |
| **Tamaño auxiliar** | `vector<elem> B(d - e + 1)` | Número de elementos en el intervalo cerrado $[e, d]$. |
| **Estabilidad** | `if (T[i] <= T[j])` | En caso de empate ($T[i] = T[j]$), prioriza el elemento de la izquierda, preservando el orden original. |
| **Bucles residuales** | `while (i <= m)`, `while (j <= d)` | Copian los elementos restantes. Son mutuamente excluyentes (exactamente un índice llega al límite). |
| **Desplazamiento (*shift*)** | `T[e + k] = B[k]` | Reubica el contenido de $B[0 \dots n-1]$ en la ventana original $T[e \dots d]$. |
| **Coste de fusión** | $T_{\text{merge}}(n) \in \Theta(n)$ | Realiza como máximo $n - 1$ comparaciones y exactamente $2n$ asignaciones ($n$ a $B$ y $n$ de retorno a $T$). |

:::oopviz{simulation="mergesort"}
:::

### Análisis del coste temporal

El coste temporal $T(n)$ para un subvector de tamaño $n = d - e + 1$ satisface la ecuación de recurrencia:

$$
T(n) = \begin{cases} \Theta(1) & \text{si } n \le 1 \\ 2T(n/2) + \Theta(n) & \text{si } n > 1 \end{cases}
$$

Aplicando el Teorema Maestro divisor con parámetros $a = 2$, $b = 2$ y $g(n) \in \Theta(n^1)$ ($k = 1$):

$$
\alpha = \log_b a = \log_2 2 = 1
$$

Como $\alpha = k = 1$, la complejidad asintótica resulta:

$$
T(n) \in \Theta(n^k \log n) = \Theta(n \log n)
$$

Este coste es independiente de la disposición inicial de los datos; el número de divisiones y comparaciones es idéntico en todos los casos:

$$
T_{\min}(n) = T_{\text{medio}}(n) = T_{\max}(n) = \Theta(n \log n)
$$

---

### Variantes de optimización

### Hibridación por tamaño crítico
Para subvectores de tamaño pequeño ($n < k_0 \approx 50$), la inserción supera a la fusión en la práctica gracias a factores constantes inferiores y a la ausencia de gestión de memoria dinámica. Cuando el intervalo cae por debajo del umbral crítico, se interrumpe la recursión y se aplica inserción:

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

### MergeSort iterativo con cola (*bottom-up*)
Construye la solución de abajo hacia arriba sin recursión: encola cada elemento como un vector unitario y fusiona sucesivamente las parejas extraídas de la cabeza de la cola hasta que solo queda uno:

:::mergequeueviz
:::

```text
function mergesort_queue(a[1...n]):
    Q = cola vacía
    para cada elemento x de a:
        encolar(Q, [x])
    mientras tamaño(Q) > 1:
        encolar(Q, merge(desencolar(Q), desencolar(Q)))
    retorna desencolar(Q)
```

### MergeSort iterativo sobre vector (*bottom-up*)
Aplica el principio *bottom-up* directamente sobre el vector sin la sobrecarga de una cola, fusionando bloques contiguos de tamaño duplicado en cada etapa ($m = 1, 2, 4, 8, \dots$):

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

## 2.2 Ordenación rápida (*QuickSort*)

**QuickSort** es un algoritmo de divide y vencerás que reordena los elementos directamente sobre el vector (*in-place*). Tiene un coste en caso medio de $\Theta(n \log n)$ y un caso peor de $\Theta(n^2)$, con un coeficiente constante muy bajo que lo hace extremadamente rápido en la práctica.

### Fases del algoritmo

| Fase | Acción | Coste asociado |
| :--- | :--- | :---: |
| **1. Elegir pivote** | Seleccionar un elemento $x \in T$ como referencia. | $\Theta(1)$ |
| **2. Partición** | Reorganizar $T$ en dos subbloques: elementos $\le x$ a la izquierda y elementos $\ge x$ a la derecha. | $\Theta(n)$ |
| **3. Vencer** | Ordenar recursivamente cada uno de los dos subbloques. | $T(n_1) + T(n_2)$ |
| **4. Combinar** | Trivial: el vector ya queda ordenado en memoria sin ninguna operación adicional. | $\Theta(1)$ |

:::quicksortviz
:::

### Dualidad: MergeSort vs QuickSort

MergeSort y QuickSort presentan una simetría inversa en el esfuerzo computacional de sus fases:

| Característica | MergeSort | QuickSort |
| :--- | :---: | :---: |
| **Fase de división** | Trivial: punto medio ($\Theta(1)$) | Compleja: partición por pivote ($\Theta(n)$) |
| **Subproblemas** | Siempre balanceados ($n/2$) | Variables según el pivote ($n_1 + n_2 = n$) |
| **Fase de combinación** | Compleja: fusión ordenada ($\Theta(n)$) | Nula: elementos ya colocados *in-place* ($\Theta(1)$) |
| **Memoria auxiliar** | $\Theta(n)$ (vector auxiliar) | $\Theta(1)$ adicional (*in-place*) |
| **Estabilidad** | Estable | No estable |
| **Caso peor** | $\Theta(n \log n)$ | $\Theta(n^2)$ |
| **Caso medio** | $\Theta(n \log n)$ | $\Theta(n \log n)$ |

---

### Partición de Hoare *in-place*
La partición clásica de Hoare opera sin ningún vector auxiliar. Utiliza dos punteros: $i$ (que avanza desde la izquierda buscando elementos $\ge x$) y $j$ (que avanza desde la derecha buscando elementos $\le x$). Cuando ambos se detienen, se intercambian con `swap` y continúan acercándose hasta cruzarse ($i \ge j$).

:::hoarepartviz
:::

:::oopviz{simulation="quicksort"}
:::

| Aspecto técnico | Descripción formal |
| :--- | :--- |
| **Punteros y preoperadores** | Se inicializan en $i = e - 1$ y $j = d + 1$. Los preincrementos (`++i`) y predecrementos (`--j`) garantizan que la primera evaluación opere exactamente sobre los extremos $e$ y $d$. |
| **Postcondición** | Al retornar el índice $q = j$, se cumple $\forall k \in [e \dots q], T[k] \le x$ y $\forall k \in [q+1 \dots d], T[k] \ge x$. |
| **Coste computacional** | Tiempo lineal $\mathbf{\Theta(n)}$ (cada elemento es evaluado un número constante de veces, con $\le n/2$ intercambios) y memoria auxiliar $\mathbf{\Theta(1)}$ (*in-place*). |

---

### Estrategias de elección del pivote
Dado que la partición de Hoare toma como referencia el elemento $T[e]$, cualquier estrategia alternativa selecciona un elemento y lo intercambia inicialmente con $T[e]$:

| Estrategia | Mecanismo | Ventaja | Inconveniente |
| :--- | :--- | :--- | :--- |
| **Primer elemento ($x = T[e]$)** | Selección directa del primer índice. | Coste de elección nulo ($\Theta(1)$). | Degenera a $\Theta(n^2)$ si la entrada ya está ordenada o invertida. |
| **Pivote aleatorio** | Elección aleatoria $p \in [e, d]$ y `swap(T[e], T[p])`. | Elimina correlaciones con ordenaciones previas de los datos. | Sobrecarga en la generación de valores pseudoaleatorios. |
| **Mediana de tres** | Mediana entre $T[e]$, $T[\lfloor(e+d)/2\rfloor]$ y $T[d]$. | Asegura que el pivote nunca es ninguno de los dos valores extremos absolutos. | Requiere 3 comparaciones e intercambios previos por partición. |
| **Hibridación por inserción** | Conmutación a inserción cuando $d - e < 20$. | Reduce la sobrecarga recursiva en subvectores de tamaño reducido. | Precisa calibrar el tamaño crítico según la arquitectura. |

Código para la estrategia de la mediana de tres:
```cpp
int centro = (e + d) / 2;
if (T[e] < T[centro]) swap(T[centro], T[e]);
if (T[d] < T[centro]) swap(T[centro], T[d]);
if (T[d] < T[e]) swap(T[e], T[d]);
// La mediana queda situada en T[e]
```

---

### Análisis de complejidad de QuickSort
Sea $i$ el número de elementos del primer subvector ($1 \le i \le n - 1$). La recurrencia general es:

$$ T(n) = T(i) + T(n - i) + \Theta(n) $$

| Caso | Condición de partición | Recurrencia | Complejidad asintótica |
| :--- | :--- | :--- | :---: |
| **Peor** | Desequilibrio máximo ($i = 1$ o $i = n - 1$ por selección de elementos extremos) | $T(n) = T(n - 1) + \Theta(n)$ | $\mathbf{\Theta(n^2)}$ |
| **Mejor** | Equilibrio exacto ($i = n/2$, bisección simétrica) | $T(n) = 2T(n/2) + \Theta(n)$ | $\mathbf{\Theta(n \log n)}$ |

---

### Comparativa práctica: QuickSort vs MergeSort a nivel de arquitectura
A pesar de compartir un coste asintótico de $\Theta(n \log n)$, QuickSort resulta habitualmente entre $2$ y $3$ veces más rápido en sistemas reales debido al rendimiento de la jerarquía de memoria:

| Nivel de memoria | Tiempo de acceso típico | Factor de lentitud respecto a registros |
| :--- | :--- | :---: |
| **Registros de CPU** | $< 0.5 \text{ ns}$ | $1\times$ |
| **Memoria Caché L1** | $\sim 1 \text{ ns}$ | $2\times$ |
| **Memoria Caché L2** | $\sim 7 \text{ ns}$ | $14\times$ |
| **Memoria Caché L3** | $\sim 20 \text{ ns}$ | $40\times$ |
| **Memoria Principal (RAM)** | $\sim 100 \text{ ns}$ | **$200\times$** |

| Factor de arquitectura | QuickSort | MergeSort |
| :--- | :--- | :--- |
| **Localidad espacial y memoria caché** | Alta (*in-place*). El recorrido secuencial desde los extremos maximiza los aciertos de caché (*cache hits*) en L1 y L2. | Reducida. El acceso alternado entre el vector base y el auxiliar provoca fallos de caché (*cache misses*). |
| **Gestión de memoria dinámica** | Nula. Opera directamente sobre el espacio existente ($\Theta(1)$ memoria adicional). | Elevada. Requiere reservar y liberar espacio auxiliar de tamaño $\Theta(n)$ para la fusión. |
| **Factor constante interno** | Muy bajo. El bucle interno contiene únicamente comparaciones y desplazamientos de índices. | Más alto. Incluye la transferencia de elementos hacia el auxiliar y la copia de retorno. |

---

## 2.3 Productos y exponentes: exponenciación rápida

El cálculo de potencias enteras $x^n$ ejemplifica cómo la estrategia de divide y vencerás permite reducir la complejidad computacional de un coste lineal a un coste logarítmico.

| Enfoque | Mecanismo de cálculo | Recurrencia / Número de operaciones | Complejidad temporal | Memoria auxiliar |
| :--- | :--- | :---: | :---: | :---: |
| **Iterativo ingenuo** | Multiplicaciones sucesivas $\prod_{i=1}^n x$ en un bucle | $n - 1 \text{ multiplicaciones}$ | $\Theta(n)$ | $\Theta(1)$ |
| **Divide y vencerás** | Cálculo recursivo de $x^{\lfloor n/2 \rfloor}$ seguido de elevación al cuadrado | $T(n) = T(n/2) + \Theta(1)$ | $\mathbf{\Theta(\log n)}$ | $\Theta(\log n)$ (pila) |

La relación de recurrencia formal se define por:

$$
x^n = \begin{cases} 
1, & \text{si } n = 0 \quad\text{(caso base)} \\ 
\left(x^{n/2}\right)^2, & \text{si } n \text{ es par} \\ 
\left(x^{(n-1)/2}\right)^2 \cdot x, & \text{si } n \text{ es impar} 
\end{cases}
$$

:::fastpowerviz
:::

:::oopviz{simulation="fast_power"}
:::

### Análisis de complejidad y número de llamadas recursivas

Almacenando el resultado intermedio de la subpotencia en una variable local (`y = potencia(x, n/2)`), se realiza una única llamada recursiva por nivel:

| Parámetro del Teorema Maestro | Valor | Justificación matemática |
| :--- | :---: | :--- |
| **Número de subproblemas ($a$)** | $1$ | Una sola llamada recursiva gracias al almacenamiento del término intermedio. |
| **Factor de división ($b$)** | $2$ | El exponente se divide por la mitad en cada paso. |
| **Trabajo no recursivo ($g(n)$)** | $\Theta(1)$ | Paridad del exponente y un máximo de dos multiplicaciones escalares ($k = 0$). |

Recurrencia:
$$ T(n) = T(n/2) + \Theta(1) $$

Dado que $\alpha = \log_b a = \log_2 1 = 0$ y $k = 0$ ($\alpha = k$):
$$ \mathbf{T(n) \in \Theta(\log n)} $$

> **Observación sobre la duplicación de llamadas:**  
> Si se calcula duplicando la expresión (`potencia(x, n/2) * potencia(x, n/2)`), el número de llamadas pasa a ser $a = 2$. La recurrencia se convierte en $T(n) = 2T(n/2) + \Theta(1)$, donde $\alpha = \log_2 2 = 1 > k = 0 \implies T(n) \in \Theta(n)$, perdiendo completamente la eficiencia del algoritmo.

### Aplicaciones prácticas

| Ámbito | Aplicación | Complejidad resultante |
| :--- | :--- | :---: |
| **Álgebra matricial** | Cálculo del término $n$-ésimo de Fibonacci elevando la matriz $\begin{pmatrix} 1 & 1 \\ 1 & 0 \end{pmatrix}^n$. | $\Theta(\log n)$ |
| **Criptografía** | Aritmética de exponenciación modular ($x^n \pmod m$) en esquemas de clave pública como RSA o Diffie-Hellman. | $\Theta(\log n)$ |

---

## 2.4 Multiplicación de enteros grandes: Algoritmo de Karatsuba

La multiplicación de dos números enteros de $n$ dígitos (o bits) es una operación fundamental en aritmética computacional y criptografía. 
En el método tradicional escolar, se multiplica el primer número por cada uno de los $n$ dígitos del segundo, desplazando cada fila parcial una posición hacia la izquierda:

$$
\begin{array}{rl}
2014 & \\
\times 1714 & \\
\hline
8056 & \quad (\text{fila 1: } 2014 \times 4 \cdot 10^0) \\
2014\phantom{0} & \quad (\text{fila 2: } 2014 \times 1 \cdot 10^1) \\
14098\phantom{00} & \quad (\text{fila 3: } 2014 \times 7 \cdot 10^2) \\
2014\phantom{000} & \quad (\text{fila 4: } 2014 \times 1 \cdot 10^3) \\
\hline
3451996 &
\end{array}
$$

| Etapa del método escolar | Operación elemental | Número de operaciones | Complejidad |
| :--- | :--- | :---: | :---: |
| **Generación de filas** | $n$ filas con $n$ productos de dígitos y acarreos (*carries*) | $n \times n$ | $\Theta(n^2)$ |
| **Suma de columnas** | Suma vertical sobre las $2n$ columnas resultantes | $\approx 2n \times n$ | $\Theta(n^2)$ |

El coste total del algoritmo escolar es:
$$ T_{\text{escolar}}(n) = \Theta(n^2) + \Theta(n^2) = \mathbf{\Theta(n^2)} $$

---

### Descomposición recursiva ingenua (4 subproductos)

En 1952, **Andréi Kolmogórov** conjeturó que cualquier algoritmo para multiplicar dos números de $n$ dígitos requería una cota inferior asintótica infranqueable de $\Omega(n^2)$ operaciones.

:::naivemultviz
:::

Representando dos números naturales $x$ e $y$ de $n$ bits (asumiendo $n$ par) divididos en su mitad superior ($E$) e inferior ($D$):

$$ 
x = 2^{n/2} x_E + x_D, \qquad y = 2^{n/2} y_E + y_D 
$$

Donde $x_E, x_D, y_E, y_D$ son enteros de $n/2$ bits. El desarrollo por la propiedad distributiva genera:

$$ 
xy = 2^n (x_E y_E) + 2^{n/2} (x_E y_D + x_D y_E) + (x_D y_D) 
$$

Este cálculo requiere **4 productos** de tamaño $n/2$: $x_E y_E$, $x_E y_D$, $x_D y_E$ y $x_D y_D$. Las multiplicaciones por $2^n$ y $2^{n/2}$ corresponden a desplazamientos binarios de bits (*bit shifts*) de coste $\Theta(n)$, y las adiciones de términos de longitud $\mathcal{O}(n)$ tienen coste lineal $\Theta(n)$.

| Parámetro de recurrencia | Valor | Significado computacional |
| :--- | :---: | :--- |
| **Número de subproblemas ($a$)** | $4$ | Los 4 productos cruzados ($x_E y_E, x_E y_D, x_D y_E, x_D y_D$). |
| **Factor de reducción ($b$)** | $2$ | División de los operandos a la mitad ($n/2$ bits). |
| **Trabajo no recursivo ($g(n)$)** | $\Theta(n)$ | Desplazamientos binarios y sumas de cadenas de bits ($k = 1$). |

Recurrencia:
$$ 
T(n) = 4T(n/2) + \Theta(n) 
$$

Dado que $\alpha = \log_b a = \log_2 4 = 2 > k = 1$:
$$ 
\mathbf{T(n) \in \Theta(n^{\log_2 4}) = \Theta(n^2)} 
$$

La descomposición directa no reduce la clase asintótica respecto al algoritmo escolar y añade sobrecarga temporal por la gestión de la pila recursiva.

---

### La reducción de Karatsuba (1960) e identidad de Gauss

:::karatsubaviz
:::

En 1960, **Anatoli Karatsuba** refutó la conjetura de Kolmogórov inspirándose en la identidad de Gauss para el producto de números complejos:

$$ 
(a + bi)(c + di) = (ac - bd) + (bc + ad)i 
$$

donde el término cruzado $bc + ad$ se calcula con un único producto adicional:

$$ 
bc + ad = (a + b)(c + d) - ac - bd 
$$

Aplicando este principio a enteros binarios, Karatsuba define tres subproductos:

$$
\begin{aligned}
a &= x_E \cdot y_E \\
b &= x_D \cdot y_D \\
c &= (x_E + x_D)(y_E + y_D)
\end{aligned}
$$

Desarrollando $c$:
$$ 
c = x_E y_E + x_E y_D + x_D y_E + x_D y_D = a + (x_E y_D + x_D y_E) + b 
$$

De donde la suma de los términos cruzados se obtiene por sustracción:
$$ 
x_E y_D + x_D y_E = c - a - b 
$$

Expresión final del producto:
$$ 
\mathbf{xy = 2^n a + 2^{n/2} (c - a - b) + b} 
$$

---

### Análisis formal de la recurrencia de Karatsuba

El algoritmo requiere solo **3 llamadas recursivas** sobre números de tamaño $n/2$ ($a$, $b$ y $c$). Las sumas, restas y desplazamientos de bits sobre operandos de tamaño $\mathcal{O}(n)$ tienen un coste no recursivo $g(n) \in \Theta(n)$.

$$ 
T(n) = 3T(n/2) + \Theta(n) 
$$

| Parámetro Teorema Maestro | Valor | Significado computacional |
| :--- | :---: | :--- |
| **Número de llamadas recursivas ($a$)** | $3$ | Los subproductos $a = x_E y_E$, $b = x_D y_D$ y $c = (x_E + x_D)(y_E + y_D)$. |
| **Factor de reducción de tamaño ($b$)** | $2$ | La longitud en bits se divide por la mitad. |
| **Trabajo adicional ($k$)** | $1$ | Sumas, restas y desplazamientos de cadenas de bits ($\Theta(n^1)$). |

Exponente crítico:
$$ 
\alpha = \log_b a = \log_2 3 \approx 1.58496 
$$

Como $\alpha = \log_2 3 > k = 1$, el coste viene dominado por las hojas del árbol recursivo:
$$ 
\mathbf{T(n) \in \Theta(n^{\log_2 3}) \approx \Theta(n^{1.585})} 
$$

Dado que $n^{1.585} \in o(n^2)$, este resultado demuestra formalmente que **la multiplicación de enteros tiene una complejidad estrictamente subcuadrática**.

| Algoritmo | Número de subproductos | Recurrencia | Complejidad asintótica |
| :--- | :---: | :--- | :---: |
| **Escolar tradicional** | — | — | $\Theta(n^2)$ |
| **Divide y vencerás ingenuo** | 4 de tamaño $n/2$ | $T(n) = 4T(n/2) + \Theta(n)$ | $\Theta(n^2)$ |
| **Karatsuba** | 3 de tamaño $n/2$ | $T(n) = 3T(n/2) + \Theta(n)$ | $\mathbf{\Theta(n^{\log_2 3}) \approx \Theta(n^{1.585})}$ |

<!-- ### Consideraciones prácticas de implementación

| Aspecto de implementación | Descripción técnica |
| :--- | :--- |
| **Precisión arbitraria (`BigInt`)** | La CPU multiplica números de tamaño nativo (32 o 64 bits) en hardware en tiempo constante $\Theta(1)$. El algoritmo de Karatsuba se aplica a tipos de datos de longitud arbitraria representados mediante vectores de dígitos (`vector<uint32_t>`). |
| **Umbral crítico (*threshold*)** | Debido a la constante multiplicativa de las llamadas recursivas y de la gestión de memoria dinámica, el algoritmo escolar es más eficiente para números inferiores a 1000-2000 bits. Las bibliotecas de alto rendimiento (como GNU MP) emplean un enfoque híbrido que conmuta al algoritmo clásico por debajo de este umbral. | -->

---

## 2.5 Multiplicación de matrices: Algoritmo de Strassen

Dadas dos matrices cuadradas $X, Y \in \mathbb{R}^{n \times n}$, su producto $Z = X \cdot Y$ es una matriz $n \times n$ donde cada elemento $(i, j)$ se define por:

$$
Z_{ij} = \sum_{k=1}^n X_{ik} Y_{kj} \qquad (1 \le i, j \le n)
$$

### El algoritmo estándar cúbico $\Theta(n^3)$

La implementación directa de esta definición requiere 3 bucles anidados:

```cpp
matrix<int> producto_estandar(const matrix<int>& A, const matrix<int>& B) {
    int n = A.numrows();
    matrix<int> C(n, n, 0);
    for (int i = 0; i < n; ++i)
        for (int j = 0; j < n; ++j)
            for (int k = 0; k < n; ++k)
                C[i][j] += A[i][k] * B[k][j];
    return C;
}
```

Cada celda $Z_{ij}$ precisa $n$ multiplicaciones y $n - 1$ sumas escalares ($\Theta(n)$ operaciones). Llenar las $n \times n = n^2$ celdas tiene un coste de:

$$
T(n) = n^2 \cdot \Theta(n) = \mathbf{\Theta(n^3)}
$$

---

### Descomposición por bloques $2 \times 2$

:::naivematmultviz
:::

Dividiendo las matrices $X$ e $Y$ en cuatro cuadrantes o submatrices de tamaño $(n/2) \times (n/2)$:

$$
X = \begin{bmatrix} A & B \\ C & D \end{bmatrix}, \qquad Y = \begin{bmatrix} E & F \\ G & H \end{bmatrix}
$$

El producto por bloques reproduce la expresión estándar:

$$
XY = \begin{bmatrix} A & B \\ C & D \end{bmatrix} \begin{bmatrix} E & F \\ G & H \end{bmatrix} = \begin{bmatrix} AE + BG & AF + BH \\ CE + DG & CF + DH \end{bmatrix}
$$

| Operación por bloques | Cantidad y dimensión | Coste computacional |
| :--- | :--- | :---: |
| **Productos de submatrices** | 8 multiplicaciones de tamaño $(n/2) \times (n/2)$ | $8T(n/2)$ |
| **Sumas de submatrices** | 4 sumas de matrices $(n/2) \times (n/2)$ | $\Theta(n^2)$ |

Recurrencia:

$$
T(n) = 8T(n/2) + \Theta(n^2)
$$

Por el Teorema Maestro divisor ($a = 8, b = 2, k = 2$):

$$
\alpha = \log_2 8 = 3 > k = 2 \implies \mathbf{T(n) \in \Theta(n^3)}
$$

La división directa por bloques mantiene la misma clase asintótica cúbica.

---

### Algoritmo de Volker Strassen (1969)

:::strassenmatmultviz
:::

En 1969, **Volker Strassen** demostró que el producto de bloques se puede calcular empleando únicamente **7 multiplicaciones** de submatrices en lugar de 8, aumentando el número de sumas y restas lineales:

$$
\begin{aligned}
P_1 &= A(F - H) \\
P_2 &= (A + B)H \\
P_3 &= (C + D)E \\
P_4 &= D(G - E) \\
P_5 &= (A + D)(E + H) \\
P_6 &= (B - D)(G + H) \\
P_7 &= (A - C)(E + F)
\end{aligned}
$$

Reconstrucción de los cuatro cuadrantes de la matriz producto:

$$
XY = \begin{bmatrix} P_5 + P_4 - P_2 + P_6 & P_1 + P_2 \\ P_3 + P_4 & P_1 + P_5 - P_3 - P_7 \end{bmatrix}
$$

Verificación algebraica del cuadrante superior izquierdo:

$$
P_5 + P_4 - P_2 + P_6 = (AE + AH + DE + DH) + (DG - DE) - (AH + BH) + (BG + BH - DG - DH) = AE + BG
$$

---

### Análisis de complejidad de Strassen

El algoritmo realiza 7 llamadas recursivas sobre submatrices de tamaño $n/2$ y sumas/restas de matrices de coste $\Theta(n^2)$:

$$
T(n) = 7T(n/2) + \Theta(n^2)
$$

| Parámetro Teorema Maestro | Valor | Significado computacional |
| :--- | :---: | :--- |
| **Número de llamadas recursivas ($a$)** | $7$ | Los 7 productos matriciales $P_1 \dots P_7$. |
| **Factor de división de tamaño ($b$)** | $2$ | La dimensión de las submatrices se reduce a $n/2$. |
| **Trabajo adicional no recursivo ($k$)** | $2$ | Sumas y restas de cuadrantes de tamaño $(n/2) \times (n/2)$ ($\Theta(n^2)$). |

Exponente crítico:

$$
\alpha = \log_b a = \log_2 7 \approx 2.80735
$$

Como $\alpha = \log_2 7 > k = 2$:

$$
\mathbf{T(n) \in \Theta(n^{\log_2 7}) \approx \Theta(n^{2.807})}
$$

| Algoritmo | Número de subproductos | Recurrencia | Complejidad asintótica |
| :--- | :---: | :--- | :---: |
| **Estándar iterativo** | — | — | $\Theta(n^3)$ |
| **Bloques ingenuo ($2 \times 2$)** | 8 de tamaño $n/2$ | $T(n) = 8T(n/2) + \Theta(n^2)$ | $\Theta(n^3)$ |
| **Strassen** | 7 de tamaño $n/2$ | $T(n) = 7T(n/2) + \Theta(n^2)$ | $\mathbf{\Theta(n^{\log_2 7}) \approx \Theta(n^{2.807})}$ |

<!-- ---

### Reducción del producto lógico de matrices booleanas

El **producto booleano** de dos matrices $A, B \in \{0, 1\}^{n \times n}$ se define como:

$$
P_{ij} = \bigvee_{k=1}^n (A_{ik} \wedge B_{kj})
$$

Se puede reducir a una multiplicación matricial estándar:

| Fase de reducción | Operación | Complejidad |
| :--- | :--- | :---: |
| **1. Conversión a enteros** | Interpretar las matrices booleanas $A, B$ como matrices sobre $\mathbb{Z}$ | $\Theta(n^2)$ |
| **2. Multiplicación con Strassen** | Calcular el producto entero $M = A \cdot B$ | $\Theta(n^{2.807})$ |
| **3. Umbral booleano** | Evaluar $P_{ij} = (M_{ij} > 0)$ | $\Theta(n^2)$ |

Dado que $M_{ij} = \sum_{k=1}^n A_{ik} B_{kj}$ cuenta exactamente el número de índices $k$ tales que $A_{ik} = 1$ y $B_{kj} = 1$, la condición $M_{ij} > 0$ equivale a la disyunción $\bigvee_{k=1}^n (A_{ik} \wedge B_{kj})$. El coste dominante es el de la multiplicación:

$$
T(n) = \Theta(n^{2.807}) + \Theta(n^2) = \mathbf{\Theta(n^{2.807})}
$$ -->

<!-- ---

### Algoritmos galácticos (*galactic algorithms*)

Después de Strassen, una sucesión de investigaciones teóricas fueron rebajando progresivamente el exponente:
* **Coppersmith y Winograd (1990):** $\mathcal{O}(n^{2.376})$.
* **Avances recientes (Vassilevska Williams et al., 2023):** $\mathcal{O}(n^{2.371})$.

Estos métodos modernos pertenecen a la categoría conocida como **algoritmos galácticos**: algoritmos que poseen un orden asintótico demostrablemente superior, pero cuyas constantes multiplicativas ocultas en la notación $\mathcal{O}$ son tan inmensas que solo superarían a los algoritmos prácticos (como Strassen o el clásico por bloques optimizado con memoria caché) para matrices con dimensiones que excederían la cantidad total de átomos de la galaxia visible. Por esta razón, Strassen y sus variantes adaptadas a memoria caché continúan siendo la referencia práctica para matrices grandes. -->

---

## 2.6 Las Torres de Hanói

El juego de las **Torres de Hanói** ilustra la aplicación de divide y vencerás sobre recurrencias de carácter **subtractivo**, donde el tamaño del problema se reduce por una constante en lugar de un factor divisor.

:::hanoiviz
:::

### Descripción y reglas del problema

Se dispone de tres varillas verticales: $A$ (origen), $B$ (auxiliar) y $C$ (destino). Inicialmente, $A$ contiene una pila de $n$ discos perforados de radios estrictamente decrecientes (el disco de máximo diámetro en la base). El objetivo es trasladar la torre completa a $C$ cumpliendo dos restricciones invariantes: en cada paso solo se puede desplazar el disco superior de una pila y ningún disco puede depositarse nunca sobre un disco de diámetro inferior.

::videoviz{url="/eda/hanoi_transparent.webm?v=2" delay="2000" transparent="true"}

Para trasladar $n$ discos de la varilla origen $A$ a la varilla destino $C$ utilizando $B$ como soporte auxiliar:

```cpp
void hanoi(int n, char a, char b, char c) {
    if (n > 0) {
        hanoi(n - 1, a, c, b); // Mover n-1 discos de origen (a) a auxiliar (b) usando destino (c)
        cout << a << " -> " << c << "\n"; // Movimiento elemental del disco mayor
        hanoi(n - 1, b, a, c); // Mover n-1 discos de auxiliar (b) a destino (c) usando origen (a)
    }
}
```

---

### Cálculo del número exacto de movimientos

Definimos $M(n)$ como el número de movimientos elementales necesarios para trasladar una torre de $n$ discos:

$$
M(n) = \begin{cases} 
0, & \text{si } n = 0 \\ 
2M(n - 1) + 1, & \text{si } n > 0 
\end{cases}
$$

El término $2M(n - 1)$ representa los dos traslados de la subtorre superior y el $+1$ corresponde al desplazamiento del disco basal.

| $n$ | $M(n) = 2M(n-1) + 1$ | Expresión asociada a potencias de 2 |
| :---: | :---: | :--- |
| **0** | $0$ | $2^0 - 1 = 0$ |
| **1** | $2(0) + 1 = 1$ | $2^1 - 1 = 1$ |
| **2** | $2(1) + 1 = 3$ | $2^2 - 1 = 3$ |
| **3** | $2(3) + 1 = 7$ | $2^3 - 1 = 7$ |
| **4** | $2(7) + 1 = 15$ | $2^4 - 1 = 15$ |
| **5** | $2(15) + 1 = 31$ | $2^5 - 1 = 31$ |
| **6** | $2(31) + 1 = 63$ | $2^6 - 1 = 63$ |

La sucesión induce la solución exacta cerrada:

$$
\mathbf{M(n) = 2^n - 1}
$$

### Demostración formal mediante cambio de variable:

Definiendo la secuencia auxiliar $S(n) = M(n) + 1$:

$$
S(n) = 2M(n-1) + 1 + 1 = 2(S(n-1) - 1) + 2 = 2S(n-1)
$$

Con el caso base $S(0) = M(0) + 1 = 1$, la recurrencia homogénea $S(n) = 2S(n-1)$ corresponde a una progresión geométrica de razón 2:

$$
S(n) = 2^n \implies \mathbf{M(n) = S(n) - 1 = 2^n - 1} \qquad (\forall n \ge 0)
$$

---

### Análisis asintótico mediante el Teorema Maestro subtractivo

La recurrencia de las Torres de Hanói se ajusta a la forma general subtractiva:

$$
T(n) = a T(n - b) + g(n)
$$

| Parámetro | Valor | Justificación |
| :--- | :---: | :--- |
| **Número de subproblemas ($a$)** | $2$ | Dos llamadas recursivas independientes por nivel. |
| **Paso de decremento ($b$)** | $1$ | El tamaño disminuye en una unidad ($n \to n - 1$). |
| **Coste no recursivo ($g(n)$)** | $\Theta(1)$ | Una única operación elemental de escritura o movimiento ($k = 0$). |

Por el Teorema Maestro de recurrencias subtractivas, al ser $a = 2 > 1$, la solución es de tipo exponencial:

$$
\mathbf{T(n) \in \Theta(a^{n/b}) = \Theta(2^n)}
$$

Este coste exponencial es **estrictamente mínimo**. Para desplazar el disco de la base, los $n-1$ discos restantes deben estar necesariamente alojados en la varilla auxiliar. Por tanto, es imposible resolver el problema en menos de $2^n - 1$ movimientos.

---

## 2.7 Cálculo de la mediana y algoritmos de selección

### La mediana y su robustez estadística

La **mediana** de un conjunto de números es el elemento central que divide la muestra ordenada en dos mitades de igual tamaño: hay tantos elementos inferiores o iguales como superiores o iguales.
* Si la longitud $n$ es impar: la mediana es el elemento central exacto.
* Si $n$ es par: hay dos candidatos centrales; por convenio formal se escoge el menor (o el mayor).

:::medianviz
:::

A diferencia de la media aritmética ($\bar{x} = \frac{1}{n}\sum x_i$), la mediana posee dos propiedades destacadas:
1. **Pertenencia garantizada:** La mediana siempre es uno de los valores reales presentes en el conjunto original de datos.
2. **Robustez ante valores atípicos (*outliers*):** Si medimos tiempos de ejecución de un proceso y obtenemos la secuencia $[1, 1, 1, 1, 1, 1, 1, 1, 1, 100]$, la media es $10.9$ (un valor engañoso que no describe el comportamiento típico), mientras que la mediana es $1$, permaneciendo completamente inmune a la perturbación puntual.

<!-- ### El problema general de selección

En algorítmica, calcular la mediana es un caso particular del **problema de selección**:
$$\text{seleccion}(S, k)$$
Dado un vector $S$ de $n$ elementos y un natural $1 \le k \le n$, encontrar el $k$-ésimo elemento más pequeño de $S$.
* Para la mediana: $k = \lfloor(n + 1) / 2\rfloor$.
* Para el primer cuartil: $k = \lfloor(n + 1) / 4\rfloor$.
* Para el mínimo absoluto: $k = 1$.
* Para el máximo absoluto: $k = n$.

#### La ineficiencia de ordenar previamente:
La solución trivial consiste en ordenar el vector completo con MergeSort o HeapSort en tiempo $\Theta(n \log n)$ y consultar la posición $k - 1$. No obstante, ordenar realiza un trabajo redundante: a nosotros no nos hace falta que los elementos a la izquierda o a la derecha del resultado estén ordenados entre sí; únicamente necesitamos situar el elemento correcto en la frontera.

---

### Algoritmo QuickSelect (Hoare, 1962)

Tony Hoare adaptó el mecanismo de partición de QuickSort para resolver la selección sin ordenar todo el vector:

```cpp
int quickselect(vector<int>& A, int l, int r, int k) {
    if (l == r) return A[l];
    int q = partition(A, l, r); // Partición de Hoare o Lomuto
    int len_left = q - l + 1;    // Tamaño del subvector izquierdo (elementos <= pivote)
    
    if (k <= len_left) {
        return quickselect(A, l, q, k);
    } else {
        return quickselect(A, q + 1, r, k - len_left);
    }
}
```

A diferencia de QuickSort, que llama recursivamente sobre **ambos** lados de la partición ($2$ llamadas), QuickSelect descarta inmediatamente la mitad donde sabe seguro que no se encuentra el elemento buscado, realizando **una sola llamada recursiva**.

#### Análisis del coste de QuickSelect:
* **Caso medio:** Si el pivote produce una partición razonablemente equilibrada, el tamaño se divide aproximadamente por la mitad en cada paso:
  $$ T(n) = T(n/2) + \Theta(n) $$
  Por el Teorema Maestro divisor ($a = 1, b = 2, k = 1 \implies \alpha = \log_2 1 = 0 < k = 1$):
  $$ T_{\text{medio}}(n) \in \mathbf{\Theta(n)} $$
* **Caso peor:** Si el pivote elegido resulta ser siempre el elemento mínimo o máximo y la búsqueda avanza hacia la parte grande, el subvector solo se reduce en 1 elemento:
  $$ T(n) = T(n - 1) + \Theta(n) $$
  Por el Teorema Maestro subtractivo ($a = 1, b = 1, k = 1 \implies \Theta(n^{k+1})$):
  $$ T_{\max}(n) \in \mathbf{\Theta(n^2)} $$ -->

---

### Algoritmo de la Mediana de Medianas (BFPRT, 1973)

En 1973, Manuel Blum, Robert Floyd, Vaughan Pratt, Ronald Rivest y Robert Tarjan diseñaron un método determinista para escoger un pivote garantizado que asegura que el coste de QuickSelect sea **lineal $\Theta(n)$ en el caso peor**.

:::bfprtviz
:::

### Descripción del algoritmo por bloques de tamaño $q = 5$:
1. **División en bloques:** Se divide el vector $A$ de tamaño $n$ en $\lceil n/5 \rceil$ bloques de 5 elementos (excepto quizás el último bloque, que puede contener menos).
2. **Mediana de cada bloque:** Se calcula la mediana de cada uno de los bloques. Como cada bloque tiene un tamaño constante ($q = 5$), encontrar la mediana de un bloque cuesta $\Theta(1)$ operaciones. Para los $n/5$ bloques:
   $$ \text{Coste(medianas de bloques)} = \frac{n}{5} \cdot \Theta(1) = \Theta(n) $$
3. **Cálculo recursivo del pivote:** Se aplica recursivamente el propio algoritmo de selección para encontrar la **mediana de las $n/5$ medianas** obtenidas en el paso anterior. Este valor central recibe el nombre de **pseudomediana** o pivote garantizado $p$.
   $$ \text{Coste(encontrar pivote)} = T(n/5) $$
4. **Partición del vector original:** Se utiliza el pivote $p$ para partir el vector original de tamaño $n$ en dos mitades mediante la partición estándar, con coste lineal $\Theta(n)$.
5. **Llamada recursiva final:** Se determina en cuál de los dos subvectores reside el $k$-ésimo elemento y se hace una única llamada recursiva sobre él.

---
<!-- 
### Demostración formal de la cota de balanceo del pivote

Determinamos cuántos elementos tenemos la garantía absoluta de que serán inferiores (o superiores) al pivote $p$:

1. Como $p$ es la mediana del conjunto de medianas de bloques, $p$ es estrictamente mayor o igual que como mínimo la mitad de las medianas de bloque:
   $$ \text{Número de medianas } \le p \quad \ge \quad \frac{1}{2} \left(\frac{n}{q}\right) = \frac{n}{2q} $$
2. Cada una de estas medianas de bloque es, por la propia definición de mediana dentro de su bloque de tamaño $q$, mayor o igual que la mitad de los elementos de dicho bloque:
   $$ \text{Elementos por bloque } \le \text{mediana de bloque} \quad \ge \quad \frac{q}{2} $$
3. Multiplicando ambas cotas:
   $$ \text{Elementos garantizados } \le p \quad \ge \quad \left(\frac{1}{2} \cdot \frac{n}{q}\right) \times \left(\frac{q}{2}\right) = \mathbf{\frac{n}{4}} $$

> **Resultado fundamental:** El factor $q$ se simplifica algebraicamente. El pivote $p$ tiene la garantía matemática de que **como mínimo una cuarta parte ($\frac{1}{4}n$) de los elementos son $\le p$** y, por pura simetría, **como mínimo una cuarta parte ($\frac{1}{4}n$) de los elementos son $\ge p$**.

En consecuencia, en el caso más desfavorable posible, el subvector restante sobre el cual tendrá que operar la llamada recursiva final tendrá como máximo:
$$ 
\text{Tamaño máximo del subvector restante} \le n - \frac{n}{4} = \mathbf{\frac{3n}{4}} 
$$

El algoritmo elimina por completo la posibilidad de un desequilibrio extremo de tamaño $n - 1$.

--- -->

### Recurrencia global y la condición de linealidad

El coste temporal en el caso peor $C(n)$ engloba tres contribuciones:
1. Trabajo no recursivo (cálculo de las medianas de bloques de 5 elementos y partición del vector completo): $\Theta(n)$.
2. Llamada recursiva para determinar el pivote entre las $n/5$ medianas: $C(n/5)$.
3. Llamada recursiva final de selección sobre el subvector restante (tamaño máximo $3n/4$): $C(3n/4)$.

$$ 
\mathbf{C(n) = C\left(\frac{n}{5}\right) + C\left(\frac{3n}{4}\right) + \Theta(n)} 
$$

Esta ecuación no es directamente resoluble por el Teorema Maestro porque los tamaños de los subproblemas son asimétricos ($n/5$ y $3n/4$). No obstante, una recurrencia de la familia $T(n) = T(\alpha n) + T(\beta n) + \Theta(n)$ converge a una solución lineal $\Theta(n)$ **si y solo si la suma de los coeficientes de contracción es estrictamente menor que 1**:

$$ 
\alpha + \beta < 1 \iff \frac{1}{q} + \frac{3}{4} < 1 
$$

¿Por qué se toman bloques de tamaño $q = 5$?

| Valor de $q$ | Suma de fracciones $\frac{1}{q} + \frac{3}{4}$ | Condición $< 1$ | Comportamiento asintótico resultante |
| :---: | :---: | :---: | :--- |
| **$q = 3$** | $\frac{1}{3} + \frac{3}{4} = \frac{4 + 9}{12} = \mathbf{\frac{13}{12} \approx 1.083}$ | Falso ($> 1$) | **No lineal.** La cantidad de trabajo acumulado crece en cada nivel, resultando en un coste superlineal $\omega(n)$. |
| **$q = 5$** | $\frac{1}{5} + \frac{3}{4} = 0.20 + 0.75 = \mathbf{0.95}$ | **Cierto ($< 1$)** | **Estrictamente lineal $\mathbf{\Theta(n)}$.** |
| **$q = 7$** | $\frac{1}{7} + \frac{3}{4} \approx 0.143 + 0.75 = \mathbf{0.893}$ | **Cierto ($< 1$)** | Lineal $\Theta(n)$, pero aumenta el coste constante de ordenar cada bloque de 7 elementos. |

Para $q = 5$, en cada nivel recursivo la cantidad agregada de elementos a procesar se reduce por un factor $0.95$ respecto al nivel anterior ($n, 0.95n, (0.95)^2n, \dots$). El trabajo total es una serie geométrica convergente:

$$ 
C(n) \le c \cdot n \sum_{i=0}^\infty (0.95)^i = c \cdot n \left(\frac{1}{1 - 0.95}\right) = 20 c \cdot n \in \mathbf{\Theta(n)} 
$$

Gracias a la estrategia de la mediana de medianas, **el caso peor de selección y de búsqueda de la mediana queda resuelto en tiempo estrictamente lineal $\Theta(n)$**.

---

## 2.8 Síntesis de complejidades del Tema 2

A continuación se resume el abanico completo de algoritmos de divide y vencerás analizados a lo largo del tema:

| Algoritmo | Problema computacional | Ecuación de recurrencia $T(n)$ | Tipo de recurrencia y método | Complejidad temporal | Espacio adicional |
| :--- | :--- | :--- | :--- | :---: | :---: |
| **Búsqueda binaria** | Búsqueda en vector ordenado | $T(n) = T(n/2) + \Theta(1)$ | División ($a=1, b=2, k=0 \implies \alpha = k$) | $\Theta(\log n)$ | $\Theta(1)$ |
| **Exponenciación rápida** | Cálculo de $x^n$ | $T(n) = T(n/2) + \Theta(1)$ | División ($a=1, b=2, k=0 \implies \alpha = k$) | $\Theta(\log n)$ | $\Theta(\log n)$ |
| **MergeSort** | Ordenación estable | $T(n) = 2T(n/2) + \Theta(n)$ | División ($a=2, b=2, k=1 \implies \alpha = k$) | $\Theta(n \log n)$ | $\Theta(n)$ |
| **QuickSort (caso mejor/medio)** | Ordenación *in-place* | $T(n) = 2T(n/2) + \Theta(n)$ | División ($a=2, b=2, k=1 \implies \alpha = k$) | $\Theta(n \log n)$ | $\Theta(\log n)$ |
| **QuickSort (caso peor)** | Ordenación *in-place* | $T(n) = T(n-1) + \Theta(n)$ | Sustracción ($a=1, b=1, k=1$) | $\Theta(n^2)$ | $\Theta(n)$ |
| **Multiplicación escolar** | Producto de dos enteros de $n$ bits | — | Análisis iterativo de rejilla de dígitos | $\Theta(n^2)$ | $\Theta(n)$ |
| **Karatsuba** | Producto de dos enteros de $n$ bits | $T(n) = 3T(n/2) + \Theta(n)$ | División ($a=3, b=2, k=1 \implies \alpha > k$) | $\mathbf{\Theta(n^{\log_2 3}) \approx \Theta(n^{1.585})}$ | $\Theta(n)$ |
| **Matrices estándar** | Producto de matrices $n \times n$ | — | 3 bucles anidados | $\Theta(n^3)$ | $\Theta(n^2)$ |
| **Strassen** | Producto de matrices $n \times n$ | $T(n) = 7T(n/2) + \Theta(n^2)$ | División ($a=7, b=2, k=2 \implies \alpha > k$) | $\mathbf{\Theta(n^{\log_2 7}) \approx \Theta(n^{2.807})}$ | $\Theta(n^2)$ |
| **Torres de Hanói** | Traslado de $n$ discos | $T(n) = 2T(n-1) + \Theta(1)$ | Sustracción ($a=2, b=1, k=0 \implies a > 1$) | $\mathbf{\Theta(2^n)}$ (exacto: $2^n - 1$) | $\Theta(n)$ |
| **QuickSelect (caso medio)** | Selección del $k$-ésimo elemento | $T(n) = T(n/2) + \Theta(n)$ | División ($a=1, b=2, k=1 \implies \alpha < k$) | $\Theta(n)$ | $\Theta(\log n)$ |
| **QuickSelect (caso peor)** | Selección del $k$-ésimo elemento | $T(n) = T(n-1) + \Theta(n)$ | Sustracción ($a=1, b=1, k=1$) | $\Theta(n^2)$ | $\Theta(n)$ |
| **Mediana de Medianas (BFPRT)** | Selección del $k$-ésimo (caso peor) | $T(n) = T(n/5) + T(3n/4) + \Theta(n)$ | Contracción asimétrica ($1/5 + 3/4 = 0.95 < 1$) | $\mathbf{\Theta(n)}$ | $\Theta(\log n)$ |
