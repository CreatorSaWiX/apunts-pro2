import type { Solution } from '../../../solutions';

export const ex10_3: Solution = {
  id: 'M2-T10-Ex3',
  title: 'Exercici 3: Extrems absoluts en un disc',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Calculeu els extrems absoluts que pren la funció $f(x,y) = x^2 + y^2 - 12x - 8y + 50$ sobre el domini definit per la inequació:
  $$x^2 + y^2 - 4x - 2y \\leq 20$$`,
  content: `Per trobar els extrems absoluts en un domini compacte, seguim el procediment de Weierstrass: analitzem l'interior del domini i després la seva frontera.

### 1. Punts crítics a l'interior
Busquem els punts on el gradient s'anul·la:
- $\\frac{\\partial f}{\\partial x} = 2x - 12 = 0 \\implies \\mathbf{x = 6}$
- $\\frac{\\partial f}{\\partial y} = 2y - 8 = 0 \\implies \\mathbf{y = 4}$

Hem de comprovar si el punt $(6, 4)$ es troba dins del domini definit per $x^2 + y^2 - 4x - 2y \\leq 20$:

$$
6^2 + 4^2 - 4(6) - 2(4) = 36 + 16 - 24 - 8 = 20
$$

Com que el valor és exactament $20$, el punt $(6, 4)$ no és un punt interior, sinó que es troba a la **frontera**. Per tant, no hi ha cap extrem relatiu dins del domini.

### 2. Estudi de la frontera

La frontera és la circumferència d'equació $x^2 + y^2 - 4x - 2y = 20$. 

Podem aprofitar aquesta igualtat per simplificar la funció $f(x,y)$ sobre la frontera. Aïllem el terme $x^2 + y^2$:

$$
x^2 + y^2 = 4x + 2y + 20
$$

Substituïm això a l'expressió de $f$:

$$
f(x,y) = (x^2 + y^2) - 12x - 8y + 50 = (4x + 2y + 20) - 12x - 8y + 50 = \\mathbf{-8x - 6y + 70}
$$

Ara hem de minimitzar/maximitzar $h(x,y) = -8x - 6y + 70$ subjecte a $g(x,y) = (x-2)^2 + (y-1)^2 - 25 = 0$ (completant quadrats a l'equació de la frontera).

**Mètode de Lagrange:**

Definim $L(x,y,\\lambda) = (-8x - 6y + 70) - \\lambda((x-2)^2 + (y-1)^2 - 25)$.
1.  $\\frac{\\partial L}{\\partial x} = -8 - 2\\lambda(x-2) = 0 \\implies \\mathbf{x-2 = -4/\\lambda}$
2.  $\\frac{\\partial L}{\\partial y} = -6 - 2\\lambda(y-1) = 0 \\implies \\mathbf{y-1 = -3/\\lambda}$
3.  $(x-2)^2 + (y-1)^2 = 25$

Substituïm (1) i (2) a (3):

$$\\left(\\frac{-4}{\\lambda}\\right)^2 + \\left(\\frac{-3}{\\lambda}\\right)^2 = 25 \\implies \\frac{16}{\\lambda^2} + \\frac{9}{\\lambda^2} = 25 \\implies \\frac{25}{\\lambda^2} = 25 \\implies \\mathbf{\\lambda = \\pm 1}$$

- **Si $\\lambda = 1$**: $x-2 = -4 \\implies x = -2$ i $y-1 = -3 \\implies y = -2$. Punt **$(-2, -2)$**.
- **Si $\\lambda = -1$**: $x-2 = 4 \\implies x = 6$ i $y-1 = 3 \\implies y = 4$. Punt **$(6, 4)$**.

### 3. Conclusió
Avaluem la funció $f$ en els dos candidats trobats:
- $f(-2, -2) = -8(-2) - 6(-2) + 70 = 16 + 12 + 70 = \\mathbf{98}$
- $f(6, 4) = -8(6) - 6(4) + 70 = -48 - 24 + 70 = \\mathbf{-2}$

El **màxim absolut** és $98$ al punt $(-2, -2)$ i el **mínim absolut** és $-2$ al punt $(6, 4)$.`,
  availableLanguages: ['ca']
};
