import type { Solution } from '../../../solutions';

export const ex5_14: Solution = {
  id: 'M1-T5-Ex5.14',
  title: 'Exercici 5.14: Inversa de Matrius Elementals',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Trobeu la inversa de les matrius elementals següents.
1) $\\begin{pmatrix} 0 & 1 \\\\ 1 & 0 \\end{pmatrix}$
2) $\\begin{pmatrix} 5 & 0 \\\\ 0 & 1 \\end{pmatrix}$
3) $\\begin{pmatrix} 0 & 0 & 1 \\\\ 0 & 1 & 0 \\\\ 1 & 0 & 0 \\end{pmatrix}$
4) $\\begin{pmatrix} 1 & 0 & 0 \\\\ 0 & 1 & 0 \\\\ 0 & -3 & 1 \\end{pmatrix}$
5) $\\begin{pmatrix} k & 0 & 0 \\\\ 0 & 1 & 0 \\\\ 0 & 0 & 1 \\end{pmatrix}, k \\neq 0$`,
  content: `
Diem que una matriu és **elemental** si s'obté aplicant una única operació elemental de fila a la matriu identitat. La inversa d'una matriu elemental és la matriu que realitza l'operació inversa.

---

### 1) Intercanvi de files ($F_1 \\leftrightarrow F_2$)
$$E_1 = \\begin{pmatrix} 0 & 1 \\\\ 1 & 0 \\end{pmatrix}$$
L'operació inversa d'intercanviar dues files és tornar-les a intercanviar. Per tant, la matriu és la seva pròpia inversa.
$$E_1^{-1} = \\mathbf{\\begin{pmatrix} 0 & 1 \\\\ 1 & 0 \\end{pmatrix}}$$

### 2) Escalar una fila ($F_1 \\to 5F_1$)
$$E_2 = \\begin{pmatrix} 5 & 0 \\\\ 0 & 1 \\end{pmatrix}$$
L'operació inversa de multiplicar per 5 és multiplicar per $1/5$.
$$E_2^{-1} = \\mathbf{\\begin{pmatrix} 1/5 & 0 \\\\ 0 & 1 \\end{pmatrix}}$$

### 3) Intercanvi de files ($F_1 \\leftrightarrow F_3$)
$$E_3 = \\begin{pmatrix} 0 & 0 & 1 \\\\ 0 & 1 & 0 \\\\ 1 & 0 & 0 \\end{pmatrix}$$
Igual que en el cas 1, la inversa d'una permutació és ella mateixa.
$$E_3^{-1} = \\mathbf{\\begin{pmatrix} 0 & 0 & 1 \\\\ 0 & 1 & 0 \\\\ 1 & 0 & 0 \\end{pmatrix}}$$

### 4) Combinació lineal de files ($F_3 \\to F_3 - 3F_2$)
$$E_4 = \\begin{pmatrix} 1 & 0 & 0 \\\\ 0 & 1 & 0 \\\\ 0 & -3 & 1 \\end{pmatrix}$$
L'operació inversa de restar 3 vegades una fila és sumar-la 3 vegades.
$$E_4^{-1} = \\mathbf{\\begin{pmatrix} 1 & 0 & 0 \\\\ 0 & 1 & 0 \\\\ 0 & 3 & 1 \\end{pmatrix}}$$

### 5) Escalar una fila ($F_1 \\to kF_1$)
$$E_5 = \\begin{pmatrix} k & 0 & 0 \\\\ 0 & 1 & 0 \\\\ 0 & 0 & 1 \\end{pmatrix}$$
L'operació inversa de multiplicar per $k$ és multiplicar per $1/k$.
$$E_5^{-1} = \\mathbf{\\begin{pmatrix} 1/k & 0 & 0 \\\\ 0 & 1 & 0 \\\\ 0 & 0 & 1 \\end{pmatrix}}$$
`,
  availableLanguages: ['ca']
};
