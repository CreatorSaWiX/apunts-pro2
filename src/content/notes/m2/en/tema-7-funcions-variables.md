---
title: "Topic 7: Multivariable func."
description: "Introduction to Euclidean space Rn, basic topology (open, closed, compact), surface graphs and contour lines."
order: 7
readTime: "30 min"
subject: "m2"
draft: false
isUpdated: 1
---

## 1. Euclidean space $\mathbb{R}^n$ and distance

In the $n$-dimensional space of real numbers, denoted by $\mathbb{R}^n$, the n-tuple $(x_1, \dots, x_n)$ represents a point or vector. To measure the "proximity" between points we need a distance function. The distance between two points $\mathbf{x}$ and $\mathbf{y}$ is the length of the segment connecting them:
$$d(\mathbf{x}, \mathbf{y}) = \sqrt{(x_1-y_1)^2 + (x_2-y_2)^2 + \dots + (x_n-y_n)^2}$$

::threeviz{type="vis_distancia_sync_3d_2d"}

---

## 2. The concept of "n-ball"

The ball is the extension of the interval concept from $\mathbb{R}$ to any dimension.

* **Open Ball ($B_r(\mathbf{a})$)**: Set of points at a distance less than $r$.
$$B(\vec{a}, r) = \{ \vec{x} \in \mathbb{R}^n : d(\vec{x}, \vec{a}) < r \}$$
* **Closed Ball ($\bar{B}_r(\mathbf{a})$)**: Includes the points that are exactly at distance $r$.
$$\bar{B}(\vec{a}, r) = \{ \vec{x} \in \mathbb{R}^n : d(\vec{x}, \vec{a}) \le r \}$$

::mafs{type="vis_bola_interactiva"}

---

## 3. Domain calculation methodology

| If you see... | Pay attention to... | Condition |
| :--- | :--- | :--- |
| **Roots** ($\sqrt{g}$) | The inside | $g(x, y) \ge 0$ |
| **Logs** ($\ln g$) | The argument | $g(x, y) > 0$ |
| **Fractions** ($1/g$) | The denominator | $g(x, y) \neq 0$ |

### Test point method
It is the "recipe" for drawing inequalities (e.g.: $x^2 + y^2 \le 4$):

1. **Draw the boundary**: Pretend it is an equal sign ($x^2 + y^2 = 4$). Draw the line.
2. **Choose a point**: Take $(0,0)$ or any easy point that is not on the line.
3. **Check**: If the point satisfies the inequality $\implies$ **Shade** its entire side.

::mafs{type="vis_metode_punts_prova"}

---

## 4. Practical topology

Let $A \subseteq \mathbb{R}^n$ be a set. Each point in space can be:

1. **Interior point**: If we can "enclose" it in a small ball that is entirely inside $A$. The set of interior points is the **Interior ($A^\circ$)**.
2. **Boundary point**: If any ball we make around it intersects both $A$ and its complement. The set of boundary points is the **Boundary ($Fr(A)$)**.
3. **Adherent point**: If any ball we make around it intersects $A$. The **Closure ($\bar{A}$)** is the union: $\bar{A} = A \cup Fr(A)$.

### The triangle example
Let's see how these concepts apply to the set:
$$A = \{(x, y) \in \mathbb{R}^2 : x \ge 0, y \ge 0, x+y < 1\}$$

::mafs{type="vis_ex_pissarra_topologia"}

---

## 5. Classification of sets

We can describe sets according to the behavior of their boundary:

- **Open**: If it does not contain any point of its boundary ($A \cap Fr(A) = \emptyset$). Equivalent to saying that $A = A^\circ$.
- **Closed**: If it contains its entire boundary ($Fr(A) \subseteq A$). Equivalent to saying that $A = \bar{A}$.
- **Bounded**: If the set can be enclosed within a ball of finite radius.
- **Compact**: Very important for extrema calculation. A set is compact if it is **closed and bounded**.

::mafs{type="vis_classificacio_conjunts"}

---

## 6. Boundaries and conics

| Name | Canonical Equation | Meaning of Parameters |
| :--- | :--- | :--- |
| **Circle** | $x^2 + y^2 = r^2$ | $r$: Radius of the circle |
| **Ellipse** | $\frac{x^2}{a^2} + \frac{y^2}{b^2} = 1$ | $a, b$: Semi-axes (radius in $x$ and $y$) |
| **Hyperbola** | $\frac{x^2}{a^2} - \frac{y^2}{b^2} = 1$ | $a$: Distance from the center to the vertex |
| **Rectangular Hyperbola** | $xy = k$ | $k$: Determines the distance to the axes |
| **Parabola** | $y = a x^2$ | $a$: Opening factor (larger $\implies$ narrower) |
| **Diamond** | $\lvert x \rvert + \lvert y \rvert = k$ | $k$: Distance from the center to the vertices |
| **Square** | $\max(\lvert x \rvert, \lvert y \rvert) = k$ | $k$: Semi-side (distance from center to sides) |

::mafs{type="vis_cheat_sheet_coniques"}

---

## 7. Geometry in $\mathbb{R}^3$ space

For 3D set exercises, the "mother" surfaces are:

| Surface | Equation | Visual Description |
| :--- | :--- | :--- |
| **Plane** | $Ax + By + Cz = D$ | Infinite sheet of paper |
| **Sphere** | $x^2 + y^2 + z^2 = r^2$ | Ping-pong ball |
| **Cylinder** | $x^2 + y^2 = r^2$ | Infinite tube (Z-axis) |
| **Paraboloid** | $z = x^2 + y^2$ | Cup / Bowl |

::threeviz{type="vis_superficies_basiques_3d"}

### Contour Lines
These are the "cut" lines at a constant height $k$ ($f(x, y) = k$).

::threeviz{type="vis_corbes_nivell_3d_2d"}
