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

### Polinomi característic:
  $$
  \\begin{aligned}
  p(\\lambda) &= \\det(A - \\lambda I) = \\begin{vmatrix} 1-\\lambda & 2 \\\\ 3 & 2-\\lambda \\end{vmatrix} = (1-\\lambda)(2-\\lambda) - 6 \\\\
  &= \\lambda^2 - 3\\lambda + 2 - 6 = \\lambda^2 - 3\\lambda - 4 = (\\lambda - 4)(\\lambda + 1)
  \\end{aligned}
  $$
### Valors propis: $\\lambda_1 = 4$ ($m_a=1$), $\\lambda_2 = -1$ ($m_a=1$).

### Subespais propis:
  * **Per a $\\lambda = 4$**:
    $$
    A - 4I = \\begin{pmatrix} -3 & 2 \\\\ 3 & -2 \\end{pmatrix} \\xrightarrow{F_2 \\leftarrow F_2 + F_1} \\begin{pmatrix} -3 & 2 \\\\ 0 & 0 \\end{pmatrix}
    $$
    $$
    -3x + 2y = 0 \\implies 3x = 2y \\implies E_4 = \\langle (2, 3) \\rangle \\quad (m_g = 1)
    $$
  * **Per a $\\lambda = -1$**:
    $$
    A + I = \\begin{pmatrix} 2 & 2 \\\\ 3 & 3 \\end{pmatrix} \\xrightarrow{\\substack{F_1 \\leftarrow \\frac{1}{2}F_1 \\\\ F_2 \\leftarrow F_2 - \\frac{3}{2}F_1}} \\begin{pmatrix} 1 & 1 \\\\ 0 & 0 \\end{pmatrix}
    $$
    $$
    x + y = 0 \\implies x = -y \\implies E_{-1} = \\langle (1, -1) \\rangle \\quad (m_g = 1)
    $$

### Diagonalització: És diagonalitzable.
  * **Base**: $B = \\{(2, 3), (1, -1)\\}$.
  * **Matriu diagonal**: $D = \\begin{pmatrix} 4 & 0 \\\\ 0 & -1 \\end{pmatrix}$.
  * **Matrius de canvi de base**: $P = \\begin{pmatrix} 2 & 1 \\\\ 3 & -1 \\end{pmatrix}$, $P^{-1} = \\frac{1}{5} \\begin{pmatrix} 1 & 1 \\\\ 3 & -2 \\end{pmatrix}$.

---

### 2) $A = \\begin{pmatrix} 1 & 0 \\\\ 2 & -1 \\end{pmatrix}$

### Polinomi característic:
  $$
  p(\\lambda) = \\det(A - \\lambda I) = \\begin{vmatrix} 1-\\lambda & 0 \\\\ 2 & -1-\\lambda \\end{vmatrix} = (1-\\lambda)(-1-\\lambda) = -(\\lambda-1)(\\lambda+1)
  $$

### Valors propis: $\\lambda_1 = 1$ ($m_a=1$), $\\lambda_2 = -1$ ($m_a=1$).

### Subespais propis:
  * **Per a $\\lambda = 1$**:
    $$
    A - I = \\begin{pmatrix} 0 & 0 \\\\ 2 & -2 \\end{pmatrix} \\xrightarrow{\\text{reordenar}} \\begin{pmatrix} 2 & -2 \\\\ 0 & 0 \\end{pmatrix} \\xrightarrow{F_1 \\leftarrow \\frac{1}{2}F_1} \\begin{pmatrix} 1 & -1 \\\\ 0 & 0 \\end{pmatrix}
    $$
    $$
    x - y = 0 \\implies x = y \\implies E_1 = \\langle (1, 1) \\rangle \\quad (m_g = 1)
    $$
  * **Per a $\\lambda = -1$**:
    $$
    A + I = \\begin{pmatrix} 2 & 0 \\\\ 2 & 0 \\end{pmatrix} \\xrightarrow{F_2 \\leftarrow F_2 - F_1} \\begin{pmatrix} 2 & 0 \\\\ 0 & 0 \\end{pmatrix} \\xrightarrow{F_1 \\leftarrow \\frac{1}{2}F_1} \\begin{pmatrix} 1 & 0 \\\\ 0 & 0 \\end{pmatrix}
    $$
    $$
    x = 0 \\implies E_{-1} = \\langle (0, 1) \\rangle \\quad (m_g = 1)
    $$

