---
title: "Topic 8: Diagonalization"
description: "Eigenvalues, eigenvectors and the process to diagonalize matrices and endomorphisms."
order: 9
readTime: "15 min"
subject: "m1"
draft: false
isNew: true
---

**Diagonalization** is the process of finding a basis in which the matrix of an endomorphism is as simple as possible: a diagonal matrix. This allows us to understand the structure of the map and compute powers of matrices immediately.

## 0. Concepts 

### Eigenvalues and Eigenvectors
Let $f: E \to E$ be an endomorphism. We say that a scalar $\lambda$ is an **eigenvalue** of $f$ if there exists a vector $v \neq \vec{0}$ such that:
$$
f(v) = \lambda v
$$
This vector $v$ is called an **eigenvector** associated with the eigenvalue $\lambda$.

### Characteristic polynomial
To find the eigenvalues of a matrix $A$, we look for the roots of its **characteristic polynomial**:
$$
p(\lambda) = \det(A - \lambda I)
$$
The values of $\lambda$ that make $p(\lambda) = 0$ are the eigenvalues, $-\lambda I$ means subtracting $\lambda$ from the main diagonal.

### Eigenspaces ($E_\lambda$)
For each eigenvalue $\lambda$, the set of all its eigenvectors (plus the zero vector) forms a vector subspace called an **eigenspace**:

$$
E_\lambda = \ker(A - \lambda I)
$$

The dimension of this subspace is called **geometric multiplicity** ($m_g$).

---

## 1. Conditions for diagonalizability

A matrix $A \in \mathcal{M}_n(\mathbb{R})$ is diagonalizable if and only if:
1.  **The characteristic polynomial fully decomposes** in the working field (all roots are real).
2.  For each eigenvalue $\lambda$, its **algebraic multiplicity** ($m_a$, the number of times it appears as a root) is equal to its **geometric multiplicity** ($m_g$):
    $$m_a(\lambda) = m_g(\lambda)$$

> **Sufficient condition:** If $A$ has $n$ real and **distinct** eigenvalues, then $A$ is automatically diagonalizable.

To diagonalize a matrix $A$, we follow these steps:

1.  **Find the eigenvalues:** Solve $p(\lambda) = \det(A - \lambda I) = 0$.
2.  **Calculate the multiplicities:** Note down $m_a$ for each $\lambda$. If any root is complex, $A$ is not diagonalizable over $\mathbb{R}$.
3.  **Find the eigenvectors:** For each $\lambda$, solve the homogeneous system $(A - \lambda I)v = \vec{0}$.
    - The basis of solutions of this system will be the basis of the eigenspace $E_\lambda$.
    - Check that $\dim(E_\lambda) = m_a(\lambda)$. If for some $\lambda$ it is not met, $A$ is not diagonalizable.
4.  **Build matrices $P$ and $D$:**
    - **$D$ (Diagonal Matrix):** Place the eigenvalues on the diagonal.
    - **$P$ (Change of Basis Matrix):** Place the eigenvectors in columns, **in the same order** as their eigenvalues in $D$.
    - It holds that: $A = P D P^{-1}$ or $D = P^{-1} A P$.

### Step-by-step complete example

To see how this whole process works in practice, we will solve a detailed exercise of diagonalizing a $3 \times 3$ matrix step by step. This example corresponds to **Exercise 8.1 (section 3)** from the solutions list:

Consider the matrix $A \in \mathcal{M}_3(\mathbb{R})$:
$$A = \begin{pmatrix} 3 & 1 & 1 \\ 2 & 4 & 2 \\ 1 & 1 & 3 \end{pmatrix}$$

### Step 1: Find the eigenvalues
To find the eigenvalues, we solve the characteristic polynomial $p(\lambda) = \det(A - \lambda I) = 0$:
$$
p(\lambda) = \begin{vmatrix} 3-\lambda & 1 & 1 \\ 2 & 4-\lambda & 2 \\ 1 & 1 & 3-\lambda \end{vmatrix}
$$

