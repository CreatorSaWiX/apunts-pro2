---
title: "Tema 10: Optimización de varias variables"
description: "Estudio de puntos críticos, extremos relativos, condicionados (Lagrange) y absolutos en conjuntos compactos."
order: 10
readTime: "45 min"
subject: "m2"
draft: false
isNew: true
---

La optimización consiste en encontrar los valores donde una función alcanza su máximo o mínimo. En varias variables, distinguimos tres escenarios: extremos **libres** (sin restricciones), extremos **condicionados** (sobre una curva o superficie) y extremos **absolutos** (en un dominio cerrado y acotado).

## 1. Extremos Relativos (Libres)

Sea $f: U \subseteq \mathbb{R}^n \to \mathbb{R}$ una función definida en un abierto $U$.

### Definiciones
- **Máximo Relativo**: Un punto $\mathbf{a}$ es un máximo si $f(\mathbf{x}) \leq f(\mathbf{a})$ para todo $\mathbf{x}$ en un entorno de $\mathbf{a}$.
- **Mínimo Relativo**: Un punto $\mathbf{a}$ es un mínimo si $f(\mathbf{x}) \geq f(\mathbf{a})$ para todo $\mathbf{x}$ en un entorno de $\mathbf{a}$.
- **Punto Crítico (Estacionario)**: Punto donde $\nabla f(\mathbf{a}) = \mathbf{0}$, es decir, todas las derivadas parciales se anulan.

> **Condición Necesaria**: Si $f$ es derivable y tiene un extremo relativo en $\mathbf{a}$, entonces $\nabla f(\mathbf{a}) = \mathbf{0}$. El recíproco **no** es cierto: un punto crítico puede ser un punto de silla.

### Clasificación por la Matriz Hessiana (2 variables)
Sea $(a,b)$ un punto crítico de $f \in \mathcal{C}^2$. Analizamos el determinante $\Delta = \det(Hf(a,b))$:

1. **$\Delta > 0$**: Hay un extremo.
   - Si $\frac{\partial^2 f}{\partial x^2}(a,b) > 0 \implies$ **Mínimo Relativo**.
   - Si $\frac{\partial^2 f}{\partial x^2}(a,b) < 0 \implies$ **Máximo Relativo**.
2. **$\Delta < 0$**: El punto es un **Punto de Silla** (la función crece en alguna dirección y decrece en otra).
3. **$\Delta = 0$**: El criterio **no decide**. Hay que analizar el comportamiento alrededor del punto.
 
::three{type="vis_extrems_hessiana"}
 
> [!TIP]
> **Ninja Trick: Completar Cuadrados**
> Si la función es un polinomio de grado 2 (como $f(x,y) = x^2 + 2xy + 3y^2$), puedes completar cuadrados para ver si es una suma de cuadrados positivos (mínimo) o negativos (máximo). ¡Es mucho más rápido que calcular la Hessiana!

> **Cuando $\Delta = 0$**: Prueba estudiar $f$ sobre rectas que pasen por el punto (ej. $y = 0$ o $y = x$). Otra herramienta muy potente es **completar cuadrados**: si puedes escribir $f(x,y) - f(a,b)$ como una forma que es siempre positiva (o siempre negativa), tienes un mínimo (o máximo) global sin necesidad de la Hessiana.

---

## 2. Extremos Condicionados (Multiplicadores de Lagrange)

Buscamos los extremos de $f(\mathbf{x})$ sobre el conjunto definido por una restricción $g(\mathbf{x}) = 0$.

La idea geométrica: los extremos condicionados se encuentran allí donde la **curva de nivel de $f$ es tangente a la curva de restricción $g = 0$**. Cuando dos curvas son tangentes, sus gradientes deben ser paralelos.

### El Teorema de Lagrange
Esto se formaliza con el sistema:
$$
\begin{cases}
\nabla f(\mathbf{x}) = \lambda \, \nabla g(\mathbf{x}) \\
g(\mathbf{x}) = 0
\end{cases}
$$
Donde $\lambda$ es el **multiplicador de Lagrange**. Para múltiples restricciones $g_1 = 0, \ldots, g_m = 0$, generaliza a $\nabla f = \sum_j \lambda_j \nabla g_j$.

::three{type="vis_lagrange_multiplicadors"}

> [!IMPORTANT]
> **El Significado de $\lambda$**
> El multiplicador $\lambda$ indica la tasa de variación del valor optimizado de $f$ respecto a cambios en la restricción $c$. Si "relajamos" un poco la restricción, ¿cuánto mejorará nuestro beneficio? Eso es $\lambda$.

