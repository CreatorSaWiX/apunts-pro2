---
title: "Topic 6: Integration"
description: "Fundamental theorem of calculus, numerical integration (Trapezoidal and Simpson's), Riemann integral and review of calculating primitives."
order: 6
readTime: "30 min"
subject: "m2"
draft: false
isUpdated: 1
---

## 0. Introduction

When we write $\int_a^b f(x)dx$:

- **The symbol $\int$**: Comes from the Latin *Summa* (it is a stylized "S"). It indicates that we are summing infinite elements.
- **The function $f(x)$**: Represents the **height** of each rectangle at point $x$.
- **The differential $dx$**: Represents an infinitely small **width** (the base of each rectangle).

We are calculating the area of an infinitesimal rectangle. The integral sums all these rectangles from $a$ to $b$.

::mafs{type="riemann_sums"}

## 1. The Fundamental Theorem of Calculus (FTC)

**Fundamental theorem of calculus**: Let $f$ be an integrable function on $[a,b]$ and we define a function $F: [a,b] \to \mathbb{R}$ by
$$F(x) = \int_a^x f(t) dt$$
then it holds that:
1. $F$ is continuous on the interval $[a,b]$.
2. If $f$ is continuous at some point $c \in (a,b)$, then the area function $F$ is differentiable at $c$ and $F'(c) = f(c)$.

::mafs{type="teorema_fonamental"}

### Derivative of an integral

Let $f$ be continuous and $u(x), v(x)$ be differentiable functions. If we define: $F(x) = \int_{u(x)}^{v(x)} f(t)dt$ , then the derivative is:

$$
F'(x) = f(v(x)) \cdot v'(x) - f(u(x)) \cdot u'(x)
$$

*In words:* We substitute $x$ into the function and multiply by the derivative of the limit.

::mafs{type="limits_integracio"}

### Fundamental properties

To work with definite integrals, it is essential to remember these properties:

1. **Reversal of limits**: If we swap the limits of integration, the sign of the integral changes.
   $$\int_a^b f(x) dx = -\int_b^a f(x) dx$$

::mafs{type="propietat_inversio"}

2. **Linearity**: The integral of the sum is the sum of integrals, and constants can be taken out of the integral.
   $$\int_a^b (k \cdot f(x) + g(x)) dx = k \int_a^b f(x) dx + \int_a^b g(x) dx$$

::mafs{type="propietat_linealitat"}

3. **Additivity of the interval**: We can split an integral at a point $c \in [a,b]$.
   $$\int_a^b f(x) dx = \int_a^c f(x) dx + \int_c^b f(x) dx$$

::mafs{type="propietat_additivitat"}

<!-- ### Primitive and Barrow's rule

If we have two functions $f$ and $F$ defined on the interval $(a,b)$ such that $F'(x) = f(x)$ for all $x \in (a,b)$, $F$ is said to be a **primitive** of $f$ on the interval $(a,b)$.

::mafs{type="primitiva_familia"}

* **Corollary**: If $f$ is continuous on $[a,b]$ and we define $F(x) = \int_a^x f$, then $F$ is differentiable on $[a,b]$ and is a primitive of $f$ on $(a,b)$.

This concept introduces one of the most important and practical tools for evaluating definite integrals: **Barrow's Rule**. It allows us to calculate the definite integral of a continuous function very easily if we can find one of its primitives.

> **Barrow's Rule**: If $f$ is continuous on $[a,b]$ and $F$ is continuous on $[a,b]$ and differentiable on $(a,b)$ being a primitive ($F'(x) = f(x)$), then:
> $$\int_a^b f(x) dx = F(b) - F(a)$$

::mafs{type="regla_barrow"}

### Symmetry and parity properties

If the function $f$ presents symmetries, the study of the area function $F(x) = \int_0^x f(t)dt$ is simplified:
- If **$f$ is even** ($f(-x) = f(x)$), then **$F$ is odd** ($F(-x) = -F(x)$).
- If **$f$ is odd** ($f(-x) = -f(x)$), then **$F$ is even** ($F(-x) = F(x)$).

::mafs{type="paritat_integrals"}

> Remember that the integral of an odd function over a symmetric interval $[-a, a]$ is always $0$.

### Limits and indeterminacies with integrals

When integrals appear in limits that generate indeterminacies of the type $\frac{0}{0}$, we can apply **L'Hôpital's Rule** differentiating the integral function using the FTC:

