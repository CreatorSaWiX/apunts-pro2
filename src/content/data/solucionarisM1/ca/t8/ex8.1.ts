import type { Solution } from '../../../solutions';

export const ex8_1: Solution = {
  id: 'M1-T8-Ex8.1',
  title: 'Exercici 8.1: Diagonalització de matrius',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Calculeu el polinomi característic, els valors propis i els subespais de vectors propis de les matrius següents. Determineu quines són diagonalitzables i doneu, quan sigui possible, una base en la que diagonalitzin i la matriu diagonal associada.`,
  content: `
### Resum de conceptes
Una matriu $A \\in \\mathcal{M}_n(\\mathbb{K})$ és **diagonalitzable** si i només si:
1. El polinomi característic $p(\\lambda)$ descompon completament en factors lineals en $\\mathbb{K}$.
2. Per a cada valor propi $\\lambda_i$, la seva multiplicitat algebraica $m_a(\\lambda_i)$ coincideix amb la seva multiplicitat geomètrica $m_g(\\lambda_i) = \\dim(\\ker(A - \\lambda_i I))$.

---

### 1) $A = \\begin{pmatrix} 1 & 2 \\\\ 3 & 2 \\end{pmatrix}$

- **Polinomi característic**: $p(\\lambda) = \\det(A - \\lambda I) = (1-\\lambda)(2-\\lambda) - 6 = \\lambda^2 - 3\\lambda - 4 = (\\lambda - 4)(\\lambda + 1)$.
- **Valors propis**: $\\lambda_1 = 4$, $\\lambda_2 = -1$.
- **Subespais propis**:
  - $E_4 = \\ker(A - 4I) = \\ker \\begin{pmatrix} -3 & 2 \\\\ 3 & -2 \\end{pmatrix} = \\langle (2, 3) \\rangle$.
  - $E_{-1} = \\ker(A + I) = \\ker \\begin{pmatrix} 2 & 2 \\\\ 3 & 3 \\end{pmatrix} = \\langle (1, -1) \\rangle$.
- **Diagonalització**: És diagonalitzable (2 valors propis distints per $n=2$).
  - **Base**: $B = \\{(2, 3), (1, -1)\\}$.
  - **Matriu diagonal**: $D = \\begin{pmatrix} 4 & 0 \\\\ 0 & -1 \\end{pmatrix}$.

---

### 2) $A = \\begin{pmatrix} 1 & 0 \\\\ 2 & -1 \\end{pmatrix}$

- **Polinomi característic**: $p(\\lambda) = (1-\\lambda)(-1-\\lambda)$.
- **Valors propis**: $\\lambda_1 = 1$, $\\lambda_2 = -1$.
- **Subespais propis**:
  - $E_1 = \\ker \\begin{pmatrix} 0 & 0 \\\\ 2 & -2 \\end{pmatrix} = \\langle (1, 1) \\rangle$.
  - $E_{-1} = \\ker \\begin{pmatrix} 2 & 0 \\\\ 2 & 0 \\end{pmatrix} = \\langle (0, 1) \\rangle$.
- **Diagonalització**: És diagonalitzable.
  - **Base**: $B = \\{(1, 1), (0, 1)\\}$.
  - **Matriu diagonal**: $D = \\begin{pmatrix} 1 & 0 \\\\ 0 & -1 \\end{pmatrix}$.

---

### 3) $A = \\begin{pmatrix} 3 & 1 & 1 \\\\ 2 & 4 & 2 \\\\ 1 & 1 & 3 \\end{pmatrix}$

- **Polinomi característic**: $p(\\lambda) = -(\\lambda-2)^2(\\lambda-6)$.
- **Valors propis**: $\\lambda_1 = 2$ ($m_a=2$), $\\lambda_2 = 6$ ($m_a=1$).
- **Subespais propis**:
  - $E_2 = \\ker \\begin{pmatrix} 1 & 1 & 1 \\\\ 2 & 2 & 2 \\\\ 1 & 1 & 1 \\end{pmatrix} = \\langle (-1, 1, 0), (-1, 0, 1) \\rangle$. ($m_g=2$)
  - $E_6 = \\ker \\begin{pmatrix} -3 & 1 & 1 \\\\ 2 & -2 & 2 \\\\ 1 & 1 & -3 \\end{pmatrix} = \\langle (1, 2, 1) \\rangle$. ($m_g=1$)
- **Diagonalització**: És diagonalitzable ($m_a = m_g$ per a tots els $\\lambda$).
  - **Base**: $B = \\{(-1, 1, 0), (-1, 0, 1), (1, 2, 1)\\}$.
  - **Matriu diagonal**: $D = \\begin{pmatrix} 2 & 0 & 0 \\\\ 0 & 2 & 0 \\\\ 0 & 0 & 6 \\end{pmatrix}$.

---

### 4) $A = \\begin{pmatrix} 1 & 1 & 1 \\\\ 0 & 1 & 1 \\\\ 0 & 0 & 1 \\end{pmatrix}$

- **Polinomi característic**: $p(\\lambda) = (1-\\lambda)^3$.
- **Valors propis**: $\\lambda = 1$ ($m_a=3$).
- **Subespais propis**:
  - $E_1 = \\ker \\begin{pmatrix} 0 & 1 & 1 \\\\ 0 & 0 & 1 \\\\ 0 & 0 & 0 \\end{pmatrix} = \\langle (1, 0, 0) \\rangle$. ($m_g=1$)
- **Diagonalització**: **No és diagonalitzable** perquè $m_g(1) = 1 < m_a(1) = 3$.

---

### 5) $A = \\begin{pmatrix} 1 & -3 & 3 \\\\ 3 & -5 & 3 \\\\ 6 & -6 & 4 \\end{pmatrix}$

- **Polinomi característic**: $p(\\lambda) = -(\\lambda+2)^2(\\lambda-4)$.
- **Valors propis**: $\\lambda_1 = -2$ ($m_a=2$), $\\lambda_2 = 4$ ($m_a=1$).
- **Subespais propis**:
  - $E_{-2} = \\ker \\begin{pmatrix} 3 & -3 & 3 \\\\ 3 & -3 & 3 \\\\ 6 & -6 & 6 \\end{pmatrix} = \\langle (1, 1, 0), (-1, 0, 1) \\rangle$. ($m_g=2$)
  - $E_4 = \\ker \\begin{pmatrix} -3 & -3 & 3 \\\\ 3 & -9 & 3 \\\\ 6 & -6 & 0 \\end{pmatrix} = \\langle (1, 1, 2) \\rangle$. ($m_g=1$)
- **Diagonalització**: És diagonalitzable.
  - **Base**: $B = \\{(1, 1, 0), (-1, 0, 1), (1, 1, 2)\\}$.
  - **Matriu diagonal**: $D = \\begin{pmatrix} -2 & 0 & 0 \\\\ 0 & -2 & 0 \\\\ 0 & 0 & 4 \\end{pmatrix}$.

---

### 6) $A = \\begin{pmatrix} 0 & 1 & 0 \\\\ -4 & 4 & 0 \\\\ -2 & 1 & 2 \\end{pmatrix}$

- **Polinomi característic**: $p(\\lambda) = -(\\lambda-2)^3$.
- **Valors propis**: $\\lambda = 2$ ($m_a=3$).
- **Subespais propis**:
  - $E_2 = \\ker \\begin{pmatrix} -2 & 1 & 0 \\\\ -4 & 2 & 0 \\\\ -2 & 1 & 0 \\end{pmatrix} = \\langle (1, 2, 0), (0, 0, 1) \\rangle$. ($m_g=2$)
- **Diagonalització**: **No és diagonalitzable** perquè $m_g(2) = 2 < m_a(2) = 3$.

---

### 7) $A = \\begin{pmatrix} 1 & -1 & -1 \\\\ 1 & -1 & 0 \\\\ 1 & 0 & -1 \\end{pmatrix}$

- **Polinomi característic**: $p(\\lambda) = -(\\lambda+1)(\\lambda^2 + 1)$.
- **Valors propis**: $\\lambda_1 = -1$ (real), $\\lambda_{2,3} = \\pm i$ (complexos).
- **Diagonalització**: **No és diagonalitzable** sobre $\\mathbb{R}$ perquè el polinomi característic no descompon completament en factors lineals reals.

---

### 8) $A = \\begin{pmatrix} 0 & 1 & 0 & 0 \\\\ 0 & 0 & 1 & 0 \\\\ 0 & 0 & 0 & 1 \\\\ -4 & 12 & -13 & 6 \\end{pmatrix}$

- **Polinomi característic**: $p(\\lambda) = (\\lambda-1)^2(\\lambda-2)^2$.
- **Valors propis**: $\\lambda_1 = 1$ ($m_a=2$), $\\lambda_2 = 2$ ($m_a=2$).
- **Subespais propis**:
  - $E_1 = \\ker(A - I) = \\langle (1, 1, 1, 1) \\rangle$. ($m_g=1$)
  - $E_2 = \\ker(A - 2I) = \\langle (1, 2, 4, 8) \\rangle$. ($m_g=1$)
- **Diagonalització**: **No és diagonalitzable** perquè $m_g < m_a$ per a ambdós valors propis.

---

### 9) $A = \\begin{pmatrix} -2 & 0 & 0 & 4 \\\\ 2 & 1 & 0 & 2 \\\\ 3 & 0 & -1 & 3 \\\\ 4 & 0 & 0 & -2 \\end{pmatrix}$

- **Polinomi característic**: $p(\\lambda) = (\\lambda-1)(\\lambda+1)(\\lambda-2)(\\lambda+6)$.
- **Valors propis**: $\\lambda_1 = 1, \\lambda_2 = -1, \\lambda_3 = 2, \\lambda_4 = -6$.
- **Subespais propis**:
  - $E_1 = \\langle (0, 1, 0, 0) \\rangle$.
  - $E_{-1} = \\langle (0, 0, 1, 0) \\rangle$.
  - $E_2 = \\langle (1, 4, 2, 1) \\rangle$.
  - $E_{-6} = \\langle (1, 0, 0, -1) \\rangle$.
- **Diagonalització**: És diagonalitzable (4 valors propis distints per $n=4$).
  - **Base**: $B = \\{(0, 1, 0, 0), (0, 0, 1, 0), (1, 4, 2, 1), (1, 0, 0, -1)\\}$.
  - **Matriu diagonal**: $D = \\text{diag}(1, -1, 2, -6)$.
`,
  availableLanguages: ['ca']
};
