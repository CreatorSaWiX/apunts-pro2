---
title: "Tema 6: Integración"
description: "Teorema fundamental del cálculo, integración numérica (Trapecios y Simpson), integral de Riemann y repaso de cálculo de primitivas."
order: 6
readTime: "30 min"
subject: "m2"
draft: false
isNew: true
---

El objetivo principal de este tema es estudiar el área bajo la curva de una función mediante diferentes métodos analíticos y numéricos, y relacionar la integración con la derivación.

## 1. El teorema fundamental del cálculo (TFC)

**Teorema fundamental del cálculo**: Sea $f$ una función integrable en $[a,b]$ y definimos una función $F: [a,b] \to \mathbb{R}$ por
$$F(x) = \int_a^x f(t) dt$$
entonces se cumple que:
1. $F$ es continua en el intervalo $[a,b]$.
2. Si $f$ es continua en algún punto $c \in (a,b)$, entonces la función área $F$ es derivable en $c$ y $F'(c) = f(c)$.

::mafs{type="teorema_fonamental"}

### Primitiva y regla de Barrow

Si tenemos dos funciones $f$ i $F$ definidas en el intervalo $(a,b)$ tal que $F'(x) = f(x)$ para todo $x \in (a,b)$, se dice que $F$ es una **primitiva** de $f$ en el intervalo $(a,b)$.

::mafs{type="primitiva_familia"}

* **Corolario**: Si $f$ es continua en $[a,b]$ y definimos $F(x) = \int_a^x f$, entonces $F$ es derivable en $[a,b]$ y es una primitiva de $f$ en $(a,b)$.

Este concepto nos introduce una de las herramientas más importantes y prácticas para evaluar integrales definidas: la **Regla de Barrow**. Nos permite calcular la integral definida de una función continua de manera muy sencilla si podemos encontrar una de sus primitivas.

