import type { Solution } from '../../../solutions';

export const ex8_1: Solution = {
  id: 'M2-T8-Ex1',
  title: 'Exercici 1: Derivades parcials de primer ordre',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Calculeu les derivades parcials de primer ordre de la funció:
  
$$f(x,y) = (e^x)^{e^y}$$`,
  content: `$$f(x,y) = (e^x)^{e^y} = e^{x \\cdot e^y}$$

### Derivada parcial respecte a $x$: $\\frac{\\partial f}{\\partial x}$

Considerem $y$ com una constant. La derivada de $e^{u(x)}$ és $e^{u(x)} \\cdot u'(x)$.

$$\\frac{\\partial f}{\\partial x} = \\frac{\\partial}{\\partial x} (e^{x e^y}) = e^{x e^y} \\cdot e^y = (e^x)^{e^y} e^y$$

### Derivada parcial respecte a $y$: $\\frac{\\partial f}{\\partial y}$

Considerem $x$ com una constant.

$$\\frac{\\partial f}{\\partial y} = \\frac{\\partial}{\\partial y} (e^{x e^y}) = e^{x e^y} \\cdot x e^y = (e^x)^{e^y} x e^y$$
`,
  availableLanguages: ['ca']
};
