import type { Solution } from '../../../solutions';

export const ex5_13: Solution = {
  id: 'M1-T5-Ex5.13',
  title: 'Exercici 5.13: Escalonament i Rang de Matrius',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Trobeu una matriu escalonada per files equivalent a cadascuna de les matrius següents. Doneu el rang de cada matriu.
1) $\\begin{pmatrix} 1 & 0 & 2 & 3 \\\\ 2 & 1 & 1 & 3 \\\\ -1 & 2 & 0 & 0 \\end{pmatrix}$
2) $\\begin{pmatrix} -3 & 1 \\\\ 2 & 0 \\\\ 6 & 4 \\end{pmatrix}$
3) $\\begin{pmatrix} 5 & 11 & 6 \\\\ 2 & 1 & 4 \\\\ 3 & -2 & 8 \\\\ 0 & 0 & 4 \\end{pmatrix}$
4) $\\begin{pmatrix} 0 & 1 & 2 & 3 & 4 \\\\ -1 & 0 & 1 & 2 & 3 \\\\ -2 & -1 & 0 & 1 & 2 \\\\ -3 & -2 & -1 & 0 & 1 \\end{pmatrix}$`,
  content: `
Per trobar el rang d'una matriu, apliquem el mètode de Gauss per obtenir-ne una forma escalonada. El rang serà el nombre de files no nul·les.

### 1) $$M_1 = \\begin{pmatrix} 1 & 0 & 2 & 3 \\\\ 2 & 1 & 1 & 3 \\\\ -1 & 2 & 0 & 0 \\end{pmatrix}$$

- $F_2 \\to F_2 - 2F_1$:
$$\\begin{pmatrix} 1 & 0 & 2 & 3 \\\\ 0 & 1 & -3 & -3 \\\\ -1 & 2 & 0 & 0 \\end{pmatrix}$$
- $F_3 \\to F_3 + F_1$:
$$\\begin{pmatrix} 1 & 0 & 2 & 3 \\\\ 0 & 1 & -3 & -3 \\\\ 0 & 2 & 2 & 3 \\end{pmatrix}$$
- $F_3 \\to F_3 - 2F_2$:
$$\\begin{pmatrix} 1 & 0 & 2 & 3 \\\\ 0 & 1 & -3 & -3 \\\\ 0 & 0 & 8 & 9 \\end{pmatrix}$$
**Rang = 3** (hi ha 3 files no nul·les).

### 2) Matriu 2
$$M_2 = \\begin{pmatrix} -3 & 1 \\\\ 2 & 0 \\\\ 6 & 4 \\end{pmatrix}$$
- Intercanvi $F_1 \\leftrightarrow F_2$: $\\begin{pmatrix} 2 & 0 \\\\ -3 & 1 \\\\ 6 & 4 \\end{pmatrix}$
- $F_2 \\to F_2 + \\frac{3}{2}F_1$: (o $2F_2 + 3F_1 \\to F_2$)
$$\\begin{pmatrix} 2 & 0 \\\\ 0 & 1 \\\\ 6 & 4 \\end{pmatrix}$$
- $F_3 \\to F_3 - 3F_1$:
$$\\begin{pmatrix} 2 & 0 \\\\ 0 & 1 \\\\ 0 & 4 \\end{pmatrix}$$.
- $F_3 \\to F_3 - 4F_2$:
$$\\begin{pmatrix} 2 & 0 \\\\ 0 & 1 \\\\ 0 & 0 \\end{pmatrix}$$
**Rang = 2**.

### 3) Matriu 3
$$M_3 = \\begin{pmatrix} 5 & 11 & 6 \\\\ 2 & 1 & 4 \\\\ 3 & -2 & 8 \\\\ 0 & 0 & 4 \\end{pmatrix}$$
- Intercanvi $F_1 \\leftrightarrow F_2$: $\\begin{pmatrix} 2 & 1 & 4 \\\\ 5 & 11 & 6 \\\\ 3 & -2 & 8 \\\\ 0 & 0 & 4 \\end{pmatrix}$
- $2F_2 - 5F_1 \\to F_2$
- $2F_3 - 3F_1 \\to F_3$
$$\\begin{pmatrix} 2 & 1 & 4 \\\\ 0 & 17 & -8 \\\\ 0 & -7 & 4 \\\\ 0 & 0 & 4 \\end{pmatrix}$$
- $17F_3 + 7F_2 \\to F_3$
$$\\begin{pmatrix} 2 & 1 & 4 \\\\ 0 & 17 & -8 \\\\ 0 & 0 & 12 \\\\ 0 & 0 & 4 \\end{pmatrix}$$
- $3F_4 - F_3 \\to F_4$
$$\\begin{pmatrix} 2 & 1 & 4 \\\\ 0 & 17 & -8 \\\\ 0 & 0 & 12 \\\\ 0 & 0 & 0 \\end{pmatrix}$$
**Rang = 3**.

### 4) Matriu 4
$$M_4 = \\begin{pmatrix} 0 & 1 & 2 & 3 & 4 \\\\ -1 & 0 & 1 & 2 & 3 \\\\ -2 & -1 & 0 & 1 & 2 \\\\ -3 & -2 & -1 & 0 & 1 \\end{pmatrix}$$
- Intercanvi $F_1 \\leftrightarrow F_2$: $\\begin{pmatrix} -1 & 0 & 1 & 2 & 3 \\\\ 0 & 1 & 2 & 3 & 4 \\\\ -2 & -1 & 0 & 1 & 2 \\\\ -3 & -2 & -1 & 0 & 1 \\end{pmatrix}$
- $F_3 \\to F_3 - 2F_1$:
$$\\begin{pmatrix} -1 & 0 & 1 & 2 & 3 \\\\ 0 & 1 & 2 & 3 & 4 \\\\ 0 & -1 & -2 & -3 & -4 \\\\ -3 & -2 & -1 & 0 & 1 \\end{pmatrix}$$
- $F_4 \\to F_4 - 3F_1$:
$$\\begin{pmatrix} -1 & 0 & 1 & 2 & 3 \\\\ 0 & 1 & 2 & 3 & 4 \\\\ 0 & -1 & -2 & -3 & -4 \\\\ 0 & -2 & -4 & -6 & -8 \\end{pmatrix}$$
- $F_3 \\to F_3 + F_2$
- $F_4 \\to F_4 + 2F_2$
$$\\begin{pmatrix} -1 & 0 & 1 & 2 & 3 \\\\ 0 & 1 & 2 & 3 & 4 \\\\ 0 & 0 & 0 & 0 & 0 \\\\ 0 & 0 & 0 & 0 & 0 \\end{pmatrix}$$
**Rang = 2**.
`,
  availableLanguages: ['ca']
};
