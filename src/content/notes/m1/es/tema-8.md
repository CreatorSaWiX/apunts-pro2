---
title: "Tema 8: Diagonalización"
description: "Valores propios, vectores propios y el proceso para diagonalizar matrices y endomorfismos."
order: 9
readTime: "15 min"
subject: "m1"
draft: false
isNew: true
---

La **diagonalización** es el proceso de encontrar una base en la que la matriz de un endomorfismo es lo más simple posible: una matriz diagonal. Esto nos permite entender la estructura de la aplicación y calcular potencias de matrices de forma inmediata.

## 0. Conceptos 

### Valores y vectores Propios
Sea $f: E \to E$ un endomorfismo. Decimos que un escalar $\lambda$ es un **valor propio** (VAP) de $f$ si existe un vector $v \neq \vec{0}$ tal que:
$$
f(v) = \lambda v
$$
Este vector $v$ se llama **vector propio** asociado al valor propio $\lambda$.

### Polinomio característico
Para encontrar los valores propios de una matriz $A$, buscamos las raíces de su **polinomio característico**:
$$
p(\lambda) = \det(A - \lambda I)
$$
Los valores de $\lambda$ que hacen que $p(\lambda) = 0$ son los valores propios, $-\lambda I$ quiere decir restar $\lambda$ a la diagonal principal.

### Subespacios propios ($E_\lambda$)
Para cada valor propio $\lambda$, el conjunto de todos sus vectores propios (más el vector cero) forma un subespacio vectorial llamado **subespacio propio**:

$$
E_\lambda = \ker(A - \lambda I)
$$

La dimensión de este subespacio se llama **multiplicidad geométrica** ($m_g$).

---

## 1. Condiciones de diagonalizabilidad

Una matriz $A \in \mathcal{M}_n(\mathbb{R})$ es diagonalizable si y solo si:
1.  **El polinomio característico descompone totalmente** en el cuerpo de trabajo (todas las raíces son reales).
2.  Para cada valor propio $\lambda$, su **multiplicidad algebraica** ($m_a$, el número de veces que sale como raíz) es igual a su **multiplicidad geométrica** ($m_g$):
    $$m_a(\lambda) = m_g(\lambda)$$

> **Condición suficiente:** Si $A$ tiene $n$ valores propios reales y **distintos**, entonces $A$ es automáticamente diagonalizable.

Para diagonalizar una matriz $A$, seguimos estos pasos:

1.  **Encontrar los valores propios:** Resuelve $p(\lambda) = \det(A - \lambda I) = 0$.
2.  **Calcular las multiplicidades:** Anota $m_a$ para cada $\lambda$. Si alguna raíz es compleja, $A$ no es diagonalizable sobre $\mathbb{R}$.
3.  **Encontrar los vectores propios:** Para cada $\lambda$, resuelve el sistema homogéneo $(A - \lambda I)v = \vec{0}$.
    - La base de soluciones de este sistema será la base del subespacio propio $E_\lambda$.
    - Comprueba que $\dim(E_\lambda) = m_a(\lambda)$. Si por algún $\lambda$ no se cumple, $A$ no es diagonalizable.
4.  **Construir las matrices $P$ y $D$:**
    - **$D$ (Matriz Diagonal):** Coloca los valores propios en la diagonal.
    - **$P$ (Matriz de Cambio de Base):** Coloca los vectores propios en columnas, **en el mismo orden** que sus valores propios en $D$.
    - Se cumple que: $A = P D P^{-1}$ o $D = P^{-1} A P$.

### Ejemplo completo paso a paso

Para ver cómo funciona todo este proceso a la práctica, resolveremos de forma detallada un ejercicio de diagonalización de una matriz $3 \times 3$ paso a paso. Este ejemplo corresponde al **Ejercicio 8.1 (apartado 3)** de la lista de solucionarios:

Consideremos la matriz $A \in \mathcal{M}_3(\mathbb{R})$:
$$A = \begin{pmatrix} 3 & 1 & 1 \\ 2 & 4 & 2 \\ 1 & 1 & 3 \end{pmatrix}$$

### Paso 1: Encontrar los valores propios
Para encontrar los valores propios, resolvemos el polinomio característico $p(\lambda) = \det(A - \lambda I) = 0$:
$$
p(\lambda) = \begin{vmatrix} 3-\lambda & 1 & 1 \\ 2 & 4-\lambda & 2 \\ 1 & 1 & 3-\lambda \end{vmatrix}
$$

