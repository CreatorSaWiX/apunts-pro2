---
title: "Tema 9: Taylor varias variables"
description: "Derivadas de orden superior, Teorema de Schwarz y la aproximación de superficies mediante polinomios de Taylor de grado n."
order: 9
readTime: "30 min"
subject: "m2"
draft: false
isNew: true
---

El objetivo de este tema es extender la aproximación lineal (el plano tangente) a aproximaciones de grado superior que capturen la curvatura de las superficies.

## 1. Derivadas de Orden Superior

Si una función $f$ admite derivadas parciales en un entorno, estas funciones pueden ser, a su vez, derivables.

- **Derivadas segundas**: $\frac{\partial^2 f}{\partial x^2}, \frac{\partial^2 f}{\partial y^2}, \frac{\partial^2 f}{\partial x \partial y}, \frac{\partial^2 f}{\partial y \partial x}$.
- **Regularidad**: Como hemos visto en el Tema 8, decimos que $f$ es de clase $C^k$ si todas sus derivadas parciales hasta orden $k$ existen y son continuas. Esta es la **condición de seguridad** para poder hacer Taylor de grado $k$.

> **Teorema de Schwarz**: Si $f$ es de clase $C^2$ en un abierto $U$, entonces las derivadas parciales cruzadas coinciden:
> $$\frac{\partial^2 f}{\partial x \partial y} = \frac{\partial^2 f}{\partial y \partial x}$$
> Esto reduce el número de cálculos (de 4 a 3 derivadas segundas en $\mathbb{R}^2$) y garantiza que la matriz Hessiana sea **simétrica**.

::three{type="vis_teorema_schwarz"}

---

## 2. El Polinomio de Taylor Multivariable

El polinomio de Taylor de grado $n$ en el punto $\mathbf{a}$ aproxima la función $f$ cerca de aquel punto.

### Fórmula desplegada (Grau 2)
Para cálculos manuales en dos variables cerca de $(a, b)$:
$$
P_2(x, y) = f(a, b) + \left[ f_x(a,b)(x-a) + f_y(a,b)(y-b) \right] + \frac{1}{2} \left[ f_{xx}(a,b)(x-a)^2 + 2f_{xy}(a,b)(x-a)(y-b) + f_{yy}(a,b)(y-b)^2 \right]
$$

::three{type="vis_taylor_graun"}

### Notación Matricial (Compacta)
Muy útil en computación y para más de 2 variables:
$$P_2(\mathbf{x}) = f(\mathbf{a}) + \nabla f(\mathbf{a})^T (\mathbf{x}-\mathbf{a}) + \frac{1}{2} (\mathbf{x}-\mathbf{a})^T Hf(\mathbf{a}) (\mathbf{x}-\mathbf{a})$$

> [!TIP]
> **Estrategia de Examen: El "Truco de la Sustitución"**
> Si tienes que calcular el polinomio en el origen $(0,0)$ de una función compuesta como $f(x,y) = \ln(1+2x+3y)$, **¡no derives 5 veces!** 
> 1. Identifica el núcleo de la función: $\ln(1+t)$.
> 2. Usa el desarrollo de Taylor 1D: $t - \frac{t^2}{2} + \dots$
> 3. Sustituye $t = 2x+3y$ y desarrolla algebraicamente.
> *Esta técnica es mucho más rápida y segura.*

::threeviz{type="taylor_3d"}

---

## 3. El Diferencial y el Incremento
Una interpretación clave de Taylor es separar la función en parte constante, lineal y error:
$$f(x,y) = f(a,b) + \underbrace{f_x dx + f_y dy}_{df \text{ (Diferencial)}} + R_1$$

::three{type="vis_diferencial_increment"}

El **Diferencial** ($df$) representa el incremento aproximado de la función cuando nos movemos una distancia pequeña $(dx, dy)$ desde el punto inicial.

---

## 4. Matriz Hessiana y Geometría de los Extremos

La **Matriz Hessiana** define la "curva" de la superficie en todas las direcciones simultáneamente.

### Criterio e Interpretación Visual
Sea $\Delta = \det(Hf(a))$ el determinante:

| Criterio | Tipo de extremo | Forma Geométrica |
| :--- | :--- | :--- |
| $\Delta > 0, f_{xx} > 0$ | **Mínimo relativo** | **Bol / Taza**: Crece en todas direcciones. |
| $\Delta > 0, f_{xx} < 0$ | **Máximo relativo** | **Montaña / Cúpula**: Decrece en todas direcciones. |
| $\Delta < 0$ | **Punto de silla** | **Silla de montar**: Sube en una vía y baja en la otra. |
| $\Delta = 0$ | **Inconcluyente** | Hay que hacer un **estudio local** o por rectas. |
 
::three{type="vis_extrems_hessiana"}

> **Si $\Delta = 0$**: La Hessiana no nos da suficiente información. Como hemos visto en el ejercicio 9.3c, hay que analizar la función en ejes o curvas para ver si cambia de signo alrededor del punto crítico.

---

## 5. Aproximación y Cota del Error

El error cometido al usar $P_n$ se llama **Resto de Lagrange**. Para una aproximación lineal (grado 1), el error se acota por:

$$|R_1(x,y)| \leq \frac{1}{2} \left[ M_{xx} |h|^2 + 2M_{xy} |hk| + M_{yy} |k|^2 \right]$$

Donde $h = x-a, k = y-b$ y las $M$ son el **valor máximo absoluto** de las segundas derivadas en el segmento que conecta $(a,b)$ con el punto de aproximación.

::three{type="vis_fita_error_lagrange"}

Para simplificar cálculos en exámenes, a menudo se usa una cota más relajada:
$$|R_1| \leq \frac{1}{2} M_{global} (|h| + |k|)^2$$
