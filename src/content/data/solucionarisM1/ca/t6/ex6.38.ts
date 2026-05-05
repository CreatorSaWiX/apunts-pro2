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
Aquesta matriu té per columnes les coordenades dels vectors de la base $B'$ expressats en la base $B$. Com que $B$ és la base canònica de les matrius, les coordenades coincideixen amb els components dels vectors:
*   $[v'_1]_B = (1, 1, 0, 0)^T$
*   $[v'_2]_B = (0, 1, 1, 0)^T$
*   $[v'_3]_B = (0, 0, 1, 1)^T$
*   $[v'_4]_B = (0, 0, 0, 1)^T$

Col·locant-los en columnes obtenim:
$$\\mathbf{P_B^{B'} = \\begin{pmatrix} 1 & 0 & 0 & 0 \\\\ 1 & 1 & 0 & 0 \\\\ 0 & 1 & 1 & 0 \\\\ 0 & 0 & 1 & 1 \\end{pmatrix}}$$

### 2) Matriu $P_{B'}^B$ (de $B$ a $B'$)
Aquesta matriu és la inversa de l'anterior: $P_{B'}^B = (P_B^{B'})^{-1}$. En lloc d'utilitzar adjunts, resoldrem el sistema d'equacions $Y = P_B^{B'} X$ per aïllar les coordenades originals $X$ en funció de les noves $Y$:

$$ \\begin{pmatrix} y_1 \\\\ y_2 \\\\ y_3 \\\\ y_4 \\end{pmatrix} = \\begin{pmatrix} 1 & 0 & 0 & 0 \\\\ 1 & 1 & 0 & 0 \\\\ 0 & 1 & 1 & 0 \\\\ 0 & 0 & 1 & 1 \\end{pmatrix} \\begin{pmatrix} x_1 \\\\ x_2 \\\\ x_3 \\\\ x_4 \\end{pmatrix} \\implies \\begin{cases} y_1 = x_1 \\\\ y_2 = x_1 + x_2 \\\\ y_3 = x_2 + x_3 \\\\ y_4 = x_3 + x_4 \\end{cases} $$

Resolem pas a pas per substitució:x
*   $x_1 = y_1$
*   $x_2 = y_2 - x_1 = \\mathbf{-y_1 + y_2}$
*   $x_3 = y_3 - x_2 = y_3 - (-y_1 + y_2) = \\mathbf{y_1 - y_2 + y_3}$
*   $x_4 = y_4 - x_3 = y_4 - (y_1 - y_2 + y_3) = \\mathbf{-y_1 + y_2 - y_3 + y_4}$

Escrivint els coeficients de les $y_i$ a cada fila de la matriu inversa:
$$\\mathbf{P_{B'}^B = \\begin{pmatrix} 1 & 0 & 0 & 0 \\\\ -1 & 1 & 0 & 0 \\\\ 1 & -1 & 1 & 0 \\\\ -1 & 1 & -1 & 1 \\end{pmatrix}}$$

`,
  availableLanguages: ['ca']
};
