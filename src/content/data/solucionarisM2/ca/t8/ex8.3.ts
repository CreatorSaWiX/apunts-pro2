import type { Solution } from '../../../solutions';

export const ex8_3: Solution = {
  id: 'M2-T8-Ex3',
  title: 'Exercici 3: Derivada direccional amb angle',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Trobar la derivada de la funció $z = x^2 - y^2$ en el punt $M(1,1)$ en la direcció que forma un angle de $\\pi/3$ amb la direcció positiva de l'eix $OX$.`,
  content: `### 1. Condició de diferenciabilitat
Com que $z = f(x,y) = x^2 - y^2$ és un polinomi, sabem que $f \\in C^1(\\mathbb{R}^2)$. Per tant, és diferenciable al punt $M(1,1)$ i podem usar la fórmula del gradient.

### 2. Vector director $\\vec{v}$
La direcció ve donada per l'angle $\\alpha = \\pi/3$. El vector unitari és:
$$\\vec{v} = (\\cos \\alpha, \\sin \\alpha) = (\\cos(\\pi/3), \\sin(\\pi/3)) = \\left(\\frac{1}{2}, \\frac{\\sqrt{3}}{2}\\right)$$

### 3. Gradient $\\nabla f(M)$
Calculm les derivades parcials al punt $M(1,1)$:
* $f_x = 2x \\implies f_x(1,1) = 2$
* $f_y = -2y \\implies f_y(1,1) = -2$
$$\\nabla f(1,1) = (2, -2)$$

### 4. Derivada direccional
Apliquem el producte escalar:
$$D_{\\vec{v}} f(M) = \\nabla f(M) \\cdot \\vec{v} = (2, -2) \\cdot \\left(\\frac{1}{2}, \\frac{\\sqrt{3}}{2}\\right)$$
$$D_{\\vec{v}} f(1,1) = 1 - \\sqrt{3}$$
`,
  availableLanguages: ['ca']
};
