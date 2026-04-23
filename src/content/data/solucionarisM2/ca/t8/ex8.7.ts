import type { Solution } from '../../../solutions';

export const ex8_7: Solution = {
  id: 'M2-T8-Ex7',
  title: 'Exercici 7: Càlcul de gradients',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Trobeu el gradient de les funcions següents:
  
a) $f(x,y,z) = \\ln(z + \\sin(y^2 - x))$ en el punt $(1, -1, 1)$;
b) $f(x,y,z) = e^{3x+y} \\sin(5z)$ en el punt $(0, 0, \\pi/6)$;
c) $f(x,y,z) = \\int_x^{xy+z^2} \\frac{\\sin t}{t} dt$ en el punt $(\\pi/2, 1, 0)$.`,
  content: `### Apartat a) $f(x,y,z) = \\ln(z + \\sin(y^2 - x))$ a $(1, -1, 1)$
1. **Derivades parcials**:
   * $f_x = \\frac{-\\cos(y^2-x)}{z + \\sin(y^2-x)} \\implies f_x(1,-1,1) = \\frac{-\\cos(0)}{1 + \\sin(0)} = -1$
   * $f_y = \\frac{2y \\cos(y^2-x)}{z + \\sin(y^2-x)} \\implies f_y(1,-1,1) = \\frac{2(-1)\\cos(0)}{1} = -2$
   * $f_z = \\frac{1}{z + \\sin(y^2-x)} \\implies f_z(1,-1,1) = \\frac{1}{1} = 1$

**$$\\nabla f(1,-1,1) = (-1, -2, 1)$$**

---

### Apartat b) $f(x,y,z) = e^{3x+y} \\sin(5z)$ a $(0, 0, \\pi/6)$
1. **Derivades parcials**:
   * $f_x = 3e^{3x+y} \\sin(5z) \\implies f_x(0,0,\\pi/6) = 3(1)\\sin(5\\pi/6) = 3 \\cdot \\frac{1}{2} = 3/2$
   * $f_y = e^{3x+y} \\sin(5z) \\implies f_y(0,0,\\pi/6) = 1 \\cdot \\frac{1}{2} = 1/2$
   * $f_z = 5e^{3x+y} \\cos(5z) \\implies f_z(0,0,\\pi/6) = 5(1)\\cos(5\\pi/6) = 5 \\cdot \\left(-\\frac{\\sqrt{3}}{2}\\right) = -\\frac{5\\sqrt{3}}{2}$

**$$\\nabla f(0,0,\\pi/6) = (3/2, 1/2, -5\\sqrt{3}/2)$$**

---

### Apartat c) $f(x,y,z) = \\int_x^{xy+z^2} \\frac{\\sin t}{t} dt$ a $(\\pi/2, 1, 0)$
Usem el Teorema Fonamental del Càlcul: $\\frac{\\partial}{\\partial u} \\int_a^u g(t) dt = g(u)$.
1. **Derivades parcials**:
   * $f_x = \\frac{\\sin(xy+z^2)}{xy+z^2} \\cdot y - \\frac{\\sin x}{x} \\implies f_x(\\pi/2, 1, 0) = \\frac{\\sin(\\pi/2)}{\\pi/2} \\cdot 1 - \\frac{\\sin(\\pi/2)}{\\pi/2} = 0$
   * $f_y = \\frac{\\sin(xy+z^2)}{xy+z^2} \\cdot x \\implies f_y(\\pi/2, 1, 0) = \\frac{\\sin(\\pi/2)}{\\pi/2} \\cdot \\frac{\\pi}{2} = 1$
   * $f_z = \\frac{\\sin(xy+z^2)}{xy+z^2} \\cdot 2z \\implies f_z(\\pi/2, 1, 0) = \\dots \\cdot 0 = 0$

**$$\\nabla f(\\pi/2, 1, 0) = (0, 1, 0)$$**
`,
  availableLanguages: ['ca']
};