Para hacer el determinante más fácil, podemos simplificar la matriz restando la tercera columna a la primera ($C_1 \leftarrow C_1 - C_3$):
$$
p(\lambda) = \begin{vmatrix} 2-\lambda & 1 & 1 \\ 0 & 4-\lambda & 2 \\ \lambda-2 & 1 & 3-\lambda \end{vmatrix}
$$

Ahora sumamos la primera fila a la tercera ($F_3 \leftarrow F_3 + F_1$):
$$
p(\lambda) = \begin{vmatrix} 2-\lambda & 1 & 1 \\ 0 & 4-\lambda & 2 \\ 0 & 2 & 4-\lambda \end{vmatrix}
$$

Desarrollamos por el método de Laplace por la primera columna (que ahora tiene dos ceros):

$$p(\lambda) = (2-\lambda) \cdot \begin{vmatrix} 4-\lambda & 2 \\ 2 & 4-\lambda \end{vmatrix} = (2-\lambda) \left[ (4-\lambda)^2 - 4 \right]
$$

$$
p(\lambda) = (2-\lambda) \left[ (\lambda^2 - 8\lambda + 16) - 4 \right] = (2-\lambda)(\lambda^2 - 8\lambda + 12)
$$

Encontramos las raíces de la ecuación de segundo grado $\lambda^2 - 8\lambda + 12 = 0$:

$$
\lambda = \frac{8 \pm \sqrt{(-8)^2 - 4(1)(12)}}{2} = \frac{8 \pm \sqrt{64 - 48}}{2} = \frac{8 \pm 4}{2} \implies \lambda = 6, \quad \lambda = 2
$$

Por tanto, el polinomio característico completamente descompuesto es:
$$
p(\lambda) = -(\lambda-2)^2(\lambda-6)
$$

Los valores propios son las raíces del polinomio: **$\lambda_1 = 2$** y **$\lambda_2 = 6$**.

### Paso 2: Calcular las multiplicidades algebraicas ($m_a$)
Anotamos cuántas veces se repite cada raíz:
*   Para $\lambda_1 = 2$, tenemos **$m_a(2) = 2$** (ya que el factor $(\lambda-2)$ está al cuadrado).
*   Para $\lambda_2 = 6$, tenemos **$m_a(6) = 1$**.

Todos los valores propios son reales, por lo tanto la primera condición de diagonalizabilidad se cumple.

### Paso 3: Encontrar los vectores propios y las multiplicidades geométricas ($m_g$)
Buscamos el subespacio de vectores propios para cada valor propio resolviendo el sistema homogéneo $(A - \lambda I)v = \vec{0}$.

A) Para $\lambda_1 = 2$:

Resolvemos el sistema $(A - 2I)v = \vec{0}$:
$$
A - 2I = \begin{pmatrix} 1 & 1 & 1 \\ 2 & 2 & 2 \\ 1 & 1 & 1 \end{pmatrix}
$$

Como las tres filas son múltiplos de la primera, el sistema es equivalente a una única ecuación lineal:
$$
x + y + z = 0 \implies x = -y - z
$$

Como tenemos 3 variables y 1 ecuación, tenemos $3 - 1 = 2$ grados de libertad. Esto significa que la **multiplicidad geométrica** es:
$$
m_g(2) = \dim(E_2) = 2
$$

Como $m_g(2) = m_a(2) = 2$, se cumple la condición para este valor propio. Encontramos una base eligiendo dos vectores linealmente independientes:

* Si $y = -1, z = 0 \implies x = 1 \implies v_1 = (-1, 1, 0)$ (haciendo el cambio de signo por conveniencia).
* Si $y = 0, z = -1 \implies x = 1 \implies v_2 = (-1, 0, 1)$.

Así pues, el subespacio propio es:
$$E_2 = \langle (-1, 1, 0), (-1, 0, 1) \rangle$$

B) Para $\lambda_2 = 6$:
Resolvemos el sistema $(A - 6I)v = \vec{0}$:
$$
A - 6I = \begin{pmatrix} -3 & 1 & 1 \\ 2 & -2 & 2 \\ 1 & 1 & -3 \end{pmatrix}
$$

