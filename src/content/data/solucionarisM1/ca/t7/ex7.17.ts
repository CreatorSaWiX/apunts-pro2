import type { Solution } from '../../../solutions';

export const ex7_17: Solution = {
  id: 'M1-T7-Ex7.17',
  title: 'Exercici 7.17: Canvi de base en la matriu associada',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Sigui $f$ un endomorfisme de $P_2(\\mathbb{R})$ donat per $f(a_0 + a_1 x + a_2 x^2) = 3a_0 + (a_0 - a_1) x + (2a_0 + a_1 + a_2) x^2$. Doneu la matriu d'$f$ en la base $B = \\{1 + x^2, -1 + 2x + x^2, 2 + x + x^2\\}$.`,
  content: `
Per trobar la matriu d'un endomorfisme en una base $B$ no canònica, podem seguir dos camins: trobar les imatges dels vectors de $B$ i expressar-les en $B$, o utilitzar la fórmula del canvi de base:
$$A_B = P^{-1} \\cdot A_C \\cdot P$$
on $A_C$ és la matriu en base canònica i $P$ és la matriu de canvi de base de $B$ a la canònica $C$.

---

### 1) Matriu en base canònica ($A_C$)

Si prenem la base canònica $C = \\{1, x, x^2\\}$:
- $f(1) = 3 + x + 2x^2 \\to (3, 1, 2)$
- $f(x) = -x + x^2 \\to (0, -1, 1)$
- $f(x^2) = x^2 \\to (0, 0, 1)$

Llavors:
$$A_C = \\begin{pmatrix} 3 & 0 & 0 \\\\ 1 & -1 & 0 \\\\ 2 & 1 & 1 \\end{pmatrix}$$

### 2) Matriu de canvi de base ($P$)

La matriu $P$ conté els vectors de $B$ expressats en base canònica per columnes:
$$P = \\begin{pmatrix} 1 & -1 & 2 \\\\ 0 & 2 & 1 \\\\ 1 & 1 & 1 \\end{pmatrix}$$

### 3) Càlcul de $A_B = P^{-1} A_C P$

Primer calculem el producte $A_C P$:
$$A_C P = \\begin{pmatrix} 3 & 0 & 0 \\\\ 1 & -1 & 0 \\\\ 2 & 1 & 1 \\end{pmatrix} \\begin{pmatrix} 1 & -1 & 2 \\\\ 0 & 2 & 1 \\\\ 1 & 1 & 1 \\end{pmatrix} = \\begin{pmatrix} 3 & -3 & 6 \\\\ 1 & -3 & 1 \\\\ 3 & 1 & 6 \\end{pmatrix}$$

Calculem $P^{-1}$:
- $\\det(P) = -4$.
- $P^{-1} = -\\frac{1}{4} \\begin{pmatrix} 1 & 3 & -5 \\\\ 1 & -1 & -1 \\\\ -2 & -2 & 2 \\end{pmatrix}$

Finalment:
$$A_B = -\\frac{1}{4} \\begin{pmatrix} 1 & 3 & -5 \\\\ 1 & -1 & -1 \\\\ -2 & -2 & 2 \\end{pmatrix} \\begin{pmatrix} 3 & -3 & 6 \\\\ 1 & -3 & 1 \\\\ 3 & 1 & 6 \\end{pmatrix} = -\\frac{1}{4} \\begin{pmatrix} -9 & -17 & -21 \\\\ -1 & -1 & -1 \\\\ -2 & 14 & -2 \\end{pmatrix}$$

La matriu d'$f$ en la base $B$ és:
$$A_B = \\begin{pmatrix} 9/4 & 17/4 & 21/4 \\\\ 1/4 & 1/4 & 1/4 \\\\ 1/2 & -7/2 & 1/2 \\end{pmatrix}$$
`,
  availableLanguages: ['ca']
};
