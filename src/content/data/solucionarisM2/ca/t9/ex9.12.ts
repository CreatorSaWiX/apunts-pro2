import type { Solution } from '../../../solutions';

export const ex9_12: Solution = {
  id: 'M2-T9-Ex12',
  title: 'Exercici 12: Estudi d\'extrems en punts no derivables',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Donada la funció $f(x,y) = \\sqrt{x^2+y^2} - xy$:

a) Trobeu els extrems relatius de $f$ a $\\mathbb{R}^2 \\setminus \\{(0,0)\\}$.
b) Analitzant l'expressió de $f$, esbrineu si $(0,0)$ és el punt d'extrem relatiu.`,
  content: `### Apartat a) Extrems relatius a $\\mathbb{R}^2 \\setminus \\{(0,0)\\}$
**1. Recerca de punts crítics:**
Calculem les derivades parcials (per $(x,y) \\neq (0,0)$):
*   $\\frac{\\partial f}{\\partial x} = \\frac{x}{\\sqrt{x^2+y^2}} - y = 0 \\implies x = y \\sqrt{x^2+y^2}$
*   $\\frac{\\partial f}{\\partial y} = \\frac{y}{\\sqrt{x^2+y^2}} - x = 0 \\implies y = x \\sqrt{x^2+y^2}$

Substituint la segona equació en la primera: $x = (x \\sqrt{x^2+y^2}) \\sqrt{x^2+y^2} = x(x^2+y^2)$.
Com que hem exclòs l'origen, podem dividir per $x$ (si $x=0 \\implies y=0$, que no pot ser).
D'aquí obtenim $x^2 + y^2 = 1$.
Substituint $x^2 + y^2 = 1$ en les equacions del gradient: $x = y \\cdot 1$ i $y = x \\cdot 1 \\implies y = x$.
Per tant: $2x^2 = 1 \\implies x = \\pm \\frac{1}{\\sqrt{2}}$.
Tenim dos punts crítics: **$P_1(1/\\sqrt{2}, 1/\\sqrt{2})$** i **$P_2(-1/\\sqrt{2}, -1/\\sqrt{2})$**.

**2. Classificació:**
Calculem les segones derivades:
*   $f_{xx} = \\frac{y^2}{(x^2+y^2)^{3/2}}$
*   $f_{yy} = \\frac{x^2}{(x^2+y^2)^{3/2}}$
*   $f_{xy} = \\frac{-xy}{(x^2+y^2)^{3/2}} - 1$

Avaluem en $P_1$ i $P_2$ (on $x^2+y^2=1$ i $xy=1/2$):
*   $f_{xx} = 1/2, \\, f_{yy} = 1/2, \\, f_{xy} = -1/2 - 1 = -3/2$.
*   $\\Delta = (1/2)(1/2) - (-3/2)^2 = 1/4 - 9/4 = -2 < 0$.
Per tant, $P_1$ i $P_2$ són **punts de sella**.

---

### Apartat b) Estudi de l'origen $(0,0)$
A l'origen la funció val $f(0,0) = 0$. Però la funció **no és derivable** en aquest punt (l'arrel no ho és). Hem d'estudiar el signe de $f(x,y) - f(0,0)$ al voltant de $(0,0)$.

Utilitzem coordenades polars ($x = r \\cos \\theta, y = r \\sin \\theta$):
$$f(r, \\theta) = \\sqrt{r^2} - r^2 \\cos \\theta \\sin \\theta = r - r^2 \\frac{\\sin(2\\theta)}{2}$$
$$f(r, \\theta) = r \\left( 1 - r \\frac{\\sin(2\\theta)}{2} \\right)$$

Prop de l'origen, $r$ és molt petit (tendint a 0). Com que $|\\frac{\\sin(2\\theta)}{2}| \\leq \\frac{1}{2}$, si triem un entorn on $r < 2$, aleshores:
$$1 - r \\frac{\\sin(2\\theta)}{2} > 1 - 2 \\cdot \\frac{1}{2} = 0$$
Per tant, en un entorn de l'origen, $f(x,y) > 0$ per a tot $(x,y) \\neq (0,0)$.

Com que $f(x,y) > f(0,0) = 0$ en un entorn de l'origen, el punt $(0,0)$ és un **Mínim relatiu**.`,
  availableLanguages: ['ca']
};
