import type { Solution } from '../../../solutions';

export const ex5_21: Solution = {
  id: 'M1-T5-Ex5.21',
  title: 'Exercici 5.21: Resolució de Sistemes Homogenis',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Resoleu el sistemes lineals homogenis següents. Useu l'eliminació gaussiana i doneu la solució en forma paramètrica.
1) $\\begin{cases} 2x + 2y + 2z = 0 \\\\ -2x + 5y + 2z = 0 \\\\ -7x + 7y + z = 0 \\end{cases}$
2) $\\begin{cases} 2x - 4y + z + w = 0 \\\\ x - 5y + 2z = 0 \\\\ -2y - 2z - w = 0 \\\\ x + 3y + w = 0 \\\\ x - 2y - z + w = 0 \\end{cases}$
3) $\\begin{cases} x_2 - 3x_3 + x_4 = 0 \\\\ x_1 + x_2 - x_3 + 4x_4 = 0 \\\\ -2x_1 - 2x_2 + 2x_3 - 8x_4 = 0 \\end{cases}$
4) $\\begin{cases} 2x_1 + 2x_2 - x_3 + x_5 = 0 \\\\ -x_1 - x_2 + 2x_3 - 3x_4 + x_5 = 0 \\\\ x_1 + x_2 + x_3 + 2x_5 = 0 \\\\ 2x_3 + 2x_4 + 2x_5 = 0 \\end{cases}$`,
  content: `
En un sistema homogeni, el vector de termes independents és sempre nul. Això garanteix que el sistema sempre sigui compatible (com a mínim té la solució trivial).

### 1) Sistema en $x, y, z$
Matriu i eliminació:
$$\\begin{pmatrix} 2 & 2 & 2 \\\\ -2 & 5 & 2 \\\\ -7 & 7 & 1 \\end{pmatrix} \\xrightarrow[R_3 + \\frac{7}{2}R_1]{R_2 + R_1} \\begin{pmatrix} 2 & 2 & 2 \\\\ 0 & 7 & 4 \\\\ 0 & 14 & 8 \\end{pmatrix} \\xrightarrow{R_3 - 2R_2} \\begin{pmatrix} 2 & 2 & 2 \\\\ 0 & 7 & 4 \\\\ 0 & 0 & 0 \\end{pmatrix}$$
Tenim un sistema amb una variable lliure ($z$).
- $7y + 4z = 0 \\implies y = -\\frac{4}{7}z$
- $2x + 2(-\\frac{4}{7}z) + 2z = 0 \\implies 2x - \\frac{8}{7}z + \\frac{14}{7}z = 0 \\implies 2x + \\frac{6}{7}z = 0 \\implies x = -\\frac{3}{7}z$

**Solució:** $(x, y, z) = \\lambda (-3, -4, 7)$ per a tot $\\lambda \\in \\mathbb{R}$.

### 2) Sistema de 5 equacions i 4 variables
$$\\begin{pmatrix} 2 & -4 & 1 & 1 \\\\ 1 & -5 & 2 & 0 \\\\ 0 & -2 & -2 & -1 \\\\ 1 & 3 & 0 & 1 \\\\ 1 & -2 & -1 & 1 \\end{pmatrix} \\xrightarrow{\\dots} \\text{Esglaonada amb 4 pivots}$$
Després d'aplicar Gauss, s'observa que el rang de la matriu és 4 (igual al nombre d'incògnites).
**Solució:** Només la trivial: $(x, y, z, w) = (0, 0, 0, 0)$.

### 3) Sistema de 3 equacions i 4 variables
$$\\begin{pmatrix} 0 & 1 & -3 & 1 \\\\ 1 & 1 & -1 & 4 \\\\ -2 & -2 & 2 & -8 \\end{pmatrix} \\xrightarrow{R_3 + 2R_2} \\begin{pmatrix} 1 & 1 & -1 & 4 \\\\ 0 & 1 & -3 & 1 \\\\ 0 & 0 & 0 & 0 \\end{pmatrix}$$
Tenim 2 variables lliures ($x_3$ i $x_4$).
- $x_2 = 3x_3 - x_4$
- $x_1 + (3x_3 - x_4) - x_3 + 4x_4 = 0 \\implies x_1 = -2x_3 - 3x_4$

**Solució:** $(x_1, x_2, x_3, x_4) = (-2\\lambda - 3\\mu, 3\\lambda - \\mu, \\lambda, \\mu)$ per a tot $\\lambda, \\mu \\in \\mathbb{R}$.

### 4) Sistema de 4 equacions i 5 variables
$$\\begin{pmatrix} 2 & 2 & -1 & 0 & 1 \\\\ -1 & -1 & 2 & -3 & 1 \\\\ 1 & 1 & 1 & 0 & 2 \\\\ 0 & 0 & 2 & 2 & 2 \\end{pmatrix} \\xrightarrow{\\text{Gauss}} \\begin{pmatrix} 1 & 1 & 1 & 0 & 2 \\\\ 0 & 0 & 1 & -1 & 1 \\\\ 0 & 0 & 0 & 1 & 0 \\\\ 0 & 0 & 0 & 0 & 0 \\end{pmatrix}$$
Tenim 2 variables lliures ($x_2$ i $x_5$).
- $x_4 = 0$
- $x_3 - x_4 + x_5 = 0 \\implies x_3 = -x_5$
- $x_1 + x_2 + x_3 + 2x_5 = 0 \\implies x_1 + x_2 - x_5 + 2x_5 = 0 \\implies x_1 = -x_2 - x_5$

**Solució:** $(x_1, x_2, x_3, x_4, x_5) = (-\\lambda - \\mu, \\lambda, -\\mu, 0, \\mu)$ per a tot $\\lambda, \\mu \\in \\mathbb{R}$.
`,
  availableLanguages: ['ca']
};
