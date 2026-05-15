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

$x = (x \\sqrt{x^2+y^2}) \\sqrt{x^2+y^2} = x(x^2+y^2)$.

Com que hem exclòs l'origen, podem dividir per $x$ (si $x=0 \\implies y=0$, que no pot ser).

$x^2 + y^2 = 1$.

$x = y \\cdot 1$ i $y = x \\cdot 1 \\implies y = x$.

$2x^2 = 1 \\implies x = \\pm \\frac{1}{\\sqrt{2}}$.

Els dos punts crítics són **$P_1(1/\\sqrt{2}, 1/\\sqrt{2})$** i **$P_2(-1/\\sqrt{2}, -1/\\sqrt{2})$**.

**2. Classificació:**
Calculem les derivades segones:
*   $\\frac{\\partial^2 f}{\\partial x^2} = \\frac{\\partial}{\\partial x} \\left( \\frac{x}{(x^2+y^2)^{1/2}} - y \\right) = \\frac{1(x^2+y^2)^{1/2} - x \\cdot \\frac{1}{2}(x^2+y^2)^{-1/2} \\cdot 2x}{x^2+y^2} = \\frac{x^2+y^2-x^2}{(x^2+y^2)^{3/2}} = \\frac{y^2}{(x^2+y^2)^{3/2}}$
*   $\\frac{\\partial^2 f}{\\partial y^2} = \\frac{x^2}{(x^2+y^2)^{3/2}}$
*   $\\frac{\\partial^2 f}{\\partial x \\partial y} = \\frac{\\partial}{\\partial y} \\left( \\frac{x}{\\sqrt{x^2+y^2}} - y \\right) = x \\cdot \\left( -\\frac{1}{2} \\right) (x^2+y^2)^{-3/2} \\cdot 2y - 1 = \\frac{-xy}{(x^2+y^2)^{3/2}} - 1$

Avaluem en $P_1$ i $P_2$ (on $x^2+y^2=1$ i $xy=1/2$):
*   $\\frac{\\partial^2 f}{\\partial x^2} = \\frac{1/2}{1} = 1/2$
*   $\\frac{\\partial^2 f}{\\partial y^2} = 1/2$
*   $\\frac{\\partial^2 f}{\\partial x \\partial y} = -1/2 - 1 = -3/2$

La matriu Hessiana és:
$$H = \\begin{pmatrix} 1/2 & -3/2 \\\\ -3/2 & 1/2 \\end{pmatrix} \\implies \\Delta = \\left(\\frac{1}{2}\\right)\\left(\\frac{1}{2}\\right) - \\left(-\\frac{3}{2}\\right)^2 = \\frac{1}{4} - \\frac{9}{4} = -2 < 0$$

Per tant, $P_1$ i $P_2$ són **punts de sella**.

---

### Apartat b) Estudi de l'origen $(0,0)$
A l'origen la funció val $f(0,0) = 0$. Atès que la funció **no és derivable** en aquest punt (l'arrel no ho és), hem de fer un estudi local del signe de la funció prop de l'origen.

**1. Estudi per camins:**
*   **Eix $y$ ($x=0$):** $f(0,y) = \\sqrt{y^2} - 0 = |y| > 0$.
*   **Eix $x$ ($y=0$):** $f(x,0) = \\sqrt{x^2} - 0 = |x| > 0$.
*   **Recta $y=x$:** $f(x,x) = \\sqrt{2x^2} - x^2 = \\sqrt{2}|x| - x^2 = |x|(\\sqrt{2} - |x|)$.
    Prop de l'origen ($|x| < \\sqrt{2}$), aquest valor és positiu ($> 0$).
*   **Recta $y=-x$:** $f(x,-x) = \\sqrt{2x^2} + x^2 = \\sqrt{2}|x| + x^2 > 0$.

Aquests camins suggereixen un mínim, però no són suficients per assegurar-ho.

**2. Estudi general per regions:**
Analitzem el signe de $f(x,y) = \\sqrt{x^2+y^2} - xy$ segons el producte $xy$:

*   **Si $xy \\leq 0$:**
    Com que $\\sqrt{x^2+y^2} > 0$ i $-xy \\geq 0$, aleshores $f(x,y) > 0$ per a tot punt diferent de l'origen.

*   **Si $xy > 0$:**
    Podem treure factor comú $xy$ (recordant que si $xy > 0$, aleshores $xy = \\sqrt{x^2y^2}$):

    $$f(x,y) = xy \\left( \\frac{\\sqrt{x^2+y^2}}{xy} - 1 \\right) = xy \\left( \\sqrt{\\frac{x^2+y^2}{x^2y^2}} - 1 \\right) = xy \\left( \\sqrt{\\frac{1}{y^2} + \\frac{1}{x^2}} - 1 \\right)$$
    
    Prop de l'origen, $x$ i $y$ són molt petits, la qual cosa fa que $\\frac{1}{x^2}$ i $\\frac{1}{y^2}$ siguin molt grans. Per tant, l'arrel serà molt més gran que 1, i el parèntesi serà positiu.

**Conclusió:**
Com que $f(x,y) > 0 = f(0,0)$ en tot un entorn de l'origen (excepte el propi punt), el punt $(0,0)$ és un **Mínim relatiu**.`,
  availableLanguages: ['ca']
};
