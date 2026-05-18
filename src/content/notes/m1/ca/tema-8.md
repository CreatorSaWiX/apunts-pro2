---
title: "Tema 8: Diagonalització"
description: "Valors propis, vectors propis i el procés per diagonalitzar matrius i endomorfismes."
order: 9
readTime: "15 min"
subject: "m1"
draft: false
isNew: true
---

La **diagonalització** és el procés de trobar una base en la qual la matriu d'un endomorfisme és el més simple possible: una matriu diagonal. Això ens permet entendre l'estructura de l'aplicació i calcular potències de matrius de forma immediata.

## 0. Conceptes 

### Valors i vectors Propis
Sigui $f: E \to E$ un endomorfisme. Diem que un escalar $\lambda$ és un **valor propi** (VAP) de $f$ si existeix un vector $v \neq \vec{0}$ tal que:
$$
f(v) = \lambda v
$$
Aquest vector $v$ s'anomena **vector propi** associat al valor propi $\lambda$.

### Polinomi característic
Per trobar els valors propis d'una matriu $A$, busquem les arrels del seu **polinomi característic**:
$$
p(\lambda) = \det(A - \lambda I)
$$
Els valors de $\lambda$ que fan que $p(\lambda) = 0$ són els valors propis, $-\lambda I$ vol dir restar $\lambda$ a la diagonal principal.

### Subespais propis ($E_\lambda$)
Per a cada valor propi $\lambda$, el conjunt de tots els seus vectors propis (més el vector zero) forma un subespai vectorial anomenat **subespai propi**:

$$
E_\lambda = \ker(A - \lambda I)
$$

La dimensió d'aquest subespai s'anomena **multiplicitat geomètrica** ($m_g$).

---

## 1. Condicions de diagonalitzabilitat

Una matriu $A \in \mathcal{M}_n(\mathbb{R})$ és diagonalitzable si i només si:
1.  **El polinomi característic descompon totalment** en el cos de treball (totes les arrels són reals).
2.  Per a cada valor propi $\lambda$, la seva **multiplicitat algebraica** ($m_a$, el nombre de vegades que surt com a arrel) és igual a la seva **multiplicitat geomètrica** ($m_g$):
    $$m_a(\lambda) = m_g(\lambda)$$

> **Condició suficient:** Si $A$ té $n$ valors propis reals i **distints**, llavors $A$ és automàticament diagonalitzable.

Per diagonalitzar una matriu $A$, seguim aquests passos:

1.  **Trobar els valors propis:** Resol $p(\lambda) = \det(A - \lambda I) = 0$.
2.  **Calcular les multiplicitats:** Anota $m_a$ per a cada $\lambda$. Si alguna arrel és complexa, $A$ no és diagonalitzable sobre $\mathbb{R}$.
3.  **Trobar els vectors propis:** Per a cada $\lambda$, resol el sistema homogeni $(A - \lambda I)v = \vec{0}$.
    - La base de solucions d'aquest sistema serà la base del subespai propi $E_\lambda$.
    - Comprova que $\dim(E_\lambda) = m_a(\lambda)$. Si per algun $\lambda$ no es compleix, $A$ no és diagonalitzable.
4.  **Construir les matrius $P$ i $D$:**
    - **$D$ (Matriu Diagonal):** Col·loca els valors propis a la diagonal.
    - **$P$ (Matriu de Canvi de Base):** Col·loca els vectors propis en columnes, **en el mateix ordre** que els seus valors propis a $D$.
    - Es compleix que: $A = P D P^{-1}$ o $D = P^{-1} A P$.

### Exemple complet pas a pas

Per veure com funciona tot aquest procés a la pràctica, resoldrem de forma detallada un exercici de diagonalització d'una matriu $3 \times 3$ pas a pas. Aquest exemple correspon a l'**Exercici 8.1 (apartat 3)** de la llista de solucionaris:

Considerem la matriu $A \in \mathcal{M}_3(\mathbb{R})$:
$$A = \begin{pmatrix} 3 & 1 & 1 \\ 2 & 4 & 2 \\ 1 & 1 & 3 \end{pmatrix}$$

### Pas 1: Trobar els valors propis
Per trobar els valors propis, resolem el polinomi característic $p(\lambda) = \det(A - \lambda I) = 0$:
$$
p(\lambda) = \begin{vmatrix} 3-\lambda & 1 & 1 \\ 2 & 4-\lambda & 2 \\ 1 & 1 & 3-\lambda \end{vmatrix}
$$

