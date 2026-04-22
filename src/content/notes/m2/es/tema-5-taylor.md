---
title: "Tema 5: Polinomio de Taylor"
description: "Aproximación de funciones mediante polinomios, cálculo del error (resto de Lagrange) e estudio local."
order: 5
readTime: "25 min"
subject: "m2"
---

El objetivo de este tema es aproximar funciones complicadas mediante funciones muy sencillas: los polinomios. Esto nos permite calcular valores aproximados, límites difíciles y estudiar el comportamiento local de una función.

::videoviz{url="/m2/taylor_master_tema5.webm"}

## 1. El Polinomio de Taylor

Sea $f$ una función $n$ veces derivable en el punto $a$. El **polinomio de Taylor de grado $n$** para $f$ en el punto $a$ se define como:

$$P_n(f, a, x) = f(a) + \frac{f'(a)}{1!}(x-a) + \frac{f''(a)}{2!}(x-a)^2 + \dots + \frac{f^{(n)}(a)}{n!}(x-a)^n$$

### Propiedades clave:
1. En el punto $a$, el polinomio y la función valen lo mismo: $P_n(a) = f(a)$.
2. Todas sus derivadas hasta orden $n$ también coinciden en el punto $a$: $P_n^{(k)}(a) = f^{(k)}(a)$.
3. El polinomio de Taylor de grado 1 coincide con la ecuación de la **recta tangente**.

::mafs{type="taylor_centrat"}

---

## 2. Teorema de Taylor y Resto de Lagrange

Aproximar una función tiene un coste: el error. Definimos el **resto de Taylor** como la diferencia entre la función real y el polinomio:
$$R_n(f,a,x) = f(x) - P_n(f,a,x)$$

::mafs{type="taylor_teorema"}

> **Teorema de Taylor**: Si $f$ es $n+1$ veces derivable, existe un punto $c$ entre $a$ y $x$ tal que:
> $$R_n(f,a,x) = \frac{f^{(n+1)}(c)}{(n+1)!}(x-a)^{n+1}$$
> Esta expresión se llama **Resto de Lagrange**.

::mafs{type="taylor_lagrange"}

---

## 3. Desarrollos de Maclaurin (a = 0)

Son los polinomios de Taylor centrados en el origen más comunes:

::mafs{type="taylor_maclaurin"}

| Función | Desarrollo ($a=0$) |
| :--- | :--- |
| **$e^x$** | $1 + x + \frac{x^2}{2!} + \dots + \frac{x^n}{n!} + \dots$ |
| **$\sin(x)$** | $x - \frac{x^3}{3!} + \frac{x^5}{5!} - \dots + (-1)^n \frac{x^{2n+1}}{(2n+1)!}$ |
| **$\cos(x)$** | $1 - \frac{x^2}{2!} + \frac{x^4}{4!} - \dots + (-1)^n \frac{x^{2n}}{(2n)!}$ |
| **$\ln(1+x)$** | $x - \frac{x^2}{2} + \frac{x^3}{3} - \dots + (-1)^{n-1} \frac{x^n}{n}$ |
| **$\frac{1}{1-x}$** | $1 + x + x^2 + x^3 + \dots + x^n$ |

---

## 4. Acotación del Error

Para saber cómo de buena es nuestra aproximación, buscamos una cota superior del resto. Si la derivada $(n+1)$ está acotada por $|f^{(n+1)}(t)| \leq K$ en el intervalo de estudio:

$$|R_n(x)| \leq \frac{K}{(n+1)!} |x-a|^{n+1}$$

::mafs{type="taylor_error"}

Esto nos permite determinar el grado $n$ necesario para una precisión deseada (por ejemplo, error $< 10^{-4}$).

---

## 5. Estudio Local de Funciones

El polinomio de Taylor nos da información sobre los extremos y la curvatura mediante las derivadas de orden superior:

### Máximos y Mínimos
Si $f'(a) = f''(a) = \dots = f^{(n-1)}(a) = 0$ y $f^{(n)}(a) \neq 0$:
- **Si $n$ es par**:
  - $f^{(n)}(a) > 0 \implies$ **Mínimo** relativo.
  - $f^{(n)}(a) < 0 \implies$ **Máximo** relativo.
- **Si $n$ es impar**: No es un extremo (es un punto de inflexión con tangente horizontal).

::mafs{type="taylor_comportament"}

### Curvatura e Inflexión
Si $f''(a) = f'''(a) = \dots = f^{(n-1)}(a) = 0$ y $f^{(n)}(a) \neq 0$:
- **Si $n$ es par**:
  - $f^{(n)}(a) > 0 \implies$ **Convexa** ($\cup$).
  - $f^{(n)}(a) < 0 \implies$ **Cóncava** ($\cap$).
- **Si $n$ es impar**: **Punto de inflexión**.