### Diagonalització: És diagonalitzable.
  * **Base**: $B = \\{(1, 1), (0, 1)\\}$.
  * **Matriu diagonal**: $D = \\begin{pmatrix} 1 & 0 \\\\ 0 & -1 \\end{pmatrix}$.
  * **Matrius de canvi de base**: $P = \\begin{pmatrix} 1 & 0 \\\\ 1 & 1 \\end{pmatrix}$, $P^{-1} = \\begin{pmatrix} 1 & 0 \\\\ -1 & 1 \\end{pmatrix}$.

---

### 3) $A = \\begin{pmatrix} 3 & 1 & 1 \\\\ 2 & 4 & 2 \\\\ 1 & 1 & 3 \\end{pmatrix}$

### Polinomi característic:
  $$
  \\begin{aligned}
  p(\\lambda) &= \\det(A - \\lambda I) = \\begin{vmatrix} 3-\\lambda & 1 & 1 \\\\ 2 & 4-\\lambda & 2 \\\\ 1 & 1 & 3-\\lambda \\end{vmatrix} \\xrightarrow{C_1 \\leftarrow C_1 - C_3} \\begin{vmatrix} 2-\\lambda & 1 & 1 \\\\ 0 & 4-\\lambda & 2 \\\\ \\lambda-2 & 1 & 3-\\lambda \\end{vmatrix} \\\\ \\\\
  &\\xrightarrow{F_3 \\leftarrow F_3 + F_1} \\begin{vmatrix} 2-\\lambda & 1 & 1 \\\\ 0 & 4-\\lambda & 2 \\\\ 0 & 2 & 4-\\lambda \\end{vmatrix} = (2-\\lambda) \\begin{vmatrix} 4-\\lambda & 2 \\\\ 2 & 4-\\lambda \\end{vmatrix} \\\\ \\\\
  &= (2-\\lambda) \\left[ (4-\\lambda)^2 - 4 \\right] = (2-\\lambda) (\\lambda^2 - 8\\lambda + 12) = -(\\lambda-2)^2(\\lambda-6)
  \\end{aligned}
  $$

### Valors propis: $\\lambda_1 = 2$ ($m_a=2$), $\\lambda_2 = 6$ ($m_a=1$).

