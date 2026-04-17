import type { Solution } from '../../../solutions';

export const ex5_27: Solution = {
  id: 'M1-T5-Ex5.27',
  title: 'Exercici 5.27: Demostració d\'un Determinant Simètric',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Comproveu que
$$\\begin{vmatrix} a & 1 & 1 & 1 \\\\ 1 & a & 1 & 1 \\\\ 1 & 1 & a & 1 \\\\ 1 & 1 & 1 & a \\end{vmatrix} = (a+3)(a-1)^3.$$`,
  content: `
Aquest tipus de determinants, on totes les files sumen el mateix, es resolen fàcilment sumant totes les columnes a la primera.

### Pas 1: Sumar totes les columnes a la primera ($C_1 \\to C_1 + C_2 + C_3 + C_4$)
$$\\begin{vmatrix} a+3 & 1 & 1 & 1 \\\\ a+3 & a & 1 & 1 \\\\ a+3 & 1 & a & 1 \\\\ a+3 & 1 & 1 & a \\end{vmatrix}$$

### Pas 2: Treure factor comú $(a+3)$ de la primera columna
$$(a+3) \\cdot \\begin{vmatrix} 1 & 1 & 1 & 1 \\\\ 1 & a & 1 & 1 \\\\ 1 & 1 & a & 1 \\\\ 1 & 1 & 1 & a \\end{vmatrix}$$

### Pas 3: Crear zeros a la primera columna ($F_2-F_1, F_3-F_1, F_4-F_1$)
$$(a+3) \\cdot \\begin{vmatrix} 1 & 1 & 1 & 1 \\\\ 0 & a-1 & 0 & 0 \\\\ 0 & 0 & a-1 & 0 \\\\ 0 & 0 & 0 & a-1 \\end{vmatrix}$$

### Pas 4: Calcular el determinant de la matriu triangular
Com que la matriu resultant és triangular superior, el seu determinant és el producte dels elements de la diagonal principal:
$$D = (a+3) \\cdot [1 \\cdot (a-1) \\cdot (a-1) \\cdot (a-1)] = \\mathbf{(a+3)(a-1)^3}$$

Quedant així demostrada la igualtat.
`,
  availableLanguages: ['ca']
};
