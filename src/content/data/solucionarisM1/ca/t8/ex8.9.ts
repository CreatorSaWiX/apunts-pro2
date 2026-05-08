import type { Solution } from '../../../solutions';

export const ex8_9: Solution = {
  id: 'M1-T8-Ex8.9',
  title: 'Exercici 8.9: Existència i determinació d\'endomorfismes',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Raoneu si existeix algun endomorfisme $f: \\mathbb{R}^3 \\to \\mathbb{R}^3$ que verifiqui les condicions que s'especifiquen a continuació. En cas que existeixi, determineu-lo, calculeu el seu polinomi característic i digueu si és o no diagonalitzable.`,
  content: `
### 1) $v_1 = (1, 2, 1), v_2 = (2, 0, 1)$ són vectors propis de $\\lambda = 1$, i $v_3 = (1, -1, 0)$ és vector propi de $\\lambda = 0$.

- **Existència:** El conjunt $B = \\{v_1, v_2, v_3\\}$ és una base de $\\mathbb{R}^3$ ja que el determinant de la matriu de components és $\\det \\begin{pmatrix} 1 & 2 & 1 \\\\ 2 & 0 & 1 \\\\ 1 & -1 & 0 \\end{pmatrix} = 1 \\neq 0$. Com que tenim les imatges d'una base definides ($f(v_1)=v_1, f(v_2)=v_2, f(v_3)=\\vec{0}$), l'endomorfisme **existeix i és únic**.
- **Polinomi característic:** Els valors propis són $\\lambda = 1$ (doble) i $\\lambda = 0$ (simple).
  $p(\\lambda) = -\\lambda(\\lambda - 1)^2$
- **Diagonalitzabilitat:** És **diagonalitzable** per definició, ja que hem trobat una base de vectors propis.

---

### 2) $\\ker f = \\{ (x, y, z) \\in \\mathbb{R}^3 \\mid 5x + y - 2z = 0 \\}$ i $v_3 = (1, 1, 1)$ és vector propi de $\\lambda = -1/2$.

- **Existència:** El nucli és el subespai propi $E_0$. Té dimensió $3-1=2$. El vector $v_3$ no pertany al nucli ja que $5(1)+1-2(1) = 4 \\neq 0$. Per tant, $\\mathbb{R}^3 = E_0 \\oplus E_{-1/2}$. L'endomorfisme **existeix**.
- **Polinomi característic:** $\\lambda = 0$ (doble) i $\\lambda = -1/2$ (simple).
  $p(\\lambda) = -\\lambda^2(\\lambda + 1/2)$
- **Diagonalitzabilitat:** És **diagonalitzable** ja que la suma de les dimensions dels subespais propis és 3.

---

### 3) $f(1, 0, 0) = (2, 0, 0), f(1, 1, 0) = (1, 1, 0)$ i $f(0, 0, 1) = (0, 1, 1)$.

- **Existència:** Les imatges dels vectors $(1,0,0), (1,1,0), (0,0,1)$ defineixen l'endomorfisme, ja que formen una base. **Existeix**.
- **Determinació (Matriu en base canònica):**
  - $f(e_1) = (2, 0, 0)$
  - $f(e_2) = f(e_1+e_2) - f(e_1) = (1, 1, 0) - (2, 0, 0) = (-1, 1, 0)$
  - $f(e_3) = (0, 1, 1)$
  $A = \\begin{pmatrix} 2 & -1 & 0 \\\\ 0 & 1 & 1 \\\\ 0 & 0 & 1 \\end{pmatrix}$
- **Polinomi característic:** Matriu triangular $\\implies p(\\lambda) = -(\\lambda - 2)(\\lambda - 1)^2$.
- **Diagonalitzabilitat:** Per $\\lambda = 1$ ($m_a=2$), el rang de $(A-I) = \\begin{pmatrix} 1 & -1 & 0 \\\\ 0 & 0 & 1 \\\\ 0 & 0 & 0 \\end{pmatrix}$ és 2.
  $m_g(1) = 3 - 2 = 1 < m_a(1)$. **No és diagonalitzable**.

---

### 4) $\\ker f = \\langle (0, 0, 1) \\rangle$ i $F = \\{ (x, y, z) \\in \\mathbb{R}^3 \\mid x + y = z \\}$ és el subespai de vectors propis de $\\lambda = 2$.

- **Existència:** $\\ker f = E_0$ (dim 1). $F = E_2$ (dim 2). Comprovem si la suma és directa: $(0,0,1)$ compleix $x+y=z$? $0+0=1$ (Fals). Per tant, $E_0 \\cap E_2 = \\{\\vec{0}\\}$ i $\\mathbb{R}^3 = E_0 \\oplus E_2$. L'endomorfisme **existeix**.
- **Polinomi característic:** $\\lambda = 0$ (simple) i $\\lambda = 2$ (doble).
  $p(\\lambda) = -\\lambda(\\lambda - 2)^2$
- **Diagonalitzabilitat:** És **diagonalitzable** per construcció (existeix base de vectors propis).
`,
  availableLanguages: ['ca']
};
