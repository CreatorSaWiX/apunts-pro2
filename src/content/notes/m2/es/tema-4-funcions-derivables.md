---
title: "Tema 4: Derivabilidad"
description: "Estudio del cambio instantáneo, reglas de derivación, teoremas fundamentales del cálculo y aplicaciones geométricas."
order: 4
readTime: "25 min"
subject: "m2"
---

En este tema aprenderemos a medir a qué velocidad se mueven las funciones. Si en el tema anterior estudiamos los límites para saber hacia dónde iba una función, ahora estudiaremos su cambio instantáneo.

## 1. La Derivada

Una función es derivable en un punto si podemos medir su cambio instantáneo de forma precisa. Este concepto nace de un límite fundamental:

> **Definición**: Decimos que una función $f$ es derivable en un punto $a$ si existe el siguiente límite y es un número real:
> $$f'(a) = \lim_{x \to a} \frac{f(x) - f(a)}{x - a} = \lim_{h \to 0} \frac{f(a+h) - f(a)}{h}$$

Este valor $f'(a)$ se llama la **derivada** de $f$ en $a$.

### Interpretación Geométrica
Geométricamente, la derivada $f'(a)$ nos da la **pendiente** (la inclinación) de la recta tangente a la gráfica justo en el punto $(a, f(a))$.

La ecuación de esta recta tangente es:
$$y = f(a) + f'(a)(x - a)$$

::mafs{type="derivada_tangent"}

### Derivabilidad y Continuidad
Hay una relación jerárquica muy importante entre estos dos conceptos:
1. Si una función es derivable en un punto, entonces es **obligatoriamente continua** en ese punto.
2. Al revés **no es cierto**: hay funciones continuas que no son derivables (por ejemplo, si tienen un "pico" o un ángulo brusco).

---

## 2. Derivación Logarítmica

Cuando tenemos funciones tipo $f(x) = u(x)^{v(x)}$ (donde tanto la base como el exponente dependen de $x$), las reglas normales no sirven. Utilizamos la **derivación logarítmica**:

1. Aplicamos logaritmos: $\ln f(x) = v(x) \ln u(x)$
2. Derivamos a ambos lados (regla de la cadena): $\frac{f'(x)}{f(x)} = v'(x) \ln u(x) + v(x) \frac{u'(x)}{u(x)}$
3. Despejamos $f'(x)$:
$$f'(x) = u(x)^{v(x)} \left( v'(x) \ln u(x) + v(x) \frac{u'(x)}{u(x)} \right)$$

::mafs{type="derivacio_logaritmica"}


---

## 3. Teoremas del Cálculo

Estos teoremas nos permiten asegurar la existencia de puntos con propiedades concretas solo mirando los extremos de un intervalo.

### Teorema de Rolle
Si $f$ es continua en $[a, b]$, derivable en $(a, b)$ y **$f(a) = f(b)$**, entonces existe al menos un punto $c \in (a, b)$ tal que:
$$f'(c) = 0$$
*Intuición: Si subes una montaña y vuelves a bajar a la misma altura, en algún momento tu pendiente ha tenido que ser cero (la cima).*

::mafs{type="teorema_rolle"}


### Teorema del Valor Medio (Lagrange)
Es una versión "inclinada" del de Rolle. Si $f$ es continua en $[a, b]$ y derivable en $(a, b)$, existe un punto $c \in (a, b)$ tal que:
$$f'(c) = \frac{f(b) - f(a)}{b - a}$$
*Significado: Hay un instante donde la pendiente de la tangente es paralela a la recta que une los puntos de inicio y final.*

::mafs{type="teorema_valor_mitja"}


---

## 4. Aplicaciones de la Derivada

### Monotonía y Extremos
Podemos saber si una función sube o baja mirando el signo de su primera derivada:
- $f'(x) > 0 \implies$ Función **creciente**.
- $f'(x) < 0 \implies$ Función **decreciente**.

Para encontrar **máximos y mínimos relativos**:
1. Buscamos puntos donde $f'(a) = 0$ (puntos críticos).
2. Miramos la segunda derivada:
   - $f''(a) > 0 \implies$ **Mínimo** (forma de cuenco).
   - $f''(a) < 0 \implies$ **Máximo** (forma de paraguas).

### Regla de l'Hôpital
Muy útil para resolver indeterminaciones del tipo $0/0$ o $\infty/\infty$ en límites:
$$\lim_{x \to a} \frac{f(x)}{g(x)} = \lim_{x \to a} \frac{f'(x)}{g'(x)}$$

::mafs{type="regla_hopital"}


### Curvatura (Concavidad y Convexidad)
Vemos la curvatura mirando el signo de la **segunda derivada**:
- $f''(x) > 0 \implies$ **Convexa** (forma $\cup$).
- $f''(x) < 0 \implies$ **Cóncava** (forma $\cap$).
- Si $f''(a) = 0$ y hay cambio de signo, tenemos un **punto de inflexión**.

---

## 5. Tabla de Derivadas Fundamentales

Esta tabla recoge las derivadas más utilizadas y su versión con la **Regla de la Cadena**.

| Función $f(x)$ | Derivada Simple $f'(x)$ | Función Compuesta $f(u)$ | Derivada Compuesta (Cadena) |
| :--- | :--- | :--- | :--- |
| **Constante**: $k$ | $0$ | - | - |
| **Identidad**: $x$ | $1$ | $u$ | $u'$ |
| **Potencia**: $x^n$ | $n \cdot x^{n-1}$ | $u^n$ | $n \cdot u^{n-1} \cdot u'$ |
| **Raíz**: $\sqrt{x}$ | $\frac{1}{2\sqrt{x}}$ | $\sqrt{u}$ | $\frac{u'}{2\sqrt{u}}$ |
| **Logaritmo**: $\ln(x)$ | $\frac{1}{x}$ | $\ln(u)$ | $\frac{u'}{u}$ |
| **Logaritmo $a$**: $\log_a(x)$ | $\frac{1}{x \ln a}$ | $\log_a(u)$ | $\frac{u'}{u \ln a}$ |
| **Exponencial**: $e^x$ | $e^x$ | $e^u$ | $e^u \cdot u'$ |
| **Exponencial $a$**: $a^x$ | $a^x \ln a$ | $a^u$ | $a^u \ln a \cdot u'$ |
| **Seno**: $\sin(x)$ | $\cos(x)$ | $\sin(u)$ | $u' \cos(u)$ |
| **Coseno**: $\cos(x)$ | $-\sin(x)$ | $\cos(u)$ | $-u' \sin(u)$ |
| **Tangente**: $\tan(x)$ | $\frac{1}{\cos^2(x)}$ | $\tan(u)$ | $\frac{u'}{\cos^2(u)}$ |

---

## 6. Operaciones con Derivadas

Sean $f$ y $g$ dos funciones derivables:

- **Suma/Resta**: $(f \pm g)' = f' \pm g'$
- **Producto**: $(f \cdot g)' = f' \cdot g + f \cdot g'$
- **Cociente**: $\left( \frac{f}{g} \right)' = \frac{f' \cdot g - f \cdot g'}{g^2}$
