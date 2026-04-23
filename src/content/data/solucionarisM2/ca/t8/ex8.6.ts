import type { Solution } from '../../../solutions';

export const ex8_6: Solution = {
  id: 'M2-T8-Ex6',
  title: 'Exercici 6: Pla tangent paral·lel a XY',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Sigui $f(x,y) = 4x + 2y - x^2 + xy - y^2$. Trobeu els punts de la superfície $z = f(x,y)$ tals que el seu pla tangent sigui paral·lel al pla $XY$.`,
  content: `### 1. Condició geomètrica
Si el pla tangent a la superfície $z = f(x,y)$ ha de ser paral·lel al pla $XY$ (horitzontal), el seu vector normal $(f_x, f_y, -1)$ ha de ser paral·lel al vector $\\vec{k} = (0,0,1)$.

Això només passa si les derivades parcials en el punt són nul·les:
$$f_x(x,y) = 0 \\quad \\text{i} \\quad f_y(x,y) = 0$$

### 2. Condició de diferenciabilitat
Com que $f(x,y)$ és un polinomi de segon grau, és de classe $C^1$ a tot $\\mathbb{R}^2$, per tant el pla tangent existeix a tots els punts de la superfície.

### 3. Resolució del sistema
Igualem les parcials a zero:
1. $f_x = 4 - 2x + y = 0 \\implies y = 2x - 4$
2. $f_y = 2 + x - 2y = 0$

Substituint la primera en la segona:
$$2 + x - 2(2x - 4) = 0 \\implies 2 + x - 4x + 8 = 0$$
$$10 - 3x = 0 \\implies x = 10/3$$

Trobem la $y$: $y = 2(10/3) - 4 = 20/3 - 12/3 = 8/3$.

### 4. Coordenada $z$ del punt
Substituïm $(10/3, 8/3)$ a la funció:
$$z = f(10/3, 8/3) = \\dots = 28/3$$

**Conclusió:** El punt buscat és **$P = (10/3, 8/3, 28/3)$**.
`,
  availableLanguages: ['ca']
};
