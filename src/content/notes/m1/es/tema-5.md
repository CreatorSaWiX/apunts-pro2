---
title: "Tema 5: Álgebra de Matrices"
description: "Repaso fundamental: definiciones, operaciones, matriz inversa y propiedades del espacio de matrices."
order: 6
readTime: "25 min"
subject: "m1"
draft: false
isNew: true
---

## 1. Álgebra de matrices y rango

### Los escalares ($\mathbb{K}$)
Por un **cuerpo de escalares $\mathbb{K}$** entenderemos un conjunto de números con dos operaciones (suma y producto) que satisfacen las propiedades habituales (conmutativa, asociativa, distributiva, elementos neutros) y donde todos los elementos no nulos son invertibles. **Ejemplos de cuerpos**: $\mathbb{R}$ (Reales), $\mathbb{Q}$ (Racionales), $\mathbb{C}$ (Complejos), $\mathbb{Z}_p$ (enteros módulo $p$ primo).

### Definición de matriz
Una matriz de tipo $m \times n$ con elementos en el cuerpo $\mathbb{K}$ consiste en $mn$ elementos ordenados en $m$ filas y $n$ columnas:

$$
A = \begin{pmatrix} 
a_{11} & a_{12} & \dots & a_{1n} \\ 
a_{21} & a_{22} & \dots & a_{2n} \\ 
vdots & \vdots & \ddots & \vdots \\ 
a_{m1} & a_{m2} & \dots & a_{mn} 
\end{pmatrix} \in \mathcal{M}_{m \times n}(\mathbb{K})
$$

### Tipos de matrices

| Tipo | Descripción | Representación Formal | Ejemplo Práctico |
| :--- | :--- | :--- | :--- |
| **Cuadrada** | Mismo número de filas que columnas ($m=n$). | $A \in \mathcal{M}_{n \times n}(\mathbb{K})$ | $\begin{pmatrix} 1 & 5 \\ -2 & 3 \end{pmatrix}$ |
| **Triangular superior** | Todos los elementos por debajo de la diagonal son cero. | $a_{ij} = 0$ si $i > j$ | $\begin{pmatrix} 1 & 2 & 3 \\ 0 & 4 & 5 \\ 0 & 0 & 6 \end{pmatrix}$ |
| **Triangular inferior** | Todos los elementos por encima de la diagonal son cero. | $a_{ij} = 0$ si $i < j$ | $\begin{pmatrix} 1 & 0 & 0 \\ 2 & 4 & 0 \\ 3 & 5 & 6 \end{pmatrix}$ |
| **Diagonal** | Solo los elementos de la diagonal pueden ser no nulos. | $a_{ij} = 0$ si $i \neq j$ | $\begin{pmatrix} 2 & 0 & 0 \\ 0 & 5 & 0 \\ 0 & 0 & -1 \end{pmatrix}$ |
| **Identidad ($I_n$)** | Matriz diagonal donde todos los elementos de la diagonal son $1$. | $a_{ii} = 1, a_{ij} = 0$ | $\begin{pmatrix} 1 & 0 \\ 0 & 1 \end{pmatrix}$ |
| **Simétrica** | La matriz es igual a su transpuesta ($A = A^t$). | $a_{ij} = a_{ji}$ | $\begin{pmatrix} 1 & 2 \\ 2 & 3 \end{pmatrix}$ |
| **Antisimétrica** | La matriz es igual a su transpuesta cambiada de signo. | $a_{ij} = -a_{ji}$ | $\begin{pmatrix} 0 & 5 \\ -5 & 0 \end{pmatrix}$ |
| **Transpuesta ($A^t$)** | Se obtiene intercambiando filas por columnas. | $(a_{ij})^t = a_{ji}$ | $\begin{pmatrix} a & b \\ c & d \end{pmatrix}^t = \begin{pmatrix} a & c \\ b & d \end{pmatrix}$ |
| **Traza (Tr)** | Suma de los elementos de la diagonal principal. | $\text{Tr}(A) = \sum a_{ii}$ | $\text{Tr}\begin{pmatrix} 2 & 1 \\ 0 & 3 \end{pmatrix} = 5$ |

### Operaciones con matrices

