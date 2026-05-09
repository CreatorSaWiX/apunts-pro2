import type { Solution } from '../../../solutions';

export const ex9_3: Solution = {
  id: 'M2-T9-Ex3',
  title: 'Exercici 3: Estudi d\'extrems relatius i Hessian nul',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Trobeu els extrems relatius de les funcions següents. En algun dels punts crítics, el determinant de la matriu hessiana és zero, i, per tant, cal determinar el caràcter del punt fent ús directament de les definicions de màxim, mínim o punt de sella.

a) $f(x, y) = x^3 + y^3 - 9xy + 27$

b) $f(x, y) = (x^2 - 2x + 4y^2 - 8y)^2$

c) $f(x, y) = y^2 - x^3$

d) $f(x, y) = x^2 y^2 (1 - x - y)$`,
  content: `### Apartat a) $f(x, y) = x^3 + y^3 - 9xy + 27$

**1. Punts crítics:**
Trobem on s'anul·la el gradient $\\nabla f = \\left( \\frac{\\partial f}{\\partial x}, \\frac{\\partial f}{\\partial y} \\right)$:
*   $\\frac{\\partial f}{\\partial x} = 3x^2 - 9y = 0 \\implies y = \\frac{x^2}{3}$
*   $\\frac{\\partial f}{\\partial y} = 3y^2 - 9x = 0$

Substituïm la primera equació en la segona per tenir una sola variable:

$$3\\left(\\frac{x^2}{3}\\right)^2 - 9x = 0 \\implies \\frac{x^4}{3} - 9x = 0 \\implies x^4 - 27x = 0$$

Factoritzem per trobar les arrels:

$$x(x^3 - 27) = 0 \\implies \\begin{cases} x = 0 \\\\ x^3 = 27 \\implies x = 3 \\end{cases}$$

Trobem la $y$ corresponent per a cada $x$ usant $y = x^2/3$:
*   Si $x=0 \\implies y = 0 \\implies \\mathbf{P_1(0,0)}$
*   Si $x=3 \\implies y = \\frac{3^2}{3} = 3 \\implies \\mathbf{P_2(3,3)}$

**2. Matriu Hessiana:**

$$H(x,y) = \\begin{pmatrix} 6x & -9 \\\\ -9 & 6y \\end{pmatrix}, \\quad \\Delta = 36xy - 81$$

*   **$P_1(0,0)$:** $\\Delta = -81 < 0 \\implies$ **Punt de sella**.
*   **$P_2(3,3)$:** $\\Delta = 36(9) - 81 = 243 > 0$. Com que $\\frac{\\partial^2 f}{\\partial x^2}(3,3) = 18 > 0$, és un **Mínim relatiu**.

---

### Apartat b) $f(x, y) = (x^2 - 2x + 4y^2 - 8y)^2$
Podem completar quadrats: $f(x,y) = [(x-1)^2 + 4(y-1)^2 - 5]^2 = g(x,y)^2$.

**1. Punts crítics:** $\\nabla f = 2g \\cdot \\nabla g = 0$.
Això passa en dos casos:
*   **Cas 1:** $g(x,y)=0 \\implies (x-1)^2 + 4(y-1)^2 = 5$. Tots els punts d'aquesta el·lipse són crítics. Com que $f(x,y) \\geq 0$ sempre i en aquests punts $f=0$, tots són **Mínims relatius** (i absoluts).
*   **Cas 2:** $\\nabla g = (2(x-1), 8(y-1)) = (0,0) \\implies \\mathbf{P(1,1)}$.

**2. Estudi de $P(1,1)$:**

$\\Delta(1,1) = 1600 > 0$ i $\\frac{\\partial^2 f}{\\partial x^2}(1,1) = -20 < 0 \\implies$ **Màxim relatiu**.

---

### Apartat c) $f(x, y) = y^2 - x^3$

**1. Punt crític:**

$\\frac{\\partial f}{\\partial x} = -3x^2 = 0 \\implies x=0$

$\\frac{\\partial f}{\\partial y} = 2y = 0 \\implies y=0$

L'únic punt crític és $\\mathbf{P(0,0)}$.

**2. Estudi local (Hessiana nul·la):**

$H(0,0) = \\begin{pmatrix} 0 & 0 \\\\ 0 & 2 \\end{pmatrix}$, per tant $\\Delta = 0$. El criteri no ens diu res.

Analitzem el comportament de la funció prop de $(0,0)$:
*   Si ens movem per l'eix $y$ ($x=0$): $f(0,y) = y^2 \\geq 0$.
*   Si ens movem per l'eix $x$ ($y=0$): $f(x,0) = -x^3$. Aquest terme és positiu si $x<0$ i negatiu si $x>0$.
Com que la funció pren valors positius i negatius en qualsevol entorn de $(0,0)$, el punt és un **Punt de sella**.

---

### Apartat d) $f(x, y) = x^2 y^2 (1 - x - y)$

**1. Punts crítics:**

$\\frac{\\partial f}{\\partial x} = 2xy^2 - 3x^2 y^2 - 2xy^3 = xy^2 (2 - 3x - 2y) = 0$

$\\frac{\\partial f}{\\partial y} = 2x^2 y - 2x^3 y - 3x^2 y^2 = x^2 y (2 - 2x - 3y) = 0$

*   **Eixos:** Qualsevol punt amb $x=0$ o $y=0$ és crític. En tots ells $f=0$ i $\\Delta = 0$.
*   **Punt interior:** Si $x,y \\neq 0$, resolem:
    $$\\begin{cases} 3x + 2y = 2 \\\\ 2x + 3y = 2 \\end{cases} \\implies x = \\frac{2}{5}, y = \\frac{2}{5} \\implies \\mathbf{P(0.4, 0.4)}$$

**2. Estudi de $P(0.4, 0.4)$:**
Calculant la Hessiana en aquest punt obtenim $\\Delta > 0$ i $\\frac{\\partial^2 f}{\\partial x^2}(0.4, 0.4) < 0 \\implies$ **Màxim relatiu**.

**3. Estudi dels eixos ($f=0$):**
Si analitzem $f(x,y) = x^2 y^2 (1-x-y)$ prop de l'eix, el signe depèn de $(1-x-y)$.
*   Si $x+y < 1 \\implies f > 0$.
*   Si $x+y > 1 \\implies f < 0$.
Per tant, els punts de l'eix on $x+y=1$ són punts de sella, mentre que en altres trams de l'eix la funció no canvia de signe (mínims no estrictes).`,
  availableLanguages: ['ca']
};
