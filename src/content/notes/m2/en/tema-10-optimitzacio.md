---
title: "Topic 10: Multivariable optimization"
description: "Study of critical points, relative, constrained (Lagrange) and absolute extrema in compact sets."
order: 10
readTime: "45 min"
subject: "m2"
draft: false
isNew: true
---

Optimization consists of finding the values where a function reaches its maximum or minimum. In several variables, we distinguish three scenarios: **free** extrema (without restrictions), **constrained** extrema (on a curve or surface) and **absolute** extrema (in a closed and bounded domain).

## 1. Relative Extrema (Free)

Let $f: U \subseteq \mathbb{R}^n \to \mathbb{R}$ be a function defined on an open set $U$.

### Definitions
- **Relative Maximum**: A point $\mathbf{a}$ is a maximum if $f(\mathbf{x}) \leq f(\mathbf{a})$ for all $\mathbf{x}$ in a neighborhood of $\mathbf{a}$.
- **Relative Minimum**: A point $\mathbf{a}$ is a minimum if $f(\mathbf{x}) \geq f(\mathbf{a})$ for all $\mathbf{x}$ in a neighborhood of $\mathbf{a}$.
- **Critical (Stationary) Point**: Point where $\nabla f(\mathbf{a}) = \mathbf{0}$, meaning, all partial derivatives vanish.

> **Necessary Condition**: If $f$ is differentiable and has a relative extremum at $\mathbf{a}$, then $\nabla f(\mathbf{a}) = \mathbf{0}$. The converse **is not** true: a critical point can be a saddle point.

### Classification by the Hessian Matrix (2 variables)
Let $(a,b)$ be a critical point of $f \in \mathcal{C}^2$. We analyze the determinant $\Delta = \det(Hf(a,b))$:

1. **$\Delta > 0$**: There is an extremum.
   - If $\frac{\partial^2 f}{\partial x^2}(a,b) > 0 \implies$ **Relative Minimum**.
   - If $\frac{\partial^2 f}{\partial x^2}(a,b) < 0 \implies$ **Relative Maximum**.
2. **$\Delta < 0$**: The point is a **Saddle Point** (the function increases in one direction and decreases in another).
3. **$\Delta = 0$**: The criterion **is inconclusive**. The behavior around the point must be analyzed.
 
::three{type="vis_extrems_hessiana"}
 
If the function is a polynomial of degree 2 (like $f(x,y) = x^2 + 2xy + 3y^2$), you can complete squares to see if it is a sum of positive (minimum) or negative (maximum) squares. It is much faster than calculating the Hessian!

> **When $\Delta = 0$**: Try to study $f$ on lines passing through the point (e.g. $y = 0$ or $y = x$). Another very powerful tool is **completing squares**: if you can write $f(x,y) - f(a,b)$ as a form that is always positive (or always negative), you have a global minimum (or maximum) without the need for the Hessian.

---

## 2. Constrained Extrema (Lagrange Multipliers)

We look for the extrema of $f(\mathbf{x})$ over the set defined by a constraint $g(\mathbf{x}) = 0$.

The geometric idea: the constrained extrema are found where the **level curve of $f$ is tangent to the constraint curve $g = 0$**. When two curves are tangent, their gradients must be parallel.

### Lagrange's Theorem
This is formalized with the system:
$$
\begin{cases}
\nabla f(\mathbf{x}) = \lambda \, \nabla g(\mathbf{x}) \\
g(\mathbf{x}) = 0
\end{cases}
$$
Where $\lambda$ is the **Lagrange multiplier**. For multiple constraints $g_1 = 0, \ldots, g_m = 0$, it generalizes to $\nabla f = \sum_j \lambda_j \nabla g_j$.

::three{type="vis_lagrange_multiplicadors"}

> **The Meaning of $\lambda$**
> The multiplier $\lambda$ indicates the rate of change of the optimized value of $f$ with respect to changes in the constraint $c$. If we "relax" the constraint a bit, how much will our profit improve? That is $\lambda$.

### How to solve the system
Solving $\nabla f = \lambda \nabla g$ can be algebraically heavy. Three strategies that often simplify it a lot:

