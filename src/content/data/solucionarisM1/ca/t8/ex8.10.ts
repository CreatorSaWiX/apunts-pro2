import type { Solution } from '../../../solutions';

export const ex8_10: Solution = {
  id: 'M1-T8-Ex8.10',
  title: 'Exercici 8.10: Estudi d\'un endomorfisme amb paràmetre',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Considereu l'endomorfisme $f$ de $\\mathbb{R}^3$ definit per $f(x, y, z) = (ax - y, x + y + z, 2z)$, on $a$ és un paràmetre real.
1. Doneu la dimensió de $\\text{Im } f$ segons els valors de $a \\in \\mathbb{R}$.
2. És $f$ diagonalitzable per a $a = 3$?
3. Doneu condicions sobre $a$ per tal que $f$ tingui tots els seus valors propis reals.`,
  content: `
### Matriu associada
La matriu de l'endomorfisme en la base canònica és:
$A = \\begin{pmatrix} a & -1 & 0 \\\\ 1 & 1 & 1 \\\\ 0 & 0 & 2 \\end{pmatrix}$

---

### 1) Dimensió de la imatge
La dimensió de la imatge és el rang de la matriu $A$. Calculem el determinant per veure quan és màxim:
$\\det(A) = 2 \\cdot \\det \\begin{pmatrix} a & -1 \\\\ 1 & 1 \\end{pmatrix} = 2(a + 1)$

- Si **$a \\neq -1$**: $\\det(A) \\neq 0 \\implies \\text{rang}(A) = 3 \\implies \\dim(\\text{Im } f) = 3$.
- Si **$a = -1$**: $\\det(A) = 0$. La matriu és $A = \\begin{pmatrix} -1 & -1 & 0 \\\\ 1 & 1 & 1 \\\\ 0 & 0 & 2 \\end{pmatrix}$. Com que les dues últimes files són clarament linealment independents, el rang és 2 $\\implies \\dim(\\text{Im } f) = 2$.

---

### 2) Diagonalitzabilitat per a $a = 3$
Substituïm $a=3$: $A = \\begin{pmatrix} 3 & -1 & 0 \\\\ 1 & 1 & 1 \\\\ 0 & 0 & 2 \\end{pmatrix}$.
Calculem el polinomi característic:
$p(\\lambda) = \\det(A - \\lambda I) = (2-\\lambda) \\cdot [(3-\\lambda)(1-\\lambda) + 1] = (2-\\lambda)(\\lambda^2 - 4\\lambda + 4) = (2-\\lambda)(\\lambda - 2)^2 = -(\\lambda - 2)^3$

Tenim un únic valor propi $\\lambda = 2$ amb multiplicitat algebraica $m_a(2) = 3$.
Estudiem la multiplicitat geomètrica $m_g(2) = 3 - \\text{rang}(A - 2I)$:
$A - 2I = \\begin{pmatrix} 1 & -1 & 0 \\\\ 1 & -1 & 1 \\\\ 0 & 0 & 0 \\end{pmatrix}$
El rang d'aquesta matriu és 2 (les dues primeres files són independents).
$m_g(2) = 3 - 2 = 1$.
Com que **$m_g(2) = 1 \\neq m_a(2) = 3$**, l'endomorfisme **no és diagonalitzable** per a $a=3$.

---

### 3) Condicions per a valors propis reals
El polinomi característic general és:
$p(\\lambda) = (2-\\lambda) \\cdot [\\lambda^2 - (a+1)\\lambda + (a+1)]$
Els valors propis seran reals si les arrels del factor de segon grau són reals. El discriminant ha de ser no negatiu:
$\\Delta = (a+1)^2 - 4(a+1) = (a+1)(a+1-4) = (a+1)(a-3)$

$\\Delta \\geq 0 \\iff (a+1)(a-3) \\geq 0$

Això passa quan:
**$a \\in (-\\infty, -1] \\cup [3, +\\infty)$**
`,
  availableLanguages: ['ca']
};