### Cómo resolver el sistema
Resolver $\nabla f = \lambda \nabla g$ puede ser algebraicamente pesado. Tres estrategias que a menudo simplifican mucho:

1. **Elimina $\lambda$**: Aísla $\lambda$ de cada ecuación e iguálalas. Esto da una relación directa entre $x$ e $y$. Cuidado: no dividas por cero; trata $x = 0$ e $y = 0$ como casos separados.

2. **Aprovecha simetrías**: Si las ecuaciones para $x$ y para $y$ son casi idénticas, prueba $x = \pm y$ como candidato. Muchos ejercicios de examen están construidos con esta simetría oculta.

3. **Sustitución directa en lugar de Lagrange**: Si la restricción es una recta (ej. $y = 1 - x$) o permite aislar fácilmente una variable, sustitúyela directamente en $f$ y convierte el problema en una función de **una sola variable**. Es más rápido y seguro.

> **Sustitución parcial para circunferencias**: Si la restricción es $x^2 + y^2 = R^2$ y la función $f$ contiene el término $x^2 + y^2$, puedes sustituirlo directamente por $R^2$ y reducir $f$ a una expresión mucho más sencilla antes de derivar.

---

## 3. Optimización en Dominios Compactos (Weierstrass)

El **Teorema de Weierstrass** garantiza que si una función es continua en un dominio cerrado y acotado (compacto), entonces tiene un **máximo y un mínimo absolutos**.

### Procedimiento de búsqueda
Para encontrarlos, no basta con mirar el interior; hace falta un rastreo exhaustivo:

1.  **Interior**: Buscamos puntos críticos donde $\nabla f = (0,0)$.
    > Comprueba siempre si el punto crítico cae **dentro** del dominio. Si cae fuera, se ignora para la búsqueda de extremos absolutos.

2.  **Frontera de $K$**: Aplica Lagrange o parametriza la frontera para reducirla a una variable.

3.  **Vértices y Puntos de Ruptura**:

    > Si el dominio es un polígono (triángulo, cuadrado...), **Lagrange no detecta los vértices automáticamente** porque la frontera no es derivable en esos puntos. Tienes que evaluar $f$ en cada vértice manualmente. A menudo el máximo o mínimo absoluto se encuentra precisamente en una esquina.

::three{type="vis_optimitzacio_compacte"}

Una vez tienes todos los candidatos, el valor más grande es el **máximo absoluto** y el más pequeño el **mínimo absoluto**.

> Si el dominio **no** es compacto (por ejemplo, todo $\mathbb{R}^2$), el Teorema de Weierstrass no se aplica y los extremos absolutos podrían no existir.

---

## 4. Problema Modelo: Estrategia Completa

Con toda la teoría a mano, apliquémosla de arriba a abajo. Queremos los extremos absolutos de $f(x,y) = x^2 + y^2 - 2x$ en el disco cerrado $D = \{(x,y) : x^2 + y^2 \leq 4\}$.

### Paso 1: Interior — Puntos Críticos Libres
Calculamos $\nabla f = (2x - 2,\ 2y)$ e igualamos a cero:
$$2x - 2 = 0 \implies x = 1, \quad 2y = 0 \implies y = 0$$
**Punto crítico**: $(1, 0)$. Comprobamos que es interior: $1^2 + 0^2 = 1 \leq 4$. ✓

Valor: $f(1, 0) = 1 + 0 - 2 = -1$.

### Paso 2: Frontera — Extremos Condicionados
La frontera es la circunferencia $x^2 + y^2 = 4$.

Aplicamos la sustitución parcial: como en la frontera $x^2 + y^2 = 4$, sustituimos directamente:
$$f(x,y) = \underbrace{(x^2 + y^2)}_{=4} - 2x = 4 - 2x$$
Como sobre la circunferencia $x \in [-2, 2]$, los extremos de $h(x) = 4 - 2x$ se alcanzan en los extremos del intervalo:
- $x = 2 \implies f(2, 0) = 0$
- $x = -2 \implies f(-2, 0) = 8$

### Paso 3: Comparación Final

| Punto | Origen | $f$ |
|------|--------|-----|
| $(1, 0)$ | Interior | $-1$ |
| $(2, 0)$ | Frontera | $0$ |
| $(-2, 0)$ | Frontera | $8$ |

- **Mínimo Absoluto**: $\mathbf{-1}$ en el punto $(1, 0)$.
- **Máximo Absoluto**: $\mathbf{8}$ en el punto $(-2, 0)$.
