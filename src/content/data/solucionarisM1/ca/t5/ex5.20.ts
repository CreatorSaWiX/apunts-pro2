import type { Solution } from '../../../solutions';

export const ex5_20: Solution = {
  id: 'M1-T5-Ex5.20',
  title: 'Exercici 5.20: Resolució de Sistemes Lineals (Gauss)',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Resoleu el sistemes lineals següents. Useu eliminació gaussiana i doneu la solució en forma paramètrica.
1) $\\begin{cases} x + y + 2z = 8 \\\\ -x - 2y + 3z = 1 \\\\ 3x - 7y + 4z = 10 \\\\ 3y - 2z = -1 \\end{cases}$
2) $\\begin{cases} x - y + 2z = 3 \\\\ 2x - 2y + 5z = 4 \\\\ x + 2y - z = -3 \\\\ 2y + 2z = 1 \\end{cases}$
3) $\\begin{cases} x - y + 2z - w = -1 \\\\ 2x + y - 2z - 2w = -2 \\\\ -x + 2y - 4z + w = 1 \\\\ 3x - 3w = -3 \\end{cases}$
4) $\\begin{cases} x_1 + 3x_2 - 2x_3 + 2x_5 = 0 \\\\ 2x_1 + 6x_2 - 5x_3 - 2x_4 + 4x_5 - 3x_6 = -1 \\\\ 5x_3 + 10x_4 + 15x_6 = 5 \\\\ 2x_1 + 6x_2 + 8x_4 + 4x_5 + 18x_6 = 6 \\end{cases}$`,
  content: `
Apliquem l'eliminació gaussiana a cada sistema per determinar-ne la compatibilitat i trobar les solucions.

### 1) Sistema de 4 equacions i 3 incògnites
Matriu ampliada i passos de Gauss:
$$\\begin{pmatrix} 1 & 1 & 2 & | & 8 \\\\ -1 & -2 & 3 & | & 1 \\\\ 3 & -7 & 4 & | & 10 \\\\ 0 & 3 & -2 & | & -1 \\end{pmatrix} \\xrightarrow[F_3 - 3F_1]{F_2 + F_1} \\begin{pmatrix} 1 & 1 & 2 & | & 8 \\\\ 0 & -1 & 5 & | & 9 \\\\ 0 & -10 & -2 & | & -14 \\\\ 0 & 3 & -2 & | & -1 \\end{pmatrix} \\xrightarrow[F_4+3F_2]{F_3-10F_2} \\begin{pmatrix} 1 & 1 & 2 & | & 8 \\\\ 0 & -1 & 5 & | & 9 \\\\ 0 & 0 & -52 & | & -104 \\\\ 0 & 0 & 13 & | & 26 \\end{pmatrix}$$
De la tercera fila: $-52z = -104 \\implies z = 2$.
Substituint:
- $-y + 5(2) = 9 \\implies -y = -1 \\implies y = 1$
- $x + 1 + 2(2) = 8 \\implies x = 3$

**Solució única (SCD):** $(x, y, z) = (3, 1, 2)$.

### 2) Sistema de 4 equacions i 3 incògnites
Matriu ampliada:
$$\\begin{pmatrix} 1 & -1 & 2 & | & 3 \\\\ 2 & -2 & 5 & | & 4 \\\\ 1 & 2 & -1 & | & -3 \\\\ 0 & 2 & 2 & | & 1 \\end{pmatrix} \\xrightarrow[F_3-F_1]{F_2-2F_1} \\begin{pmatrix} 1 & -1 & 2 & | & 3 \\\\ 0 & 0 & 1 & | & -2 \\\\ 0 & 3 & -3 & | & -6 \\\\ 0 & 2 & 2 & | & 1 \\end{pmatrix} \\xrightarrow[F_4-2F_3]{F_3/3, F_2 \\leftrightarrow F_3} \\begin{pmatrix} 1 & -1 & 2 & | & 3 \\\\ 0 & 1 & -1 & | & -2 \\\\ 0 & 0 & 1 & | & -2 \\\\ 0 & 0 & 4 & | & 5 \\end{pmatrix} \\xrightarrow{F_4-4F_3} \\begin{pmatrix} \\dots \\\\ 0 & 0 & 0 & | & 13 \\end{pmatrix}$$
L'última fila indica una contradicció ($0 = 13$).
**Solució:** El sistema és **incompatible**.

### 3) Sistema de 4 variables
$$\\begin{pmatrix} 1 & -1 & 2 & -1 & | & -1 \\\\ 2 & 1 & -2 & -2 & | & -2 \\\\ -1 & 2 & -4 & 1 & | & 1 \\\\ 3 & 0 & 0 & -3 & | & -3 \\end{pmatrix} \\xrightarrow[F_3+F_1, F_4-3F_1]{F_2-2F_1} \\begin{pmatrix} 1 & -1 & 2 & -1 & | & -1 \\\\ 0 & 3 & -6 & 0 & | & 0 \\\\ 0 & 1 & -2 & 0 & | & 0 \\\\ 0 & 3 & -6 & 0 & | & 0 \\end{pmatrix}$$
Les files 2, 3 i 4 són proporcionals ($y - 2z = 0$). Tenim 2 variables lliures ($z$ i $w$).
- $y = 2z$
- $x - 2z + 2z - w = -1 \\implies x = w - 1$

**Solució paramètrica:** $(x, y, z, w) = (w - 1, 2z, z, w)$ per a tot $z, w \\in \\mathbb{R}$.

### 4) Sistema de 6 variables
$$\\begin{pmatrix} 1 & 3 & -2 & 0 & 2 & 0 & | & 0 \\\\ 2 & 6 & -5 & -2 & 4 & -3 & | & -1 \\\\ 0 & 0 & 5 & 10 & 0 & 15 & | & 5 \\\\ 2 & 6 & 0 & 8 & 4 & 18 & | & 6 \\end{pmatrix} \\xrightarrow[F_4-2F_1]{F_2-2F_1} \\begin{pmatrix} 1 & 3 & -2 & 0 & 2 & 0 & | & 0 \\\\ 0 & 0 & -1 & -2 & 0 & -3 & | & -1 \\\\ 0 & 0 & 1 & 2 & 0 & 3 & | & 1 \\\\ 0 & 0 & 4 & 8 & 0 & 18 & | & 6 \\end{pmatrix}$$
- De la segona i tercera fila, veiem que són la mateixa equació.
- De la quarta: $F_4 - 4F_2 \\implies 6x_6 = 2 \\implies x_6 = 1/3$.
- De la segona: $x_3 + 2x_4 + 3(1/3) = 1 \\implies x_3 = -2x_4$.
- De la primera: $x_1 + 3x_2 - 2(-2x_4) + 2x_5 = 0 \\implies x_1 = -3x_2 - 4x_4 - 2x_5$.

**Solució paramètrica:**
$(x_1, \\dots, x_6) = (-3\\lambda - 4\\mu - 2\\gamma, \\lambda, -2\\mu, \\mu, \\gamma, 1/3)$ amb $\\lambda, \\mu, \\gamma \\in \\mathbb{R}$.
`,
  availableLanguages: ['ca']
};
