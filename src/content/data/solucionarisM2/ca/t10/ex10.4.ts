import type { Solution } from '../../../solutions';

export const ex10_4: Solution = {
  id: 'M2-T10-Ex4',
  title: 'Exercici 4: Extrems en un domini triangular',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Determineu els punts on la funció $f(x,y) = x^2 + y^2 - xy + x + y$ pren els valors màxim i mínim absoluts en el compacte $D = \\{(x,y) \\in \\mathbb{R}^2 : x \\leq 0, y \\leq 0, x + y \\geq -3\\}$.`,
  content: `El domini $D$ és un triangle amb vèrtexs als punts $(0,0)$, $(-3,0)$ i $(0,-3)$. Segons el teorema de Weierstrass, busquem candidats a l'interior i als tres segments de la frontera.

### 1. Punts crítics a l'interior
Calculem les derivades parcials i les igualem a zero:
1. $\\frac{\\partial f}{\\partial x} = 2x - y + 1 = 0 \\implies y = 2x + 1$
2. $\\frac{\\partial f}{\\partial y} = 2y - x + 1 = 0 \\implies 2(2x + 1) - x + 1 = 0 \\implies 4x + 2 - x + 1 = 0 \\implies 3x = -3 \\implies \\mathbf{x = -1}$

$y = 2(-1) + 1 = \\mathbf{-1}$.

El punt **$(-1, -1)$** pertany a l'interior de $D$ ja que compleix totes les inequacions: $-1 \\leq 0$, $-1 \\leq 0$ i $-1-1 = -2 \\geq -3$. ✓

Valor: $f(-1, -1) = (-1)^2 + (-1)^2 - (-1)(-1) + (-1) + (-1) = 1 + 1 - 1 - 1 - 1 = \\mathbf{-1}$.

### 2. Estudi de la frontera
Analitzem els tres costats del triangle:

**A) Segment L1 ($x=0$ per a $y \\in [-3, 0]$):**
La funció es redueix a: $f(0, y) = y^2 + y$.
La seva derivada és $2y + 1 = 0 \\implies y = -1/2$.
- Candidat: $(0, -1/2)$ amb $f(0, -1/2) = (-1/2)^2 + (-1/2) = \\mathbf{-1/4}$.
- Extrems (vèrtexs): $f(0,0) = \\mathbf{0}$ i $f(0,-3) = (-3)^2 + (-3) = \\mathbf{6}$.

**B) Segment L2 ($y=0$ per a $x \\in [-3, 0]$):**
La funció es redueix a: $f(x, 0) = x^2 + x$.
La seva derivada és $2x + 1 = 0 \\implies x = -1/2$.
- Candidat: $(-1/2, 0)$ amb $f(-1/2, 0) = \\mathbf{-1/4}$.
- Extrems (vèrtexs): $f(0,0) = \\mathbf{0}$ i $f(-3,0) = (-3)^2 + (-3) = \\mathbf{6}$.

**C) Segment L3 ($x+y=-3 \\implies y = -3-x$ per a $x \\in [-3, 0]$):**
Substituïm $y$ a la funció:
$$f(x, -3-x) = x^2 + (-3-x)^2 - x(-3-x) + x + (-3-x)$$
$$= x^2 + (9 + 6x + x^2) + (3x + x^2) + x - 3 - x = 3x^2 + 9x + 6$$
Derivem: $6x + 9 = 0 \\implies x = -3/2$. Llavors $y = -3 - (-3/2) = -3/2$.
- Candidat: $(-3/2, -3/2)$ amb $f(-3/2, -3/2) = 3(-3/2)^2 + 9(-3/2) + 6 = 27/4 - 27/2 + 6 = \\mathbf{-3/4}$.
- Extrems (vèrtexs): Ja calculats ($f=6$).

### 3. Conclusió
Comparant tots els valors obtinguts:
- El **màxim absolut** és **$6$** i s'assoleix als vèrtexs **$(-3, 0)$** i **$(0, -3)$**.
- El **mínim absolut** és **$-1$** i s'assoleix al punt interior **$(-1, -1)$**.`,
  availableLanguages: ['ca']
};
