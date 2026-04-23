import type { Solution } from '../../../solutions';

export const ex8_2: Solution = {
  id: 'M2-T8-Ex2',
  title: 'Exercici 2: Derivada direccional',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Donada $f(x,y) = x^2 + y^2$, calculeu la derivada direccional de la funció $f$ en el punt $P = (2,3)$ segons la direcció del vector $\\vec{v} = (3/5, 4/5)$.`,
  content: `Com que $f(x,y) = x^2 + y^2$ és una funció polinòmica, és de classe $C^1$ a tot $\\mathbb{R}^2$. Això ens garanteix que la funció és diferenciable al punt $P(2,3)$ i podem calcular la derivada direccional mitjançant el gradient.

$$|\\vec{v}| = \\sqrt{\\left(\\frac{3}{5}\\right)^2 + \\left(\\frac{4}{5}\\right)^2} = \\sqrt{\\frac{9}{25} + \\frac{16}{25}} = 1 \\implies \\text{Unitari}$$

$f_x = 2x \\implies f_x(2,3) = 4$
$f_y = 2y \\implies f_y(2,3) = 6$
$$\\nabla f(2,3) = (4, 6)$$

$$D_{\\vec{v}} f(P) = \\nabla f(P) \\cdot \\vec{v} = (4, 6) \\cdot \\left(\\frac{3}{5}, \\frac{4}{5}\\right)$$

$$D_{\\vec{v}} f(2,3) = \\frac{12}{5} + \\frac{24}{5} = \\frac{36}{5} = 7.2$$
`,
  availableLanguages: ['ca']
};
