---
title: "Tema 1: Análisis de Algoritmos"
description: "Eficiencia algorítmica, notación asintótica (O, Ω, Θ), análisis iterativo y recursivo, Teoremas Maestros, Fibonacci logarítmico y cotas inferiores de ordenación."
readTime: "25 min"
order: 1
draft: false
---

## 1. Eficiencia y Modelos de Coste

### 1.1. Objetivos del Análisis
- **Comparar soluciones:** Escoger el algoritmo óptimo para resolver un mismo problema entre alternativas (p. ej., distintos métodos de ordenación).
- **Optimizar:** Localizar cuellos de botella estructurales para reducir el coste.
- **Predecir recursos:** Estimar el tiempo de ejecución y consumo de memoria antes de implementar.
- En la asignatura EDA, el análisis se centra de manera casi exclusiva en el **tiempo de ejecución** (coste temporal).

### 1.2. ¿Por qué no medir en segundos de reloj?
Medir con cronómetro no es científicamente invariante:
- Depende de la máquina concreta (frecuencia de CPU, jerarquía de caché, arquitectura).
- Depende del compilador y sus flags de optimización (`-O2`, `-O3`).
- Depende del lenguaje de programación (C++ compilat vs. Python interpretado).

Todos estos factores solo introducen una **constante multiplicativa ($c$)**: un procesador el doble de rápido dividirá el tiempo a la mitad, pero jamás convertirá un algoritmo exponencial en tratable. Por ello, se realiza una **abstracción matemática** independiente de la tecnología.

### 1.3. Tamaño de la Entrada ($n = |x|$)
Parametrizamos el coste como una función $T(n)$:
- **Vectores / Listas:** Número de elementos ($n$).
- **Grafos:** Número de vértices más número de aristas ($|V| + |E|$).
- **Números enteros ($x \in \mathbb{N}$):**
  - *Codificación binaria estándar:* Número de bits necesarios:
    $$n = |x| = \lfloor \log_2 x \rfloor + 1$$
  - *Codificación unaria:* El valor numérico directo ($n = x$). Solo en casos específicos.

### 1.4. Medidas de Rendimiento
Dado el conjunto $E$ de entradas de tamaño $n$:
- **Peor Caso ($T_{\text{peor}}(n) = \max_{|x|=n} T(x)$):** Tiempo máximo posible. Proporciona una **garantía absoluta**: ningún ejemplar superará este umbral. Es la medida estándar utilizada en EDA.
- **Mejor Caso ($T_{\text{mejor}}(n) = \min_{|x|=n} T(x)$):** Tiempo mínimo posible. Poco informativo en la práctica, ya que no ofrece garantías operativas generales.
- **Caso Medio ($T_{\text{medio}}(n) = \sum_{|x|=n} \Pr(x) \cdot T(x)$):**
  - Esperanza matemática del coste.
  - *Intuición de clase:* Es exactamente una media ponderada (análoga a calcular el peso medio ponderando la probabilidad de cada individuo por su peso).
  - *Dificultad:* Requiere conocer la distribución de probabilidad de las entradas (a menudo desconocida o no uniforme).

---

## 2. Ejemplos Introductorios

### 2.1. Problema de Selección ($k$-ésimo elemento mayor de $n$ elementos)
1. **Solución 1 (Ordenación total):** Ordenar todo el vector de forma decreciente y devolver el elemento en la posición $k$. Coste: $\Theta(n \log n)$ con un algoritmo óptimo como mergesort. Realiza trabajo innecesario cuando $k \ll n$.
2. **Solución 2 (Vector auxiliar de tamaño $k$ con Invariante):**
   - **Invariante de bucle:** En cada paso, el vector auxiliar contiene exactamente los $k$ mayores elementos procesados hasta el momento, ordenados decrecientemente.
   - Para cada elemento restante $x$:
     - Si $x \le$ mínimo del vector auxiliar (última casilla), **se descarta** en $\Theta(1)$.
     - Si $x >$ mínimo, se retira el mínimo y se inserta $x$ en su posición adecuada desplazando elementos en $\mathcal{O}(k)$.
   - Al terminar, por el invariante, la casilla $k$ contiene la respuesta.
   - Coste en el peor caso: $\Theta(k \log k + (n-k) \cdot k) = \Theta(n \cdot k)$.
   - **Comparación:** Si $k$ es constante o muy pequeño ($k \ll \log n$), la Solución 2 es lineal $\Theta(n)$ y supera a la Solución 1. Si $k = n/2$ (mediana), degenera a $\Theta(n^2)$, resultando mucho peor que la Solución 1.

