import type { Solution } from '../../../solutions';

export const ex9_2: Solution = {
  id: 'M2-T9-Ex2',
  title: 'Exercici 2: Pla tangent i aproximació de Taylor',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `a) Escriviu l'equació del pla tangent a la superfície de $\\mathbb{R}^3$ definida per l'equació: $z = \\sqrt[3]{xy}$, en el punt $P(1, 1, 1)$.

b) Calculeu aproximadament mitjançant un polinomi de Taylor de primer grau la quantitat $\\sqrt[3]{0.99 \\cdot 1.01}$. Calculeu l'error en aquesta aproximació, és a dir doneu una fita superior del residu en aquest càlcul.`,
  content: `### Apartat a) Equació del pla tangent
Considerem la funció $f(x,y) = \\sqrt[3]{xy} = x^{1/3}y^{1/3}$. El punt de tangència és $P(1,1,1)$, per tant $a=1, b=1$ i $f(1,1)=1$.
Calculem les derivades parcials de primer ordre:
*   $\\frac{\\partial f}{\\partial x} = \\frac{1}{3} x^{-2/3} y^{1/3} \\implies \\frac{\\partial f}{\\partial x}(1,1) = \\frac{1}{3}$
*   $\\frac{\\partial f}{\\partial y} = \\frac{1}{3} x^{1/3} y^{-2/3} \\implies \\frac{\\partial f}{\\partial y}(1,1) = \\frac{1}{3}$

L'equació del pla tangent és:
$$z = f(1,1) + \\frac{\\partial f}{\\partial x}(1,1)(x-1) + \\frac{\\partial f}{\\partial y}(1,1)(y-1)$$

$$z = 1 + \\frac{1}{3}(x-1) + \\frac{1}{3}(y-1)$$

Multiplicant per 3 per simplificar: **$x + y - 3z + 1 = 0$**.

---

### Apartat b) Aproximació i fita de l'error

**1. Aproximació:**
Volem calcular $\\sqrt[3]{0.99 \\cdot 1.01} = f(0.99, 1.01)$. Utilitzem el polinomi de Taylor de grau 1 (que coincideix amb l'equació del pla tangent):
$$P_1(x,y) = 1 + \\frac{1}{3}(x-1) + \\frac{1}{3}(y-1)$$

Substituïm $x=0.99$ i $y=1.01$:

$$
f(0.99, 1.01) \\approx 1 + \\frac{1}{3}(0.99-1) + \\frac{1}{3}(1.01-1) = 1 + \\frac{1}{3}(-0.01) + \\frac{1}{3}(0.01) = 1
$$

**2. Acotació de l'error (Residu de Lagrange):**

L'error es calcula mitjançant el residu de primer ordre al punt $(0.99, 1.01)$, amb $h=x-a=0.99-1 = -0.01$ i $k=y-b=1.01-1=0.01$:

$$
error = |R_1(0.99, 1.01)| = \\left| \\frac{1}{2} \\left( \\frac{\\partial^2 f}{\\partial x^2}(c,d)h^2 + 2\\frac{\\partial^2 f}{\\partial y \\partial x}(c,d)hk + \\frac{\\partial^2 f}{\\partial y^2}(c,d)k^2 \\right) \\right|
$$

Substituïm les derivades segones i els increments:

$$
|R_1| = \\left| \\frac{1}{2} \\left( -\\frac{2}{9} \\frac{d^{1/3}}{c^{5/3}}(0.01)^2 + 2 \\left( \\frac{1}{9} \\frac{1}{c^{2/3}d^{2/3}} \\right) (-0.01)(0.01) - \\frac{2}{9} \\frac{c^{1/3}}{d^{5/3}}(0.01)^2 \\right) \\right|
$$

Si factoritzem el terme $\\frac{(0.01)^2}{18}$ i el signe, simplifiquem l'expressió (el 2 dels numeradors s'anul·la amb el $1/2$ exterior):

$$
|R_1| = \\frac{(0.01)^2}{9} \\left( \\frac{d^{1/3}}{c^{5/3}} + \\frac{1}{c^{2/3}d^{2/3}} + \\frac{c^{1/3}}{d^{5/3}} \\right)
$$

On $x \\leq c \\leq a \\implies 0.99 \\leq c \\leq 1$ i $b \\leq d \\leq y \\implies 1 \\leq d \\leq 1.01$. Acotem cada sumant per separat prenent el valor més gran possible (denominadors mínims i numeradors màxims):
*   $\\frac{d^{1/3}}{c^{5/3}} \\leq \\frac{1.01^{1/3}}{0.99^{5/3}}$
*   $\\frac{1}{c^{2/3}d^{2/3}} \\leq \\frac{1}{0.99^{2/3} \\cdot 1^{2/3}}$
*   $\\frac{c^{1/3}}{d^{5/3}} \\leq \\frac{1^{1/3}}{1^{5/3}} = 1$

Substituint a la fórmula, obtenim el valor aproximat de la fita:

**$$|R_1| \\leq \\frac{(0.01)^2}{9} (\\approx 3) \\approx 0.00003$$**
`,
  availableLanguages: ['ca']
};
