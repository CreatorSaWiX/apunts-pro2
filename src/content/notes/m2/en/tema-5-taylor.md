---
title: "Topic 5: Taylor Polynomial"
description: "Approximation of functions using polynomials, calculation of error (Lagrange remainder) and local study."
order: 5
readTime: "25 min"
subject: "m2"
---

The objective of this topic is to approximate complicated functions using very simple functions: polynomials. This allows us to calculate approximate values, difficult limits and study the local behavior of a function.

::videoviz{url="/m2/taylor_master_tema5.webm"}

## 1. The Taylor Polynomial

Let $f$ be a function that is $n$ times differentiable at point $a$. The **Taylor polynomial of degree $n$** for $f$ at point $a$ is defined as:

$$P_n(f, a, x) = f(a) + \frac{f'(a)}{1!}(x-a) + \frac{f''(a)}{2!}(x-a)^2 + \dots + \frac{f^{(n)}(a)}{n!}(x-a)^n$$

### Key properties:
1. At point $a$, the polynomial and the function have the same value: $P_n(a) = f(a)$.
2. All its derivatives up to order $n$ also coincide at point $a$: $P_n^{(k)}(a) = f^{(k)}(a)$.
3. The Taylor polynomial of degree 1 coincides with the equation of the **tangent line**.

::mafs{type="taylor_centrat"}

---

## 2. Taylor's Theorem and Lagrange Remainder

Approximating a function comes at a cost: the error. We define the **Taylor remainder** as the difference between the real function and the polynomial:
$$R_n(f,a,x) = f(x) - P_n(f,a,x)$$

::mafs{type="taylor_teorema"}

> **Taylor's Theorem**: If $f$ is $n+1$ times differentiable, there exists a point $c$ between $a$ and $x$ such that:
> $$R_n(f,a,x) = \frac{f^{(n+1)}(c)}{(n+1)!}(x-a)^{n+1}$$
> This expression is called the **Lagrange Remainder**.

::mafs{type="taylor_lagrange"}

---

## 3. Maclaurin Series (a = 0)

These are the most common Taylor polynomials centered at the origin:

::mafs{type="taylor_maclaurin"}

| Function | Expansion ($a=0$) |
| :--- | :--- |
| **$e^x$** | $1 + x + \frac{x^2}{2!} + \dots + \frac{x^n}{n!} + \dots$ |
| **$\sin(x)$** | $x - \frac{x^3}{3!} + \frac{x^5}{5!} - \dots + (-1)^n \frac{x^{2n+1}}{(2n+1)!}$ |
| **$\cos(x)$** | $1 - \frac{x^2}{2!} + \frac{x^4}{4!} - \dots + (-1)^n \frac{x^{2n}}{(2n)!}$ |
| **$\ln(1+x)$** | $x - \frac{x^2}{2} + \frac{x^3}{3} - \dots + (-1)^{n-1} \frac{x^n}{n}$ |
| **$\frac{1}{1-x}$** | $1 + x + x^2 + x^3 + \dots + x^n$ |

---

## 4. Error Bounding

To know how good our approximation is, we look for an upper bound of the remainder. If the $(n+1)$-th derivative is bounded by $|f^{(n+1)}(t)| \leq K$ in the studied interval:

$$|R_n(x)| \leq \frac{K}{(n+1)!} |x-a|^{n+1}$$

::mafs{type="taylor_error"}

This allows us to determine the necessary degree $n$ for a desired precision (for example, error $< 10^{-4}$).

---

## 5. Local Study of Functions

The Taylor polynomial gives us information about the extrema and the curvature using higher-order derivatives:

### Maximums and Minimums
If $f'(a) = f''(a) = \dots = f^{(n-1)}(a) = 0$ and $f^{(n)}(a) \neq 0$:
- **If $n$ is even**:
  - $f^{(n)}(a) > 0 \implies$ Relative **minimum**.
  - $f^{(n)}(a) < 0 \implies$ Relative **maximum**.
- **If $n$ is odd**: It is not an extremum (it's an inflection point with a horizontal tangent).

::mafs{type="taylor_comportament"}

### Curvature and Inflection
If $f''(a) = f'''(a) = \dots = f^{(n-1)}(a) = 0$ and $f^{(n)}(a) \neq 0$:
- **If $n$ is even**:
  - $f^{(n)}(a) > 0 \implies$ **Convex** ($\cup$).
  - $f^{(n)}(a) < 0 \implies$ **Concave** ($\cap$).
- **If $n$ is odd**: **Inflection point**.