### 2.2. Problema del Muro Infinito
Buscar una puerta situada a una distancia desconocida $d$ (a izquierda o derecha) en un muro infinito con visibilidad nula hasta situarse justo enfrente:
- **Estrategia Aritmética (Lineal):** Caminar 1 paso a la derecha y regresar al origen; 2 a la izquierda y regresar; 3 a la derecha...
  $$\text{Distancia total} = \sum_{i=1}^d 2i = 2 \frac{d(d+1)}{2} = \Theta(d^2)$$
- **Estrategia Geométrica (Duplicación Exponencial):** Caminar $1$ paso a la derecha y volver; $2^1$ a la izquierda y volver; $2^2$ a la derecha...
  $$\text{Distancia total} \le 2 \sum_{i=0}^k 2^i + d = 2(2^{k+1} - 1) + d$$
  Como el último salto cumple $2^{k-1} < d \le 2^k$, se tiene $2^k < 2d$. La distancia total está acotada por $4(2d) + d = \Theta(d)$.
- **Conclusión:** La duplicación geométrica reduce drásticamente la complejidad de cuadrática $\Theta(d^2)$ a lineal $\Theta(d)$.

---

## 3. Notación Asintótica Formal

Estudia el comportamiento asintótico del tiempo de ejecución cuando $n \to \infty$ ("a la larga"). Se consideran funciones no negativas $f, g: \mathbb{N} \to \mathbb{R}^+$.

### 3.1. Definiciones Formales
- **Cota Superior ($O$ grande / Ómicron):**
  $$\mathcal{O}(g) = \{ f \mid \exists c \in \mathbb{R}^+, \exists n_0 \in \mathbb{N} \text{ tales que } \forall n \ge n_0,\; f(n) \le c \cdot g(n) \}$$
  *Intuición:* $f \le g$ asintóticamente (salvo constante $c$).
- **Cota Inferior ($\Omega$ grande / Omega):**
  $$\Omega(g) = \{ f \mid \exists c \in \mathbb{R}^+, \exists n_0 \in \mathbb{N} \text{ tales que } \forall n \ge n_0,\; f(n) \ge c \cdot g(n) \}$$
  *Intuición:* $f \ge g$ asintóticamente (salvo constante $c$).
- **Cota Ajustada / Exacta ($\Theta$ grande / Theta):**
  $$\Theta(g) = \mathcal{O}(g) \cap \Omega(g)$$
  $$\Theta(g) = \{ f \mid \exists c_1, c_2 \in \mathbb{R}^+, \exists n_0 \in \mathbb{N} \text{ tales que } \forall n \ge n_0,\; c_1 \cdot g(n) \le f(n) \le c_2 \cdot g(n) \}$$
  *Intuición:* $f \approx g$ asintóticamente. (No significa igualdad funcional puntual, sino idéntico ritmo de crecimiento asintótico).

### 3.2. Método de Demostración Formal (Cálculo de $c$ y $n_0$)
Para demostrar $f(n) \in \mathcal{O}(g(n))$ por definición rigurosa:
1. Eliminar términos negativos por arriba: $-an \le 0$ para todo $n \ge 0$.
2. Acotar términos positivos de menor grado utilizando que $n^a \le n^b$ para todo $b \ge a$ si $n \ge 1$.
3. Elegir una constante $c$ estrictamente superior al coeficiente principal resultante.
4. Resolver la inecuación para despejar el umbral entero mínimo $n_0$.

