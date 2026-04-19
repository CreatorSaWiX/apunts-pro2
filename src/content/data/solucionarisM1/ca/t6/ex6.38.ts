import type { Solution } from '../../../solutions';

export const ex6_38: Solution = {
  id: 'M1-T6-Ex6.38',
  title: 'Exercici 6.38: Canvis de Base en l’Espai de Matrius',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Siguin:
$B = \\left\\{ \\begin{pmatrix} 1 & 0 \\\\ 0 & 0 \\end{pmatrix}, \\begin{pmatrix} 0 & 1 \\\\ 0 & 0 \\end{pmatrix}, \\begin{pmatrix} 0 & 0 \\\\ 1 & 0 \\end{pmatrix}, \\begin{pmatrix} 0 & 0 \\\\ 0 & 1 \\end{pmatrix} \\right\\}$,
$B' = \\left\\{ \\begin{pmatrix} 1 & 1 \\\\ 0 & 0 \\end{pmatrix}, \\begin{pmatrix} 0 & 1 \\\\ 1 & 0 \\end{pmatrix}, \\begin{pmatrix} 0 & 0 \\\\ 1 & 1 \\end{pmatrix}, \\begin{pmatrix} 0 & 0 \\\\ 0 & 1 \\end{pmatrix} \\right\\}$
dues bases de $\\mathcal{M}_2(\\mathbb{R})$. Doneu les matrius de canvi de base $P_{B'}^B$ i $P_B^{B'}$.`,
  content: `
### Resolució del Problema

Identifiquem els elements de l'espai $\\mathcal{M}_2(\\mathbb{R})$ amb vectors de $\\mathbb{R}^4$ seguint l'ordre habitual de les entrades de la matriu $(a_{11}, a_{12}, a_{21}, a_{22})$.

La base $B$ és la base canònica de les matrius. La base $B'$ està formada pels vectors:
$v'_1 = (1, 1, 0, 0), \\, v'_2 = (0, 1, 1, 0), \\, v'_3 = (0, 0, 1, 1), \\, v'_4 = (0, 0, 0, 1)$.

### 1) Matriu $P_B^{B'}$ (de $B'$ a $B$)
Aquesta matriu té per columnes les coordenades dels vectors de $B'$ expressats en la base $B$. Com que $B$ és la base canònica, només hem de col·locar els vectors de $B'$ directament:
$$\\mathbf{P_B^{B'} = \\begin{pmatrix} 1 & 0 & 0 & 0 \\\\ 1 & 1 & 0 & 0 \\\\ 0 & 1 & 1 & 0 \\\\ 0 & 0 & 1 & 1 \\end{pmatrix}}$$

### 2) Matriu $P_{B'}^B$ (de $B$ a $B'$)
Aquesta matriu és la inversa de l'anterior: $P_{B'}^B = (P_B^{B'})^{-1}$.
Podem calcular-la resolent el sistema $Y = P_B^{B'} X$:
*   $y_1 = x_1 \\implies x_1 = y_1$
*   $y_2 = x_1 + x_2 \\implies x_2 = y_2 - y_1$
*   $y_3 = x_2 + x_3 \\implies x_3 = y_3 - (y_2 - y_1) = y_3 - y_2 + y_1$
*   $y_4 = x_3 + x_4 \\implies x_4 = y_4 - (y_3 - y_2 + y_1) = y_4 - y_3 + y_2 - y_1$

Escrivint els coeficients en la matriu:
$$\\mathbf{P_{B'}^B = \\begin{pmatrix} 1 & 0 & 0 & 0 \\\\ -1 & 1 & 0 & 0 \\\\ 1 & -1 & 1 & 0 \\\\ -1 & 1 & -1 & 1 \\end{pmatrix}}$$
`,
  availableLanguages: ['ca']
};
