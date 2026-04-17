import type { Solution } from '../../../solutions';

export const ex5_17: Solution = {
  id: 'M1-T5-Ex5.17',
  title: 'Exercici 5.17: De Matriu Ampliada a Sistema d\'Equacions',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Trobeu un sistema d'equacions lineals que correspongui a cadascuna de les matrius ampliades següents.
1) $\\begin{pmatrix} 1 & 0 & 3 & 2 \\\\ 2 & 1 & 1 & 3 \\\\ 0 & -1 & 2 & 4 \\end{pmatrix}$
2) $\\begin{pmatrix} -1 & 5 & -2 \\\\ 1 & 1 & 0 \\\\ 1 & -1 & 1 \\end{pmatrix}$
3) $\\begin{pmatrix} 1 & 2 & 3 & 4 & 5 \\\\ 1/3 & 1/4 & 1/5 & 1/2 & 1 \\end{pmatrix}$
4) $\\begin{pmatrix} 1 & 0 & 0 & 0 & 1 \\\\ 0 & 1 & 0 & 0 & 2 \\\\ 0 & 0 & 1 & 0 & 3 \\\\ 1 & 0 & 0 & 1 & 4 \\end{pmatrix}$`,
  content: `
En una matriu ampliada $(A|b)$, les columnes de la matriu $A$ representen els coeficients de les variables ($x, y, z...$ o $x_1, x_2, x_3...$) i la darrera columna (el vector $b$) representa els termes independents de cada equació.

---

### 1) Sistema en $x, y, z$
La matriu té 3 files i 4 columnes (3 equacions i 3 incògnites):
$$\\begin{cases} x + 3z = 2 \\\\ 2x + y + z = 3 \\\\ -y + 2z = 4 \\end{cases}$$

### 2) Sistema en $x, y$
La matriu té 3 files i 3 columnes (3 equacions i 2 incògnites):
$$\\begin{cases} -x + 5y = -2 \\\\ x + y = 0 \\\\ x - y = 1 \\end{cases}$$

### 3) Sistema en $x_1, x_2, x_3, x_4$
La matriu té 2 files i 5 columnes (2 equacions i 4 incògnites):
$$\\begin{cases} x_1 + 2x_2 + 3x_3 + 4x_4 = 5 \\\\ \\frac{1}{3}x_1 + \\frac{1}{4}x_2 + \\frac{1}{5}x_3 + \\frac{1}{2}x_4 = 1 \\end{cases}$$

### 4) Sistema en $x_1, x_2, x_3, x_4$
La matriu té 4 files i 5 columnes (4 equacions i 4 incògnites):
$$\\begin{cases} x_1 = 1 \\\\ x_2 = 2 \\\\ x_3 = 3 \\\\ x_1 + x_4 = 4 \\end{cases}$$

*(Aquest darrer sistema ja està pràcticament resolt, ja que ens dóna directament el valor de les variables primeres).*
`,
  availableLanguages: ['ca']
};
