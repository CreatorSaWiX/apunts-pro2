---
title: "Tema 1: Análisis de algoritmos"
description: "Eficiencia algorítmica, notación asintótica (O, Ω, Θ), análisis iterativo y recursivo, y teoremas maestros."
readTime: "20 min"
order: 1
draft: false
---

El tiempo de ejecución de un algoritmo, $T(n)$, se evalúa en función del **tamaño de la entrada** ($n$):
- **Vectores / Listas:** Número de elementos ($n$).
- **Grafos:** Número de vértices ($|V|$) y aristas ($|E|$), expresado generalmente como $|V| + |E|$.
- **Matrices:** Número de celdas ($n \times m$) o dimensión ($n$).

Para un tamaño $n$ fijado, el coste puede variar según la instancia concreta:

| Caso | Notación | Definición | Ejemplo (búsqueda en vector) |
| :--- | :--- | :--- | :--- |
| **Mejor caso** | $T_{\min}(n)$ | Tiempo mínimo sobre todas las entradas de tamaño $n$. | Encontrar el elemento en la primera posición ($\mathcal{O}(1)$). |
| **Caso promedio** | $T_{\text{medio}}(n)$ | Tiempo esperado asumiendo una distribución uniforme de entradas. | Encontrar el elemento hacia la mitad ($\mathcal{O}(n)$). |
| **Peor caso** | $T_{\max}(n)$ | Tiempo máximo sobre todas las entradas de tamaño $n$ (estándar en EDA: cota superior segura). | Encontrar el elemento al final o que no esté ($\mathcal{O}(n)$). |

---

## 1.1. Definiciones formales de notación asintótica

La notación asintótica caracteriza el comportamiento de una función de coste $f(n)$ cuando $n \to \infty$, ignorando constantes multiplicativas y términos de orden inferior respecto a una función de referencia $g(n)$.

### Cota superior: $\mathcal{O}$ grande (ómicron)
Indica que $f(n)$ crece a lo sumo tan rápido como $g(n)$ a partir de un cierto $n_0$ ($f(n) \le c \cdot g(n)$), garantizando un límite superior al coste del algoritmo:

$$
\mathcal{O}(g) = \{ f: \mathbb{N} \to \mathbb{R}^+ \mid \exists c \in \mathbb{R}^+,\; \exists n_0 \in \mathbb{N} \quad \text{tal que} \quad \forall n \ge n_0,\; f(n) \le c \cdot g(n) \}
$$

### Cota inferior: $\Omega$ grande (omega)
Indica que $f(n)$ crece como mínimo tan rápido como $g(n)$ a partir de un cierto $n_0$ ($f(n) \ge c \cdot g(n)$), garantizando un límite inferior al coste del algoritmo:

$$
\Omega(g) = \{ f: \mathbb{N} \to \mathbb{R}^+ \mid \exists c \in \mathbb{R}^+,\; \exists n_0 \in \mathbb{N} \quad \text{tal que} \quad \forall n \ge n_0,\; f(n) \ge c \cdot g(n) \}
$$

### Cota ajustada: $\Theta$ grande (theta)
Indica que $f(n)$ crece al mismo ritmo que $g(n)$ a partir de un cierto $n_0$ ($c_1 \cdot g(n) \le f(n) \le c_2 \cdot g(n)$), describiendo el comportamiento asintótico exacto:

$$
\Theta(g) = \{ f: \mathbb{N} \to \mathbb{R}^+ \mid \exists c_1, c_2 \in \mathbb{R}^+,\; \exists n_0 \in \mathbb{N} \quad \text{tal que} \quad \forall n \ge n_0,\; c_1 \cdot g(n) \le f(n) \le c_2 \cdot g(n) \}
$$

| Notación | Tipo de cota | Condición asintótica ($\forall n \ge n_0$) | Relación intuitiva |
| :--- | :--- | :--- | :--- |
| $\mathcal{O}(g)$ | Cota superior | $f(n) \le c \cdot g(n)$ | $f \le g$ |
| $\Omega(g)$ | Cota inferior | $f(n) \ge c \cdot g(n)$ | $f \ge g$ |
| $\Theta(g)$ | Cota ajustada | $c_1 \cdot g(n) \le f(n) \le c_2 \cdot g(n)$ | $f \approx g$ |

:::asymptoticviz
:::

### Criterio del límite del cociente
Permite determinar la relación asintótica entre dos funciones positivas $f(n)$ y $g(n)$ calculando el límite de su cociente cuando $n \to \infty$:

$$
L = \lim_{n \to \infty} \frac{f(n)}{g(n)}
$$

| Valor de $L$ | Relación de crecimiento | Conclusión asintótica | Ejemplo |
| :--- | :--- | :--- | :--- |
| $L = 0$ | $f$ crece estrictamente más despacio que $g$ | $f \in \mathcal{O}(g)$ y $f \notin \Omega(g)$ | $\lim \frac{n}{n^2} = 0 \implies n \in \mathcal{O}(n^2)$ |
| $0 < L < \infty$ | Mismo orden de crecimiento | $f \in \Theta(g) \iff g \in \Theta(f)$ | $\lim \frac{5n^2 + 3}{2n^2} = \frac{5}{2} \implies 5n^2 + 3 \in \Theta(n^2)$ |
| $L = \infty$ | $f$ crece estrictamente más rápido que $g$ | $f \in \Omega(g)$ y $f \notin \mathcal{O}(g)$ | $\lim \frac{n^2}{n} = \infty \implies n^2 \in \Omega(n)$ |

> Si el límite oscila o no existe, se debe aplicar la definición formal con constantes $c$ y $n_0$.

### Propiedades fundamentales de las clases asintóticas

| Propiedad | Formulación | Descripción / Ejemplo |
| :--- | :--- | :--- |
| **Reflexividad** | $f \in \mathcal{O}(f), \quad f \in \Omega(f), \quad f \in \Theta(f)$ | Toda función crece a su mismo ritmo. |
| **Simetría** | $f \in \Theta(g) \iff g \in \Theta(f)$ | Válida solo para $\Theta$ (no aplicable a $\mathcal{O}$ ni $\Omega$). |
| **Transitividad** | $f \in \mathcal{O}(g) \land g \in \mathcal{O}(h) \implies f \in \mathcal{O}(h)$ | Válida también para $\Omega$ y $\Theta$. |
| **Dualidad** | $f \in \mathcal{O}(g) \iff g \in \Omega(f)$ | Relación inversa entre cotas superior e inferior. |
| **Invarianza por constantes** | $\mathcal{O}(k \cdot f) = \mathcal{O}(f) \quad (k > 0)$ | Las constantes multiplicativas no alteran la clase asintótica. |
| **Regla de la suma** | $\Theta(f) + \Theta(g) = \Theta(\max(f, g))$ | El término dominante determina el orden ($n^2 + n \in \Theta(n^2)$). |
| **Regla del producto** | $\Theta(f) \cdot \Theta(g) = \Theta(f \cdot g)$ | Aplicable a bloques o bucles anidados ($n \cdot \log n \implies \Theta(n \log n)$). |

---

## 1.2. Jerarquía de crecimiento

### Reglas de simplificación asintótica

| Familia / Relación | Formulación | Propiedad |
| :--- | :--- | :--- |
| **Polinomios** | $p(n) = \sum_{i=0}^k a_i n^i \in \Theta(n^k)$ | Domina el término de mayor grado ($a_k > 0$); los términos inferiores y el coeficiente se descartan. |
| **Logaritmos** | $\Theta(\log_a n) = \Theta(\log_b n)$ | La base no altera la clase asintótica por la fórmula de cambio de base: $\log_a n = \frac{\log_b n}{\log_b a}$. Se escribe $\Theta(\log n)$. |
| **Logaritmos vs Polinomios** | $\lim_{n \to \infty} \frac{\log^a n}{n^b} = 0 \implies \log^a n \prec n^b$ | Cualquier potencia de logaritmo crece más despacio que cualquier potencia de $n$ ($a, b > 0$). |
| **Polinomios vs Exponenciales** | $\lim_{n \to \infty} \frac{n^b}{c^n} = 0 \implies n^b \prec c^n$ | Cualquier polinomio crece más despacio que cualquier exponencial ($b > 0, c > 1$). |

> La base del logaritmo **sí es relevante** cuando forma parte del exponente: $2^{\log_2 n} = n \neq 2^{\log_3 n} = n^{\log_3 2} \approx n^{0.631}$.

### Cadena de crecimiento asintótico universal

:::growthviz
:::

### Frontera de la intractabilidad e impacto de la tecnología
Cuando un algoritmo tiene coste exponencial ($2^n$ o $3^n$), el tiempo se dispara incluso para tamaños ridículamente pequeños. Asumiendo un procesador estándar que ejecuta $10^6$ operaciones básicas por segundo ($1\,\mu\text{s}$ por operación):