### Subespais propis:
  * **Per a $\\lambda = 2$**:
    $$
    A - 2I = \\begin{pmatrix} 1 & 1 & 1 \\\\ 2 & 2 & 2 \\\\ 1 & 1 & 1 \\end{pmatrix} \\xrightarrow{\\substack{F_2 \\leftarrow F_2 - 2F_1 \\\\ F_3 \\leftarrow F_3 - F_1}} \\begin{pmatrix} 1 & 1 & 1 \\\\ 0 & 0 & 0 \\\\ 0 & 0 & 0 \\end{pmatrix}
    $$
    $$
    x + y + z = 0 \\implies x = -y - z \\implies E_2 = \\langle (-1, 1, 0), (-1, 0, 1) \\rangle \\quad (m_g = 2)
    $$
  * **Per a $\\lambda = 6$**:
    $$
    A - 6I = \\begin{pmatrix} -3 & 1 & 1 \\\\ 2 & -2 & 2 \\\\ 1 & 1 & -3 \\end{pmatrix} \\xrightarrow{F_1 \\leftrightarrow F_3} \\begin{pmatrix} 1 & 1 & -3 \\\\ 2 & -2 & 2 \\\\ -3 & 1 & 1 \\end{pmatrix} \\xrightarrow{\\substack{F_2 \\leftarrow F_2 - 2F_1 \\\\ F_3 \\leftarrow F_3 + 3F_1}} \\\\ \\\\
    \\begin{pmatrix} 1 & 1 & -3 \\\\ 0 & -4 & 8 \\\\ 0 & 4 & -8 \\end{pmatrix} \\xrightarrow{\\substack{F_2 \\leftarrow -\\frac{1}{4}F_2 \\\\ F_3 \\leftarrow F_3 + F_2}} \\begin{pmatrix} 1 & 1 & -3 \\\\ 0 & 1 & -2 \\\\ 0 & 0 & 0 \\end{pmatrix}
    $$
    $$
    \\begin{cases} x + y - 3z = 0 \\\\ y - 2z = 0 \\implies y = 2z \\end{cases} \\implies x + 2z - 3z = 0 \\implies x = z \\implies E_6 = \\langle (1, 2, 1) \\rangle \\quad (m_g = 1)
    $$

### Diagonalització: És diagonalitzable.
  * **Base**: $B = \\{(-1, 1, 0), (-1, 0, 1), (1, 2, 1)\\}$.
  * **Matriu diagonal**: $D = \\begin{pmatrix} 2 & 0 & 0 \\\\ 0 & 2 & 0 \\\\ 0 & 0 & 6 \\end{pmatrix}$.
  * **Matrius de canvi de base**: $P = \\begin{pmatrix} -1 & -1 & 1 \\\\ 1 & 0 & 2 \\\\ 0 & 1 & 1 \\end{pmatrix}$, $P^{-1} = \\frac{1}{4} \\begin{pmatrix} -2 & 2 & -2 \\\\ -1 & -1 & 3 \\\\ 1 & 1 & 1 \\end{pmatrix}$.

---

### 4) $A = \\begin{pmatrix} 1 & 1 & 1 \\\\ 0 & 1 & 1 \\\\ 0 & 0 & 1 \\end{pmatrix}$

### Polinomi característic:
  $$
  p(\\lambda) = \\det(A - \\lambda I) = \\begin{vmatrix} 1-\\lambda & 1 & 1 \\\\ 0 & 1-\\lambda & 1 \\\\ 0 & 0 & 1-\\lambda \\end{vmatrix} = (1-\\lambda)^3 = -(\\lambda-1)^3
  $$

### Valors propis: $\\lambda = 1$ ($m_a=3$).

### Subespais propis:
  * **Per a $\\lambda = 1$**:
    $$
    A - I = \\begin{pmatrix} 0 & 1 & 1 \\\\ 0 & 0 & 1 \\\\ 0 & 0 & 0 \\end{pmatrix}
    $$
    $$
    \\begin{cases} y + z = 0 \\\\ z = 0 \\implies y = 0 \\end{cases} \\implies x \\text{ lliure} \\implies E_1 = \\langle (1, 0, 0) \\rangle \\quad (m_g = 1)
    $$

### Diagonalització: **No és diagonalitzable** perquè $m_g(1) = 1 < m_a(1) = 3$.

---

### 5) $A = \\begin{pmatrix} 1 & -3 & 3 \\\\ 3 & -5 & 3 \\\\ 6 & -6 & 4 \\end{pmatrix}$