> **Ejemplo de clase:** Demostrar que $f(n) = 3n^3 + 5n^2 - 7n + 41 \in \mathcal{O}(n^3)$:
> 1. Acotamos negativos: $3n^3 + 5n^2 - 7n + 41 \le 3n^3 + 5n^2 + 41$.
> 2. Como $n^2 \le n^3$ para $n \ge 1$: $3n^3 + 5n^2 + 41 \le 8n^3 + 41$.
> 3. Imponemos $8n^3 + 41 \le c \cdot n^3$. Tomando $c = 9$: $41 \le n^3 \iff n \ge \lceil \sqrt[3]{41} \rceil = 4$.
> 4. Escogiendo **$c = 9$** y **$n_0 = 4$**, se cumple formalmente $\forall n \ge 4,\; f(n) \le 9n^3$. Queda demostrado.

### 3.3. Criterio del Límite
Sean $f(n), g(n) > 0$. Calculamos $L = \lim_{n \to \infty} \frac{f(n)}{g(n)}$:
- **$L = 0$:** $f$ crece estrictamente más despacio que $g$ ($f \in \mathcal{O}(g)$ y $f \notin \Omega(g)$; notación estricta $f \prec g$).
- **$L = \infty$:** $f$ crece estrictamente más rápido que $g$ ($f \in \Omega(g)$ y $f \notin \mathcal{O}(g)$; notación estricta $f \succ g$).
- **$0 < L < \infty$:** $f$ y $g$ poseen el mismo orden de crecimiento ($f \in \Theta(g) \iff g \in \Theta(f)$).
- **Si el límite no existe (oscilación):** Se debe aplicar imperativamente la definición formal con cuantificadores.

### 3.4. Propiedades Fundamentales
- **Reflexividad:** $f \in \Theta(f)$, $f \in \mathcal{O}(f)$, $f \in \Omega(f)$.
- **Simetría en $\Theta$:** $f \in \Theta(g) \iff g \in \Theta(f)$.
- **Transitividad:** Si $f \in \mathcal{O}(g)$ y $g \in \mathcal{O}(h) \implies f \in \mathcal{O}(h)$ (análogo para $\Omega$ y $\Theta$).
- **Dualidad:** $f \in \mathcal{O}(g) \iff g \in \Omega(f)$.
- **Invariancia frente a constantes positivas:** $\forall k > 0$, $\Theta(k \cdot f) = \Theta(f)$.
- **Regla de la Suma (Término Dominante):**
  $$\Theta(f) + \Theta(g) = \Theta(f + g) = \Theta(\max(f, g))$$
  *Ejemplo:* $n^3 + n^2 \in \Theta(n^3)$.
- **Regla del Producto:**
  $$\mathcal{O}(f) \cdot \mathcal{O}(g) = \mathcal{O}(f \cdot g), \quad \Theta(f) \cdot \Theta(g) = \Theta(f \cdot g)$$

---

## 4. Jerarquía de Crecimiento e Intratabilidad

### 4.1. Familias Asintóticas Clave
1. **Polinomios:** Para cualquier polinomio $p(n) = a_k n^k + \dots + a_0$ con $a_k > 0$:
   $$p(n) \in \Theta(n^k)$$
   (Solo cuenta el término de grado máximo; coeficientes y grados inferiores se descartan).
2. **Logaritmos (invariancia de la base):** Para cualesquiera bases $a, b > 1$:
   $$\log_a n = \frac{\log_b n}{\log_b a} \implies \Theta(\log_a n) = \Theta(\log_b n)$$
   *Nota de examen:* La base únicamente influye si el logaritmo se encuentra en el exponente ($2^{\log_2 n} = n \neq 2^{\log_3 n} = n^{\log_3 2}$).
3. **Jerarquía Logaritmos vs. Polinomios vs. Exponenciales:**
   Para cualesquiera constantes $a, b > 0$ y $c > 1$:
   $$\lim_{n \to \infty} \frac{\log^a n}{n^b} = 0 \implies \log^a n \prec n^b$$
   $$\lim_{n \to \infty} \frac{n^b}{c^n} = 0 \implies n^b \prec c^n$$
   *Ejemplos extremos de clase:*
   - $(\ln n)^{1.000.000} \prec n^{0.00000001}$ (el polinomio siempre supera al logaritmo a la larga).
   - $n^{1.000.000} \prec (1.00000001)^n$ (la exponencial con base $> 1$ siempre supera al polinomio).
   - Si la base de la exponencial fuese $< 1$ (p. ej. $0.9^n$), la función tiende a 0 y no modela costes algorítmicos.

