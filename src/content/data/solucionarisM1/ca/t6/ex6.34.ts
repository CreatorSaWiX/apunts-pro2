import type { Solution } from '../../../solutions';

export const ex6_34: Solution = {
  id: 'M1-T6-Ex6.34',
  title: 'Exercici 6.34: Ampliació de Bases de Subespais',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Considereu els subespais $E$ de l'exercici anterior (Exercici 6.33). Per a cadascun d'ells, amplieu la base fins a obtenir-ne una de l'espai vectorial on es troben.`,
  content: `
### Resolució del Problema

Per ampliar una base $\\mathcal{B}$ d'un subespai $E$ fins a una base de l'espai total $V$, hem d'afegir vectors de $V$ que siguin linealment independents respecte als vectors de $\\mathcal{B}$ fins a completar la dimensió de l'espai total.

### 1) $E \\subset \\mathbb{R}^3$, $\\mathcal{B}_E = \\{(1, 1, 2)\\}$
La dimensió de $\\mathbb{R}^3$ és 3. Necessitem 2 vectors més.
Podem afegir $e_1 = (1, 0, 0)$ i $e_2 = (0, 1, 0)$.
Comprovem el determinant:
$$\\begin{vmatrix} 1 & 1 & 2 \\\\ 1 & 0 & 0 \\\\ 0 & 1 & 0 \\end{vmatrix} = -1 \\cdot (0-2) = 2 \\neq 0$$
**Base ampliada: $\\{(1, 1, 2), (1, 0, 0), (0, 1, 0)\\}$**.

### 2) $E \\subset \\mathbb{R}^3$, $\\mathcal{B}_E = \\{(1, 1, -1), (2, 0, -1)\\}$
Necessitem 1 vector més. Provarem amb $e_1 = (1, 0, 0)$.
$$\\begin{vmatrix} 1 & 1 & -1 \\\\ 2 & 0 & -1 \\\\ 1 & 0 & 0 \\end{vmatrix} = 1 \\cdot \\begin{vmatrix} 1 & -1 \\\\ 0 & -1 \\end{vmatrix} = 1 \\cdot (-1) = -1 \\neq 0$$
**Base ampliada: $\\{(1, 1, -1), (2, 0, -1), (1, 0, 0)\\}$**.

### 3) $E \\subset \\mathbb{R}^4$, $\\mathcal{B}_E = \\{(1, 1, 2, 0), (0, 3, -1, 0), (0, 0, 0, 1)\\}$
La dimensió de $\\mathbb{R}^4$ és 4. Necessitem 1 vector més.
L'equació de $E$ era $7x_1 - x_2 - 3x_3 = 0$. Qualsevol vector que no la compleixi serà independent. Per exemple, $e_1 = (1, 0, 0, 0)$.
**Base ampliada: $\\{(1, 1, 2, 0), (0, 3, -1, 0), (0, 0, 0, 1), (1, 0, 0, 0)\\}$**.

### 4) $E \\subset \\mathcal{M}_2(\\mathbb{R})$, $\\mathcal{B}_E = \\{ \\begin{pmatrix} 1 & 1 \\\\ 1 & 0 \\end{pmatrix}, \\begin{pmatrix} 0 & 0 \\\\ 0 & 1 \\end{pmatrix} \\}$
Necessitem 2 matrius més. Provem amb les de la base canònica $E_{12}$ i $E_{21}$:
$M_3 = \\begin{pmatrix} 0 & 1 \\\\ 0 & 0 \\end{pmatrix}, \\, M_4 = \\begin{pmatrix} 0 & 0 \\\\ 1 & 0 \\end{pmatrix}$.
En forma vectorial a $\\mathbb{R}^4$: $(1, 1, 1, 0), (0, 0, 0, 1), (0, 1, 0, 0), (0, 0, 1, 0)$.
El determinant d'aquests 4 vectors és 1, per tant són LI.
**Base ampliada: $\\left\\{ \\begin{pmatrix} 1 & 1 \\\\ 1 & 0 \\end{pmatrix}, \\begin{pmatrix} 0 & 0 \\\\ 0 & 1 \\end{pmatrix}, \\begin{pmatrix} 0 & 1 \\\\ 0 & 0 \\end{pmatrix}, \\begin{pmatrix} 0 & 0 \\\\ 1 & 0 \\end{pmatrix} \\right\\}$**.
`,
  availableLanguages: ['ca']
};