### Polinomi característic:
  $$
  \\begin{aligned}
  p(\\lambda) &= \\det(A - \\lambda I) = \\begin{vmatrix} 1-\\lambda & -3 & 3 \\\\ 3 & -5-\\lambda & 3 \\\\ 6 & -6 & 4-\\lambda \\end{vmatrix} \\xrightarrow{F_2 \\leftarrow F_2 - F_1} \\begin{vmatrix} 1-\\lambda & -3 & 3 \\\\ \\lambda+2 & -2-\\lambda & 0 \\\\ 6 & -6 & 4-\\lambda \\end{vmatrix} \\\\ \\\\
  &= (\\lambda+2) \\begin{vmatrix} 1-\\lambda & -3 & 3 \\\\ 1 & -1 & 0 \\\\ 6 & -6 & 4-\\lambda \\end{vmatrix} \\xrightarrow{C_2 \\leftarrow C_2 + C_1} (\\lambda+2) \\begin{vmatrix} 1-\\lambda & -2-\\lambda & 3 \\\\ 1 & 0 & 0 \\\\ 6 & 0 & 4-\\lambda \\end{vmatrix} \\\\ \\\\
  &= (\\lambda+2) \\cdot (-1) \\cdot \\begin{vmatrix} -2-\\lambda & 3 \\\\ 0 & 4-\\lambda \\end{vmatrix} = (\\lambda+2)(2+\\lambda)(4-\\lambda) = -(\\lambda+2)^2(\\lambda-4)
  \\end{aligned}
  $$

### Valors propis: $\\lambda_1 = -2$ ($m_a=2$), $\\lambda_2 = 4$ ($m_a=1$).

### Subespais propis:
  * **Per a $\\lambda = -2$**:
    $$
    A + 2I = \\begin{pmatrix} 3 & -3 & 3 \\\\ 3 & -3 & 3 \\\\ 6 & -6 & 6 \\end{pmatrix} \\xrightarrow{\\substack{F_2 \\leftarrow F_2 - F_1 \\\\ F_3 \\leftarrow F_3 - 2F_1}} \\begin{pmatrix} 3 & -3 & 3 \\\\ 0 & 0 & 0 \\\\ 0 & 0 & 0 \\end{pmatrix} \\xrightarrow{F_1 \\leftarrow \\frac{1}{3}F_1} \\begin{pmatrix} 1 & -1 & 1 \\\\ 0 & 0 & 0 \\\\ 0 & 0 & 0 \\end{pmatrix}
    $$
    $$
    x - y + z = 0 \\implies x = y - z \\implies E_{-2} = \\langle (1, 1, 0), (-1, 0, 1) \\rangle \\quad (m_g = 2)
    $$
  * **Per a $\\lambda = 4$**:
    $$
    A - 4I = \\begin{pmatrix} -3 & -3 & 3 \\\\ 3 & -9 & 3 \\\\ 6 & -6 & 0 \\end{pmatrix} \\xrightarrow{\\substack{F_2 \\leftarrow F_2 + F_1 \\\\ F_3 \\leftarrow F_3 + 2F_1}} \\begin{pmatrix} -3 & -3 & 3 \\\\ 0 & -12 & 6 \\\\ 0 & -12 & 6 \\end{pmatrix} \\xrightarrow{\\substack{F_1 \\leftarrow -\\frac{1}{3}F_1 \\\\ F_2 \\leftarrow -\\frac{1}{6}F_2 \\\\ F_3 \\leftarrow F_3 - F_2}} \\begin{pmatrix} 1 & 1 & -1 \\\\ 0 & 2 & -1 \\\\ 0 & 0 & 0 \\end{pmatrix}
    $$
    $$
    \\begin{cases} 2y - z = 0 \\implies z = 2y \\\\ x + y - z = 0 \\implies x + y - 2y = 0 \\implies x = y \\end{cases} \\implies E_4 = \\langle (1, 1, 2) \\rangle \\quad (m_g = 1)
    $$

