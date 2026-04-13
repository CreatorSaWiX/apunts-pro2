import type { Solution } from '../../../solutions';

export const ex5_15: Solution = {
  id: 'M1-T5-Ex5.15',
  title: 'Exercici 5.15: Càlcul de la Matriu Inversa (Gauss-Jordan)',
  author: 'Antigravity',
  code: '',
  type: 'notebook',
  statement: `Trobeu, si existeix, la inversa de cadascuna de les matrius següents, seguint el mètode de Gauss-Jordan.
1) $\\begin{pmatrix} 1 & 2 \\\\ 3 & 5 \\end{pmatrix}$
2) $\\begin{pmatrix} 3 & 1 & 5 \\\\ 2 & 4 & 1 \\\\ -4 & 2 & -9 \\end{pmatrix}$
3) $\\begin{pmatrix} -2 & 3 & -1 & -1 \\\\ -1 & 1 & 1 & 1 \\\\ -1 & -1 & 1 & 2 \\\\ 3 & 1 & -2 & -4 \\end{pmatrix}$
4) $A = (a_{ij})_{4 \\times 4}$, tal que $a_{ij} = 1$ si $|i - j| \\le 1$, i $a_{ij} = 0$ altrament.
5) $A = (a_{ij})_{4 \\times 4}$, tal que $a_{ij} = 2^{j-1}$ si $i \\ge j$, i $a_{ij} = 0$ altrament.
6) $A = (a_{ij})_{4 \\times 4}$, tal que $a_{ii} = k$, $a_{i,j} = 1$ si $i - j = 1$, i $a_{ij} = 0$ altrament.`,
  content: `
El mètode de Gauss-Jordan consisteix a col·locar la matriu identitat a la dreta de la matriu $A$ i aplicar operacions elementals fins que a l'esquerra quedi la identitat. El que quedi a la dreta serà la inversa.

### 1) Matriu $2 \\times 2$
$$ (M_1 | I) = \\begin{pmatrix} 1 & 2 & | & 1 & 0 \\\\ 3 & 5 & | & 0 & 1 \\end{pmatrix} \\xrightarrow{R_2 - 3R_1} \\begin{pmatrix} 1 & 2 & | & 1 & 0 \\\\ 0 & -1 & | & -3 & 1 \\end{pmatrix} \\xrightarrow{-R_2} \\begin{pmatrix} 1 & 2 & | & 1 & 0 \\\\ 0 & 1 & | & 3 & -1 \\end{pmatrix} \\xrightarrow{R_1 - 2R_2} \\begin{pmatrix} 1 & 0 & | & -5 & 2 \\\\ 0 & 1 & | & 3 & -1 \\end{pmatrix} $$
$$ M_1^{-1} = \\mathbf{\\begin{pmatrix} -5 & 2 \\\\ 3 & -1 \\end{pmatrix}} $$

### 2) Matriu $3 \\times 3$
Calculem el determinant per veure si existeix:
$\\det(M_2) = 3(-36-2) - 1(-18+4) + 5(4+16) = -114 + 14 + 100 = 0$.
**La matriu no té inversa** perquè el seu determinant és nul.

### 3) Matriu $4 \\times 4$
Després d'aplicar Gauss-Jordan complet (procés llarg):
$$ M_3^{-1} = \\mathbf{\\begin{pmatrix} 1 & -3 & 1 & 0 \\\\ 2 & -7 & 2 & 1 \\\\ 3 & -9 & 3 & 1 \\\\ -2 & 6 & -3 & -1 \\end{pmatrix}} $$

### 4) Matriu de banda $4 \\times 4$
La matriu és $\\begin{pmatrix} 1 & 1 & 0 & 0 \\\\ 1 & 1 & 1 & 0 \\\\ 0 & 1 & 1 & 1 \\\\ 0 & 0 & 1 & 1 \\end{pmatrix}$. Aplicant Gauss-Jordan:
$$ A^{-1} = \\mathbf{\\begin{pmatrix} 1 & 0 & -1 & 1 \\\\ 0 & 0 & 1 & -1 \\\\ -1 & 1 & 0 & 0 \\\\ 1 & -1 & 0 & 1 \\end{pmatrix}} $$

### 5) Matriu triangular inferior $4 \\times 4$
La matriu és $\\begin{pmatrix} 1 & 0 & 0 & 0 \\\\ 1 & 2 & 0 & 0 \\\\ 1 & 2 & 4 & 0 \\\\ 1 & 2 & 4 & 8 \\end{pmatrix}$.
Resolent el sistema $AX=I$:
$$ A^{-1} = \\mathbf{\\begin{pmatrix} 1 & 0 & 0 & 0 \\\\ -1/2 & 1/2 & 0 & 0 \\\\ 0 & -1/4 & 1/4 & 0 \\\\ 0 & 0 & -1/8 & 1/8 \\end{pmatrix}} $$

### 6) Matriu bidiagonal inferior ($k \\neq 0$)
La matriu és $\\begin{pmatrix} k & 0 & 0 & 0 \\\\ 1 & k & 0 & 0 \\\\ 0 & 1 & k & 0 \\\\ 0 & 0 & 1 & k \\end{pmatrix}$.
La inversa segueix el patró alternant segons les potències de $k$:
$$ A^{-1} = \\mathbf{\\begin{pmatrix} 1/k & 0 & 0 & 0 \\\\ -1/k^2 & 1/k & 0 & 0 \\\\ 1/k^3 & -1/k^2 & 1/k & 0 \\\\ -1/k^4 & 1/k^3 & -1/k^2 & 1/k \\end{pmatrix}} $$
`,
  availableLanguages: ['ca']
};
