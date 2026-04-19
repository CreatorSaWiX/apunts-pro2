import type { Solution } from '../../../solutions';

export const ex6_37: Solution = {
  id: 'M1-T6-Ex6.37',
  title: 'Exercici 6.37: Canvi de Base entre Bases no Canòniques',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Siguin $B = \\left\\{ \\begin{pmatrix} 1 \\\\ 5 \\\\ 6 \\end{pmatrix}, \\begin{pmatrix} -2 \\\\ -5 \\\\ 3 \\end{pmatrix}, \\begin{pmatrix} 1 \\\\ 4 \\\\ -1 \\end{pmatrix} \\right\\}$ i $B' = \\left\\{ \\begin{pmatrix} 1 \\\\ 3 \\\\ 2 \\end{pmatrix}, \\begin{pmatrix} -1 \\\\ -2 \\\\ 5 \\end{pmatrix}, \\begin{pmatrix} 0 \\\\ 2 \\\\ 4 \\end{pmatrix} \\right\\}$ bases de $\\mathbb{R}^3$.

1) Comproveu que efectivament són bases.
2) Doneu la matriu del canvi de la base $B$ a la base $B'$ ($P_{B'}^B$) i la de $B'$ a $B$ ($P_B^{B'}$).
3) Calculeu les coordenades en les bases $B$ i $B'$ del vector que en base canònica té coordenades $(2, 5, 2)^T$.`,
  content: `
### 1) Comprovació de les bases

Un conjunt de 3 vectors a $\\mathbb{R}^3$ és una base si el determinant de la matriu que formen és diferent de zero.

*   **Per a $B$**: $\\det(P_C^B) = \\begin{vmatrix} 1 & -2 & 1 \\\\ 5 & -5 & 4 \\\\ 6 & 3 & -1 \\end{vmatrix} = 1(5-12) + 2(-5-24) + 1(15+30) = -7 - 58 + 45 = -20 \\neq 0$.
*   **Per a $B'$**: $\\det(P_C^{B'}) = \\begin{vmatrix} 1 & -1 & 0 \\\\ 3 & -2 & 2 \\\\ 2 & 5 & 4 \\end{vmatrix} = 1(-8-10) + 1(12-4) + 0 = -18 + 8 = -10 \\neq 0$.

Ambdós conjunts són bases de $\\mathbb{R}^3$.

---

### 2) Matrius de canvi de base

Calculem primer les inverses de les matrius a la canònica:
$P_B^C = (P_C^B)^{-1} = \\frac{1}{20} \\begin{pmatrix} 7 & -1 & 3 \\\\ -29 & 7 & -1 \\\\ -45 & 15 & -5 \\end{pmatrix}$, \\, $P_{B'}^C = (P_C^{B'})^{-1} = \\frac{1}{10} \\begin{pmatrix} 18 & -4 & 2 \\\\ 8 & -4 & 2 \\\\ -19 & 7 & -1 \\end{pmatrix}$

### Matriu $P_{B'}^B$ (de $B$ a $B'$):
$$P_{B'}^B = P_{B'}^C \\cdot P_C^B = \\begin{pmatrix} 1.8 & -0.4 & 0.2 \\\\ 0.8 & -0.4 & 0.2 \\\\ -1.9 & 0.7 & -0.1 \\end{pmatrix} \\begin{pmatrix} 1 & -2 & 1 \\\\ 5 & -5 & 4 \\\\ 6 & 3 & -1 \\end{pmatrix} = \\mathbf{\\begin{pmatrix} 1 & -1 & 0 \\\\ 0 & 1 & -1 \\\\ 1 & 0 & 1 \\end{pmatrix}}$$

### Matriu $P_B^{B'}$ (de $B'$ a $B$):
És la inversa de l'anterior:
$$\\mathbf{P_B^{B'} = \\begin{pmatrix} 1/2 & 1/2 & 1/2 \\\\ -1/2 & 1/2 & 1/2 \\\\ -1/2 & -1/2 & 1/2 \\end{pmatrix}}$$

---

### 3) Coordenades del vector $v = (2, 5, 2)$

### En la base $B$:
$$[v]_B = P_B^C \\cdot \\begin{pmatrix} 2 \\\\ 5 \\\\ 2 \\end{pmatrix} = \\begin{pmatrix} 0.35 & -0.05 & 0.15 \\\\ -1.45 & 0.35 & -0.05 \\\\ -2.25 & 0.75 & -0.25 \\end{pmatrix} \\begin{pmatrix} 2 \\\\ 5 \\\\ 2 \\end{pmatrix} = \\mathbf{\\begin{pmatrix} 3/4 \\\\ -5/4 \\\\ -5/4 \\end{pmatrix}}$$

### En la base $B'$:
$$[v]_{B'} = P_{B'}^C \\cdot \\begin{pmatrix} 2 \\\\ 5 \\\\ 2 \\end{pmatrix} = \\begin{pmatrix} 1.8 & -0.4 & 0.2 \\\\ 0.8 & -0.4 & 0.2 \\\\ -1.9 & 0.7 & -0.1 \\end{pmatrix} \\begin{pmatrix} 2 \\\\ 5 \\\\ 2 \\end{pmatrix} = \\mathbf{\\begin{pmatrix} 2 \\\\ 0 \\\\ -1/2 \\end{pmatrix}}$$

*Comprovació en $B'$*: $2(1, 3, 2) + 0(-1, -2, 5) - 1/2(0, 2, 4) = (2, 6, 4) - (0, 1, 2) = (2, 5, 2)$. Correcte.
`,
  availableLanguages: ['ca']
};