### Diagonalització: És diagonalitzable.
  * **Base**: $B = \\{(1, 1, 0), (-1, 0, 1), (1, 1, 2)\\}$.
  * **Matriu diagonal**: $D = \\begin{pmatrix} -2 & 0 & 0 \\\\ 0 & -2 & 0 \\\\ 0 & 0 & 4 \\end{pmatrix}$.
  * **Matrius de canvi de base**: $P = \\begin{pmatrix} 1 & -1 & 1 \\\\ 1 & 0 & 1 \\\\ 0 & 1 & 2 \\end{pmatrix}$, $P^{-1} = \\frac{1}{2} \\begin{pmatrix} -1 & 3 & -1 \\\\ -2 & 2 & 0 \\\\ 1 & -1 & 1 \\end{pmatrix}$.

---

### 6) $A = \\begin{pmatrix} 0 & 1 & 0 \\\\ -4 & 4 & 0 \\\\ -2 & 1 & 2 \\end{pmatrix}$

### Polinomi característic:
  $$
  p(\\lambda) = \\det(A - \\lambda I) = \\begin{vmatrix} -\\lambda & 1 & 0 \\\\ -4 & 4-\\lambda & 0 \\\\ -2 & 1 & 2-\\lambda \\end{vmatrix} = (2-\\lambda) \\begin{vmatrix} -\\lambda & 1 \\\\ -4 & 4-\\lambda \\end{vmatrix} = (2-\\lambda)(\\lambda^2 - 4\\lambda + 4) = -(\\lambda-2)^3
  $$

### Valors propis: $\\lambda = 2$ ($m_a=3$).

### Subespais propis:
  * **Per a $\\lambda = 2$**:
    $$
    A - 2I = \\begin{pmatrix} -2 & 1 & 0 \\\\ -4 & 2 & 0 \\\\ -2 & 1 & 0 \\end{pmatrix} \\xrightarrow{\\substack{F_2 \\leftarrow F_2 - 2F_1 \\\\ F_3 \\leftarrow F_3 - F_1}} \\begin{pmatrix} -2 & 1 & 0 \\\\ 0 & 0 & 0 \\\\ 0 & 0 & 0 \\end{pmatrix}
    $$
    $$
    -2x + y = 0 \\implies y = 2x \\implies E_2 = \\langle (1, 2, 0), (0, 0, 1) \\rangle \\quad (m_g = 2)
    $$

### Diagonalització: **No és diagonalitzable** perquè $m_g(2) = 2 < m_a(2) = 3$.

---

### 7) $A = \\begin{pmatrix} 1 & -1 & -1 \\\\ 1 & -1 & 0 \\\\ 1 & 0 & -1 \\end{pmatrix}$

### Polinomi característic:
  $$
  \\begin{aligned}
  p(\\lambda) &= \\det(A - \\lambda I) = \\begin{vmatrix} 1-\\lambda & -1 & -1 \\\\ 1 & -1-\\lambda & 0 \\\\ 1 & 0 & -1-\\lambda \\end{vmatrix} \\\\
  &= (1-\\lambda)(1+\\lambda)^2 - 2(1+\\lambda) = (1-\\lambda)(1+2\\lambda+\\lambda^2) - 2 - 2\\lambda \\\\
  &= -\\lambda^3 - \\lambda^2 - \\lambda - 1 = -(\\lambda+1)(\\lambda^2 + 1)
  \\end{aligned}
  $$

### Valors propis: $\\lambda_1 = -1$ (real), $\\lambda_{2,3} = \\pm i$ (complexos).

### Diagonalització: **No és diagonalitzable** sobre $\\mathbb{R}$ perquè el polinomi característic no descompon completament en factors lineals reals.

---

### 8) $A = \\begin{pmatrix} 0 & 1 & 0 & 0 \\\\ 0 & 0 & 1 & 0 \\\\ 0 & 0 & 0 & 1 \\\\ -4 & 12 & -13 & 6 \\end{pmatrix}$

### Polinomi característic:
  $$
  p(\\lambda) = \\lambda^4 - 6\\lambda^3 + 13\\lambda^2 - 12\\lambda + 4 = (\\lambda-1)^2(\\lambda-2)^2
  $$

