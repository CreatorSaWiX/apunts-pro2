---
title: "Tema 8: Diagonalització"
description: "Valors propis, vectors propis i el procés per diagonalitzar matrius i endomorfismes."
order: 9
readTime: "15 min"
subject: "m1"
draft: true
isNew: true
---

La **diagonalització** és el procés de trobar una base en la qual la matriu d'un endomorfisme és el més simple possible: una matriu diagonal. Això ens permet entendre l'estructura de l'aplicació i calcular potències de matrius de forma immediata.

## 1. Conceptes Fonamentals

### Valors i Vectors Propis
Sigui $f: E \to E$ un endomorfisme. Diem que un escalar $\lambda$ és un **valor propi** (eigenvalue) de $f$ si existeix un vector $v \neq \vec{0}$ tal que:
$$f(v) = \lambda v$$
Aquest vector $v$ s'anomena **vector propi** (eigenvector) associat al valor propi $\lambda$.

### Polinomi Característic
Per trobar els valors propis d'una matriu $A$, busquem les arrels del seu **polinomi característic**:
$$p(\lambda) = \det(A - \lambda I)$$
Els valors de $\lambda$ que fan que $p(\lambda) = 0$ són els valors propis.

### Subespais Propis ($E_\lambda$)
Per a cada valor propi $\lambda$, el conjunt de tots els seus vectors propis (més el vector zero) forma un subespai vectorial anomenat **subespai propi**:
$$E_\lambda = \ker(A - \lambda I)$$
La dimensió d'aquest subespai s'anomena **multiplicitat geomètrica** ($m_g$).

---

## 2. Condicions de Diagonalitzabilitat

Una matriu $A \in \mathcal{M}_n(\mathbb{R})$ és diagonalitzable si i només si:
1.  **El polinomi característic descompon totalment** en el cos de treball (totes les arrels són reals).
2.  Per a cada valor propi $\lambda$, la seva **multiplicitat algebraica** ($m_a$, el nombre de vegades que surt com a arrel) és igual a la seva **multiplicitat geomètrica** ($m_g$):
    $$m_a(\lambda) = m_g(\lambda)$$

> **Condició suficient:** Si $A$ té $n$ valors propis reals i **distints**, llavors $A$ és automàticament diagonalitzable.

---

## 3. El Procés de Diagonalització (Pas a pas)

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

---

## 4. Propietats i Casos Particulars

### Matrius Triangulars
Si una matriu és triangular (superior o inferior), els seus valors propis són directament els elements de la **diagonal principal**.
- Si els elements de la diagonal són tots distints, la matriu és diagonalitzable.

### Bijectivitat i Valor Propi 0
Un endomorfisme $f$ és **bijectiu** (invertible) si i només si **$0$ no és valor propi** d'$f$.
- Si $\lambda = 0$ és valor propi, llavors $\ker(f) \neq \{0\}$ i l'aplicació no és injectiva.

### Potències de Matrius
Si $A$ és diagonalitzable ($A = P D P^{-1}$), llavors:
$$A^k = P D^k P^{-1}$$
On $D^k$ és simplement la matriu diagonal amb cada element elevat a la potència $k$. Això estalvia milers d'operacions en càlculs com $A^{100}$.

> **Relació fonamental:** Si $v$ és vector propi d'$A$ amb valor propi $\lambda$, llavors $v$ és també vector propi d'$A^k$ amb valor propi **$\lambda^k$**.

---

## 5. Propietats Teòriques útils

Aquestes propietats t'ajudaran en exercicis de demostració:
- **Invariància per escalar:** Si $v$ és vector propi de $f$ amb valor propi $\lambda$, llavors $\alpha v$ (amb $\alpha \neq 0$) també ho és.
- **Suma de valors propis:** La suma dels valors propis (comptant multiplicitats) és igual a la **traça** de la matriu ($\sum a_{ii}$).
- **Producte de valors propis:** El producte dels valors propis és igual al **determinant** de la matriu.
- **Independència lineal:** Vectors propis associats a valors propis distints són sempre linealment independents.

---

## 6. Diagonalització d'Endomorfismes en Altres Espais

El concepte és el mateix per a espais de polinomis ($P_n(\mathbb{R})$) o matrius ($\mathcal{M}_n(\mathbb{R})$):
1.  Tria una base (normalment la canònica).
2.  Troba la matriu associada $M(f, B)$.
3.  Aplica el procés de diagonalització a aquesta matriu.
4.  Recorda que els "vectors propis" resultants seran les coordenades dels elements de l'espai original (polinomi, matriu, etc.).

> Si treballes amb paràmetres, hauràs de discutir la diagonalitzabilitat segons els valors d'aquests que facin variar les multiplicitats o l'existència d'arrels reals.
