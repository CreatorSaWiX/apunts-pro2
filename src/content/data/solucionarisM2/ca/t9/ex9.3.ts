import type { Solution } from '../../../solutions';

export const ex9_3: Solution = {
  id: 'M2-T9-Ex3',
  title: 'Exercici 3: Estudi d\'extrems relatius i Hessian nul',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Trobeu els extrems relatius de les funcions següents. En algun dels punts crítics, el determinant de la matriu hessiana és zero, i, per tant, cal determinar el caràcter del punt fent ús directament de les definicions de màxim, mínim o punt de sella.

a) $f(x, y) = x^3 + y^3 - 9xy + 27$

b) $f(x, y) = (x^2 - 2x + 4y^2 - 8y)^2$

c) $f(x, y) = y^2 - x^3$

d) $f(x, y) = x^2 y^2 (1 - x - y)$`,
  content: `### Apartat a) $f(x, y) = x^3 + y^3 - 9xy + 27$

**1. Punts crítics:**
*   $f_x = 3x^2 - 9y = 0 \\implies y = x^2/3$
*   $f_y = 3y^2 - 9x = 0 \\implies (x^2/3)^2 = 3x \\implies x^4 = 27x$
Les solucions són $x=0$ (llavors $y=0$) i $x=3$ (llavors $y=3$). Tenim els punts **$P_1(0,0)$** i **$P_2(3,3)$**.

**2. Matriu Hessiana:**
$$H(x,y) = \\begin{pmatrix} 6x & -9 \\\\ -9 & 6y \\end{pmatrix}, \\quad \\Delta = 36xy - 81$$

*   **$P_1(0,0)$:** $\\Delta = -81 < 0 \\implies$ **Punt de sella**.
*   **$P_2(3,3)$:** $\\Delta = 36(9) - 81 = 243 > 0$. Com que $f_{xx}(3,3) = 18 > 0$, és un **Mínim relatiu**.

---

### Apartat b) $f(x, y) = (x^2 - 2x + 4y^2 - 8y)^2$
Podem escriure la funció com $f(x,y) = g(x,y)^2$, on $g(x,y) = (x-1)^2 + 4(y-1)^2 - 5$. Notem que $f(x,y) \\geq 0$ sempre.

**1. Punts crítics:** $\\nabla f = 2g \\cdot \\nabla g = 0$.
Això passa si $g(x,y)=0$ (tots els punts de l'el·lipse $(x-1)^2 + 4(y-1)^2 = 5$) o si $\\nabla g = 0$ (punt $(1,1)$).

**2. Estudi de $(1,1)$:**
$\\Delta(1,1) = 1600 > 0$ i $f_{xx}(1,1) = -20 < 0 \\implies$ **Màxim relatiu**.

**3. Estudi de l'el·lipse $g(x,y)=0$:**
En aquests punts, la Hessiana té determinant zero. Però per la definició, com que $f(x,y) \\geq 0$ i en l'el·lipse $f=0$, tots aquests punts són **Mínims relatius** (i absoluts).

---

### Apartat c) $f(x, y) = y^2 - x^3$

**1. Punt crític:** $\\nabla f = (-3x^2, 2y) = (0,0) \\implies$ **$P(0,0)$**.

**2. Hessiana:** $H(0,0) = \\begin{pmatrix} 0 & 0 \\\\ 0 & 2 \\end{pmatrix}$. El determinant és $\\Delta = 0$.
Hem d'usar la definició. Estudiem el comportament de $f(x,y)$ a prop de $(0,0)$:
*   Si ens movem per l'eix $x$ ($y=0$), $f(x,0) = -x^3$.
*   Per a $x > 0$, $f(x,0) < 0$.
*   Per a $x < 0$, $f(x,0) > 0$.
Com que la funció canvia de signe al voltant del punt crític (on val 0), $(0,0)$ és un **Punt de sella**.

---

### Apartat d) $f(x, y) = x^2 y^2 (1 - x - y)$

Després de resoldre el sistema de derivades parcials, trobem l'únic punt crític interior: **$P(2/5, 2/5)$**.
*   Calculant la Hessiana en aquest punt, obtenim $\\Delta > 0$ i $f_{xx} < 0$.
*   Per tant, $P(2/5, 2/5)$ és un **Màxim relatiu**.
*   Els punts de les rectes $x=0$ i $y=0$ també són crítics amb $\\Delta=0$.
`,
  availableLanguages: ['ca']
};
