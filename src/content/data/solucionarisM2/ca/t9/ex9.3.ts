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

**1. Punts crítics:**
Calculem les derivades parcials de primer ordre usant la regla de la cadena:
*   $\\frac{\\partial f}{\\partial x} = 2(x^2 - 2x + 4y^2 - 8y) \\cdot (2x - 2)$
*   $\\frac{\\partial f}{\\partial y} = 2(x^2 - 2x + 4y^2 - 8y) \\cdot (8y - 8)$

Igualem ambdues derivades a zero:
1.  $2(x^2 - 2x + 4y^2 - 8y)(2x - 2) = 0$
2.  $2(x^2 - 2x + 4y^2 - 8y)(8y - 8) = 0$

D'aquí obtenim dos casos:
*   **Cas 1:** $x^2 - 2x + 4y^2 - 8y = 0$. Tots els punts que compleixen aquesta equació (una el·lipse) anul·len el gradient i, per tant, són punts crítics.
    Per determinar el seu caràcter, fixem-nos en la forma de la funció: $f(x, y) = (x^2 - 2x + 4y^2 - 8y)^2$. Com que és un quadrat, el valor de la funció mai pot ser negatiu ($f(x, y) \\geq 0$ per a tot punt).
    En els punts d'aquesta el·lipse, tenim que $f(x,y) = 0^2 = 0$. Com que $0$ és el valor més petit que pot prendre la funció, tots els punts de l'el·lipse són **Mínims absoluts** (i, per tant, també relatius).
*   **Cas 2:** $2x - 2 = 0$ i $8y - 8 = 0$. Això ens dóna el punt $\\mathbf{P(1,1)}$.

**2. Estudi de $P(1,1)$:**
Calculem les derivades de segon ordre usant la regla del producte:
*   $\\frac{\\partial^2 f}{\\partial x^2} = 2(2x-2)^2 + 2(x^2 - 2x + 4y^2 - 8y) \\cdot 2$
*   $\\frac{\\partial^2 f}{\\partial y^2} = 2(8y-8)^2 + 2(x^2 - 2x + 4y^2 - 8y) \\cdot 8$
*   $\\frac{\\partial^2 f}{\\partial x \\partial y} = 2(8y-8) \\cdot (2x-2) = 32(y-1)(x-1)$

Avaluem aquestes expressions en el punt $P(1,1)$:
*   $\\frac{\\partial^2 f}{\\partial x^2}(1,1) = 2(0)^2 + 4(1 - 2 + 4 - 8) = 4(-5) = -20$
*   $\\frac{\\partial^2 f}{\\partial y^2}(1,1) = 2(0)^2 + 16(1 - 2 + 4 - 8) = 16(-5) = -80$
*   $\\frac{\\partial^2 f}{\\partial x \\partial y}(1,1) = 32(0)(0) = 0$

Determinant de la matriu Hessiana:
$$\\Delta(1,1) = \\begin{vmatrix} -20 & 0 \\\\ 0 & -80 \\end{vmatrix} = (-20)(-80) - 0 = 1600 > 0$$

Com que $\\Delta > 0$ i $\\frac{\\partial^2 f}{\\partial x^2}(1,1) = -20 < 0$, el punt $P(1,1)$ és un **Màxim relatiu**.

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

### Apartat d) $f(x, y) = x^2 y^2 (1 - x - y) = x^2 y^2 - x^3 y^2 - x^2 y^3$

**1. Punts crítics:**
Derivem parcialment respecte $x$ i $y$:
*   $\\frac{\\partial f}{\\partial x} = 2xy^2 - 3x^2 y^2 - 2xy^3 = xy^2 (2 - 3x - 2y)$
*   $\\frac{\\partial f}{\\partial y} = 2x^2 y - 2x^3 y - 3x^2 y^2 = x^2 y (2 - 2x - 3y)$

Igualem a zero per trobar els punts crítics:
1.  $xy^2 (2 - 3x - 2y) = 0$
2.  $x^2 y (2 - 2x - 3y) = 0$

*   **Eixos:** Si $x=0$ o $y=0$, s'anul·len ambdues derivades. Tots els punts dels eixos són crítics ($f=0$).
*   **Punt interior:** Si $x, y \\neq 0$, ens queda el sistema:
    $$\\begin{cases} 3x + 2y = 2 \\\\ 2x + 3y = 2 \\end{cases} \\implies 3x + 2y = 2x + 3y \\implies x = y$$
    . Substituint $x=y$ en qualsevol equació: $5x = 2 \\implies x = 0.4, y = 0.4 \\implies \\mathbf{P(0.4, 0.4)}$.

**2. Estudi de $P(0.4, 0.4)$:**
Calculem les segones derivades:
*   $\\frac{\\partial^2 f}{\\partial x^2} = 2y^2 - 6xy^2 - 2y^3 = 2y^2 (1 - 3x - y)$
*   $\\frac{\\partial^2 f}{\\partial y^2} = 2x^2 - 2x^3 - 6x^2 y = 2x^2 (1 - x - 3y)$
*   $\\frac{\\partial^2 f}{\\partial x \\partial y} = 4xy - 6x^2 y - 6xy^2 = 2xy (2 - 3x - 3y)$

Avaluem al punt $P(0.4, 0.4)$:
*   $\\frac{\\partial^2 f}{\\partial x^2}(0.4, 0.4) = 2(0.16) (1 - 1.2 - 0.4) = 0.32(-0.6) = -0.192$
*   $\\frac{\\partial^2 f}{\\partial y^2}(0.4, 0.4) = 2(0.16) (1 - 0.4 - 1.2) = 0.32(-0.6) = -0.192$
*   $\\frac{\\partial^2 f}{\\partial x \\partial y}(0.4, 0.4) = 2(0.16) (2 - 1.2 - 1.2) = 0.32(-0.4) = -0.128$

Matriu Hessiana:
$\\Delta = (-0.192)^2 - (-0.128)^2 = 0.036864 - 0.016384 = 0.02048 > 0$.
Com que $\\Delta > 0$ i $\\frac{\\partial^2 f}{\\partial x^2}(0.4, 0.4) < 0$, és un **Màxim relatiu**.

**3. Estudi dels eixos ($f=0$):**
Prop de l'eix, el signe de $f(x,y) = x^2 y^2 (1-x-y)$ depèn només del factor $(1-x-y)$, ja que $x^2 y^2 \\geq 0$.
*   Si $x+y < 1 \\implies f > 0$.
*   Si $x+y > 1 \\implies f < 0$.
En els trams dels eixos on $1-x-y$ canvia de signe (és a dir, prop de la recta $x+y=1$), els punts són de sella. On no canvia de signe, són extrems no estrictes.`,
  availableLanguages: ['ca']
};