| Operación | Regla / Definición | Ejemplo |
| :--- | :--- | :--- |
| **Suma ($A+B$)** | Elemento a elemento: $c_{ij} = a_{ij} + b_{ij}$ | $\begin{pmatrix} 1 & 2 \\ 3 & 4 \end{pmatrix} + \begin{pmatrix} 0 & 1 \\ 2 & 0 \end{pmatrix} = \begin{pmatrix} 1 & 3 \\ 5 & 4 \end{pmatrix}$ |
| **Producto escalar** | Multiplicar todos los elementos por $\lambda$: $\lambda \cdot a_{ij}$ | $3 \cdot \begin{pmatrix} 1 & -2 \\ 0 & 4 \end{pmatrix} = \begin{pmatrix} 3 & -6 \\ 0 & 12 \end{pmatrix}$ |
| **Producto ($AB$)** | Fila multiplicada por columna: $\sum a_{ik}b_{kj}$ | $\begin{pmatrix} 1 & 2 \\ 0 & 1 \end{pmatrix} \begin{pmatrix} 1 & 0 \\ 2 & 3 \end{pmatrix} = \begin{pmatrix} \mathbf{5} & \mathbf{6} \\ \mathbf{2} & \mathbf{3} \end{pmatrix}$ |

### Propiedades del producto

| Propiedad | Condición / Regla | Ejemplo |
| :--- | :--- | :--- |
| **No conmutativo** | $AB \neq BA$ : El orden de los factores altera el producto. | $\begin{pmatrix} 1 & 0 \\ 0 & 0 \end{pmatrix} \begin{pmatrix} 0 & 1 \\ 0 & 0 \end{pmatrix} \neq \begin{pmatrix} 0 & 1 \\ 0 & 0 \end{pmatrix} \begin{pmatrix} 1 & 0 \\ 0 & 0 \end{pmatrix}$ |
| **Transpuesta** | $(AB)^t = B^t A^t$ : Se invierte el orden de los factores. | $\left( \begin{pmatrix} 1 & 2 \end{pmatrix} \begin{pmatrix} 3 \\ 0 \end{pmatrix} \right)^t = \begin{pmatrix} 3 & 0 \end{pmatrix} \begin{pmatrix} 1 \\ 2 \end{pmatrix}$ |
| **Asociativa** | $(AB)C = A(BC)$ : La agrupación no cambia el resultado. | $\left( \begin{pmatrix} 1 & 0 \end{pmatrix} \begin{pmatrix} 0 \\ 1 \end{pmatrix} \right) \begin{pmatrix} 2 \end{pmatrix} = \begin{pmatrix} 1 & 0 \end{pmatrix} \left( \begin{pmatrix} 0 \\ 1 \end{pmatrix} \begin{pmatrix} 2 \end{pmatrix} \right)$ |
| **Polinomio** | $p(A) = A^2 + \dots + \mathbf{a_0 I}$ : Las constantes llevan la Identidad. | Para $p(x) = x^2 - 1$, usamos $p(A) = A^2 - \mathbf{I}$. |

### Matriz inversa ($A^{-1}$)

| Concepto | Expresión / Regla | Ejemplo |
| :--- | :--- | :--- |
| **Definición** | $A \cdot A^{-1} = I$ : Solo si la matriz tiene $\det(A) \neq 0$. | $\begin{pmatrix} 2 & 0 \\ 0 & 2 \end{pmatrix} \begin{pmatrix} \frac{1}{2} & 0 \\ 0 & \frac{1}{2} \end{pmatrix} = \begin{pmatrix} 1 & 0 \\ 0 & 1 \end{pmatrix}$ |
| **Prod. invertible** | $(AB)^{-1} = B^{-1} A^{-1}$ : Se invierte el orden de los factores. | $(2I \cdot 3I)^{-1} = \frac{1}{3}I \cdot \frac{1}{2}I = \frac{1}{6}I$ |
| **Transpuesta** | $(A^t)^{-1} = (A^{-1})^t$ : Trasponer e invertir conmutan. | $\left(\begin{pmatrix} 2 & 0 \\ 0 & 3 \end{pmatrix}^t\right)^{-1} = \begin{pmatrix} 1/2 & 0 \\ 0 & 1/3 \end{pmatrix}$ |
| **Doble inversa** | $(A^{-1})^{-1} = A$ : Invertir dos veces anula la operación. | $\left(\begin{pmatrix} 5 \end{pmatrix}^{-1}\right)^{-1} = \begin{pmatrix} 1/5 \end{pmatrix}^{-1} = \begin{pmatrix} 5 \end{pmatrix}$ |

### Transformaciones elementales por filas

