import type { Solution } from '../../../solutions';

export const ex8_10: Solution = {
  id: 'M2-T8-Ex10',
  title: 'Exercici 10: Pla tangent i recta normal (II)',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Calculeu la recta normal i el pla tangent a:
  
a) la superfície $z = \\frac{2xy}{x^2 + y}$ en el punt $(2, -2, -4)$;
b) la superfície $z = \\sin x + 2\\cos y$ en el punt $(\\pi/2, 0, 3)$.`,
  content: `### Fonaments
Recordem que per a una superfície $z = f(x,y)$, el vector normal al pla tangent és $(f_x, f_y, -1)$.

---

### Apartat a) $z = \\frac{2xy}{x^2 + y}$ a $(2, -2, -4)$
1. **Derivades parcials**:
   * $f_x = \\frac{2y(x^2+y) - 2x(2xy)}{(x^2+y)^2} = \\frac{2y^2 - 2x^2y}{(x^2+y)^2} \\implies f_x(2,-2) = \\frac{8 + 16}{(4-2)^2} = \\frac{24}{4} = 6$
   * $f_y = \\frac{2x(x^2+y) - 2xy}{(x^2+y)^2} = \\frac{2x^3}{(x^2+y)^2} \\implies f_y(2,-2) = \\frac{16}{4} = 4$

2. **Pla Tangent**:
   $6(x-2) + 4(y+2) - (z+4) = 0 \\implies 6x - 12 + 4y + 8 - z - 4 = 0$
   **$$6x + 4y - z - 8 = 0$$**

3. **Recta Normal**:
   **$$\\frac{x-2}{6} = \\frac{y+2}{4} = \\frac{z+4}{-1}$$**

---

### Apartat b) $z = \\sin x + 2\\cos y$ a $(\\pi/2, 0, 3)$
1. **Derivades parcials**:
   * $f_x = \\cos x \\implies f_x(\\pi/2, 0) = 0$
   * $f_y = -2\\sin y \\implies f_y(\\pi/2, 0) = 0$

2. **Pla Tangent**:
   $0(x-\\pi/2) + 0(y-0) - (z-3) = 0$
   **$$z = 3$$** (Pla horitzontal)

3. **Recta Normal**:
   Com que $f_x=0$ i $f_y=0$, el vector director de la normal és $(0,0,-1)$, una recta vertical:
   **$$x = \\pi/2, \\quad y = 0$$**
`,
  availableLanguages: ['ca']
};
