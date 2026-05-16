import type { Solution } from '../../../solutions';

export const ex10_1: Solution = {
  id: 'M2-T10-Ex1',
  title: 'Exercici 1: Extrems condicionats',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Estudieu els extrems de la funció $f(x,y) = x^2 + y^2$ quan les variables $(x,y)$ estan lligades per la condició:
  $$y + x^2 = 1$$`,
  content: `Per trobar els extrems de $f(x,y) = x^2 + y^2$ amb la condició $y + x^2 = 1$, podem reduir el problema a una sola variable mitjançant substitució directa, ja que la condició és lineal en $y$.

### 1. Reducció a una variable
De la condició $y + x^2 = 1$, aïllem la $y$:
$$y = 1 - x^2$$

Substituïm aquesta expressió a la funció a optimitzar:

$$f(x, 1 - x^2) = x^2 + (1 - x^2)^2 = x^2 + (1 - 2x^2 + x^4)$$

$$f(x, 1 - x^2) = x^4 - x^2 + 1$$

Definim la funció d'una sola variable:
$$\\varphi(x) = x^4 - x^2 + 1$$

### 2. Càlcul dels punts crítics
Busquem els punts on la derivada de $\\varphi(x)$ s'anul·la:

$$\\varphi'(x) = 4x^3 - 2x = 0$$

$$2x(2x^2 - 1) = 0$$

Això ens dona tres solucions per a $x$:
1. $x = 0$
2. $2x^2 = 1 \\implies x^2 = 1/2 \\implies x = \\pm \\frac{1}{\\sqrt{2}} = \\pm \\frac{\\sqrt{2}}{2}$

### 3. Classificació dels extrems
Utilitzem el criteri de la segona derivada:
$$\\varphi''(x) = 12x^2 - 2$$

*   **Per a $x = 0$**:
    $\\varphi''(0) = -2 < 0 \\implies$ **Màxim relatiu** en $x=0$.
*   **Per a $x = \\pm \\frac{\\sqrt{2}}{2}$**:
    $\\varphi''\\left(\\pm \\frac{\\sqrt{2}}{2}\\right) = 12\\left(\\frac{1}{2}\\right) - 2 = 6 - 2 = 4 > 0 \\implies$ **Mínims relatius** en $x = \\pm \\frac{\\sqrt{2}}{2}$.

### 4. Tornem a la dimensió 2
Trobem el valor de $y$ per a cada punt crític usant $y = 1 - x^2$:

1.  Si **$x = 0$** $\\implies y = 1 - 0 = 1$.
    Punt **$(0, 1)$**: **Màxim condicionat**.
2.  Si **$x = \\frac{\\sqrt{2}}{2}$** $\\implies y = 1 - 1/2 = 1/2$.
    Punt **$(\\frac{\\sqrt{2}}{2}, 1/2)$**: **Mínim condicionat**.
3.  Si **$x = -\\frac{\\sqrt{2}}{2}$** $\\implies y = 1 - 1/2 = 1/2$.
    Punt **$(-\\frac{\\sqrt{2}}{2}, 1/2)$**: **Mínim condicionat**.`,
  availableLanguages: ['ca']
};
