import type { Solution } from '../../../solutions';

export const ex5_25: Solution = {
  id: 'M1-T5-Ex5.25',
  title: 'Exercici 5.25: Càlcul de Determinants de Diversos Ordres',
  author: 'Antigravity',
  code: '',
  type: 'notebook',
  statement: `Calculeu els determinants següents:
1) $\\begin{vmatrix} 5 & 15 \\\\ 10 & -20 \\end{vmatrix}$
2) $\\begin{vmatrix} 2 & 1 & 2 \\\\ 0 & 3 & -1 \\\\ 4 & 1 & 1 \\end{vmatrix}$
3) $\\begin{vmatrix} 3 & -1 & 5 \\\\ -1 & 2 & 1 \\\\ -2 & 4 & 3 \\end{vmatrix}$
4) $\\begin{vmatrix} 4 & 16 & 0 \\\\ 12 & -8 & 8 \\\\ 16 & 20 & -4 \\end{vmatrix}$
5) $\\begin{vmatrix} 0 & 2 & 1 \\\\ -1 & 3 & 0 \\\\ 2 & 4 & 3 \\end{vmatrix}$
6) $\\begin{vmatrix} -1 & 2 & 1 & 2 \\\\ 1 & 2 & 4 & 1 \\\\ 2 & 0 & -1 & 3 \\\\ 3 & 2 & -1 & 0 \\end{vmatrix}$
7) $\\begin{vmatrix} 0 & -3 & 8 & 2 \\\\ 8 & 1 & -1 & 6 \\\\ -4 & 6 & 0 & 9 \\\\ -7 & 0 & 0 & 14 \\end{vmatrix}$
8) $\\begin{vmatrix} 1 & -1 & 8 & 4 & 2 \\\\ 2 & 6 & 0 & -4 & 3 \\\\ 2 & 0 & 2 & 6 & 2 \\\\ 0 & 2 & 8 & 0 & 0 \\\\ 0 & 1 & 1 & 2 & 2 \\end{vmatrix}$`,
  content: `
A continuació es mostren els càlculs per a cada determinant, utilitzant mètodes com la regla de Sarrus, el desenvolupament per adjunts o l'aplicació d'operacions elementals per simplificar.

### 1) Determinant $2 \\times 2$
$$ \\begin{vmatrix} 5 & 15 \\\\ 10 & -20 \\end{vmatrix} = 5(-20) - 15(10) = -100 - 150 = \\mathbf{-250} $$

### 2) Determinant $3 \\times 3$
Desenvolupant per adjunts de la primera columna:
$$ 2 \\begin{vmatrix} 3 & -1 \\\\ 1 & 1 \\end{vmatrix} - 0 + 4 \\begin{vmatrix} 1 & 2 \\\\ 3 & -1 \\end{vmatrix} = 2(3+1) + 4(-1-6) = 8 - 28 = \\mathbf{-20} $$

### 3) Operació elemental
Fem $R_3 \\to R_3 - 2R_2$:
$$ \\begin{vmatrix} 3 & -1 & 5 \\\\ -1 & 2 & 1 \\\\ 0 & 0 & 1 \\end{vmatrix} = 1 \\cdot \\begin{vmatrix} 3 & -1 \\\\ -1 & 2 \\end{vmatrix} = 6 - 1 = \\mathbf{5} $$

### 4) Factorització
Traiem un 4 de cada fila: $4^3 \\cdot \\begin{vmatrix} 1 & 4 & 0 \\\\ 3 & -2 & 2 \\\\ 4 & 5 & -1 \\end{vmatrix}$
$$ 64 \\cdot [1(2-10) - 4(-3-8)] = 64 \\cdot [-8 + 44] = 64 \\cdot 36 = \\mathbf{2304} $$

### 5) Desenvolupament per $R_1$
$$ 0 - 2 \\begin{vmatrix} -1 & 0 \\\\ 2 & 3 \\end{vmatrix} + 1 \\begin{vmatrix} -1 & 3 \\\\ 2 & 4 \\end{vmatrix} = -2(-3) + 1(-4-6) = 6 - 10 = \\mathbf{-4} $$

### 6) Determinant $4 \\times 4$
Fent $R_2+R_1, R_3+2R_1, R_4+3R_1$ i desenvolupant per $C_1$:
$$ -1 \\cdot \\begin{vmatrix} 4 & 5 & 3 \\\\ 4 & 1 & 7 \\\\ 8 & 2 & 6 \\end{vmatrix} = \\mathbf{128} $$

### 7) Determinant $4 \\times 4$
Factoritzant el 7 de $R_4$ i fent $C_4 \\to C_4 + 2C_1$:
$$ 7 \\cdot \\begin{vmatrix} 0 & -3 & 8 & 2 \\\\ 8 & 1 & -1 & 22 \\\\ -4 & 6 & 0 & 1 \\\\ -1 & 0 & 0 & 0 \\end{vmatrix} = 7 \\cdot ( -(-1) \\begin{vmatrix} -3 & 8 & 2 \\\\ 1 & -1 & 22 \\\\ 6 & 0 & 1 \\end{vmatrix} ) = 7 \\cdot 1063 = \\mathbf{7441} $$

### 8) Determinant $5 \\times 5$
Fent $C_3 \\to C_3 - 4C_2$ i desenvolupant per $R_4$:
$$ 2 \\cdot \\begin{vmatrix} 1 & 12 & 4 & 2 \\\\ 2 & -24 & -4 & 3 \\\\ 2 & 2 & 6 & 2 \\\\ 0 & -3 & 2 & 2 \\end{vmatrix} = 2 \\cdot (-550) = \\mathbf{-1100} $$
`,
  availableLanguages: ['ca']
};
