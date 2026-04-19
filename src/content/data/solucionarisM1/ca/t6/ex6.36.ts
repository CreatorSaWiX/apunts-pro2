import type { Solution } from '../../../solutions';

export const ex6_36: Solution = {
  id: 'M1-T6-Ex6.36',
  title: 'Exercici 6.36: Base de Polinomis i Canvi de Base',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Considereu l'espai vectorial $P_2(\\mathbb{R})$ dels polinomis de grau menor o igual a 2.

1) Proveu que $B = \\{ -1 + 2x + 3x^2, \\, x - x^2, \\, x - 2x^2 \\}$ és una base de $P_2(\\mathbb{R})$ i calculeu la matriu de canvi de base de base canònica a base $B$.
2) Trobeu les coordenades de $p(x) = 3 - x + 2x^2$ en la base $B$.`,
  content: `
### 1) Prova de la Base i Matriu de Canvi de Base

Treballarem amb les coordenades respecte a la base canònica $C = \\{1, x, x^2\\}$. Els vectors de $B$ són:
$v_1 = (-1, 2, 3), \\, v_2 = (0, 1, -1), \\, v_3 = (0, 1, -2)$.

### Prova de la Base:
Construïm la matriu de $B$ a la canònica ($P_C^B$) i calculem el seu determinant:
$$P_C^B = \\begin{pmatrix} -1 & 0 & 0 \\\\ 2 & 1 & 1 \\\\ 3 & -1 & -2 \\end{pmatrix}$$
$$\\det(P_C^B) = -1 \\cdot (1(-2) - 1(-1)) = -1 \\cdot (-2 + 1) = 1$$
Com que el determinant és **1 $\\neq 0$**, els vectors són linealment independents i formen una base.

### Matriu de Canvi de Base (Canònica a $B$):
Hem de calcular la inversa $P_B^C = (P_C^B)^{-1}$. Com que el determinant és 1, la inversa és simplement la matriu d'adjunts transposada:
$$\\mathbf{P_B^C = \\begin{pmatrix} -1 & 0 & 0 \\\\ 7 & 2 & 1 \\\\ -5 & -1 & -1 \\end{pmatrix}}$$

---

### 2) Coordenades del polinomi $p(x)$

El polinomi $p(x) = 3 - x + 2x^2$ té coordenades $(3, -1, 2)$ en la base canònica. Per trobar les seves coordenades en la base $B$, apliquem la matriu de canvi de base:
$$[p]_B = P_B^C \\cdot [p]_C = \\begin{pmatrix} -1 & 0 & 0 \\\\ 7 & 2 & 1 \\\\ -5 & -1 & -1 \\end{pmatrix} \\begin{pmatrix} 3 \\\\ -1 \\\\ 2 \\end{pmatrix}$$

Realitzem el producte:
*   $c_1 = -1(3) = -3$
*   $c_2 = 7(3) + 2(-1) + 1(2) = 21 - 2 + 2 = 21$
*   $c_3 = -5(3) - 1(-1) - 1(2) = -15 + 1 - 2 = -16$

Les coordenades de $p(x)$ en la base $B$ són: **$(-3, 21, -16)_B$**.
`,
  availableLanguages: ['ca']
};
