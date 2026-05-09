import type { Solution } from '../../../solutions';

export const ex9_6: Solution = {
  id: 'M2-T9-Ex6',
  title: 'Exercici 6: Polinomi de Taylor de grau 2',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Trobeu el polinomi de Taylor de grau 2 de la funció $f(x,y) = xy^2 + \\sin xy$ en el punt $(1, \\pi/2)$.`,
  content: `### 1. Valor de la funció i derivades en el punt $(1, \\pi/2)$

El punt d'estudi és $P(1, \\pi/2)$. El valor de la funció és:
$$f(1, \\pi/2) = 1 \\cdot (\\pi/2)^2 + \\sin(1 \\cdot \\pi/2) = \\frac{\\pi^2}{4} + 1$$

**Derivades de primer ordre:**
*   $\\frac{\\partial f}{\\partial x} = y^2 + y \\cos(xy) \\implies \\frac{\\partial f}{\\partial x}(1, \\pi/2) = (\\pi/2)^2 + \\frac{\\pi}{2} \\cos(\\pi/2) = \\frac{\\pi^2}{4}$
*   $\\frac{\\partial f}{\\partial y} = 2xy + x \\cos(xy) \\implies \\frac{\\partial f}{\\partial y}(1, \\pi/2) = 2(1)(\\pi/2) + 1 \\cos(\\pi/2) = \\pi$

**Derivades de segon ordre:**
*   $\\frac{\\partial^2 f}{\\partial x^2} = -y^2 \\sin(xy) \\implies \\frac{\\partial^2 f}{\\partial x^2}(1, \\pi/2) = -(\\pi/2)^2 \\sin(\\pi/2) = -\\frac{\\pi^2}{4}$
*   $\\frac{\\partial^2 f}{\\partial y^2} = 2x - x^2 \\sin(xy) \\implies \\frac{\\partial^2 f}{\\partial y^2}(1, \\pi/2) = 2(1) - (1)^2 \\sin(\\pi/2) = 2 - 1 = 1$
*   $\\frac{\\partial^2 f}{\\partial y \\partial x} = 2y + \\cos(xy) - xy \\sin(xy) \\implies \\frac{\\partial^2 f}{\\partial y \\partial x}(1, \\pi/2) = 2(\\pi/2) + \\cos(\\pi/2) - (\\pi/2) \\sin(\\pi/2) = \\pi - \\frac{\\pi}{2} = \\frac{\\pi}{2}$

---

### 2. Construcció del Polinomi de Taylor de grau 2

Recordem la fórmula del polinomi de Taylor de grau 2:
$$P_2(x,y) = f(P) + \\left[ \\frac{\\partial f}{\\partial x}(P)h + \\frac{\\partial f}{\\partial y}(P)k \\right] + \\frac{1}{2} \\left[ \\frac{\\partial^2 f}{\\partial x^2}(P)h^2 + 2\\frac{\\partial^2 f}{\\partial y \\partial x}(P)hk + \\frac{\\partial^2 f}{\\partial y^2}(P)k^2 \\right]$$

On $h = (x-1)$ i $k = (y-\\pi/2)$. Substituint els valors calculats:

$$P_2(x,y) = \\left(\\frac{\\pi^2}{4} + 1\\right) + \\frac{\\pi^2}{4}(x-1) + \\pi(y-\\pi/2) + \\frac{1}{2} \\left[ -\\frac{\\pi^2}{4}(x-1)^2 + \\pi(x-1)(y-\\pi/2) + (y-\\pi/2)^2 \\right]$$

Aquest és el polinomi de Taylor de grau 2 centrat en $(1, \\pi/2)$.`,
  availableLanguages: ['ca']
};
