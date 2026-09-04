---
title: "Topic 6: Vector spaces"
description: "Introduction to vector spaces, subspaces, bases and dimension."
order: 7
readTime: "25 min"
subject: "m1"
draft: false
isUpdated: 1
---

## 1. Vector space

Although we often think of vectors as "arrows" in space, for a mathematician, a vector is anything that can be added to another of its kind and can be stretched/multiplied by a number. For example, in $\mathbb{R}^2$ or $\mathbb{R}^3$, many other objects (like matrices or polynomials) behave like vectors if they have a defined **addition** and **scalar multiplication**. The most intuitive example of a vector space is $\mathbb{R}^n$:

$$
\mathbb{R}^n = \left\{ \begin{pmatrix} x_1 \\ x_2 \\ \vdots \\ x_n \end{pmatrix} : x_i \in \mathbb{R}, \, 1 \leq i \leq n \right\}
$$

::three{type="vis_rn_dimensionality"}

### Component-wise operations

Let $x = (x_1, \dots, x_n)$ and $y = (y_1, \dots, y_n)$ be two elements of $\mathbb{R}^n$, and let $\lambda \in \mathbb{R}$ be a scalar:

1.  **Addition**: $x + y = (x_1 + y_1, x_2 + y_2, \dots, x_n + y_n)$
2.  **Scalar multiplication**: $\lambda x = (\lambda x_1, \lambda x_2, \dots, \lambda x_n)$

A **vector space** over a field $\mathbb{K}$ (which will normally be $\mathbb{R}$) consists of a non-empty set $E$, with an internal operation (addition) and an external map (scalar multiplication) that satisfy 8 axioms:

### Axioms of addition

| Axiom | Definition | Example (in $\mathbb{R}^2$) |
| :--- | :--- | :--- |
| **e1** Associative | $u + (v + w) = (u + v) + w$ | $(1,1) + [(2,0) + (0,3)] = [(1,1) + (2,0)] + (0,3)$ |
| **e2** Commutative | $u + v = v + u$ | $(1,2) + (3,4) = (3,4) + (1,2) = (4,6)$ |
| **e3** Identity element | $\exists! \, 0_E \in E : u + 0_E = u$ | $(x,y) + (0,0) = (x,y)$ |
| **e4** Inverse element | $\forall u, \exists! \, (-u) : u + (-u) = 0_E$ | $(3,-2) + (-3,2) = (0,0)$ |

::mafs{type="vis_axiomes_suma"}

### Axioms of scalar multiplication

| Axiom | Definition | Example |
| :--- | :--- | :--- |
| **e5** Associative | $\lambda(\mu u) = (\lambda\mu)u$ | $2 \cdot (3 \cdot (1,1)) = (2 \cdot 3) \cdot (1,1) = (6,6)$ |
| **e6** Distr. w.r.t vector addition | $\lambda(u + v) = \lambda u + \lambda v$ | $2 \cdot [(1,0) + (0,1)] = 2(1,0) + 2(0,1) = (2,2)$ |
| **e7** Distr. w.r.t scalar addition | $(\lambda + \mu)u = \lambda u + \mu u$ | $(2 + 3) \cdot (1,1) = 2(1,1) + 3(1,1) = (5,5)$ |
| **e8** Identity element of scalar mult. | $1 \cdot u = u$ | $1 \cdot (x,y) = (x,y)$ |

::mafs{type="vis_axiomes_producte"}

### Examples of vector spaces

Beyond $\mathbb{R}^n$, we find many other sets that satisfy these properties:

*   **Matrices $\mathcal{M}_{m \times n}(\mathbb{K})$**: With standard matrix addition and scalar multiplication.
*   **Polynomials $\mathcal{P}(\mathbb{R})$**: All polynomials with real coefficients.
*   **Polynomials of degree $\leq d$ ($\mathcal{P}_d(\mathbb{R})$)**: Fixing a maximum degree.
*   **Trivial space $\{0_E\}$**: Formed only by the zero vector.
*   **Solutions of a homogeneous linear system**: The set of solutions to $Ax = 0$ always forms a vector space.

::mafs{type="vis_exemples_espais"}

### Basic properties

If $v \in E$ and $\lambda \in \mathbb{K}$, the following always hold:

1.  **$0 \cdot v = 0_E$**: The zero scalar times the vector gives the identity element.
2.  **$\lambda \cdot 0_E = 0_E$**: Any scalar times the zero vector gives the zero vector.
3.  **If $\lambda v = 0_E$**, then **$\lambda = 0$** or **$v = 0_E$**. (A zero product implies one of the factors is zero).
4.  The inverse element of $v$ is **$(-1)v$**. We usually write it as $-v$.

## 2. Linear combination and vector subspaces

### 2.1 Linear combination
Let's imagine that the ingredients are $\vec{v}$ and $\vec{w}$ (the vectors) and the numbers: $\lambda = 2$ and $\mu = 3$ (the scalars). The linear combination is the final dish: $2\vec{v} + 3\vec{w}$.

