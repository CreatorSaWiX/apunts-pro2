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
Busquem on s'anul·la el gradient:
*   $\\frac{\\partial f}{\\partial x} = 2x + y + 1 = 0 \\implies y = -2x - 1$
*   $\\frac{\\partial f}{\\partial y} = 2y + x + 1 = 0$

Substituïm $y$ en la segona equació:

$2(-2x-1) + x + 1 = 0 \\implies -4x - 2 + x + 1 = 0 \\implies -3x = 1 \\implies x = -1/3$

Llavors, $y = -2(-1/3) - 1 = 2/3 - 1 = -1/3$. Punt: $\\mathbf{P(-1/3, -1/3)}$.

**2. Classificació:**
Calculem les segones derivades:
*   $\\frac{\\partial^2 f}{\\partial x^2} = 2, \\quad \\frac{\\partial^2 f}{\\partial y^2} = 2, \\quad \\frac{\\partial^2 f}{\\partial x \\partial y} = 1$

La matriu Hessiana és:
$$H(-1/3, -1/3) = \\begin{pmatrix} 2 & 1 \\\\ 1 & 2 \\end{pmatrix} \\implies \\Delta = 4 - 1 = 3 > 0$$

Com que $\\Delta > 0$ i $\\frac{\\partial^2 f}{\\partial x^2} = 2 > 0$, el punt és un **Mínim relatiu**.

---

### Apartat b) $f(x,y) = \\sin x \\sin y$

**1. Punts crítics:**
*   $\\frac{\\partial f}{\\partial x} = \\cos x \\sin y = 0 \\implies \\cos x = 0 \\text{ o } \\sin y = 0$
*   $\\frac{\\partial f}{\\partial y} = \\sin x \\cos y = 0 \\implies \\sin x = 0 \\text{ o } \\cos y = 0$

Analitzant les combinacions:
*   **Tipus 1:** $\\sin x = 0$ i $\\sin y = 0 \\implies (x,y) = (n\\pi, k\\pi) \\quad \\forall n, k \\in \\mathbb{Z}$.
*   **Tipus 2:** $\\cos x = 0$ i $\\cos y = 0 \\implies (x,y) = (\\frac{\\pi}{2} + n\\pi, \\frac{\\pi}{2} + k\\pi) \\quad \\forall n, k \\in \\mathbb{Z}$.

**2. Classificació:**
Calculem les derivades segones: 

$\\frac{\\partial^2 f}{\\partial x^2} = -\\sin x \\sin y, \\quad \\frac{\\partial^2 f}{\\partial y^2} = -\\sin x \\sin y, \\quad \\frac{\\partial^2 f}{\\partial x \\partial y} = \\cos x \\cos y$.

*   **Tipus 1:** En punts $(n\\pi, k\\pi)$, tenim $\\sin x = \\sin y = 0$ i $\\cos x \\cos y = \\pm 1$.
    
$$
H(n\\pi, k\\pi) = \\begin{pmatrix} 0 & \\pm 1 \\\\ \\pm 1 & 0 \\end{pmatrix} \\implies \\Delta = -1 < 0 \\implies \\text{Punts de sella.}
$$

*   **Tipus 2:** En punts $(\\frac{\\pi}{2} + n\\pi, \\frac{\\pi}{2} + k\\pi)$, tenim $\\cos x = \\cos y = 0$ i $\\sin x \\sin y = \\pm 1$.
    
$$
H = \\begin{pmatrix} -\\sin x \\sin y & 0 \\\\ 0 & -\\sin x \\sin y \\end{pmatrix} \\implies \\Delta = (-\\sin x \\sin y)^2 = 1 > 0
$$

*   Si $\\sin x \\sin y = 1 \\implies \\frac{\\partial^2 f}{\\partial x^2} = -1 < 0 \\implies$ **Màxims relatius**.
*   Si $\\sin x \\sin y = -1 \\implies \\frac{\\partial^2 f}{\\partial x^2} = 1 > 0 \\implies$ **Mínims relatius**.

---

### Apartat c) $f(x,y) = \\frac{x+y}{1+x^2+y^2}$

**1. Punts crítics:**
Apliquem la regla del quocient per derivar:
*   $\\frac{\\partial f}{\\partial x} = \\frac{1+y^2-x^2-2xy}{(1+x^2+y^2)^2} = 0$
*   $\\frac{\\partial f}{\\partial y} = \\frac{1+x^2-y^2-2xy}{(1+x^2+y^2)^2} = 0$

Igualant els numeradors obtenim $y^2 - x^2 = x^2 - y^2 \\implies x^2 = y^2 \\implies y = \\pm x$.
*   Si $y=x \\implies 1 - 2x^2 = 0 \\implies x = \\pm \\frac{1}{\\sqrt{2}}$.
*   Si $y=-x \\implies 1 + 2x^2 = 0 \\implies$ No té solució real.
Punts: $\\mathbf{P_1(\\frac{1}{\\sqrt{2}}, \\frac{1}{\\sqrt{2}})}$ i $\\mathbf{P_2(-\\frac{1}{\\sqrt{2}}, -\\frac{1}{\\sqrt{2}})}$.

