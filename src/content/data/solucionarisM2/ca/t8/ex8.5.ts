import type { Solution } from '../../../solutions';

export const ex8_5: Solution = {
  id: 'M2-T8-Ex5',
  title: 'Exercici 5: Pla tangent i recta normal',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Escriure les equacions del pla tangent i de la recta normal a:
  
a) la superfície $z = x^2 + y^2$, en el punt $M = (1, 2, 5)$;
b) la superfície $z = \\arctan \\frac{y}{x}$, en el punt $M = (1, 1, \\frac{\\pi}{4})$.`,
  content: `### Fonaments teòrics
Per a superfícies en forma explícita $z = f(x,y)$:
* **Condició**: Si $f$ és de classe $C^1$ al punt, el pla tangent existeix.
* **Pla Tangent**: $f_x(P)(x-x_0) + f_y(P)(y-y_0) - (z-z_0) = 0$
* **Recta Normal**: En forma contínua és $\\frac{x-x_0}{f_x} = \\frac{y-y_0}{f_y} = \\frac{z-z_0}{-1}$

---

### Apartat a) $z = x^2 + y^2$ a $M(1, 2, 5)$
1. **Diferenciabilitat**: Funció polinòmica $\implies C^1$.
2. **Parcials**:
   * $f_x = 2x \\implies f_x(1,2) = 2$
   * $f_y = 2y \\implies f_y(1,2) = 4$
3. **Pla tangent**:
   $2(x - 1) + 4(y - 2) - (z - 5) = 0 \\implies 2x - 2 + 4y - 8 - z + 5 = 0$
   **$$2x + 4y - z - 5 = 0$$**
4. **Recta normal**:
   **$$\\frac{x-1}{2} = \\frac{y-2}{4} = \\frac{z-5}{-1}$$**

---

### Apartat b) $z = \\arctan(y/x)$ a $M(1, 1, \\pi/4)$
1. **Diferenciabilitat**: Funció $C^1$ en un entorn de $(1,1)$.
2. **Parcials**:
   * $f_x = \\frac{1}{1+(y/x)^2} \\cdot \\frac{-y}{x^2} = \\frac{-y}{x^2+y^2} \\implies f_x(1,1) = -1/2$
   * $f_y = \\frac{1}{1+(y/x)^2} \\cdot \\frac{1}{x} = \\frac{x}{x^2+y^2} \\implies f_y(1,1) = 1/2$
3. **Pla tangent**:
   $-\\frac{1}{2}(x - 1) + \\frac{1}{2}(y - 1) - (z - \\pi/4) = 0$
   Multiplicant per -2: $(x-1) - (y-1) + 2(z - \\pi/4) = 0$
   **$$x - y + 2z - \\pi/2 = 0$$**
4. **Recta normal**:
   **$$\\frac{x-1}{-1/2} = \\frac{y-1}{1/2} = \\frac{z-\\pi/4}{-1}$$**
`,
  availableLanguages: ['ca']
};