Given the vectors $u_1, \dots, u_k \in E$, a **linear combination** of them is any expression of the form:
$$v = \lambda_1 u_1 + \lambda_2 u_2 + \dots + \lambda_k u_k$$
where the $\lambda_i$ are scalars. 

::mafs{type="vis_combinacio_lineal"}

### 2.2 Vector subspaces
A **vector subspace** is a subset of a space that **behaves exactly the same as the original space**. 

It is a universe within another universe that preserves the same "physics" (the operations of addition and multiplication). This subset is **autonomous**: if you limit yourself to operating with its vectors by making **linear combinations**, you will never be able to escape it.

For this to be possible, there are two requirements:
1.  **The origin must be there**: You cannot have a universe without a coordinate center $(0,0,0)$.
2.  **The structure must be flat**: Any curvature or finite boundary would cause you to exit to outer space when stretching a vector. That's why subspaces are always lines, planes or hyperplanes passing through the origin.

Formally, a non-empty subset $S \subseteq E$ is a **vector subspace** if it itself has a vector space structure with the same operations as $E$. In practice, we only need to verify that it is **closed under linear combinations**:

1.  **Contains the zero vector**: $0_E \in S$. (If it's not there, we already know for sure it's not a subspace).
2.  **Closed under addition**: For all $u, v \in S \implies u + v \in S$.
3.  **Closed under scalar multiplication**: For all $u \in S$ and $\lambda \in \mathbb{K} \implies \lambda u \in S$.

::mafs{type="vis_sev_intro"}

> The zero vector **$0_E$** belongs to all vector subspaces. If a set does not contain zero, it **cannot** be a subspace.

### 2.3 Linear independence

A set of vectors $\{u_1, \dots, u_k\}$ is **linearly independent (LI)** if each one provides **new information**. If one were **linearly dependent (LD)**, it would mean that it's "redundant" because you can manufacture it by combining the others. For example: 
*   **LI (Independent)**: $u = (1, 0)$ and $v = (0, 1)$. There is no way to multiply $(1,0)$ by a number and get $(0,1)$. They are totally different paths.
*   **LD (Dependent)**: $u = (1, 2)$ and $v = (2, 4)$. Here $v = 2u$. Vector $v$ doesn't tell us anything new, it's just vector $u$ stretched. **It's redundant**.

To know if a set is LI or LD, we have three main methods:

### Method 1: The fundamental equation (Definition)
From the definition, we set up the equation:
$$\lambda_1 u_1 + \lambda_2 u_2 + \dots + \lambda_k u_k = 0_E$$

*   If the **only** solution is the trivial one ($\lambda_1 = \dots = \lambda_k = 0$) $\implies$ **LI**.
*   If we find any other combination $\implies$ **LD**.

**Example (Polynomials)**: Are $p_1 = x+1$ and $p_2 = x-1$ independent?
$\lambda_1(x+1) + \lambda_2(x-1) = 0 \implies (\lambda_1+\lambda_2)x + (\lambda_1-\lambda_2) = 0$.
Solving the system $\lambda_1+\lambda_2=0$ and $\lambda_1-\lambda_2=0$, we obtain $\lambda_1=0$ and $\lambda_2=0$. They are **LI**.

### Method 2: The Rank (For vectors in $\mathbb{R}^n$)
If we have numerical vectors, the fastest way is to put them as columns in a matrix $A$ and calculate its **rank** ($r$).
*   If **$r = \text{number of vectors}$** $\implies$ **LI**.
*   If **$r < \text{number of vectors}$** $\implies$ **LD**.

**Example**: For $u=(1,0,1)$, $v=(0,1,1)$ and $w=(1,1,2)$, the rank of the matrix is 2 (because $w = u + v$). Since we have 3 vectors but the rank is 2, the set is **LD**.

### Method 3: System resolution (DCS/ICS)
When we set up the fundamental equation as a system of homogeneous linear equations ($Ax=0$):
*   If the system is **Determined Consistent System (DCS)** $\implies$ the only solution is zero $\implies$ **LI**.
*   If the system is **Indetermined Consistent System (ICS)** $\implies$ there are infinite possible combinations $\implies$ **LD**.

### 2.4 Spanned subspace
The **subspace spanned** by a set of vectors $\{u_1, \dots, u_k\}$, symbolized by $\langle u_1, \dots, u_k \rangle$, is the set of **all** their possible linear combinations. It is the smallest vector subspace that contains these vectors.

::mafs{type="vis_independencia_lineal"}

### 2.5 Operations with subspaces

When we have two subspaces $S$ and $W$ (two mini-universes), we can try to combine them. But not all combinations respect the "laws of physics" of vectors.

::mafs{type="vis_operacions_sev"}

### 1. Intersection ($S \cap W$)
The intersection is the set of vectors that **belong to both universes at the same time**.
*   **Intuition**: If you have two planes passing through the origin, their intersection is the line where they intersect. Since both planes are "stable", the ground they share is too.
*   **Golden rule**: The intersection of subspaces **ALWAYS** is a vector subspace.

