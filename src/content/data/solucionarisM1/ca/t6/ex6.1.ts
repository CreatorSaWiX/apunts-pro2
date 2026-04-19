import type { Solution } from '../../../solutions';

export const ex6_1: Solution = {
  id: 'M1-T6-Ex6.1',
  title: 'Exercici 6.1: Operacions amb Vectors',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Siguin $u = \\begin{pmatrix} 3 \\\\ -1 \\\\ 2 \\end{pmatrix}$, $v = \\begin{pmatrix} 4 \\\\ 0 \\\\ -8 \\end{pmatrix}$ i $w = \\begin{pmatrix} 6 \\\\ -1 \\\\ -4 \\end{pmatrix}$ vectors de $\\mathbb{R}^3$. Calculeu:
  
1) $u - v$; $\\quad$ 2) $5v + 3w$; $\\quad$ 3) $5(v + 3w)$; $\\quad$ 4) $(2w - u) - 3(2v + u)$.`,
  content: `
### 1) Càlcul de $u - v$

Restem les components corresponents dels vectors $u$ i $v$:

$u - v = \\begin{pmatrix} 3 \\\\ -1 \\\\ 2 \\end{pmatrix} - \\begin{pmatrix} 4 \\\\ 0 \\\\ -8 \\end{pmatrix} = \\begin{pmatrix} 3-4 \\\\ -1-0 \\\\ 2-(-8) \\end{pmatrix} = \\mathbf{\\begin{pmatrix} -1 \\\\ -1 \\\\ 10 \\end{pmatrix}}$

### 2) Càlcul de $5v + 3w$

$5v = 5 \\begin{pmatrix} 4 \\\\ 0 \\\\ -8 \\end{pmatrix} = \\begin{pmatrix} 20 \\\\ 0 \\\\ -40 \\end{pmatrix}$

$3w = 3 \\begin{pmatrix} 6 \\\\ -1 \\\\ -4 \\end{pmatrix} = \\begin{pmatrix} 18 \\\\ -3 \\\\ -12 \\end{pmatrix}$

$5v + 3w = \\begin{pmatrix} 20 \\\\ 0 \\\\ -40 \\end{pmatrix} + \\begin{pmatrix} 18 \\\\ -3 \\\\ -12 \\end{pmatrix} = \\begin{pmatrix} 20+18 \\\\ 0-3 \\\\ -40-12 \\end{pmatrix} = \\mathbf{\\begin{pmatrix} 38 \\\\ -3 \\\\ -52 \\end{pmatrix}}$

### 3) Càlcul de $5(v + 3w)$

$v + 3w = \\begin{pmatrix} 4 \\\\ 0 \\\\ -8 \\end{pmatrix} + \\begin{pmatrix} 18 \\\\ -3 \\\\ -12 \\end{pmatrix} = \\begin{pmatrix} 22 \\\\ -3 \\\\ -20 \\end{pmatrix}$

$5(v + 3w) = 5 \\begin{pmatrix} 22 \\\\ -3 \\\\ -20 \\end{pmatrix} = \\mathbf{\\begin{pmatrix} 110 \\\\ -15 \\\\ -100 \\end{pmatrix}}$

### 4) Càlcul de $(2w - u) - 3(2v + u)$

$2w - u = \\begin{pmatrix} 12 \\\\ -2 \\\\ -8 \\end{pmatrix} - \\begin{pmatrix} 3 \\\\ -1 \\\\ 2 \\end{pmatrix} = \\begin{pmatrix} 12-3 \\\\ -2-(-1) \\\\ -8-2 \\end{pmatrix} = \\begin{pmatrix} 9 \\\\ -1 \\\\ -10 \\end{pmatrix}$

$2v + u = \\begin{pmatrix} 8 \\\\ 0 \\\\ -16 \\end{pmatrix} + \\begin{pmatrix} 3 \\\\ -1 \\\\ 2 \\end{pmatrix} = \\begin{pmatrix} 11 \\\\ -1 \\\\ -14 \\end{pmatrix}$

$3(2v + u) = 3 \\begin{pmatrix} 11 \\\\ -1 \\\\ -14 \\end{pmatrix} = \\begin{pmatrix} 33 \\\\ -3 \\\\ -42 \\end{pmatrix}$

$(2w - u) - 3(2v + u) = \\begin{pmatrix} 9 \\\\ -1 \\\\ -10 \\end{pmatrix} - \\begin{pmatrix} 33 \\\\ -3 \\\\ -42 \\end{pmatrix} = \\begin{pmatrix} 9-33 \\\\ -1-(-3) \\\\ -10-(-42) \\end{pmatrix} = \\mathbf{\\begin{pmatrix} -24 \\\\ 2 \\\\ 32 \\end{pmatrix}}$
`,
  availableLanguages: ['ca']
};
