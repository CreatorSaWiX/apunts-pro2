---
title: "Topic 5: Matrix Algebra"
description: "Fundamental review: definitions, operations, inverse matrix and properties of the matrix space."
order: 6
readTime: "25 min"
subject: "m1"
draft: false
isNew: true
---

## 1. Matrix algebra and rank

### Scalars ($\mathbb{K}$)
By a **field of scalars $\mathbb{K}$** we will understand a set of numbers with two operations (addition and product) that satisfy the usual properties (commutative, associative, distributive, neutral elements) and where all non-zero elements are invertible. **Examples of fields**: $\mathbb{R}$ (Reals), $\mathbb{Q}$ (Rationals), $\mathbb{C}$ (Complex), $\mathbb{Z}_p$ (integers modulo prime $p$).

### Definition of a matrix
A matrix of type $m \times n$ with elements in the field $\mathbb{K}$ consists of $mn$ elements arranged in $m$ rows and $n$ columns:

$$
A = \begin{pmatrix} 
a_{11} & a_{12} & \dots & a_{1n} \\ 
a_{21} & a_{22} & \dots & a_{2n} \\ 
\vdots & \vdots & \ddots & \vdots \\ 
a_{m1} & a_{m2} & \dots & a_{mn} 
\end{pmatrix} \in \mathcal{M}_{m \times n}(\mathbb{K})
$$

### Types of matrices

| Type | Description | Formal Representation | Practical Example |
| :--- | :--- | :--- | :--- |
| **Square** | Same number of rows as columns ($m=n$). | $A \in \mathcal{M}_{n \times n}(\mathbb{K})$ | $\begin{pmatrix} 1 & 5 \\ -2 & 3 \end{pmatrix}$ |
| **Upper triangular** | All elements below the diagonal are zero. | $a_{ij} = 0$ if $i > j$ | $\begin{pmatrix} 1 & 2 & 3 \\ 0 & 4 & 5 \\ 0 & 0 & 6 \end{pmatrix}$ |
| **Lower triangular** | All elements above the diagonal are zero. | $a_{ij} = 0$ if $i < j$ | $\begin{pmatrix} 1 & 0 & 0 \\ 2 & 4 & 0 \\ 3 & 5 & 6 \end{pmatrix}$ |
| **Diagonal** | Only elements on the diagonal can be non-zero. | $a_{ij} = 0$ if $i \neq j$ | $\begin{pmatrix} 2 & 0 & 0 \\ 0 & 5 & 0 \\ 0 & 0 & -1 \end{pmatrix}$ |
| **Identity ($I_n$)** | Diagonal matrix where all diagonal elements are $1$. | $a_{ii} = 1, a_{ij} = 0$ | $\begin{pmatrix} 1 & 0 \\ 0 & 1 \end{pmatrix}$ |
| **Symmetric** | The matrix is equal to its transpose ($A = A^t$). | $a_{ij} = a_{ji}$ | $\begin{pmatrix} 1 & 2 \\ 2 & 3 \end{pmatrix}$ |
| **Skew-symmetric** | The matrix is equal to its transpose with a changed sign. | $a_{ij} = -a_{ji}$ | $\begin{pmatrix} 0 & 5 \\ -5 & 0 \end{pmatrix}$ |
| **Transpose ($A^t$)** | Obtained by swapping rows with columns. | $(a_{ij})^t = a_{ji}$ | $\begin{pmatrix} a & b \\ c & d \end{pmatrix}^t = \begin{pmatrix} a & c \\ b & d \end{pmatrix}$ |
| **Trace (Tr)** | Sum of the elements on the main diagonal. | $\text{Tr}(A) = \sum a_{ii}$ | $\text{Tr}\begin{pmatrix} 2 & 1 \\ 0 & 3 \end{pmatrix} = 5$ |

### Matrix operations