| Complejidad | $n = 10$ | $n = 20$ | $n = 30$ | $n = 50$ | Efecto de comprar una máquina $\times 1000$ más rápida |
| :--- | :--- | :--- | :--- | :--- | :--- |
| $n$ (lineal) | $0.00001\text{ s}$ | $0.00002\text{ s}$ | $0.00003\text{ s}$ | $0.00005\text{ s}$ | Tamaño $1000 \cdot N$ (ganancia proporcional completa) |
| $n^2$ (cuadrática) | $0.0001\text{ s}$ | $0.0004\text{ s}$ | $0.0009\text{ s}$ | $0.0025\text{ s}$ | Tamaño $\sqrt{1000} \cdot N \approx 31.6 \cdot N$ (ganancia amortiguada por raíz) |
| $n^3$ (cúbica) | $0.001\text{ s}$ | $0.008\text{ s}$ | $0.027\text{ s}$ | $0.125\text{ s}$ | Tamaño $\sqrt[3]{1000} \cdot N = 10 \cdot N$ |
| $2^n$ (exponencial) | $0.001\text{ s}$ | $1.05\text{ s}$ | $17.9\text{ min}$ | **$35.7\text{ años}$** | ¡Solo $N + \log_2(1000) \approx \mathbf{N + 10}$ elementos más! |
| $3^n$ (exponencial) | $0.059\text{ s}$ | $58\text{ min}$ | $6.5\text{ años}$ | **$2 \times 10^8\text{ siglos}$** | ¡Solo $N + \log_3(1000) \approx \mathbf{N + 6.3}$ elementos más! |

Si compramos una máquina $m = 1000$ veces más rápida, solo se suma una pequeña constante. La única solución viable es el **rediseño algorítmico**.

---

## 1.3. Algoritmos no recursivos

### Operaciones elementales y paso de parámetros

| Concepto / Operación | Coste | Justificación / Regla |
| :--- | :---: | :--- |
| **Operaciones primitivas y E/S simple** | $\Theta(1)$ | Asignaciones primitivas, operadores aritméticos/lógicos/relacionales y `cin`/`cout` simple. |
| **Acceso indexado `v[i]`** | $\Theta(1)$ | Aritmética de punteros sobre memoria contigua ($\text{dirección} = \text{inicio} + i \cdot \text{tamaño}$). |
| **Paso por referencia (`&`, `const &`)** | $\Theta(1)$ | Se transmite la dirección de memoria (puntero), sin duplicar datos. |
| **Paso por valor (`vector<T>` de tamaño $n$)** | $\Theta(n)$ | Clona los $n$ elementos reservando memoria en el *heap*. |

### Estructuras de control

| Estructura | Esquema sintáctico | Cálculo de coste | Comportamiento |
| :--- | :--- | :--- | :--- |
| **Secuencia** | $F_1; \; F_2; \; \dots; \; F_k$ | $\Theta(\max(C_1, \dots, C_k))$ | Suma de pasos consecutivos; el término de mayor coste determina la complejidad. |
| **Alternativa** | `if (B) F1 else F2` | **Peor:** $D + \max(C_1, C_2)$<br>**Mejor:** $D + \min(C_1, C_2)$ | $D$ es el coste de evaluar $B$ ($\Theta(1)$ generalmente). Sin `else`, el mejor caso es simplemente $D$. |
| **Iteración** | `for` / `while` ($N$ iteraciones) | $\sum_{k=1}^N C_k + (N+1)\Theta(1)$ | La condición se evalúa $N+1$ veces y el cuerpo $N$ veces. Si $C_k = \Theta(1)$, el coste total es $\Theta(N)$. |

---

### Ordenación por selección (Selection Sort)
En cada iteración $i$ (de $n-1$ descendiendo hasta $1$), busca el máximo de la parte restante $v[0 \dots i]$ y lo intercambia con $v[i]$, dejándolo fijado al final:

:::oopviz{simulation="selection_sort"}
:::


:::selectionsortviz
:::



La búsqueda del máximo sobre el subvector $v[0 \dots i]$ requiere comparar todos sus elementos, suponiendo $i$ comparaciones. Como el índice $i$ decrece de $n - 1$ hasta $1$, el número total de comparaciones viene dado por la suma aritmética de Gauss:

$$
\sum_{i=1}^{n-1} i = (n - 1) + (n - 2) + \dots + 1 = \frac{n(n - 1)}{2} \in \Theta(n^2)
$$

En cada iteración se realiza exactamente un intercambio (`swap`), dando $n - 1$ movimientos ($\Theta(n)$). El coste total del algoritmo es la suma de ambos:

$$
T_{\text{sel}}(n) = \Theta(n^2) + \Theta(n) = \Theta(n^2)
$$

El algoritmo no dispone de salida anticipada; ejecuta exactamente las mismas comparaciones independientemente de la ordenación inicial de la entrada. Por tanto:

$$
T_{\min}(n) = T_{\text{medio}}(n) = T_{\max}(n) = \Theta(n^2)
$$

### Ordenación por inserción (Insertion Sort)

:::oopviz{simulation="insertion_sort"}
:::

La barra $\mid$ separa la parte ya ordenada $v[0 \dots k-1]$ (izquierda) de la parte pendiente de explorar (derecha):

:::insertionsortviz
:::



A diferencia de selección, la inserción es un algoritmo **adaptativo**: el bucle interno se detiene en cuanto encuentra un elemento menor o igual, de modo que el número de operaciones depende de la disposición de los datos.

**Mejor caso (vector ya ordenado):** Cada nuevo elemento cumple $v[k] \ge v[k-1]$. La condición del bucle interno falla en la primera comprobación y realiza $0$ intercambios:

$$
T_{\min}(n) = \sum_{k=1}^{n-1} 1 = n - 1 \in \Theta(n)
$$

**Peor caso (vector en orden inverso):** Cada elemento $v[k]$ es menor que todos los anteriores y debe retroceder hasta la posición inicial ($k$ comparaciones y $k$ intercambios):

$$
T_{\max}(n) = \sum_{k=1}^{n-1} k = \frac{n(n - 1)}{2} \in \Theta(n^2)
$$

**Caso promedio (orden aleatorio):** Asumiendo distribución uniforme, cada elemento retrocede en promedio hasta la mitad del prefijo ordenado ($k/2$ pasos), resultando en $T_{\text{medio}}(n) \approx \sum_{k=1}^{n-1} \frac{k}{2} \approx \frac{n^2}{4} \in \Theta(n^2)$. En vectores **casi ordenados** (donde ningún elemento se encuentra a más de una distancia acotada $c \in \mathcal{O}(1)$ de su posición definitiva), el coste total es $\mathcal{O}(c \cdot n) = \Theta(n)$.

Cada intercambio de componentes adyacentes reduce exactamente una inversión (pareja $(i, j)$ con $i < j$ tal que $v[i] > v[j]$). El coste total queda determinado directamente por el número inicial de inversiones $I$:

$$
T(n) = \Theta(n + I) \quad \text{con} \quad 0 \le I \le \frac{n(n-1)}{2}
$$

---

## 1.4. Algoritmos recursivos y teoremas maestros

El coste de una función recursiva se expresa mediante una ecuación de recurrencia:

$$ 
C(n) = a \cdot C(\text{tamaño subproblema}) + g(n) 
$$

donde $a \ge 1$ es el número de llamadas recursivas y $g(n)$ es el coste del trabajo no recursivo (preparación y combinación).

### Teorema maestro de recurrencias sustractivas
Aplica a recurrencias donde cada llamada reduce el tamaño de la entrada en una cantidad constante $c \ge 1$:

$$
C(n) = \begin{cases} \Theta(1), & \text{si } n < n_0 \\ a \cdot C(n - c) + g(n), & \text{si } n \ge n_0 \end{cases} \qquad\text{con } g(n) \in \Theta(n^k), \; k \ge 0
$$

La complejidad asintótica se resuelve según el valor del factor de ramificación $a$:

$$
C(n) \in \begin{cases} 
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
Aplica a algoritmos de divide y vencerás, donde el tamaño de la entrada se divide por un factor constante $b > 1$:

$$
C(n) = \begin{cases} \Theta(1), & \text{si } n < n_0 \\ a \cdot C(n/b) + g(n), & \text{si } n \ge n_0 \end{cases} \qquad\text{con } g(n) \in \Theta(n^k), \; k \ge 0
$$

Definimos el exponente crítico $\alpha = \log_b a$. La solución depende de la relación entre $\alpha$ y el grado no recursivo $k$:

$$
C(n) \in \begin{cases} 
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
