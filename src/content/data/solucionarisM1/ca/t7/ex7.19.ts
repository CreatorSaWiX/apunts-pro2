import type { Solution } from '../../../solutions';

export const ex7_19: Solution = {
  id: 'M1-T7-Ex7.19',
  title: 'Exercici 7.19: Endomorfisme de producte de matrius',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Considerem l'endomorfisme $f_N: \\mathcal{M}_2(\\mathbb{R}) \\to \\mathcal{M}_2(\\mathbb{R})$ definit per $f_N(A) = NA$ on $N = \\begin{pmatrix} 1 & 1 \\\\ 1 & 1 \\end{pmatrix}$.

1) Trobeu la matriu associada a $f_N$ en la base canònica de $\\mathcal{M}_2(\\mathbb{R})$.
2) Calculeu $\\ker f_N$ i $\\text{Im } f_N$.
3) Trobeu la matriu associada a $f_N$ en la base $B = \\left\\{ \\begin{pmatrix} 1 & 1 \\\\ 0 & 0 \\end{pmatrix}, \\begin{pmatrix} 0 & 1 \\\\ 1 & 0 \\end{pmatrix}, \\begin{pmatrix} 0 & 0 \\\\ 1 & 1 \\end{pmatrix}, \\begin{pmatrix} 0 & 0 \\\\ 0 & 1 \\end{pmatrix} \\right\\}$.`,
  content: `
### 1) Matriu en base canònica ($M_C$)

La base canònica de $\\mathcal{M}_2(\\mathbb{R})$ és $C = \\{E_{11}, E_{12}, E_{21}, E_{22}\\}$. Calculem les imatges:
- $f(E_{11}) = \\begin{pmatrix} 1 & 1 \\\\ 1 & 1 \\end{pmatrix} \\begin{pmatrix} 1 & 0 \\\\ 0 & 0 \\end{pmatrix} = \\begin{pmatrix} 1 & 0 \\\\ 1 & 0 \\end{pmatrix} \\to (1, 0, 1, 0)$
- $f(E_{12}) = \\begin{pmatrix} 1 & 1 \\\\ 1 & 1 \\end{pmatrix} \\begin{pmatrix} 0 & 1 \\\\ 0 & 0 \\end{pmatrix} = \\begin{pmatrix} 0 & 1 \\\\ 0 & 1 \\end{pmatrix} \\to (0, 1, 0, 1)$
- $f(E_{21}) = \\begin{pmatrix} 1 & 1 \\\\ 1 & 1 \\end{pmatrix} \\begin{pmatrix} 0 & 0 \\\\ 1 & 0 \\end{pmatrix} = \\begin{pmatrix} 1 & 0 \\\\ 1 & 0 \\end{pmatrix} \\to (1, 0, 1, 0)$
- $f(E_{22}) = \\begin{pmatrix} 1 & 1 \\\\ 1 & 1 \\end{pmatrix} \\begin{pmatrix} 0 & 0 \\\\ 0 & 1 \\end{pmatrix} = \\begin{pmatrix} 0 & 1 \\\\ 0 & 1 \\end{pmatrix} \\to (0, 1, 0, 1)$

La matriu és:
$$M_C = \\begin{pmatrix} 1 & 0 & 1 & 0 \\\\ 0 & 1 & 0 & 1 \\\\ 1 & 0 & 1 & 0 \\\\ 0 & 1 & 0 & 1 \\end{pmatrix}$$

---

### 2) Nucli i Imatge

- **Imatge:** El rang de $M_C$ és 2 (les files 3 i 4 són repetides). La imatge està generada per les columnes LI:
  $$\\text{Im } f_N = \\langle \\begin{pmatrix} 1 & 0 \\\\ 1 & 0 \\end{pmatrix}, \\begin{pmatrix} 0 & 1 \\\\ 0 & 1 \\end{pmatrix} \\rangle$$
  (Són les matrius amb les dues files iguals).

- **Nucli:** Resolent $M_C X = 0$, obtenim les condicions $x_1 + x_3 = 0$ i $x_2 + x_4 = 0$.
  $$\\ker f_N = \\langle \\begin{pmatrix} 1 & 0 \\\\ -1 & 0 \\end{pmatrix}, \\begin{pmatrix} 0 & 1 \\\\ 0 & -1 \\end{pmatrix} \\rangle$$
  (Són les matrius on la segona fila és l'oposada de la primera).

---

### 3) Matriu en base $B$

Calculem les imatges dels vectors de $B = \\{v_1, v_2, v_3, v_4\\}$ i les expressem en la mateixa base $B$:
- $f(v_1) = f(v_2) = f(v_3) = \\begin{pmatrix} 1 & 1 \\\\ 1 & 1 \\end{pmatrix}$. Busquem $(a, b, c, d)_B$:
  $a v_1 + b v_2 + c v_3 + d v_4 = \\begin{pmatrix} 1 & 1 \\\\ 1 & 1 \\end{pmatrix} \\implies a=1, b=0, c=1, d=0$.
- $f(v_4) = \\begin{pmatrix} 0 & 1 \\\\ 0 & 1 \\end{pmatrix}$. Busquem $(a, b, c, d)_B$:
  $a v_1 + b v_2 + c v_3 + d v_4 = \\begin{pmatrix} 0 & 1 \\\\ 0 & 1 \\end{pmatrix} \\implies a=0, b=1, c=-1, d=2$.

La matriu en base $B$ és:
$$M_B = \\begin{pmatrix} 1 & 1 & 1 & 0 \\\\ 0 & 0 & 0 & 1 \\\\ 1 & 1 & 1 & -1 \\\\ 0 & 0 & 0 & 2 \\end{pmatrix}$$
`,
  availableLanguages: ['ca']
};