| Operation | Rule / Definition | Example |
| :--- | :--- | :--- |
| **Addition ($A+B$)** | Element by element: $c_{ij} = a_{ij} + b_{ij}$ | $\begin{pmatrix} 1 & 2 \\ 3 & 4 \end{pmatrix} + \begin{pmatrix} 0 & 1 \\ 2 & 0 \end{pmatrix} = \begin{pmatrix} 1 & 3 \\ 5 & 4 \end{pmatrix}$ |
| **Scalar product** | Multiply all elements by $\lambda$: $\lambda \cdot a_{ij}$ | $3 \cdot \begin{pmatrix} 1 & -2 \\ 0 & 4 \end{pmatrix} = \begin{pmatrix} 3 & -6 \\ 0 & 12 \end{pmatrix}$ |
| **Product ($AB$)** | Row multiplied by column: $\sum a_{ik}b_{kj}$ | $\begin{pmatrix} 1 & 2 \\ 0 & 1 \end{pmatrix} \begin{pmatrix} 1 & 0 \\ 2 & 3 \end{pmatrix} = \begin{pmatrix} \mathbf{5} & \mathbf{6} \\ \mathbf{2} & \mathbf{3} \end{pmatrix}$ |

### Properties of the product

| Property | Condition / Rule | Example |
| :--- | :--- | :--- |
| **Non-commutative** | $AB \neq BA$ : The order of the factors alters the product. | $\begin{pmatrix} 1 & 0 \\ 0 & 0 \end{pmatrix} \begin{pmatrix} 0 & 1 \\ 0 & 0 \end{pmatrix} \neq \begin{pmatrix} 0 & 1 \\ 0 & 0 \end{pmatrix} \begin{pmatrix} 1 & 0 \\ 0 & 0 \end{pmatrix}$ |
| **Transpose** | $(AB)^t = B^t A^t$ : The order of the factors is inverted. | $\left( \begin{pmatrix} 1 & 2 \end{pmatrix} \begin{pmatrix} 3 \\ 0 \end{pmatrix} \right)^t = \begin{pmatrix} 3 & 0 \end{pmatrix} \begin{pmatrix} 1 \\ 2 \end{pmatrix}$ |
| **Associative** | $(AB)C = A(BC)$ : Grouping does not change the result. | $\left( \begin{pmatrix} 1 & 0 \end{pmatrix} \begin{pmatrix} 0 \\ 1 \end{pmatrix} \right) \begin{pmatrix} 2 \end{pmatrix} = \begin{pmatrix} 1 & 0 \end{pmatrix} \left( \begin{pmatrix} 0 \\ 1 \end{pmatrix} \begin{pmatrix} 2 \end{pmatrix} \right)$ |
| **Polynomial** | $p(A) = A^2 + \dots + \mathbf{a_0 I}$ : Constants carry the Identity. | For $p(x) = x^2 - 1$, we use $p(A) = A^2 - \mathbf{I}$. |

### Inverse matrix ($A^{-1}$)

| Concept | Expression / Rule | Example |
| :--- | :--- | :--- |
| **Definition** | $A \cdot A^{-1} = I$ : Only if the matrix has $\det(A) \neq 0$. | $\begin{pmatrix} 2 & 0 \\ 0 & 2 \end{pmatrix} \begin{pmatrix} \frac{1}{2} & 0 \\ 0 & \frac{1}{2} \end{pmatrix} = \begin{pmatrix} 1 & 0 \\ 0 & 1 \end{pmatrix}$ |
| **Invertible prod.** | $(AB)^{-1} = B^{-1} A^{-1}$ : The order of the factors is inverted. | $(2I \cdot 3I)^{-1} = \frac{1}{3}I \cdot \frac{1}{2}I = \frac{1}{6}I$ |
| **Transpose** | $(A^t)^{-1} = (A^{-1})^t$ : Transposing and inverting commute. | $\left(\begin{pmatrix} 2 & 0 \\ 0 & 3 \end{pmatrix}^t\right)^{-1} = \begin{pmatrix} 1/2 & 0 \\ 0 & 1/3 \end{pmatrix}$ |
| **Double inverse** | $(A^{-1})^{-1} = A$ : Inverting twice cancels the operation. | $\left(\begin{pmatrix} 5 \end{pmatrix}^{-1}\right)^{-1} = \begin{pmatrix} 1/5 \end{pmatrix}^{-1} = \begin{pmatrix} 5 \end{pmatrix}$ |

