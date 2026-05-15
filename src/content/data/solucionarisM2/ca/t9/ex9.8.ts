import type { Solution } from '../../../solutions';

export const ex9_8: Solution = {
  id: 'M2-T9-Ex8',
  title: 'Exercici 8: Aproximacions mitjançant Taylor de grau 2',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Fent ús de polinomis de Taylor de segon grau per a funcions de dues variables, calculeu aproximadament:

a) $\\sqrt{1.03 + 2.98}$

b) $\\sqrt[3]{0.98 \\times 1.02}$

c) $0.95^{2.01}$`,
  content: `### Apartat a) $\\sqrt{1.03 + 2.98}$

**1. Definició de la funció i punt base:**
Considerem $f(x,y) = \\sqrt{x+y}$. Volem aproximar en $(1.03, 2.98)$. Triem el punt base $P(1, 3)$ perquè $1+3=4$ és un quadrat perfecte. Increment: $h = 0.03, \\, k = -0.02$.

**2. Càlcul de derivades en $P(1,3)$:**
*   $f(1,3) = \\sqrt{4} = 2$
*   $\\frac{\\partial f}{\\partial x} = \\frac{1}{2\\sqrt{x+y}} \\implies \\frac{\\partial f}{\\partial x}(1,3) = \\frac{1}{4} = 0.25$
*   $\\frac{\\partial f}{\\partial y} = \\frac{1}{2\\sqrt{x+y}} \\implies \\frac{\\partial f}{\\partial y}(1,3) = \\frac{1}{4} = 0.25$
*   $\\frac{\\partial^2 f}{\\partial x^2} = -\\frac{1}{4(x+y)^{3/2}} \\implies \\frac{\\partial^2 f}{\\partial x^2}(1,3) = -\\frac{1}{4 \\cdot 8} = -\\frac{1}{32}$
*   $\\frac{\\partial^2 f}{\\partial y^2} = -\\frac{1}{32}$
*   $\\frac{\\partial^2 f}{\\partial y \\partial x} = -\\frac{1}{32}$

**3. Aproximació:**

$$P_2 = 2 + 0.25(0.03) + 0.25(-0.02) + \\frac{1}{2} \\left[ -\\frac{1}{32}(0.03)^2 + 2\\left(-\\frac{1}{32}\\right)(0.03)(-0.02) - \\frac{1}{32}(-0.02)^2 \\right]$$

$$P_2 = 2 + 0.0075 - 0.005 + \\frac{1}{64} [-0.0009 + 0.0012 - 0.0004] = 2.0025 - \\frac{0.0001}{64} \\approx \\mathbf{2.002498}$$

---

### Apartat b) $\\sqrt[3]{0.98 \\times 1.02}$

**1. Definició de la funció i punt base:**
Considerem $f(x,y) = (xy)^{1/3}$. Aproximem en $(0.98, 1.02)$. Punt base $P(1,1)$. Increment: $h = -0.02, \\, k = 0.02$.

**2. Càlcul de derivades en $P(1,1)$:**
*   $f(1,1) = 1$
*   $\\frac{\\partial f}{\\partial x} = \\frac{y}{3(xy)^{2/3}} \\implies \\frac{\\partial f}{\\partial x}(1,1) = \\frac{1}{3}$
*   $\\frac{\\partial f}{\\partial y} = \\frac{x}{3(xy)^{2/3}} \\implies \\frac{\\partial f}{\\partial y}(1,1) = \\frac{1}{3}$
*   $\\frac{\\partial^2 f}{\\partial x^2} = -\\frac{2y^2}{9(xy)^{5/3}} \\implies \\frac{\\partial^2 f}{\\partial x^2}(1,1) = -\\frac{2}{9}$
*   $\\frac{\\partial^2 f}{\\partial y^2} = -\\frac{2}{9}$
*   $\\frac{\\partial^2 f}{\\partial y \\partial x} = \\frac{3(xy)^{2/3} - y \\cdot 2(xy)^{-1/3}x}{9(xy)^{4/3}} \\implies \\frac{\\partial^2 f}{\\partial y \\partial x}(1,1) = \\frac{3-2}{9} = \\frac{1}{9}$

**3. Aproximació:**
Com que $h = -k$ i $\\frac{\\partial f}{\\partial x} = \\frac{\\partial f}{\\partial y}$, el terme de primer grau s'anul·la: $\\frac{\\partial f}{\\partial x}h + \\frac{\\partial f}{\\partial y}k = 0$.

$$P_2 = 1 + 0 + \\frac{1}{2} \\left[ -\\frac{2}{9}(-0.02)^2 + 2\\left(\\frac{1}{9}\\right)(-0.02)(0.02) - \\frac{2}{9}(0.02)^2 \\right]$$

$$P_2 = 1 + \\frac{1}{18} [-2(0.0004) - 2(0.0004) - 2(0.0004)] = 1 - \\frac{0.0024}{18} = 1 - 0.000133 \\approx \\mathbf{0.999867}$$

---

### Apartat c) $0.95^{2.01}$

**1. Definició de la funció i punt base:**
Considerem $f(x,y) = x^y$. Aproximem en $(0.95, 2.01)$. Punt base $P(1,2)$. Increment: $h = -0.05, \\, k = 0.01$.

**2. Càlcul de derivades en $P(1,2)$:**
*   $f(1,2) = 1^2 = 1$
*   $\\frac{\\partial f}{\\partial x} = y x^{y-1} \\implies \\frac{\\partial f}{\\partial x}(1,2) = 2 \\cdot 1^1 = 2$
*   $\\frac{\\partial f}{\\partial y} = x^y \\ln x \\implies \\frac{\\partial f}{\\partial y}(1,2) = 1^2 \\cdot \\ln 1 = 0$
*   $\\frac{\\partial^2 f}{\\partial x^2} = y(y-1) x^{y-2} \\implies \\frac{\\partial^2 f}{\\partial x^2}(1,2) = 2(1) \\cdot 1^0 = 2$
*   $\\frac{\\partial^2 f}{\\partial y^2} = x^y (\\ln x)^2 \\implies \\frac{\\partial^2 f}{\\partial y^2}(1,2) = 1^2 \\cdot (0)^2 = 0$
*   $\\frac{\\partial^2 f}{\\partial y \\partial x} = x^{y-1} (1 + y \\ln x) \\implies \\frac{\\partial^2 f}{\\partial y \\partial x}(1,2) = 1^1 (1 + 2 \\cdot 0) = 1$

**3. Aproximació:**

$$P_2 = 1 + 2(-0.05) + 0(0.01) + \\frac{1}{2} \\left[ 2(-0.05)^2 + 2(1)(-0.05)(0.01) + 0 \\right]$$

$$P_2 = 1 - 0.1 + \\frac{1}{2} [0.005 - 0.001] = 0.9 + 0.002 = \\mathbf{0.902}$$`,
  availableLanguages: ['ca']
};