**2. Classificació:**
Avaluant la Hessiana (o el signe del valor de la funció):
*   $P_1$ és un **Màxim relatiu** ($f(P_1) = 1/\\sqrt{2} > 0$).
*   $P_2$ és un **Mínim relatiu** ($f(P_2) = -1/\\sqrt{2} < 0$).

---

### Apartat d) $f(x,y) = (x-1)^4 + (x-y)^4$

**1. Punt crític:**
*   $\\frac{\\partial f}{\\partial x} = 4(x-1)^3 + 4(x-y)^3 = 0$
*   $\\frac{\\partial f}{\\partial y} = -4(x-y)^3 = 0 \\implies x = y$
Substituint a la primera: $4(x-1)^3 = 0 \\implies x = 1, y = 1$. Punt: $\\mathbf{P(1,1)}$.

**2. Classificació:**

La Hessiana en $(1,1)$ és la matriu nul·la:
$$H(1,1) = \\begin{pmatrix} 0 & 0 \\\\ 0 & 0 \\end{pmatrix} \\implies \\Delta = 0$$

El criteri no és concloent. No obstant, observem que $f(x,y) = (x-1)^4 + (x-y)^4 \\geq 0$. Com que $f(1,1) = 0$, és el valor mínim. Conclusió: **Mínim relatiu**.

---

### Apartat e) $f(x,y) = x^4 + y^4 + 4xy - 2x^2 - 2y^2$

**1. Punts crítics:**
*   $\\frac{\\partial f}{\\partial x} = 4(x^3 - x + y) = 0 \\implies y = x - x^3$
*   $\\frac{\\partial f}{\\partial y} = 4(y^3 - y + x) = 0$
Solucions: $\\mathbf{(0,0), (\\sqrt{2}, -\\sqrt{2}), (-\\sqrt{2}, \\sqrt{2})}$.

**2. Classificació:**
*   **$(0,0)$:** Les derivades segones són $\\frac{\\partial^2 f}{\\partial x^2}=-4, \\frac{\\partial^2 f}{\\partial y^2}=-4, \\frac{\\partial^2 f}{\\partial x \\partial y}=4$.

    $$
    H(0,0) = \\begin{pmatrix} -4 & 4 \\\\ 4 & -4 \\end{pmatrix} \\implies \\Delta = 0
    $$

    Analitzant eixos: $f(x,0) = x^4-2x^2 < 0$ prop de l'origen, però $f(x,x) = 2x^4 > 0$. És un **Punt de sella**.
*   **$(\\pm\\sqrt{2}, \\mp\\sqrt{2})$:** Tenim $\\frac{\\partial^2 f}{\\partial x^2} = 20, \\frac{\\partial^2 f}{\\partial y^2} = 20, \\frac{\\partial^2 f}{\\partial x \\partial y} = 4$.

    $$
    H = \\begin{pmatrix} 20 & 4 \\\\ 4 & 20 \\end{pmatrix} \\implies \\Delta = 384 > 0
    $$

    Com que $\\frac{\\partial^2 f}{\\partial x^2} > 0$, són **Mínims relatius**.

---

### Apartat f) $f(x,y) = x^3 - x^2y + 3y^2$

**1. Punts crítics:**
*   $x=0, y=0$ i $x=9, y=13.5$.

**2. Classificació:**
*   **$(0,0)$:** $\\Delta = 0$. Per l'eix $x$, $f(x,0) = x^3$ (canvia de signe). **Punt de sella**.
*   **$(9, 13.5)$:** Tenim $\\frac{\\partial^2 f}{\\partial x^2} = 27, \\frac{\\partial^2 f}{\\partial y^2} = 6, \\frac{\\partial^2 f}{\\partial x \\partial y} = -18$.
    
$$
H(9, 13.5) = \\begin{pmatrix} 27 & -18 \\\\ -18 & 6 \\end{pmatrix} \\implies \\Delta = 162 - 324 = -162 < 0
$$

És un **Punt de sella**.

---

### Apartat g) $f(x,y) = xy^2 (3 - x - y) = 3xy^2 - x^2y^2 - xy^3$

**1. Punts crítics:**
Punt interior: $\\mathbf{P(0.75, 1.5)}$.

**2. Classificació de $P(0.75, 1.5)$:**

Les derivades segones són $\\frac{\\partial^2 f}{\\partial x^2} = -4.5, \\frac{\\partial^2 f}{\\partial y^2} = -3.375, \\frac{\\partial^2 f}{\\partial x \\partial y} = -2.25$.

$$
H(0.75, 1.5) = \\begin{pmatrix} -4.5 & -2.25 \\\\ -2.25 & -3.375 \\end{pmatrix} \\implies \\Delta = 10.125 > 0
$$

Com que $\\frac{\\partial^2 f}{\\partial x^2} < 0$, és un **Màxim relatiu**.`,
  availableLanguages: ['ca']
};