### 2. Union ($S \cup W$)
Trying to unite two subspaces by simply "putting them together" (as if they were two stickers) **does not work**.
*   **Intuition**: Imagine two lines (the X axis and the Y axis). The union is only the points that are on the axes. But if you add the vector $(1,0)$ from the X axis and $(0,1)$ from the Y axis, you get $(1,1)$, which is in the middle of the plane and **off the axes**. You've left the "club"!
*   **Conclusion**: The union is **NOT** normally a subspace.

### 3. Sum ($S + W$): The expansion
Since the union fails, the **sum** is the solution to merge subspaces. It consists of taking all possible sums between a vector from $S$ and one from $W$.
*   **Intuition**: It's like taking two lines and "filling" all the space between them until forming a complete plane. The sum is **always** a subspace (the smallest one containing $S$ and $W$).
*   **In practice**: To find a basis for $S+W$, we join the generators of $S$ and those of $W$ and eliminate the redundant ones (the dependent ones).

### 4. Direct Sum ($S \oplus W$): Absolute independence
We say the sum is **direct** if the two universes **only touch at the zero vector** ($S \cap W = \{0_E\}$). 
*   **Intuition**: It is the "cleanest" possible fusion. It means that each vector in the resulting space can be written in a **unique way** as a part from $S$ and a part from $W$. There is no redundancy.

---

## 3. Bases and dimension

### Basis
A set of vectors $B = \{u_1,\dots,u_n\}$ is said to be a basis of a Vector Subspace $S$ if and only if rank $P^B_C = n = \dim(S)$:

1. **Linearly independent (LI)**.
2. **Generator** of $S$.

### Dimension
The **dimension** ($\dim E$) is the number of vectors any of its bases has. 

| Space | Dimension |
| :--- | :--- |
| $\mathbb{R}^n$ | $n$ |
| $\mathcal{M}_{m \times n}(\mathbb{K})$ | $m \cdot n$ |
| $\mathcal{P}_d(\mathbb{R})$ | $d + 1$ |
| Trivial subspace $\{0_E\}$ | $0$ |

### Grassmann's Formula
Vital for sum and intersection exercises:
$$\dim(S+W) = \dim S + \dim W - \dim(S \cap W)$$

Let there be $k$ vectors in a space $E$ of dimension $n$:
1. **$k > n$**: The set is **always LD** (redundant vectors).
2. **$k < n$**: The set **cannot generate** $E$ (missing vectors).
3. **$k = n$**: If you prove they are **LI** (or that they generate), they are automatically a **Basis**. (This saves you half the work!).

::mafs{type="vis_regles_or_base"}

---

## 4. Coordinates and change of basis

Any vector $v$ is uniquely expressed in a basis $B$ through its **coordinates** $v_B$. The change of basis matrix $P_{B'}^B$ relates them:
$$v_{B'} = P_{B'}^B \cdot v_B$$

::mafs{type="vis_canvi_base"}

:::tip{title="The key to Change of Basis (Exercise 6.40)"}
The change of basis matrix from the canonical to B (**$P_{can}^B$**) is obtained by placing the vectors of basis B **in columns**. 
This means that if you know the coordinates in basis $B$, you can find the "normal" (canonical) vector by doing: $v_{can} = P_{can}^B \cdot v_B$.
:::

<!-- 
---

## 7. Practical guide: Vector Subspace Equations

### A. Parametric equations
They express each component of the vector in terms of parameters ($\alpha, \beta, \gamma \dots$).
- **From generators to parametric**: Simply write the generic linear combination.
  Ex: $\langle (1,0), (0,1) \rangle \implies (x,y) = \alpha(1,0) + \beta(0,1) \implies \{x=\alpha, y=\beta\}$.

### B. From Generators to Implicit (Gauss Method)
You have the generators $\langle u_1, u_2 \rangle$ and you want to know what equations the variables $(x, y, z)$ must satisfy.

**Practical example (Step by step):**
Let $u_1=(1,1,2)^T$ and $u_2=(0,1,1)^T$. We write the augmented matrix:
$$ \left( \begin{array}{cc|c} 1 & 0 & x \\ 1 & 1 & y \\ 2 & 1 & z \end{array} \right) \xrightarrow{R_2-R_1, R_3-2R_1} \left( \begin{array}{cc|c} 1 & 0 & x \\ 0 & 1 & y-x \\ 0 & 1 & z-2x \end{array} \right) \xrightarrow{R_3-R_2} \left( \begin{array}{cc|c} 1 & 0 & x \\ 0 & 1 & y-x \\ \mathbf{0} & \mathbf{0} & \mathbf{z-x-y} \end{array} \right) $$
For the system to be consistent, what remains to the right of the row of zeros must be **0**.
**Answer**: The implicit equation is $z - x - y = 0$.

### B. From Implicit to Generators
Simply solve the system of linear equations. The free variables (parameters) will give you the basis vectors.
*Number of parameters = $\dim E - \text{number of LI equations}$.*

:::tip Reminder for the Exam
To expand an LI set to a basis of $E$, simply add vectors from the canonical basis one by one, checking that the rank increases, until reaching $\dim E$ vectors.
::: -->