### Valors propis: $\\lambda_1 = 1$ ($m_a=2$), $\\lambda_2 = 2$ ($m_a=2$).

### Subespais propis:
  * **Per a $\\lambda = 1$**:
    $$
    A - I = \\begin{pmatrix} -1 & 1 & 0 & 0 \\\\ 0 & -1 & 1 & 0 \\\\ 0 & 0 & -1 & 1 \\\\ -4 & 12 & -13 & 5 \\end{pmatrix} \\xrightarrow{\\substack{F_4 \\leftarrow F_4 - 4F_1 \\\\ F_4 \\leftarrow F_4 + 8F_2 \\\\ F_4 \\leftarrow F_4 - 5F_3}} \\begin{pmatrix} -1 & 1 & 0 & 0 \\\\ 0 & -1 & 1 & 0 \\\\ 0 & 0 & -1 & 1 \\\\ 0 & 0 & 0 & 0 \\end{pmatrix}
    $$
    $$
    x=y=z=w \\implies E_1 = \\langle (1, 1, 1, 1) \\rangle \\quad (m_g = 1)
    $$
  * **Per a $\\lambda = 2$**:
    $$
    A - 2I = \\begin{pmatrix} -2 & 1 & 0 & 0 \\\\ 0 & -2 & 1 & 0 \\\\ 0 & 0 & -2 & 1 \\\\ -4 & 12 & -13 & 4 \\end{pmatrix} \\xrightarrow{\\substack{F_4 \\leftarrow F_4 - 2F_1 \\\\ F_4 \\leftarrow F_4 + 5F_2 \\\\ F_4 \\leftarrow F_4 - 4F_3}} \\begin{pmatrix} -2 & 1 & 0 & 0 \\\\ 0 & -2 & 1 & 0 \\\\ 0 & 0 & -2 & 1 \\\\ 0 & 0 & 0 & 0 \\end{pmatrix}
    $$
    $$
    \\begin{cases} -2z+w=0 \\\\ -2y+z=0 \\\\ -2x+y=0 \\end{cases} \\implies \\begin{pmatrix} x \\\\ y \\\\ z \\\\ w \\end{pmatrix} = x \\begin{pmatrix} 1 \\\\ 2 \\\\ 4 \\\\ 8 \\end{pmatrix} \\implies E_2 = \\langle (1, 2, 4, 8) \\rangle \\quad (m_g = 1)
    $$

### Diagonalització: **No és diagonalitzable** perquè $m_g < m_a$ per a ambdós valors propis.

---

### 9) $A = \\begin{pmatrix} -2 & 0 & 0 & 4 \\\\ 2 & 1 & 0 & 2 \\\\ 3 & 0 & -1 & 3 \\\\ 4 & 0 & 0 & -2 \\end{pmatrix}$

### Polinomi característic:
  $$
  p(\\lambda) = (1-\\lambda)(-1-\\lambda) \\begin{vmatrix} -2-\\lambda & 4 \\\\ 4 & -2-\\lambda \\end{vmatrix} = (\\lambda-1)(\\lambda+1)(\\lambda-2)(\\lambda+6)
  $$

### Valors propis: $\\lambda_1 = 1$ ($m_a=1$), $\\lambda_2 = -1$ ($m_a=1$), $\\lambda_3 = 2$ ($m_a=1$), $\\lambda_4 = -6$ ($m_a=1$).