Per fer el determinant més fàcil, podem simplificar la matriu restant la tercera columna a la primera ($C_1 \leftarrow C_1 - C_3$):
$$
p(\lambda) = \begin{vmatrix} 2-\lambda & 1 & 1 \\ 0 & 4-\lambda & 2 \\ \lambda-2 & 1 & 3-\lambda \end{vmatrix}
$$

Ara sumem la primera fila a la tercera ($F_3 \leftarrow F_3 + F_1$):
$$
p(\lambda) = \begin{vmatrix} 2-\lambda & 1 & 1 \\ 0 & 4-\lambda & 2 \\ 0 & 2 & 4-\lambda \end{vmatrix}
$$

Desenvolupem pel mètode de Laplace per la primera columna (que ara té dos zeros):

$$p(\lambda) = (2-\lambda) \cdot \begin{vmatrix} 4-\lambda & 2 \\ 2 & 4-\lambda \end{vmatrix} = (2-\lambda) \left[ (4-\lambda)^2 - 4 \right]
$$

$$
p(\lambda) = (2-\lambda) \left[ (\lambda^2 - 8\lambda + 16) - 4 \right] = (2-\lambda)(\lambda^2 - 8\lambda + 12)
$$

Trobem les arrels de l'equació de segon grau $\lambda^2 - 8\lambda + 12 = 0$:

$$
\lambda = \frac{8 \pm \sqrt{(-8)^2 - 4(1)(12)}}{2} = \frac{8 \pm \sqrt{64 - 48}}{2} = \frac{8 \pm 4}{2} \implies \lambda = 6, \quad \lambda = 2
$$

Per tant, el polinomi característic completament descompost és:
$$
p(\lambda) = -(\lambda-2)^2(\lambda-6)
$$

Els valors propis són les arrels del polinomi: **$\lambda_1 = 2$** i **$\lambda_2 = 6$**.

### Pas 2: Calcular les multiplicitats algebraiques ($m_a$)
Anotem quantes vegades es repeteix cada arrel:
*   Per a $\lambda_1 = 2$, tenim **$m_a(2) = 2$** (ja que el factor $(\lambda-2)$ està al quadrat).
*   Per a $\lambda_2 = 6$, tenim **$m_a(6) = 1$**.

Tots els valors propis són reals, per tant la primera condició de diagonalitzabilitat es compleix.

### Pas 3: Trobar els vectors propis i les multiplicitats geomètriques ($m_g$)
Busquem el subespai de vectors propis per a cada valor propi resolent el sistema homogeni $(A - \lambda I)v = \vec{0}$.

A) Per a $\lambda_1 = 2$:

Resolem el sistema $(A - 2I)v = \vec{0}$:
$$
A - 2I = \begin{pmatrix} 1 & 1 & 1 \\ 2 & 2 & 2 \\ 1 & 1 & 1 \end{pmatrix}
$$

Com que les tres files són múltiples de la primera, el sistema és equivalent a una única equació lineal:
$$
x + y + z = 0 \implies x = -y - z
$$

Com que tenim 3 variables i 1 equació, tenim $3 - 1 = 2$ graus de llibertat. Això significa que la **multiplicitat geomètrica** és:
$$
m_g(2) = \dim(E_2) = 2
$$

Com que $m_g(2) = m_a(2) = 2$, es compleix la condició per a aquest valor propi. Trobem una base triant dos vectors linealment independents:

* Si $y = -1, z = 0 \implies x = 1 \implies v_1 = (-1, 1, 0)$ (fent el canvi de signe per conveniència).
* Si $y = 0, z = -1 \implies x = 1 \implies v_2 = (-1, 0, 1)$.

Així doncs, el subespai propi és:
$$E_2 = \langle (-1, 1, 0), (-1, 0, 1) \rangle$$

B) Per a $\lambda_2 = 6$:
Resolem el sistema $(A - 6I)v = \vec{0}$:
$$
A - 6I = \begin{pmatrix} -3 & 1 & 1 \\ 2 & -2 & 2 \\ 1 & 1 & -3 \end{pmatrix}
$$