> **Regla de Barrow**: Si $f$ es continua en $[a,b]$ y $F$ es continua en $[a,b]$ y derivable en $(a,b)$ siendo una primitiva ($F'(x) = f(x)$), entonces:
> $$\int_a^b f(x) dx = F(b) - F(a)$$

::mafs{type="regla_barrow"}

### Propiedades fundamentales

Para trabajar con integrales definidas, es esencial recordar estas propiedades:

1. **Inversión de límites**: Si intercambiamos los límites de integración, el signo de la integral cambia.
   $$\int_a^b f(x) dx = -\int_b^a f(x) dx$$

::mafs{type="propietat_inversio"}

2. **Linealidad**: La integral de la suma es la suma de integrales, y las constantes pueden salir de la integral.
   $$\int_a^b (k \cdot f(x) + g(x)) dx = k \int_a^b f(x) dx + \int_a^b g(x) dx$$

::mafs{type="propietat_linealitat"}

3. **Aditividad del intervalo**: Podemos partir una integral en un punto $c \in [a,b]$.
   $$\int_a^b f(x) dx = \int_a^c f(x) dx + \int_c^b f(x) dx$$

::mafs{type="propietat_additivitat"}

### Propiedades de simetría y paridad

Si la función $f$ presenta simetrías, el estudio de la función área $F(x) = \int_0^x f(t)dt$ se simplifica:
- Si **$f$ es par** ($f(-x) = f(x)$), entonces **$F$ es impar** ($F(-x) = -F(x)$).
- Si **$f$ es impar** ($f(-x) = -f(x)$), entonces **$F$ es par** ($F(-x) = F(x)$).

::mafs{type="paritat_integrals"}

> **Truco de examen**: Recuerda que la integral de una función impar en un intervalo simétrico $[-a, a]$ es siempre $0$.

### Derivada de una integral

Cuando los límites de integración dependen de una variable $x$, no podemos aplicar el TFC directamente; hay que utilizar la **Regla de la Cadena**.

> **Teorema**: Sea $f$ continua y $u(x), v(x)$ funciones derivables. Si definimos:
> $$F(x) = \int_{u(x)}^{v(x)} f(t)dt$$
> Entonces su derivada es:
> $$F'(x) = f(v(x)) \cdot v'(x) - f(u(x)) \cdot u'(x)$$

*En palabras:* Sustituimos la $x$ en la función y multiplicamos por la derivada del límite.

::mafs{type="limits_integracio"}

### Límites e indeterminaciones con integrales

Cuando aparecen integrales en límites que generan indeterminaciones del tipo $\frac{0}{0}$, podemos aplicar la **Regla de L'Hôpital** derivando la función integral mediante el TFC:

$$\lim_{x \to a} \frac{\int_a^x f(t)dt}{g(x)} = \lim_{x \to a} \frac{f(x)}{g'(x)}$$

::mafs{type="regla_hopital"}

---

### Estudio local de la función integral

Podemos estudiar el comportamiento de $F(x) = \int_a^x f(t)dt$ sin calcular la integral:
- **Puntos críticos**: Son los valores de $x$ donde $F'(x) = f(x) = 0$.
- **Crecimiento**: $F$ crece donde $f(x) > 0$ y decrece donde $f(x) < 0$.
- **Concavidad**: Estudiamos $F''(x) = f'(x)$. Si $f'(x) > 0$, $F$ es convexa ($\cup$).
- **Puntos de Inflexión**: Donde $f'(x) = 0$ y hay cambio de curvatura.

---

## 2. Integración numérica

En muchos de problemas prácticos y en la ingeniería, calcular la integral de una función con la Regla de Barrow es extremadamente difícil o imposible porque algunas funciones no tienen una primitiva expresable en funciones elementales (como $\int e^{-x^2} dx$). En estos casos se utilizan **métodos elementales de aproximación**.

### 2.1 Método de los Trapecios

Consiste en subdividir el intervalo $[a,b]$ en $n$ subintervalos de anchura $h = \frac{b-a}{n}$. En cada intervalo, se sustituye la curva por un trapecio recto.

$$ T_n = \frac{h}{2} \left[ f(a) + f(b) + 2 \sum_{i=1}^{n-1} f(x_i) \right] $$

**Cálculo del error y búsqueda de $n$:**
El error máximo admitido viene acotado por:
$$ |E_T| \leq \frac{(b-a)h^2}{12} M_2 = \frac{(b-a)^3}{12n^2} M_2 $$
*Donde $M_2$ es el valor máximo de $|f''(x)|$ en el intervalo.*

Para encontrar el número de intervalos $n$ necesario para una precisión $\varepsilon$:
1. Calculamos $f''(x)$ y buscamos su máximo $M_2$ en $[a,b]$.
2. Despejamos $n$: **$n \geq \sqrt{\frac{(b-a)^3 M_2}{12\varepsilon}}$**

::mafs{type="integracio_trapezi"}

### 2.2 Método de Simpson

Este método mejora la precisión aproximando la curva mediante fragmentos de parábolas (polinomios de grado 2). Para aplicarlo, es fundamental que el número de **subintervalos ($n$) sea par**.

$$ S_n = \frac{h}{3} \left[ f(a) + f(b) + 4\sum_{i=1}^{n/2} f(x_{2i-1}) + 2\sum_{i=1}^{\frac{n}{2}-1} f(x_{2i}) \right] $$

**Cálculo del error y búsqueda de $n$:**
El error máximo admitido viene acotado por:
$$ |E_S| \leq \frac{(b-a)h^4}{180} M_4 = \frac{(b-a)^5}{180n^4} M_4 $$
*Donde $M_4$ es el valor máximo de $|f^{(4)}(x)|$ en el intervalo.*

Para encontrar el número de intervalos $n$ necesario para una precisión $\varepsilon$:
1. Calculamos $f^{(4)}(x)$ y buscamos su máximo $M_4$ en $[a,b]$.
2. Despejamos $n$: **$n \geq \sqrt[4]{\frac{(b-a)^5 M_4}{180\varepsilon}}$** (recuerda redondear al siguiente entero par).

::mafs{type="integracio_simpson"}

### Ejemplo comparativa de cotas de error

::mafs{type="cota_error"}

---

## 3. Anexo: Cálculo de Primitivas y Áreas

Estas son las herramientas analíticas que hemos utilizado para resolver los ejercicios del tema.

### 3.1 Cálculo de Áreas entre curvas
Para encontrar el área limitada por dos funciones $f$ i $g$:
1. Encontramos los puntos de corte igualando $f(x) = g(x)$.
2. Determinamos qué función es superior en el intervalo $[a,b]$.
3. Calculamos el área como: $A = \int_a^b |f(x) - g(x)| dx$.

::mafs{type="area_entre_corbes"}

### 3.2 Técnicas de Integración
- **Integración por partes**: $\int u \, dv = u \cdot v - \int v \, du$. Utilizada para productos de funciones (Ej 8 y 11).
- **Cambio de variable**: $u = g(x) \implies du = g'(x)dx$.
- **Racionales**: División de polinomios o fracciones simples si el denominador tiene raíces.

### 3.3 Integrales Inmediatas
| Tipo | Fórmula |
|---|---|
| **Potencial** | $\int u^n \cdot u' \, dx = \frac{u^{n+1}}{n+1} + C$ |
| **Logarítmica** | $\int \frac{u'}{u} \, dx = \ln \lvert u \rvert + C$ |
| **Exponencial** | $\int e^u \cdot u' \, dx = e^u + C$ |
| **Trigonométrica** | $\int \cos(u) \cdot u' \, dx = \sin(u) + C$ |
| **Arcotangente** | $\int \frac{u'}{1+u^2} \, dx = \arctan(u) + C$ |
