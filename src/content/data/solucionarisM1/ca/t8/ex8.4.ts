import type { Solution } from '../../../solutions';

export const ex8_4: Solution = {
  id: 'M1-T8-Ex8.4',
  title: 'Exercici 8.4: Valors i vectors propis en l\'espai de matrius',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Trobeu els valors i vectors propis de l'endomorfisme $f: \\mathcal{M}_2(\\mathbb{R}) \\to \\mathcal{M}_2(\\mathbb{R})$ definit per $f\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix} = \\begin{pmatrix} 2c & a+c \\\\ b-2c & d \\end{pmatrix}$.`,
  content: `
### 1) Matriu associada
Considerem la base canònica de $\\mathcal{M}_2(\\mathbb{R})$:

$\\mathcal{C} = \\left\\{ E_{11}=\\begin{pmatrix} 1 & 0 \\\\ 0 & 0 \\end{pmatrix}, E_{12}=\\begin{pmatrix} 0 & 1 \\\\ 0 & 0 \\end{pmatrix}, E_{21}=\\begin{pmatrix} 0 & 0 \\\\ 1 & 0 \\end{pmatrix}, E_{22}=\\begin{pmatrix} 0 & 0 \\\\ 0 & 1 \\end{pmatrix} \\right\\}$

Calculem les imatges:
- $f(E_{11}) = \\begin{pmatrix} 0 & 1 \\\\ 0 & 0 \\end{pmatrix} = (0, 1, 0, 0)_\\mathcal{C}$
- $f(E_{12}) = \\begin{pmatrix} 0 & 0 \\\\ 1 & 0 \\end{pmatrix} = (0, 0, 1, 0)_\\mathcal{C}$
- $f(E_{21}) = \\begin{pmatrix} 2 & 1 \\\\ -2 & 0 \\end{pmatrix} = (2, 1, -2, 0)_\\mathcal{C}$
- $f(E_{22}) = \\begin{pmatrix} 0 & 0 \\\\ 0 & 1 \\end{pmatrix} = (0, 0, 0, 1)_\\mathcal{C}$

La matriu associada és:
$A = \\begin{pmatrix} 0 & 0 & 2 & 0 \\\\ 1 & 0 & 1 & 0 \\\\ 0 & 1 & -2 & 0 \\\\ 0 & 0 & 0 & 1 \\end{pmatrix}$

### 2) Polinomi característic i valors propis
El determinant és fàcil de calcular per l'última fila/columna:

$p(\\lambda) = (1-\\lambda) \\begin{vmatrix} -\\lambda & 0 & 2 \\\\ 1 & -\\lambda & 1 \\\\ 0 & 1 & -2-\\lambda \\end{vmatrix} = (1-\\lambda) [ -\\lambda(\\lambda^2 + 2\\lambda - 1) + 2 ]$

$p(\\lambda) = (1-\\lambda) [ -\\lambda^3 - 2\\lambda^2 + \\lambda + 2 ]$

Busquem les arrels del polinomi de grau 3. Provant $\\lambda=1$: $-1-2+1+2=0$.

Dividint per $(\\lambda-1)$: $-(\\lambda-1)(\\lambda^2 + 3\\lambda + 2) = -(\\lambda-1)(\\lambda+1)(\\lambda+2)$.

Així doncs:
$p(\\lambda) = (\\lambda-1)^2(\\lambda+1)(\\lambda+2)$

**Valors propis:**
- $\\lambda_1 = 1$ ($m_a = 2$)
- $\\lambda_2 = -1$ ($m_a = 1$)
- $\\lambda_3 = -2$ ($m_a = 1$)

### 3) Subespais propis
- **Per $\\lambda = 1$:** $\\dim(E_1) = 4 - \\text{rang}(A-I) = 4 - \\text{rang} \\begin{pmatrix} -1 & 0 & 2 & 0 \\\\ 1 & -1 & 1 & 0 \\\\ 0 & 1 & -3 & 0 \\\\ 0 & 0 & 0 & 0 \\end{pmatrix} = 4 - 2 = 2$.
  S'obtenen els vectors $v_1 = (0, 0, 0, 1) \\equiv \\begin{pmatrix} 0 & 0 \\\\ 0 & 1 \\end{pmatrix}$ i $v_2 = (2, 3, 1, 0) \\equiv \\begin{pmatrix} 2 & 3 \\\\ 1 & 0 \\end{pmatrix}$.
- **Per $\\lambda = -1$:** $\\ker(A+I) \\implies v_3 = (-2, 1, 1, 0) \\equiv \\begin{pmatrix} -2 & 1 \\\\ 1 & 0 \\end{pmatrix}$.
- **Per $\\lambda = -2$:** $\\ker(A+2I) \\implies v_4 = (-1, 0, 1, 0) \\equiv \\begin{pmatrix} -1 & 0 \\\\ 1 & 0 \\end{pmatrix}$.

### 4) Diagonalització
Com que $m_g(\\lambda) = m_a(\\lambda)$ per a tots els valors propis, l'endomorfisme és **diagonalitzable**.

**Base de diagonalització:**
$B = \\left\\{ \\begin{pmatrix} 0 & 0 \\\\ 0 & 1 \\end{pmatrix}, \\begin{pmatrix} 2 & 3 \\\\ 1 & 0 \\end{pmatrix}, \\begin{pmatrix} -2 & 1 \\\\ 1 & 0 \\end{pmatrix}, \\begin{pmatrix} -1 & 0 \\\\ 1 & 0 \\end{pmatrix} \\right\\}$

**Matriu diagonal:**
$D = \\begin{pmatrix} 1 & 0 & 0 & 0 \\\\ 0 & 1 & 0 & 0 \\\\ 0 & 0 & -1 & 0 \\\\ 0 & 0 & 0 & -2 \\end{pmatrix}$
`,
  availableLanguages: ['ca']
};
