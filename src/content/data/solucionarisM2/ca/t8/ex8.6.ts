import type { Solution } from '../../../solutions';

export const ex8_6: Solution = {
  id: 'M2-T8-Ex6',
  title: 'Exercici 6: Pla tangent horitzontal',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Trobeu el punt de la superfície $z = 4x + 2y - x^2 + xy - y^2$ en el qual el pla tangent és paral·lel al pla $XY$.`,
  content: `### Anàlisi del problema
Si el pla tangent a la superfície $z = f(x,y)$ ha de ser paral·lel al pla $XY$ (horitzontal), el seu vector normal $(\\frac{\\partial f}{\\partial x}, \\frac{\\partial f}{\\partial y}, -1)$ ha de ser paral·lel al vector $\\vec{k} = (0,0,1)$.

Això implica que les derivades parcials en aquell punt han de ser **zero**:
$$\\frac{\\partial f}{\\partial x}(x,y) = 0 \\quad \\text{i} \\quad \\frac{\\partial f}{\\partial y}(x,y) = 0$$

### 1. Sistema d'equacions
Derivem la funció $f(x,y) = 4x + 2y - x^2 + xy - y^2$:
1. $\\frac{\\partial f}{\\partial x} = 4 - 2x + y = 0 \\implies y = 2x - 4$
2. $\\frac{\\partial f}{\\partial y} = 2 + x - 2y = 0$

### 2. Resolució
Substituïm (1) en (2):
$2 + x - 2(2x - 4) = 0 \\implies 2 + x - 4x + 8 = 0$

$10 - 3x = 0 \\implies x = 10/3$

Trobem $y$:
$y = 2(10/3) - 4 = 20/3 - 12/3 = 8/3$

### 3. Càlcul de la coordenada $z$
$z = 4(10/3) + 2(8/3) - (10/3)^2 + (10/3)(8/3) - (8/3)^2$

$z = \\frac{40}{3} + \\frac{16}{3} - \\frac{100}{9} + \\frac{80}{9} - \\frac{64}{9}$

$z = \\frac{168}{9} - \\frac{100}{9} + \\frac{80}{9} - \\frac{64}{9} = \\frac{84}{9} = \\frac{28}{3}$

**El punt és: $P = (10/3, 8/3, 28/3)$**
`,
  availableLanguages: ['ca']
};
