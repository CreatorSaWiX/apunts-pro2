import type { Solution } from '../../../solutions';

export const ex10_2: Solution = {
  id: 'M2-T10-Ex2',
  title: 'Exercici 2: Extrems condicionats (I)',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Determineu els extrems condicionats de les funcions següents:

a) $f(x,y) = x + 2y$, si $x^2 + y^2 = 5$
b) $f(x,y,z) = x^2 + y^2 + z^2$, si $\\begin{cases} x^2 + y^2 = 1 \\\\ x + y + z = 1 \\end{cases}$`,
  content: `### Apartat a) $f(x,y) = x + 2y$ amb $x^2 + y^2 = 5$

Usem el mètode dels **multiplicadors de Lagrange**. Sigui $g(x,y) = x^2 + y^2 - 5 = 0$:
$$\\nabla f = (1, 2), \\quad \\nabla g = (2x, 2y)$$
El sistema de Lagrange $\\nabla f = \\lambda \\nabla g$ ens dóna:
1. $1 = 2\\lambda x \\implies x = 1/(2\\lambda)$
2. $2 = 2\\lambda y \\implies y = 1/\\lambda$
3. $x^2 + y^2 = 5$

De (1) i (2) veiem que $y = 2x$. Substituïm a (3):
$$x^2 + (2x)^2 = 5 \\implies 5x^2 = 5 \\implies x^2 = 1 \\implies x = \\pm 1$$
- Si $x = 1 \\implies y = 2$. Punt **$(1, 2)$**. Valor: $f(1,2) = 1 + 2(2) = 5$.
- Si $x = -1 \\implies y = -2$. Punt **$(-1, -2)$**. Valor: $f(-1,-2) = -1 + 2(-2) = -5$.

**Conclusió a):** El punt $(1, 2)$ és un **màxim condicionat** i $(-1, -2)$ és un **mínim condicionat**.

---

### Apartat b) $f(x,y,z) = x^2 + y^2 + z^2$ amb restriccions

Tenim dues condicions: $g_1 = x^2 + y^2 - 1 = 0$ i $g_2 = x + y + z - 1 = 0$.
Observem que la funció $f$ es pot simplificar usant la primera restricció:
$$f(x,y,z) = (x^2 + y^2) + z^2 = 1 + z^2$$
Optimitzar $f$ és equivalent a optimitzar $z^2$. De la segona restricció tenim $z = 1 - x - y$. Per tant, volem optimitzar:
$$h(x,y) = (1 - x - y)^2 \\quad \\text{subjecte a } x^2 + y^2 = 1$$
Usem Lagrange per a $h$ amb la restricció del cercle:
$$\\nabla h = 2(1-x-y)(-1, -1), \\quad \\nabla g_1 = (2x, 2y)$$
El sistema $\\nabla h = \\mu \\nabla g_1$:
1. $-2(1-x-y) = 2\\mu x$
2. $-2(1-x-y) = 2\\mu y$
3. $x^2 + y^2 = 1$

D'aquí deduïm que $\\mu x = \\mu y$. 
- **Cas 1: $\\mu = 0$**. Llavors $1-x-y = 0 \\implies x+y=1$. Amb $x^2+y^2=1$, obtenim els punts **$(1,0,0)$** i **$(0,1,0)$**. En ambdós, $z=0$ i $f = 1+0^2 = 1$.
- **Cas 2: $x = y$**. Amb $x^2+y^2=1$, tenim $2x^2=1 \\implies x = \\pm 1/\\sqrt{2}$.
    - Si $x = y = 1/\\sqrt{2} \\implies z = 1 - \\sqrt{2}$. Valor $f = 1 + (1-\\sqrt{2})^2 = 4 - 2\\sqrt{2} \\approx 1.17$.
    - Si $x = y = -1/\\sqrt{2} \\implies z = 1 + \\sqrt{2}$. Valor $f = 1 + (1+\\sqrt{2})^2 = 4 + 2\\sqrt{2} \\approx 6.83$.

**Conclusió b):** 
- **Mínims**: $(1,0,0)$ i $(0,1,0)$ amb valor $f=1$.
- **Màxim**: $(-1/\\sqrt{2}, -1/\\sqrt{2}, 1+\\sqrt{2})$ amb valor $f=4+2\\sqrt{2}$.`,
  availableLanguages: ['ca']
};
