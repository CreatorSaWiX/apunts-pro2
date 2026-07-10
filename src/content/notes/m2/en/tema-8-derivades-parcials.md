---
title: "Topic 8: Partial derivative and gradient"
description: "Multivariable differential calculus: directional derivatives, gradient vectors, differentiability and the tangent plane."
order: 8
readTime: "20 min"
subject: "m2"
draft: false
isUpdated: 2
---

## 1. Partial and directional derivatives

### 1.1 Geometric interpretation
To understand what the **directional derivative** $\frac{\partial f}{\partial \mathbf{v}}(\mathbf{a})$ (also written as $D_{\mathbf{v}}f(\mathbf{a})$) is, let's think about the **vertical slice** method:

1.  **Plane $\pi$**: Imagine a vertical knife passing through $\mathbf{a}$ following the direction of $\mathbf{v}$.
2.  **Intersection curve $C$**: The cut on the surface (the "cake").
3.  **The slope**: If we look at this cut head-on (like a 2D sheet of paper), the derivative is the **slope** of the tangent line at the point.

::three{type="vis_derivada_direccional_hibrida"}

The **partial derivatives** are the case where the direction coincides with the coordinate axes ($X, Y, Z$). In practice, when you differentiate partially, you treat all other variables as if they were **constants**.

- **With respect to x**: $\frac{\partial f}{\partial x}$ (*"Partial derivative of f with respect to x"*).
- **With respect to y**: $\frac{\partial f}{\partial y}$ (*"Partial derivative of f with respect to y"*).

> **Other notations**: Although the fraction is the most classic, it can also be written as ($f_x, f_y$) or ($D_x f, \partial_x f$).

::three{type="vis_derivades_parcials_hibrida"}

Following the previous visualization, when you differentiate partially you are converting the function into a **1 variable** function. Therefore, all others are treated as if they were **constant numbers**.
Let $f(x, y, z) = e^{xy+2z} + \sin(5xy) + \cos(z)$:
*   $\frac{\partial f}{\partial x} = \mathbf{y} \cdot e^{xy+2z} + \mathbf{5y} \cdot \cos(5xy) + 0$
*   $\frac{\partial f}{\partial y} = \mathbf{x} \cdot e^{xy+2z} + \mathbf{5x} \cdot \cos(5xy) + 0$
*   $\frac{\partial f}{\partial z} = \mathbf{2} \cdot e^{xy+2z} + 0 - \sin(z)$

### 1.2 The direction vector $\mathbf{v}$
For the directional derivative to truly represent the slope per unit distance, the vector **MUST BE A UNIT VECTOR** ($\|\mathbf{v}\|=1$).

*   **Normalization**: If we are given a non-unit vector $\mathbf{w}$: $\mathbf{v} = \frac{\mathbf{w}}{\|\mathbf{w}\|}$.
*   **If we are given an angle $\alpha$**: $\mathbf{v} = (\cos \alpha, \sin \alpha)$.

::three{type="vis_vector_director_angle"}

---

## 2. The gradient vector $\nabla$

The Gradient of $f$ at point $\mathbf{a}$ $\nabla f(\mathbf{a})$ groups all partial derivatives into a single vector:

$$
\nabla f(\mathbf{a}) = \left( \frac{\partial f}{\partial x_1}(\mathbf{a}), \dots, \frac{\partial f}{\partial x_n}(\mathbf{a}) \right)
$$

**Example:** Continuing with the previous function, let's calculate its gradient at point $\mathbf{a} = (2, 0, \pi)$:
*   Point: $(x,y,z) = (2,0,\pi) \implies xy+2z = 2\pi$.
*   $\frac{\partial f}{\partial x}(2, 0, \pi) = \mathbf{0}$
*   $\frac{\partial f}{\partial y}(2, 0, \pi) = \mathbf{2e^{2\pi} + 10}$
*   $\frac{\partial f}{\partial z}(2, 0, \pi) = \mathbf{2e^{2\pi}}$

$$ 
\nabla f(2, 0, \pi) = \left( \frac{\partial f}{\partial x}, \frac{\partial f}{\partial y}, \frac{\partial f}{\partial z} \right) = (0, \, 2e^{2\pi} + 10, \, 2e^{2\pi}) 
$$

> **Fundamental formula**: $\frac{\partial f}{\partial \mathbf{v}}(\mathbf{a}) = \nabla f(\mathbf{a}) \cdot \mathbf{v}$

### 2.1 Summary of notations
| Symbol | Name | Type | What does it represent? |
| :--- | :--- | :--- | :--- |
| $\nabla f$ | **Gradient** | Vector | The direction and strength of maximum growth. |
| $\frac{\partial f}{\partial x}$ | **Partial Derivative** | Number | Slope on the X axis (or Y, Z...). |
| $\frac{\partial f}{\partial \mathbf{v}}$ | **Directional Derivative** | Number | Slope in any direction $\mathbf{v}$. |

> The **Gradient** is an arrow (vector), while the **Derivatives** are the slope of this arrow (numbers).

### 2.2 Geometric properties:
Why does the gradient point to the maximum growth? If we analyze the dot product formula:

$$
\frac{\partial f}{\partial \mathbf{v}}(\mathbf{a}) = \nabla f(\mathbf{a}) \cdot \mathbf{v} = \|\nabla f(\mathbf{a})\| \cdot \|\mathbf{v}\| \cdot \cos \theta
$$

Since the vector $\mathbf{v}$ is a unit vector ($\|\mathbf{v}\| = 1$), the value of the derivative depends only on the angle $\theta$ between the gradient and the direction:

1.  **Maximum growth**: It is reached when $\cos \theta = 1$ ($\theta = 0^\circ$). The vector $\mathbf{v}$ has the **same direction and sense** as the gradient. Maximum value: $\|\nabla f(\mathbf{a})\|$.
2.  **Maximum decrease**: It is reached when $\cos \theta = -1$ ($\theta = 180^\circ$). The vector $\mathbf{v}$ has the **same direction but opposite sense**. Minimum value: $-\|\nabla f(\mathbf{a})\|$.
3.  **Zero growth**: It is reached when $\cos \theta = 0$ ($\theta = 90^\circ$). The direction is **perpendicular** to the gradient (direction of the contour line).

::threeviz{type="vector_gradient"}

---

## 3. Regularity: The $C^n$ classes

The **regularity** of a function measures its degree of geometric "smoothness": it indicates how many times we can differentiate it before finding a discontinuity or a "spike" in its slopes. This is classified into **regularity classes**:

| Class | Name | What does it mean? | Practical consequence |
| :--- | :--- | :--- | :--- |
| **$C^0$** | Continuous | It has no jumps, but it can have **"spikes"**. | We cannot guarantee the tangent plane everywhere. |
| **$C^1$** | Differentiable | The **first derivatives** are continuous. | We can use the **Gradient** and the **Tangent Plane**. |
| **$C^2$** | Twice differentiable | The **second derivatives** are continuous. | **Schwarz's theorem** is met and we can do **Taylor degree 2**. (Topic 9) |
| **$C^k$** | Class $k$ | It can be differentiated $k$ times continuously. | Taylor approximations up to degree $k$. |
| **$C^\infty$** | Smooth | It can be differentiated infinitely many times (Ex: polynomials, $\sin, e^x$). | Everything works always. |

> **Why are polynomials $C^\infty$ if the derivative ends up being 0?**
> "Infinitely many times" does not mean that the function has to become larger or more complex, but that the differentiation operation is always possible and the result is continuous.
> For example: $x^2 \xrightarrow{f'} 2x \xrightarrow{f''} 2 \xrightarrow{f'''} 0 \xrightarrow{f^{(4)}} 0 \dots$
> Since **0** is a constant function (and therefore continuous), it can be differentiated infinitely. A function is $C^n$ if its $n$-th derivative **exists and is continuous**.

::three{type="vis_regularitat_hibrida"}

> **Differentiability condition**: A function is differentiable at a point if it is of class $C^1$ in a neighborhood of that point. If it is not, we must resort to the formal definition of limit to see if the tangent plane exists.

---

## 4. Differentiability and tangent plane

If a function is of class $C^1$, we can approximate it locally by a tangent plane.

::three{type="pla_tangent"}

### 4.1 Explicit case: $z = f(x, y)$
If the surface is given explicitly, the tangent plane at the point $M(a, b, f(a,b))$ is:

**Tangent plane:**
$$z = f(a,b) + \frac{\partial f}{\partial x}(a,b)(x-a) + \frac{\partial f}{\partial y}(a,b)(y-b)$$

**Normal line:**
It has a direction vector $(\frac{\partial f}{\partial x}, \frac{\partial f}{\partial y}, -1)$. Its continuous equation is:
$$\frac{x-a}{\frac{\partial f}{\partial x}(a,b)} = \frac{y-b}{\frac{\partial f}{\partial y}(a,b)} = \frac{z-f(a,b)}{-1}$$

### 4.2 Implicit case: $F(x, y, z) = 0$
If the surface is defined by an implicit equation, the tangent plane at $M(a, b, c)$ is:

**Tangent plane:**
$$\frac{\partial F}{\partial x}(a,b,c)(x-a) + \frac{\partial F}{\partial y}(a,b,c)(y-b) + \frac{\partial F}{\partial z}(a,b,c)(z-c) = 0$$

**Normal line:**
It has the direction of the gradient $\nabla F(a,b,c)$. The continuous equation is:
$$\frac{x-a}{\frac{\partial F}{\partial x}(a,b,c)} = \frac{y-b}{\frac{\partial F}{\partial y}(a,b,c)} = \frac{z-c}{\frac{\partial F}{\partial z}(a,b,c)}$$

> **Conversion**: Any explicit function $z = f(x,y)$ can be treated as implicit by doing $F(x,y,z) = f(x,y) - z = 0$.

### 4.3 Horizontal tangent plane
If the tangent plane is **parallel to the $XY$ plane**:
*   **Condition**: $\frac{\partial f}{\partial x} = 0$ and $\frac{\partial f}{\partial y} = 0$ (zero gradient).
*   This happens at the critical points of the function.
