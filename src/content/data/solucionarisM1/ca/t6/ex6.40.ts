import type { Solution } from '../../../solutions';

export const ex6_40: Solution = {
  id: 'M1-T6-Ex6.40',
  title: 'Exercici 6.40: Determinació d’una Base a partir de Coordenades',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Sigui $B = \\{ p_1(x), p_2(x), p_3(x) \\}$ una base de $P_2(\\mathbb{R})$. Considerem els polinomis:
$u(x) = x^2 + x + 2$, \\, $v(x) = 2x^2 + 3$, \\, $w(x) = x^2 + x$.
Si en la base $B$ les coordenades de $u(x), v(x)$ i $w(x)$ són:
$$u(x)_B = \\begin{pmatrix} 2 \\\\ 1 \\\\ 0 \\end{pmatrix}, \\quad v(x)_B = \\begin{pmatrix} 2 \\\\ 0 \\\\ 2 \\end{pmatrix}, \\quad w(x)_B = \\begin{pmatrix} 1 \\\\ 1 \\\\ -2 \\end{pmatrix}$$
respectivament, doneu les coordenades dels vectors de $B$ en base canònica $C = \\{x^2, x, 1\\}$.`,
  content: `
### Resolució del Problema

Siguin $U_C$ i $U_B$ les matrius que tenen per columnes les coordenades de $u, v, w$ en les bases canònica i $B$ respectivament:
$$U_C = \\begin{pmatrix} 1 & 2 & 1 \\\\ 1 & 0 & 1 \\\\ 2 & 3 & 0 \\end{pmatrix}, \\quad U_B = \\begin{pmatrix} 2 & 2 & 1 \\\\ 1 & 0 & 1 \\\\ 0 & 2 & -2 \\end{pmatrix}$$

Sabem que la relació entre coordenades és $U_C = P_C^B \\cdot U_B$, on $P_C^B$ és la matriu que té per columnes les coordenades dels elements de la base $B$ expressats en la base canònica. Per tant:
$$P_C^B = U_C \\cdot (U_B)^{-1}$$

### 1) Càlcul de $(U_B)^{-1}$
Determinant de $U_B$:
$\\det(U_B) = 2(0-2) - 2(-2-0) + 1(2-0) = -4 + 4 + 2 = 2$.

La inversa és:
$$(U_B)^{-1} = \\frac{1}{2} \\begin{pmatrix} -2 & 6 & 2 \\\\ 2 & -4 & -1 \\\\ 2 & -4 & -2 \\end{pmatrix} = \\begin{pmatrix} -1 & 3 & 1 \\\\ 1 & -2 & -0.5 \\\\ 1 & -2 & -1 \\end{pmatrix}$$

### 2) Producte de matrius
$$P_C^B = \\begin{pmatrix} 1 & 2 & 1 \\\\ 1 & 0 & 1 \\\\ 2 & 3 & 0 \\end{pmatrix} \\begin{pmatrix} -1 & 3 & 1 \\\\ 1 & -2 & -0.5 \\\\ 1 & -2 & -1 \\end{pmatrix} = \\begin{pmatrix} 2 & -3 & -1 \\\\ 0 & 1 & 0 \\\\ 1 & 0 & 0.5 \\end{pmatrix}$$

### Resultat Final

Les columnes de la matriu $P_C^B$ són les coordenades dels vectors de $B$ en la base canònica:
*   $p_1(x) = (2, 0, 1)_C \\implies \\mathbf{2x^2 + 1}$
*   $p_2(x) = (-3, 1, 0)_C \\implies \\mathbf{-3x^2 + x}$
*   $p_3(x) = (-1, 0, 0.5)_C \\implies \\mathbf{-x^2 + 0.5}$

*Comprovació*: Per exemple, $u(x) = 2p_1(x) + p_2(x) = 2(2x^2+1) + (-3x^2+x) = x^2+x+2$. Correcte.
`,
  availableLanguages: ['ca']
};