### Elementary row transformations

| Type | Operation (Notation) | Elementary Matrix ($E$) | Effect |
| :--- | :--- | :--- | :--- |
| **Type I** | $R_i \leftrightarrow R_j$ | $\begin{pmatrix} 0 & 1 \\ 1 & 0 \end{pmatrix}$ | Swaps Row 1 and Row 2. |
| **Type II** | $R_i \to \lambda R_i$ | $\begin{pmatrix} \mathbf{k} & 0 \\ 0 & 1 \end{pmatrix}$ | Multiplies Row 1 by a scalar $k \neq 0$. |
| **Type III** | $R_i \to R_i + \lambda R_j$ | $\begin{pmatrix} 1 & \mathbf{k} \\ 0 & 1 \end{pmatrix}$ | Adds Row 2 multiplied by $k$ to Row 1. |

**Elementary matrix ($E$)**: It is the result of applying **a single** elementary operation to the identity $I$. Multiplying $EA$ is equivalent to applying the direct operation to matrix $A$.

**Equivalence ($A \sim B$)**: We say that $A$ and $B$ are equivalent if we can get from one to the other by combining elementary operations.
> **Example**:  
> $A = \begin{pmatrix} 1 & 2 \\ 3 & 1 \end{pmatrix} \xrightarrow{R_2 - 3R_1} \mathbf{B = \begin{pmatrix} 1 & 2 \\ 0 & -5 \end{pmatrix}}$  
> This is expressed in matrices as $B = EA$ where $E = \begin{pmatrix} 1 & 0 \\ -3 & 1 \end{pmatrix}$.

### Row echelon matrices and rank
We say a matrix is in **row echelon form** when it has a descending staircase structure:

$$
\begin{pmatrix} 
\mathbf{1} & * & * & * \\ 
0 & \mathbf{1} & * & * \\ 
0 & 0 & 0 & \mathbf{1} \\ 
0 & 0 & 0 & 0 
\end{pmatrix}
$$

**Conditions**:
1. Rows of zeros always go to the bottom (below).
2. The first non-zero element in each row is a **1** (called a **pivot**).
3. Each pivot is to the right of the pivot in the row above it.

> **Definition of rank**: The number of non-zero rows (number of pivots) of an equivalent row echelon matrix.

### Invertibility condition
To know if a square matrix $A$ of order $n$ has an inverse, we use the rank:

> **$A$ is invertible $\iff \text{rank}(A) = n$**
> This implies that its reduced row echelon form is the **Identity ($I_n$)**.

### Gauss-Jordan method
To find the inverse, we "attach" the identity to the right and operate until the identity is on the left:

$$ (A \mid I_n) \xrightarrow{\text{Row operations}} (I_n \mid A^{-1}) $$

**Step-by-step example ($2 \times 2$):**
We invert $A = \begin{pmatrix} 1 & 2 \\ 1 & 1 \end{pmatrix}$:

1. **Augmented matrix**: $\left(\begin{array}{cc|cc} 1 & 2 & 1 & 0 \\ 1 & 1 & 0 & 1 \end{array}\right)$
2. **Make zero below ($R_2 - R_1$)**: $\left(\begin{array}{cc|cc} 1 & 2 & 1 & 0 \\ 0 & -1 & -1 & 1 \end{array}\right)$
3. **Normalize pivot ($R_2 \cdot (-1)$)**: $\left(\begin{array}{cc|cc} 1 & 2 & 1 & 0 \\ 0 & 1 & 1 & -1 \end{array}\right)$
4. **Make zero above ($R_1 - 2R_2$)**: $\left(\begin{array}{cc|cc} \mathbf{1} & \mathbf{0} & \mathbf{-1} & \mathbf{2} \\ \mathbf{0} & \mathbf{1} & \mathbf{1} & \mathbf{-1} \end{array}\right)$
5. **The part on the right is the inverse**: $A^{-1} = \begin{pmatrix} -1 & 2 \\ 1 & -1 \end{pmatrix}$.

---

## 2. Systems of linear equations

