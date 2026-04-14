import type { Solution } from '../../../solutions';

export const ex5_23: Solution = {
  id: 'M1-T5-Ex5.23',
  title: 'Exercici 5.23: Propietats dels Determinants',
  author: 'Antigravity',
  code: '',
  type: 'notebook',
  statement: `Suposant que $\\begin{vmatrix} a & b & c & d \\\\ e & f & g & h \\\\ i & j & k & l \\\\ m & n & o & p \\end{vmatrix} = 5$, calculeu els determinants següents:
1) $\\begin{vmatrix} e & f & g & h \\\\ i & j & k & l \\\\ a & b & c & d \\\\ m & n & o & p \\end{vmatrix}$
2) $\\begin{vmatrix} -a & -b & -c & -d \\\\ 2e & 2f & 2g & 2h \\\\ i & j & k & l \\\\ m & n & o & p \\end{vmatrix}$
3) $\\begin{vmatrix} a+e & b+f & c+g & d+h \\\\ e & f & g & h \\\\ m & n & o & p \\\\ i & j & k & l \\end{vmatrix}$
4) $\\begin{vmatrix} a & b & c & d \\\\ e-3a & f-3b & g-3c & h-3d \\\\ i & j & k & l \\\\ 4m & 4n & 4o & 4p \\end{vmatrix}$`,
  content: `
Per resoldre aquest exercici aplicarem les següents **propietats dels determinants**:
- Si s'intercanvien dues files, el determinant canvia de signe.
- Si una fila es multiplica per un escalar $k$, el determinant queda multiplicat per $k$.
- Si a una fila se li suma una combinació lineal d'altres files, el determinant no varia.

---

### 1) Permutació de files
Tenim les files del determinant original en l'ordre $(R_2, R_3, R_1, R_4)$.
Fem els canvis pas a pas per veure el signe:
- Intercanviem $R_1 \\leftrightarrow R_2$: $(R_2, R_1, R_3, R_4)$ $\\to$ Signe $(-)$
- Intercanviem $R_2 \\leftrightarrow R_3$: $(R_2, R_3, R_1, R_4)$ $\\to$ Signe $(-)(-) = (+)$
Com que s'han fet 2 intercanvis, el determinant es manté:
$$D_1 = (-1)^2 \\cdot 5 = \\mathbf{5}$$

### 2) Multiplicació per escalars
- La fila 1 s'ha multiplicat per $-1$.
- La fila 2 s'ha multiplicat per $2$.
$$D_2 = (-1) \\cdot 2 \\cdot 5 = \\mathbf{-10}$$

### 3) Combinació lineal i intercanvi
Primer, restem la segona fila a la primera ($R_1 \\to R_1 - R_2$). El determinant no varia:
$$\\begin{vmatrix} a & b & c & d \\\\ e & f & g & h \\\\ m & n & o & p \\\\ i & j & k & l \\end{vmatrix}$$
Ara, observem que les files 3 i 4 estan intercanviades respecte l'original:
- Intercanvi $R_3 \\leftrightarrow R_4$: Signe $(-)$
$$D_3 = -1 \\cdot 5 = \\mathbf{-5}$$

### 4) Operació elemental i constant
- L'operació $R_2 \\to R_2 - 3R_1$ no modifica el valor del determinant.
- La quarta fila s'ha multiplicat per $4$.
$$D_4 = 4 \\cdot 5 = \\mathbf{20}$$
`,
  availableLanguages: ['ca']
};
