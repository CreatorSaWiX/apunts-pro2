import type { Solution } from '../../../solutions';

export const ex8_5: Solution = {
  id: 'M1-T8-Ex8.5',
  title: 'Exercici 8.5: Discussió de la diagonalització amb paràmetres',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Discutiu la diagonalització de les matrius següents sobre $\\mathbb{R}$ en funció dels seus paràmetres.`,
  content: `
### 1) $A = \\begin{pmatrix} a & b \\\\ -b & 0 \\end{pmatrix}$
- **Polinomi característic:** $p(\\lambda) = \\lambda^2 - a\\lambda + b^2$.
- **Discriminant:** $\\Delta = a^2 - 4b^2$.
- **Discussió:**
  - Si **$|a| > 2|b|$**: Dues arrels reals distintes $\\implies$ **Diagonalitzable**.
  - Si **$|a| < 2|b|$**: Arrels complexes $\\implies$ **No diagonalitzable** sobre $\\mathbb{R}$.
  - Si **$|a| = 2|b|$**: Arrel doble $\\lambda = a/2$. Serà diagonalitzable si $A = \\frac{a}{2}I$, que només passa si **$a=b=0$**. Si no, no és diagonalitzable.

---

### 2) $A = \\begin{pmatrix} 1 & 0 & 0 \\\\ a & 1 & 0 \\\\ b & c & 2 \\end{pmatrix}$
- **Valors propis:** $\\lambda_1 = 1$ ($m_a=2$), $\\lambda_2 = 2$ ($m_a=1$).
- **Estudi de $\\lambda = 1$:** $\\dim(E_1) = 3 - \\text{rang}(A-I) = 3 - \\text{rang} \\begin{pmatrix} 0 & 0 & 0 \\\\ a & 0 & 0 \\\\ b & c & 1 \\end{pmatrix}$.
- **Discussió:**
  - Si **$a = 0$**: El rang és 1 $\\implies m_g(1) = 2$. **Diagonalitzable**.
  - Si **$a \\neq 0$**: El rang és 2 $\\implies m_g(1) = 1$. **No diagonalitzable**.

---

### 3) $A = \\begin{pmatrix} a & b & 0 \\\\ 0 & -1 & 0 \\\\ 0 & 0 & 1 \\end{pmatrix}$
- **Valors propis:** $a, -1, 1$.
- **Discussió:**
  - Si **$a \\neq 1, -1$**: 3 valors propis distints $\\implies$ **Diagonalitzable**.
  - Si **$a = 1$**: $\\lambda=1$ ($m_a=2$). $E_1 = \\ker \\begin{pmatrix} 0 & b & 0 \\\\ 0 & -2 & 0 \\\\ 0 & 0 & 0 \\end{pmatrix}$. Rang sempre és 1. **Diagonalitzable** per a tot $b$.
  - Si **$a = -1$**: $\\lambda=-1$ ($m_a=2$). $E_{-1} = \\ker \\begin{pmatrix} 0 & b & 0 \\\\ 0 & 0 & 0 \\\\ 0 & 0 & 2 \\end{pmatrix}$. Rang 1 si **$b=0$**, rang 2 si $b \\neq 0$. **Diagonalitzable ssi $b=0$**.

---

### 4) $A = \\begin{pmatrix} c & 2a & 0 \\\\ b & 0 & a \\\\ 0 & 2b & -c \\end{pmatrix}$
- **Polinomi característic:** $p(\\lambda) = -\\lambda(\\lambda^2 - (c^2 + 4ab))$.
- **Discussió:**
  - Si **$c^2 + 4ab > 0$**: 3 arrels reals distintes $\\implies$ **Diagonalitzable**.
  - Si **$c^2 + 4ab < 0$**: Arrels complexes $\\implies$ **No diagonalitzable** sobre $\\mathbb{R}$.
  - Si **$c^2 + 4ab = 0$**: $\\lambda=0$ ($m_a=3$). Només diagonalitzable si $A=0$, és a dir, **$a=b=c=0$**.

---

### 5) $A = \\begin{pmatrix} 1 & a & 0 & 1 \\\\ 0 & 1 & 0 & 0 \\\\ 0 & 0 & 2 & 0 \\\\ 0 & 0 & 0 & b \\end{pmatrix}$
- **Valors propis:** $1$ ($m_a=2$), $2$ ($m_a=1$), $b$.
- **Discussió:**
  - Si **$b \\neq 1$**: $\\lambda=1$ ($m_a=2$). $E_1 = \\ker \\begin{pmatrix} 0 & a & 0 & 1 \\\\ 0 & 0 & 0 & 0 \\\\ 0 & 0 & 1 & 0 \\\\ 0 & 0 & 0 & b-1 \\end{pmatrix}$. Rang és 3 $\\implies m_g=1$. **No diagonalitzable** (tret que $a=0$ i analitzem més, però en aquest cas amb $b-1 \\neq 0$ el rang es manté).
  - Si **$a = 0$ i $b \\neq 1$**: **Diagonalitzable**.
  - Si **$b = 1$**: $\\lambda=1$ ($m_a=3$). $m_g(1) = 4 - 2 = 2$. **No diagonalitzable**.
  - Conclusió: **Diagonalitzable ssi $a=0$ i $b \\neq 1$**.

---

### 6) $A = \\begin{pmatrix} 2a-1 & 1-a & 1-a \\\\ a-1 & 1 & 1-a \\\\ a-1 & 1-a & 1 \\end{pmatrix}$
- **Polinomi característic:** $p(\\lambda) = -(\\lambda - 1)(\\lambda - a)^2$.
- **Discussió:**
  - Si **$a \\neq 1$**: $m_a(a)=2$. $A-aI = \\begin{pmatrix} a-1 & 1-a & 1-a \\\\ a-1 & 1-a & 1-a \\\\ a-1 & 1-a & 1-a \\end{pmatrix}$, rang 1 $\\implies m_g(a)=2$.
  - Si **$a = 1$**: $A = I$, diagonal.
  - Conclusió: **Diagonalitzable per a tot $a \\in \\mathbb{R}$**.

---

### 7) $A = \\begin{pmatrix} 1 & 0 & 0 \\\\ b & a & 0 \\\\ 0 & 0 & 2 \\end{pmatrix}$
- **Valors propis:** $1, a, 2$.
- **Discussió:**
  - Si **$a \\neq 1, 2$**: 3 valors propis distints $\\implies$ **Diagonalitzable**.
  - Si **$a = 1$**: $\\lambda=1$ ($m_a=2$). $E_1 = \\ker \\begin{pmatrix} 0 & 0 & 0 \\\\ b & 0 & 0 \\\\ 0 & 0 & 1 \\end{pmatrix}$. **Diagonalitzable ssi $b=0$**.
  - Si **$a = 2$**: $\\lambda=2$ ($m_a=2$). $E_2 = \\ker \\begin{pmatrix} -1 & 0 & 0 \\\\ b & 0 & 0 \\\\ 0 & 0 & 0 \\end{pmatrix}$. Rang sempre 1 $\\implies m_g=2$. **Diagonalitzable** per a tot $b$.
`,
  availableLanguages: ['ca']
};