1. **Eliminate $\lambda$**: Isolate $\lambda$ from each equation and equate them. This gives a direct relationship between $x$ and $y$. Careful: do not divide by zero; treat $x = 0$ and $y = 0$ as separate cases.

2. **Take advantage of symmetries**: If the equations for $x$ and $y$ are almost identical, try $x = \pm y$ as a candidate. Many exam exercises are built with this hidden symmetry.

3. **Direct substitution instead of Lagrange**: If the constraint is a line (e.g. $y = 1 - x$) or allows isolating a variable easily, substitute it directly into $f$ and convert the problem into a function of **a single variable**. It is faster and safer.

4. **Combination of multiple constraints**: When you have two or more constraints, do not apply Lagrange directly on all of them (the system of $\lambda, \mu, \ldots$ can be huge). Try to use the simplest constraint to simplify the difficult one **before** differentiating. 
   > *Example*: If you have $x^2+y^2=1$ and another equation with the term $x^2+y^2$, substitute it with $1$ immediately. This often reduces the problem to a single constraint or eliminates variables.

5. **Partial substitution for circles**: If the constraint is $x^2 + y^2 = R^2$ and the function $f$ contains the term $x^2 + y^2$, you can directly substitute it with $R^2$ and reduce $f$ to a much simpler expression before differentiating.

---

## 3. Optimization in Compact Domains (Weierstrass)

**Weierstrass's Theorem** guarantees that if a function is continuous on a closed and bounded (compact) domain, then it has an **absolute maximum and minimum**.

### Search procedure
To find them, looking at the interior is not enough; an exhaustive search is needed:

1.  **Interior**: We look for critical points where $\nabla f = (0,0)$.
    > Always check if the critical point falls **inside** the domain. If it falls outside, it is ignored for the search of absolute extrema.

2.  **Boundary of $K$**: Apply Lagrange or parameterize the boundary to reduce it to one variable.

3.  **Vertices and Breakpoints**:

    > If the domain is a polygon (triangle, square...), **Lagrange does not detect the vertices automatically** because the boundary is not differentiable at those points. You have to evaluate $f$ at each vertex manually. Often the absolute maximum or minimum is found precisely at a corner.

::three{type="vis_optimitzacio_compacte"}

Once you have all the candidates, the largest value is the **absolute maximum** and the smallest is the **absolute minimum**.

> If the domain **is not** compact (for example, all $\mathbb{R}^2$), Weierstrass's Theorem does not apply and the absolute extrema might not exist.

---

## 4. Model Problem: Complete Strategy

With all the theory at hand, let's apply it from top to bottom. We want the absolute extrema of $f(x,y) = x^2 + y^2 - 2x$ in the closed disk $D = \{(x,y) : x^2 + y^2 \leq 4\}$.

### Step 1: Interior — Free Critical Points
We calculate $\nabla f = (2x - 2,\ 2y)$ and set it to zero:
$$2x - 2 = 0 \implies x = 1, \quad 2y = 0 \implies y = 0$$
**Critical point**: $(1, 0)$. We check that it is interior: $1^2 + 0^2 = 1 \leq 4$. ✓

Value: $f(1, 0) = 1 + 0 - 2 = -1$.

### Step 2: Boundary — Constrained Extrema
The boundary is the circle $x^2 + y^2 = 4$.

We apply the partial substitution: since on the boundary $x^2 + y^2 = 4$, we substitute directly:
$$f(x,y) = \underbrace{(x^2 + y^2)}_{=4} - 2x = 4 - 2x$$
Since on the circle $x \in [-2, 2]$, the extrema of $h(x) = 4 - 2x$ are reached at the endpoints of the interval:
- $x = 2 \implies f(2, 0) = 0$
- $x = -2 \implies f(-2, 0) = 8$

### Step 3: Final Comparison

| Point | Origin | $f$ |
|------|--------|-----|
| $(1, 0)$ | Interior | $-1$ |
| $(2, 0)$ | Boundary | $0$ |
| $(-2, 0)$ | Boundary | $8$ |

- **Absolute Minimum**: $\mathbf{-1}$ at point $(1, 0)$.
- **Absolute Maximum**: $\mathbf{8}$ at point $(-2, 0)$.
