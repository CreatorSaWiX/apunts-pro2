---
title: "Topic 4: Differentiability"
description: "Study of instantaneous change, differentiation rules, fundamental theorems of calculus and geometric applications."
order: 4
readTime: "25 min"
subject: "m2"
---

In this topic we will learn to measure at what speed functions move. If in the previous topic we studied limits to know where a function was going, now we will study its instantaneous change.

## 1. The Derivative

A function is differentiable at a point if we can measure its instantaneous change accurately. This concept is born from a fundamental limit:

> **Definition**: We say that a function $f$ is differentiable at a point $a$ if the following limit exists and is a real number:
> $$f'(a) = \lim_{x \to a} \frac{f(x) - f(a)}{x - a} = \lim_{h \to 0} \frac{f(a+h) - f(a)}{h}$$

This value $f'(a)$ is called the **derivative** of $f$ at $a$.

### Geometric Interpretation
Geometrically, the derivative $f'(a)$ gives us the **slope** (the inclination) of the tangent line to the graph exactly at the point $(a, f(a))$. 

The equation of this tangent line is:
$$y = f(a) + f'(a)(x - a)$$

::mafs{type="derivada_tangent"}

### Differentiability and Continuity
There is a very important hierarchical relationship between these two concepts:
1. If a function is differentiable at a point, then it is **mandatorily continuous** at that point.
2. The reverse **is not true**: there are continuous functions that are not differentiable (for example, if they have a "spike" or a sharp corner).

---

## 2. Logarithmic Differentiation

When we have functions of the type $f(x) = u(x)^{v(x)}$ (where both the base and the exponent depend on $x$), normal rules do not apply. We use **logarithmic differentiation**:

1. We apply logarithms: $\ln f(x) = v(x) \ln u(x)$
2. We differentiate on both sides (chain rule): $\frac{f'(x)}{f(x)} = v'(x) \ln u(x) + v(x) \frac{u'(x)}{u(x)}$
3. We isolate $f'(x)$:
$$f'(x) = u(x)^{v(x)} \left( v'(x) \ln u(x) + v(x) \frac{u'(x)}{u(x)} \right)$$

::mafs{type="derivacio_logaritmica"}


---

## 3. Theorems of Calculus

These theorems allow us to ensure the existence of points with specific properties just by looking at the endpoints of an interval.

### Rolle's Theorem
If $f$ is continuous on $[a, b]$, differentiable on $(a, b)$ and **$f(a) = f(b)$**, then there exists at least one point $c \in (a, b)$ such that:
$$f'(c) = 0$$
*Intuition: If you climb a mountain and go back down to the same height, at some point your slope must have been zero (the peak).*

::mafs{type="teorema_rolle"}


### Mean Value Theorem (Lagrange)
It is a "slanted" version of Rolle's theorem. If $f$ is continuous on $[a, b]$ and differentiable on $(a, b)$, there exists a point $c \in (a, b)$ such that:
$$f'(c) = \frac{f(b) - f(a)}{b - a}$$
*Meaning: There is an instant where the slope of the tangent is parallel to the line connecting the start and end points.*

::mafs{type="teorema_valor_mitja"}


---

## 4. Applications of the Derivative

### Monotonicity and Extrema
We can tell if a function goes up or down by looking at the sign of its first derivative:
- $f'(x) > 0 \implies$ **Increasing** function.
- $f'(x) < 0 \implies$ **Decreasing** function.

To find **relative maximums and minimums**:
1. We look for points where $f'(a) = 0$ (critical points).
2. We look at the second derivative:
   - $f''(a) > 0 \implies$ **Minimum** (bowl shape).
   - $f''(a) < 0 \implies$ **Maximum** (umbrella shape).

### L'Hôpital's Rule
Very useful for solving indeterminacies of the type $0/0$ or $\infty/\infty$ in limits:
$$\lim_{x \to a} \frac{f(x)}{g(x)} = \lim_{x \to a} \frac{f'(x)}{g'(x)}$$

::mafs{type="regla_hopital"}


### Curvature (Concavity and Convexity)
We see the curvature by looking at the sign of the **second derivative**:
- $f''(x) > 0 \implies$ **Convex** ($\cup$ shape).
- $f''(x) < 0 \implies$ **Concave** ($\cap$ shape).
- If $f''(a) = 0$ and there is a change of sign, we have an **inflection point**.

---

## 5. Table of Fundamental Derivatives

This table collects the most used derivatives and their version with the **Chain Rule**.

| Function $f(x)$ | Simple Derivative $f'(x)$ | Composite Function $f(u)$ | Composite Derivative (Chain) |
| :--- | :--- | :--- | :--- |
| **Constant**: $k$ | $0$ | - | - |
| **Identity**: $x$ | $1$ | $u$ | $u'$ |
| **Power**: $x^n$ | $n \cdot x^{n-1}$ | $u^n$ | $n \cdot u^{n-1} \cdot u'$ |
| **Root**: $\sqrt{x}$ | $\frac{1}{2\sqrt{x}}$ | $\sqrt{u}$ | $\frac{u'}{2\sqrt{u}}$ |
| **Logarithm**: $\ln(x)$ | $\frac{1}{x}$ | $\ln(u)$ | $\frac{u'}{u}$ |
| **Logarithm $a$**: $\log_a(x)$ | $\frac{1}{x \ln a}$ | $\log_a(u)$ | $\frac{u'}{u \ln a}$ |
| **Exponential**: $e^x$ | $e^x$ | $e^u$ | $e^u \cdot u'$ |
| **Exponential $a$**: $a^x$ | $a^x \ln a$ | $a^u$ | $a^u \ln a \cdot u'$ |
| **Sine**: $\sin(x)$ | $\cos(x)$ | $\sin(u)$ | $u' \cos(u)$ |
| **Cosine**: $\cos(x)$ | $-\sin(x)$ | $\cos(u)$ | $-u' \sin(u)$ |
| **Tangent**: $\tan(x)$ | $\frac{1}{\cos^2(x)}$ | $\tan(u)$ | $\frac{u'}{\cos^2(u)}$ |

---

## 6. Operations with Derivatives

Let $f$ and $g$ be two differentiable functions:

- **Addition/Subtraction**: $(f \pm g)' = f' \pm g'$
- **Product**: $(f \cdot g)' = f' \cdot g + f \cdot g'$
- **Quotient**: $\left( \frac{f}{g} \right)' = \frac{f' \cdot g - f \cdot g'}{g^2}$