A system is defined, discussed (to know if it has a solution) and resolved (Gauss). We will see it all as a unified process.

### Basic definitions
- **Linear equation**: Expression of the type $a_1x_1 + \dots + a_nx_n = b$.
- **Solution to the system**: Values that satisfy **all** the equations simultaneously.
- **General solution**: The set formed by **all** possible solutions.

### System representation

| Format | Description | Example |
| :--- | :--- | :--- |
| **Algebraic** | The equations as they are. | $\begin{cases} x + 2y = 3 \\ x + y = 2 \end{cases}$ |
| **Matrix** | Product $Ax = b$ | $\begin{pmatrix} 1 & 2 \\ 1 & 1 \end{pmatrix} \begin{pmatrix} x \\ y \end{pmatrix} = \begin{pmatrix} 3 \\ 2 \end{pmatrix}$ |
| **Augmented** | Block $(A \mid b)$ | $\begin{pmatrix} 1 & 2 & \mid & 3 \\ 1 & 1 & \mid & 2 \end{pmatrix}$ |

Where the general **augmented matrix** is:
$$
(A \mid b) = \begin{pmatrix}
a_{11} & a_{12} & \dots & a_{1n} & \mid & b_1 \\
a_{21} & a_{22} & \dots & a_{2n} & \mid & b_2 \\
\vdots & \vdots & \ddots & \vdots & \mid & \vdots \\
a_{m1} & a_{m2} & \dots & a_{mn} & \mid & b_m
\end{pmatrix}
$$

### Equivalent systems and operations
We say that two systems are equivalent if they have the **same general solution**. To go from a system to another equivalent one, we can:
1. **Swap** two equations.
2. **Multiply** an equation by a $k \neq 0$.
3. **Add** to an equation a multiple of another ($E_i \to E_i + \lambda E_j$).

### Classification according to the number of solutions
1. **Inconsistent system (IS)**: It has no solution (they represent lines/planes that do not intersect).
2. **Determined consistent system (DCS)**: It has a single solution.
3. **Indetermined consistent system (ICS)**: It has infinite solutions.

### Homogeneous systems ($b = 0$)
These are systems where the entire column of independent terms is zero.
- **They are always consistent**: They have at least the **trivial solution** $(0, \dots, 0)$.
- **Discussion by rank**:
    - $\text{rank}(A) = n \implies$ **DCS** (only the trivial one).
    - $\text{rank}(A) < n \implies$ **ICS** (has non-trivial solutions).

### Resolution of row echelon systems
In a consistent row echelon system with $r = \text{rank}$ and $n = \text{unknowns}$:
- **Principal variables**: Correspond to the pivots (there are $r$).
- **Free variables**: The rest ($n - r$), which become parameters $\lambda, \mu, \dots$

**Example of parametric form (ICS)**:
If the result is $x + 2y = 5$, we set $y = \lambda$ (free):
$$ \begin{cases} x = 5 - 2\lambda \\ y = \lambda \end{cases} \implies (x, y) = (5, 0) + \lambda(-2, 1) $$
> The system has **1 degree of freedom** ($n-r = 1$).

---

### Discussion (Rouché-Frobenius Theorem)

This theorem allows classifying a system of equations by comparing the rank of the coefficient matrix ($A$) and that of the augmented matrix ($A \mid b$). 

Let **$r = \text{rank}(A)$**, **$r' = \text{rank}(A \mid b)$** and **$n$** the number of unknowns:

| Rank Condition | System Type | Solutions | Observation in Gauss |
| :--- | :--- | :--- | :--- |
| **$r < r'$** | **Inconsistent (IS)** | None | A row appears: $(0 \dots 0 \mid b)$ with $b \neq 0$. |
| **$r = r' = n$** | **Determined Cons. (DCS)** | Unique | We have as many pivots as unknowns. |
| **$r = r' < n$** | **Indetermined Cons. (ICS)** | Infinite | There are $n-r$ free variables (parameters). |

