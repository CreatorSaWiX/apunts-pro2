import type { Solution } from '../../../solutions';

export const ex8_3: Solution = {
  id: 'M1-T8-Ex8.3',
  title: 'Exercici 8.3: Valors i vectors propis d\'endomorfismes',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Trobeu els valors i vectors propis dels endomorfismes següents. En cas que siguin diagonalitzables, doneu una base en què diagonalitzin i la matriu diagonal associada.`,
  content: `
### 1) $f: \\mathbb{R}^3 \\to \\mathbb{R}^3$, on $f(x, y, z) = (2x + 4z, 3x - 4y + 12z, x - 2y + 5z)$

La matriu de l'endomorfisme en la base canònica és:
$A = \\begin{pmatrix} 2 & 0 & 4 \\\\ 3 & -4 & 12 \\\\ 1 & -2 & 5 \\end{pmatrix}$

**Polinomi característic:**
$p(\\lambda) = \\det(A - \\lambda I) = \\begin{vmatrix} 2-\\lambda & 0 & 4 \\\\ 3 & -4-\\lambda & 12 \\\\ 1 & -2 & 5-\\lambda \\end{vmatrix} = (2-\\lambda)((-4-\\lambda)(5-\\lambda) + 24) + 4(-6 - (-4-\\lambda))$
$p(\\lambda) = (2-\\lambda)(\\lambda^2 - \\lambda + 4) + 4(\\lambda - 2) = (2-\\lambda)(\\lambda^2 - \\lambda + 4 - 4) = (2-\\lambda)(\\lambda^2 - \\lambda) = -\\lambda(\\lambda-1)(\\lambda-2)$

**Valors propis:** $\\lambda_1 = 0, \\lambda_2 = 1, \\lambda_3 = 2$ (tots amb $m_a=1$).
Com que hi ha 3 valors propis distints per a un espai de dimensió 3, l'endomorfisme és **diagonalitzable**.

**Subespais propis:**
- **Per $\\lambda = 0$:** $\\ker(A) \\implies \\begin{cases} 2x + 4z = 0 \\\\ 3x - 4y + 12z = 0 \\end{cases} \\implies x = -2z, y = \\frac{3}{2}z$. Triem $v_1 = (-4, 3, 2)$.
- **Per $\\lambda = 1$:** $\\ker(A - I) \\implies \\begin{cases} x + 4z = 0 \\\\ 3x - 5y + 12z = 0 \\end{cases} \\implies x = -4z, y = 0$. Triem $v_2 = (-4, 0, 1)$.
- **Per $\\lambda = 2$:** $\\ker(A - 2I) \\implies \\begin{cases} 4z = 0 \\\\ 3x - 6y + 12z = 0 \\end{cases} \\implies z = 0, x = 2y$. Triem $v_3 = (2, 1, 0)$.

**Resultat:**
- **Base:** $B = \\{(-4, 3, 2), (-4, 0, 1), (2, 1, 0)\\}$.
- **Matriu diagonal:** $D = \\begin{pmatrix} 0 & 0 & 0 \\\\ 0 & 1 & 0 \\\\ 0 & 0 & 2 \\end{pmatrix}$.

---

### 2) $f: P_2(\\mathbb{R}) \\to P_2(\\mathbb{R})$, on $f(a + bx + cx^2) = (5a + 6b + 2c) - (b + 8c)x + (a - 2c)x^2$

Considerem la base canònica $\\mathcal{C} = \\{1, x, x^2\\}$. La matriu associada és:
$A = \\begin{pmatrix} 5 & 6 & 2 \\\\ 0 & -1 & -8 \\\\ 1 & 0 & -2 \\end{pmatrix}$

**Polinomi característic:**
$p(\\lambda) = \\det(A - \\lambda I) = \\begin{vmatrix} 5-\\lambda & 6 & 2 \\\\ 0 & -1-\\lambda & -8 \\\\ 1 & 0 & -2-\\lambda \\end{vmatrix} = (5-\\lambda)((-1-\\lambda)(-2-\\lambda)) + 1(-48 - 2(-1-\\lambda))$
$p(\\lambda) = -\\lambda^3 + 2\\lambda^2 + 15\\lambda - 36 = -(\\lambda - 3)^2(\\lambda + 4)$

**Valors propis:** $\\lambda_1 = 3$ ($m_a=2$), $\\lambda_2 = -4$ ($m_a=1$).

**Subespais propis:**
- **Per $\\lambda = 3$:** $\\ker(A - 3I) \\implies \\begin{pmatrix} 2 & 6 & 2 \\\\ 0 & -4 & -8 \\\\ 1 & 0 & -5 \\end{pmatrix} \\begin{pmatrix} a \\\\ b \\\\ c \\end{pmatrix} = 0 \\implies a=5c, b=-2c$.
  $E_3 = \\langle (5, -2, 1) \\rangle \\implies m_g(3) = 1$.
Com que $m_g(3) = 1 < m_a(3) = 2$, l'endomorfisme **no és diagonalitzable**.

---

### 3) $f: P_3(\\mathbb{R}) \\to P_3(\\mathbb{R})$, on $f(a + bx + cx^2 + dx^3) = (a+b+c+d) + 2(b+c+d)x + 3(c+d)x^2 + 4dx^3$

En la base $\\mathcal{C} = \\{1, x, x^2, x^3\\}$, la matriu és triangular superior:
$A = \\begin{pmatrix} 1 & 1 & 1 & 1 \\\\ 0 & 2 & 2 & 2 \\\\ 0 & 0 & 3 & 3 \\\\ 0 & 0 & 0 & 4 \\end{pmatrix}$

**Valors propis:** Com que la matriu és triangular, els valors propis són els elements de la diagonal: $\\lambda_1 = 1, \\lambda_2 = 2, \\lambda_3 = 3, \\lambda_4 = 4$.
Tots tenen $m_a=1$, per tant és **diagonalitzable**.

**Subespais propis:**
- **Per $\\lambda = 1$:** $v_1 = (1, 0, 0, 0) \\equiv 1$.
- **Per $\\lambda = 2$:** $x-y=0, z=0, w=0 \\implies v_2 = (1, 1, 0, 0) \\equiv 1 + x$.
- **Per $\\lambda = 3$:** $-2x+y+z=0, -y+2z=0, w=0 \\implies v_3 = (3, 4, 2, 0) \\equiv 3 + 4x + 2x^2$.
- **Per $\\lambda = 4$:** $-3x+y+z+w=0, -2y+2z+2w=0, -z+3w=0 \\implies v_4 = (8, 12, 9, 3) \\equiv 8 + 12x + 9x^2 + 3x^3$.

**Resultat:**
- **Base:** $B = \\{1, 1+x, 3+4x+2x^2, 8+12x+9x^2+3x^3\\}$.
- **Matriu diagonal:** $D = \\begin{pmatrix} 1 & 0 & 0 & 0 \\\\ 0 & 2 & 0 & 0 \\\\ 0 & 0 & 3 & 0 \\\\ 0 & 0 & 0 & 4 \\end{pmatrix}$.
`,
  availableLanguages: ['ca']
};