| Tipo | Operación (Notación) | Matriz elemental ($E$) | Efecto |
| :--- | :--- | :--- | :--- |
| **Tipo I** | $F_i \leftrightarrow F_j$ | $\begin{pmatrix} 0 & 1 \\ 1 & 0 \end{pmatrix}$ | Intercambia la Fila 1 y la Fila 2. |
| **Tipo II** | $F_i \to \lambda F_i$ | $\begin{pmatrix} \mathbf{k} & 0 \\ 0 & 1 \end{pmatrix}$ | Multiplica la Fila 1 por un escalar $k \neq 0$. |
| **Tipo III** | $F_i \to F_i + \lambda F_j$ | $\begin{pmatrix} 1 & \mathbf{k} \\ 0 & 1 \end{pmatrix}$ | Suma a la Fila 1 la Fila 2 multiplicada por $k$. |

**Matriz elemental ($E$)**: Es el resultado de aplicar **una sola** operación elemental a la identidad $I$. Multiplicar $EA$ equivale a aplicar la operación directa a la matriz $A$.

**Equivalencia ($A \sim B$)**: Decimos que $A$ y $B$ son equivalentes si podemos llegar de la una a la otra combinando operaciones elementales.
> **Ejemplo**:  
> $A = \begin{pmatrix} 1 & 2 \\ 3 & 1 \end{pmatrix} \xrightarrow{F_2 - 3F_1} \mathbf{B = \begin{pmatrix} 1 & 2 \\ 0 & -5 \end{pmatrix}}$  
> Esto se expresa matricialmente como $B = EA$ donde $E = \begin{pmatrix} 1 & 0 \\ -3 & 1 \end{pmatrix}$.

### Matrices escalonadas y rango
Decimos que una matriz es **escalonada** cuando tiene estructura de escala descendente:

$$
\begin{pmatrix} 
\mathbf{1} & * & * & * \\ 
0 & \mathbf{1} & * & * \\ 
0 & 0 & 0 & \mathbf{1} \\ 
0 & 0 & 0 & 0 
\end{pmatrix}
$$

**Condiciones**:
1. Las filas de ceros siempre van al final (abajo).
2. El primer elemento no nulo de cada fila es un **1** (llamado **pivote**).
3. Cada pivote está a la derecha del pivote de la fila superior.

> **Definición de rango**: El número de filas no nulas (número de pivotes) de una matriz escalonada equivalente.

### Condición de invertibilidad
Para saber si una matriz cuadrada $A$ de orden $n$ tiene inversa, utilizamos el rango:

> **$A$ es invertible $\iff \text{rang}(A) = n$**
> Esto implica que su forma escalonada reducida es la **Identidad ($I_n$)**.

### Método de Gauss-Jordan
Para encontrar la inversa, "pegamos" la identidad a la derecha y operamos hasta que la identidad quede a la izquierda:

$$ (A \mid I_n) \xrightarrow{\text{Operaciones por filas}} (I_n \mid A^{-1}) $$

**Ejemplo paso a paso ($2 \times 2$):**
Invertimos $A = \begin{pmatrix} 1 & 2 \\ 1 & 1 \end{pmatrix}$:

1. **Matriz ampliada**: $\left(\begin{array}{cc|cc} 1 & 2 & 1 & 0 \\ 1 & 1 & 0 & 1 \end{array}\right)$
2. **Hacer cero abajo ($F_2 - F_1$)**: $\left(\begin{array}{cc|cc} 1 & 2 & 1 & 0 \\ 0 & -1 & -1 & 1 \end{array}\right)$
3. **Normalizar pivote ($F_2 \cdot (-1)$)**: $\left(\begin{array}{cc|cc} 1 & 2 & 1 & 0 \\ 0 & 1 & 1 & -1 \end{array}\right)$
4. **Hacer cero arriba ($F_1 - 2F_2$)**: $\left(\begin{array}{cc|cc} \mathbf{1} & \mathbf{0} & \mathbf{-1} & \mathbf{2} \\ \mathbf{0} & \mathbf{1} & \mathbf{1} & \mathbf{-1} \end{array}\right)$
5. **La parte de la derecha es la inversa**: $A^{-1} = \begin{pmatrix} -1 & 2 \\ 1 & -1 \end{pmatrix}$.

---

## 2. Sistemas de ecuaciones lineales

Un sistema se define, se discute (para saber si tiene solución) y se resuelve (Gauss). Lo veremos todo como un proceso unificado.

