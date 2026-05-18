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

Per utilitzar el mètode de Lagrange, primer hem d'expressar la restricció de la frontera de la forma $g(x,y) = 0$. Partim de l'equació de la frontera:
$$x^2 + y^2 - 4x - 2y = 20 \\implies x^2 + y^2 - 4x - 2y - 20 = 0$$

Completem els quadrats per a cadascuna de les variables:
- **Termes en $x$:** $x^2 - 4x = (x-2)^2 - 4$
- **Termes en $y$:** $y^2 - 2y = (y-1)^2 - 1$

Substituint aquests valors a l'equació:
$$((x-2)^2 - 4) + ((y-1)^2 - 1) - 20 = 0 \\implies (x-2)^2 + (y-1)^2 - 25 = 0$$

Així doncs, definim la lligadura com a $g(x,y) = (x-2)^2 + (y-1)^2 - 25 = 0$ (la circumferència de centre $(2,1)$ i radi $5$). Ara hem de minimitzar/maximitzar $h(x,y) = -8x - 6y + 70$ subjecte a $g(x,y) = 0$.

**Mètode de Lagrange:**

Definim el Lagrangià de la següent manera:
$$L(x,y,\\lambda) = (-8x - 6y + 70) - \\lambda((x-2)^2 + (y-1)^2 - 25)$$

Busquem els punts on les derivades parcials de $L$ respecte $x$, $y$ i $\\lambda$ s'anul·len (sistema d'equacions de Lagrange):

$$\\frac{\\partial L}{\\partial x} = -8 - 2\\lambda(x-2) = 0$$

Aïllem el terme $(x-2)$ suposant $\\lambda \\neq 0$ (si $\\lambda = 0$, tindríem $-8 = 0$, la qual cosa és impossible):

$$-2\\lambda(x-2) = 8 \\implies \\lambda(x-2) = -4 \\implies \\mathbf{x-2 = \\frac{-4}{\\lambda}} \\quad \\text{(Eq. 1)}$$

$$\\frac{\\partial L}{\\partial y} = -6 - 2\\lambda(y-1) = 0$$

Aïllem el terme $(y-1)$ de manera similar:

$$-2\\lambda(y-1) = 6 \\implies \\lambda(y-1) = -3 \\implies \\mathbf{y-1 = \\frac{-3}{\\lambda}} \\quad \\text{(Eq. 2)}$$

$$\\frac{\\partial L}{\\partial \\lambda} = -((x-2)^2 + (y-1)^2 - 25) = 0 \\implies \\mathbf{(x-2)^2 + (y-1)^2 = 25} \\quad \\text{(Eq. 3)}$$

Ara, substituïm les expressions de $(x-2)$ de l'Eq. 1 i de $(y-1)$ de l'Eq. 2 a l'Eq. 3:

$$\\left(\\frac{-4}{\\lambda}\\right)^2 + \\left(\\frac{-3}{\\lambda}\\right)^2 = 25$$

Resolem aquesta equació per trobar $\\lambda$:

$$\\frac{16}{\\lambda^2} + \\frac{9}{\\lambda^2} = 25 \\implies \\frac{25}{\\lambda^2} = 25 \\implies \\lambda^2 = 1 \\implies \\mathbf{\\lambda = \\pm 1}$$

Avaluem els dos possibles valors de $\\lambda$ per trobar els punts candidats $(x,y)$:

### Si $\\lambda = 1$**

Substituïm $\\lambda = 1$ a les equacions Eq. 1 i Eq. 2:

$$

x-2 = \\frac{-4}{1} = -4 \\implies x = -4 + 2 \\implies \\mathbf{x = -2}
$$

$$

y-1 = \\frac{-3}{1} = -3 \\implies y = -3 + 1 \\implies \\mathbf{y = -2}
$$

**Això ens dóna el punt candidat:** **$(-2, -2)$**

### Si $\\lambda = -1$**

Substituïm $\\lambda = -1$ a les equacions Eq. 1 i Eq. 2:

$$
x-2 = \\frac{-4}{-1} = 4 \\implies x = 4 + 2 \\implies \\mathbf{x = 6}
$$

$$
y-1 = \\frac{-3}{-1} = 3 \\implies y = 3 + 1 \\implies \\mathbf{y = 4}
$$

**Això ens dóna el punt candidat:** **$(6, 4)$**

### 3. Conclusió
Avaluem la funció $f$ en els dos candidats trobats:
- $f(-2, -2) = -8(-2) - 6(-2) + 70 = 16 + 12 + 70 = \\mathbf{98}$
- $f(6, 4) = -8(6) - 6(4) + 70 = -48 - 24 + 70 = \\mathbf{-2}$

El **màxim absolut** és $98$ al punt $(-2, -2)$ i el **mínim absolut** és $-2$ al punt $(6, 4)$.`,
  availableLanguages: ['ca']
};
