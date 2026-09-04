---
title: "Tema 7: Func. de varias variables"
description: "Introducción al espacio euclídeo Rn, topología básica (abiertos, cerrados, compactos), gráficas de superficies y curvas de nivel."
order: 7
readTime: "30 min"
subject: "m2"
draft: false
isUpdated: 1
---

## 1. El espacio euclídeo $\mathbb{R}^n$ y la distancia

En el espacio $n$-dimensional de números reales, denotado por $\mathbb{R}^n$, la n-upla $(x_1, \dots, x_n)$ representa un punto o vector. Para medir la "proximidad" entre puntos necesitamos una función de distancia. La distancia entre dos puntos $\mathbf{x}$ e $\mathbf{y}$ es la longitud del segmento que los une:
$$d(\mathbf{x}, \mathbf{y}) = \sqrt{(x_1-y_1)^2 + (x_2-y_2)^2 + \dots + (x_n-y_n)^2}$$

::threeviz{type="vis_distancia_sync_3d_2d"}

---

## 2. El concepto de "n-bola"

La bola es la extensión del concepto de intervalo de $\mathbb{R}$ a cualquier dimensión.

* **Bola Abierta ($B_r(\mathbf{a})$)**: Conjunto de puntos a distancia menor que $r$.
$$B(\vec{a}, r) = \{ \vec{x} \in \mathbb{R}^n : d(\vec{x}, \vec{a}) < r \}$$
* **Bola Cerrada ($\bar{B}_r(\mathbf{a})$)**: Incluye los puntos que están exactamente a distancia $r$.
$$\bar{B}(\vec{a}, r) = \{ \vec{x} \in \mathbb{R}^n : d(\vec{x}, \vec{a}) \le r \}$$

::mafs{type="vis_bola_interactiva"}

---

## 3. Metodología de cálculo de dominios

| Si ves... | Atención a... | Condición |
| :--- | :--- | :--- |
| **Raíces** ($\sqrt{g}$) | El interior | $g(x, y) \ge 0$ |
| **Logs** ($\ln g$) | El argumento | $g(x, y) > 0$ |
| **Fracciones** ($1/g$) | El denominador | $g(x, y) \neq 0$ |

### Método de los puntos de prueba
Es la "receta" para dibujar inecuaciones (ej: $x^2 + y^2 \le 4$):

1. **Dibuja el borde**: Haz como si fuera un igual ($x^2 + y^2 = 4$). Dibuja la línea.
2. **Elige un punto**: Coge el $(0,0)$ o cualquier punto fácil que no esté en la línea.
3. **Comprueba**: Si el punto cumple la inecuación $\implies$ **Sombrea** todo su lado.

::mafs{type="vis_metode_punts_prova"}

---

## 4. Topología práctica

Sea $A \subseteq \mathbb{R}^n$ un conjunto. Cada punto del espacio puede ser:

1. **Punto interior**: Si podemos "encerrarlo" en una bola pequeña que esté toda dentro de $A$. El conjunto de puntos interiores es el **Interior ($A^\circ$)**.
2. **Punto de frontera**: Si cualquier bola que hagamos a su alrededor corta tanto a $A$ como a su complementario. El conjunto de puntos frontera es la **Frontera ($Fr(A)$)**.
3. **Punto adherente**: Si cualquier bola que hagamos a su alrededor corta a $A$. La **Adherencia ($\bar{A}$)** es la unión: $\bar{A} = A \cup Fr(A)$.

### El ejemplo del triángulo
Observemos cómo se aplican estos conceptos al conjunto:
$$A = \{(x, y) \in \mathbb{R}^2 : x \ge 0, y \ge 0, x+y < 1\}$$

::mafs{type="vis_ex_pissarra_topologia"}

---

## 5. Clasificación de conjuntos

Podemos describir los conjuntos según el comportamiento de su frontera:

- **Abierto**: Si no contiene ningún punto de su frontera ($A \cap Fr(A) = \emptyset$). Equivale a decir que $A = A^\circ$.
- **Cerrado**: Si contiene toda su frontera ($Fr(A) \subseteq A$). Equivale a decir que $A = \bar{A}$.
- **Acotado**: Si el conjunto se puede encerrar dentro de una bola de radio finito.
- **Compacto**: Muy importante para el cálculo de extremos. Un conjunto es compacto si es **cerrado y acotado**.

::mafs{type="vis_classificacio_conjunts"}

---

## 6. Bordes y cónicas

| Nombre | Ecuación Canónica | Significado de los Parámetros |
| :--- | :--- | :--- |
| **Circunferencia** | $x^2 + y^2 = r^2$ | $r$: Radio del círculo |
| **Elipse** | $\frac{x^2}{a^2} + \frac{y^2}{b^2} = 1$ | $a, b$: Semiejes (radio en $x$ e $y$) |
| **Hipérbola** | $\frac{x^2}{a^2} - \frac{y^2}{b^2} = 1$ | $a$: Distancia del centro al vértice |
| **Hipérbola (Equilátera)** | $xy = k$ | $k$: Determina la distancia a los ejes |
| **Parábola** | $y = a x^2$ | $a$: Factor de apertura (más grande $\implies$ más estrecha) |
| **Diamante** | $\lvert x \rvert + \lvert y \rvert = k$ | $k$: Distancia del centro a los vértices |
| **Cuadrado** | $\max(\lvert x \rvert, \lvert y \rvert) = k$ | $k$: Semilado (distancia del centro a los lados) |

::mafs{type="vis_cheat_sheet_coniques"}

---

## 7. Geometría en el espacio $\mathbb{R}^3$

Para los ejercicios de conjuntos en 3D, las superficies "madre" son:

| Superficie | Ecuación | Descripción Visual |
| :--- | :--- | :--- |
| **Plano** | $Ax + By + Cz = D$ | Hoja de papel infinita |
| **Esfera** | $x^2 + y^2 + z^2 = r^2$ | Pelota de ping-pong |
| **Cilindro** | $x^2 + y^2 = r^2$ | Tubo infinito (eje Z) |
| **Paraboloide** | $z = x^2 + y^2$ | Copa / Bol |

::threeviz{type="vis_superficies_basiques_3d"}

### Curvas de Nivel
Son las líneas de "corte" a una altura $k$ constante ($f(x, y) = k$).

::threeviz{type="vis_corbes_nivell_3d_2d"}
