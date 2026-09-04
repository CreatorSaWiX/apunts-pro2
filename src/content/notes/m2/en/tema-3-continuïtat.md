---
title: "Topic 3: Continuity"
description: "Fundamental theorems of continuous functions: Bolzano, Weierstrass and the Intermediate Value."
order: 3
readTime: "20 min"
subject: "m2"
---

## 1. Function (FM Review)
Let's think of a function as if it were a machine: you input a number (the raw material), the machine performs an operation, and returns another number (the finished product).

Formally, a real function of a real variable is a map $f: D \to \mathbb{R}$, where $D$ is a subset of the real numbers denoted as the domain of $f$. The element $y$ is the image of $x$, and $x$ is the preimage of $y$.

## 2. Limit of a function
The limit of a function $f$ at a point $a$ is a real number $l$ to which the values of the function approach when we approach $a$. It is written as $\lim_{x \to a} f(x) = l$.

### One-sided limits
For the global limit to exist, the two one-sided limits must exist and be equal:
$$\lim_{x \to a} f(x) = l \iff \lim_{x \to a^+} f(x) = \lim_{x \to a^-} f(x) = l$$

## 3. Continuity: drawing without lifting the pencil
For a function to be "continuous" at a point $a$, three rules must be met:
1. The limit must exist: $l = \lim_{x \to a} f(x)$.
2. The point must be valid: $a \in D$.
3. The limit and the value of the function must match: $l = f(a)$.

### Discontinuities
- **Removable:** The limit exists, but condition 2 or 3 fails.
- **Essential:** The limit does not exist (infinite jump or different one-sided jumps).

## 4. Fundamental theorems

:::mafs{type="teorema_bolzano"}
:::

### Bolzano's Theorem
If a function is continuous on a closed interval $[a, b]$ and at the endpoints it changes sign ($f(a) \cdot f(b) < 0$), then there is at least one point $c \in (a, b)$ such that $f(c) = 0$.

### Weierstrass's Theorem
Every continuous function on a closed interval $[a, b]$ is guaranteed to have an absolute maximum point $M$ and an absolute minimum $m$ within this interval.

## 5. Approximate resolution of equations

### Bisection method
It is based on dividing the interval in half successively. If $f(a) \cdot f(b) < 0$, we calculate the midpoint $c_1 = \frac{a+b}{2}$.
- If $f(a) \cdot f(c_1) < 0$, the root is in $[a, c_1]$.
- If $f(c_1) \cdot f(b) < 0$, the root is in $[c_1, b]$.

::videoviz{url="/m2/biseccio.webm" delay="2000"}

### Secant method
It uses a straight line connecting $x_0$ and $x_1$ to approximate zero:
$$x_{n+1} = x_n - \frac{x_n - x_{n-1}}{f(x_n) - f(x_{n-1})} f(x_n)$$

::videoviz{url="/m2/secant.webm" delay="2000"}

### Newton-Raphson method
It requires the derivative of the function and uses the tangent line:
$$x_{n+1} = x_n - \frac{f(x_n)}{f'(x_n)}$$

::videoviz{url="/m2/tangent.webm" delay="2000"}