### 4.2. Escala Universal de Dominancia Asintótica
$$\Theta(1) \prec \Theta(\log \log n) \prec \Theta(\log n) \prec \Theta(\sqrt{n}) \prec \Theta(n) \prec \Theta(n \log n) \prec \Theta(n^2) \prec \Theta(n^k) \prec \Theta(c^n) \prec \Theta(n!) \prec \Theta(n^n)$$

### 4.3. Frontera de la Intratabilidad (Garey & Johnson)

#### Tiempos de ejecución asumiendo $1\,\mu\text{s}$ por operación elemental:

| Complejidad | $n = 10$ | $n = 20$ | $n = 30$ | $n = 50$ |
| :--- | :--- | :--- | :--- | :--- |
| $n$ | $0.00001\text{ s}$ | $0.00002\text{ s}$ | $0.00003\text{ s}$ | $0.00005\text{ s}$ |
| $n^2$ | $0.0001\text{ s}$ | $0.0004\text{ s}$ | $0.0009\text{ s}$ | $0.0025\text{ s}$ |
| $n^3$ | $0.001\text{ s}$ | $0.008\text{ s}$ | $0.027\text{ s}$ | $0.125\text{ s}$ |
| $2^n$ | $0.001\text{ s}$ | $1.05\text{ s}$ | $17.9\text{ min}$ | **$35.7\text{ años}$** |
| $3^n$ | $0.059\text{ s}$ | $58\text{ min}$ | $6.5\text{ años}$ | **$2 \times 10^8\text{ siglos}$** |

#### Impacto de mejoras tecnológicas (Multiplicar la velocidad del hardware por $m$):
Si en un tiempo límite determinado actualmente resolvemos un tamaño $N$:
- Para $T(n) = n$: Resolvemos $m \cdot N$ (ganancia lineal proporcional).
- Para $T(n) = n^2$: Resolvemos $\sqrt{m} \cdot N$ (amortiguado por raíz cuadrada).
- Para $T(n) = 2^n$: El nuevo tamaño $N'$ cumple $2^{N'} = m \cdot 2^N \implies N' = N + \log_2 m$.
  - Si $m = 100$: Únicamente podemos resolver $N + 6.64$ elementos adicionales.
  - Si $m = 1.000$: Únicamente podemos resolver $N + 9.97 \approx 10$ elementos adicionales.
- **Conclusión teórica:** El incremento de potencia de cómputo es inútil frente a complejidades exponenciales; la solución radica exclusivamente en el diseño algorítmico eficiente.

---

## 5. Análisis de Algoritmos No Recursivos (Iterativos)

### 5.1. Regles de Cálculo de Coste
1. **Operaciones Elementales:** Asignaciones, operaciones aritméticas básicas, comparaciones, indexación de vectores y paso por referencia tienen coste $\Theta(1)$.
2. **Composición Secuencial:** Si $F_1$ tiene coste $C_1$ y $F_2$ tiene coste $C_2$:
   $$\text{Coste}(F_1; F_2) = C_1 + C_2 = \Theta(\max(C_1, C_2))$$
3. **Composición Condicional (`if (B) F1 else F2`):**
   $$\text{Coste} = \text{Coste}(B) + \max(\text{Coste}(F_1), \text{Coste}(F_2))$$
4. **Bucles (`for`, `while`):** Se evalúan como sumatorios: $\sum_{i=1}^{\text{vueltas}} \text{Coste}(\text{cuerpo})$.
   - Bucles uniformes independientes: $\sum_{i=1}^n \Theta(1) = \Theta(n)$.
   - Bucles anidados triangulares: $\sum_{i=1}^n \sum_{j=1}^i \Theta(1) = \sum_{i=1}^n i = \frac{n(n+1)}{2} = \Theta(n^2)$.
   - Bucles con paso multiplicativo (`i *= 2` o `i /= 2`): El número de iteraciones cumple $2^k \le n \implies k = \lfloor \log_2 n \rfloor \implies \Theta(\log n)$.
   - Bucles con condición cuadrática (`i * i <= n` o acumulando $\sum_{j=1}^k j \ge n$): Realizan $\Theta(\sqrt{n})$ iteraciones.