$$\lim_{x \to a} \frac{\int_a^x f(t)dt}{g(x)} = \lim_{x \to a} \frac{f(x)}{g'(x)}$$

::mafs{type="regla_hopital"}

---

### Local study of the integral function

We can study the behavior of $F(x) = \int_a^x f(t)dt$ without calculating the integral:
- **Critical points**: These are the values of $x$ where $F'(x) = f(x) = 0$.
- **Growth**: $F$ increases where $f(x) > 0$ and decreases where $f(x) < 0$.
- **Concavity**: We study $F''(x) = f'(x)$. If $f'(x) > 0$, $F$ is convex ($\cup$).
- **Inflection Points**: Where $f'(x) = 0$ and there is a change of curvature. -->

---

## 2. Numerical integration

In many practical problems and in engineering, calculating the integral of a function with Barrow's Rule is extremely difficult or impossible because some functions do not have a primitive expressible in elementary functions (like $\int e^{-x^2} dx$). In these cases **elementary approximation methods** are used.

### 2.1 Trapezoidal Method

It consists of subdividing the interval $[a,b]$ into $n$ subintervals of width $h = \frac{b-a}{n}$. In each interval, the curve is replaced by a right trapezoid.

$$ 
T_n = \frac{h}{2} \left[ f(a) + f(b) + 2 \sum_{i=1}^{n-1} f(x_i) \right] = h \left[ \frac{f(a)+f(b)}{2} + \sum_{i=1}^{n-1} f(x_i) \right]
$$

**Calculation of the error and search for $n$:**
The maximum admitted error is bounded by:

$$ 
|E_T| \leq \frac{(b-a)h^2}{12} M_2 = \frac{(b-a)^3}{12n^2} M_2 
$$


*Where $M_2$ is the maximum value of $|f''(x)|$ in the interval.*

To find the number of intervals $n$ necessary for a precision $\varepsilon$:
1. We calculate $f''(x)$ and look for its maximum $M_2$ on $[a,b]$.
2. We isolate $n$: **$n \geq \sqrt{\frac{(b-a)^3 M_2}{12\varepsilon}}$**

::mafs{type="integracio_trapezi"}

### 2.2 Simpson's Method

This method improves precision by approximating the curve using pieces of parabolas (polynomials of degree 2). To apply it, it is fundamental that the number of **subintervals ($n$) is even**.

$$ 
S_n = \frac{h}{3} \left[ f(a) + f(b) + 4\sum_{i=1}^{n/2} f(x_{2i-1}) + 2\sum_{i=1}^{\frac{n}{2}-1} f(x_{2i}) \right] 
$$

**Calculation of the error and search for $n$:**
The maximum admitted error is bounded by:

$$ 
|E_S| \leq \frac{(b-a)h^4}{180} M_4 = \frac{(b-a)^5}{180n^4} M_4 
$$

*Where $M_4$ is the maximum value of $|f^{(4)}(x)|$ in the interval.*

To find the number of intervals $n$ necessary for a precision $\varepsilon$:
1. We calculate $f^{(4)}(x)$ and look for its maximum $M_4$ on $[a,b]$.
2. We isolate $n$: **$n \geq \sqrt[4]{\frac{(b-a)^5 M_4}{180\varepsilon}}$** (remember to round up to the next even integer).

::mafs{type="integracio_simpson"}

### Example comparison of error bounds

::mafs{type="cota_error"}

---

## 3. Annex: Calculation of Primitives and Areas

These are the analytical tools we have used to solve the exercises in this topic.

### 3.1 Calculation of Areas between curves
To find the area bounded by two functions $f$ and $g$:
1. We find the intersection points by setting $f(x) = g(x)$.
2. We determine which function is on top in the interval $[a,b]$.
3. We calculate the area as: $A = \int_a^b |f(x) - g(x)| dx$.

::mafs{type="area_entre_corbes"}

### 3.2 Integration Techniques
- **Integration by parts**: $\int u \, dv = u \cdot v - \int v \, du$. Used for products of functions (Ex 8 and 11).
- **Substitution (Change of variable)**: $u = g(x) \implies du = g'(x)dx$.
- **Rational**: Division of polynomials or partial fractions if the denominator has roots.

### 3.3 Immediate Integrals
| Type | Formula |
|---|---|
| **Power** | $\int u^n \cdot u' \, dx = \frac{u^{n+1}}{n+1} + C$ |
| **Logarithmic** | $\int \frac{u'}{u} \, dx = \ln \lvert u \rvert + C$ |
| **Exponential** | $\int e^u \cdot u' \, dx = e^u + C$ |
| **Trigonometric** | $\int \cos(u) \cdot u' \, dx = \sin(u) + C$ |
| **Arctangent** | $\int \frac{u'}{1+u^2} \, dx = \arctan(u) + C$ |