To make the determinant easier, we can simplify the matrix by subtracting the third column from the first ($C_1 \leftarrow C_1 - C_3$):
$$
p(\lambda) = \begin{vmatrix} 2-\lambda & 1 & 1 \\ 0 & 4-\lambda & 2 \\ \lambda-2 & 1 & 3-\lambda \end{vmatrix}
$$

Now we add the first row to the third ($R_3 \leftarrow R_3 + R_1$):
$$
p(\lambda) = \begin{vmatrix} 2-\lambda & 1 & 1 \\ 0 & 4-\lambda & 2 \\ 0 & 2 & 4-\lambda \end{vmatrix}
$$

We expand by Laplace expansion along the first column (which now has two zeros):

$$p(\lambda) = (2-\lambda) \cdot \begin{vmatrix} 4-\lambda & 2 \\ 2 & 4-\lambda \end{vmatrix} = (2-\lambda) \left[ (4-\lambda)^2 - 4 \right]
$$

$$
p(\lambda) = (2-\lambda) \left[ (\lambda^2 - 8\lambda + 16) - 4 \right] = (2-\lambda)(\lambda^2 - 8\lambda + 12)
$$

We find the roots of the quadratic equation $\lambda^2 - 8\lambda + 12 = 0$:

$$
\lambda = \frac{8 \pm \sqrt{(-8)^2 - 4(1)(12)}}{2} = \frac{8 \pm \sqrt{64 - 48}}{2} = \frac{8 \pm 4}{2} \implies \lambda = 6, \quad \lambda = 2
$$

Therefore, the fully decomposed characteristic polynomial is:
$$
p(\lambda) = -(\lambda-2)^2(\lambda-6)
$$

The eigenvalues are the roots of the polynomial: **$\lambda_1 = 2$** and **$\lambda_2 = 6$**.

### Step 2: Calculate algebraic multiplicities ($m_a$)
We note down how many times each root is repeated:
*   For $\lambda_1 = 2$, we have **$m_a(2) = 2$** (since the factor $(\lambda-2)$ is squared).
*   For $\lambda_2 = 6$, we have **$m_a(6) = 1$**.

All eigenvalues are real, so the first condition for diagonalizability is met.

### Step 3: Find the eigenvectors and geometric multiplicities ($m_g$)
We look for the eigenspace for each eigenvalue by solving the homogeneous system $(A - \lambda I)v = \vec{0}$.

A) For $\lambda_1 = 2$:

We solve the system $(A - 2I)v = \vec{0}$:
$$
A - 2I = \begin{pmatrix} 1 & 1 & 1 \\ 2 & 2 & 2 \\ 1 & 1 & 1 \end{pmatrix}
$$

Since all three rows are multiples of the first, the system is equivalent to a single linear equation:
$$
x + y + z = 0 \implies x = -y - z
$$

Since we have 3 variables and 1 equation, we have $3 - 1 = 2$ degrees of freedom. This means that the **geometric multiplicity** is:
$$
m_g(2) = \dim(E_2) = 2
$$

Since $m_g(2) = m_a(2) = 2$, the condition is met for this eigenvalue. We find a basis by choosing two linearly independent vectors:

* If $y = -1, z = 0 \implies x = 1 \implies v_1 = (-1, 1, 0)$ (changing the sign for convenience).
* If $y = 0, z = -1 \implies x = 1 \implies v_2 = (-1, 0, 1)$.

Thus, the eigenspace is:
$$E_2 = \langle (-1, 1, 0), (-1, 0, 1) \rangle$$

B) For $\lambda_2 = 6$:
We solve the system $(A - 6I)v = \vec{0}$:
$$
A - 6I = \begin{pmatrix} -3 & 1 & 1 \\ 2 & -2 & 2 \\ 1 & 1 & -3 \end{pmatrix}
$$

Putting in row echelon form or simplifying the equations:
1.  $-3x + y + z = 0$
2.  $2x - 2y + 2z = 0 \implies x - y + z = 0 \implies y = x + z$
3.  $x + y - 3z = 0$

