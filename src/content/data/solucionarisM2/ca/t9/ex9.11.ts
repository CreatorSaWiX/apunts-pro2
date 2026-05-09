import type { Solution } from '../../../solutions';

export const ex9_11: Solution = {
  id: 'M2-T9-Ex11',
  title: 'Exercici 11: Determinació de paràmetres i classificació d\'extrems',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Sigui $f(x,y) = e^{\\lambda x + y^2} + \\mu \\sin(x^2 + y^2)$ amb $\\lambda, \\mu \\in \\mathbb{R}$.

Determineu els valors dels paràmetres $\\lambda$ i $\\mu$ sabent que $f$ té en $(0,0)$ un extrem relatiu i que el polinomi de Taylor de segon grau de $f$ a l'origen pren el valor $6$ al punt $(1,2)$.

Amb els resultats obtinguts, quin tipus d'extrem és el punt $(0,0)$ per a $f$?`,
  content: `### 1. Determinació de $\\lambda$
Sabem que $(0,0)$ és un extrem relatiu, per tant ha de ser un punt crític ($\\%nabla f(0,0) = (0,0)$).
Calculem les derivades de primer ordre:
*   $\\frac{\\partial f}{\\partial x} = e^{\\lambda x + y^2} \\cdot \\lambda + \\mu \\cos(x^2 + y^2) \\cdot 2x$
*   $\\frac{\\partial f}{\\partial y} = e^{\\lambda x + y^2} \\cdot 2y + \\mu \\cos(x^2 + y^2) \\cdot 2y$

Avaluem en $(0,0)$:
*   $\\frac{\\partial f}{\\partial x}(0,0) = e^0 \\cdot \\lambda + 0 = \\lambda$
*   $\\frac{\\partial f}{\\partial y}(0,0) = 0 + 0 = 0$

Perquè el gradient sigui nul, s'ha de complir que **$\\lambda = 0$**.

---

### 2. Determinació de $\\mu$
Ara la funció és $f(x,y) = e^{y^2} + \\mu \\sin(x^2 + y^2)$. Calculem les derivades de segon ordre en $(0,0)$:
*   $\\frac{\\partial^2 f}{\\partial x^2} = \\frac{\\partial}{\\partial x} [2x\\mu \\cos(x^2+y^2)] = 2\\mu \\cos(x^2+y^2) - 4x^2\\mu \\sin(x^2+y^2) \\implies f_{xx}(0,0) = 2\\mu$
*   $\\frac{\\partial^2 f}{\\partial y^2} = \\frac{\\partial}{\\partial y} [2y e^{y^2} + 2y\\mu \\cos(x^2+y^2)] = 2e^{y^2} + 4y^2e^{y^2} + 2\\mu \\cos(x^2+y^2) - 4y^2\\mu \\sin(x^2+y^2) \\implies f_{yy}(0,0) = 2 + 2\\mu$
*   $\\frac{\\partial^2 f}{\\partial y \\partial x} = 0 \\implies f_{xy}(0,0) = 0$

El polinomi de Taylor de grau 2 en $(0,0)$ és:
$$P_2(x,y) = f(0,0) + \\frac{1}{2} [ f_{xx}(0,0)x^2 + 2f_{xy}(0,0)xy + f_{yy}(0,0)y^2 ]$$
Com que $f(0,0) = 1$:
$$P_2(x,y) = 1 + \\frac{1}{2} [ 2\\mu x^2 + (2 + 2\\mu) y^2 ] = 1 + \\mu x^2 + (1 + \\mu) y^2$$

Ens diuen que $P_2(1,2) = 6$:
$$1 + \\mu(1)^2 + (1 + \\mu)(2)^2 = 6$$
$$1 + \\mu + 4 + 4\\mu = 6 \\implies 5\\mu + 5 = 6 \\implies 5\\mu = 1 \\implies \\mathbf{\\mu = 1/5 = 0.2}$$

---

### 3. Classificació del punt $(0,0)$
Amb $\\lambda = 0$ i $\\mu = 0.2$, els valors de la Hessiana en $(0,0)$ són:
*   $f_{xx}(0,0) = 2(0.2) = 0.4$
*   $f_{yy}(0,0) = 2 + 2(0.2) = 2.4$
*   $f_{xy}(0,0) = 0$

Determinant de la Hessiana:
$$\\Delta = f_{xx}f_{yy} - (f_{xy})^2 = (0.4)(2.4) - 0 = 0.96 > 0$$
Com que $\\Delta > 0$ i $f_{xx} = 0.4 > 0$, el punt $(0,0)$ és un **Mínim relatiu**.`,
  availableLanguages: ['ca']
};
