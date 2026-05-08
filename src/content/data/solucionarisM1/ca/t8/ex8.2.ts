import type { Solution } from '../../../solutions';

export const ex8_2: Solution = {
  id: 'M1-T8-Ex8.2',
  title: 'Exercici 8.2: Base de vectors propis de la matriu d\'uns',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Sigui $J$ la matriu de $\\mathcal{M}_5(\\mathbb{R})$ formada íntegrament per uns. Trobeu una base de $\\mathbb{R}^5$ que estigui formada per un vector propi de $J$ de valor propi $5$ i per quatre vectors propis de valor propi $0$.`,
  content: `
### 1) Estructura de la matriu $J$

La matriu $J \\in \\mathcal{M}_5(\\mathbb{R})$ és:
$J = \\begin{pmatrix} 1 & 1 & 1 & 1 & 1 \\\\ 1 & 1 & 1 & 1 & 1 \\\\ 1 & 1 & 1 & 1 & 1 \\\\ 1 & 1 & 1 & 1 & 1 \\\\ 1 & 1 & 1 & 1 & 1 \\end{pmatrix}$

### 2) Vector propi de valor propi $\\lambda = 5$

Busquem un vector $v_1$ tal que $Jv_1 = 5v_1$.
Si triem $v_1 = \\begin{pmatrix} 1 \\\\ 1 \\\\ 1 \\\\ 1 \\\\ 1 \\end{pmatrix}$, tenim:
$J \\begin{pmatrix} 1 \\\\ 1 \\\\ 1 \\\\ 1 \\\\ 1 \\end{pmatrix} = \\begin{pmatrix} 1+1+1+1+1 \\\\ 1+1+1+1+1 \\\\ 1+1+1+1+1 \\\\ 1+1+1+1+1 \\\\ 1+1+1+1+1 \\end{pmatrix} = \\begin{pmatrix} 5 \\\\ 5 \\\\ 5 \\\\ 5 \\\\ 5 \\end{pmatrix} = 5 \\begin{pmatrix} 1 \\\\ 1 \\\\ 1 \\\\ 1 \\\\ 1 \\end{pmatrix}$

Així doncs, **$v_1 = (1, 1, 1, 1, 1)^T$** és un vector propi de valor propi $5$.

### 3) Vectors propis de valor propi $\\lambda = 0$

Busquem vectors $v$ tals que $Jv = 0v = 0$. Això equival a resoldre el sistema:
$\\begin{pmatrix} 1 & 1 & 1 & 1 & 1 \\\\ 1 & 1 & 1 & 1 & 1 \\\\ 1 & 1 & 1 & 1 & 1 \\\\ 1 & 1 & 1 & 1 & 1 \\\\ 1 & 1 & 1 & 1 & 1 \\end{pmatrix} \\begin{pmatrix} x_1 \\\\ x_2 \\\\ x_3 \\\\ x_4 \\\\ x_5 \\end{pmatrix} = \\begin{pmatrix} 0 \\\\ 0 \\\\ 0 \\\\ 0 \\\\ 0 \\end{pmatrix} \\implies x_1 + x_2 + x_3 + x_4 + x_5 = 0$

Aquesta és l'equació d'un subespai de dimensió $4$ (l'hiperplà ortogonal al vector d'uns). En busquem una base de $4$ vectors linealment independents:
- $v_2 = \\mathbf{\\begin{pmatrix} 1 \\\\ -1 \\\\ 0 \\\\ 0 \\\\ 0 \\end{pmatrix}}$
- $v_3 = \\mathbf{\\begin{pmatrix} 1 \\\\ 0 \\\\ -1 \\\\ 0 \\\\ 0 \\end{pmatrix}}$
- $v_4 = \\mathbf{\\begin{pmatrix} 1 \\\\ 0 \\\\ 0 \\\\ -1 \\\\ 0 \\end{pmatrix}}$
- $v_5 = \\mathbf{\\begin{pmatrix} 1 \\\\ 0 \\\\ 0 \\\\ 0 \\\\ -1 \\end{pmatrix}}$

### 4) Base de $\\mathbb{R}^5$

El conjunt $B = \\{v_1, v_2, v_3, v_4, v_5\\}$ forma una base de $\\mathbb{R}^5$ ja que són $5$ vectors linealment independents de $\\mathbb{R}^5$ (pertanyen a subespais propis associats a valors propis diferents, i els del subespai de $\\lambda=0$ són LI entre ells).

**Base de $\\mathbb{R}^5$:**
$B = \\left\\{ \\begin{pmatrix} 1 \\\\ 1 \\\\ 1 \\\\ 1 \\\\ 1 \\end{pmatrix}, \\begin{pmatrix} 1 \\\\ -1 \\\\ 0 \\\\ 0 \\\\ 0 \\end{pmatrix}, \\begin{pmatrix} 1 \\\\ 0 \\\\ -1 \\\\ 0 \\\\ 0 \\end{pmatrix}, \\begin{pmatrix} 1 \\\\ 0 \\\\ 0 \\\\ -1 \\\\ 0 \\end{pmatrix}, \\begin{pmatrix} 1 \\\\ 0 \\\\ 0 \\\\ 0 \\\\ -1 \\end{pmatrix} \\right\\}$
`,
  availableLanguages: ['ca']
};
