import type { Solution } from '../../../solutions';

export const ex9_9: Solution = {
  id: 'M2-T9-Ex9',
  title: 'Exercici 9: Punt de sella amb Hessian nul',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Comproveu que $(0,0)$ és un punt de sella de la funció $f(x,y) = (x^2 + (y-1)^2 - 1) (x^2 - 2y)$.`,
  content: `### 1. Comprovació de punt crític
Primer, simplifiquem lleugerament l'expressió de la funció:

$$f(x,y) = (x^2 + y^2 - 2y + 1 - 1)(x^2 - 2y) = (x^2 + y^2 - 2y)(x^2 - 2y)$$

Calculem les derivades parcials de primer ordre:
*   $\\frac{\\partial f}{\\partial x} = 2x(x^2 - 2y) + (x^2 + y^2 - 2y)(2x) = 2x (2x^2 + y^2 - 4y)$
*   $\\frac{\\partial f}{\\partial y} = (2y - 2)(x^2 - 2y) + (x^2 + y^2 - 2y)(-2)$

Avaluem en $(0,0)$:
*   $\\frac{\\partial f}{\\partial x}(0,0) = 2(0)(0) = 0$
*   $\\frac{\\partial f}{\\partial y}(0,0) = (-2)(0) + (0)(-2) = 0$

Per tant, **$(0,0)$ és un punt crític**.

---

### 2. Estudi de la matriu Hessiana
Calculem les segones derivades en $(0,0)$:
*   $\\frac{\\partial^2 f}{\\partial x^2} = 2(2x^2 + y^2 - 4y) + 2x(4x) = 12x^2 + 2y^2 - 8y \\implies f_{xx}(0,0) = 0$
*   $\\frac{\\partial^2 f}{\\partial y^2} = \\frac{\\partial}{\\partial y} [ 2yx^2 - 6y^2 - 4x^2 + 8y ] = 2x^2 - 12y + 8 \\implies f_{yy}(0,0) = 8$
*   $\\frac{\\partial^2 f}{\\partial y \\partial x} = \\frac{\\partial}{\\partial y} [ 4x^3 + 2xy^2 - 8xy ] = 4xy - 8x \\implies f_{xy}(0,0) = 0$

La matriu Hessiana en $(0,0)$ és:
$$H(0,0) = \\begin{pmatrix} 0 & 0 \\\\ 0 & 8 \\end{pmatrix}$$

El determinant és **$\\Delta = 0$**, per tant el criteri de la Hessiana **no és concloent**. Cal estudiar el signe de la funció prop de l'origen.

---

### 3. Estudi del signe (Criteri local)
Analitzem els factors de $f(x,y) = (x^2 + y^2 - 2y)(x^2 - 2y)$:
*   **Factor 1:** $x^2 + y^2 - 2y = 0$ és un cercle de radi 1 centrat en $(0,1)$. Prop de l'origen, aquest cercle es comporta com la paràbola $y \\approx \\frac{x^2}{2} + \\frac{x^4}{8}$.
*   **Factor 2:** $x^2 - 2y = 0$ és la paràbola $y = \\frac{x^2}{2}$.

Busquem camins que ens donin signes diferents:
1.  **Eix $x$ ($y=0$):** $f(x,0) = (x^2)(x^2) = x^4 > 0$ per a tot $x \\neq 0$.
2.  **Camí entre el cercle i la paràbola:** Triem un camí molt específic, per exemple $y = \\frac{x^2}{2} + \\frac{x^4}{16}$.
    *   Substituint en el Factor 2: $x^2 - 2(\\frac{x^2}{2} + \\frac{x^4}{16}) = -\\frac{x^4}{8}$ (negatiu).
    *   Substituint en el Factor 1: $x^2 + (\\dots)^2 - 2(\\frac{x^2}{2} + \\frac{x^4}{16}) = x^2 - x^2 - \\frac{x^4}{8} + O(x^4) \\approx \\frac{x^4}{8}$ (positiu).
    *   El producte serà $f(x, y_{camí}) \\approx (\\frac{x^4}{8})(-\\frac{x^4}{8}) = -\\frac{x^8}{64} < 0$.

Com que la funció pren valors positius ($x^4$) i valors negatius ($-x^8/64$) en qualsevol entorn de $(0,0)$, el punt és un **Punt de sella**.`,
  availableLanguages: ['ca']
};