> If the system is consistent ($r = r'$), the value of **$r$** is called the **rank of the system**.

---

### Resolution (Gaussian Elimination)

Gaussian elimination is the systematic algorithm for solving SLEs. It follows this path:

1. **Augmented matrix**: Transform the system to the matrix $(A \mid b)$.
2. **Triangularization**: Make zeros below the pivots to obtain a row echelon matrix.
3. **Discussion**: Apply the **Rouché-Frobenius Thm.** to classify the system.
4. **Back-substitution**: If it is consistent, calculate the unknowns from bottom to top (from the last row).

> **Step-by-step example**: We solve $\begin{cases} x + 2y = 3 \\ 2x + 4y = 6 \end{cases}$
> 1. **Augmented**: $\left(\begin{array}{cc|c} 1 & 2 & 3 \\ 2 & 4 & 6 \end{array}\right) \xrightarrow{R_2 - 2R_1} \left(\begin{array}{cc|c} \mathbf{1} & 2 & 3 \\ 0 & 0 & 0 \end{array}\right)$
> 2. **Discussion**: $\text{rank}(A) = 1$, $\text{rank}(A|b) = 1$, $n = 2$. Since $1 = 1 < 2$, it is an **ICS**.
> 3. **Solution**: $x + 2y = 3 \implies x = 3 - 2\lambda, y = \lambda$.

---

## 3. Determinants and applications

The determinant is a scalar that summarizes the key properties of a square matrix: invertibility, rank and eigenvalues.
The determinant is a scalar value that indicates if a square matrix is invertible ($\det \neq 0$).

### Calculation methods

| Method | Rule / Definition | Example |
| :--- | :--- | :--- |
| **$2 \times 2$** | Cross product: $ad - bc$ | $\begin{vmatrix} 1 & 2 \\ 3 & 4 \end{vmatrix} = 4 - 6 = -2$ |
| **Diagonal / Triang.** | Product of the diagonal elements. | $\det \begin{pmatrix} \mathbf{2} & 5 \\ 0 & \mathbf{3} \end{pmatrix} = 2 \cdot 3 = 6$ |
| **Minors/Cofactors** | Expand by a row/column. | $\sum a_{ik} (-1)^{i+k} \det(A_{ik})$ |
| **Sarrus ($3 \times 3$)** | Sum of diagonals (positive and negative). | Only for orders $n=3$. |

### Determinants and elementary transformations

| Row Operation | Effect on the Determinant | Example / Note |
| :--- | :--- | :--- |
| **Swap rows** | The determinant **changes sign**. | $\det(B) = - \det(A)$ |
| **Multiply row by $k$** | The determinant is **multiplied by $k$**. | If $R_i \to k R_i$ |
| **Add combination** | The determinant **does NOT vary**. | Operation $R_i \to R_i + \lambda R_j$. |
| **Scalar matrix ($kA$)** | Multiplied by **$k^n$**. | $\det(k A) = k^n \det(A)$ ($n=$order). |

### Algebraic properties

| Operation | Determinant rule | Note |
| :--- | :--- | :--- |
| **Product ($AB$)** | $\det(AB) = \det(A) \cdot \det(B)$ | The determinant of the product is the product of the dets. |
| **Transpose ($A^t$)** | $\det(A^t) = \det(A)$ | The determinant does not vary when transposing. |
| **Inverse ($A^{-1}$)** | $\det(A^{-1}) = \frac{1}{\det(A)}$ | Only if $\det(A) \neq 0$. |
| **Addition ($A+B$)** | **NO general rule** | $\det(A+B) \neq \det(A) + \det(B)$ almost always. |

> **Constant sum trick**: If all rows sum to the same value $S$, adding all columns to the first ($C_1 \to C_1 + C_2 + \dots$) will allow us to take the factor $S$ out of the determinant.
> In general, **$\det(A + B) \neq \det(A) + \det(B)$**. Determinants "behave well" with the product, but not with addition.


### Applications: Invertibility and eigenvalues

Thanks to determinants, we can characterize the matrix quickly:

1. **Invertibility**: $A$ is invertible $\iff \det(A) \neq 0$.
2. **Calculation of Rank by Minors**: The rank is the order of the largest minor with a non-zero determinant.
3. **Eigenvalues**: Found by solving the characteristic equation $\det(A - \lambda I) = 0$.
