---
title: "Tema 9: Taylor varias variables"
description: "Derivadas de orden superior, Teorema de Schwarz y la aproximación de superficies mediante polinomios de Taylor de grado n."
order: 9
readTime: "30 min"
subject: "m2"
draft: false
isUpdated: 1
---

## 1. Derivadas de orden superior, hessiana y extremos

Si una función $f$ admite derivadas parciales en un entorno, estas funciones pueden ser, a su vez, derivables.

- **Derivadas segundas**: $\frac{\partial^2 f}{\partial x^2}, \frac{\partial^2 f}{\partial y^2}, \frac{\partial^2 f}{\partial x \partial y}, \frac{\partial^2 f}{\partial y \partial x}$.
- **Regularidad**: Como hemos visto en el Tema 8, decimos que $f$ es de clase $C^k$ si todas sus derivadas parciales hasta orden $k$ existen y son continuas. Esta es la **condición de seguridad** para poder hacer Taylor de grado $k$.

En el caso general de $n$ variables $\mathbf{x} = (x_1, \dots, x_n)$, la **Matriz Hessiana** en un punto $\mathbf{a}$ es:

$$
Hf(\mathbf{a}) = \begin{pmatrix} 
\frac{\partial^2 f}{\partial x_1^2}(\mathbf{a}) & \frac{\partial^2 f}{\partial x_2 \partial x_1}(\mathbf{a}) & \dots & \frac{\partial^2 f}{\partial x_n \partial x_1}(\mathbf{a}) \\
\frac{\partial^2 f}{\partial x_1 \partial x_2}(\mathbf{a}) & \frac{\partial^2 f}{\partial x_2^2}(\mathbf{a}) & \dots & \frac{\partial^2 f}{\partial x_n \partial x_2}(\mathbf{a}) \\
\vdots & \vdots & \ddots & \vdots \\
\frac{\partial^2 f}{\partial x_1 \partial x_n}(\mathbf{a}) & \frac{\partial^2 f}{\partial x_2 \partial x_n}(\mathbf{a}) & \dots & \frac{\partial^2 f}{\partial x_n^2}(\mathbf{a}) 
\end{pmatrix}
$$

Para el caso de dos variables $(x,y)$, que es el que usaremos más a menudo, la matriz se reduce a:

$$
Hf(x,y) = \begin{pmatrix} 
\frac{\partial^2 f}{\partial x^2} & \frac{\partial^2 f}{\partial x \partial y} \\
\frac{\partial^2 f}{\partial y \partial x} & \frac{\partial^2 f}{\partial y^2} 
\end{pmatrix}
$$

> **Teorema de Schwarz**: Si $f$ es de clase $C^2$ en un abierto $U$, entonces las derivadas parciales cruzadas coinciden:
> $$\frac{\partial^2 f}{\partial x \partial y} = \frac{\partial^2 f}{\partial y \partial x}$$
> Esto reduce el número de cálculos (de 4 a 3 derivadas segundas en $\mathbb{R}^2$) y garantiza que la matriz Hessiana sea **simétrica**.

::three{type="vis_teorema_schwarz"}

### Criterio e Interpretación Visual
Sea $\Delta = \det(Hf(a))$ el determinante:

| Criterio | Tipo de extremo | Forma Geométrica |
| :--- | :--- | :--- |
| $\Delta > 0, \frac{\partial^2 f}{\partial x^2} > 0$ | **Mínimo relativo** | **Bol / Taza**: Crece en todas direcciones. |
| $\Delta > 0, \frac{\partial^2 f}{\partial x^2} < 0$ | **Máximo relativo** | **Montaña / Cúpula**: Decrece en todas direcciones. |
| $\Delta < 0$ | **Punto de silla** | **Silla de montar**: Sube en una vía y baja en la otra. |
| $\Delta = 0$ | **Inconcluyente** | Hay que hacer un **estudio local** o por rectas. |
 
::three{type="vis_extrems_hessiana"}

> **Si $\Delta = 0$**: La Hessiana no nos da suficiente información. Como hemos visto en el ejercicio 9.3c, hay que analizar la función en ejes o curvas para ver si cambia de signo alrededor del punto crítico.


---

## 2. El Polinomio de Taylor Multivariable

El polinomio de Taylor de grado $n$ en el punto $\mathbf{a}$ aproxima la función $f$ cerca de aquel punto.

### Fórmula desplegada (Grado 1 y 2)
Para cálculos manuales en dos variables cerca de $(a, b)$:
$$
P_1(x, y) = f(a, b) + \left[ \frac{\partial f}{\partial x}(a,b)(x-a) + \frac{\partial f}{\partial y}(a,b)(y-b) \right] 
$$
$$
P_2(x, y) = P_1(x,y) + \frac{1}{2!} \left[ \frac{\partial^2 f}{\partial x^2}(a,b)(x-a)^2 + 2\frac{\partial^2 f}{\partial x \partial y}(a,b)(x-a)(y-b) + \frac{\partial^2 f}{\partial y^2}(a,b)(y-b)^2 \right]
$$

