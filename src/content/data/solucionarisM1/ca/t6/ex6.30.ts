import type { Solution } from '../../../solutions';

export const ex6_30: Solution = {
  id: 'M1-T6-Ex6.30',
  title: 'Exercici 6.30: Extensió d’Independència Lineal en Matrius',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Considereu els vectors de $\\mathcal{M}_2(\\mathbb{R})$:
$$A_1 = \\begin{pmatrix} 1 & 4 \\\\ -1 & 10 \\end{pmatrix}, \\quad A_2 = \\begin{pmatrix} 6 & 10 \\\\ 1 & 0 \\end{pmatrix}, \\quad A_3 = \\begin{pmatrix} 2 & 2 \\\\ 1 & 1 \\end{pmatrix}$$
Demostreu que formen un conjunt linealment independent i trobeu un vector que juntament amb aquests tres formi una base de $\\mathcal{M}_2(\\mathbb{R})$.`,
  content: `
### 1) Demostració de la Independència Lineal

Representem cada matriu com un vector de $\\mathbb{R}^4$ mitjançant els seus coeficients (per files):
*   $v_1 = (1, 4, -1, 10)$
*   $v_2 = (6, 10, 1, 0)$
*   $v_3 = (2, 2, 1, 1)$

Anem a calcular el rang de la matriu formada per aquests vectors mitjançant escalonament de Gauss:

$$\\begin{pmatrix} 1 & 4 & -1 & 10 \\\\ 6 & 10 & 1 & 0 \\\\ 2 & 2 & 1 & 1 \\end{pmatrix} \\xrightarrow[R_3-2R_1]{R_2-6R_1} \\begin{pmatrix} 1 & 4 & -1 & 10 \\\\ 0 & -14 & 7 & -60 \\\\ 0 & -6 & 3 & -19 \\end{pmatrix}$$

Multipliquem $R_2$ per $-3$ i $R_3$ per $7$:
$$\\begin{pmatrix} 1 & 4 & -1 & 10 \\\\ 0 & 42 & -21 & 180 \\\\ 0 & -42 & 21 & -133 \\end{pmatrix} \\xrightarrow{R_3+R_2} \\begin{pmatrix} 1 & 4 & -1 & 10 \\\\ 0 & 42 & -21 & 180 \\\\ 0 & 0 & 0 & 47 \\end{pmatrix}$$

Com que la matriu té 3 pivots (files no nul·les), el rang és 3. Això prova que les tres matrius són **linealment independents**.

---

### 2) Trobar un quart vector per formar una base

L'espai $\\mathcal{M}_2(\\mathbb{R})$ té dimensió 4. Necessitem un vector $A_4$ que no sigui combinació lineal dels altres tres. Hem vist que el tercer pivot de la matriu escalonada està a la quarta columna (corresponent al component $(2,2)$ de la matriu). El component $(2,1)$ (columna 3) s'ha anul·lat.

Provem d'afegir la matriu de la base canònica $E_{2,1} = \\begin{pmatrix} 0 & 0 \\\\ 1 & 0 \\end{pmatrix}$, que correspon al vector $(0, 0, 1, 0)$. Comprovem el determinant del conjunt:

$$\\Delta = \\begin{vmatrix} 1 & 4 & -1 & 10 \\\\ 6 & 10 & 1 & 0 \\\\ 2 & 2 & 1 & 1 \\\\ 0 & 0 & 1 & 0 \\end{vmatrix}$$

Desenvolupant per l'última fila:
$$\\Delta = -1 \\cdot \\begin{vmatrix} 1 & 4 & 10 \\\\ 6 & 10 & 0 \\\\ 2 & 2 & 1 \\end{vmatrix}$$
$$\\Delta = -1 \\cdot \\left[ 1(10-0) - 4(6-0) + 10(12-20) \\right] = -1 \\cdot (10 - 24 - 80) = -1 \\cdot (-94) = 94$$

Com que el determinant és **94 $\\neq 0$**, el conjunt format per $\\{A_1, A_2, A_3, A_4\\}$ és linealment independent i, per tant, és una base de $\\mathcal{M}_2(\\mathbb{R})$.

Un vector possible és: **$A_4 = \\begin{pmatrix} 0 & 0 \\\\ 1 & 0 \\end{pmatrix}$**.
`,
  availableLanguages: ['ca']
};