### Definiciones básicas
- **Ecuación lineal**: Expresión del tipo $a_1x_1 + \dots + a_nx_n = b$.
- **Solución del sistema**: Valores que satisfacen **todas** las ecuaciones simultáneamente.
- **Solución general**: El conjunto formado por **todas** las soluciones posibles.

### Representación del sistema

| Formato | Descripción | Ejemplo |
| :--- | :--- | :--- |
| **Algebraico** | Las ecuaciones tal cual. | $\begin{cases} x + 2y = 3 \\ x + y = 2 \end{cases}$ |
| **Matricial** | Producto $Ax = b$ | $\begin{pmatrix} 1 & 2 \\ 1 & 1 \end{pmatrix} \begin{pmatrix} x \\ y \end{pmatrix} = \begin{pmatrix} 3 \\ 2 \end{pmatrix}$ |
| **Ampliada** | Bloque $(A \mid b)$ | $\begin{pmatrix} 1 & 2 & \mid & 3 \\ 1 & 1 & \mid & 2 \end{pmatrix}$ |

Donde la **matriz ampliada** general es:
$$
(A \mid b) = \begin{pmatrix}
a_{11} & a_{12} & \dots & a_{1n} & \mid & b_1 \\
a_{21} & a_{22} & \dots & a_{2n} & \mid & b_2 \\
\vdots & \vdots & \ddots & \vdots & \mid & \vdots \\
a_{m1} & a_{m2} & \dots & a_{mn} & \mid & b_m
\end{pmatrix}
$$

### Sistemas equivalentes y operaciones
Decimos que dos sistemas son equivalentes si tienen la **misma solución general**. Para pasar de un sistema a otro equivalente, podemos:
1. **Intercambiar** dos ecuaciones.
2. **Multiplicar** una ecuación por un $k \neq 0$.
3. **Sumar** a una ecuación un múltiplo de otra ($E_i \to E_i + \lambda E_j$).

### Clasificación según el número de soluciones
1. **Sistema incompatible (SI)**: No tiene ninguna solución (representan rectas/planos que no se cortan).
2. **Sistema compatible determinado (SCD)**: Tiene una única solución.
3. **Sistema compatible indeterminado (SCI)**: Tiene infinitas soluciones.

### Sistemas homogéneos ($b = 0$)
Son sistemas donde toda la columna de términos independientes es cero.
- **Siempre son compatibles**: Tienen como mínimo la **solución trivial** $(0, \dots, 0)$.
- **Discusión por rango**:
    - $\text{rang}(A) = n \implies$ **SCD** (solo la trivial).
    - $\text{rang}(A) < n \implies$ **SCI** (tiene soluciones no triviales).

### Resolución de sistemas escalonados
En un sistema escalonado compatible con $r = \text{rang}$ y $n = \text{incógnitas}$:
- **Variables principales**: Corresponden a los pivotes (hay $r$).
- **Variables libres**: El resto ($n - r$), que se convierten en parámetros $\lambda, \mu, \dots$

**Ejemplo de forma paramétrica (SCI)**:
Si el resultado es $x + 2y = 5$, hacemos que $y = \lambda$ (libre):
$$ \begin{cases} x = 5 - 2\lambda \\ y = \lambda \end{cases} \implies (x, y) = (5, 0) + \lambda(-2, 1) $$
> El sistema tiene **1 grado de libertad** ($n-r = 1$).

---

### Discusión (Teorema de Rouché-Frobenius)

Este teorema permite clasificar un sistema de ecuaciones comparando el rango de la matriz de coeficientes ($A$) y el del ampliada ($A \mid b$). 

Sea **$r = \text{rang}(A)$**, **$r' = \text{rang}(A \mid b)$** y **$n$** el número de incógnitas:

| Condición de Rangos | Tipo de Sistema | Soluciones | Observación en Gauss |
| :--- | :--- | :--- | :--- |
| **$r < r'$** | **Incompatible (SI)** | Ninguna | Aparece una fila: $(0 \dots 0 \mid b)$ con $b \neq 0$. |
| **$r = r' = n$** | **Comp. Determinado (SCD)** | Única | Tenemos tantos pivotes como incógnitas. |
| **$r = r' < n$** | **Comp. Indeterminado (SCI)** | Infinitas | Hay $n-r$ variables libres (parámetros). |

