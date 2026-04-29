import type { Solution } from '../../../solutions';

export const ex7_3: Solution = {
  id: 'M1-T7-Ex7.3',
  title: 'Exercici 7.3: Aplicacions en espais de matrius',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Determineu quines de les aplicacions següents són lineals:

1) $f: \\mathcal{M}_2(\\mathbb{R}) \\to \\mathbb{R}$, on $f \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix} = a + d$;

2) $f: \\mathcal{M}_2(\\mathbb{R}) \\to \\mathcal{M}_{2 \\times 3}(\\mathbb{R})$, on $f(A) = AB$, essent $B \\in \\mathcal{M}_{2 \\times 3}(\\mathbb{R})$ una matriu fixada;

3) $f: \\mathcal{M}_n(\\mathbb{R}) \\to \\mathbb{R}$, on $f(A) = \\det(A)$.`,
  content: `
Anem a analitzar la linealitat en l'espai de les matrius. Recordem que una aplicació és lineal si conserva la suma i el producte per escalars.

---

### 1) $f(A) = a + d$ (Traça de la matriu)

Aquesta aplicació calcula la suma dels elements de la diagonal principal (coneguda com la traça, $\\text{tr}(A)$).

Siguin $A = \\begin{pmatrix} a_1 & b_1 \\\\ c_1 & d_1 \\end{pmatrix}$ i $C = \\begin{pmatrix} a_2 & b_2 \\\\ c_2 & d_2 \\end{pmatrix}$.
- **Additivitat:** 
  $f(A + C) = f \\begin{pmatrix} a_1+a_2 & b_1+b_2 \\\\ c_1+c_2 & d_1+d_2 \\end{pmatrix} = (a_1+a_2) + (d_1+d_2) = (a_1+d_1) + (a_2+d_2) = f(A) + f(C)$.
- **Homogeneïtat:**
  $f(\\lambda A) = f \\begin{pmatrix} \\lambda a_1 & \\lambda b_1 \\\\ \\lambda c_1 & \\lambda d_1 \\end{pmatrix} = \\lambda a_1 + \\lambda d_1 = \\lambda(a_1 + d_1) = \\lambda f(A)$.

L'aplicació **és lineal**.

---

### 2) $f(A) = AB$ amb $B$ fixada

Aquí $f$ multiplica la matriu d'entrada $A$ per una matriu constant $B$ per la dreta.

Siguin $A, C \\in \\mathcal{M}_2(\\mathbb{R})$ i $\\lambda \\in \\mathbb{R}$.
- **Additivitat:** Per la propietat distributiva del producte de matrius:
  $f(A + C) = (A + C)B = AB + CB = f(A) + f(C)$.
- **Homogeneïtat:** Per la propietat associativa del producte per escalars:
  $f(\\lambda A) = (\\lambda A)B = \\lambda(AB) = \\lambda f(A)$.

L'aplicació **és lineal**.

---

### 3) $f(A) = \\det(A)$

El determinant és una funció multilineal respecte a les columnes (o files), però **no és una aplicació lineal** de l'espai de matrius.

**Contraexemple (Additivitat):**
Siguin $I = \\begin{pmatrix} 1 & 0 \\\\ 0 & 1 \\end{pmatrix}$ i $C = \\begin{pmatrix} 1 & 0 \\\\ 0 & 1 \\end{pmatrix}$ en $\\mathcal{M}_2(\\mathbb{R})$.
- $f(I) = \\det(I) = 1$.
- $f(C) = \\det(C) = 1$.
- $f(I + C) = \\det \\begin{pmatrix} 2 & 0 \\\\ 0 & 2 \\end{pmatrix} = 4$.
Com que $f(I+C) = 4 \\neq f(I) + f(C) = 1 + 1 = 2$, no es compleix l'additivitat.

**Contraexemple (Homogeneïtat):**
Sabem que per a una matriu $n \\times n$, $\\det(\\lambda A) = \\lambda^n \\det(A)$. Si $n > 1$, això no coincideix amb $\\lambda \\det(A)$ (tret que $\\lambda$ sigui $0$ o $1$).

L'aplicació **no és lineal**.
`,
  availableLanguages: ['ca']
};
