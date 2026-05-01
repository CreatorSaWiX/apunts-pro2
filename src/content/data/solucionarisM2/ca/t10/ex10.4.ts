import type { Solution } from '../../../solutions';

export const ex10_4: Solution = {
  id: 'M2-T10-Ex4',
  title: 'Exercici 4: Extrems en un domini triangular',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Determineu els punts on la funció $f(x,y) = x^2 + y^2 - xy + x + y$ pren els valors màxim i mínim absoluts en el compacte $D = \\{(x,y) \\in \\mathbb{R}^2 : x \\leq 0, y \\leq 0, x + y \\geq -3\\}$.`,
  content: `El domini $D$ és un triangle amb vèrtexs a $(0,0)$, $(-3,0)$ i $(0,-3)$. Busquem candidats a l'interior i als tres costats de la frontera.

### 1. Punts crítics a l'interior
Calculem el gradient i l'igualem a zero:
- $\\frac{\\partial f}{\\partial x} = 2x - y + 1 = 0$
- $\\frac{\\partial f}{\\partial y} = 2y - x + 1 = 0$

Resolent el sistema obtenim $x = -1$ i $y = -1$. El punt **$(-1, -1)$** pertany a l'interior de $D$ (ja que $-1-1 = -2 > -3$).
Valor: $f(-1, -1) = 1 + 1 - 1 - 1 - 1 = -1$.

---

### 2. Estudi de la frontera
Analitzem els tres segments que formen el triangle:

**Segment L1 ($x=0$, $y \\in [-3, 0]$):**
$f(0, y) = y^2 + y$. La derivada $2y + 1 = 0$ ens dóna $y = -1/2$.
- Candidat: $(0, -1/2)$ amb $f = -1/4$.
- Vèrtexs: $f(0,0) = 0$ i $f(0,-3) = 6$.

**Segment L2 ($y=0$, $x \\in [-3, 0]$):**
$f(x, 0) = x^2 + x$. La derivada $2x + 1 = 0$ ens dóna $x = -1/2$.
- Candidat: $(-1/2, 0)$ amb $f = -1/4$.
- Vèrtexs: $f(0,0) = 0$ i $f(-3,0) = 6$.

**Segment L3 ($x+y=-3 \\implies y = -3-x$):**
Substituint $y$: $f(x, -3-x) = 3x^2 + 9x + 6$.
La derivada $6x + 9 = 0$ ens dóna $x = -3/2$, d'on $y = -3/2$.
- Candidat: $(-3/2, -3/2)$ amb $f = -3/4$.
- Vèrtexs: Ja calculats ($f=6$).

---

### 3. Conclusió
Comparant tots els valors:
- El **màxim absolut** és $6$ i s'assoleix als punts **$(-3, 0)$** i **$(0, -3)$**.
- El **mínim absolut** és $-1$ i s'assoleix al punt **$(-1, -1)$**.`,
  availableLanguages: ['ca']
};
