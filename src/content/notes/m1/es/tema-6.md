---
title: "Tema 6: Espacios vectoriales"
description: "Introducción a los espacios vectoriales, subespecies, bases y dimensión."
order: 7
readTime: "25 min"
subject: "m1"
draft: false
isUpdated: 1
---

## 1. Espacio vectorial

Aunque a menudo pensamos en los vectores como "flechas" en el espacio, para un matemático, un vector es cualquier cosa que se pueda sumar con otra de su especie y se pueda estirar/multiplicar por un número. Por ejemplo, $\mathbb{R}^2$ o $\mathbb{R}^3$, muchos otros objetos (como matrices o polinomios) se comportan como vectores si tienen una **suma** y un **producto por escalar** definidos. El ejemplo más intuitivo de espacio vectorial es $\mathbb{R}^n$:

$$\mathbb{R}^n = \left\{ \begin{pmatrix} x_1 \\ x_2 \\ \vdots \\ x_n \end{pmatrix} : x_i \in \mathbb{R}, \, 1 \leq i \leq n \right\}$$

::three{type="vis_rn_dimensionality"}

### Operaciones componente a componente

Sean $x = (x_1, \dots, x_n)$ y $y = (y_1, \dots, y_n)$ dos elementos de $\mathbb{R}^n$, y sea $\lambda \in \mathbb{R}$ un escalar:

1.  **Suma**: $x + y = (x_1 + y_1, x_2 + y_2, \dots, x_n + y_n)$
2.  **Producto por escalar**: $\lambda x = (\lambda x_1, \lambda x_2, \dots, \lambda x_n)$

Un **espacio vectorial** sobre un cuerpo $\mathbb{K}$ (que será normalmente $\mathbb{R}$) consiste en un conjunto no vacío $E$, con una operación interna (suma) y una aplicación externa (producto por escalares) que cumplen 8 axiomas:

### Axiomas de la suma

| Axioma | Definición | Ejemplo (en $\mathbb{R}^2$) |
| :--- | :--- | :--- |
| **e1** Asociativa | $u + (v + w) = (u + v) + w$ | $(1,1) + [(2,0) + (0,3)] = [(1,1) + (2,0)] + (0,3)$ |
| **e2** Conmutativa | $u + v = v + u$ | $(1,2) + (3,4) = (3,4) + (1,2) = (4,6)$ |
| **e3** Elemento neutro | $\exists! \, 0_E \in E : u + 0_E = u$ | $(x,y) + (0,0) = (x,y)$ |
| **e4** Elemento opuesto | $\forall u, \exists! \, (-u) : u + (-u) = 0_E$ | $(3,-2) + (-3,2) = (0,0)$ |

::mafs{type="vis_axiomes_suma"}

### Axiomas del producto

| Axioma | Definición | Ejemplo |
| :--- | :--- | :--- |
| **e5** Asociativa | $\lambda(\mu u) = (\lambda\mu)u$ | $2 \cdot (3 \cdot (1,1)) = (2 \cdot 3) \cdot (1,1) = (6,6)$ |
| **e6** Distr. p/ suma de vectores | $\lambda(u + v) = \lambda u + \lambda v$ | $2 \cdot [(1,0) + (0,1)] = 2(1,0) + 2(0,1) = (2,2)$ |
| **e7** Distr. p/ suma de escalares | $(\lambda + \mu)u = \lambda u + \mu u$ | $(2 + 3) \cdot (1,1) = 2(1,1) + 3(1,1) = (5,5)$ |
| **e8** Neutro del producto | $1 \cdot u = u$ | $1 \cdot (x,y) = (x,y)$ |

::mafs{type="vis_axiomes_producte"}

### Ejemplos de espacios vectoriales

Más allá de $\mathbb{R}^n$, encontramos muchos otros conjuntos que cumplen estas propiedades:

*   **Matrices $\mathcal{M}_{m \times n}(\mathbb{K})$**: Con la suma de matrices y el producto por un escalar convencional.
*   **Polinomios $\mathcal{P}(\mathbb{R})$**: Todos los polinomios con coeficientes reales.
*   **Polinomios de grado $\leq d$ ($\mathcal{P}_d(\mathbb{R})$)**: Fijando un grado máximo.
*   **Espacio trivial $\{0_E\}$**: Formado solo por el vector nulo.
*   **Soluciones de un sistema lineal homogéneo**: El conjunto de soluciones de $Ax = 0$ siempre forma un espacio vectorial.

::mafs{type="vis_exemples_espais"}

### Propiedades básicas

Si $v \in E$ y $\lambda \in \mathbb{K}$, siempre se cumple:

1.  **$0 \cdot v = 0_E$**: El escalar cero por el vector da el elemento neutro.
2.  **$\lambda \cdot 0_E = 0_E$**: Cualquier escalar por el vector nulo da el vector nulo.
3.  **Si $\lambda v = 0_E$**, entonces **$\lambda = 0$** o **$v = 0_E$**. (Producto nulo implica uno de los factores nulo).
4.  El elemento opuesto de $v$ es **$(-1)v$**. Normalmente lo escribimos como $-v$.