### 5.2. Comparación: Algoritmos Básicos de Ordenación

#### Ordenación por Selección (Selection Sort)
Localiza el máximo de $v[0..i]$ e intercambia con $v[i]$, decrementando $i$ desde $n-1$ hasta 1.
- Número de comparaciones: $\sum_{i=1}^{n-1} i = \frac{n(n-1)}{2}$.
- Coste en Mejor Caso: $\Theta(n^2)$.
- Coste en Peor Caso: $\Theta(n^2)$.
- *Propiedad:* Insensible a la ordenación previa; siempre ejecuta exactamente $\Theta(n^2)$ comparaciones.

#### Ordenación por Inserción (Insertion Sort)
En cada etapa $i$ (de 1 a $n-1$), inserta $v[i]$ en su posición relativa correcta entre $v[0..i-1]$ desplazando los elementos mayores hacia la derecha.
- **Mejor Caso (vector ya ordenado ascendentemente):** 1 comparación por iteración, 0 desplazamientos. Coste: $\Theta(n)$.
- **Peor Caso (vector ordenado en sentido inverso):** Cada elemento se desplaza hasta el inicio ($i$ comparaciones e intercambios). Coste: $\sum_{i=1}^{n-1} i = \Theta(n^2)$.
- **Caso Adaptativo (vectores casi ordenados):** El coste es $\Theta(n + I)$, donde $I$ es el número de inversiones. Si cada elemento dista como máximo una constante $B$ de su posición final, el coste es lineal $\Theta(n)$.

---

## 6. Análisis de Algoritmos Recursivos y Teoremas Maestros

### 6.1. Planteamiento de Recurrencias
El coste de una función recursiva se define como:
$$T(n) = \begin{cases} \text{coste base}, & \text{si } n \le n_0 \\ a \cdot T(\text{tamaño subproblema}) + g(n), & \text{si } n > n_0 \end{cases}$$
donde $a$ representa el número de llamadas recursivas y $g(n)$ el coste del trabajo no recursivo (división y combinación).

- **Búsqueda Lineal Recursiva:** $T(n) = T(n-1) + \Theta(1) \implies \Theta(n)$.
- **Búsqueda Binaria Recursiva:** $T(n) = T(n/2) + \Theta(1) \implies \Theta(\log n)$.

---

### 6.2. Teorema Maestro de Recurrencias Sustractivas (FIB)

Aplica a recurrencias de la forma:
$$T(n) = \begin{cases} f(n), & \text{si } 0 \le n < n_0 \\ a \cdot T(n-c) + g(n), & \text{si } n \ge n_0 \end{cases}$$
con $n_0 \in \mathbb{N}$, $c \ge 1$, $a > 0$ y $g(n) \in \Theta(n^k)$ para $k \ge 0$.

$$T(n) \in \begin{cases} \Theta(n^k), & \text{si } a < 1 \\ \Theta(n^{k+1}), & \text{si } a = 1 \\ \Theta(a^{n/c}), & \text{si } a > 1 \end{cases}$$

- **Ejemplo $a = 1$:** $T(n) = T(n-1) + \Theta(n) \implies a=1, c=1, k=1 \implies T(n) \in \Theta(n^{1+1}) = \Theta(n^2)$.
- **Ejemplo $a > 1$:** $T(n) = 2T(n-1) + \Theta(1) \implies a=2, c=1, k=0 \implies T(n) \in \Theta(2^n)$.

---

### 6.3. Teorema Maestro de Recurrencias Divisorias (FIB)

Aplica a recurrencias de la forma:
$$T(n) = \begin{cases} f(n), & \text{si } 0 \le n < n_0 \\ a \cdot T(n/b) + g(n), & \text{si } n \ge n_0 \end{cases}$$
con $n_0 \in \mathbb{N}$, $a \ge 1$, $b > 1$ y $g(n) \in \Theta(n^k)$ para $k \ge 0$.