We substitute $y = x + z$ in equation 3:
$$
x + (x + z) - 3z = 0 \implies 2x - 2z = 0 \implies x = z
$$

If $x = z$, then $y = z + z = 2z$. Therefore, the vectors have the form $(z, 2z, z) = z(1, 2, 1)$.
The **geometric multiplicity** is:
$$m_g(6) = \dim(E_6) = 1$$

Since $m_g(6) = m_a(6) = 1$, the condition is also met. A vector that spans this space is:
$$v_3 = (1, 2, 1)$$

The eigenspace is:
$$E_6 = \langle (1, 2, 1) \rangle$$

Since **for all eigenvalues their algebraic multiplicity is equal to their geometric multiplicity**, we conclude that **matrix $A$ is diagonalizable**.

### Step 4: Build matrices $P$ and $D$
*   The **diagonal matrix $D$** is built by placing the eigenvalues on the diagonal in the chosen order:
    $$
    D = \begin{pmatrix} 2 & 0 & 0 \\ 0 & 2 & 0 \\ 0 & 0 & 6 \end{pmatrix}
    $$

*   The **change of basis matrix $P$** is built by placing the basis eigenvectors in columns, **in the same order** as their eigenvalues in $D$:
    $$
    P = \begin{pmatrix} -1 & -1 & 1 \\ 1 & 0 & 2 \\ 0 & 1 & 1 \end{pmatrix}
    $$

We can verify that $A = P D P^{-1}$ is met by calculating the inverse of $P$:
$$
P^{-1} = \frac{1}{4} \begin{pmatrix} -2 & 2 & -2 \\ -1 & -1 & 3 \\ 1 & 1 & 1 \end{pmatrix}
$$

And checking by multiplying the matrices that, effectively, $A = P D P^{-1}$.

---

## 2. Properties

### Triangular matrices
If a matrix is triangular (upper or lower), its eigenvalues are directly the elements of the **main diagonal**. If the diagonal elements are all distinct, the matrix is diagonalizable.

### Bijectivity and eigenvalue 0
An endomorphism $f$ is **bijective** (invertible) if and only if **$0$ is not an eigenvalue** of $f$. If $\lambda = 0$ is an eigenvalue, then $\ker(f) \neq \{0\}$ and the map is not injective.

### Powers of matrices
If $A$ is diagonalizable ($A = P D P^{-1}$), then:

$$
A^k = P D^k P^{-1}
$$

Where $D^k$ is simply the diagonal matrix with each element raised to the power of $k$. This saves thousands of operations in calculations like $A^{100}$.

> If $v$ is an eigenvector of $A$ with eigenvalue $\lambda$, then $v$ is also an eigenvector of $A^k$ with eigenvalue **$\lambda^k$**.

These properties will help you in proof exercises:

- **Invariance by scalar:** If $v$ is an eigenvector of $f$ with eigenvalue $\lambda$, then $\alpha v$ (with $\alpha \neq 0$) is also one.
- **Sum of eigenvalues:** The sum of the eigenvalues (counting multiplicities) is equal to the **trace** of the matrix.
- **Product of eigenvalues:** The product of the eigenvalues is equal to the **determinant** of the matrix.
- **Linear independence:** Eigenvectors associated with distinct eigenvalues are always linearly independent.

---

## 3. Diagonalization of endomorphisms in other spaces

The concept is the same for polynomial spaces ($P_n(\mathbb{R})$) or matrices ($\mathcal{M}_n(\mathbb{R})$):

1.  Choose a basis (usually the canonical one).
2.  Find the associated matrix $M(f, B)$.
3.  Apply the diagonalization process to this matrix.
4.  Remember that the resulting "eigenvectors" will be the coordinates of the elements of the original space (polynomial, matrix, etc.).

> If you work with parameters, you will have to discuss the diagonalizability according to their values that vary the multiplicities or the existence of real roots.