## 2. Combinación lineal y subespacios vectoriales

### 2.1 Combinación lineal
Imaginemos que los ingredientes son $\vec{v}$ y $\vec{w}$ (los vectores) y los números: $\lambda = 2$ y $\mu = 3$ (los escalares). La combinación lineal es el plato final: $2\vec{v} + 3\vec{w}$.

Dados los vectores $u_1, \dots, u_k \in E$, una **combinación lineal** de estos es cualquier expresión de la forma:
$$v = \lambda_1 u_1 + \lambda_2 u_2 + \dots + \lambda_k u_k$$
donde los $\lambda_i$ son escalares.

::mafs{type="vis_combinacio_lineal"}

### 2.2 Subespacios vectoriales
Un **subespacio vectorial** es un subconjunto de un espacio que **se comporta exactamente igual que el espacio original**. 

Es un universo dentro de otro universo que conserva la misma "física" (las operaciones de suma y producto). Este subconjunto es **autónomo**: si te limitas a operar con sus vectores haciendo **combinaciones lineales**, nunca podrás escapar.

Para que esto sea posible, hay dos requisitos:
1.  **El origen debe estar ahí**: No puedes tener un universo sin un centro de coordenadas $(0,0,0)$.
2.  **La estructura debe ser plana**: Cualquier curvatura o límite finito haría que, al estirar un vector, salieses al espacio exterior. Por eso los subespacios siempre son rectas, planos o hiperplanos que pasan por el origen.

Formalmente, un subconjunto no vacío $S \subseteq E$ es un **subespacio vectorial** si él mismo tiene estructura de espacio vectorial con las mismas operaciones que $E$. En la práctica, solo hay que verificar que es **cerrado por combinaciones lineales**:

1.  **Contiene el vector nulo**: $0_E \in S$. (Si no está, ya sabemos seguro que no es subespacio).
2.  **Suma cerrada**: Para todo $u, v \in S \implies u + v \in S$.
3.  **Producto cerrado**: Para todo $u \in S$ y $\lambda \in \mathbb{K} \implies \lambda u \in S$.

::mafs{type="vis_sev_intro"}

> El vector nulo **$0_E$** pertenece a todos los subespacios vectoriales. Si un conjunto no contiene el cero, **no** puede ser un subespacio.

### 2.3 Independencia lineal

Un conjunto de vectores $\{u_1, \dots, u_k\}$ es **linealmente independiente (LI)** si cada uno aporta una **información nueva**. Si uno fuese **linealmente dependiente (LD)**, querría decir que "sobra" porque lo puedes fabricar combinando los otros. Por ejemplo: 
*   **LI (Independientes)**: $u = (1, 0)$ y $v = (0, 1)$. No hay forma de multiplicar el $(1,0)$ por un número y que te dé el $(0,1)$. Son caminos totalmente diferentes.
*   **LD (Dependientes)**: $u = (1, 2)$ y $v = (2, 4)$. Aquí $v = 2u$. El vector $v$ no nos dice nada nuevo, es solo el vector $u$ estirado. **Sobra**.

Para saber si un conjunto es LI o LD, tenemos tres métodos principales:

### Método 1: La ecuación fundamental (Definición)
A partir de la definición, planteamos la ecuación:
$$\lambda_1 u_1 + \lambda_2 u_2 + \dots + \lambda_k u_k = 0_E$$

*   Si la **única** solución es la trivial ($\lambda_1 = \dots = \lambda_k = 0$) $\implies$ **LI**.
*   Si encontramos cualquier otra combinación $\implies$ **LD**.

**Ejemplo (Polinomios)**: ¿Son $p_1 = x+1$ y $p_2 = x-1$ independientes?
$\lambda_1(x+1) + \lambda_2(x-1) = 0 \implies (\lambda_1+\lambda_2)x + (\lambda_1-\lambda_2) = 0$.
Resolviendo el sistema $\lambda_1+\lambda_2=0$ y $\lambda_1-\lambda_2=0$, obtenemos $\lambda_1=0$ y $\lambda_2=0$. Son **LI**.

### Método 2: El Rango (Para vectores en $\mathbb{R}^n$)
Si tenemos vectores numéricos, lo más rápido es ponerlos por columnas en una matriz $A$ y calcular su **rango** ($r$).
*   Si **$r = \text{número de vectores}$** $\implies$ **LI**.
*   Si **$r < \text{número de vectores}$** $\implies$ **LD**.

**Ejemplo**: Para $u=(1,0,1)$, $v=(0,1,1)$ y $w=(1,1,2)$, el rango de la matriz es 2 (porque $w = u + v$). Como tenemos 3 vectores pero el rango es 2, el conjunto es **LD**.

