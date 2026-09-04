---
title: "Topic 9: Multivariable Taylor"
description: "Higher-order derivatives, Schwarz's Theorem and the approximation of surfaces using Taylor polynomials of degree n."
order: 9
readTime: "30 min"
subject: "m2"
draft: false
isUpdated: 1
---

## 1. Higher-order derivatives, Hessian and extrema

If a function $f$ admits partial derivatives in a neighborhood, these functions can be, in turn, differentiable.

- **Second derivatives**: $\frac{\partial^2 f}{\partial x^2}, \frac{\partial^2 f}{\partial y^2}, \frac{\partial^2 f}{\partial x \partial y}, \frac{\partial^2 f}{\partial y \partial x}$.
- **Regularity**: As we have seen in Topic 8, we say that $f$ is of class $C^k$ if all its partial derivatives up to order $k$ exist and are continuous. This is the **safety condition** to be able to do Taylor of degree $k$.

In the general case of $n$ variables $\mathbf{x} = (x_1, \dots, x_n)$, the **Hessian Matrix** at a point $\mathbf{a}$ is:

$$
Hf(\mathbf{a}) = \begin{pmatrix} 
\frac{\partial^2 f}{\partial x_1^2}(\mathbf{a}) & \frac{\partial^2 f}{\partial x_2 \partial x_1}(\mathbf{a}) & \dots & \frac{\partial^2 f}{\partial x_n \partial x_1}(\mathbf{a}) \\
\frac{\partial^2 f}{\partial x_1 \partial x_2}(\mathbf{a}) & \frac{\partial^2 f}{\partial x_2^2}(\mathbf{a}) & \dots & \frac{\partial^2 f}{\partial x_n \partial x_2}(\mathbf{a}) \\
\vdots & \vdots & \ddots & \vdots \\
\frac{\partial^2 f}{\partial x_1 \partial x_n}(\mathbf{a}) & \frac{\partial^2 f}{\partial x_2 \partial x_n}(\mathbf{a}) & \dots & \frac{\partial^2 f}{\partial x_n^2}(\mathbf{a}) 
\end{pmatrix}
$$

For the case of two variables $(x,y)$, which is what we will use most often, the matrix is reduced to:

$$
Hf(x,y) = \begin{pmatrix} 
\frac{\partial^2 f}{\partial x^2} & \frac{\partial^2 f}{\partial x \partial y} \\
\frac{\partial^2 f}{\partial y \partial x} & \frac{\partial^2 f}{\partial y^2} 
\end{pmatrix}
$$

> **Schwarz's Theorem**: If $f$ is of class $C^2$ on an open set $U$, then the mixed partial derivatives match:
> $$\frac{\partial^2 f}{\partial x \partial y} = \frac{\partial^2 f}{\partial y \partial x}$$
> This reduces the number of calculations (from 4 to 3 second derivatives in $\mathbb{R}^2$) and guarantees that the Hessian matrix is **symmetric**.

::three{type="vis_teorema_schwarz"}

### Criterion and Visual Interpretation
Let $\Delta = \det(Hf(a))$ be the determinant:

| Criterion | Type of extremum | Geometric Shape |
| :--- | :--- | :--- |
| $\Delta > 0, \frac{\partial^2 f}{\partial x^2} > 0$ | **Relative minimum** | **Bowl / Cup**: Grows in all directions. |
| $\Delta > 0, \frac{\partial^2 f}{\partial x^2} < 0$ | **Relative maximum** | **Mountain / Dome**: Decreases in all directions. |
| $\Delta < 0$ | **Saddle point** | **Saddle**: Goes up on one path and down on the other. |
| $\Delta = 0$ | **Inconclusive** | A **local study** or by lines must be done. |
 
::three{type="vis_extrems_hessiana"}

> **If $\Delta = 0$**: The Hessian does not give us enough information. As we have seen in exercise 9.3c, we must analyze the function on axes or curves to see if it changes sign around the critical point.


---

## 2. The Multivariable Taylor Polynomial

The Taylor polynomial of degree $n$ at point $\mathbf{a}$ approximates the function $f$ near that point.

### Expanded formula (Degree 1 and 2)
For manual calculations in two variables near $(a, b)$:
$$
P_1(x, y) = f(a, b) + \left[ \frac{\partial f}{\partial x}(a,b)(x-a) + \frac{\partial f}{\partial y}(a,b)(y-b) \right] 
$$
$$
P_2(x, y) = P_1(x,y) + \frac{1}{2!} \left[ \frac{\partial^2 f}{\partial x^2}(a,b)(x-a)^2 + 2\frac{\partial^2 f}{\partial x \partial y}(a,b)(x-a)(y-b) + \frac{\partial^2 f}{\partial y^2}(a,b)(y-b)^2 \right]
$$

