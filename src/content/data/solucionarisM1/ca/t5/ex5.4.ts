import type { Solution } from '../../../solutions';

export const ex5_4: Solution = {
  id: 'M1-T5-Ex5.4',
  title: 'Exercici 5.4: Càlcul d’Elements Específics del Producte',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Per a les matrius $A$ i $B$ següents, doneu els elements $c_{13}$ i $c_{22}$ de la matriu $C = AB$ sense calcular tots els elements de $C$.
$A = \\begin{pmatrix} 1 & 2 & 1 \\\\ -3 & 0 & -1 \\end{pmatrix}$,
$B = \\begin{pmatrix} 2 & 0 & 0 \\\\ 1 & -4 & 3 \\\\ -1 & 3 & 2 \\end{pmatrix}$.`,
  content: `
Recordem que comptem desde 1, no 0 com a PRO o EC.

### Càlcul de $c_{13}$
Aquest element s'obté multiplicant la **Fila 1 d'A** per la **Columna 3 de B**:

- Fila 1 d'A: $\\begin{pmatrix} 1 & 2 & 1 \\end{pmatrix}$
- Columna 3 de B: $\\begin{pmatrix} 0 \\\\ 3 \\\\ 2 \\end{pmatrix}$

$$c_{13} = (1 \\cdot 0) + (2 \\cdot 3) + (1 \\cdot 2) = 0 + 6 + 2 = \\mathbf{8}$$

### Càlcul de $c_{22}$
Aquest element s'obté multiplicant la **Fila 2 d'A** per la **Columna 2 de B**:

- Fila 2 d'A: $\\begin{pmatrix} -3 & 0 & -1 \\end{pmatrix}$
- Columna 2 de B: $\\begin{pmatrix} 0 \\\\ -4 \\\\ 3 \\end{pmatrix}$

$$c_{22} = (-3 \\cdot 0) + (0 \\cdot (-4)) + (-1 \\cdot 3) = 0 + 0 - 3 = \\mathbf{-3}$$
`,
  availableLanguages: ['ca']
};
