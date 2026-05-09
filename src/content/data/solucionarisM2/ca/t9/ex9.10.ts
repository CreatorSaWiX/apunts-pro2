import type { Solution } from '../../../solutions';

export const ex9_10: Solution = {
  id: 'M2-T9-Ex10',
  title: 'Exercici 10: Classificació de punts crítics',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Trobeu i classifiqueu els punts crítics de les funcions següents:

a) $f(x,y) = x^2 + y^2 + x + y + xy$
b) $f(x,y) = \\sin x \\sin y$
c) $f(x,y) = \\frac{x+y}{1+x^2+y^2}$
d) $f(x,y) = (x-1)^4 + (x-y)^4$
e) $f(x,y) = x^4 + y^4 + 4xy - 2x^2 - 2y^2$
f) $f(x,y) = x^3 - x^2y + 3y^2$
g) $f(x,y) = xy^2 (3 - x - y)$`,
  content: `### Apartat a) $f(x,y) = x^2 + y^2 + x + y + xy$
**1. Punts crítics:**
$\\frac{\\partial f}{\\partial x} = 2x + 1 + y = 0$
$\\frac{\\partial f}{\\partial y} = 2y + 1 + x = 0$
Resolent el sistema obtenim l'únic punt **$P(-1/3, -1/3)$**.

**2. Classificació:**
$\\Delta = f_{xx}f_{yy} - (f_{xy})^2 = (2)(2) - (1)^2 = 3 > 0$.
Com que $f_{xx} = 2 > 0$, el punt és un **Mínim relatiu**.

---

### Apartat b) $f(x,y) = \\sin x \\sin y$
**1. Punts crítics:**
$\\cos x \\sin y = 0$ i $\\sin x \\cos y = 0$.
*   **Punts tipus $(n\\pi, k\\pi)$:** $\\Delta = -1 < 0 \\implies$ **Punts de sella**.
*   **Punts tipus $(\\pi/2 + n\\pi, \\pi/2 + k\\pi)$:** $\\Delta = 1 > 0$.
    *   Si $\\sin x \\sin y = 1 \\implies$ **Màxims** (p. ex. $(\\pi/2, \\pi/2)$).
    *   Si $\\sin x \\sin y = -1 \\implies$ **Mínims** (p. ex. $(\\pi/2, 3\\pi/2)$).

---

### Apartat c) $f(x,y) = \\frac{x+y}{1+x^2+y^2}$
**1. Punts crítics:**
Derivant i igualant a zero obtenim $x^2 = y^2$.
*   $y = x \\implies 2x^2 = 1 \\implies x = \\pm \\frac{1}{\\sqrt{2}}$.
*   $y = -x \\implies -2x^2 = 1$ (Sense solució real).

**2. Classificació:**
*   **$P_1(\\frac{1}{\\sqrt{2}}, \\frac{1}{\\sqrt{2}})$:** Valor $f = \\frac{1}{\\sqrt{2}} > 0$. És un **Màxim relatiu**.
*   **$P_2(-\\frac{1}{\\sqrt{2}}, -\\frac{1}{\\sqrt{2}})$:** Valor $f = -\\frac{1}{\\sqrt{2}} < 0$. És un **Mínim relatiu**.

---

### Apartat d) $f(x,y) = (x-1)^4 + (x-y)^4$
**1. Punt crític:**
L'únic punt on s'anul·la el gradient és **$P(1,1)$**.

**2. Classificació (Hessian nul):**
$\\Delta = 0$. No obstant, observem que $f(x,y) = (x-1)^4 + (x-y)^4 \\geq 0$ per a tot $(x,y)$ i $f(1,1) = 0$. Per tant, per definició, és un **Mínim relatiu** (i absolut).

---

### Apartat e) $f(x,y) = x^4 + y^4 + 4xy - 2x^2 - 2y^2$
**1. Punts crítics:**
Trobem tres punts: $(0,0)$, $(\\sqrt{2}, -\\sqrt{2})$ i $(-\\sqrt{2}, \\sqrt{2})$.

**2. Classificació:**
*   **$(0,0)$:** $\\Delta = 0$. Analitzant camins: $f(x,x) = 2x^4 > 0$ però $f(x,0) = x^4 - 2x^2 < 0$ prop de l'origen. És un **Punt de sella**.
*   **$(\\pm\\sqrt{2}, \\mp\\sqrt{2})$:** $\\Delta = 20^2 - 16 > 0$ i $f_{xx} = 20 > 0$. Són **Mínims relatius**.

---

### Apartat f) $f(x,y) = x^3 - x^2y + 3y^2$
**1. Punts crítics:**
$(0,0)$ i $(9, 13.5)$.

**2. Classificació:**
*   **$(0,0)$:** $\\Delta = 0$. L'estudi local mostra que l'eix $x$ ($f = x^3$) canvia de signe. És un **Punt de sella**.
*   **$(9, 13.5)$:** $\\Delta = -162 < 0$. És un **Punt de sella**.

---

### Apartat g) $f(x,y) = xy^2 (3 - x - y)$
**1. Punt crític interior:**
Resolent el sistema per $x,y \\neq 0$: **$P(3/4, 3/2)$**.

**2. Classificació:**
$\\Delta = 2.53 > 0$ i $f_{xx} = -4.5 < 0$. És un **Màxim relatiu**.
*Nota: Els punts dels eixos ($x=0$ o $y=0$) també són crítics amb $\\Delta=0$.*`,
  availableLanguages: ['ca']
};