> The Taylor polynomial of degree 1 coincides with the tangent plane equation

::three{type="vis_taylor_graun"}

<!-- ### Matrix Notation (Compact)
Very useful in computing and for more than 2 variables:
$$P_2(\mathbf{x}) = f(\mathbf{a}) + \nabla f(\mathbf{a})^T (\mathbf{x}-\mathbf{a}) + \frac{1}{2} (\mathbf{x}-\mathbf{a})^T Hf(\mathbf{a}) (\mathbf{x}-\mathbf{a})$$

> **Exam Strategy: The "Substitution Trick"**
> If you have to calculate the polynomial at the origin $(0,0)$ of a composite function like $f(x,y) = \ln(1+2x+3y)$, **don't differentiate 5 times!** 
> 1. Identify the core of the function: $\ln(1+t)$.
> 2. Use the 1D Taylor expansion: $t - \frac{t^2}{2} + \dots$
> 3. Substitute $t = 2x+3y$ and expand algebraically.
> *This technique is much faster and safer.*

::threeviz{type="taylor_3d"} -->

---

## 3. Lagrange Remainder

The error made when using the polynomial $P_n$ is called the **Lagrange Remainder**. We use a notation based on a **notable identity** (like Newton's binomial) to make it easier to remember:

$$
R_n(x,y) = \frac{1}{(n+1)!} \left[ h \frac{\partial}{\partial x} + k \frac{\partial}{\partial y} \right]^{n+1} f(c,d)
$$

Where $h=(x-a)$ and $k=(y-b)$. The point $(c,d)$ belongs to the segment that joins the approximation point with the center. According to the degree, it expands like this:

**Remainder of degree 1 ($n=1$):** Looks like a perfect square $(\alpha+\beta)^2$:
$$
R_1(x,y) = \frac{1}{2!} \left[ h^2 \frac{\partial^2 f}{\partial x^2}(c,d) + 2hk \frac{\partial^2 f}{\partial y \partial x}(c,d) + k^2 \frac{\partial^2 f}{\partial y^2}(c,d) \right]
$$

**Remainder of degree 2 ($n=2$):** Looks like a perfect cube $(\alpha+\beta)^3$:
$$
R_2(x,y) = \frac{1}{6} \left[ h^3 \frac{\partial^3 f}{\partial x^3}(c,d) + 3h^2k \frac{\partial^3 f}{\partial y \partial x^2}(c,d) + 3hk^2 \frac{\partial^3 f}{\partial y^2 \partial x}(c,d) + k^3 \frac{\partial^3 f}{\partial y^3}(c,d) \right]
$$

To calculate the upper bound $|R_n| \leq \dots$, we apply the absolute value to the corresponding expansion and substitute each derivative by its **absolute maximum value ($M$)** in the segment that joins the origin with the point $(x,y)$.

**Bound for degree 1:**
$$
|R_1(x,y)| \leq \frac{1}{2} \left[ M_{\frac{\partial^2 f}{\partial x^2}} |h|^2 + 2M_{\frac{\partial^2 f}{\partial y \partial x}} |hk| + M_{\frac{\partial^2 f}{\partial y^2}} |k|^2 \right]
$$

**Bound for degree 2:**
$$
|R_2(x,y)| \leq \frac{1}{6} \left[ M_{\frac{\partial^3 f}{\partial x^3}} |h|^3 + 3M_{\frac{\partial^3 f}{\partial y \partial x^2}} |h^2 k| + 3M_{\frac{\partial^3 f}{\partial y^2 \partial x}} |h k^2| + M_{\frac{\partial^3 f}{\partial y^3}} |k|^3 \right]
$$

::three{type="vis_fita_error_lagrange"}

<!-- To simplify calculations in exams, a more relaxed bound is often used:
$$|R_1| \leq \frac{1}{2} M_{global} (|h| + |k|)^2$$ -->


---

## 4. The Differential and the Increment
A key interpretation of Taylor is to separate the function into constant part, linear part and error:

$$
f(x,y) = f(a,b) + \underbrace{\frac{\partial f}{\partial x} dx + \frac{\partial f}{\partial y} dy}_{df \text{ (Differential)}} + R_1
$$

::three{type="vis_diferencial_increment"}

The **Differential** ($df$) represents the approximate increment of the function when we move a small distance $(dx, dy)$ from the initial point.