Se define el exponente crítico de las hojas: **$\alpha = \log_b(a)$**.

$$T(n) \in \begin{cases} \Theta(n^k), & \text{si } \alpha < k \iff a < b^k \quad (\text{domina el trabajo no recursivo}) \\ \Theta(n^k \log n), & \text{si } \alpha = k \iff a = b^k \quad (\text{trabajo equilibrado en cada nivel}) \\ \Theta(n^\alpha) = \Theta(n^{\log_b a}), & \text{si } \alpha > k \iff a > b^k \quad (\text{dominan las hojas del árbol}) \end{cases}$$

#### Extensión con factores polilogarítmicos:
Si $g(n) \in \Theta(n^\alpha \log^p n)$ con $p \ge 0$:
$$T(n) \in \Theta(n^\alpha \log^{p+1} n)$$

#### Ejemplos canónicos:
- **Mergesort (Ordenación por mezcla):**
  $$T(n) = 2T(n/2) + \Theta(n) \implies a=2, b=2, k=1 \implies \alpha = \log_2 2 = 1 = k \implies T(n) \in \Theta(n \log n)$$
- **Multiplicación de Karatsuba:**
  $$T(n) = 3T(n/2) + \Theta(n) \implies a=3, b=2, k=1 \implies \alpha = \log_2 3 \approx 1.585 > 1 \implies T(n) \in \Theta(n^{\log_2 3})$$
- **Multiplicación de matrices de Strassen:**
  $$T(n) = 7T(n/2) + \Theta(n^2) \implies a=7, b=2, k=2 \implies \alpha = \log_2 7 \approx 2.807 > 2 \implies T(n) \in \Theta(n^{\log_2 7})$$

---

## 7. Estudio de Caso: Números de Fibonacci

Definición: $f(0) = 1$, $f(1) = 1$, $f(k) = f(k-1) + f(k-2)$ para $k \ge 2$.

### 7.1. Solución 1: Recursiva Simple
```cpp
int fib(int k) {
    if (k <= 1) return 1;
    return fib(k - 1) + fib(k - 2);
}
```
- Recurrencia del coste: $T(k) = T(k-1) + T(k-2) + \Theta(1)$.
- Cota superior: $T(k) \le 2T(k-1) + \Theta(1) \implies T(k) \in \mathcal{O}(2^k)$.
- Cota inferior: $T(k) \ge 2T(k-2) + \Theta(1) \implies T(k) \in \Omega((\sqrt{2})^k) \approx \Omega(1.414^k)$.
- **Coste exacto:** Resolviendo la ecuación característica $r^2 - r - 1 = 0$, las raíces son $r = \frac{1 \pm \sqrt{5}}{2}$. El término dominante es el número áureo $\phi = \frac{1+\sqrt{5}}{2} \approx 1.618$:
  $$T(k) \in \Theta(\phi^k)$$
  Intratable para valores moderados de $k$.

### 7.2. Solución 2: Iterativa (Programación Dinámica)
```cpp
int fib(int k) {
    if (k <= 1) return 1;
    int cur = 1, pre = 1;
    for (int i = 1; i < k; ++i) {
        int tmp = pre;
        pre = cur;
        cur = cur + tmp;
    }
    return cur;
}
```
- Realiza $k-1$ iteraciones con trabajo constante $\Theta(1)$ por vuelta.
- **Coste temporal:** $\Theta(k)$ (lineal).
- **Coste espacial:** $\Theta(1)$.

### 7.3. Solución 3: Logarítmica por Exponenciación Rápida Matricial
Identidad matricial (demostrable rigurosamente por inducción para todo $k \ge 0$):
$$\begin{pmatrix} f(k+1) \\ f(k) \end{pmatrix} = \begin{pmatrix} 1 & 1 \\ 1 & 0 \end{pmatrix} \begin{pmatrix} f(k) \\ f(k-1) \end{pmatrix} \implies \begin{pmatrix} f(k+1) & f(k) \\ f(k) & f(k-1) \end{pmatrix} = \begin{pmatrix} 1 & 1 \\ 1 & 0 \end{pmatrix}^k$$

