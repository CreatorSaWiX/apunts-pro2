import type { Solution } from '../../../solutions';

export const ex6_35: Solution = {
  id: 'M1-T6-Ex6.35',
  title: 'Exercici 6.35: Matrius de Canvi de Base',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Considereu la base $B = \\left\\{ \\begin{pmatrix} 1 \\\\ 0 \\\\ -1 \\end{pmatrix}, \\begin{pmatrix} 1 \\\\ 2 \\\\ 1 \\end{pmatrix}, \\begin{pmatrix} 3 \\\\ 4 \\\\ 0 \\end{pmatrix} \\right\\}$ de $\\mathbb{R}^3$.

1) Doneu la matriu $P_B^C$ de canvi de base de la base canònica de $\\mathbb{R}^3$ a $B$.
2) Sigui ara $B' = \\left\\{ \\begin{pmatrix} 2 \\\\ -1 \\\\ -2 \\end{pmatrix}, \\begin{pmatrix} 1 \\\\ -2 \\\\ 1 \\end{pmatrix}, \\begin{pmatrix} 1 \\\\ 0 \\\\ 1 \\end{pmatrix} \\right\\}$ una altra base de $\\mathbb{R}^3$. Doneu la matriu $P_B^{B'}$ de canvi de base de $B'$ a $B$.`,
  content: `
### 1) Matriu de canvi de base de la canònica a $B$ ($P_B^C$)

Per definició, la matriu $P_C^B$ (de $B$ a la canònica) és la que té els vectors de $B$ per columnes:
$$P_C^B = \\begin{pmatrix} 1 & 1 & 3 \\\\ 0 & 2 & 4 \\\\ -1 & 1 & 0 \\end{pmatrix}$$

La matriu que ens demanen, $P_B^C$ (de la canònica a $B$), és la seva inversa: $P_B^C = (P_C^B)^{-1}$.
Calculem la inversa:
*   $\\det(P_C^B) = 1(0-4) - 1(0+4) + 3(0+2) = -4 - 4 + 6 = -2$.
*   Matriu d'adjunts: $\\text{Adj}(P_C^B) = \\begin{pmatrix} -4 & -4 & 2 \\\\ 3 & 3 & -2 \\\\ -2 & -4 & 2 \\end{pmatrix}$.
*   Transposant i dividint pel determinant:
$$\\mathbf{P_B^C = \\begin{pmatrix} 2 & -3/2 & 1 \\\\ 2 & -3/2 & 2 \\\\ -1 & 1 & -1 \\end{pmatrix}}$$

---

### 2) Matriu de canvi de base de $B'$ a $B$ ($P_B^{B'}$)

Sabem que la relació entre coordenades ve donada per:
$$[v]_B = P_B^{B'} [v]_{B'} \\implies P_B^{B'} = P_B^C \\cdot P_C^{B'}$$

On $P_C^{B'}$ és la matriu amb els vectors de $B'$ en columnes:
$$P_C^{B'} = \\begin{pmatrix} 2 & 1 & 1 \\\\ -1 & -2 & 0 \\\\ -2 & 1 & 1 \\end{pmatrix}$$

Multipliquem les dues matrius:
$$P_B^{B'} = \\begin{pmatrix} 2 & -3/2 & 1 \\\\ 2 & -3/2 & 2 \\\\ -1 & 1 & -1 \\end{pmatrix} \\begin{pmatrix} 2 & 1 & 1 \\\\ -1 & -2 & 0 \\\\ -2 & 1 & 1 \\end{pmatrix}$$

Realitzant el producte fila per columna:
*   $f_1: (2\\cdot 2 + 1.5 - 2, \\, 2 + 3 + 1, \\, 2 + 0 + 1) = (3.5, \\, 6, \\, 3)$
*   $f_2: (2\\cdot 2 + 1.5 - 4, \\, 2 + 3 + 2, \\, 2 + 0 + 2) = (1.5, \\, 7, \\, 4)$
*   $f_3: (-2 - 1 + 2, \\, -1 - 2 - 1, \\, -1 + 0 - 1) = (-1, \\, -4, \\, -2)$

Obtenim la matriu:
$$\\mathbf{P_B^{B'} = \\begin{pmatrix} 7/2 & 6 & 3 \\\\ 3/2 & 7 & 4 \\\\ -1 & -4 & -2 \\end{pmatrix}}$$
`,
  availableLanguages: ['ca']
};
