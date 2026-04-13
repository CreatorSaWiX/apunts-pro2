import type { Solution } from '../../../solutions';

export const ex5_2: Solution = {
  id: 'M1-T5-Ex5.2',
  title: 'Exercici 5.2: Producte de Vectors Fila i Columna',
  author: 'Antigravity',
  code: '',
  type: 'notebook',
  statement: `Calculeu els productes $\\begin{pmatrix} 1 & 2 & -3 \\end{pmatrix} \\begin{pmatrix} 2 \\\\ 1 \\\\ 5 \\end{pmatrix}$ i $\\begin{pmatrix} 2 \\\\ 1 \\\\ 5 \\end{pmatrix} \\begin{pmatrix} 1 & 2 & -3 \\end{pmatrix}$.`,
  content: `
Aquest exercici mostra la diferència entre el producte d'un vector fila per un vector columna (producte escalar) i el d'un vector columna per un fila (producte exterior o *outer product*).

### 1) Producte Fila per Columna ($1 \\times 3$ per $3 \\times 1$)

El resultat és una matriu $1 \\times 1$ (un escalar):

$\\begin{pmatrix} 1 & 2 & -3 \\end{pmatrix} \\begin{pmatrix} 2 \\\\ 1 \\\\ 5 \\end{pmatrix} = (1 \\cdot 2) + (2 \\cdot 1) + (-3 \\cdot 5) = 2 + 2 - 15 = \\mathbf{-11}$

### 2) Producte Columna per Fila ($3 \\times 1$ per $1 \\times 3$)

El resultat és una matriu $3 \\times 3$. Fem el producte fila per columna seguint la regla general ($c_{ij} = a_{i1} \\cdot b_{1j}$):

$\\begin{pmatrix} 2 \\\\ 1 \\\\ 5 \\end{pmatrix} \\begin{pmatrix} 1 & 2 & -3 \\end{pmatrix} = \\begin{pmatrix} 2(1) & 2(2) & 2(-3) \\\\ 1(1) & 1(2) & 1(-3) \\\\ 5(1) & 5(2) & 5(-3) \\end{pmatrix} = \\mathbf{\\begin{pmatrix} 2 & 4 & -6 \\\\ 1 & 2 & -3 \\\\ 5 & 10 & -15 \\end{pmatrix}}$

Observeu com el canvi en l'ordre dels factors canvia radicalment tant la mida com el contingut de la matriu resultant.
`,
  availableLanguages: ['ca']
};