Escalonando o simplificando las ecuaciones:
1.  $-3x + y + z = 0$
2.  $2x - 2y + 2z = 0 \implies x - y + z = 0 \implies y = x + z$
3.  $x + y - 3z = 0$

Sustituimos $y = x + z$ en la ecuación 3:
$$
x + (x + z) - 3z = 0 \implies 2x - 2z = 0 \implies x = z
$$

Si $x = z$, entonces $y = z + z = 2z$. Por tanto, los vectores tienen la forma $(z, 2z, z) = z(1, 2, 1)$.
La **multiplicidad geométrica** es:
$$m_g(6) = \dim(E_6) = 1$$

Como $m_g(6) = m_a(6) = 1$, la condición también se cumple. Un vector que genera este espacio es:
$$v_3 = (1, 2, 1)$$

El subespacio propio es:
$$E_6 = \langle (1, 2, 1) \rangle$$

Como **para todos los valores propios su multiplicidad algebraica es igual a la geométrica**, concluimos que **la matriz $A$ es diagonalizable**.

### Paso 4: Construir las matrices $P$ y $D$
*   La **matriz diagonal $D$** se construye colocando los valores propios en la diagonal en el orden elegido:
    $$
    D = \begin{pmatrix} 2 & 0 & 0 \\ 0 & 2 & 0 \\ 0 & 0 & 6 \end{pmatrix}
    $$

*   La **matriz de cambio de base $P$** se construye situando en columnas los vectores de la base de vectores propios, **en el mismo orden** que sus valores propios en $D$:
    $$
    P = \begin{pmatrix} -1 & -1 & 1 \\ 1 & 0 & 2 \\ 0 & 1 & 1 \end{pmatrix}
    $$

Podemos verificar que se cumple $A = P D P^{-1}$ calculando la inversa de $P$:
$$
P^{-1} = \frac{1}{4} \begin{pmatrix} -2 & 2 & -2 \\ -1 & -1 & 3 \\ 1 & 1 & 1 \end{pmatrix}
$$

Y comprobando multiplicando las matrices que, efectivamente, $A = P D P^{-1}$.

---

## 2. Propiedades

### Matrices triangulares
Si una matriz es triangular (superior o inferior), sus valores propios son directamente los elementos de la **diagonal principal**. Si los elementos de la diagonal son todos distintos, la matriz es diagonalizable.

### Biyectividad y valor propio 0
Un endomorfismo $f$ es **biyectivo** (invertible) si y solo si **$0$ no es valor propio** de $f$. Si $\lambda = 0$ es valor propio, entonces $\ker(f) \neq \{0\}$ y la aplicación no es inyectiva.

### Potencias de matrices
Si $A$ es diagonalizable ($A = P D P^{-1}$), entonces:

$$
A^k = P D^k P^{-1}
$$

Donde $D^k$ es simplemente la matriz diagonal con cada elemento elevado a la potencia $k$. Esto ahorra miles de operaciones en cálculos como $A^{100}$.

> Si $v$ es vector propio de $A$ con valor propio $\lambda$, entonces $v$ es también vector propio de $A^k$ con valor propio **$\lambda^k$**.

Estas propiedades te ayudarán en ejercicios de demostración:

- **Invarianza por escalar:** Si $v$ es vector propio de $f$ con valor propio $\lambda$, entonces $\alpha v$ (con $\alpha \neq 0$) también lo es.
- **Suma de valores propios:** La suma de los valores propios (contando multiplicidades) es igual a la **traza** de la matriz.
- **Producto de valores propios:** El producto de los valores propios es igual al **determinante** de la matriz.
- **Independencia lineal:** Vectores propios asociados a valores propios distintos son siempre linealmente independientes.

---

## 3. Diagonalización de endomorfismos en otros espacios

El concepto es el mismo para espacios de polinomios ($P_n(\mathbb{R})$) o matrices ($\mathcal{M}_n(\mathbb{R})$):

1.  Elige una base (normalmente la canónica).
2.  Encuentra la matriz asociada $M(f, B)$.
3.  Aplica el proceso de diagonalización a esta matriz.
4.  Recuerda que los "vectores propios" resultantes serán las coordenadas de los elementos del espacio original (polinomio, matriz, etc.).

> Si trabajas con parámetros, tendrás que discutir la diagonalizabilidad según los valores de estos que hagan variar las multiplicidades o la existencia de raíces reales.