> Si el sistema es compatible ($r = r'$), el valor de **$r$** se llama **rango del sistema**.

---

### Resolución (Eliminación Gaussiana)

La eliminación gaussiana es el algoritmo sistemático para resolver SEL. Sigue este camino:

1. **Matriz ampliada**: Transforma el sistema a la matriz $(A \mid b)$.
2. **Triangularización**: Haz ceros bajo los pivotes para obtener una matriz escalonada.
3. **Discusión**: Aplica el **Tma. de Rouché-Frobenius** para clasificar el sistema.
4. **Sustitución hacia atrás**: Si es compatible, calcula las incógnitas de abajo a arriba (desde la última fila).

> **Ejemplo paso a paso**: Resolvemos $\begin{cases} x + 2y = 3 \\ 2x + 4y = 6 \end{cases}$
> 1. **Ampliada**: $\left(\begin{array}{cc|c} 1 & 2 & 3 \\ 2 & 4 & 6 \end{array}\right) \xrightarrow{F_2 - 2F_1} \left(\begin{array}{cc|c} \mathbf{1} & 2 & 3 \\ 0 & 0 & 0 \end{array}\right)$
> 2. **Discusión**: $\text{rang}(A) = 1$, $\text{rang}(A|b) = 1$, $n = 2$. Como $1 = 1 < 2$, es un **SCI**.
> 3. **Solución**: $x + 2y = 3 \implies x = 3 - 2\lambda, y = \lambda$.

---

## 3. Determinantes y aplicaciones

El determinante es un escalar que resume las propiedades clave de una matriz cuadrada: inversibilidad, rango y valores propios.
El determinante es un valor escalar que nos indica si una matriz cuadrada es invertible ($\det \neq 0$).

### Métodos de cálculo

| Método | Regla / Definición | Ejemplo |
| :--- | :--- | :--- |
| **$2 \times 2$** | Producto cruzado: $ad - bc$ | $\begin{vmatrix} 1 & 2 \\ 3 & 4 \end{vmatrix} = 4 - 6 = -2$ |
| **Diagonal / Triang.** | Producto de los elementos de la diagonal. | $\det \begin{pmatrix} \mathbf{2} & 5 \\ 0 & \mathbf{3} \end{pmatrix} = 2 \cdot 3 = 6$ |
| **Adjuntos** | Desarrollar por una fila/columna. | $\sum a_{ik} (-1)^{i+k} \det(A_{ik})$ |
| **Sarrus ($3 \times 3$)** | Suma de diagonales (positivas y negativas). | Solo para órdenes $n=3$. |

### Determinantes y transformaciones elementales

| Operación de Fila | Efecto en el Determinante | Ejemplo / Nota |
| :--- | :--- | :--- |
| **Intercambiar filas** | El determinante **cambia de signo**. | $\det(B) = - \det(A)$ |
| **Multiplicar fila por $k$** | El determinante se **multiplica por $k$**. | Si $F_i \to k F_i$ |
| **Sumar combinación** | El determinante **NO varía**. | Operación $F_i \to F_i + \lambda F_j$. |
| **Escalar matriz ($kA$)** | Se multiplica por **$k^n$**. | $\det(k A) = k^n \det(A)$ ($n=$orden). |

### Propiedades algebraicas

| Operación | Regla del determinante | Nota |
| :--- | :--- | :--- |
| **Producto ($AB$)** | $\det(AB) = \det(A) \cdot \det(B)$ | El determinante del producto es el producto de los dets. |
| **Transpuesta ($A^t$)** | $\det(A^t) = \det(A)$ | El determinante no varía al trasponer. |
| **Inversa ($A^{-1}$)** | $\det(A^{-1}) = \frac{1}{\det(A)}$ | Solo si $\det(A) \neq 0$. |
| **Suma ($A+B$)** | **NO hay regla general** | $\det(A+B) \neq \det(A) + \det(B)$ casi siempre. |

> **Truco de la suma constante**: Si todas las filas suman el mismo valor $S$, sumando todas las columnas a la primera ($C_1 \to C_1 + C_2 + \dots$) podremos sacar el factor $S$ fuera del determinante.
> En general, **$\det(A + B) \neq \det(A) + \det(B)$**. Los determinantes "se llevan bien" con el producto, pero no con la suma.


### Aplicaciones: Invertibilidad y valores propios

Gracias a los determinantes, podemos caracterizar la matriz de forma rápida:

1. **Invertibilidad**: $A$ es invertible $\iff \det(A) \neq 0$.
2. **Cálculo del Rango por Menores**: El rango es el orden del menor más grande con determinante no nulo.
3. **Valores Propios**: Se encuentran resolviendo la ecuación característica $\det(A - \lambda I) = 0$.