#### Algoritmo de Exponenciación Rápida (`pow`):
Para calcular $M^k$, se aprovecha la división sucesiva entre 2:
$$M^k = \begin{cases} I, & \text{si } k = 0 \\ (M^{k/2})^2, & \text{si } k \text{ es par} \\ M \cdot (M^{\lfloor k/2 \rfloor})^2, & \text{si } k \text{ es impar} \end{cases}$$

```cpp
typedef vector<vector<int>> matrix;

matrix multiply(const matrix& A, const matrix& B) {
    matrix C(2, vector<int>(2, 0));
    for (int i = 0; i < 2; ++i)
        for (int j = 0; j < 2; ++j)
            for (int p = 0; p < 2; ++p)
                C[i][j] += A[i][p] * B[p][j];
    return C;
}

matrix pow(const matrix& A, int k) {
    if (k == 0) return {{1, 0}, {0, 1}};
    matrix B = pow(A, k / 2);
    matrix B2 = multiply(B, B);
    if (k % 2 == 0) return B2;
    else return multiply(A, B2);
}

int fib(int k) {
    matrix F = {{1, 1}, {1, 0}};
    matrix P = pow(F, k);
    return P[1][0] + P[1][1]; // Devuelve f(k)
}
```
- Multiplicar matrices de dimensión fija $2 \times 2$ requiere coste $\Theta(1)$.
- Recurrencia del coste: $T(k) = T(k/2) + \Theta(1)$.
- Aplicando el Teorema Maestro divisorio: $a=1, b=2, k=0 \implies \alpha = \log_2 1 = 0 = k \implies T(k) \in \Theta(\log k)$.

---

## 8. Cota Inferior de los Algoritmos de Ordenación por Comparación

### 8.1. Modelo de Árboles de Decisión
- Todo algoritmo de ordenación basado en comparaciones entre pares de elementos ($a_i < a_j$) se puede representar como un **árbol binario de decisión**:
  - Cada **nodo interno** modela una comparación $a_i \le a_j$.
  - Cada arista saliente corresponde a una decisión binaria (`verdadero` o `falso`).
  - Cada **hoja** representa la permutación ordenada final de la secuencia de entrada.
- **Coste en el peor caso:** Equivale a la longitud del camino más largo desde la raíz hasta una hoja, es decir, la **altura del árbol ($d$)**.

### 8.2. Demostración de la Cota $\Omega(n \log n)$
1. **Número de permutaciones posibles:** Dados $n$ elementos distintos, existen $n!$ ordenaciones posibles.
2. Como cualquier permutación puede ser la ordenación correcta según la entrada, cada una de las $n!$ permutaciones debe figurar como mínimo en una hoja del árbol (de lo contrario, el algoritmo fallaría para esa entrada).
   Por tanto, si $L$ denota el número de hojas:
   $$L \ge n!$$
3. **Propiedad de los árboles binarios:** Un árbol binario de altura $d$ contiene a lo sumo $2^d$ hojas:
   $$L \le 2^d$$
4. Combinando ambas desigualdades:
   $$n! \le L \le 2^d \implies 2^d \ge n! \implies d \ge \log_2(n!)$$
5. **Acotación de $\log_2(n!)$:**
   Descartando la mitad inferior de los factores:
   $$n! = n \cdot (n-1) \cdots 1 \ge n \cdot (n-1) \cdots \lceil n/2 \rceil \ge \left(\frac{n}{2}\right)^{n/2}$$
   Tomando logaritmos en base 2:
   $$\log_2(n!) \ge \log_2\left(\left(\frac{n}{2}\right)^{n/2}\right) = \frac{n}{2} \log_2\left(\frac{n}{2}\right) = \frac{n}{2} (\log_2 n - 1) \in \Omega(n \log n)$$

> **Teorema:** Todo algoritmo de ordenación basado en comparaciones requiere, en el peor caso, $\Omega(n \log n)$ comparaciones.
> 
> **Corolario:** Puesto que Mergesort posee un coste en el peor caso de $\Theta(n \log n)$, es asintóticamente **óptimo**. Ningún algoritmo basado en comparaciones puede superarlo en orden de magnitud asintótico.
