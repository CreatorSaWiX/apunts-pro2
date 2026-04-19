import type { Solution } from '../../../solutions';

export const ex6_24: Solution = {
  id: 'M1-T6-Ex6.24',
  title: 'Exercici 6.24: Base de l’Espai de Matrius 2x2',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Sigui $\\mathcal{B} = \\left\\{ \\begin{pmatrix} 1 & 0 \\\\ 0 & 0 \\end{pmatrix}, \\begin{pmatrix} 1 & 1 \\\\ 0 & 0 \\end{pmatrix}, \\begin{pmatrix} 1 & 2 \\\\ 1 & 0 \\end{pmatrix}, \\begin{pmatrix} 0 & 0 \\\\ 0 & 1 \\end{pmatrix} \\right\\}$.

Comproveu que és una base de $\\mathcal{M}_2(\\mathbb{R})$.
Doneu les coordenades d'$A = \\begin{pmatrix} 1 & 3 \\\\ 3 & 1 \\end{pmatrix}$ en la base $\\mathcal{B}$.`,
  content: `
### 1) Comprovació de la Base

L'espai de les matrius $2 \\times 2$ té dimensió 4. Com que el conjunt $\\mathcal{B}$ té 4 matrius, només cal demostrar que són linealment independents. Podem representar cada matriu com un vector de $\\mathbb{R}^4$ (per files) i calcular el determinant de la matriu de transició:

Les matrius en forma vectorial són:
*   $v_1 = (1, 0, 0, 0)$
*   $v_2 = (1, 1, 0, 0)$
*   $v_3 = (1, 2, 1, 0)$
*   $v_4 = (0, 0, 0, 1)$

Construïm la matriu per columnes:
$$M = \\begin{pmatrix} 1 & 1 & 1 & 0 \\\\ 0 & 1 & 2 & 0 \\\\ 0 & 0 & 1 & 0 \\\\ 0 & 0 & 0 & 1 \\end{pmatrix}$$

Aquesta matriu és **triangular superior**, per tant el seu determinant és el producte dels elements de la diagonal principal:
$$\\Delta = 1 \\cdot 1 \\cdot 1 \\cdot 1 = 1$$

Com que $\\Delta \\neq 0$, les matrius són linealment independents i formen una **base de $\\mathcal{M}_2(\\mathbb{R})$**.

---

### 2) Coordenades de la matriu $A$

Busquem els escalars $c_1, c_2, c_3, c_4$ tals que:
$$c_1 \\begin{pmatrix} 1 & 0 \\\\ 0 & 0 \\end{pmatrix} + c_2 \\begin{pmatrix} 1 & 1 \\\\ 0 & 0 \\end{pmatrix} + c_3 \\begin{pmatrix} 1 & 2 \\\\ 1 & 0 \\end{pmatrix} + c_4 \\begin{pmatrix} 0 & 0 \\\\ 0 & 1 \\end{pmatrix} = \\begin{pmatrix} 1 & 3 \\\\ 3 & 1 \\end{pmatrix}$$

Igualant component a component obtenim el sistema:
1.  **Component (2,1)**: $c_3 = 3$
2.  **Component (2,2)**: $c_4 = 1$
3.  **Component (1,2)**: $c_2 + 2c_3 = 3 \\implies c_2 + 2(3) = 3 \\implies c_2 = -3$
4.  **Component (1,1)**: $c_1 + c_2 + c_3 = 1 \\implies c_1 - 3 + 3 = 1 \\implies c_1 = 1$

Les coordenades de la matriu $A$ en la base $\\mathcal{B}$ són:
$$\\mathbf{(1, -3, 3, 1)_\\mathcal{B}}$$
`,
  availableLanguages: ['ca']
};
