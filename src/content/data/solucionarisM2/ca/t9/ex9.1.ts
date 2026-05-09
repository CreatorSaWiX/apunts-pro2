import type { Solution } from '../../../solutions';

export const ex9_1: Solution = {
  id: 'M2-T9-Ex1',
  title: 'Exercici 1: Polinomi de Taylor de grau 2',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Donada la funció $f(x, y) = \\ln(1 + 2x + 3y)$:
  
a) Escriviu el polinomi de Taylor de grau 2 per a $f$ en el punt $(0,0)$.

b) Utilitzant el polinomi obtingut, calculeu un valor aproximat per a $f(1/10, 1/10)$ i fiteu l'error.`,
  content: `### Apartat a) Polinomi de Taylor de grau 2
Calculem el valor de la funció i les seves derivades parcials fins a segon ordre al punt $(0,0)$:

**1. Valor de la funció a l'origen:**
$$f(0,0) = \\ln(1 + 2(0) + 3(0)) = \\ln(1) = 0$$

**2. Derivades de primer ordre:**

$$\\frac{\\partial f}{\\partial x} = \\frac{2}{1+2x+3y} = 2(1+2x+3y)^{-1} \\implies \\frac{\\partial f}{\\partial x}(0,0) = 2$$

$$\\frac{\\partial f}{\\partial y} = \\frac{3}{1+2x+3y} = 3(1+2x+3y)^{-1} \\implies \\frac{\\partial f}{\\partial y}(0,0) = 3$$

**3. Derivades de segon ordre:**

$$\\frac{\\partial^2 f}{\\partial x^2} = -2(1+2x+3y)^{-2} \\cdot 2 = -4(1+2x+3y)^{-2} \\implies \\frac{\\partial^2 f}{\\partial x^2}(0,0) = -4$$

$$\\frac{\\partial^2 f}{\\partial y \\partial x} = -2(1+2x+3y)^{-2} \\cdot 3 = -6(1+2x+3y)^{-2} \\implies \\frac{\\partial^2 f}{\\partial y \\partial x}(0,0) = -6$$

$$\\frac{\\partial^2 f}{\\partial y^2} = -3(1+2x+3y)^{-2} \\cdot 3 = -9(1+2x+3y)^{-2} \\implies \\frac{\\partial^2 f}{\\partial y^2}(0,0) = -9$$

**4. Construcció del polinomi $P_{2, f(0,0)}(x,y)$:**

$$P_2(x,y) = f(0,0) + \\frac{\\partial f}{\\partial x}(0,0)x + \\frac{\\partial f}{\\partial y}(0,0)y + \\frac{1}{2} \\left[ \\frac{\\partial^2 f}{\\partial x^2}(0,0)x^2 + 2\\frac{\\partial^2 f}{\\partial x \\partial y}(0,0)xy + \\frac{\\partial^2 f}{\\partial y^2}(0,0)y^2 \\right]$$

$$P_2(x,y) = 0 + 2x + 3y + \\frac{1}{2} \\left[ -4x^2 + 2(-6)xy - 9y^2 \\right]$$

**$$P_2(x,y) = 2x + 3y - 2x^2 - 6xy - \\frac{9}{2}y^2$$**

---

### Apartat b) Aproximació i fita de l'error

**1. Valor aproximat de $f(1/10, 1/10)$:**

Substituïm $(x,y) = (0.1, 0.1)$ al polinomi:

$$f(0.1, 0.1) \\approx 2(0.1) + 3(0.1) - 2(0.1)^2 - 6(0.1)^2 - \\frac{9}{2}(0.1)^2$$

$$f(0.1, 0.1) \\approx \\frac{2}{10} + \\frac{3}{10} - \\frac{2}{100} - \\frac{6}{100} - \\frac{9}{200} = 0.5 - 0.08 - 0.045$$

**$$f(0.1, 0.1) \\approx 0.375$$**

**2. Acotació de l'error (Residu de Lagrange):**

L'error es calcula mitjançant el residu de tercer ordre. Seguint l'estructura d'una **identitat notable al cub** per a $h=0.1$ i $k=0.1$:

$$R_2(0.1, 0.1) = \\frac{1}{6} \\left[ (0.1)^3 \\frac{\\partial^3 f}{\\partial x^3}(c,d) + 3(0.1)^3 \\frac{\\partial^3 f}{\\partial y \\partial x^2}(c,d) + 3(0.1)^3 \\frac{\\partial^3 f}{\\partial x \\partial y^2}(c,d) + (0.1)^3 \\frac{\\partial^3 f}{\\partial y^3}(c,d) \\right]$$

Si factoritzem el terme $(0.1)^3$ i el denominador comú de les derivades, obtenim l'expressió de la pissarra:

$$|R_2| = \\left| \\frac{1}{6} \\frac{(0.1)^3}{(1+2c+3d)^3} \\left( 16 + 3 \\cdot 24 + 3 \\cdot 36 + 54 \\right) \\right|$$

On les derivades de tercer ordre al punt intermedi $(c,d)$ són:
* $\\frac{\\partial^3 f}{\\partial x^3}(c,d) = \\frac{16}{(1+2c+3d)^3}$
* $\\frac{\\partial^3 f}{\\partial y \\partial x^2}(c,d) = \\frac{24}{(1+2c+3d)^3}$
* $\\frac{\\partial^3 f}{\\partial x \\partial y^2}(c,d) = \\frac{36}{(1+2c+3d)^3}$
* $\\frac{\\partial^3 f}{\\partial y^3}(c,d) = \\frac{54}{(1+2c+3d)^3}$

Com que $0 \\leq c \\leq 0.1$ i $0 \\leq d \\leq 0.1$, el valor màxim s'assoleix quan el denominador és mínim (val 1):

$$|R_2| = \\frac{250(0.1)^3}{6(1+2c+3d)^3} \\leq \\frac{250(0.1)^3}{6} \\approx 0.0417$$
`,
  availableLanguages: ['ca']
};