Escalonant o simplificant les equacions:
1.  $-3x + y + z = 0$
2.  $2x - 2y + 2z = 0 \implies x - y + z = 0 \implies y = x + z$
3.  $x + y - 3z = 0$

Substituïm $y = x + z$ a l'equació 3:
$$
x + (x + z) - 3z = 0 \implies 2x - 2z = 0 \implies x = z
$$

Si $x = z$, llavors $y = z + z = 2z$. Per tant, els vectors tenen la forma $(z, 2z, z) = z(1, 2, 1)$.
La **multiplicitat geomètrica** és:
$$m_g(6) = \dim(E_6) = 1$$

Com que $m_g(6) = m_a(6) = 1$, la condició també es compleix. Un vector que genera aquest espai és:
$$v_3 = (1, 2, 1)$$

El subespai propi és:
$$E_6 = \langle (1, 2, 1) \rangle$$

Com que **per a tots els valors propis la seva multiplicitat algebraica és igual a la geomètrica**, concloem que **la matriu $A$ és diagonalitzable**.

### Pas 4: Construir les matrius $P$ i $D$
*   La **matriu diagonal $D$** es construeix col·locant els valors propis a la diagonal en l'ordre triat:
    $$
    D = \begin{pmatrix} 2 & 0 & 0 \\ 0 & 2 & 0 \\ 0 & 0 & 6 \end{pmatrix}
    $$

*   La **matriu de canvi de base $P$** es construeix situant en columnes els vectors de la base de vectors propis, **en el mateix ordre** que els seus valors propis a $D$:
    $$
    P = \begin{pmatrix} -1 & -1 & 1 \\ 1 & 0 & 2 \\ 0 & 1 & 1 \end{pmatrix}
    $$

Podem verificar que es compleix $A = P D P^{-1}$ calculant la inversa de $P$:
$$
P^{-1} = \frac{1}{4} \begin{pmatrix} -2 & 2 & -2 \\ -1 & -1 & 3 \\ 1 & 1 & 1 \end{pmatrix}
$$

I comprovant multiplicant les matrius que, efectivament, $A = P D P^{-1}$.

---

## 2. Propietats

### Matrius triangulars
Si una matriu és triangular (superior o inferior), els seus valors propis són directament els elements de la **diagonal principal**. Si els elements de la diagonal són tots distints, la matriu és diagonalitzable.

### Bijectivitat i valor propi 0
Un endomorfisme $f$ és **bijectiu** (invertible) si i només si **$0$ no és valor propi** d'$f$. Si $\lambda = 0$ és valor propi, llavors $\ker(f) \neq \{0\}$ i l'aplicació no és injectiva.

### Potències de matrius
Si $A$ és diagonalitzable ($A = P D P^{-1}$), llavors:

$$
A^k = P D^k P^{-1}
$$

On $D^k$ és simplement la matriu diagonal amb cada element elevat a la potència $k$. Això estalvia milers d'operacions en càlculs com $A^{100}$.

> Si $v$ és vector propi d'$A$ amb valor propi $\lambda$, llavors $v$ és també vector propi de $A^k$ amb valor propi **$\lambda^k$**.

Aquestes propietats t'ajudaran en exercicis de demostració:

- **Invariància per escalar:** Si $v$ és vector propi de $f$ amb valor propi $\lambda$, llavors $\alpha v$ (amb $\alpha \neq 0$) també ho és.
- **Suma de valors propis:** La suma dels valors propis (comptant multiplicitats) és igual a la **traça** de la matriu.
- **Producte de valors propis:** El producte dels valors propis és igual al **determinant** de la matriu.
- **Independència lineal:** Vectors propis associats a valors propis distints són sempre linealment independents.

---

## 3. Diagonalització d'endomorfismes en altres espais

El concepte és el mateix per a espais de polinomis ($P_n(\mathbb{R})$) o matrius ($\mathcal{M}_n(\mathbb{R})$):

1.  Tria una base (normalment la canònica).
2.  Troba la matriu associada $M(f, B)$.
3.  Aplica el procés de diagonalització a aquesta matriu.
4.  Recorda que els "vectors propis" resultants seran les coordenades dels elements de l'espai original (polinomi, matriu, etc.).

> Si treballes amb paràmetres, hauràs de discutir la diagonalitzabilitat segons els valors d'aquests que facin variar les multiplicitats o l'existència d'arrels reals.
