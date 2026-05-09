import type { Solution } from '../../../solutions';

export const ex9_5: Solution = {
  id: 'M2-T9-Ex5',
  title: 'Exercici 5: Derivades parcials de primer i segon ordre',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Trobeu les derivades parcials de primer i segon ordre de les funcions següents:

a) $f(x,y) = x^4 + y^4 - 4x^2y^2$

b) $f(x,y) = \\ln(x^2 + y^2)$

c) $f(x,y) = xy + \\frac{x}{y}$

d) $f(x,y) = \\arctan \\frac{x}{y}$

e) $f(x,y) = x \\sin(x+y)$

f) $f(x,y) = (x^2 + y^2)e^{x+y}$

g) $f(x,y,z) = x^{y/z}$

h) $f(x,y,z) = xyz e^{x+y+z}$`,
  content: `### Apartat a) $f(x,y) = x^4 + y^4 - 4x^2y^2$
**Derivades de primer ordre:**
*   $\\frac{\\partial f}{\\partial x} = 4x^3 - 8xy^2$
*   $\\frac{\\partial f}{\\partial y} = 4y^3 - 8x^2y$

**Derivades de segon ordre:**
*   $\\frac{\\partial^2 f}{\\partial x^2} = 12x^2 - 8y^2$
*   $\\frac{\\partial^2 f}{\\partial y^2} = 12y^2 - 8x^2$
*   $\\frac{\\partial^2 f}{\\partial y \\partial x} = -16xy$

---

### Apartat b) $f(x,y) = \\ln(x^2 + y^2)$
**Derivades de primer ordre:**
*   $\\frac{\\partial f}{\\partial x} = \\frac{2x}{x^2+y^2}$
*   $\\frac{\\partial f}{\\partial y} = \\frac{2y}{x^2+y^2}$

**Derivades de segon ordre:**
*   $\\frac{\\partial^2 f}{\\partial x^2} = \\frac{2(y^2-x^2)}{(x^2+y^2)^2}$
*   $\\frac{\\partial^2 f}{\\partial y^2} = \\frac{2(x^2-y^2)}{(x^2+y^2)^2}$
*   $\\frac{\\partial^2 f}{\\partial y \\partial x} = \\frac{-4xy}{(x^2+y^2)^2}$

---

### Apartat c) $f(x,y) = xy + \\frac{x}{y}$
**Derivades de primer ordre:**
*   $\\frac{\\partial f}{\\partial x} = y + \\frac{1}{y}$
*   $\\frac{\\partial f}{\\partial y} = x - \\frac{x}{y^2}$

**Derivades de segon ordre:**
*   $\\frac{\\partial^2 f}{\\partial x^2} = 0$
*   $\\frac{\\partial^2 f}{\\partial y^2} = \\frac{2x}{y^3}$
*   $\\frac{\\partial^2 f}{\\partial y \\partial x} = 1 - \\frac{1}{y^2}$

---

### Apartat d) $f(x,y) = \\arctan \\frac{x}{y}$
**Derivades de primer ordre:**
*   $\\frac{\\partial f}{\\partial x} = \\frac{1/y}{1+(x/y)^2} = \\frac{y}{x^2+y^2}$
*   $\\frac{\\partial f}{\\partial y} = \\frac{-x/y^2}{1+(x/y)^2} = \\frac{-x}{x^2+y^2}$

**Derivades de segon ordre:**
*   $\\frac{\\partial^2 f}{\\partial x^2} = \\frac{-2xy}{(x^2+y^2)^2}$
*   $\\frac{\\partial^2 f}{\\partial y^2} = \\frac{2xy}{(x^2+y^2)^2}$
*   $\\frac{\\partial^2 f}{\\partial y \\partial x} = \\frac{x^2-y^2}{(x^2+y^2)^2}$

---

### Apartat e) $f(x,y) = x \\sin(x+y)$
**Derivades de primer ordre:**
*   $\\frac{\\partial f}{\\partial x} = \\sin(x+y) + x \\cos(x+y)$
*   $\\frac{\\partial f}{\\partial y} = x \\cos(x+y)$

**Derivades de segon ordre:**
*   $\\frac{\\partial^2 f}{\\partial x^2} = 2\\cos(x+y) - x\\sin(x+y)$
*   $\\frac{\\partial^2 f}{\\partial y^2} = -x \\sin(x+y)$
*   $\\frac{\\partial^2 f}{\\partial y \\partial x} = \\cos(x+y) - x \\sin(x+y)$

---

### Apartat f) $f(x,y) = (x^2 + y^2)e^{x+y}$
**Derivades de primer ordre:**
*   $\\frac{\\partial f}{\\partial x} = (x^2 + y^2 + 2x)e^{x+y}$
*   $\\frac{\\partial f}{\\partial y} = (x^2 + y^2 + 2y)e^{x+y}$

**Derivades de segon ordre:**
*   $\\frac{\\partial^2 f}{\\partial x^2} = (x^2 + y^2 + 4x + 2)e^{x+y}$
*   $\\frac{\\partial^2 f}{\\partial y^2} = (x^2 + y^2 + 4y + 2)e^{x+y}$
*   $\\frac{\\partial^2 f}{\\partial y \\partial x} = (x^2 + y^2 + 2x + 2y)e^{x+y}$

---

### Apartat g) $f(x,y,z) = x^{y/z}$
**Derivades de primer ordre:**
*   $\\frac{\\partial f}{\\partial x} = \\frac{y}{z} x^{y/z - 1}$
*   $\\frac{\\partial f}{\\partial y} = \\frac{x^{y/z} \\ln x}{z}$
*   $\\frac{\\partial f}{\\partial z} = -\\frac{y x^{y/z} \\ln x}{z^2}$

---

### Apartat h) $f(x,y,z) = xyz e^{x+y+z}$
**Derivades de primer ordre:**
*   $\\frac{\\partial f}{\\partial x} = yz(x + 1)e^{x+y+z}$
*   $\\frac{\\partial f}{\\partial y} = xz(y + 1)e^{x+y+z}$
*   $\\frac{\\partial f}{\\partial z} = xy(z + 1)e^{x+y+z}$

**Derivades de segon ordre (parcials):**
*   $\\frac{\\partial^2 f}{\\partial x^2} = yz(x + 2)e^{x+y+z}$
*   $\\frac{\\partial^2 f}{\\partial y \\partial x} = z(x + 1)(y + 1)e^{x+y+z}$`,
  availableLanguages: ['ca']
};