### Subespais propis:
  * **Per a $\\lambda = 1$**:
    $$
    A - I = \\begin{pmatrix} -3 & 0 & 0 & 4 \\\\ 2 & 0 & 0 & 2 \\\\ 3 & 0 & -2 & 3 \\\\ 4 & 0 & 0 & -3 \\end{pmatrix} \\xrightarrow{\\text{reducció}} \\begin{pmatrix} 1 & 0 & 0 & 1 \\\\ 0 & 0 & -2 & 7 \\\\ 0 & 0 & 0 & -7 \\\\ 0 & 0 & 0 & 0 \\end{pmatrix} \\implies E_1 = \\langle (0, 1, 0, 0) \\rangle \\quad (m_g = 1)
    $$
  * **Per a $\\lambda = -1$**:
    $$
    A + I = \\begin{pmatrix} -1 & 0 & 0 & 4 \\\\ 2 & 2 & 0 & 2 \\\\ 3 & 0 & 0 & 3 \\\\ 4 & 0 & 0 & -1 \\end{pmatrix} \\xrightarrow{\\text{reducció}} \\begin{pmatrix} -1 & 0 & 0 & 4 \\\\ 0 & 2 & 0 & 10 \\\\ 0 & 0 & 0 & 15 \\\\ 0 & 0 & 0 & 0 \\end{pmatrix} \\implies E_{-1} = \\langle (0, 0, 1, 0) \\rangle \\quad (m_g = 1)
    $$
  * **Per a $\\lambda = 2$**:
    $$
    A - 2I = \\begin{pmatrix} -4 & 0 & 0 & 4 \\\\ 2 & -1 & 0 & 2 \\\\ 3 & 0 & -3 & 3 \\\\ 4 & 0 & 0 & -4 \\end{pmatrix} \\xrightarrow{\\substack{F_2 \\leftarrow F_2 - 2F_1 \\\\ F_3 \\leftarrow F_3 - F_1 \\\\ F_4 \\leftarrow F_4 - 4F_1}} \\begin{pmatrix} 1 & 0 & 0 & -1 \\\\ 0 & -1 & 0 & 4 \\\\ 0 & 0 & -1 & 2 \\\\ 0 & 0 & 0 & 0 \\end{pmatrix} \\implies E_2 = \\langle (1, 4, 2, 1) \\rangle \\quad (m_g = 1)
    $$
  * **Per a $\\lambda = -6$**:
    $$
    A + 6I = \\begin{pmatrix} 4 & 0 & 0 & 4 \\\\ 2 & 7 & 0 & 2 \\\\ 3 & 0 & 5 & 3 \\\\ 4 & 0 & 0 & 4 \\end{pmatrix} \\xrightarrow{\\substack{F_2 \\leftarrow F_2 - 2F_1 \\\\ F_3 \\leftarrow F_3 - 3F_1 \\\\ F_4 \\leftarrow F_4 - F_1}} \\begin{pmatrix} 1 & 0 & 0 & 1 \\\\ 0 & 7 & 0 & 0 \\\\ 0 & 0 & 5 & 0 \\\\ 0 & 0 & 0 & 0 \\end{pmatrix} \\implies E_{-6} = \\langle (1, 0, 0, -1) \\rangle \\quad (m_g = 1)
    $$

### Diagonalització: És diagonalitzable.
  * **Base**: $B = \\{(0, 1, 0, 0), (0, 0, 1, 0), (1, 4, 2, 1), (1, 0, 0, -1)\\}$.
  * **Matriu diagonal**: $D = \\begin{pmatrix} 1 & 0 & 0 & 0 \\\\ 0 & -1 & 0 & 0 \\\\ 0 & 0 & 2 & 0 \\\\ 0 & 0 & 0 & -6 \\end{pmatrix}$.
  * **Matrius de canvi de base**: $P = \\begin{pmatrix} 0 & 0 & 1 & 1 \\\\ 1 & 0 & 4 & 0 \\\\ 0 & 1 & 2 & 0 \\\\ 0 & 0 & 1 & -1 \\end{pmatrix}$, $P^{-1} = \\frac{1}{2} \\begin{pmatrix} -4 & 2 & 0 & -4 \\\\ -2 & 0 & 2 & -2 \\\\ 1 & 0 & 0 & 1 \\\\ 1 & 0 & 0 & -1 \\end{pmatrix}$.
`,
  availableLanguages: ['ca']
};
