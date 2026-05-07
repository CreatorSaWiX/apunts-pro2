import type { Solution } from '../../../solutions';

export const ex8_5: Solution = {
   id: 'M2-T8-Ex5',
   title: 'Exercici 5: Pla tangent i recta normal',
   author: 'SaWiX',
   code: '',
   type: 'notebook',
   statement: `Trobeu l'equació del pla tangent i de la recta normal a les superfícies següents en els punts indicats:
  
a) $z = x^2 + y^2$ en el punt $(1, 2, 5)$;

b) $z = \\arctan(y/x)$ en el punt $(1, 1, \\pi/4)$.`,
   content: `### Fonaments teòrics
Per a una superfície definida explícitament com $z = f(x,y)$, el pla tangent en el punt $P(x_0, y_0, z_0)$ es calcula com:
* **Pla Tangent**: $\\frac{\\partial f}{\\partial x}(P)(x-x_0) + \\frac{\\partial f}{\\partial y}(P)(y-y_0) - (z-z_0) = 0$
* **Recta Normal**: En forma contínua és $\\frac{x-x_0}{\\frac{\\partial f}{\\partial x}(P)} = \\frac{y-y_0}{\\frac{\\partial f}{\\partial y}(P)} = \\frac{z-z_0}{-1}$

---

### Apartat a) $z = x^2 + y^2$ a $(1, 2, 5)$
1. **Derivades parcials**:
   * $\\frac{\\partial f}{\\partial x} = 2x \\implies \\frac{\\partial f}{\\partial x}(1,2) = 2$
   * $\\frac{\\partial f}{\\partial y} = 2y \\implies \\frac{\\partial f}{\\partial y}(1,2) = 4$
   * Per al vector normal, fem $F(x,y,z) = f(x,y) - z \\implies \\frac{\\partial F}{\\partial z} = -1$

2. **Pla Tangent**:
   $2(x-1) + 4(y-2) - (z-5) = 0 \\implies 2x - 2 + 4y - 8 - z + 5 = 0$
   **$$2x + 4y - z - 5 = 0$$**

3. **Recta Normal**:
   **$$\\frac{x-1}{2} = \\frac{y-2}{4} = \\frac{z-5}{-1}$$**

---

### Apartat b) $z = \\arctan(y/x)$ a $(1, 1, \\pi/4)$
1. **Derivades parcials**:
   * $\\frac{\\partial f}{\\partial x} = \\frac{1}{1+(y/x)^2} \\cdot \\frac{-y}{x^2} = \\frac{-y}{x^2+y^2} \\implies \\frac{\\partial f}{\\partial x}(1,1) = -1/2$
   * $\\frac{\\partial f}{\\partial y} = \\frac{1}{1+(y/x)^2} \\cdot \\frac{1}{x} = \\frac{x}{x^2+y^2} \\implies \\frac{\\partial f}{\\partial y}(1,1) = 1/2$
   * Com abans, si fem $F(x,y,z) = f(x,y) - z$, llavors $\\frac{\\partial F}{\\partial z} = -1$

2. **Pla Tangent**:
   $-\\frac{1}{2}(x-1) + \\frac{1}{2}(y-1) - (z-\\pi/4) = 0$
   Multiplicant per 2: $-(x-1) + (y-1) - 2(z-\\pi/4) = 0 \\implies -x + 1 + y - 1 - 2z + \\pi/2 = 0$
   **$$-x + y - 2z + \\pi/2 = 0$$**

3. **Recta Normal**:
   **$$\\frac{x-1}{-1/2} = \\frac{y-1}{1/2} = \\frac{z-\\pi/4}{-1}$$**
`,
   availableLanguages: ['ca']
};