### Método 3: Resolución de sistemas (SCD/SCI)
Cuando planteamos la ecuación fundamental como un sistema de ecuaciones lineales homogéneo ($Ax=0$):
*   Si el sistema es **Compatible Determinado (SCD)** $\implies$ la única solución es la cero $\implies$ **LI**.
*   Si el sistema es **Compatible Indeterminado (SCI)** $\implies$ hay infinitas combinaciones posibles $\implies$ **LD**.

### 2.4 Subespacio generado
El **subespacio generado** por un conjunto de vectores $\{u_1, \dots, u_k\}$, simbolizado por $\langle u_1, \dots, u_k \rangle$, es el conjunto de **todas** sus combinaciones lineales posibles. Es el subespacio vectorial más pequeño que contiene estos vectores.

::mafs{type="vis_independencia_lineal"}

### 2.5 Operaciones con subespacios

Cuando tenemos dos subespacios $S$ y $W$ (dos mini-universos), podemos intentar combinarlos. Pero no todas las combinaciones respetan las "leyes de la física" vectorial.

::mafs{type="vis_operacions_sev"}

### 1. Intersección ($S \cap W$)
La intersección es el conjunto de vectores que **pertenecen a los dos universos al mismo tiempo**.
*   **Intuición**: Si tienes dos planos que pasan por el origen, su intersección es la recta donde se cortan. Como los dos planos son "estables", el terreno que comparten también lo es.
*   **Regla de oro**: La intersección de subespacios **SIEMPRE** es un subespacio vectorial.

### 2. Unión ($S \cup W$)
Intentar unir dos subespacios simplemente "juntándolos" (como si fuesen dos pegatinas) **no funciona**.
*   **Intuición**: Imagina dos rectas (el eje X y el eje Y). La unión son solo los puntos que están sobre los ejes. Pero si sumas el vector $(1,0)$ del eje X y el $(0,1)$ del eje Y, obtienes el $(1,1)$, que está en medio del plano y **fuera de los ejes**. ¡Has salido del "club"!
*   **Conclusión**: La unión **NO** es normalmente un subespacio.

### 3. Suma ($S + W$): La expansión
Como la unión falla, la **suma** es la solución para fusionar subespacios. Consiste en tomar todas las sumas posibles entre un vector de $S$ y uno de $W$.
*   **Intuición**: Es como tomar dos rectas y "llenar" todo el espacio que hay entre ellas hasta formar un plano completo. La suma **siempre** es un subespacio (el más pequeño que contiene a $S$ y $W$).
*   **En la práctica**: Para encontrar una base de $S+W$, juntamos los generadores de $S$ y los de $W$ y eliminamos los que sobren (los dependientes).

### 4. Suma Directa ($S \oplus W$): Independencia absoluta
Decimos que la suma es **directa** si los dos universos **solo se tocan en el vector nulo** ($S \cap W = \{0_E\}$). 
*   **Intuición**: Es la fusión más "limpia" posible. Significa que cada vector del espacio resultante se puede escribir de **forma única** como una parte de $S$ y una parte de $W$. No hay redundancia.

---

## 3. Bases y dimensión

### Dimensión
La **dimensión** ($\dim E$) es el número de vectores que tiene cualquiera de sus bases.

| Espacio | Dimensión |
| :--- | :--- |
| $\mathbb{R}^n$ | $n$ |
| $\mathcal{M}_{m \times n}(\mathbb{K})$ | $m \cdot n$ |
| $\mathcal{P}_d(\mathbb{R})$ | $d + 1$ |
| Subespacio trivial $\{0_E\}$ | $0$ |

### Fórmula de Grassmann
Vital para ejercicios de sumas e intersecciones:
$$\dim(S+W) = \dim S + \dim W - \dim(S \cap W)$$

Sean $k$ vectores en un espacio $E$ de dimensión $n$:
1. **$k > n$**: El conjunto es **siempre LD** (sobran vectores).
2. **$k < n$**: El conjunto **no puede generar** $E$ (faltan vectores).
3. **$k = n$**: Si demuestras que son **LI** (o que generan), automáticamente son **Base**. (¡Esto te ahorra la mitad del trabajo!).

::mafs{type="vis_regles_or_base"}

---

## 4. Coordenadas y cambio de base

Cualquier vector $v$ se expresa de forma única en una base $B$ mediante sus **coordenadas** $v_B$. La matriz de cambio de base $P_{B'}^B$ las relaciona:
$$v_{B'} = P_{B'}^B \cdot v_B$$

::mafs{type="vis_canvi_base"}

:::tip{title="La clave del Cambio de Base (Ejercicio 6.40)"}
La matriz de cambio de base de la canónica a B (**$P_{can}^B$**) se obtiene poniendo los vectores de la base B **por columnas**. 
Esto significa que si conoces las coordenadas en base $B$, puedes encontrar el vector "normal" (canónico) haciendo: $v_{can} = P_{can}^B \cdot v_B$.
:::