> El polinomio de Taylor de grado 1 coincide con la ecuación del plano tangente

::three{type="vis_taylor_graun"}

<!-- ### Notación Matricial (Compacta)
Muy útil en computación y para más de 2 variables:
$$P_2(\mathbf{x}) = f(\mathbf{a}) + \nabla f(\mathbf{a})^T (\mathbf{x}-\mathbf{a}) + \frac{1}{2} (\mathbf{x}-\mathbf{a})^T Hf(\mathbf{a}) (\mathbf{x}-\mathbf{a})$$

> **Estrategia de Examen: El "Truco de la Sustitución"**
> Si tienes que calcular el polinomio en el origen $(0,0)$ de una función compuesta como $f(x,y) = \ln(1+2x+3y)$, **¡no derives 5 veces!** 
> 1. Identifica el corazón de la función: $\ln(1+t)$.
> 2. Usa el desarrollo de Taylor 1D: $t - \frac{t^2}{2} + \dots$
> 3. Sustituye $t = 2x+3y$ y desarrolla algebraicamente.
> *Esta técnica es mucho más rápida y segura.*

::threeviz{type="taylor_3d"} -->

---

## 3. Resto de Lagrange

El error cometido al usar el polinomio $P_n$ se llama **Resto de Lagrange**. Utilizamos una notación basada en una **identidad notable** (como el binomio de Newton) para hacerla más fácil de recordar:

$$
R_n(x,y) = \frac{1}{(n+1)!} \left[ h \frac{\partial}{\partial x} + k \frac{\partial}{\partial y} \right]^{n+1} f(c,d)
$$

Donde $h=(x-a)$ y $k=(y-b)$. El punto $(c,d)$ pertenece al segmento que une el punto de aproximación con el centro. Según el grado, se expande así:

**Resto de grado 1 ($n=1$):** Parece un cuadrado perfecto $(\alpha+\beta)^2$:
$$
R_1(x,y) = \frac{1}{2!} \left[ h^2 \frac{\partial^2 f}{\partial x^2}(c,d) + 2hk \frac{\partial^2 f}{\partial y \partial x}(c,d) + k^2 \frac{\partial^2 f}{\partial y^2}(c,d) \right]
$$

**Resto de grado 2 ($n=2$):** Parece un cubo perfecto $(\alpha+\beta)^3$:
$$
R_2(x,y) = \frac{1}{6} \left[ h^3 \frac{\partial^3 f}{\partial x^3}(c,d) + 3h^2k \frac{\partial^3 f}{\partial y \partial x^2}(c,d) + 3hk^2 \frac{\partial^3 f}{\partial y^2 \partial x}(c,d) + k^3 \frac{\partial^3 f}{\partial y^3}(c,d) \right]
$$

Para calcular la cota superior $|R_n| \leq \dots$, aplicamos el valor absoluto a la expansión correspondiente y sustituimos cada derivada por su **valor máximo absoluto ($M$)** en el segmento que une el origen con el punto $(x,y)$.

**Cota para grado 1:**
$$
|R_1(x,y)| \leq \frac{1}{2} \left[ M_{\frac{\partial^2 f}{\partial x^2}} |h|^2 + 2M_{\frac{\partial^2 f}{\partial y \partial x}} |hk| + M_{\frac{\partial^2 f}{\partial y^2}} |k|^2 \right]
$$

**Cota para grado 2:**
$$
|R_2(x,y)| \leq \frac{1}{6} \left[ M_{\frac{\partial^3 f}{\partial x^3}} |h|^3 + 3M_{\frac{\partial^3 f}{\partial y \partial x^2}} |h^2 k| + 3M_{\frac{\partial^3 f}{\partial y^2 \partial x}} |h k^2| + M_{\frac{\partial^3 f}{\partial y^3}} |k|^3 \right]
$$

::three{type="vis_fita_error_lagrange"}

<!-- Para simplificar cálculos en exámenes, a menudo se usa una cota más relajada:
$$|R_1| \leq \frac{1}{2} M_{global} (|h| + |k|)^2$$ -->


---

## 4. El Diferencial y el Incremento
Una interpretación clave de Taylor es separar la función en parte constante, lineal y error:

$$
f(x,y) = f(a,b) + \underbrace{\frac{\partial f}{\partial x} dx + \frac{\partial f}{\partial y} dy}_{df \text{ (Diferencial)}} + R_1
$$

::three{type="vis_diferencial_increment"}

El **Diferencial** ($df$) representa el incremento aproximado de la función cuando nos movemos una distancia pequeña $(dx, dy)$ desde el punto inicial.
