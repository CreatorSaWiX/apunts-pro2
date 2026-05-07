import type { Solution } from '../../../solutions';

export const ex8_7: Solution = {
  id: 'M2-T8-Ex7',
  title: 'Exercici 7: Gradient en 3 variables',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Calculeu el gradient de les funcions següents en els punts indicats:
  
a) $f(x,y,z) = \\ln(z + \\sin(y^2-x))$ en el punt $(1, -1, 1)$;

b) $f(x,y,z) = e^{3x+y} \\sin(5z)$ en el punt $(0, 0, \\pi/6)$;

c) $f(x,y,z) = \\int_x^{xy+z^2} \\frac{\\sin t}{t} dt$ en el punt $(\\pi/2, 1, 0)$.`,
  content: `### Apartat a) $f(x,y,z) = \\ln(z + \\sin(y^2-x))$
Calculem les derivades parcials a $P(1,-1,1)$:
* $\\frac{\\partial f}{\\partial x} = \\frac{-\\cos(y^2-x)}{z + \\sin(y^2-x)} \\implies \\frac{\\partial f}{\\partial x}(1,-1,1) = \\frac{-\\cos(0)}{1 + \\sin(0)} = -1$
* $\\frac{\\partial f}{\\partial y} = \\frac{2y \\cos(y^2-x)}{z + \\sin(y^2-x)} \\implies \\frac{\\partial f}{\\partial y}(1,-1,1) = \\frac{2(-1)\\cos(0)}{1} = -2$
* $\\frac{\\partial f}{\\partial z} = \\frac{1}{z + \\sin(y^2-x)} \\implies \\frac{\\partial f}{\\partial z}(1,-1,1) = \\frac{1}{1} = 1$

**$$\\nabla f(1,-1,1) = (-1, -2, 1)$$**

---

### Apartat b) $f(x,y,z) = e^{3x+y} \\sin(5z)$
Calculem les derivades parcials a $P(0,0,\\pi/6)$:
* $\\frac{\\partial f}{\\partial x} = 3e^{3x+y} \\sin(5z) \\implies \\frac{\\partial f}{\\partial x}(0,0,\\pi/6) = 3(1)\\sin(5\\pi/6) = 3 \\cdot \\frac{1}{2} = 3/2$
* $\\frac{\\partial f}{\\partial y} = e^{3x+y} \\sin(5z) \\implies \\frac{\\partial f}{\\partial y}(0,0,\\pi/6) = 1 \\cdot \\frac{1}{2} = 1/2$
* $\\frac{\\partial f}{\\partial z} = 5e^{3x+y} \\cos(5z) \\implies \\frac{\\partial f}{\\partial z}(0,0,\\pi/6) = 5(1)\\cos(5\\pi/6) = 5 \\cdot \\left(-\\frac{\\sqrt{3}}{2}\\right) = -\\frac{5\\sqrt{3}}{2}$

**$$\\nabla f(0,0,\\pi/6) = (3/2, 1/2, -5\\sqrt{3}/2)$$**

---

### Apartat c) $f(x,y,z) = \\int_x^{xy+z^2} \\frac{\\sin t}{t} dt$
Apliquem el Teorema Fonamental del Càlcul i la regla de la cadena:
* $\\frac{\\partial f}{\\partial x} = \\frac{\\sin(xy+z^2)}{xy+z^2} \\cdot y - \\frac{\\sin x}{x} \\implies \\frac{\\partial f}{\\partial x}(\\pi/2, 1, 0) = \\frac{\\sin(\\pi/2)}{\\pi/2} \\cdot 1 - \\frac{\\sin(\\pi/2)}{\\pi/2} = 0$
* $\\frac{\\partial f}{\\partial y} = \\frac{\\sin(xy+z^2)}{xy+z^2} \\cdot x \\implies \\frac{\\partial f}{\\partial y}(\\pi/2, 1, 0) = \\frac{\\sin(\\pi/2)}{\\pi/2} \\cdot \\frac{\\pi}{2} = 1$
* $\\frac{\\partial f}{\\partial z} = \\frac{\\sin(xy+z^2)}{xy+z^2} \\cdot 2z \\implies \\frac{\\partial f}{\\partial z}(\\pi/2, 1, 0) = \\dots \\cdot 0 = 0$

**$$\\nabla f(\\pi/2, 1, 0) = (0, 1, 0)$$**
`,
  availableLanguages: ['ca']
};
